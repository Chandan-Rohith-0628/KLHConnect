import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide item title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide item description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    enum: ['Electronics', 'Books', 'Accessories', 'ID Cards', 'Clothing', 'Other'],
    required: [true, 'Please provide item category']
  },
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: [true, 'Please specify if item is lost or found']
  },
  location: {
    type: String,
    required: [true, 'Please provide location']
  },
  date: {
    type: Date,
    required: [true, 'Please provide date'],
    default: Date.now
  },
  images: [{
    type: String
  }],
  contactName: {
    type: String,
    required: [true, 'Please provide contact name']
  },
  contactPhone: {
    type: String,
    required: [true, 'Please provide contact phone'],
    match: [/^[0-9]{10}$/, 'Please provide a valid phone number']
  },
  contactEmail: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email']
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'resolved'],
    default: 'active'
  },
  claims: [{
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    claimedAt: {
      type: Date,
      default: Date.now
    }
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for searching
lostFoundSchema.index({ title: 'text', description: 'text', location: 'text' });

const LostFound = mongoose.model('LostFound', lostFoundSchema);

export default LostFound;
