from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict
from ..database import get_db
from ..models.models import Item, FittingType
from ..models.schemas import ItemCreate
from sqlalchemy import select, func
from datetime import datetime
import json

router = APIRouter()

@router.get("/{qr_id}")
async def get_item(qr_id: str, db: AsyncSession = Depends(get_db)):
    """Get item information by QR ID"""
    query = select(Item).where(Item.qr_id == qr_id)
    result = await db.execute(query)
    item = result.scalar_one_or_none()
    
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.get("/", response_model=List[dict])
async def list_items(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """List all items with optional filtering"""
    query = select(Item).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/")
async def create_item(item: ItemCreate, db: AsyncSession = Depends(get_db)):
    """Create a new item record"""
    try:
        db_item = Item(
            qr_id=item.qr_id,
            type=item.type,
            warranty=item.warranty,
            date_of_manufacture=item.date_of_manufacture,
            manufacturer=item.manufacturer,
            status=item.status
        )
        db.add(db_item)
        await db.commit()
        await db.refresh(db_item)
        return db_item
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{qr_id}")
async def update_item(qr_id: str, item_data: dict, db: AsyncSession = Depends(get_db)):
    """Update an existing item"""
    query = select(Item).where(Item.qr_id == qr_id)
    result = await db.execute(query)
    item = result.scalar_one_or_none()
    
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    for key, value in item_data.items():
        setattr(item, key, value)
    
    await db.commit()
    await db.refresh(item)
    return item

@router.delete("/{qr_id}")
async def delete_item(qr_id: str, db: AsyncSession = Depends(get_db)):
    """Delete an item"""
    query = select(Item).where(Item.qr_id == qr_id)
    result = await db.execute(query)
    item = result.scalar_one_or_none()
    
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    await db.delete(item)
    await db.commit()
    return {"message": "Item deleted"}

@router.get("/analytics/summary")
async def get_analytics(db: AsyncSession = Depends(get_db)):
    """Get analytics data for dashboard"""
    # Count by type
    type_query = select(Item.type, func.count(Item.id)).group_by(Item.type)
    type_result = await db.execute(type_query)
    type_count = {
        'elastic_rail_clip': 0,
        'liner': 0,
        'rail_pad': 0,
        'sleeper': 0
    }
    type_count.update(dict(type_result.all()))

    # Count by manufacturer
    manufacturer_query = select(Item.manufacturer, func.count(Item.id)).group_by(Item.manufacturer)
    manufacturer_result = await db.execute(manufacturer_query)
    manufacturer_count = dict(manufacturer_result.all())

    # Monthly trend
    trend_query = select(
        func.strftime('%Y-%m', Item.date_of_manufacture).label('month'),
        func.count(Item.id)
    ).group_by('month').order_by('month')
    trend_result = await db.execute(trend_query)
    monthly_trend = [
        {"month": month, "count": count}
        for month, count in trend_result.all()
    ]

    return {
        "typeCount": type_count,
        "manufacturerCount": manufacturer_count,
        "monthlyTrend": monthly_trend
    }