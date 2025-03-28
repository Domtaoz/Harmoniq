from sqlalchemy.orm import Session
from graphql_app.database import SessionLocal
from graphql_app.model import Concert
from typing import Optional, List

class ConcertGateway:
    @classmethod
    def get_concerts(cls) -> List[Concert]:
        with SessionLocal() as db:
            return db.query(Concert).all()


    @classmethod
    def get_concert_by_id(cls, concert_id: int) -> Optional[dict]:
        with SessionLocal() as db:
            concert = db.query(Concert).filter(Concert.concert_id == concert_id).first()
            if concert:
                return {
                    "concert_id": concert.concert_id,
                    "concert_name": concert.concert_name,
                    "band_name": concert.band_name,
                    "concert_type": concert.concert_type
                }
        return None
