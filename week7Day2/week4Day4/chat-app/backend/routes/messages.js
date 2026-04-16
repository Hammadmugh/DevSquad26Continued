const { Router } = require("express");
const { messages, nextId } = require("../data/store");

const router = Router();

// Injected by app.js so the route can broadcast via Socket.IO
let _io = null;
const setIo = (io) => { _io = io; };

router.get("/:roomId", (req, res) => {
  const { roomId } = req.params;
  if (!messages[roomId]) return res.status(404).json({ error: "Room not found" });
  res.json(messages[roomId]);
});

router.post("/", (req, res) => {
  const { roomId, username, text } = req.body;

  if (!roomId || !username || !text || !text.trim()) {
    return res.status(400).json({ error: "roomId, username, and text are required" });
  }
  if (username.length < 2 || username.length > 20) {
    return res.status(400).json({ error: "Username must be 2–20 characters" });
  }
  if (!messages[roomId]) {
    return res.status(404).json({ error: "Room not found" });
  }

  const message = {
    id: nextId(),
    roomId,
    username,
    text: text.trim(),
    timestamp: new Date().toISOString(),
  };

  messages[roomId].push(message);
  if (_io) _io.to(roomId).emit("receive_message", message);

  res.status(201).json(message);
});

// DELETE /api/messages/:roomId/:messageId
// Only the original author can delete their own message
router.delete("/:roomId/:messageId", (req, res) => {
  const { roomId, messageId } = req.params;
  const { username } = req.body;

  if (!messages[roomId]) return res.status(404).json({ error: "Room not found" });

  const idx = messages[roomId].findIndex((m) => m.id === Number(messageId));
  if (idx === -1) return res.status(404).json({ error: "Message not found" });

  const message = messages[roomId][idx];
  if (message.username !== username) {
    return res.status(403).json({ error: "You can only delete your own messages" });
  }

  messages[roomId].splice(idx, 1);
  if (_io) _io.to(roomId).emit("message_deleted", { roomId, messageId: Number(messageId) });

  res.status(200).json({ success: true });
});

module.exports = { router, setIo };
