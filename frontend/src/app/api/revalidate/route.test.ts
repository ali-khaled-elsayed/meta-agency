import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidateTag = vi.fn();
vi.mock("next/cache", () => ({ revalidateTag }));

const { POST } = await import("./route");

const request = (body: unknown, secret?: string) =>
  new NextRequest("http://localhost/api/revalidate", {
    method: "POST",
    headers: { "content-type": "application/json", ...(secret ? { "x-revalidate-secret": secret } : {}) },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidateTag.mockClear();
    vi.stubEnv("REVALIDATE_SECRET", "s3cret-value");
  });

  it("rejects missing or wrong secrets", async () => {
    expect((await POST(request({ tags: ["blog"] }))).status).toBe(401);
    expect((await POST(request({ tags: ["blog"] }, "wrong"))).status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects everything when no secret is configured", async () => {
    vi.stubEnv("REVALIDATE_SECRET", "");
    expect((await POST(request({ tags: ["blog"] }, ""))).status).toBe(401);
  });

  it("validates the body", async () => {
    expect((await POST(request("{not json", "s3cret-value"))).status).toBe(400);
    expect((await POST(request({ tags: "blog" }, "s3cret-value"))).status).toBe(422);
  });

  it("revalidates only allow-listed tags, once each", async () => {
    const res = await POST(request({ tags: ["blog", "blog", "evil", 42, "home"] }, "s3cret-value"));
    expect(res.status).toBe(200);
    expect((await res.json()).revalidated).toEqual(["blog", "home"]);
    expect(revalidateTag.mock.calls).toEqual([
      ["blog", { expire: 0 }],
      ["home", { expire: 0 }],
    ]);
  });
});
