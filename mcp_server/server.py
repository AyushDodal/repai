from fastapi import FastAPI
from mcp.server.fastapi import MCPFastAPI
import requests
import os

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_ANON_KEY = os.environ["SUPABASE_ANON_KEY"]

app = FastAPI()
mcp = MCPFastAPI(app)

@mcp.tool()
def create_workout(device_id: str, parsed: dict):
    """Create a workout in FitTrack"""
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/table1",
        headers={
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "device_id": device_id,
            "date": parsed.get("date"),
            "exercise": parsed.get("type"),
            "parsed": parsed
        }
    )
    return resp.json()

@mcp.tool()
def list_workouts():
    """List workouts"""
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/table1",
        headers={
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
        }
    )
    return resp.json()
