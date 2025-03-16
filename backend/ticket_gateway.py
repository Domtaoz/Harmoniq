from sqlalchemy.orm import Session
from graphql_app.database import SessionLocal
from graphql_app.model import Ticket, Booking
from typing import Optional, List

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
    
    def get_tickets_by_user(cls, user_id: int) -> List[Ticket]:
        """ดึงข้อมูลตั๋วของผู้ใช้ที่ชำระเงินแล้ว"""
        with SessionLocal() as db:
            return (
                db.query(Ticket)
                .join(Booking, Ticket.booking_id == Booking.booking_id)
                .filter(Booking.user_id == user_id, Booking.status == "confirmed")
                .all()
            )