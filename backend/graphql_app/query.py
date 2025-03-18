import strawberry
from typing import List, Optional
from user_gateway import UserGateway
from concert_gateway import ConcertGateway
from booking_gateway import BookingGateway
from ticket_gateway import TicketGateway
from zone_gateway import ZoneGateway
from seat_gateway import SeatGateway
from .Types import UserType, ConcertType, ZoneType, SeatType, BookingType, TicketType

@strawberry.type
class Query:
    @strawberry.field
    def get_users(self) -> List[UserType]:
        users = UserGateway.get_users()
        return [
            UserType(
                id=user.id, 
                display_name=user.display_name, 
                username=user.username, 
                profile_picture_url=user.profile_picture_url  
            ) for user in users
        ]

    @strawberry.field
    def get_user_by_id(self, id: int) -> Optional[UserType]:
        user = UserGateway.get_user_by_id(id)
        if user:
            return UserType(
                id=user.id, 
                display_name=user.display_name, 
                username=user.username, 
                profile_picture_url=user.profile_picture_url 
            )
        return None
    
    @strawberry.field
    def get_concerts(self) -> List[ConcertType]:
        """ดึงข้อมูลคอนเสิร์ตทั้งหมด"""
        concerts = ConcertGateway.get_concerts()
        return [
            ConcertType(
                concert_id=c.concert_id,
                concert_name=c.concert_name,
                band_name=c.band_name,
                concert_type=c.concert_type
            ) for c in concerts
        ]


    @strawberry.field
    def get_concert_by_id(self, concert_id: int) -> Optional[ConcertType]:
        """แสดงรายละเอียดคอนเสิร์ตโดยค้นหาจาก concert_id"""
        concert = ConcertGateway.get_concert_by_id(concert_id)
        if concert:
            return ConcertType(
                concert_id=concert["concert_id"],
                concert_name=concert["concert_name"],
                band_name=concert["band_name"],
                concert_type=concert["concert_type"]
            )
        return None

    @strawberry.field
    def get_zones_by_concert(self, concert_id: int) -> List[ZoneType]:
        """แสดงโซนโดยค้นหาจาก concert_id"""
        zones = ZoneGateway.get_zones_by_concert(concert_id)
        return [
            ZoneType(
                zone_id=z["zone_id"],
                concert_id=z["concert_id"],
                zone_name=z["zone_name"],
                price=z["price"]
            ) for z in zones
        ]

    @strawberry.field
    def get_seats_by_concert_zone(self, concert_id: int, zone_name: str) -> List[SeatType]:
        """ค้นหาที่นั่งและแสดงสถานะโดยใช้ concert_id และ zone_name"""
        seats = SeatGateway.get_seats_by_concert_zone(concert_id, zone_name)
        return [
            SeatType(
                seat_id=s["seat_id"],
                concert_id=s["concert_id"],
                zone_name=s["zone_name"],
                seat_number=s["seat_number"],
                seat_status=s["seat_status"]
            ) for s in seats
        ]

    @strawberry.field
    def get_bookings_by_user(self, user_id: int) -> List[BookingType]:
        """ดึงข้อมูลการจองของผู้ใช้จากฐานข้อมูลโดยตรง"""
        bookings = BookingGateway.get_bookings_by_user(user_id)
        return [
        BookingType(
            booking_id=b["booking_id"],
            user_id=b["user_id"],
            concert_id=b["concert_id"],  
            concert_name=b["concert_name"],
            zone_name=b["zone_name"],
            seat_number=", ".join(b["seat_numbers"]) if b["seat_numbers"] else "No seats booked",  # ✅ ป้องกัน error กรณีที่ไม่มีที่นั่ง
            seat_count=b["seat_count"],
            total_price=b["total_price"],
            status=b["booking_status"]
        ) for b in bookings
    ]

    @strawberry.field
    def get_tickets_by_user(self, user_id: int) -> List[TicketType]:
        """ดึงข้อมูลตั๋วของผู้ใช้ที่ชำระเงินแล้ว"""
        tickets = TicketGateway.get_tickets_by_user(user_id)
        return [
        TicketType(
            ticket_id=t["ticket_id"],
            booking_id=t["booking_id"],
            user_id=t["user_id"],
            concert_name=t["concert_name"],
            zone_name=t["zone_name"],
            seat_number=t["seat_number"] if t["seat_number"] else "No seat assigned",  # ✅ ป้องกัน error ถ้าไม่มีที่นั่ง
            ticket_code=t["ticket_code"]
        ) for t in tickets
    ]
        
    @strawberry.field
    def get_ticket_details_by_user(self, user_id: int) -> List[TicketType]:
        """แสดงรายละเอียดตั๋วของผู้ใช้ที่ชำระเงินแล้ว"""
        return self.get_tickets_by_user(user_id)

    
