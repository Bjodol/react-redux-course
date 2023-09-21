import { expect, describe, it } from "vitest";
import { authReducer } from "./demo-6.1/auth-reducer";

describe("authReducer", () => {
  it("should add a user to the state", () => {
    const result = authReducer(
      {},
      {
        type: "login",
        payload: {
          bio: "bio",
          email: "email@email.email",
          image: "image",
          token: "my-token",
          username: "user",
        },
      }
    );
    expect(result).toEqual({
      user: {
        bio: "bio",
        email: "email@email.email",
        image: "image",
        token: "my-token",
        username: "user",
      },
    });
  });
});
