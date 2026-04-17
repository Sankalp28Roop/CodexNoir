const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    default: '',
    maxlength: [50000, 'Content cannot exceed 50000 characters']
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  pinned: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#ffffff'
  },
  reminder: {
    type: Date,
    default: null
  },
  isTask: {
    type: Boolean,
    default: false
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  linkedNotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  tags: [{
    type: String
  }],
  version: {
    type: Number,
    default: 1
  },
  history: [{
    content: String,
    savedAt: Date
  }],
  intent: {
    type: String,
    default: 'note',
    enum: ['note', 'idea', 'study', 'task', 'thought', 'goal']
  },
  // New fields
  notebookId: {
    type: String,
    default: null
  },
  publicLink: {
    type: String,
    default: null
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    email: String,
    role: { type: String, enum: ['view', 'comment', 'edit'], default: 'view' }
  }],
  comments: [{
    text: String,
    author: String,
    createdAt: { type: Date, default: Date.now }
  }],
  metadata: {
    wordCount: { type: Number, default: 0 },
    readTime: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  // Auto-calculate word count
  if (this.content) {
    this.metadata.wordCount = this.content.split(/\s+/).filter(w => w).length;
    this.metadata.readTime = Math.ceil(this.metadata.wordCount / 200);
  }
  next();
});

module.exports = mongoose.model('Note', noteSchema);