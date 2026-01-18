from fastapi import FastAPI
import requests
import os

app = FastAPI()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_ANON_KEY = os.environ["SUPABASE_ANON_KEY"]

@app.post("/create_workout")
def create_workout(device_id: str, parsed: dict):
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

@app.get("/list_workouts")
def list_workouts():
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/table1",
        headers={
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
        }
    )
    return resp.json()
