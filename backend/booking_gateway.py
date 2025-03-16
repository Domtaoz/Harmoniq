import random
import string
from sqlalchemy.orm import Session
from graphql_app.database import SessionLocal
from graphql_app.model import Booking, Ticket, Concert, Zone, Seat
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
    def get_bookings_by_user(cls, user_id: int) -> List[dict]:
        """ดึงข้อมูลการจองของผู้ใช้ พร้อม concert_name, zone_name, seat_number, seat_count และ total_price"""
        with SessionLocal() as db:
            bookings = (
                db.query(
                    Booking.booking_id,
                    Booking.user_id,
                    Booking.status,
                    Concert.concert_name,
                    Zone.zone_name,
                    Seat.seat_number,
                    db.func.count(Seat.seat_id).label("seat_count"),
                    db.func.sum(Zone.price).label("total_price")
                )
                .join(Concert, Booking.concert_id == Concert.concert_id)
                .join(Zone, Seat.zone_id == Zone.zone_id)
                .join(Seat, Booking.seat_id == Seat.seat_id)
                .filter(Booking.user_id == user_id)
                .group_by(Booking.booking_id)
                .all()
            )
            return [
                {
                    "booking_id": b.booking_id,
                    "user_id": b.user_id,
                    "concert_name": b.concert_name,
                    "zone_name": b.zone_name,
                    "seat_number": b.seat_number,
                    "seat_count": b.seat_count,
                    "total_price": float(b.total_price),
                    "status": b.status
                }
                for b in bookings
            ]
    
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