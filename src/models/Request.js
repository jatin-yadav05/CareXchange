import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  medicine: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true
  },
  recipientEmail: {
    type: String,
    required: [true, 'Recipient email is required'],
    ref: 'User'
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  prescription: {
    type: String,
    required: [true, 'Prescription image is required']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
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
if (mongoose.models.Request) {
  delete mongoose.models.Request;
}

const Request = mongoose.model('Request', requestSchema);

export default Request; 