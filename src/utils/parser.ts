// src/utils/parser.ts

/**
 * Parses a single log line using a regular expression to extract:
 * - the IP address
 * - the requested URL
 *
 * Returns null if the line format doesn't match.
 */
export function parseLine(line: string): { ip: string; url: string } | null {
  const match = line.match(
    /^(\d+\.\d+\.\d+\.\d+) [^ ]+ [^ ]+ .*"GET ([^ ]+) HTTP.*" \d+ \d+/,
  );
  if (!match) return null;

  return {
    ip: match[1],
    url: match[2],
  };
}

// Structure to hold parsed statistics from a log file
export type LogStats = {
  uniqueIPs: Set<string>; // A set to track distinct IP addresses
  urlCounts: Record<string, number>; // How many times each URL was visited
  ipCounts: Record<string, number>; // How many requests came from each IP
};

/**
 * Takes in raw log file content as a string and parses it line-by-line.
 * Collects:
 * - unique IPs
 * - count of URL visits
 * - count of requests per IP
 */
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

    // Update URL visit count (initialize if needed)
    // eslint-disable-next-line security/detect-object-injection
    urlCounts[url] = (urlCounts[url] || 0) + 1;

    // Update IP request count (initialize if needed)
    // eslint-disable-next-line security/detect-object-injection
    ipCounts[ip] = (ipCounts[ip] || 0) + 1;
  }

  return { uniqueIPs, urlCounts, ipCounts };
}

/**
 * Utility function to return the top N items from a count object,
 * sorted by frequency in descending order.
 */
export function getTopN(counts: Record<string, number>, n: number) {
  return Object.entries(counts)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}
