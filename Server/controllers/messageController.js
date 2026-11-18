import Message from "../models/Message.js";
import User from "../models/User.js";

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id },
      ],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: -1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await User.find({
      _id: { $ne: req.user.id },
      role: { $in: ["patient", "doctor"] },
    }).select("name email role phone");

    res.json({ contacts });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, subject, message } = req.body;

    if (!receiverId || !message?.trim()) {
      return res.status(400).json({
        message: "Receiver and message are required",
      });
    }

    const receiver = await User.findOne({
      _id: receiverId,
      role: { $in: ["patient", "doctor"] },
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      subject: subject || "",
      message: message.trim(),
    });

    const populatedMessage = await Message.findById(
      newMessage._id
    )
      .populate("sender", "name email role")
      .populate("receiver", "name email role");

    res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      receiver: req.user.id,
    });

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    message.read = true;
    await message.save();

    res.json({
      message: "Message marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getMessages,
  getContacts,
  sendMessage,
  markAsRead,
};