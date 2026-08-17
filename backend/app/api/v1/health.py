from fastapi import APIRouter

router = APIRouter()

@router.get("")
async def health_check():
    return {
        "status": "healthy",
        "service": "Smart Road Damage API",
        "version": "1.0.0",
        "engine_mode": "ready"
    }
