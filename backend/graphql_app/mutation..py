import strawberry
from gateway import Gateway
from model import User, Concert, Booking, Seat
from types import UserType, ConcertType, BookingType, SeatType

gateway = Gateway()

@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_user(self, username: str, password: str) -> UserType:
        new_user = User(username=username, password=password)
        return gateway.add_item(new_user)

    @strawberry.mutation
    def update_seat_status(self, seat_id: int, new_status: str) -> SeatType:
        return gateway.update_seat_status(seat_id, new_status)

    @strawberry.mutation
    def update_booking_status(self, booking_id: int, new_status: str) -> BookingType:
        return gateway.update_booking_status(booking_id, new_status)
