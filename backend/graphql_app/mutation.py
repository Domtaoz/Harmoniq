import strawberry
from .model import User, Concert, Booking, Seat
from .Types import UserType, LoginResponse
from user_gateway import UserGateway
from concert_gateway import ConcertGateway
from schedule_gateway import ScheduleGateway
from booking_gateway import BookingGateway
from ticket_gateway import TicketGateway
from seat_gateway import SeatGateway
from .Types import ConcertType, ScheduleType, BookingType, TicketType, SeatType, SeatDetailType
from typing import Optional

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
    def add_concert(self, band_id: int, concert_name: str, gate: str) -> ConcertType:
        return ConcertGateway.add_concert(band_id, concert_name, gate)

    @strawberry.mutation
    def add_schedule(self, concert_id: int, show_date: str, start_time: str, end_time: str) -> ScheduleType:
        return ScheduleGateway.add_schedule(concert_id, show_date, start_time, end_time)

    @strawberry.mutation
    def update_booking_status(self, booking_id: int, new_status: str) -> BookingType:
        return BookingGateway.update_booking_status(booking_id, new_status)

    @strawberry.mutation
    def delete_concert(self, concert_id: int) -> bool:
        return ConcertGateway.delete_concert(concert_id)

    @strawberry.mutation
    def delete_schedule(self, schedule_id: int) -> bool:
        return ScheduleGateway.delete_schedule(schedule_id)
    
    @strawberry.mutation
    def update_seat_status(self, seat_id: int, new_status: str) -> SeatType:
        return SeatGateway.update_seat_status(seat_id, new_status)
    
    @strawberry.mutation
    def update_seat_status(self, concert_name: str, zone_name: str, seat_number: str, new_status: str) -> SeatDetailType:
        seat = SeatGateway.update_seat_status(concert_name, zone_name, seat_number, new_status)
        if seat:
            return SeatDetailType(
                seat_id=seat.seat_id,
                concert_name=concert_name,
                zone_name=zone_name,
                seat_number=seat.seat_number,
                status=seat.status
            )
        return None