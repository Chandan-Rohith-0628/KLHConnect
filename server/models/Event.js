import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  fullDescription: {
    type: String,
    maxlength: [2000, 'Full description cannot be more than 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date']
  },
  time: {
    type: String,
    required: [true, 'Please provide event time']
  },
  endTime: {
    type: String
  },
  venue: {
    type: String,
    required: [true, 'Please provide event venue']
  },
  category: {
    type: String,
    enum: ['Technical', 'Cultural', 'Sports', 'Academic', 'Workshop'],
    required: [true, 'Please provide event category']
  },
  poster: {
    type: String,
    default: ''
  },
  organizer: {
    type: String,
    required: [true, 'Please provide organizer name']
  },
  organizerContact: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email']
  },
  eligibility: {
    type: String,
    default: 'Open to all students'
  },
  prerequisites: {
    type: String
  },
  maxCapacity: {
    type: Number,
    required: [true, 'Please provide maximum capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  registrationDeadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  tags: [{
    type: String
  }],
  registeredUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    registrationData: {
      name: String,
      email: String,
      phone: String,
      department: String,
      year: String
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for searching
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for registered count
eventSchema.virtual('registeredCount').get(function() {
  return this.registeredUsers.length;
});

// Check if event is full
eventSchema.methods.isFull = function() {
  return this.registeredUsers.length >= this.maxCapacity;
};

const Event = mongoose.model('Event', eventSchema);

export default Event;
