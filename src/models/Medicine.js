import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Pain Relief',
      'Antibiotics',
      'Cardiovascular',
      'Diabetes',
      'Respiratory',
      'Gastrointestinal',
      'Mental Health',
      'Vitamins & Supplements',
      'First Aid',
      'Other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['new', 'like-new', 'good'],
    default: 'new'
  },
  originalPrice: {
    type: Number,
    required: false,
    min: [0, 'Price cannot be negative']
  },
  isFree: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String,
    required: false
  }],
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'donated', 'expired'],
    default: 'available'
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Donor is required']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  prescriptionRequired: {
    type: Boolean,
    default: false
  },
  prescriptionImage: {
    type: String,
    required: false
  },
  packaging: {
    type: String,
    enum: ['sealed', 'opened', 'partial'],
    required: [true, 'Packaging information is required']
  },
  storageInstructions: {
    type: String,
    required: false
  },
  dosageForm: {
    type: String,
    required: [true, 'Dosage form is required'],
    enum: [
      'tablet',
      'capsule',
      'liquid',
      'injection',
      'cream',
      'ointment',
      'drops',
      'inhaler',
      'powder',
      'other'
    ]
  },
  strength: {
    type: String,
    required: [true, 'Medicine strength is required'],
    trim: true
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer name is required'],
    trim: true
  },
  batchNumber: {
    type: String,
    required: false,
    trim: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  notes: {
    type: String,
    required: false,
    trim: true
  },
  ratings: [ratingSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if medicine is expired
medicineSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Virtual for remaining quantity
medicineSchema.virtual('remainingQuantity').get(function() {
  return this.status === 'available' ? this.quantity : 0;
});

// Virtual for trust score
medicineSchema.virtual('trustScore').get(function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
  return parseFloat((sum / this.ratings.length).toFixed(1));
});

// Index for efficient queries
medicineSchema.index({ name: 'text', description: 'text' });
medicineSchema.index({ category: 1, status: 1 });
medicineSchema.index({ location: 1 });
medicineSchema.index({ expiryDate: 1 });

// Middleware to check expiry before saving
medicineSchema.pre('save', function(next) {
  if (this.expiryDate < new Date()) {
    this.status = 'expired';
  }
  next();
});

// Static method to find available medicines
medicineSchema.statics.findAvailable = function() {
  return this.find({
    status: 'available',
    expiryDate: { $gt: new Date() }
  });
};

// Static method to find medicines by category
medicineSchema.statics.findByCategory = function(category) {
  return this.find({
    category,
    status: 'available',
    expiryDate: { $gt: new Date() }
  });
};

// Static method to find medicines by donor
medicineSchema.statics.findByDonor = function(donorId) {
  return this.find({ donor: donorId });
};

// Instance method to mark as donated
medicineSchema.methods.markAsDonated = function(recipientId) {
  this.status = 'donated';
  this.recipient = recipientId;
  return this.save();
};

const Medicine = mongoose.models.Medicine || mongoose.model('Medicine', medicineSchema);

export default Medicine; 