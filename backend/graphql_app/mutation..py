import strawberry
from gateway import Gateway
from model import User, Concert, Schedule, Booking, Seat
from types import UserType, ConcertType, ScheduleType, BookingType, SeatType

gateway = Gateway()

@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_user(self, username: str, password: str) -> UserType:
        new_user = User(username=username, password=password)
        return gateway.add_item(new_user)

    @strawberry.mutation
    def add_concert(self, band_id: int, concert_name: str, gate: str) -> ConcertType:
        new_concert = Concert(band_id=band_id, concert_name=concert_name, gate=gate)
        return gateway.add_item(new_concert)

    @strawberry.mutation
    def update_seat_status(self, seat_id: int, new_status: str) -> SeatType:
        return gateway.update_seat_status(seat_id, new_status)

    @strawberry.mutation
    def update_booking_status(self, booking_id: int, new_status: str) -> BookingType:
        return gateway.update_booking_status(booking_id, new_status)
