"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useSidebarStore } from "@/stores/sidebarStore";

const Page = () => {
  const [Room, setRoom] = useState(null);
  const { isSideBarOpen } = useSidebarStore();

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load("/3d-models/interview-cabin.glb", (gltf: any) => {
      const model = gltf.scene.children[1];
      setRoom(gltf.scene);
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
      <Canvas
        camera={{ position: [-Math.PI, 1, 0] }}
        className="  h-full w-full rounded-md shadow"
      >
        <OrbitControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <Suspense fallback={null}>
          {Room && <primitive object={Room} rotation={[0, -Math.PI / 2, 0]} />}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Page;
