import React, { useEffect, useState } from "react";
import axios from "axios";
import { LinkPermissionType } from "@/stores/gnerate-reusme/project-data-store";

const Countdown = ({
  expiry,
  projectId,
  setUrlPermission,
}: {
  expiry: string | Date | null;
  projectId: string;
  setUrlPermission: (permission: LinkPermissionType) => void;
}) => {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!expiry) return;

    const expiryDate = expiry instanceof Date ? expiry : new Date(expiry);

    const interval = setInterval(() => {
      const now = new Date();
      let diff = expiryDate.getTime() - now.getTime();

      if (diff <= 0) {
        setRemaining("Expired");
        clearInterval(interval);

        // 🔒 Auto-lock link
        axios
          .post("/api/generate-html/share/edit-link-permission", {
            newPermission: "LOCKED",
            projectId,
          })
          .then((res) => {
            console.log(res);
            setUrlPermission("LOCKED" as LinkPermissionType);
          })
          .catch((err) => console.log(err));

        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * 1000 * 60 * 60 * 24;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * 1000 * 60 * 60;

      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * 1000 * 60;

      const seconds = Math.floor(diff / 1000);

      // Only show non-zero units
      const parts = [];
      if (days) parts.push(`${days}d`);
      if (hours) parts.push(`${hours}h`);
      if (minutes) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`); // always show seconds

      setRemaining(parts.join(" "));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiry, projectId, setUrlPermission]);

  return (
    <span className="text-destructive">{expiry ? remaining : "Never"}</span>
  );
};

export default Countdown;
