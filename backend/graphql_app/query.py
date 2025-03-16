import strawberry
from typing import List, Optional
from user_gateway import UserGateway
from .model import User, Band, Concert, Schedule, Booking, Ticket
from concert_gateway import ConcertGateway
from schedule_gateway import ScheduleGateway
from booking_gateway import BookingGateway
from ticket_gateway import TicketGateway
from seat_gateway import SeatGateway
from .Types import UserType, ConcertType, ScheduleType, BookingType, TicketType, SeatType
from .Types import SeatDetailType, BookingDetailType, TicketDetailType

@strawberry.type
class Query:
    @strawberry.field
    def get_users(self) -> List[UserType]:
        users = UserGateway.get_users()
        print("🔍 DEBUG: Messages Retrieved ->")
        return [
            UserType(
                id=user.id, 
                display_name=user.display_name, 
                email=user.email, 
                profile_picture_url=user.profile_picture_url  
            ) 
            for user in users
        ]

    @strawberry.field
    def get_user_by_id(self, id: int) -> Optional[UserType]:
        user = UserGateway.get_user_by_id(id)
        if user:
            return UserType(
                id=user.id, 
                display_name=user.display_name, 
                email=user.email, 
                profile_picture_url=user.profile_picture_url 
            )
        return None

    @strawberry.field
    def concerts(self) -> List[ConcertType]:
        return ConcertGateway.get_concerts()

    @strawberry.field
    def schedules(self) -> List[ScheduleType]:
        return ScheduleGateway.get_schedules()

    @strawberry.field
    def bookings(self) -> List[BookingType]:
        return BookingGateway.get_bookings()

    @strawberry.field
    def tickets(self) -> List[TicketType]:
        return TicketGateway.get_tickets()
    
    @strawberry.field
    def get_seats_by_concert(self, concert_id: int) -> List[SeatType]:
        return SeatGateway.get_seats_by_concert(concert_id)

    @strawberry.field
    def get_seat_status(self, seat_id: int) -> Optional[str]:
        return SeatGateway.get_seat_status(seat_id)
    
    @strawberry.field
    def get_seats_by_concert_zone(self, concert_name: str, zone_name: str) -> List[SeatDetailType]:
        seats = SeatGateway.get_seats_by_concert_zone(concert_name, zone_name)
        return [
            SeatDetailType(
                seat_id=seat.seat_id,
                concert_name=concert_name,
                zone_name=zone_name,
                seat_number=seat.seat_number,
                status=seat.status
            ) for seat in seats
        ]
        
    @strawberry.field
    def get_bookings_by_user(self, user_id: int) -> List[BookingDetailType]:
        bookings = BookingGateway.get_bookings_by_user(user_id)
        return [
            BookingDetailType(
                booking_id=booking.booking_id,
                user_id=booking.user_id,
                concert_id=booking.concert_id,
                schedule_id=booking.schedule_id,
                status=booking.status
            ) for booking in bookings
        ]

    @strawberry.field
    def get_tickets_by_user(self, user_id: int) -> List[TicketDetailType]:
        tickets = TicketGateway.get_tickets_by_user(user_id)
        return [
            TicketDetailType(
                ticket_id=ticket.ticket_id,
                booking_id=ticket.booking_id,
                ticket_code=ticket.ticket_code,
                qr_code=ticket.qr_code
            ) for ticket in tickets
        ]