from sqlalchemy.orm import Session
from graphql_app.database import SessionLocal
from graphql_app.model import Ticket, Booking, Concert, Zone, Seat, BookingSeat
from typing import Optional, List
from sqlalchemy.sql import func

class TicketGateway:
    @classmethod
    def get_tickets(cls) -> List[Ticket]:
        
        with SessionLocal() as db:
            return db.query(Ticket).all()

    @classmethod
    def get_ticket_by_id(cls, ticket_id: int) -> Optional[Ticket]:
       
        with SessionLocal() as db:
            return db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()

    @classmethod
    def get_tickets_by_user(cls, user_id: int) -> List[dict]:
        
        with SessionLocal() as db:
            tickets = (
            db.query(
                Ticket.ticket_id,
                Ticket.booking_id,
                Ticket.user_id,
                Ticket.ticket_code,
                Ticket.concert_name,
                Ticket.zone_name,
                Ticket.seat_number 
            )
            .filter(Ticket.user_id == user_id)
            .order_by(Ticket.ticket_id.desc())  
            .all()
        )

        db.expire_all() 
        return [
            {
                "ticket_id": t.ticket_id,
                "booking_id": t.booking_id,
                "user_id": t.user_id,
                "ticket_code": t.ticket_code,
                "concert_name": t.concert_name,
                "zone_name": t.zone_name,
                "seat_number": t.seat_number.strip().replace(" ", "").replace(",", "") 
            }
            for t in tickets
        ]






       
    @classmethod
    def create_ticket(cls, booking_id: int, user_id: int, ticket_code: str, concert_name: str, zone_name: str, seat_number: str) -> dict:
      
        with SessionLocal() as db:
            new_ticket = Ticket(
                booking_id=booking_id,
                user_id=user_id,
                ticket_code=ticket_code,  
            )
            db.add(new_ticket)
            db.commit()
            db.refresh(new_ticket)

            return {
                "ticket_id": new_ticket.ticket_id,
                "booking_id": new_ticket.booking_id,
                "user_id": new_ticket.user_id,
                "ticket_code": new_ticket.ticket_code,  
                "concert_name": concert_name,
                "zone_name": zone_name,
                "seat_number": seat_number
            }