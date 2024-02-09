from pydantic import BaseModel
from typing import Optional
from datetime import datetime,date

class User(BaseModel):
    name: str
    email: str
    pnumber: int
    gender: str
    username: str
    pwd: str
    memberid: Optional[str] = None
    membertype : Optional[str] = "Public"
    clubname : Optional[str] = None
    start_date : Optional[date] = None  
    expiry_date : Optional[date] = None


class Organization(BaseModel):
    clubname: str
    ownname: str
    logo : str
    background_image : str
    email: str
    address: str
    city: str
    pnumber: int
    desc: str
    memtype: list
    members: list
    memapplied : Optional[list] = []
    feedback : Optional[list] = []
    username: str
    pwd: str

class EventPost(BaseModel):
    clubname: str
    type : str
    event_title: str
    event_image: str
    event_start_date: date
    event_end_date: date
    start_time: str
    end_time: str
    venue_name: str
    venue_address: str
    venue_city: str
    ticket_price: float
    event_highlight: str
    event_desc: str
    event_organizer_name: str
    event_organizer_email: str
    event_organizer_pnumber: int
    participate : Optional[list] = []
    feedback : Optional[list] = []
    