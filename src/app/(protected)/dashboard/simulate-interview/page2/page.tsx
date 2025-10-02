"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useSidebarStore } from "@/stores/sidebarStore";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import AIChat from "@/components/pages/dashboard/simulate-interview/page2/ai-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Room, createLocalAudioTrack } from "livekit-client";

const Page = () => {
  const [Room3d, setRoom3d] = useState(null);
  const { isSideBarOpen } = useSidebarStore();

  const [RoomName, setRoomName] = useState("");
  const startInterview = async () => {
    try {
      const res = await axios.post("/api/simulate-interview/start-session", {
        room: RoomName,
      });

      console.log("Received token:", res.data);

      const room = new Room();

      const serverUrl = res.data.serverUrl;
      const token = res.data.token;

      await room.connect(serverUrl, token);

      const audioTrack = await createLocalAudioTrack();
      await room.localParticipant.publishTrack(audioTrack);

      room.on("trackSubscribed", (track, publication, participant) => {
        console.log("Track subscribed:", track, publication, participant);
        if (track.kind === "audio") {
          // Create an HTML audio element
          const audioEl = document.createElement("audio");
          audioEl.autoplay = true; // play automatically
          audioEl.srcObject = new MediaStream([track.mediaStreamTrack]);
          document.body.appendChild(audioEl); // optional: append to body
        }
      });

      const playAudio = (track: any) => {
        if (track.kind === "audio") {
          const audioEl = document.createElement("audio");
          audioEl.autoplay = true;
          audioEl.srcObject = new MediaStream([track.mediaStreamTrack]);
          document.body.appendChild(audioEl);
        }
      };

      console.log("Connected to LiveKit room:", room.name);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load("/3d-models/interview-cabin.glb", (gltf: any) => {
      const model = gltf.scene.children[1];
      setRoom3d(gltf.scene);
    });
  }, []);

  return (
    <div
      className={`${
        isSideBarOpen
          ? "dashboard-content-sidebar-open"
          : "dashboard-content-sidebar-close"
      }  h-[calc(100vh-64px)] `}
    >
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full relative"
      >
        <ResizablePanel defaultSize={75} className="pr-4">
          <Button onClick={startInterview}>Start Interview</Button>
          <Input
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="room name"
          ></Input>

          <Canvas
            camera={{ position: [-Math.PI, 1, 0] }}
            className="  h-full w-full rounded-md shadow"
          >
            <OrbitControls />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />

            <Suspense fallback={null}>
              {Room3d && (
                <primitive object={Room3d} rotation={[0, -Math.PI / 2, 0]} />
              )}
            </Suspense>
          </Canvas>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <AIChat />
      </ResizablePanelGroup>
    </div>
  );
};

export default Page;
