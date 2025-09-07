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
  size?: "xs" | "sm" | "md" | "lg";
}

export function ComingSoon({
  children,
  position = "top-right",
  badgeColor = "bg-main",
  className,
  disabled = true,
  tilt = -12,
  size = "xs",
}: ComingSoonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const positionClasses = {
    "top-left": "-top-1.5 -left-2.5",
    "top-right": "-top-1.5 -right-2.5",
    "bottom-left": "-bottom-1.5 -left-2.5",
    "bottom-right": "-bottom-1.5 -right-2.5",
  };

  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-[8px]",
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  // Adjust tilt direction based on position for better visual balance
  const getTiltDirection = () => {
    if (position === "top-right" || position === "bottom-left") {
      return Math.abs(tilt); // Positive tilt for right side
    }
    return -Math.abs(tilt); // Negative tilt for left side
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
            "relative font-bold text-main-foreground border-2 border-border",
            "transform transition-all duration-300",
            "shadow-shadow",
            sizeClasses[size],
            badgeColor,
            isHovered &&
              "translate-x-boxShadowX translate-y-boxShadowY shadow-none"
          )}
        >
          <span className="relative z-10 uppercase tracking-wide">SOON</span>
        </div>
      </div>

      {/* Optional subtle overlay effect */}
      {disabled && (
        <div className="absolute inset-0 bg-app-surface-secondary/5 pointer-events-none" />
      )}
    </div>
  );
}
