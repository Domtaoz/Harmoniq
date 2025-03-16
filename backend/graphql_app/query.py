import strawberry
from typing import List, Optional
from user_gateway import UserGateway
from model import User, Band, Concert, Schedule, Booking, Ticket
from concert_gateway import ConcertGateway
from schedule_gateway import ScheduleGateway
from booking_gateway import BookingGateway
from ticket_gateway import TicketGateway
from types import UserType, ConcertType, ScheduleType, BookingType, TicketType

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