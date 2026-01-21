# mcp_server/server.py

import sys
import asyncio
import requests
import os
from datetime import date
from fastmcp import FastMCP
import nest_asyncio
nest_asyncio.apply()


SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_ANON_KEY = os.environ["SUPABASE_ANON_KEY"]

server = FastMCP("fittrack-mcp-remote")

@server.tool()
def create_workout(device_id: str, date: date, exercise: str, sets: int, weight: float, reps: float, parsed: dict):
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
            "date": parsed.date,
            "exercise": parsed.name, 
            "sets": parsed.sets, 
            "weight": parsed.weight, 
            "reps": parsed.reps,
            "parsed": parsed
        }
    )
    return resp.json()

@server.tool()
def list_workouts():
    """List workouts"""
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/table1",
        headers={
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        }
    )
    return resp.json()

"""async def main():
    await server.run(
        read_stream=sys.stdin,
        write_stream=sys.stdout,
        initialization_options={}
    )"""

if __name__ == "__main__":
    import nest_asyncio
    nest_asyncio.apply()
    #asyncio.run(main())
    server.run(transport="streamable-http")
