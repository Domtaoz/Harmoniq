from sqlalchemy.orm import Session
from graphql_app.database import SessionLocal
from graphql_app.model import Ticket, Booking, Concert, Zone, Seat, BookingSeat
from typing import Optional, List
from sqlalchemy.sql import func

class TicketGateway:
    @classmethod
    def get_tickets(cls) -> List[Ticket]:
        """ดึงข้อมูลตั๋วทั้งหมด"""
        with SessionLocal() as db:
            return db.query(Ticket).all()

    @classmethod
    def get_ticket_by_id(cls, ticket_id: int) -> Optional[Ticket]:
        """ดึงข้อมูลตั๋วโดย ID"""
        with SessionLocal() as db:
            return db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()

    @classmethod
    def get_tickets_by_user(cls, user_id: int) -> List[dict]:
        """ดึงข้อมูลตั๋วของผู้ใช้จากฐานข้อมูลโดยตรง"""
        with SessionLocal() as db:
        # ✅ ป้องกันข้อมูลซ้ำโดยใช้ DISTINCT และ GROUP BY
            tickets = (
            db.query(
                Ticket.ticket_id,
                Ticket.booking_id,
                Ticket.user_id,
                Ticket.ticket_code,
                Concert.concert_name,
                Zone.zone_name,
                func.group_concat(func.distinct(Seat.seat_number)).label("seat_numbers")  # ✅ รวมที่นั่งในตั๋วเดียวกัน
            )
            .join(Booking, Ticket.booking_id == Booking.booking_id)
            .join(Concert, Booking.concert_id == Concert.concert_id)
            .join(Zone, Booking.zone_id == Zone.zone_id)
            .join(BookingSeat, Booking.booking_id == BookingSeat.booking_id)  # ✅ ใช้ BookingSeat เพื่อดึง seat_id
            .join(Seat, BookingSeat.seat_id == Seat.seat_id)  # ✅ ดึง seat_number จาก seat_id
            .filter(Ticket.user_id == user_id)
            .group_by(Ticket.ticket_id)  # ✅ ป้องกันตั๋วซ้ำ
            .order_by(Ticket.ticket_id.desc())  # ✅ เรียงลำดับใหม่ล่าสุดก่อน
            .all()
        )

        db.expire_all()  # ✅ ล้างค่าแคชใน Session เพื่อให้ดึงข้อมูลใหม่จาก Database
        return [
            {
                "ticket_id": t.ticket_id,
                "booking_id": t.booking_id,
                "user_id": t.user_id,
                "ticket_code": t.ticket_code,
                "concert_name": t.concert_name,
                "zone_name": t.zone_name,
                "seat_numbers": t.seat_numbers.split(",") if t.seat_numbers else ["No seat assigned"],  # ✅ ใช้ seat_numbers
            }
            for t in tickets
        ]

            
    @classmethod
    def create_ticket(cls, booking_id: int, user_id: int, ticket_code: str, concert_name: str, zone_name: str, seat_number: str) -> dict:
        """สร้างตั๋วตามจำนวนที่นั่งที่จอง"""
        with SessionLocal() as db:
            new_ticket = Ticket(
                booking_id=booking_id,
                user_id=user_id,
                ticket_code=ticket_code,  # ✅ ใช้ ticket_code ที่ส่งเข้ามา
            )
            db.add(new_ticket)
            db.commit()
            db.refresh(new_ticket)

            return {
                "ticket_id": new_ticket.ticket_id,
                "booking_id": new_ticket.booking_id,
                "user_id": new_ticket.user_id,
                "ticket_code": new_ticket.ticket_code,  # ✅ ใช้ ticket_code ที่สร้าง
                "concert_name": concert_name,
                "zone_name": zone_name,
                "seat_number": seat_number
            }