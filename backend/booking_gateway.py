import random
import string
from sqlalchemy.orm import Session
from graphql_app.database import SessionLocal
from graphql_app.model import Booking, Ticket, Concert, Zone, Seat
from typing import Optional, List
from sqlalchemy.sql import func

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
    def update_booking_status(cls, booking_id: int, new_status: str) -> Optional[dict]:
        """เปลี่ยนสถานะการจอง"""
        with SessionLocal() as db:
            booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
            if booking:
                booking.booking_status = new_status
                db.commit()

                # ✅ ดึงข้อมูลที่จำเป็นมาเป็น dict เพื่อให้ mutation.py ใช้งานได้
                concert = db.query(Concert).filter(Concert.concert_id == booking.concert_id).first()
                zone = db.query(Zone).filter(Zone.zone_id == booking.zone_id).first()
                seats = db.query(Seat).filter(Seat.zone_id == booking.zone_id).all()
            
                return {
                    "booking_id": booking.booking_id,
                    "user_id": booking.user_id,
                    "concert_name": concert.concert_name if concert else None,
                    "zone_name": zone.zone_name if zone else None,
                    "seat_numbers": [s.seat_number for s in seats],  # ✅ คืนค่า List ของ seat_number
                    "booking_status": booking.booking_status
                }
            return None

    
    @classmethod
    def get_bookings_by_user(cls, user_id: int) -> List[dict]:
        """ดึงข้อมูลการจองของผู้ใช้"""
        with SessionLocal() as db:
            bookings = (
                db.query(
                    Booking.booking_id,
                    Booking.user_id,
                    Booking.booking_status,
                    Booking.concert_id, 
                    Concert.concert_name,
                    Zone.zone_name,
                    func.group_concat(Seat.seat_number).label("seat_numbers"),
                    func.count(Seat.seat_id).label("seat_count"),
                    func.sum(Zone.price).label("total_price")
                )
                .join(Concert, Booking.concert_id == Concert.concert_id)
                .join(Zone, Booking.zone_id == Zone.zone_id)
                .join(Seat, Booking.seat_id == Seat.seat_id)
                .filter(Booking.user_id == user_id)
                .group_by(Booking.booking_id)
                .all()
            )
            return [
                {
                    "booking_id": b.booking_id,
                    "user_id": b.user_id,
                    "concert_id": b.concert_id,
                    "concert_name": b.concert_name,
                    "zone_name": b.zone_name,
                    "seat_numbers": b.seat_numbers.split(",") if b.seat_numbers else [],
                    "seat_count": b.seat_count,
                    "total_price": float(b.total_price),
                    "booking_status": b.booking_status
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
    
    @classmethod
    def create_booking(cls, user_id: int, concert_id: int, zone_id: int, seat_count: int, seat_ids: List[int]) -> Optional[dict]:
        """สร้างการจองและคำนวณราคาตามจำนวนที่นั่ง"""
        with SessionLocal() as db:
            # ดึงราคาของโซน
            zone_price = db.query(Zone.price).filter(Zone.zone_id == zone_id).scalar()
            concert = db.query(Concert).filter(Concert.concert_id == concert_id).first()
            zone = db.query(Zone).filter(Zone.zone_id == zone_id).first()
            
            # คำนวณราคาทั้งหมดของการจอง
            total_price = zone_price * seat_count

            # สร้างข้อมูลการจองใหม่
            new_booking = Booking(
                user_id=user_id,
                concert_id=concert_id,
                zone_id=zone_id,
                seat_id=seat_ids[0],  # เลือกที่นั่งแรกเป็นตัวแทน
                booking_status="pending"
            )
            db.add(new_booking)
            db.commit()
            db.refresh(new_booking)

            return {
                "booking_id": new_booking.booking_id,
                "user_id": new_booking.user_id,
                "concert_id": new_booking.concert_id,
                "concert_name": concert.concert_name,
                "zone_name": zone.zone_name,
                "seat_numbers": [str(seat_id) for seat_id in seat_ids],  # ✅ คืนค่า seat_numbers เป็น list
                "seat_count": seat_count,
                "total_price": float(total_price),
                "booking_status": new_booking.booking_status
            }
            
    @classmethod
    def delete_booking(cls, booking_id: int) -> bool:
        """ลบการจองเมื่อถูกยกเลิก"""
        with SessionLocal() as db:
            booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
            if not booking:
                return False

            # ลบ booking ออกจาก Database
            db.delete(booking)
            db.commit()
            return True  # ✅ คืนค่า True เมื่อสำเร็จ