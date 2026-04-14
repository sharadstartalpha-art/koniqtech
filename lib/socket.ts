import { Server } from "socket.io";

let io: Server;

export function initSocket(server: any) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("⚡ client connected:", socket.id);

      socket.on("join-team", (teamId) => {
        socket.join(teamId);
      });
    });
  }

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}