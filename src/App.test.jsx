import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the hero without crashing", () => {
  render(<App />);
  expect(screen.getAllByText(/productivity system/i).length).toBeGreaterThan(0);
});

test("renders navigation", () => {
  render(<App />);
  expect(screen.getAllByText(/join beta/i).length).toBeGreaterThan(0);
});