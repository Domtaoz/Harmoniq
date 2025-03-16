import strawberry
from datetime import date, time
from typing import List, Optional

@strawberry.type
class UserType:
    id: int
    display_name: str
    email: str
    profile_picture_url: str
    request_sent: bool = False
    request_received: bool = False
    is_friend: bool = False
    
@strawberry.type
class LoginResponse:
    success: bool
    message: str
    user: Optional[UserType]

@strawberry.type
class BandType:
    band_id: int
    band_name: str
    genre: List[str]
    members: List[dict]

@strawberry.type
class ConcertType:
    concert_id: int
    band_id: int
    concert_name: str
    gate: str

@strawberry.type
class ScheduleType:
    schedule_id: int
    concert_id: int
    show_date: date
    start_time: time
    end_time: time

@strawberry.type
class ZoneType:
    zone_id: int
    concert_id: int
    zone_name: str
    price: float
    capacity: int

@strawberry.type
class SeatType:
    seat_id: int
    concert_id: int
    zone_id: int
    seat_number: str
    status: str

@strawberry.type
class BookingType:
    booking_id: int
    user_id: int
    concert_id: int
    schedule_id: int
    seat_id: int
    status: str

@strawberry.type
class TicketType:
    ticket_id: int
    booking_id: int
    ticket_code: str
    qr_code: str
    
@strawberry.type
class SeatType:
    seat_id: int
    concert_id: int
    zone_id: int
    seat_number: str
    status: str
    
@strawberry.type
class SeatDetailType:
    seat_id: int
    concert_name: str
    zone_name: str
    seat_number: str
    status: str

@strawberry.type
class BookingDetailType:
    booking_id: int
    user_id: int
    concert_id: int
    schedule_id: int
    status: str  # pending, confirmed, cancelled
    

@strawberry.type
class TicketDetailType:
    ticket_id: int
    booking_id: int
    ticket_code: str
    qr_code: str