const ChatMessage = require("../models/chatMessageModel");

// Save a chat message (if persisting messages)
const saveMessage = async (req, res) => {
    const { message, userId } = req.body;
    if (!message || !userId) {
        return res.status(400).json({ message: "Missing message or userId" });
    }
    const chatMessage = await ChatMessage.create({
        message,
        user: userId,
    });
    res.status(201).json(chatMessage);
};

// Retrieve chat history (optional for frontend chat load)
const getMessages = async (req, res) => {
    const messages = await ChatMessage.find()
        .populate("user", "name email")
        .sort({ timestamp: 1 });
    res.json(messages);
};

module.exports = { saveMessage, getMessages };
