import { NextRequest, NextResponse } from "next/server";
import { Server } from "socket.io";

export const runtime = "nodejs";

let io: Server | undefined;

export async function GET() {
  return NextResponse.json({ message: "WebSocket route is active." });
}

export async function POST(req: NextRequest) {
  if (!io) {
    const server: any = (req as any).socket.server;
    if (!server) throw new Error("Need a shared HTTP server");

    io = new Server(server, { path: "/api/generate-html/sockets" });

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`Client ${socket.id} joined room ${roomId}`);
      });
    });
  }

  return NextResponse.json({ message: "WebSocket server initialized." });
}
