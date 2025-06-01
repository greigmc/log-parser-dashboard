// src/utils/parser.ts

/**
 * Parses a single log line and returns an object with IP and URL,
 * or null if the line doesn't match the expected format.
 */
export function parseLine(line: string): { ip: string; url: string } | null {
  const match = line.match(
    /^(\d+\.\d+\.\d+\.\d+) - - .*"GET ([^ ]+) HTTP.*" \d+ \d+/,
  );
  if (!match) return null;

  return {
    ip: match[1],
    url: match[2],
  };
}

export type LogStats = {
  uniqueIPs: Set<string>;
  urlCounts: Record<string, number>;
  ipCounts: Record<string, number>;
};

export function parseLogFile(content: string): LogStats {
  const uniqueIPs = new Set<string>();
  const urlCounts: Record<string, number> = {};
  const ipCounts: Record<string, number> = {};

  const lines = content.split("\n");

  for (const line of lines) {
    const parsed = parseLine(line);
    if (!parsed) continue;

    const { ip, url } = parsed;

    uniqueIPs.add(ip);
    urlCounts[url] = (urlCounts[url] || 0) + 1;
    ipCounts[ip] = (ipCounts[ip] || 0) + 1;
  }

  return { uniqueIPs, urlCounts, ipCounts };
}

export function getTopN(counts: Record<string, number>, n: number) {
  return Object.entries(counts)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}
