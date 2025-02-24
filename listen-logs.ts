import { createDirectus, realtime, staticToken } from "@directus/sdk";
import { ok } from "node:assert";
import type { Writable } from "node:stream";

type Options = {
  projectUrl: string;
  accessToken: string;
  stream: Writable;
  abortSignal: AbortSignal;
};

export async function listenLogs(options: Options) {
  ok(options.projectUrl, "Project URL needs to be defined!");

  ok(options.accessToken, "Access token needs to be defined!");

  ok(options.stream, "A valid writable stream needs to be defined!");

  const client = createDirectus(options.projectUrl)
    .with(staticToken(options.accessToken))
    .with(
      realtime({
        authMode: "strict",
        url: `${options.projectUrl.replace("https", "wss")}/websocket/logs`,
      })
    );

  if (options.abortSignal) {
    options.abortSignal.addEventListener("abort", () => {
      client.disconnect();
    });
  }

  client.onWebSocket("open", () => {
    client.sendMessage({ type: "subscribe", log_level: "trace" });
  });

  client.onWebSocket("message", async function (message) {
    if (message?.type !== "logs" || !message?.data) return;

    const data = JSON.stringify(message.data);

    options.stream.write(data);
  });

  client.onWebSocket("close", () => {
    options.stream.end();
  });

  client.onWebSocket("error", (err) => {
    options.stream.destroy(new Error("Unexpected error"));
    console.error(err);
  });

  await client.connect();
}
