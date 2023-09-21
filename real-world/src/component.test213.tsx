import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthorPreview } from "./demo-3-1/AuthorPreview";

describe("AuthorPreview", () => {
  it("should render username", () => {
    const stub = vi.fn();
    render(
      <AuthorPreview
        bio="bio"
        following
        image="image"
        username="bjdo"
        onClick={stub}
      />
    );

    const button = screen.getByText("Click");
    fireEvent.click(button);
    expect(screen.getByText("bjdo")).toBeDefined();
    expect(stub).toHaveBeenCalledOnce();
  });
});
