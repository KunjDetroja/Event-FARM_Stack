from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    name: str
    email: str
    pnumber: int
    gender: str
    username: str
    pwd: str
    memberid: Optional[str] = None
    membertype : Optional[str] = None
    org_register : bool = False
    clubname : Optional[str] = None


class Organization(BaseModel):
    clubname: str
    ownname: str
    email: str
    address: str
    city: str
    pnumber: int
    desc: str
    memtype: list
    members: list
    username: str
    pwd: str
    