from sqlalchemy.orm import Session
from .graphql_app.database import SessionLocal
from .graphql_app.model import Booking
from typing import Optional, List

class BookingGateway:
    @classmethod
    def get_bookings(cls) -> List[Booking]:
        """ดึงข้อมูลการจองทั้งหมด"""
        with SessionLocal() as db:
            return db.query(Booking).all()

    @classmethod
    def get_booking_by_id(cls, booking_id: int) -> Optional[Booking]:
        """ดึงข้อมูลการจองโดย ID"""
        with SessionLocal() as db:
            return db.query(Booking).filter(Booking.booking_id == booking_id).first()

    @classmethod
    def update_booking_status(cls, booking_id: int, new_status: str) -> Optional[Booking]:
        """เปลี่ยนสถานะการจอง"""
        with SessionLocal() as db:
            booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
            if booking:
                booking.status = new_status
                db.commit()
                return booking
        return None
