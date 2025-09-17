import React, { useEffect, useState } from "react";

const SERVICE_URL = "https://cloud.eloqdata.com/";

function useServiceStatus(url) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    fetch(url, { method: "HEAD", mode: "no-cors" })
      .then(() => {
        if (!cancelled) setStatus("up");
      })
      .catch(() => {
        if (!cancelled) setStatus("down");
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return status;
}

export default function StatusPage() {
  const status = useServiceStatus(SERVICE_URL);

  // Icon size: half the card width (card is 320px)
  const iconBoxSize = 160;
  const icon =
    status === "up" ? (
      <svg
        width={iconBoxSize}
        height={iconBoxSize}
        viewBox="0 0 100 100"
        className="mx-auto mb-4"
        style={{ display: "block" }}
      >
        <circle cx="50" cy="50" r="48" fill="#22c55e" />
        <polyline
          points="30,55 48,72 72,36"
          fill="none"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : status === "down" ? (
      <svg
        width={iconBoxSize}
        height={iconBoxSize}
        viewBox="0 0 100 100"
        className="mx-auto mb-4"
        style={{ display: "block" }}
      >
        <circle cx="50" cy="50" r="48" fill="#ef4444" />
        <line
          x1="34"
          y1="34"
          x2="66"
          y2="66"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <line
          x1="66"
          y1="34"
          x2="34"
          y2="66"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
    ) : (
      <div
        className="mx-auto mb-4 flex items-center justify-center"
        style={{ height: iconBoxSize }}
      >
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-600 border-t-transparent"></div>
      </div>
    );

  const statusText =
    status === "up"
      ? { label: "Operational", color: "text-green-400" }
      : status === "down"
      ? { label: "Down", color: "text-red-400" }
      : { label: "Checking...", color: "text-slate-400" };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        className="flex w-80 flex-col items-center rounded-xl px-8 py-6 shadow-xl"
        style={{
          background: "rgba(24, 26, 31, 0.92)",
          border: "1.5px solid #23272b",
          backdropFilter: "blur(2px)",
        }}
      >
        {/* Title */}
        <h2 className="mb-3 mt-1 text-center text-2xl font-bold text-white">
          EloqCloud Service Status
        </h2>
        {/* Large Status Icon */}
        <div className="my-2">{icon}</div>
        {/* Status text */}
        <div
          className={`mb-2 text-center text-xl font-bold ${statusText.color}`}
        >
          {statusText.label}
        </div>
        <div className="mb-1 text-center text-xs text-slate-300">
          Endpoint:{" "}
          <span className="font-mono text-white">cloud.eloqdata.com</span>
        </div>
        <div className="text-center text-xs text-slate-400">
          Last checked: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
