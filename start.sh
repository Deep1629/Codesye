#!/bin/bash

# Start the backend server
echo "🚀 Starting backend server..."
cd "$(dirname "$0")"
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start the frontend server
echo "🎨 Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait

# Cleanup
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "�� Servers stopped" 