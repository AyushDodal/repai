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
            "exercise": parsed.get("exercise"), 
            "sets": parsed.get("sets"), 
            "weight": parsed.get("weight"), 
            "reps": parsed.get("reps"),
            "parsed": parsed
        }
    )
    return {
        "status": resp.status_code,
        "text": resp.text
        }



@server.tool()
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


@server.tool()
def delete_workout(parsed: dict):
    """
    Delete a specific workout by workout id
    """

    workout_id = parsed.get("id")
    
    resp = requests.delete(
        f"{SUPABASE_URL}/rest/v1/table1?id=eq.{workout_id}",
        headers={
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json"
        }
    )
    return (
        "status" : resp.status_code,
        "text" : resp.text
    )


if __name__ == "__main__":
    import nest_asyncio
    nest_asyncio.apply()
    server.run(transport="streamable-http")
