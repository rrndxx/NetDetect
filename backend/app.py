from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import threading
from get_devices import scan_network, get_local_ip_range

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

devices = []


def continuous_device_scan():
    async def run_scan():
        while True:
            try:
                ip_range = await get_local_ip_range()
                scanned_devices = await scan_network(ip_range)
                global devices
                devices = scanned_devices
                print("Scan completed!")
            except Exception as e:
                print(f"Error during network scan: {e}")
            await asyncio.sleep(60)

    threading.Thread(target=lambda: asyncio.run(run_scan()), daemon=True).start()


@app.on_event("startup")
async def startup_event():
    continuous_device_scan()


@app.get("/api/devices")
def get_devices():
    """Endpoint to return the current list of devices."""
    return JSONResponse(content=devices)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
