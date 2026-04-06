from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any, Optional
from ..db.database import get_db
from ..db.models import PlatformConnection, PlatformType
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class ConnectionSchema(BaseModel):
    id: int
    platform: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UpsertConnectionRequest(BaseModel):
    platform: str
    credentials: Dict[str, Any]
    is_active: bool = True


@router.get("/", response_model=List[ConnectionSchema])
async def get_connections(db: AsyncSession = Depends(get_db)):
    """Get all platform connections (credentials are omitted for security)."""
    result = await db.execute(
        select(PlatformConnection).order_by(PlatformConnection.created_at.desc())
    )
    return result.scalars().all()


@router.post("/", response_model=ConnectionSchema)
async def upsert_connection(
    data: UpsertConnectionRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create or update a platform connection."""
    try:
        platform_enum = PlatformType(data.platform.lower())
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid platform '{data.platform}'. Must be one of: {[p.value for p in PlatformType]}",
        )

    # Check if a connection for this platform already exists (user_id=1 for now, auth will be added later)
    result = await db.execute(
        select(PlatformConnection).where(PlatformConnection.platform == platform_enum)
    )
    existing = result.scalar_one_or_none()

    if existing:
        existing.credentials = data.credentials
        existing.is_active = data.is_active
        await db.commit()
        await db.refresh(existing)
        return existing
    else:
        new_conn = PlatformConnection(
            user_id=1,  # Placeholder until auth is implemented
            platform=platform_enum,
            credentials=data.credentials,
            is_active=data.is_active,
        )
        db.add(new_conn)
        await db.commit()
        await db.refresh(new_conn)
        return new_conn


@router.delete("/{platform}")
async def delete_connection(platform: str, db: AsyncSession = Depends(get_db)):
    """Remove a platform connection."""
    try:
        platform_enum = PlatformType(platform.lower())
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid platform '{platform}'.")

    result = await db.execute(
        select(PlatformConnection).where(PlatformConnection.platform == platform_enum)
    )
    existing = result.scalar_one_or_none()
    if not existing:
        raise HTTPException(status_code=404, detail="Connection not found.")

    await db.delete(existing)
    await db.commit()
    return {"message": f"Connection for '{platform}' removed successfully."}
