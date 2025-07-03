// src/hooks/useLogStats.ts
import { useEffect, useState } from "react";

interface LogStats {
  uniqueIpCount: number;
  topUrls: string[];
  topIps: string[];
}

// Dummy parser functions – replace with real implementations
function parseLog(logText: string): { ip: string; url: string }[] {
  const lines = logText.split("\n").filter(Boolean);
  return lines.map((line) => {
    const ip = line.split(" ")[0];
    const urlMatch = line.match(/"GET (.*?) HTTP/);
    const url = urlMatch?.[1] || "";
    return { ip, url };
  });
}

function calculateStats(logEntries: { ip: string; url: string }[]): LogStats {
  const ipMap = new Map<string, number>();
  const urlMap = new Map<string, number>();

  for (const entry of logEntries) {
    ipMap.set(entry.ip, (ipMap.get(entry.ip) || 0) + 1);
    urlMap.set(entry.url, (urlMap.get(entry.url) || 0) + 1);
  }

  const topIps = [...ipMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([ip]) => ip);

  const topUrls = [...urlMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([url]) => url);

  return {
    uniqueIpCount: ipMap.size,
    topUrls,
    topIps,
  };
}

export function useLogStats(logPath: string): LogStats | null {
  const [stats, setStats] = useState<LogStats | null>(null);

  useEffect(() => {
    async function loadLogData() {
      try {
        const response = await fetch(logPath);
        const text = await response.text();
        const parsed = parseLog(text);
        const result = calculateStats(parsed);
        setStats(result);
      } catch (err) {
        console.error("Failed to load or parse log file:", err);
      }
    }

    loadLogData();
  }, [logPath]);

  return stats;
}
