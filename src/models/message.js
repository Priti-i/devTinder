const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true // Indexing for fast retrieval of message history
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);