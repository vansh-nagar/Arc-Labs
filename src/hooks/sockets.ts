import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  path: "/api/generate-html/sockets",
  autoConnect: false,
});

export const useSocketManager = () => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const startWebSocketConnection = (roomId: string) => {
    socket.emit("joinRoom", roomId);
  };

  return { startWebSocketConnection };
};
