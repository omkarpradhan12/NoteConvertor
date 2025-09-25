from fastapi import FastAPI, Request, Query
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import hashlib

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

NOTES = "A A# B C C# D D# E F F# G G#".split()

def note_string_builder(string_start: str, number_of_frets: int = 12):
    start_index = NOTES.index(string_start)
    return [NOTES[(start_index + i) % len(NOTES)] for i in range(number_of_frets + 1)]

def tuning_selector(tuning: str, number_of_frets: int = 15):
    tuned = {}
    for note in tuning.split():
        original_note = note
        counter = 1
        while note in tuned:
            note = f"{original_note}{counter}"
            counter += 1
        tuned[note] = note_string_builder(original_note, number_of_frets)
    return tuned


# Keep selected notes in memory (simplified — not thread safe)
selected_notes = []

@app.get("/", response_class=HTMLResponse)
async def home_page(request: Request):
    return templates.TemplateResponse("fretboard.html", {
        "request": request,
        "keys":{"tuning": "E A D G B E",
        "selected_notes": selected_notes,
        "fretboard": tuning_selector(tuning="E A D G B E"),}

    })

@app.get("/api/get_tuning")
async def get_data(tuning: str = Query(..., description="Tuning")):
    return JSONResponse({"tuning": tuning_selector(tuning=tuning)})

