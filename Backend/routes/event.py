from fastapi import APIRouter,HTTPException
from config.db import conn
from model.event import *
from schemas.event import serializeDict,serializeList
from bson import ObjectId

event = APIRouter()

@event.get('/')
async def home():
    return {"message": "Welcome to the home page"}

@event.get('/getorganization')
async def find_all_organization():
    return serializeList(conn.event.organization.find())


@event.get('/organization/{id}')
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
    flag=0
    d1= {}
    u1 = conn.event.user.find_one({"$and": [{"username":data["username"]},{"pwd":data['pwd']},{"clubname":data['clubname']}]})
    u2 = conn.event.user.find_one({"$and": [{"username":data["username"]},{"pwd":data['pwd']}]})
    u3 = serializeDict(conn.event.organization.find_one({"clubname":data["clubname"]}))
    if u1:
        return serializeDict(u1)
    elif u2:
        return serializeDict(u2)
    elif u3:
        membersList = u3['members']
        for singleDict in membersList:
            if (singleDict['username'] == data['username']) and (singleDict['pwd'] == data['pwd']):
                flag =1
                d1 = singleDict
                dummy = d1
                dummy["memberid"] = d1["mId"]
                dummy["membertype"] = d1["memtype"]
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
    else : 
        print('falseeee che bhai')
    
@event.post('/eventpost/')
async def event_post(data : EventPost):
    try:
        # Directly assign datetime.date objects
        data_dict = dict(data)
        data_dict["event_start_date"] = data_dict["event_start_date"].strftime("%Y-%m-%d")
        data_dict["event_end_date"] = data_dict["event_end_date"].strftime("%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid date format. Use 'yyyy-mm-dd'.")

    # Insert data into the database
    conn.event.post.insert_one(data_dict)

    return {"message": "Event data successfully submitted"}

@event.put('/{id}')
async def upadate_organizaton(id,organization:Organization):
    conn.event.organization.find_one_and_update({"_id":ObjectId(id)},{"$set":dict(organization)})
    return serializeDict(conn.event.organization.find_one({"_id":ObjectId(id)}))

@event.delete('/{id}')
async def delete_organizaton(id):
    return serializeDict(conn.event.organization.find_one_and_delete({"_id":ObjectId(id)}))