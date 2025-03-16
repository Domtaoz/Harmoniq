from sqlalchemy.orm import Session
from graphql_app.database import SessionLocal
from graphql_app.model import Concert
from typing import Optional, List

class ConcertGateway:
    @classmethod
    def get_concerts(cls) -> List[Concert]:
        """ดึงข้อมูลคอนเสิร์ตทั้งหมด"""
        with SessionLocal() as db:
            return db.query(Concert).all()

    @classmethod
    def get_concert_by_id(cls, concert_id: int) -> Optional[Concert]:
        """ดึงข้อมูลคอนเสิร์ตโดย ID"""
        with SessionLocal() as db:
            return db.query(Concert).filter(Concert.concert_id == concert_id).first()

    @classmethod
    def add_concert(cls, band_id: int, concert_name: str, gate: str) -> Optional[Concert]:
        """เพิ่มคอนเสิร์ตใหม่"""
        with SessionLocal() as db:
            new_concert = Concert(band_id=band_id, concert_name=concert_name, gate=gate)
            db.add(new_concert)
            db.commit()
            db.refresh(new_concert)
            return new_concert

    @classmethod
    def delete_concert(cls, concert_id: int) -> bool:
        """ลบคอนเสิร์ต"""
        with SessionLocal() as db:
            concert = db.query(Concert).filter(Concert.concert_id == concert_id).first()
            if not concert:
                return False
            db.delete(concert)
            db.commit()
            return True
