# directus-listen-logs

This package / CLI tool allows you to listen to your Directus project logs.

## Usage

You can use these package in two ways: as a dependency on your project or as a CLI tool.

### As a dependency

```ts
import { listenLogs } from "directus-listen-logs";
import fs from "node:fs";

start();

async function start(accessToken: string, projectUrl: string) {
  const abortController = new AbortController();
  const out = fs.createWriteStream("./logs.jsonl");

  process.on("SIGINT", function () {
    abortController.abort();
  });

  listenLogs({
    abortSignal: abortController.signal,
    accessToken,
    projectUrl,
    stream: out,
  });
}
```

### As a CLI tool

```sh
$  ACCESS_TOKEN="XX" PROJECT_URL="https://example.directus.io" npx directus-listen-logs > logs.jsonl
```

```sh
$  ACCESS_TOKEN="XX" npx directus-listen-logs --project-url "https://example.directus.io" > logs.jsonl
```

```sh
$  npx directus-listen-logs --project-url "https://example.directus.io" # access token will be requested
```

```sh
$  npx directus-listen-logs # access token nad project URL will be requested
```
