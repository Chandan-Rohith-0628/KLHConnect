import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide announcement title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide announcement content'],
    maxlength: [2000, 'Content cannot be more than 2000 characters']
  },
  type: {
    type: String,
    enum: ['emergency', 'placement', 'exam', 'hostel', 'general'],
    required: [true, 'Please provide announcement type'],
    default: 'general'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'faculty', 'specific'],
    default: 'all'
  },
  specificDepartments: [{
    type: String,
    enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'OTHER']
  }],
  specificYears: [{
    type: Number,
    min: 1,
    max: 4
  }],
  attachments: [{
    name: String,
    url: String
  }],
  expiresAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for searching
announcementSchema.index({ title: 'text', content: 'text' });

// Auto-deactivate expired announcements
announcementSchema.pre('find', function() {
  this.where({ 
    $or: [
      { expiresAt: { $gte: new Date() } },
      { expiresAt: null }
    ]
  });
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
