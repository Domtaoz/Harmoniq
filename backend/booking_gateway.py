import random
import string
from sqlalchemy.orm import Session
from graphql_app.database import SessionLocal
from graphql_app.model import Booking, Ticket
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
    
    @classmethod
    def get_bookings_by_user(cls, user_id: int) -> List[Booking]:
        """ดึงข้อมูลการจองของผู้ใช้"""
        with SessionLocal() as db:
            return db.query(Booking).filter(Booking.user_id == user_id).all()
    
    @classmethod
    def confirm_payment(cls, booking_id: int) -> Optional[Ticket]:
        """เมื่อชำระเงินแล้ว → เปลี่ยนสถานะการจอง และออกตั๋ว"""
        with SessionLocal() as db:
            booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
            if booking and booking.status == "pending":
                # เปลี่ยนสถานะการจองเป็น "confirmed"
                booking.status = "confirmed"
                
                # สร้าง Ticket
                ticket_code = "".join(random.choices(string.ascii_uppercase + string.digits, k=10))
                qr_code = "".join(random.choices(string.ascii_letters + string.digits, k=20))  # สุ่ม QR Code

                new_ticket = Ticket(
                    booking_id=booking_id,
                    ticket_code=ticket_code,
                    qr_code=qr_code
                )
                db.add(new_ticket)
                db.commit()
                db.refresh(new_ticket)

                return new_ticket
        return None