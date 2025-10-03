"use client";

import type { FC } from "react";

interface LoadingOverlayProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

const sizeMap: Record<NonNullable<LoadingOverlayProps["size"]>, string> = {
  small: "h-8 w-8",
  medium: "h-12 w-12",
  large: "h-16 w-16",
};

const LoadingOverlay: FC<LoadingOverlayProps> = ({ size = "medium", message }) => {
  const spinnerSize = sizeMap[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center gap-4">
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-white ${spinnerSize}`} />
        {message ? <p className="text-lg text-white">{message}</p> : null}
      </div>
    </div>
  );
};

export default LoadingOverlay;
