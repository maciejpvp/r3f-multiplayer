import { Server, Socket } from "socket.io";
import { players } from "../store/Players";

export function registerSocketHandlers(io: Server, socket: Socket) {
  console.log(`Player connected: ${socket.id}`);

  players[socket.id] = {
    id: socket.id,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  };

  socket.emit("currentPlayers", players);

  socket.broadcast.emit("newPlayer", players[socket.id]);

  socket.on(
    "updateState",
    (data: {
      position: [number, number, number];
      rotation: [number, number, number];
    }) => {
      if (players[socket.id]) {
        players[socket.id].position = data.position;
        players[socket.id].rotation = data.rotation;
        socket.broadcast.emit("playerMoved", players[socket.id]);
      }
    },
  );

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
    socket.broadcast.emit("playerDisconnected", socket.id);
  });
}
