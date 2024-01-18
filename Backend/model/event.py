from typing import List
from pydantic import BaseModel



class Organization(BaseModel):
    name : str
    since : int
    members : list
    