import { render, screen } from "@testing-library/react";
import StatCard from "../components/LogDashboard/StatCard";
import "@testing-library/jest-dom";

describe("StatCard", () => {
  it("renders title and content (string) correctly", () => {
    render(<StatCard title="Total IPs" content="42" />);
    expect(screen.getByText("Total IPs")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders list content correctly when content is array", () => {
    const data = [
      { key: "192.168.0.1", count: 5 },
      { key: "10.0.0.1", count: 3 },
    ];
    render(<StatCard title="Top IPs" content={data} />);

    const listItems = screen.getAllByRole("listitem");

    expect(listItems[0]).toHaveTextContent("192.168.0.1 — 5");
    expect(listItems[1]).toHaveTextContent("10.0.0.1 — 3");
  });
});
