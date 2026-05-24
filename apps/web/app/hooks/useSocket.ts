"use client";
import { useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { Socket } from "socket.io-client";

interface UseSocketReturn {
  socket: Socket;
  isConnected: boolean;
}

export const useSocket = (): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  return { socket, isConnected };
};
