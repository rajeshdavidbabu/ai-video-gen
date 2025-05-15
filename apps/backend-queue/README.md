# Plot

A WebSocket chatrooms server.

![](../../actions/workflows/ci.yml/badge.svg)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/DZV--w?referralCode=bonus)

## Usage

1. Connect using a WebSocket terminal client ([`wscat` recommended](https://github.com/websockets/wscat))

   - With **no** installation

   ```sh
   pnpm dlx wscat -c wss://plot.up.railway.app
   ```

   ```sh
   yarn dlx wscat -c wss://plot.up.railway.app
   ```

   ```sh
   npx wscat -c wss://plot.up.railway.app
   ```

   - After installation

   ```sh
   wscat -c wss://plot.up.railway.app
   ```

2. Join a room with your friends and plot away! :tada:
