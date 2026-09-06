#!/bin/bash
# Serves the Mapping folder locally and opens the Exchange Lineage Explorer.
# Needed because browsers block local data files when an HTML page is opened
# by double-clicking it. Leave this window open while previewing; close it
# or press Ctrl+C when done. Local only, nothing leaves this Mac.

cd "$(dirname "$0")"
PORT=8642

if lsof -i :$PORT >/dev/null 2>&1; then
  echo "Preview server already running on port $PORT, reusing it."
else
  python3 -m http.server $PORT >/dev/null 2>&1 &
  SERVER_PID=$!
  sleep 1
  echo "Preview server started on port $PORT."
fi

open "http://localhost:$PORT/tools/exchange-lineage-explorer.html"
echo ""
echo "Explorer opened in your browser."
echo "Tip: the ransomware explorer also previews from here:"
echo "  http://localhost:$PORT/tools/ransomware-lineage-explorer.html"
echo ""
echo "Leave this window open while previewing. Press Ctrl+C or close it when done."

if [ -n "$SERVER_PID" ]; then
  wait $SERVER_PID
fi
