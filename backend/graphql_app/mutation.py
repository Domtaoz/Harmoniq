import strawberry
import random
import string
from .model import User, Concert, Booking, Seat
from .Types import UserType, LoginResponse
from user_gateway import UserGateway
from concert_gateway import ConcertGateway
from schedule_gateway import ScheduleGateway
from booking_gateway import BookingGateway
from ticket_gateway import TicketGateway
from seat_gateway import SeatGateway
from .Types import ConcertType, ScheduleType, BookingType, TicketType, SeatType
from .Types import SeatDetailType, BookingDetailType, TicketDetailType
from typing import Optional, List

@strawberry.type
class Mutation:
    
    @strawberry.mutation
    def add_user(self, display_name: str, email: str, password: str, profile_picture_url: Optional[str] = None) -> Optional[UserType]:
        user = UserGateway.add_user(display_name, email, password, profile_picture_url)
        if user:
            return UserType(
                id=user.id, 
                display_name=user.display_name, 
                email=user.email, 
                profile_picture_url=user.profile_picture_url
            )
        return None


    @strawberry.mutation
    def update_user(self, id: int, display_name: Optional[str] = None, email: Optional[str] = None, password: Optional[str] = None, profile_picture_url: Optional[str] = None) -> Optional[UserType]:
        """อัปเดตข้อมูลผู้ใช้"""
        user = UserGateway.update_user(id, display_name, email, password, profile_picture_url)
        if user:
            return UserType(id=user.id, display_name=user.display_name, email=user.email, profile_picture_url=user.profile_picture_url)
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
                email=user.email,
                profile_picture_url=user.profile_picture_url
            )
        return None

    @strawberry.mutation
    def delete_user(self, id: int) -> bool:
        return UserGateway.delete_user(id)

    @strawberry.mutation
    def login_user(self, email: str, password: str) -> LoginResponse:
        # เช็คว่า email หรือ password ไม่มีค่าหรือไม่
        if not email or not password:
            return LoginResponse(success=False, message="Email and password are required", user=None)

        try:
            # เช็คว่า email มีอยู่ในฐานข้อมูลหรือไม่
            user = UserGateway.get_user_by_email(email)

            # ถ้าไม่พบ email ในฐานข้อมูล
            if not user:
                return LoginResponse(success=False, message="Invalid email", user=None)

            # ถ้ามี email แต่รหัสผ่านไม่ถูกต้อง
            if not UserGateway.verify_password(user, password):
                return LoginResponse(success=False, message="Incorrect password", user=None)

            # ถ้ารหัสผ่านถูกต้อง
            return LoginResponse(
            success=True, 
            message="Login successful", 
            user=UserType(
                id=user.id, 
                display_name=user.display_name, 
                email=user.email,
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
    def update_seat_status(self, seat_id: int, new_status: str) -> SeatDetailType:
        """อัปเดตสถานะที่นั่ง"""
        seat = SeatGateway.update_seat_status(seat_id, new_status)
        if seat:
            return SeatDetailType(
                seat_id=seat["seat_id"],
                concert_id=seat["concert_id"],
                zone_name=seat["zone_name"],
                seat_number=seat["seat_number"],
                seat_status=seat["seat_status"]
            )
        return None

    @strawberry.mutation
    def create_booking(self, user_id: int, concert_id: int, zone_id: int, seat_ids: List[int]) -> BookingDetailType:
        """สร้างการจองและระบุจำนวนที่นั่งที่จอง"""
        booking = BookingGateway.create_booking(user_id, concert_id, zone_id, seat_ids)
        if booking:
            return BookingDetailType(
                booking_id=booking["booking_id"],
                user_id=booking["user_id"],
                concert_name=booking["concert_name"],
                zone_name=booking["zone_name"],
                seat_number=", ".join(booking["seat_numbers"]),
                seat_count=booking["seat_count"],
                total_price=booking["total_price"],
                status=booking["booking_status"]
            )
        return None

    @strawberry.mutation
    def update_booking_status(self, booking_id: int, new_status: str) -> Optional[BookingDetailType]:
        """เปลี่ยนสถานะการจอง"""
        if new_status == "cancelled":
            BookingGateway.delete_booking(booking_id)  # ลบการจองถ้ายกเลิก
            return None
        else:
            booking = BookingGateway.update_booking_status(booking_id, new_status)
            if booking:
                return BookingDetailType(
                    booking_id=booking["booking_id"],
                    user_id=booking["user_id"],
                    concert_name=booking["concert_name"],
                    zone_name=booking["zone_name"],
                    seat_number=", ".join(booking["seat_numbers"]),
                    seat_count=booking["seat_count"],
                    total_price=booking["total_price"],
                    status=booking["booking_status"]
                )
        return None

    @strawberry.mutation
    def confirm_payment_and_generate_tickets(self, booking_id: int) -> List[TicketDetailType]:
        """เมื่อชำระเงินแล้ว เปลี่ยนสถานะการจอง และสร้างตั๋ว"""
        tickets = []
        booking = BookingGateway.update_booking_status(booking_id, "confirmed")  # เปลี่ยนเป็น confirmed
        if booking:
            for seat_number in booking["seat_numbers"]:
                ticket_code = "".join(random.choices(string.ascii_uppercase + string.digits, k=10))

                ticket = TicketGateway.create_ticket(
                    booking_id=booking_id,
                    user_id=booking["user_id"],
                    ticket_code=ticket_code,
                    concert_name=booking["concert_name"],
                    zone_name=booking["zone_name"],
                    seat_number=seat_number,
                    show_date=booking["show_date"],
                    start_time=booking["start_time"],
                    end_time=booking["end_time"]
                )
                tickets.append(
                    TicketDetailType(
                        ticket_id=ticket["ticket_id"],
                        booking_id=ticket["booking_id"],
                        ticket_code=ticket["ticket_code"],
                        qr_code=ticket["ticket_barcode"],
                        concert_name=ticket["concert_name"],
                        zone_name=ticket["zone_name"],
                        seat_number=ticket["seat_number"],
                        show_date=ticket["show_date"],
                        start_time=ticket["start_time"],
                        end_time=ticket["end_time"]
                    )
                )
        return tickets