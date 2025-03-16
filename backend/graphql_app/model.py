from sqlalchemy import JSON, Column, DECIMAL, Integer, String, DateTime, Date, Time, Boolean, ForeignKey, Enum, UniqueConstraint, CheckConstraint, Text
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func
import enum

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    display_name = Column(String(255), nullable=True)
    username = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    password_updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())
    reset_token = Column(String(100), nullable=True, default=None)
    created_at = Column(DateTime, nullable=False, default=func.now())

    profile_picture_url = Column(
        String(500), 
        nullable=False, 
        default="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp"
    )

    def __repr__(self):
        return f"<User(id={self.id}, display_name={self.display_name}, email={self.email})>"

class SeatStatus(enum.Enum):
    available = "available"
    booked = "booked"

class BookingStatus(enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"

class Band(Base):
    __tablename__ = "bands"
    band_id = Column(Integer, primary_key=True, index=True)
    band_name = Column(String, unique=True, nullable=False)
    genre = Column(JSON, nullable=False)  
    members = Column(JSON, nullable=False)  

class Concert(Base):
    __tablename__ = "concerts"
    concert_id = Column(Integer, primary_key=True, index=True)
    band_id = Column(Integer, ForeignKey("bands.band_id"), nullable=False)
    concert_name = Column(String, nullable=False)
    gate = Column(String, nullable=False)

class Schedule(Base):
    __tablename__ = "schedules"
    schedule_id = Column(Integer, primary_key=True, index=True)
    concert_id = Column(Integer, ForeignKey("concerts.concert_id"), nullable=False)
    show_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

class Zone(Base):
    __tablename__ = "zones"
    zone_id = Column(Integer, primary_key=True, index=True)
    concert_id = Column(Integer, ForeignKey("concerts.concert_id"), nullable=False)
    zone_name = Column(String, nullable=False)
    price = Column(DECIMAL, nullable=False)
    capacity = Column(Integer, nullable=False)

class Seat(Base):
    __tablename__ = "seats"
    seat_id = Column(Integer, primary_key=True, index=True)
    concert_id = Column(Integer, ForeignKey("concerts.concert_id"), nullable=False)
    zone_id = Column(Integer, ForeignKey("zones.zone_id"), nullable=False)
    seat_number = Column(String, nullable=False)
    status = Column(Enum(SeatStatus), default=SeatStatus.available)

class Booking(Base):
    __tablename__ = "bookings"
    booking_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    concert_id = Column(Integer, ForeignKey("concerts.concert_id"), nullable=False)
    schedule_id = Column(Integer, ForeignKey("schedules.schedule_id"), nullable=False)
    seat_id = Column(Integer, ForeignKey("seats.seat_id"), nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.pending)

class Ticket(Base):
    __tablename__ = "tickets"
    ticket_id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.booking_id"), nullable=False)
    ticket_code = Column(String, unique=True, nullable=False)
    qr_code = Column(String, nullable=False)
