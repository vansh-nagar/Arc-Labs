"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Side_bar from "@/components/pages/dashboard/sidebar/sidebar";
import Top_bar from "@/components/pages/dashboard/topbar/top-bar";
import { Providers } from "@/components/pages/session-provider";
import { useSidebarStore } from "@/stores/sidebarStore";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean); // ["dashboard","generate-resume","page1"]
    let pageLabel = "Dashboard";

    if (segments[0] === "dashboard" && segments.length > 1) {
      const segmentAfterDashboard = segments[1]; // "generate-resume"
      pageLabel = segmentAfterDashboard
        .replace(/[-_]/g, " ") // replace dashes/underscores with spaces
        .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize words
    }

    setCurrentPage(pageLabel);
  }, [pathname, setCurrentPage]);

  return (
    <div className="flex">
      <Side_bar />
      <div className="flex-1">
        <Top_bar />
        <Providers>{children}</Providers>
      </div>
    </div>
  );
}
