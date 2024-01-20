from fastapi import APIRouter
from config.db import conn
from model.event import *
from schemas.event import serializeDict,serializeList
from bson import ObjectId

event = APIRouter()

@event.get('/')
async def find_all_organization():
    return serializeList(conn.event.organization.find())


@event.get('/{id}')
async def find_one_organizaton(id):
    return serializeDict(conn.event.organization.find_one({"_id":ObjectId(id)}))

@event.get("/clubnames/")
async def get_clubnames():
    clubname = ['None']
    cursor = conn.event.organization.find({}, {'clubname': 1, '_id': 0})
    for i in serializeList(cursor):
        clubname.append(i['clubname'])
    return clubname


@event.post('/organisationsignup/')
async def create_organization(organization:Organization):
    conn.event.organization.insert_one(dict(organization))
    return serializeList(conn.event.organization.find())

@event.post('/usersignup/')
async def create_user(user:User):
    conn.event.user.insert_one(dict(user))
    return serializeList(conn.event.user.find())

@event.post("/organisationlogin/")
async def organization_login(data : dict):
    d1 = conn.event.organization.find_one({'username':data['username']})
    if d1 and d1['pwd'] == data['pwd']:
        return serializeDict(d1)
    else:
        return False
    
@event.post('/userlogin/')
async def check_user(data:dict):
    org1 = conn.event.organization.find_one({"clubname":data["clubname"]})
    flag=0
    d1= {}
    if org1:
        membersList = org1.get("members", [])
        for singleDict in membersList:
            # if (singleDict['username'] == data['username']) and (singleDict['pwd'] == data['pwd']):
            if (singleDict.get("username") == data["username"] and singleDict.get("pwd") == data["pwd"]):
                flag =1
                d1 = serializeDict(singleDict)
                dummy = d1.copy()
                dummy["memberid"] = d1.get("mId", "")
                dummy["membertype"] = d1.get("memtype", "")
                dummy["clubname"] = data["clubname"]
                del dummy['mId']
                del dummy['loginedIn']
                del dummy['memtype']
                conn.event.user.insert_one(dummy)
                
                break
        if flag == 0:
            return {"data":"sorry there is no member"}
        else:
            return d1
    elif data['clubname'] == "None":
        d2 = conn.event.user.find_one({"$and": [{"username":data["username"]},{"pwd":data['pwd']}]})
        if d2:
            return serializeDict(d2)
        else:
            return {"data":"No account of this username and password"}
    


@event.put('/{id}')
async def upadate_organizaton(id,organization:Organization):
    conn.event.organization.find_one_and_update({"_id":ObjectId(id)},{"$set":dict(organization)})
    return serializeDict(conn.event.organization.find_one({"_id":ObjectId(id)}))

@event.delete('/{id}')
async def delete_organizaton(id):
    return serializeDict(conn.event.organization.find_one_and_delete({"_id":ObjectId(id)}))