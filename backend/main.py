from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import fittings, auth
from app.database import init_db

app = FastAPI(title="QRixAlt API", description="API for Railway Track Fittings Management")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only. Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def on_startup():
    await init_db()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(fittings.router, prefix="/api/fittings", tags=["Fittings"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)