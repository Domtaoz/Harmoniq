import strawberry
from typing import List
from gateway import Gateway
from model import User, Concert, Schedule, Booking, Seat
from types import UserType, ConcertType, ScheduleType, BookingType, SeatType

gateway = Gateway()

@strawberry.type
class Query:
    @strawberry.field
    def users(self) -> List[UserType]:
        return gateway.get_all(User)

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
    def seats(self) -> List[SeatType]:
        return gateway.get_all(Seat)
