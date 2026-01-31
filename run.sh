#!/bin/bash
# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Path to local Node.js
NODE_BIN="$DIR/../node_install/node-v22.13.1-darwin-arm64/bin"

# Add node to PATH
export PATH="$NODE_BIN:$PATH"

echo "🎨 Starting Art Portfolio..."
echo "📍 Dashboard: http://localhost:3000/admin"
echo "📍 Gallery:   http://localhost:3000"
echo ""

npm run dev
