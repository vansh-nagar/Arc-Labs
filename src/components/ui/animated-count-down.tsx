import React, { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";

interface AnimatedNumberProps {
  duration: number;
  setPermission: (value: string) => void;
}

export const AnimatedNumber_001 = ({
  duration,
  setPermission,
}: AnimatedNumberProps) => {
  if (duration === 0) {
    return (
      <div className="relative flex grow  text-destructive flex-col items-center justify-center">
        <div className="font-bebas-neue tracking-tight text-5xl">Never</div>
      </div>
    );
  }

  const [count, setCount] = useState(duration);
  const [isExpired, setIsExpired] = useState(false);

  // countdown
  useEffect(() => {
    if (duration === 0) return;

    const id = setInterval(() => {
      setCount((c) => {
        if (c === 0) {
          setIsExpired(true);
          clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [duration]);

  // 🔥 when expired, update parent permission
  useEffect(() => {
    if (isExpired) {
      setPermission("LOCKED");
    }
  }, [isExpired, setPermission]);

  // reset when duration changes
  useEffect(() => {
    setCount(duration);
    setIsExpired(false);
  }, [duration]);

  return (
    <div className="relative flex grow text-destructive flex-col items-center justify-center">
      <div className="font-bebas-neue text-5xl tracking-tight">
        {isExpired ? "Expired" : <NumberFlow value={count} prefix="0:" />}
      </div>
    </div>
  );
};
