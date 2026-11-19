"""API do ENP (Etapa D). Roda no Lambda atrás do API Gateway via Mangum."""
from fastapi import FastAPI
from mangum import Mangum

app = FastAPI(title="ENP API", version="0.1.0")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


handler = Mangum(app)
