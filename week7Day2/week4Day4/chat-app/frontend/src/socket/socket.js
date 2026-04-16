import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://devsquad26continued.onrender.com";

const socket = io(SOCKET_URL, { autoConnect: false });

export default socket;
