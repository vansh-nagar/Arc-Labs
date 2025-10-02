import { NextResponse, NextRequest } from "next/server";
import { voice, inference } from "@livekit/agents";
import * as livekit from "@livekit/agents-plugin-livekit";
import * as silero from "@livekit/agents-plugin-silero";
import { BackgroundVoiceCancellation } from "@livekit/noise-cancellation-node";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const roomName = body.room;
    const participantName = "user";
    const participantIdentity = `voice_assistant_user_${Math.floor(
      Math.random() * 10_000
    )}`;

    const token = await createParticipantToken(
      roomName,
      participantName,
      participantIdentity
    );

    const data: any = {
      serverUrl: process.env.LIVEKIT_URL!,
      roomName,
      token,
      participantName,
    };

    const headers = new Headers({
      "Cache-Control": "no-store",
    });

    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error("Error starting interview session:", error);
    return NextResponse.json(
      { error: "Failed to start interview session" },
      { status: 500 }
    );
  }
}

function createParticipantToken(
  roomName: string,
  participantName: string,
  participantIdentity: string
) {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity: participantIdentity,
    }
  );

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  });

  return at.toJwt();
}
