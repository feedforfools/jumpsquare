"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ComingSoonProps {
  children: React.ReactNode;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  badgeColor?: string;
  className?: string;
  disabled?: boolean;
  tilt?: number;
}

export function ComingSoon({
  children,
  position = "top-right",
  badgeColor = "bg-gradient-to-r from-purple-500 to-pink-500",
  className,
  disabled = true,
  tilt = -12,
}: ComingSoonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const positionClasses = {
    "top-left": "-top-1.5 -left-2.5",
    "top-right": "-top-1.5 -right-2.5",
    "bottom-left": "-bottom-1.5 -left-2.5",
    "bottom-right": "-bottom-1.5 -right-2.5",
  };

  // Adjust tilt direction based on position for better visual balance
  const getTiltDirection = () => {
    if (position === "top-right" || position === "bottom-left") {
      return Math.abs(tilt); // Positive tilt for left side
    }
    return -Math.abs(tilt); // Negative tilt for right side
  };

  const finalTilt = getTiltDirection();

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wrapper to handle disabled state */}
      <div
        className={cn("relative", disabled && "pointer-events-none opacity-60")}
      >
        {children}
      </div>

      {/* Soon Badge */}
      <div
        className={cn(
          "absolute z-8 pointer-events-none",
          positionClasses[position]
        )}
        style={{
          transform: `rotate(${finalTilt}deg)`,
          transformOrigin: "center",
        }}
      >
        <div
          className={cn(
            "relative px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white shadow-lg",
            "transform transition-all duration-300",
            badgeColor,
            isHovered && "animate-breathing"
          )}
        >
          <span className="relative z-10">soon</span>

          {/* Glow effect on hover */}
          {isHovered && (
            <div
              className={cn(
                "absolute inset-0 rounded-full blur-md opacity-70",
                badgeColor
              )}
            />
          )}
        </div>
      </div>

      {/* Optional subtle overlay effect */}
      {disabled && (
        <div className="absolute inset-0 rounded-md bg-gray-50/5 pointer-events-none" />
      )}
    </div>
  );
}
