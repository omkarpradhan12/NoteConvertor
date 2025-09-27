from fastapi import FastAPI, Request, Query
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fretboard_utils.fretboard_maker import tuning_selector


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")




# Keep selected notes in memory (simplified — not thread safe)
selected_notes = []

@app.get("/", response_class=HTMLResponse)
async def home_page(request: Request):
    return templates.TemplateResponse("fretboard.html", {
        "request": request,

    })

@app.get("/api/get_tuning")
async def get_data(tuning: str = Query(..., description="Tuning")):
    return JSONResponse({"tuning": tuning_selector(tuning=tuning)})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info",reload=True)
