const express = require("express");
const Chatrouter = express.Router();
const Chat = require("../models/conversation");
const Message = require("../models/Message");
const ConnectionRequest = require("../models/ConnectionRequest");
const { userAuth } = require("../middlewares/auth");
/**
 * GET /chat/connections
 * Get list of all accepted connection users (matches) that the current user can chat with
 */

/**
 * GET /chat/:targetUserId
 * Retrieve the existing chat room, or initialize a new one if it doesn't exist yet
 */

Chatrouter.get("/chat/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        
        // Find all accepted connection requests where logged-in user is sender or receiver
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        })
        .populate("fromUserId", "firstName lastName profileUrl About")
        .populate("toUserId", "firstName lastName profileUrl About");
        // Map through connections to return only the target connection user details
        const connectionUsers = connections.map((conn) => {
            if (conn.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return conn.toUserId;
            }
            return conn.fromUserId;
        });
        res.status(200).json(connectionUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
Chatrouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const targetUserId = req.params.targetUserId;

        // 1. Verify connection request status is accepted
        const isConnected = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                { fromUserId: targetUserId, toUserId: userId, status: "accepted" }
            ]
        });

        if (!isConnected) {
            return res.status(400).json({ message: "You are not connected with this user" });
        }

        // 2. Find existing chat or create a new one
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        });

        if (!chat) {
            // <-- FIX: Pass isConnected._id as connectionId
            chat = new Chat({
                participants: [userId, targetUserId],
                connectionId: isConnected._id 
            });
            await chat.save();
        }

        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
/**
 * GET /chat/messages/:chatId
 * Get historical messages for a chat room
 */
Chatrouter.get("/chat/messages/:chatId", userAuth, async (req, res) => {
    try {
        const { chatId } = req.params;
        
        // Fetch up to 50 messages, ordered chronologically
       const messages = await Message.find({ conversationId: chatId })
             .sort({ createdAt: 1 })
             .limit(50);
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Chatrouter.delete("delete/chat:chatId",userAuth,async(req,res)=>{
    try{

    const {chatId}=req.params;
    await Message.deleteMany({conversationId:chatId});
    res.send(200).json({
         success:true,
        message:"chat delete successfully"
       
    });
}catch(error)
{
    res.status(500).json({error:error.message});
}
})

module.exports = Chatrouter;
