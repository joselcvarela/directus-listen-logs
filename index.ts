#!/usr/bin/env node

import pkg from "./package.json";
import { program } from "commander";
import { inputString } from "./prompt";

start();

async function start() {
  program
    .name(pkg.name)
    .description(`CLI tool for: ${pkg.description}`)
    .version(pkg.version);

  program.option("--project-url <url>", "Project URL must be defined");

  program.parse();

  const options = program.opts();

  const abortController = new AbortController();

  const accessToken =
    process.env.ACCESS_TOKEN ||
    (await inputString("Please provide Admin access token:", { mask: true }));

  const projectUrl =
    options.projectUrl ||
    process.env.PROJECT_URL ||
    (await inputString("Please provide project URL:"));

  process.on("SIGINT", function () {
    abortController.abort();
  });

  (await import("./listen-logs")).listenLogs({
    abortSignal: abortController.signal,
    accessToken,
    projectUrl,
    stream: process.stdout,
  });
}
