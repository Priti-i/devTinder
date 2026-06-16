const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
  {
    // References to the two users chatting
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      }
    ],
    // Link to the connection that authorized this chat
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'connectionRequest',
      required: true,
      unique: true // One conversation per accepted connection
    },
    // Reference to the latest message for quick inbox rendering
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    // Track unread messages per participant
    unreadCount: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        count: { type: Number, default: 0 }
      }
    ]
  },
  { timestamps: true } // auto-generates createdAt and updatedAt
);

// Indexing participants for rapid retrieval when fetching a user's conversations
ConversationSchema.index({ participants: 1 });

module.exports = mongoose.model('Conversation', ConversationSchema);