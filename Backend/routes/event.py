from fastapi import APIRouter,HTTPException
from config.db import conn
from model.event import *
from schemas.event import serializeDict,serializeList
from bson import ObjectId

event = APIRouter()

@event.get("/")
async def home():
    return {"message": "Welcome to the home page"}

@event.get("/getorganization")
async def find_all_organization():
    return serializeList(conn.event.organization.find())


@event.get("/organization/{id}")
async def find_one_organizaton(id):
    return serializeDict(conn.event.organization.find_one({"_id":ObjectId(id)}))

@event.get("/clubnames/")
async def get_clubnames():
    clubname = ["None"]
    cursor = conn.event.organization.find({}, {"clubname": 1, "_id": 0})
    for i in serializeList(cursor):
        clubname.append(i["clubname"])
    return clubname

@event.post("/organizationmember/")
async def organization_member(data : dict):
    org = conn.event.organization.find({"clubname" : data["clubname"]})
    if org:
        data_dict = serializeList(org)[0]["members"]
        for i in data_dict:
            i["expiry_date"] = i["expiry_date"].strftime("%Y-%m-%d")
            i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
        return data_dict
    else:
        return {"data":"Member doesn't Exist","success":False}

@event.post("/organisationsignup/")
async def create_organization(organization:Organization):
    conn.event.organization.insert_one(dict(organization))
    return dict(organization)

@event.post("/usersignup/")
async def create_user(user:User):
    d1 = dict(user)
    uname = conn.event.user.find_one({"$and": 
        [
            {"clubname": None},
            {"username": d1["username"]}
        ]
        },{"username":1,"_id":0})
    if uname:
        return {"data":"Username already exists","success":False}
    else:
        conn.event.user .insert_one(dict(user))
        return dict(user)

@event.post("/organisationlogin/")
async def organization_login(data : dict):
    d1 = conn.event.organization.find_one({"username":data["username"]})
    if d1 and d1["pwd"] == data["pwd"]:
        return serializeDict(d1)
    else:
        return {"data":"Invalid Username and Password","success":False}
    
@event.post("/userlogin/")
async def check_user(data:dict):
    if data["clubname"] == "None" or data["clubname"] == "":
        data["clubname"] = None
    flag=0
    d1= {}
    u1 = conn.event.user.find_one({"$and": [{"username":data["username"]},{"pwd":data["pwd"]},{"clubname":data["clubname"]}]})
    u3 = conn.event.organization.find_one({"clubname":data["clubname"]})
    if u1:
        return serializeDict(u1)
    elif u3:
        user3 = serializeDict(u3)
        membersList =  user3["members"]
        for singleDict in membersList:
            if (singleDict["username"] == data["username"]) and (singleDict["pwd"] == data["pwd"]):
                flag =1
                d1 = singleDict
                d1["clubname"] = data["clubname"]
                conn.event.user.insert_one(d1)
                return serializeDict(d1)
        if flag == 0:
            return {"data":"Invalid Username , Password and Clubname","success":False}
    else : 
        return {"data":"Invalid Username , Password and Clubname","success":False}
    
@event.post("/eventpost/")
async def event_post(data : EventPost):
    try:
        data_dict = dict(data)
        if data_dict["type"] == "Public" or data_dict["type"] == "":
            data_dict["type"] = "Public"
        data_dict["event_start_date"] = data_dict["event_start_date"].strftime("%Y-%m-%d")
        data_dict["event_end_date"] = data_dict["event_end_date"].strftime("%Y-%m-%d")
        data_dict["event_start_date"] = datetime.strptime(data_dict["event_start_date"], "%Y-%m-%d")
        data_dict["event_end_date"] = datetime.strptime(data_dict["event_end_date"], "%Y-%m-%d")
    except ValueError:
        return {"data":"ValueError","success":False}
    conn.event.post.insert_one(data_dict)
    return {"data": "Event data successfully submitted"}

@event.post("/geteventposts")
async def get_event_posts(data : dict):
    response = conn.event.post.find({"clubname":data["clubname"]})
    if response:
        lis = []
        d1= {}
        for singleDict in response:
            d1 = singleDict
            d1["event_start_date"] = d1["event_start_date"].strftime("%d-%m-%Y")
            d1["event_end_date"] = d1["event_end_date"].strftime("%d-%m-%Y")
            lis.append(serializeDict(d1))
        return serializeList(lis)
    else:
        return {"data":"no post found","success":False}

@event.post("/orgfilters")   
async def org_filters(filtereddata: dict):
    query = {}

    for field, value in filtereddata.items():
        if field in ["event_start_date", "event_end_date"] and value != "":
            # value = value.strftime("%Y-%m-%d")
            value = datetime.strptime(value, "%Y-%m-%d")
            print(value)
            if field == "event_start_date":
                query["event_start_date"] = {"$gte": value}
                print(query)
            if field == "event_end_date":
                query["event_start_date"] = {"$lte": value}
                print(query)

        if field in ["minprice", "maxprice"] and value != "":
            if field == "minprice":
                query["ticket_price"] = {"$gte": value}
                print(query)
            if field == "maxprice":
                query["ticket_price"] = {"$lte":value}
                print(query)

        if field == "venue_city" and value != "":
            query[field] = value
            print(query)
    result = conn.event.post.find(query)
    response_list = serializeList(result)
    if response_list:
        lis = []
        d1= {}
        for singleDict in response_list:
            d1 = singleDict
            d1["event_start_date"] = d1["event_start_date"].strftime("%d-%m-%Y")
            d1["event_end_date"] = d1["event_end_date"].strftime("%d-%m-%Y")
            lis.append(serializeDict(d1))
        return serializeList(lis)
    else:
        return {"error":"Error pls fill form again","success":False}
    
@event.post("/getmemtype/")
async def get_memtype(data:dict):
    type = []
    cursor = conn.event.organization.find({"clubname":data["clubname"]}, {"memtype": 1, "_id": 0})
    # print(serializeList(cursor))
    d1 = serializeList(cursor)
    # print(d1[0]["memtype"])
    for i in d1[0]["memtype"]:
        type.append(i["type"])
    return type

@event.put("/addorganizationmember/{id}")
async def add_member(id:str,member:User):
    data_dict = dict(member)
    org = conn.event.organization.find({"_id":ObjectId(id)})
    if org:
        data_dict1 = serializeList(org)[0]["members"]
        for i in data_dict1:
            if (i["username"] == data_dict["username"]):
                return {"data":"Username already Exists","success":False}
            if (i["memberid"] == data_dict["memberid"]):
                return {"data":"Member ID already Exists","success":False}
    if data_dict["membertype"] == '':
        return {"data":"Select Membership Type","success":False}
    del data_dict["clubname"]
    data_dict["expiry_date"] = data_dict["expiry_date"].strftime("%Y-%m-%d")
    data_dict["expiry_date"] = datetime.strptime(data_dict["expiry_date"], "%Y-%m-%d")
    data_dict["start_date"] = data_dict["start_date"].strftime("%Y-%m-%d")
    data_dict["start_date"] = datetime.strptime(data_dict["start_date"], "%Y-%m-%d")
    d1 = conn.event.organization.find_one({"_id":ObjectId(id)})
    if d1:
        # serializeDict(d1)["members"].append(data_dict)
        org1 = serializeDict(d1)
        org1["members"].append(data_dict)
        conn.event.organization.find_one_and_update({"_id":ObjectId(id)},{"$set": {"members":org1["members"]}})
        return {"data":"Member Added Successfully","success":True}
    else:
        return {"data":"Invalid Input","success":False}

#updating member details
@event.put("/organizationupdatememberdetails/")   
async def update_member_details(data: dict):
    
    organisation = conn.event.organization.find_one({"clubname": data["clubname"]})
    if organisation:   
        
        org1 = serializeDict(organisation)
        # formdata = data["formData"]
        
        data["formData"]["expiry_date"] = datetime.strptime(data["formData"]["expiry_date"], "%Y-%m-%d")
        data["formData"]["start_date"] = datetime.strptime(data["formData"]["start_date"], "%Y-%m-%d")
        # member_id = data["memberId"]
        # print(member_id)
        for memberdict in org1["members"]:
            print(memberdict["memberid"])
            if memberdict["memberid"] == data["memberId"]:
                memberdict.update(data["formData"])
                # print(org1["members"])
                conn.event.organization.find_one_and_update({"_id":ObjectId(org1["_id"])},{"$set": {"members":org1["members"]}})
                # print(org1["members"])
                return True

        # else:
        #     return {"error": "Member Error", "success": False}
            
        print(org1)
    else:
        return {"error":"Organisation not found","success": False}


@event.put("/deletemember")
async def delete_member(data : dict):
    org = conn.event.organization.find_one({"_id":ObjectId(data['orgid'])})
    if org:
        org1 = serializeDict(org)
        clubname = org1["clubname"]
        org1 = serializeDict(org)["members"]
        for i in org1:
            if i["memberid"] == data["memberid"]:
                i["clubname"] = clubname
                conn.event.deletemember.insert_one(i)
        updated_members = [i for i in org1 if i["memberid"] != data["memberid"]]
        # print("Updated Member list",updated_members)
        conn.event.organization.find_one_and_update({"_id":ObjectId(data["orgid"])},{"$set": {"members":updated_members}})
        return {"data":"Member deleted Successfully","success":True}
    else:
        return {"data":"Invalid Input","success":False}

@event.delete("/deleteeventposts/{id}")
async def delete_user(id):
    #fetch the details using id
    # if details found execute the delete query
    #always test in swagger first
    #then bind with UI
    response = serializeDict(conn.event.post.find_one_and_delete({"_id":ObjectId(id)}))
    if response:
        return True
    else:
        return {"error":"no post found","success":False}

@event.delete("/{id}")
async def delete_organizaton(id):
    return serializeDict(conn.event.organization.find_one_and_delete({"_id":ObjectId(id)}))