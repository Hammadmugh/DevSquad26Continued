const rooms = [
  { id: "general", name: "General", description: "General chat for everyone" },
  { id: "tech", name: "Tech Talk", description: "Discuss technology topics" },
  { id: "random", name: "Random", description: "Off-topic conversations" },
];

// { [roomId]: [{ id, roomId, username, text, timestamp }] }
const messages = { general: [], tech: [], random: [] };

let messageIdCounter = 1;

const nextId = () => messageIdCounter++;

module.exports = { rooms, messages, nextId };
