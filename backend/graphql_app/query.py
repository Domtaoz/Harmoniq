import strawberry
from typing import List, Optional
from gateway import Gateway
from user_gateway import UserGateway
from model import User, Band, Concert, Schedule, Booking, Ticket
from types import UserType, BandType, ConcertType, ScheduleType, BookingType, TicketType

gateway = Gateway()

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
    def users(self) -> List[UserType]:
        return gateway.get_all(User)

    @strawberry.field
    def bands(self) -> List[BandType]:
        return gateway.get_all(Band)

    @strawberry.field
    def concerts(self) -> List[ConcertType]:
        return gateway.get_all(Concert)

    @strawberry.field
    def schedules(self) -> List[ScheduleType]:
        return gateway.get_all(Schedule)

    @strawberry.field
    def bookings(self) -> List[BookingType]:
        return gateway.get_all(Booking)

    @strawberry.field
    def tickets(self) -> List[TicketType]:
        return gateway.get_all(Ticket)
