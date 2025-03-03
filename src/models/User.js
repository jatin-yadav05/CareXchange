import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define roles as a separate schema for better validation
const roleSchema = {
  values: ['donor', 'recipient', 'admin'],
  message: '{VALUE} is not a valid role. Must be donor, recipient, or admin'
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  image: {
    type: String
  },
  role: {
    type: String,
    enum: ['donor', 'recipient', 'admin'],
    default: 'recipient'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  lastLogin: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Add any indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Hash password before saving (only if password is being modified and not already hashed)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.password.startsWith('$2')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Delete existing model if it exists
if (mongoose.models.User) {
  delete mongoose.models.User;
}

// Create new model with updated schema
const User = mongoose.model('User', userSchema);

export default User; 