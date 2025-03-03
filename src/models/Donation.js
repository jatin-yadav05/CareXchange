import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  medicine: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true
  },
  donorEmail: {
    type: String,
    required: [true, 'Donor email is required'],
    ref: 'User'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'completed', 'cancelled'],
    default: 'active'
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good'],
    required: [true, 'Condition is required']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  images: [{
    type: String
  }],
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Delete existing model if it exists
if (mongoose.models.Donation) {
  delete mongoose.models.Donation;
}

const Donation = mongoose.model('Donation', donationSchema);

export default Donation; 