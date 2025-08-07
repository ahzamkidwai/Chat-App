import Message from "../models/message-model.js";
import Chat from "../models/chat-model.js";

// 📩 Send a message
// export const sendMessage = async (req, res) => {
//   try {
//     const {
//       senderId,
//       receiverId,
//       content,
//       messageType = "text",
//       mediaUrl,
//     } = req.body;

//     // Create message
//     const message = await Message.create({
//       sender: senderId,
//       receiver: receiverId,
//       content,
//       messageType,
//       mediaUrl,
//     });

//     // Check for existing chat between sender and receiver
//     let chat = await Chat.findOne({
//       participants: { $all: [senderId, receiverId], $size: 2 },
//     });

//     // If no chat exists, create one
//     if (!chat) {
//       chat = await Chat.create({
//         participants: [senderId, receiverId],
//         lastMessage: message._id,
//       });
//     } else {
//       chat.lastMessage = message._id;
//       chat.updatedAt = new Date();
//       await chat.save();
//     }

//     res.status(201).json({ message, chatId: chat._id });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const sendMessage = async (req, res) => {
  try {
    const {
      senderId,
      receiverId,
      content,
      messageType = "text",
      mediaUrl,
    } = req.body;

    // Create message
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      messageType,
      mediaUrl,
    });

    // Check for existing chat
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId],
        lastMessage: message._id,
      });
    } else {
      chat.lastMessage = message._id;
      chat.updatedAt = new Date();
      await chat.save();
    }

    // Emit real-time message using socket.io
    const io = req.app.get("io");

    // Replace with userMap if you use socket ids mapped to phone numbers
    const usersMap = global.usersMap; // <-- more on this below

    const receiverSocketId = usersMap?.get?.(receiverId);
    if (receiverSocketId && io) {
      io.to(receiverSocketId).emit("private-message", {
        message,
        senderId,
        chatId: chat._id,
      });
    }

    res.status(201).json({ message, chatId: chat._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 💬 Get all messages of a chat
export const getMessagesByChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          sender: { $in: chatId.participants },
          receiver: { $in: chatId.participants },
        },
      ],
    }).sort({ sentAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 Get user chats
export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ participants: userId })
      .populate("lastMessage")
      .populate("participants", "fullName phoneNumber profilePhoto");

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Mark a message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const updated = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📬 Get all messages between two users
export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { userA, userB } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userA, receiver: userB },
        { sender: userB, receiver: userA },
      ],
    }).sort({ sentAt: 1 }); // ascending by time

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
