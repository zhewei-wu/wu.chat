import { describe, expect, it } from "vitest";
import { setup, fetch } from "@nuxt/test-utils-edge";

describe("server", async () => {
  await setup({ server: true });

  it("queries", async () => {
    const response = await fetch("/api/hello/chuck");

    expect(response).toBeTruthy();
  });
});
