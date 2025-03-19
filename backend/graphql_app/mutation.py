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
        """อัปเดตข้อมูลผู้ใช้"""
        user = UserGateway.update_user(id, display_name, username, password, profile_picture_url)
        if user:
            return UserType(id=user.id, display_name=user.display_name, username=user.username, profile_picture_url=user.profile_picture_url)
        return None
    
    @strawberry.mutation
    def update_user_avatar(self, id: int, profile_picture_url: str) -> Optional[UserType]:
        """อัปเดตรูปโปรไฟล์ของผู้ใช้"""
        
        # ตรวจสอบว่าค่า URL มีการส่งเข้ามาจริง
        if not profile_picture_url or not isinstance(profile_picture_url, str):
            raise ValueError("Invalid profile picture URL")
        
        user = UserGateway.update_user_avatar(id, profile_picture_url.strip()) # Trim ช่องว่างก่อนบันทึก
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
        # เช็คว่า username หรือ password ไม่มีค่าหรือไม่
        if not username or not password:
            return LoginResponse(success=False, message="username and password are required", user=None)

        try:
            # เช็คว่า username มีอยู่ในฐานข้อมูลหรือไม่
            user = UserGateway.get_user_by_email(username)

            # ถ้าไม่พบ username ในฐานข้อมูล
            if not user:
                return LoginResponse(success=False, message="Invalid username", user=None)

            # ถ้ามี username แต่รหัสผ่านไม่ถูกต้อง
            if not UserGateway.verify_password(user, password):
                return LoginResponse(success=False, message="Incorrect password", user=None)

            # ถ้ารหัสผ่านถูกต้อง
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
        """ ออกจากระบบ (Logout) """
        # ถ้ามีระบบ Session ต้องทำการลบ Session ที่นี่ (เช่น Redis หรือ Database)
        # ถ้ามีระบบ JWT ให้ลบ Token หรือทำให้ Token ใช้ไม่ได้ (เช่น Blacklist)
        return True  # ✅ คืนค่า success = Tru
    
    
    @strawberry.mutation
    def update_seat_status(self, seat_id: int, new_status: str) -> Optional[SeatType]:
        """อัปเดตสถานะที่นั่ง"""
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
            # ✅ ตรวจสอบว่าทุก seat_id ต้องเป็น "available"
            booked_seats = (
            db.query(Seat)
            .filter(Seat.seat_id.in_(seat_ids), Seat.seat_status == "booked")
            .all()
        )

        if booked_seats:
            raise ValueError(f"ที่นั่ง {', '.join([seat.seat_number for seat in booked_seats])} ถูกจองแล้ว กรุณาเลือกที่นั่งอื่น")

        # ✅ สร้าง Booking ใหม่
        new_booking = Booking(
            user_id=user_id,
            concert_id=concert_id,
            zone_id=zone_id,
            booking_status="pending"
        )
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)

        # ✅ เพิ่มที่นั่งไปที่ booking_seats
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
            seat_number=", ".join([str(s) for s in seat_ids]),  # ✅ ให้ seat_number เก็บเป็น string
            seat_count=seat_count,
            total_price=db.query(func.sum(Zone.price)).filter(Zone.zone_id == zone_id).scalar() * seat_count,
            status=new_booking.booking_status
        )


    
    @strawberry.mutation
    def update_booking_status(self, booking_id: int, new_status: str) -> Optional[BookingType]:
        """เปลี่ยนสถานะการจอง"""
        with SessionLocal() as db:
            booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
        if not booking:
            return None  # ✅ ถ้าไม่เจอ booking ให้คืนค่า None

        # ✅ ถ้าสถานะเป็น "cancelled" → ลบ booking
        if new_status == "cancelled":
            db.delete(booking)
            db.commit()
            return None

        # ✅ อัปเดต booking_status เป็น new_status
        booking.booking_status = new_status

        # ✅ ถ้าเปลี่ยนเป็น "confirmed" → เปลี่ยน seat_status เป็น "booked"
        if new_status == "confirmed":
            booked_seats = db.query(BookingSeat).filter(BookingSeat.booking_id == booking_id).all()
            for seat in booked_seats:
                seat_info = db.query(Seat).filter(Seat.seat_id == seat.seat_id).first()
                if seat_info:
                    seat_info.seat_status = "booked"  # ✅ เปลี่ยนสถานะที่นั่งเป็น "booked"

        db.commit()  # ✅ Commit ทุกการเปลี่ยนแปลงที่เกิดขึ้น

        return BookingType(
            booking_id=booking.booking_id,
            user_id=booking.user_id,
            concert_name=db.query(Concert.concert_name).filter(Concert.concert_id == booking.concert_id).scalar(),
            zone_name=db.query(Zone.zone_name).filter(Zone.zone_id == booking.zone_id).scalar(),
            seat_number=", ".join(
                [db.query(Seat.seat_number).filter(Seat.seat_id == seat.seat_id).scalar() for seat in booked_seats]
            ),  # ✅ ดึง seat_number จาก booking_seats
            seat_count=len(booked_seats),
            total_price=db.query(func.sum(Zone.price)).filter(Zone.zone_id == booking.zone_id).scalar() * len(booked_seats),
            status=booking.booking_status
        )



    @strawberry.mutation
    def confirm_payment_and_generate_tickets(self, booking_id: int) -> List[TicketType]:
        """เปลี่ยนสถานะการจองและสร้างตั๋วเฉพาะที่นั่งที่จองไว้"""
        with SessionLocal() as db:
        # ✅ ดึง Booking และเปลี่ยนสถานะเป็น "confirmed"
            booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
        if not booking:
            return []

        booking.booking_status = "confirmed"

        # ✅ ดึงข้อมูลโซนและคอนเสิร์ตจาก booking
        concert_name = db.query(Concert.concert_name).filter(Concert.concert_id == booking.concert_id).scalar()
        zone_name = db.query(Zone.zone_name).filter(Zone.zone_id == booking.zone_id).scalar()

        # ✅ ดึงรายการที่นั่งจาก booking_seats
        booked_seats = db.query(BookingSeat).filter(BookingSeat.booking_id == booking_id).all()

        tickets = []
        for seat in booked_seats:
            seat_info = db.query(Seat).filter(Seat.seat_id == seat.seat_id).first()

            # ✅ เปลี่ยน seat_status เป็น "booked"
            if seat_info:
                seat_info.seat_status = "booked"

            # ✅ สร้าง ticket_code และออกตั๋ว
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

            # ✅ คืนค่าเป็น TicketType แทน dict
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






