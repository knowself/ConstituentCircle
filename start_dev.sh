#!/bin/bash

# Set the port to use, defaulting to 3000 if not provided
PORT=${1:-3000}

# Function to kill any existing process on the specified port
# This ensures that the port is free before starting the server
kill_port_on_port() {
  echo "Checking for existing process on port $PORT..."
  # Use fuser to find and kill the process
  if fuser -k -n tcp $PORT > /dev/null 2>&1; then
    echo "Found and killed process on port $PORT"
    sleep 2
  else
    echo "No process found on port $PORT"
  fi

  # Double check if the port is still in use
  if fuser $PORT/tcp > /dev/null 2>&1; then
    echo "Warning: Port $PORT is still in use. Unable to start server."
    exit 1
  else
    echo "Confirmed: Port $PORT is free"
  fi
}

# Start the Next.js development server
# This runs in the background, allowing the script to continue
kill_port_on_port
npm run dev -- -p $PORT &

# Get the PID of the last background command
PID=$!

# Wait for Enter key before showing prompt
read -s -r

# Function to restart the server
# This kills the current server process, frees the port, and starts a new server instance
restart_server() {
  echo "Restarting server..."
  kill $PID
  kill_port_on_port
  npm run dev -- -p $PORT &
  PID=$!
}

test_openai_initialization() {
  echo "Running OpenAI initialization test..."
  # Check if the OpenAI API key is set
  if [[ -z "${OPENAI_API_KEY}" ]]; then
    echo "OpenAI API key is not set. Test failed!"
    return 1
  else
    echo "OpenAI API key is set. Test passed!"
  fi

  # Here you can add more checks related to OpenAI initialization if needed
}

# Loop to accept user commands
# Allows the user to restart the server, run tests, or quit the script
while true; do
  # Show prompt and get command
  read -p "Enter (r to restart, q to quit, t to run tests): " command
  if [[ -n $command ]]; then
    case $command in
      r)
        restart_server
        ;;
      t)
        test_openai_initialization
        ;;
      q)
        echo "Quitting..."
        kill $PID
        exit 0
        ;;
      *)
        echo "Invalid command. Please enter 'r' to restart, 'q' to quit, or 't' to run tests."
        ;;
    esac
  fi
done