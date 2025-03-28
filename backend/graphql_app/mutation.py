import strawberry
import random
import string
from .model import User, Concert, Booking, Seat, Zone, BookingSeat, Ticket
from .Types import UserType, LoginResponse
from user_gateway import UserGateway
from concert_gateway import ConcertGateway
from booking_gateway import BookingGateway
from ticket_gateway import TicketGateway
from seat_gateway import SeatGateway
from .Types import BookingType, TicketType, SeatType
from typing import Optional, List
from graphql_app.database import SessionLocal
from sqlalchemy.sql import func


@strawberry.type
class Mutation:
    
    @strawberry.mutation
    def add_user(self, display_name: str, username: str, password: str, profile_picture_url: Optional[str] = None) -> Optional[UserType]:
        user = UserGateway.add_user(display_name, username, password, profile_picture_url)
        if user:
            return UserType(
                id=user.id, 
                display_name=user.display_name, 
                username=user.username, 
                profile_picture_url=user.profile_picture_url
            )
        return None


    @strawberry.mutation
    def update_user(self, id: int, display_name: Optional[str] = None, username: Optional[str] = None, password: Optional[str] = None, profile_picture_url: Optional[str] = None) -> Optional[UserType]:

        user = UserGateway.update_user(id, display_name, username, password, profile_picture_url)
        if user:
            return UserType(id=user.id, display_name=user.display_name, username=user.username, profile_picture_url=user.profile_picture_url)
        return None
    
    @strawberry.mutation
    def update_user_avatar(self, id: int, profile_picture_url: str) -> Optional[UserType]:
        
        if not profile_picture_url or not isinstance(profile_picture_url, str):
            raise ValueError("Invalid profile picture URL")
        
        user = UserGateway.update_user_avatar(id, profile_picture_url.strip()) 
        if user:
            return UserType(
                id=user.id,
                display_name=user.display_name,
                username=user.username,
                profile_picture_url=user.profile_picture_url
            )
        return None

    @strawberry.mutation
    def delete_user(self, id: int) -> bool:
        return UserGateway.delete_user(id)

    @strawberry.mutation
    def login_user(self, username: str, password: str) -> LoginResponse:
        
        if not username or not password:
            return LoginResponse(success=False, message="username and password are required", user=None)

        try:
           
            user = UserGateway.get_user_by_email(username)

            if not user:
                return LoginResponse(success=False, message="Invalid username", user=None)

            if not UserGateway.verify_password(user, password):
                return LoginResponse(success=False, message="Incorrect password", user=None)

            return LoginResponse(
            success=True, 
            message="Login successful", 
            user=UserType(
                id=user.id, 
                display_name=user.display_name, 
                username=user.username,
                profile_picture_url=user.profile_picture_url, 
                request_sent=False
            )
        )

        except ValueError as e:
            # กรณีเกิดข้อผิดพลาดอื่นๆ
            return LoginResponse(success=False, message=str(e), user=None)
     
    @strawberry.mutation    
    def logout_user(self) -> bool:
        
        return True  
    
    
    @strawberry.mutation
    def update_seat_status(self, seat_id: int, new_status: str) -> Optional[SeatType]:
        
        seat = SeatGateway.update_seat_status(seat_id, new_status)
        if seat:
            return SeatType(
                seat_id=seat["seat_id"],
                concert_id=seat["concert_id"],
                zone_id=seat["zone_id"],
                seat_number=seat["seat_number"],
                seat_status=seat["seat_status"]
            )
        return None

    @strawberry.mutation
    def create_booking(self, user_id: int, concert_id: int, zone_id: int, seat_count: int, seat_ids: List[int]) -> Optional[BookingType]:
        """สร้างการจองและบันทึกหลาย seat_id ลง booking_seats"""
 
        if seat_count != len(seat_ids):
            raise ValueError("seat_count ต้องตรงกับจำนวน seat_ids ที่เลือก")
 
        with SessionLocal() as db:
            booked_seats = (
            db.query(Seat)
            .filter(Seat.seat_id.in_(seat_ids), Seat.seat_status == "booked")
            .all()
        )
 
        if booked_seats:
            raise ValueError(f"ที่นั่ง {', '.join([seat.seat_number for seat in booked_seats])} ถูกจองแล้ว กรุณาเลือกที่นั่งอื่น")
 
        new_booking = Booking(
            user_id=user_id,
            concert_id=concert_id,
            zone_id=zone_id,
            booking_status="pending"
        )
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
 
        for seat_id in seat_ids:
            new_booking_seat = BookingSeat(
                booking_id=new_booking.booking_id,
                seat_id=seat_id
            )
            db.add(new_booking_seat)
 
        db.commit()
 
        return BookingType(
            booking_id=new_booking.booking_id,
            user_id=new_booking.user_id,
            concert_id=new_booking.concert_id,
            concert_name=db.query(Concert.concert_name).filter(Concert.concert_id == concert_id).scalar(),
            zone_name=db.query(Zone.zone_name).filter(Zone.zone_id == zone_id).scalar(),
            seat_number=", ".join([str(s) for s in seat_ids]),  
            seat_count=seat_count,
            total_price=db.query(func.sum(Zone.price)).filter(Zone.zone_id == zone_id).scalar() * seat_count,
            status=new_booking.booking_status
        )

    
    @strawberry.mutation
    def update_booking_status(self, booking_id: int, new_status: str) -> Optional[BookingType]:

        with SessionLocal() as db:
            booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
        if not booking:
            return None

        if new_status == "cancelled":
            db.delete(booking)
            db.commit()
            return None

        booking.booking_status = new_status

        if new_status == "confirmed":
            booked_seats = db.query(BookingSeat).filter(BookingSeat.booking_id == booking_id).all()
            for seat in booked_seats:
                seat_info = db.query(Seat).filter(Seat.seat_id == seat.seat_id).first()
                if seat_info:
                    seat_info.seat_status = "booked"  

        db.commit()  

        return BookingType(
            booking_id=booking.booking_id,
            user_id=booking.user_id,
            concert_name=db.query(Concert.concert_name).filter(Concert.concert_id == booking.concert_id).scalar(),
            zone_name=db.query(Zone.zone_name).filter(Zone.zone_id == booking.zone_id).scalar(),
            seat_number=", ".join(
                [db.query(Seat.seat_number).filter(Seat.seat_id == seat.seat_id).scalar() for seat in booked_seats]
            ), 
            seat_count=len(booked_seats),
            total_price=db.query(func.sum(Zone.price)).filter(Zone.zone_id == booking.zone_id).scalar() * len(booked_seats),
            status=booking.booking_status
        )



    @strawberry.mutation
    def confirm_payment_and_generate_tickets(self, booking_id: int) -> List[TicketType]:
       
        with SessionLocal() as db:
            booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
        if not booking:
            return []

        booking.booking_status = "confirmed"
 
        concert_name = db.query(Concert.concert_name).filter(Concert.concert_id == booking.concert_id).scalar()
        zone_name = db.query(Zone.zone_name).filter(Zone.zone_id == booking.zone_id).scalar()

        booked_seats = db.query(BookingSeat).filter(BookingSeat.booking_id == booking_id).all()

        tickets = []
        for seat in booked_seats:
            seat_info = db.query(Seat).filter(Seat.seat_id == seat.seat_id).first()

            if seat_info:
                seat_info.seat_status = "booked"

            ticket_code = "".join(random.choices(string.ascii_uppercase + string.digits, k=10))
            new_ticket = Ticket(
                booking_id=booking_id,
                user_id=booking.user_id,
                seat_id=seat.seat_id,
                ticket_code=ticket_code,
                concert_name=concert_name,
                zone_name=zone_name,
                seat_number=seat_info.seat_number
            )
            db.add(new_ticket)
            db.commit()
            db.refresh(new_ticket)

            tickets.append(TicketType(
                ticket_id=new_ticket.ticket_id,
                booking_id=new_ticket.booking_id,
                user_id=new_ticket.user_id,
                ticket_code=new_ticket.ticket_code,
                concert_name=new_ticket.concert_name,
                zone_name=new_ticket.zone_name,
                seat_number=new_ticket.seat_number
            ))

        return tickets






