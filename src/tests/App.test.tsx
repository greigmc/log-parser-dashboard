/// <reference types="vitest" />
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

describe("App component", () => {
  test("renders file input with label", () => {
    render(<App />);
    const fileInput = screen.getByLabelText(/upload log file/i);
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute("type", "file");
  });

  test("displays stats when file is uploaded", async () => {
    render(<App />);

    const fileInput = screen.getByLabelText(/upload log file/i);

    const mockLogContent = `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574
177.71.128.22 - - [10/Jul/2018:22:22:28 +0200] "GET /home HTTP/1.1" 200 1234
177.71.128.21 - - [10/Jul/2018:22:23:28 +0200] "GET /home HTTP/1.1" 200 1234`;

    const file = new File([mockLogContent], "test.log", { type: "text/plain" });

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    // Wait for the main headings to appear
    await waitFor(() => {
      expect(screen.getByText(/unique ip addresses/i)).toBeInTheDocument();
      expect(screen.getByText(/top 3 visited urls/i)).toBeInTheDocument();
      expect(
        screen.getByText(/top 3 active ip addresses/i),
      ).toBeInTheDocument();
    });

    // Check the Unique IP count (should be 2)
    const uniqueIpCard = screen
      .getByText(/unique ip addresses/i)
      .closest("div");
    expect(uniqueIpCard).toBeTruthy();
    expect(within(uniqueIpCard!).getByText("2")).toBeInTheDocument();

    // Check that "/home" appears in top visited URLs
    const urlsCard = screen.getByText(/top 3 visited urls/i).closest("div");
    expect(urlsCard).toBeTruthy();
    expect(
      within(urlsCard!).getByText((text) => text.includes("/home")),
    ).toBeInTheDocument();

    // Check that "177.71.128.21" appears in top IPs
    const ipCard = screen
      .getByText(/top 3 active ip addresses/i)
      .closest("div");
    expect(ipCard).toBeTruthy();
    expect(
      within(ipCard!).getByText((text) => text.includes("177.71.128.21")),
    ).toBeInTheDocument();
  });
});
