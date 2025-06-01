import { describe, it, expect } from "vitest";
import { parseLine, parseLogFile, getTopN } from "../utils/parser";

describe("parseLine", () => {
  it("extracts IP and URL from valid log line", () => {
    const line =
      '177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /home HTTP/1.1" 200 1234';
    const result = parseLine(line);
    expect(result).toEqual({ ip: "177.71.128.21", url: "/home" });
  });

  it("returns null for invalid line", () => {
    const badLine = "this is not a valid log line";
    const result = parseLine(badLine);
    expect(result).toBeNull();
  });
});

describe("parseLogFile", () => {
  const mockLog = `
177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /home HTTP/1.1" 200 1234
177.71.128.21 - - [10/Jul/2018:22:22:28 +0200] "GET /about HTTP/1.1" 200 1234
192.168.1.1 - - [10/Jul/2018:22:23:28 +0200] "GET /home HTTP/1.1" 200 1234
`;

  it("counts unique IPs, IP hits, and URL hits", () => {
    const { uniqueIPs, ipCounts, urlCounts } = parseLogFile(mockLog);

    expect(uniqueIPs.size).toBe(2);
    expect(ipCounts["177.71.128.21"]).toBe(2);
    expect(ipCounts["192.168.1.1"]).toBe(1);

    expect(urlCounts["/home"]).toBe(2);
    expect(urlCounts["/about"]).toBe(1);
  });
});

// parser.test.ts
describe("getTopN", () => {
  it("returns top N sorted entries from a map", () => {
    const map = new Map([
      ["/a", 10],
      ["/b", 30],
      ["/c", 20],
    ]);

    const obj = Object.fromEntries(map);
    const top2 = getTopN(obj, 2);
    expect(top2).toEqual([
      { key: "/b", count: 30 },
      { key: "/c", count: 20 },
    ]);
  });
});
