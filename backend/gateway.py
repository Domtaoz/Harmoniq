from sqlalchemy.orm import Session
from graphql_app.database import SessionLocal
from graphql_app.model import User, Band, Concert, Schedule, Zone, Seat, Booking, Ticket

class Gateway:
    def __init__(self):
        self.db: Session = SessionLocal()

    def get_all(self, model):
        return self.db.query(model).all()

    def get_by_id(self, model, item_id: int):
        return self.db.query(model).filter(model.id == item_id).first()

    def add_item(self, item):
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete_item(self, model, item_id: int):
        item = self.db.query(model).filter(model.id == item_id).first()
        if item:
            self.db.delete(item)
            self.db.commit()
            return True
        return False

    def update_seat_status(self, seat_id: int, new_status: str):
        seat = self.db.query(Seat).filter(Seat.seat_id == seat_id).first()
        if seat:
            seat.status = new_status
            self.db.commit()
            return seat
        return None

    def update_booking_status(self, booking_id: int, new_status: str):
        booking = self.db.query(Booking).filter(Booking.booking_id == booking_id).first()
        if booking:
            booking.status = new_status
            self.db.commit()
            return booking
        return None

    def close(self):
        self.db.close()
