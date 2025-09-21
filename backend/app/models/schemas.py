from pydantic import BaseModel
from datetime import date
from typing import Optional
from .models import FittingType

class ItemCreate(BaseModel):
    qr_id: str
    type: FittingType
    warranty: str
    date_of_manufacture: date
    manufacturer: str
    status: str = 'active'

    class Config:
        from_attributes = True