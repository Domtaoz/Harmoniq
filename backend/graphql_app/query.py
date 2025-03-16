import strawberry
from typing import List
from gateway import Gateway
from model import User, Band, Concert, Schedule, Booking, Ticket
from types import UserType, BandType, ConcertType, ScheduleType, BookingType, TicketType

gateway = Gateway()

@strawberry.type
class Query:
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
