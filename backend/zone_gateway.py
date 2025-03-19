from sqlalchemy.orm import Session
from graphql_app.database import SessionLocal
from graphql_app.model import Zone
from typing import List

class ZoneGateway:
    @classmethod
    def get_zones_by_concert(cls, concert_id: int) -> List[dict]:
    
        with SessionLocal() as db:
            zones = (
                db.query(Zone)
                .filter(Zone.concert_id == concert_id)
                .all()
            )
            return [
                {
                    "zone_id": z.zone_id,
                    "concert_id": z.concert_id,
                    "zone_name": z.zone_name,
                    "price": float(z.price)
                }
                for z in zones
            ]
