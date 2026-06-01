"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HeritageDividerProps {
  className?: string;
  color?: "green" | "gold" | "light";
  size?: "sm" | "md" | "lg";
  label?: string;
}

const colorMap = {
  green: "var(--brand-primary)",
  gold:  "var(--gold)",
  light: "var(--brand-light)",
};

const sizeMap = {
  sm: { height: 28, width: 120 },
  md: { height: 40, width: 180 },
  lg: { height: 56, width: 240 },
};

/**
 * HeritageDivider — Ornate SVG flourish inspired by the Prakash's logo.
 * Used as section dividers, timeline connectors, and decorative elements.
 */
export function HeritageDivider({
  className,
  color = "gold",
  size = "md",
  label,
}: HeritageDividerProps) {
  const fill = colorMap[color];
  const { height, width } = sizeMap[size];

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Ornate Flourish SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 180 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Left vine */}
        <path
          d="M 10 20 C 20 10, 35 8, 50 14 C 60 18, 68 22, 75 20"
          stroke={fill}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Left leaf 1 */}
        <path
          d="M 25 14 C 22 8, 30 6, 32 12"
          stroke={fill}
          strokeWidth="1"
          fill="none"
        />
        {/* Left leaf 2 */}
        <path
          d="M 42 12 C 40 6, 48 5, 48 11"
          stroke={fill}
          strokeWidth="1"
          fill="none"
        />

        {/* Center ornament */}
        <circle cx="90" cy="20" r="3" fill={fill} />
        <circle cx="90" cy="20" r="6" stroke={fill} strokeWidth="0.8" fill="none" />
        {/* Center petals */}
        <path d="M 90 10 C 88 14, 88 16, 90 14" stroke={fill} strokeWidth="0.8" fill="none" />
        <path d="M 90 30 C 88 26, 88 24, 90 26" stroke={fill} strokeWidth="0.8" fill="none" />
        <path d="M 80 20 C 84 18, 86 18, 84 20" stroke={fill} strokeWidth="0.8" fill="none" />
        <path d="M 100 20 C 96 18, 94 18, 96 20" stroke={fill} strokeWidth="0.8" fill="none" />

        {/* Right vine (mirrored) */}
        <path
          d="M 170 20 C 160 10, 145 8, 130 14 C 120 18, 112 22, 105 20"
          stroke={fill}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Right leaf 1 */}
        <path
          d="M 155 14 C 158 8, 150 6, 148 12"
          stroke={fill}
          strokeWidth="1"
          fill="none"
        />
        {/* Right leaf 2 */}
        <path
          d="M 138 12 C 140 6, 132 5, 132 11"
          stroke={fill}
          strokeWidth="1"
          fill="none"
        />

        {/* Horizontal rule lines */}
        <line x1="0"   y1="20" x2="8"   y2="20" stroke={fill} strokeWidth="0.8" />
        <line x1="172" y1="20" x2="180" y2="20" stroke={fill} strokeWidth="0.8" />
      </svg>

      {/* Optional label */}
      {label && (
        <span
          className="font-heritage text-sm tracking-widest uppercase"
          style={{ color: fill }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/** Horizontal rule with lines flanking the flourish */
export function HeritageSectionDivider({
  className,
  color = "gold",
}: {
  className?: string;
  color?: "green" | "gold";
}) {
  const fill = colorMap[color];
  return (
    <div className={cn("flex items-center gap-4 w-full", className)}>
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${fill})` }}
      />
      <HeritageDivider color={color} size="sm" />
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(to left, transparent, ${fill})` }}
      />
    </div>
  );
}
