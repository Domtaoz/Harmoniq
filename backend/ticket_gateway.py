from sqlalchemy.orm import Session
from graphql_app.database import SessionLocal
from graphql_app.model import Ticket, Booking, Concert, Zone, Seat, Schedule
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
    
    @classmethod
    def get_tickets_by_user(cls, user_id: int) -> List[dict]:
        """ดึงข้อมูลตั๋วของผู้ใช้ที่ชำระเงินแล้ว พร้อม show_date, start_time และ end_time"""
        with SessionLocal() as db:
            tickets = (
                db.query(
                    Ticket.ticket_id,
                    Ticket.ticket_code,
                    Ticket.qr_code,
                    Booking.booking_id,
                    Concert.concert_name,
                    Zone.zone_name,
                    Seat.seat_number,
                    Schedule.show_date,
                    Schedule.start_time,
                    Schedule.end_time
                )
                .join(Booking, Ticket.booking_id == Booking.booking_id)
                .join(Concert, Booking.concert_id == Concert.concert_id)
                .join(Zone, Seat.zone_id == Zone.zone_id)
                .join(Seat, Booking.seat_id == Seat.seat_id)
                .join(Schedule, Booking.schedule_id == Schedule.schedule_id)
                .filter(Booking.user_id == user_id, Booking.status == "confirmed")
                .all()
            )
            return [
                {
                    "ticket_id": t.ticket_id,
                    "ticket_code": t.ticket_code,
                    "qr_code": t.qr_code,
                    "booking_id": t.booking_id,
                    "concert_name": t.concert_name,
                    "zone_name": t.zone_name,
                    "seat_number": t.seat_number,
                    "show_date": t.show_date.strftime("%Y-%m-%d"),
                    "start_time": t.start_time.strftime("%H:%M"),
                    "end_time": t.end_time.strftime("%H:%M")
                }
                for t in tickets
            ]