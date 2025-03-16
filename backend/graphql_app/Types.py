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
class ConcertType:
    concert_id: int
    concert_name: str
    band_name: str
    concert_type: str

@strawberry.type
class ZoneType:
    zone_id: int
    concert_id: int
    zone_name: str
    price: float

@strawberry.type
class SeatType:
    seat_id: int
    concert_id: int
    zone_id: int
    seat_number: str
    seat_status: str

@strawberry.type
class BookingType:
    booking_id: int
    user_id: int
    concert_id: int
    zone_id: int
    seat_id: int
    booking_status: str

@strawberry.type
class TicketType:
    ticket_id: int
    booking_id: int
    user_id: int
    ticket_code: str