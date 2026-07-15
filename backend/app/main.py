from fastapi import FastAPI

from app.api.routes.ia import router as ia_router

app = FastAPI(title="BotPromoções API", version="1.0.0")

app.include_router(ia_router)

@app.get("/health")
def health():
    return {"status": "ok"}