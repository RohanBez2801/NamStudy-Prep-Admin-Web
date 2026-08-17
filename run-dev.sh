#!/bin/bash
# Run NamStudy Prep Admin dev server
# Kill any existing processes on port 5173
npx kill-port 5173 2>/dev/null || true
# Start dev server
npm run dev
