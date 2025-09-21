from sqlalchemy import Column, Integer, String, Date, Enum
from ..database import Base
import enum

class FittingType(str, enum.Enum):
    ERC = "elastic_rail_clip"
    LINER = "liner"
    RAIL_PAD = "rail_pad"
    SLEEPER = "sleeper"

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    qr_id = Column(String, unique=True, nullable=False)
    type = Column(Enum(FittingType), nullable=False)
    warranty = Column(String)
    date_of_manufacture = Column(Date)
    manufacturer = Column(String)
    status = Column(String)