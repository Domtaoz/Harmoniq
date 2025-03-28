import random
import string
from sqlalchemy.orm import Session
from graphql_app.database import SessionLocal
from graphql_app.model import Booking, Ticket, Concert, Zone, Seat, BookingSeat
from typing import Optional, List
from sqlalchemy.sql import func

class BookingGateway:
    @classmethod
    def get_bookings(cls) -> List[Booking]:
       
        with SessionLocal() as db:
            return db.query(Booking).all()

    @classmethod
    def get_booking_by_id(cls, booking_id: int) -> Optional[Booking]:
        
        with SessionLocal() as db:
            return db.query(Booking).filter(Booking.booking_id == booking_id).first()

    @classmethod
    def update_booking_status(cls, booking_id: int, new_status: str) -> Optional[dict]:
     
        with SessionLocal() as db:
            booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
            if booking:
                booking.booking_status = new_status
                db.commit()

                concert = db.query(Concert).filter(Concert.concert_id == booking.concert_id).first()
                zone = db.query(Zone).filter(Zone.zone_id == booking.zone_id).first()
                seats = db.query(Seat).filter(Seat.zone_id == booking.zone_id).all()
            
                return {
                    "booking_id": booking.booking_id,
                    "user_id": booking.user_id,
                    "concert_name": concert.concert_name if concert else None,
                    "zone_name": zone.zone_name if zone else None,
                    "seat_numbers": [s.seat_number for s in seats], 
                    "booking_status": booking.booking_status
                }
            return None

    @classmethod
    def get_bookings_by_user(cls, user_id: int) -> List[dict]:
       
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
                func.count(BookingSeat.seat_id).label("seat_count"),
                func.sum(Zone.price).label("total_price")
            )
            .join(Concert, Booking.concert_id == Concert.concert_id)
            .join(Zone, Booking.zone_id == Zone.zone_id)
            .join(BookingSeat, Booking.booking_id == BookingSeat.booking_id)  
            .join(Seat, BookingSeat.seat_id == Seat.seat_id)  
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
    def confirm_payment(cls, booking_id: int) -> Optional[List[Ticket]]:
        """เมื่อชำระเงินแล้ว → เปลี่ยนสถานะการจอง และออกตั๋ว"""
        with SessionLocal() as db:
            booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
        if booking and booking.booking_status == "pending":  
           
            booking.booking_status = "confirmed"
            db.commit()

         
            booked_seats = db.query(BookingSeat).filter(BookingSeat.booking_id == booking_id).all()

            tickets = []
            for seat in booked_seats:
                seat_info = db.query(Seat).filter(Seat.seat_id == seat.seat_id).first()

                seat_info.seat_status = "booked"
                db.commit()

                ticket_code = "".join(random.choices(string.ascii_uppercase + string.digits, k=10))
                qr_code = "".join(random.choices(string.ascii_letters + string.digits, k=20))

                new_ticket = Ticket(
                    booking_id=booking_id,
                    user_id=booking.user_id,
                    seat_id=seat.seat_id,  
                    ticket_code=ticket_code
                )
                db.add(new_ticket)
                db.commit()
                db.refresh(new_ticket)

                tickets.append(new_ticket)

            return tickets
        return None
    
    @classmethod
    def create_booking(cls, user_id: int, concert_id: int, zone_id: int, seat_ids: List[int]) -> Optional[dict]:
       
        if not seat_ids:
            raise ValueError("ต้องเลือกที่นั่งอย่างน้อย 1 ที่")
 
        with SessionLocal() as db:
            booked_seats = (
            db.query(Seat)
            .filter(Seat.seat_id.in_(seat_ids), Seat.seat_status == "booked")
            .all()
        )
 
        if booked_seats:
            raise ValueError(f"ที่นั่ง {', '.join([seat.seat_number for seat in booked_seats])} ถูกจองแล้ว กรุณาเลือกที่นั่งอื่น")
 
        new_booking = Booking(
            user_id=user_id,
            concert_id=concert_id,
            zone_id=zone_id,
            booking_status="pending"
        )
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
 
        for seat_id in seat_ids:
            new_booking_seat = BookingSeat(
                booking_id=new_booking.booking_id,
                seat_id=seat_id
            )
            db.add(new_booking_seat)
 
        db.commit()
 
        return {
            "booking_id": new_booking.booking_id,
            "user_id": new_booking.user_id,
            "concert_id": new_booking.concert_id,
            "concert_name": db.query(Concert.concert_name).filter(Concert.concert_id == concert_id).scalar(),
            "zone_name": db.query(Zone.zone_name).filter(Zone.zone_id == zone_id).scalar(),
            "seat_numbers": seat_ids,
            "seat_count": len(seat_ids),
            "total_price": db.query(func.sum(Zone.price)).filter(Zone.zone_id == zone_id).scalar() * len(seat_ids),
            "booking_status": new_booking.booking_status
        }

            
    @classmethod
    def delete_booking(cls, booking_id: int) -> bool:
        """ลบการจองเมื่อถูกยกเลิก"""
        with SessionLocal() as db:
            booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
            if not booking:
                return False

            db.delete(booking)
            db.commit()
            return True  