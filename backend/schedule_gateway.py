from sqlalchemy.orm import Session
from .graphql_app.database import SessionLocal
from.graphql_app.model import Schedule
from typing import Optional, List
from datetime import date, time

class ScheduleGateway:
    @classmethod
    def get_schedules(cls) -> List[Schedule]:
        """ดึงข้อมูลรอบคอนเสิร์ตทั้งหมด"""
        with SessionLocal() as db:
            return db.query(Schedule).all()

    @classmethod
    def get_schedule_by_id(cls, schedule_id: int) -> Optional[Schedule]:
        """ดึงข้อมูลรอบคอนเสิร์ตโดย ID"""
        with SessionLocal() as db:
            return db.query(Schedule).filter(Schedule.schedule_id == schedule_id).first()

    @classmethod
    def add_schedule(cls, concert_id: int, show_date: date, start_time: time, end_time: time) -> Optional[Schedule]:
        """เพิ่มรอบคอนเสิร์ตใหม่"""
        with SessionLocal() as db:
            new_schedule = Schedule(concert_id=concert_id, show_date=show_date, start_time=start_time, end_time=end_time)
            db.add(new_schedule)
            db.commit()
            db.refresh(new_schedule)
            return new_schedule

    @classmethod
    def delete_schedule(cls, schedule_id: int) -> bool:
        """ลบรอบคอนเสิร์ต"""
        with SessionLocal() as db:
            schedule = db.query(Schedule).filter(Schedule.schedule_id == schedule_id).first()
            if not schedule:
                return False
            db.delete(schedule)
            db.commit()
            return True
