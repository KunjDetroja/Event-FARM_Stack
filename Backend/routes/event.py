from fastapi import APIRouter,Request
from config.db import conn
from model.event import Organization
from schemas.event import serializeDict,serializeList
from bson import ObjectId

event = APIRouter()

@event.get('/')
async def find_all_organization():
    return serializeList(conn.event.organization.find())

@event.get('/{id}')
async def find_one_organizaton(id):
    return serializeDict(conn.event.organization.find_one({"_id":ObjectId(id)}))

@event.post('/')
async def create_organization(organization:Organization):
    conn.event.organization.insert_one(dict(organization))
    return serializeList(conn.event.organization.find())

@event.put('/{id}')
async def upadate_organizaton(id,organization:Organization):
    conn.event.organization.find_one_and_update({"_id":ObjectId(id)},{"$set":dict(organization)})
    return serializeDict(conn.event.organization.find_one({"_id":ObjectId(id)}))

@event.delete('/{id}')
async def delete_organizaton(id):
    return serializeDict(conn.event.organization.find_one_and_delete({"_id":ObjectId(id)}))