from sqlalchemy.orm import Session
from graphql_app.database import SessionLocal
from graphql_app.model import Seat, Concert, Zone
from typing import Optional, List

class SeatGateway:
    @classmethod
    def get_seats_by_concert(cls, concert_id: int) -> List[Seat]:
        """ดึงข้อมูลที่นั่งทั้งหมดสำหรับคอนเสิร์ตที่กำหนด"""
        with SessionLocal() as db:
            return db.query(Seat).filter(Seat.concert_id == concert_id).all()

    @classmethod
    def get_seat_status(cls, seat_id: int) -> Optional[str]:
        """ดึงสถานะของที่นั่ง"""
        with SessionLocal() as db:
            seat = db.query(Seat).filter(Seat.seat_id == seat_id).first()
            return seat.status if seat else None

    @classmethod
    def update_seat_status(cls, seat_id: int, new_status: str) -> Optional[Seat]:
        """อัปเดตสถานะที่นั่ง"""
        with SessionLocal() as db:
            seat = db.query(Seat).filter(Seat.seat_id == seat_id).first()
            if seat:
                seat.status = new_status
                db.commit()
                return seat
        return None
    
    def get_seats_by_concert_zone(cls, concert_name: str, zone_name: str) -> List[Seat]:
        """ดึงข้อมูลที่นั่งทั้งหมดตามชื่อคอนเสิร์ตและโซน"""
        with SessionLocal() as db:
            seats = (
                db.query(Seat)
                .join(Concert, Seat.concert_id == Concert.concert_id)
                .join(Zone, Seat.zone_id == Zone.zone_id)
                .filter(Concert.concert_name == concert_name, Zone.zone_name == zone_name)
                .all()
            )
            return seats

    @classmethod
    def update_seat_status(cls, concert_name: str, zone_name: str, seat_number: str, new_status: str) -> Optional[Seat]:
        """เปลี่ยนสถานะที่นั่งตาม `concert_name`, `zone_name`, และ `seat_number`"""
        with SessionLocal() as db:
            seat = (
                db.query(Seat)
                .join(Concert, Seat.concert_id == Concert.concert_id)
                .join(Zone, Seat.zone_id == Zone.zone_id)
                .filter(
                    Concert.concert_name == concert_name,
                    Zone.zone_name == zone_name,
                    Seat.seat_number == seat_number
                )
                .first()
            )
            if seat:
                seat.status = new_status
                db.commit()
                return seat
        return None