# Import necessary libraries
import asyncio
import websockets

# Define a simple WebSocket server
async def echo(websocket, path):
    # This function will handle messages from the client
    try:
        async for message in websocket:
            # Echo the received message back to the client
            await websocket.send(f"Server says: {message}")
    except websockets.exceptions.ConnectionClosed:
        # Handle connection close
        print("Connection closed")

# Start the server on localhost:6789
async def main():
    # Create and run the WebSocket server
    async with websockets.serve(echo, "localhost", 6789):
        print("WebSocket server is running on ws://localhost:6789")
        await asyncio.Future()  # Run the server forever

# Run the main function
if __name__ == "__main__":
    asyncio.run(main())
