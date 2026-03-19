const express = require("express");
const cors = require("cors");
const { corsOptions } = require("./config/cors");
const roomsRouter = require("./routes/rooms");
const { router: messagesRouter, setIo } = require("./routes/messages");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/rooms", roomsRouter);
app.use("/api/messages", messagesRouter);

module.exports = { app, setIo };
