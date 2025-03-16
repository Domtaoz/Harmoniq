from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Date, Time, Enum, DECIMAL
from sqlalchemy.orm import declarative_base
import enum

Base = declarative_base()

class SeatStatus(enum.Enum):
    available = "available"
    booked = "booked"

class BookingStatus(enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

class Band(Base):
    __tablename__ = "bands"
    band_id = Column(Integer, primary_key=True, index=True)
    band_name = Column(String, unique=True, nullable=False)
    genre = Column(JSON, nullable=False)  # เช่น ["Rock", "Pop"]
    members = Column(JSON, nullable=False)  # เช่น [{"name": "John", "role": "Vocal"}]

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
