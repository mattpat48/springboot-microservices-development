import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiClient } from "./apiClient";

afterEach(() => vi.unstubAllGlobals());

describe("apiClient", () => {
  it("get ritorna il json del body", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([{ id: 1 }]), { status: 200 })));

    const data = await apiClient.get<{ id: number }[]>("/api/usr");

    expect(data).toEqual([{ id: 1 }]);
  });

  it("post con 204 risolve senza errore", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 204 })));

    await expect(apiClient.post("/api/usr", { firstname: "x" })).resolves.toBeUndefined();
  });

  it("lancia ApiError con lo status su risposta non ok", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("boom", { status: 500, statusText: "Server Error" })));

    await expect(apiClient.get("/api/job")).rejects.toMatchObject({ status: 500 });
    expect(new ApiError("x", 404)).toBeInstanceOf(Error);
  });
});
