from fastapi import APIRouter,HTTPException
from fastapi.responses import JSONResponse,FileResponse
from config.db import conn
from model.event import *
from schemas.event import serializeDict,serializeList
from bson import ObjectId
import re
# import qrcode
# from email.message import EmailMessage
# import smtplib
# from dotenv import load_dotenv
# import os

# load_dotenv()

# gmail_user = os.getenv("GMAIL_USER")
# gmail_password = os.getenv("GMAIL_PASSWORD")

event = APIRouter()

@event.get("/")
async def home():
    return {"message": "Welcome to the home page"}

# Routes For Admin ------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>

# Get all Organization
@event.get("/getallorganization")
async def find_all_organization():
    return serializeList(conn.event.organization.find())

# Get one Organization by ID
@event.get("/organization/{id}")
async def find_one_organizaton(id):
    return serializeDict(conn.event.organization.find_one({"_id":ObjectId(id)}))

# Login Admin
@event.post("/adminlogin")
async def admin_login(data:dict):
    u = conn.event.admin.find_one({"username":data["username"]})
    user = serializeDict(u)
    if len(user)!= 0 and user["pwd"] == data["pwd"]:
        return user
    else:
        return {"error":"Invalid Username and Password","success":False}
        

# Routes for Organization ------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>

# Get all Members of Organization by Clubname
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
        return {"error":"Member doesn't Exist","success":False}

# Signup for Organizaton
@event.post("/organisationsignup/")
async def create_organization(organization:Organization):
    conn.event.organization.insert_one(dict(organization))
    return dict(organization)

# Login for Organization
@event.post("/organisationlogin/")
async def organization_login(data : dict):
    d1 = conn.event.organization.find_one({"username":data["username"]})
    if d1 and d1["pwd"] == data["pwd"]:
        return serializeDict(d1)
    else:
        return {"error":"Invalid Username and Password","success":False}

# Get all Membership Type (Only Type Name) by Clubname
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

# Sorting of Member list by Parameters
@event.post("/membersorting")
async def member_sorting(data:dict):
    # org = conn.event.organization.find_one({"clubname" : data["clubname"]})
    org = data["members"]
    if org:
        # org1 =  serializeDict(org)["members"]
        if len(org) != 0:
        # print(org1)
            if data["value"]:
                sorted_list = sorted(org, key=lambda x: x[data["col"]])
                # for i in sorted_list:
                #     i["expiry_date"] = i["expiry_date"].strftime("%Y-%m-%d")
                #     i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
                return sorted_list
            else:
                sorted_list = sorted(org, key=lambda x: x[data["col"]], reverse=True)
                # for i in sorted_list:
                #     i["expiry_date"] = i["expiry_date"].strftime("%Y-%m-%d")
                #     i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
                return sorted_list

    else:
        return {"error":"Organization not Found","success":False}

# Add Member in Organization
@event.put("/addorganizationmember/{id}")
async def add_member(id:str,member:User):
    data_dict = dict(member)
    org = conn.event.organization.find({"_id":ObjectId(id)})
    if org:
        data_dict1 = serializeList(org)[0]["members"]
        for i in data_dict1:
            if (i["username"] == data_dict["username"]):
                return {"error":"Username already Exists","success":False}
            if (i["memberid"] == data_dict["memberid"]):
                return {"error":"Member ID already Exists","success":False}
    if data_dict["membertype"] == '':
        return {"error":"Select Membership Type","success":False}
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
        return {"error":"Invalid Input","success":False}

# Update Member Details in Organization
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
            # print(memberdict["memberid"])
            if memberdict["memberid"] == data["memberId"]:
                memberdict.update(data["formData"])
                # print(org1["members"])
                conn.event.organization.find_one_and_update({"_id":ObjectId(org1["_id"])},{"$set": {"members":org1["members"]}})
                # print(org1["members"])
                return True
    else:
        return {"error":"Organisation not found","success": False}

# Delete Member from Organization
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
        return {"error":"Invalid Input","success":False}

# Get all Membership of Organization by Clubname
@event.post("/getallmembership")
async def get_all_membership(data : dict):
    membership = conn.event.organization.find_one({"clubname":data["clubname"]}, {"memtype": 1, "_id": 0})
    if membership:
        memtype = serializeDict(membership)["memtype"]
        if len(memtype) !=0:
            return memtype
        else:
            return {"error":"No Membership Type Available","success":False}
    else:
        return {"error":"Organization Not Found","success":False}

# Add New Membership in Organization
@event.put("/addmembership/{clubname}")
async def add_membership(clubname : str,data : dict):
    if type(data["price"]) == str:
        data["price"] = int(data["price"])
    membership = conn.event.organization.find_one({"clubname":clubname}, {"memtype": 1, "_id": 0})
    if membership:
        memtype = serializeDict(membership)["memtype"]
        for i in memtype:
            if i["type"] == data["type"]:
                i["price"] = data["price"]
                conn.event.organization.find_one_and_update({"clubname":clubname},{"$set": {"memtype":memtype}})
                return {"data":"Membership Updated Successfully","success":True}
        memtype.append(data)
        conn.event.organization.find_one_and_update({"clubname":clubname},{"$set": {"memtype":memtype}})
        return {"data":"Membership Added Successfully","success":True}
    else :
        return {"error":"Organization Not Found","success":False}


# organisation's member table filters
@event.post("/organisationmembertablefilters")
async def membertable_filtering(filters:dict):
    data = filters["data"]
    filtered_data = {}
    print(data)
    for key, value in data.items():
        if (value != '' or value != ""):
            filtered_data[key] = re.escape(value)
    print(filtered_data)
    content = []
    if (len(filtered_data) != 0):
        
        regex_patterns = {}
        for key, value in data.items():
            if value:
                regex_patterns[key] = re.compile(f'^{re.escape(value)}', re.IGNORECASE)

        # print (regex_patterns)
        # organisation = conn.event.organization.find_one({"_id":ObjectId(orgid)})
        membersList = filters["members"]
        # if membersList:
            # org1 = serializeDict(organisation)
            # membersList = org1["members"]
        if (membersList != []):
            for memberdict in membersList:
                match = all(regex.match(str(memberdict.get(key, ''))) for key, regex in regex_patterns.items())
                if match:
                    content.append(memberdict)
            if content:
                # for i in content:
                #     i["expiry_date"] = i["expiry_date"].strftime("%Y-%m-%d")
                #     i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
                return content
            else:
                return content
        else:
            return {"error":"No Members","success":False}
        # else:
        #     return {"error":"Organisation not found","success":False}
    else:
        
        return {"error":"Please enter data in filter input","success":False,"data_dict":"empty"}

#Filtering a members by name,start date and expiry date
@event.post("/orgmemberfilter")
async def filter_members(data:dict):
    if (data["expiry_date"] != ''):
        # data["expiry_date"] = data["expiry_date"].strftime("%Y-%m-%d")
        data["expiry_date"] = datetime.strptime(data["expiry_date"], "%Y-%m-%d")
    if (data["start_date"] != ''):    
        # data["start_date"] = data["start_date"].strftime("%Y-%m-%d")
        data["start_date"] = datetime.strptime(data["start_date"], "%Y-%m-%d")

    print(data)
    filtered_data = {}
    for key, value in data.items():
        if (value != '' or value != ""):
          filtered_data[key] = value
    
    # return filtered_data 
    print(filtered_data)
    organisation = conn.event.organization.find_one({"_id":ObjectId(data["cid"])})
    result = []
    if organisation:   
        
        org1 = serializeDict(organisation)
        partial_name = data["membername"]
        regex_pattern = re.compile(f".*{re.escape(partial_name)}.*", re.IGNORECASE)
        # #print(org1)
        # member_name = data["membername"]
        # #print(member_name)

        for memberdict in org1["members"]:
            if "name" in memberdict and re.match(regex_pattern, memberdict["name"]):
                if data["start_date"] !="" and data["expiry_date"] !="":
                    if memberdict["start_date"] >= filtered_data["start_date"] and memberdict["start_date"] <= filtered_data["expiry_date"]:
                        result.append(memberdict)
                elif data["start_date"] !="":
                    if memberdict["start_date"] >= filtered_data["start_date"]:
                        result.append(memberdict)
                elif data["expiry_date"] !="":
                    if memberdict["start_date"] <= filtered_data["expiry_date"]:
                        result.append(memberdict)
                else:
                    result.append(memberdict)
        # #print(d1)
        #print(result)
        if (result != []):
        #   print(result)
          for singledict in result:
                singledict["expiry_date"] = singledict["expiry_date"].strftime("%Y-%m-%d")
                singledict["start_date"] = singledict["start_date"].strftime("%Y-%m-%d")
             
          return result
        else:
            return {"error":"Member Not Found","success":False}
    else:
        return {"error":"Organisation Not Found","success":False}


# Routes for Post ------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>

# Insert Event Post
@event.post("/eventpost/")
async def event_post(data : EventPost):
    try:
        data_dict = dict(data)
        if data_dict["type"] == '':
            return {"error":"Select Membership Type","success":False}
        data_dict["event_start_date"] = data_dict["event_start_date"].strftime("%Y-%m-%d")
        data_dict["event_end_date"] = data_dict["event_end_date"].strftime("%Y-%m-%d")
        data_dict["event_start_date"] = datetime.strptime(data_dict["event_start_date"], "%Y-%m-%d")
        data_dict["event_end_date"] = datetime.strptime(data_dict["event_end_date"], "%Y-%m-%d")
        conn.event.post.insert_one(data_dict)
        return {"data": "Event data successfully submitted"}
    except ValueError:
        return {"error":"ValueError","success":False}
    
# Get Event Post by Clubname
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
        return {"error":"no post found","success":False}

# Event Post filter by parameters
@event.post("/postfilters/{clubname}")   
async def org_filters(clubname:str,filtereddata: dict):
    # Build the query based on the filteredFormData
    query = {}

    and_conditions = []

    for field, value in filtereddata.items():
        if field in ["event_start_date", "event_end_date"] and value != "":
            value = datetime.strptime(value, "%Y-%m-%d")
            if field == "event_start_date":
                and_conditions.append({"event_start_date": {"$gte": value}})
            if field == "event_end_date":
                and_conditions.append({"event_start_date": {"$lte": value}})

        if field in ["minprice", "maxprice"] and value != "":
            if field == "minprice":
                and_conditions.append({"ticket_price": {"$gte": float(value)}})
            if field == "maxprice":
                and_conditions.append({"ticket_price": {"$lte": float(value)}})

        if field == "venue_city" and value != "":
            regex_pattern = re.compile(f"^{re.escape(value)}", re.IGNORECASE)
            and_conditions.append({"venue_city": {"$regex": regex_pattern}})

    and_conditions.append({"clubname":clubname})
    if and_conditions:
        query["$and"] = and_conditions

    # Find posts based on the query
    result = conn.event.post.find(query)

    # Iterate over the result and print each post
    response_list = serializeList(result)
    if response_list:
        lis = []
        d1 = {}
        for singleDict in response_list:
            d1 = singleDict
            d1["event_start_date"] = d1["event_start_date"].strftime("%d-%m-%Y")
            d1["event_end_date"] = d1["event_end_date"].strftime("%d-%m-%Y")
            lis.append(serializeDict(d1))
        return serializeList(lis)
    else:
        return {"error": "No Such Post Available", "success": False}

# Delete Event Post
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


# Routes For User ------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>
    
# Signup for User
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
        return {"error":"Username already exists","success":False}
    else:
        conn.event.user .insert_one(dict(user))
        return dict(user)

# Login for User
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
                d1["loggedin"] = True
                singleDict.update(d1)
                conn.event.organization.find_one_and_update({"clubname":data["clubname"]},{"$set": {"members":membersList}})
                del d1["loggedin"]
                d1["clubname"] = data["clubname"]
                conn.event.user.insert_one(d1)
                return serializeDict(d1)
        if flag == 0:
            return {"error":"Invalid Username , Password and Clubname","success":False}
    else : 
        return {"error":"Invalid Username , Password and Clubname","success":False}

# Get all Post For Users
@event.post("/fetchingallpostforuser/{uname}")
async def fetch_all_post_userside(uname:str):
    result = conn.event.post.find()
    posts = []
    if (result != []):
        allpost = serializeList(result)
        for i in allpost:
            if len(i["participate"]) !=0:
                for j in i["participate"]:
                    if j["username"] == uname:
                        break
                else:
                    i["event_start_date"] = i["event_start_date"].strftime("%d-%m-%Y")
                    i["event_end_date"] = i["event_end_date"].strftime("%d-%m-%Y")
                    posts.append(i)
            else:
                i["event_start_date"] = i["event_start_date"].strftime("%d-%m-%Y")
                i["event_end_date"] = i["event_end_date"].strftime("%d-%m-%Y")
                posts.append(i)
        return (posts)
    else:
        return {"error":"No post found","success":False}

# Post Filter for user
@event.post("/postfilterforuser")
async def postfilter_user(data : dict):
    query = {}
    print(data)
    and_conditions = []

    for field, value in data.items():
        if field in ["event_start_date", "event_end_date"] and value != "":
            value = datetime.strptime(value, "%Y-%m-%d")
            if field == "event_start_date":
                and_conditions.append({"event_start_date": {"$gte": value}})
            if field == "event_end_date":
                and_conditions.append({"event_start_date": {"$lte": value}})

        if field in ["minprice", "maxprice"] and value != "":
            if field == "minprice":
                and_conditions.append({"ticket_price": {"$gte": float(value)}})
            if field == "maxprice":
                and_conditions.append({"ticket_price": {"$lte": float(value)}})

        if field == "venue_city" and value != "":
            regex_pattern = re.compile(f"^{re.escape(value)}", re.IGNORECASE)
            and_conditions.append({"venue_city": {"$regex": regex_pattern}})
        
        if field == "type" and value!="":
            and_conditions.append({"type":value})
        if field == "clubname" and value!="":
            and_conditions.append({"clubname":value})

    
    if and_conditions:
        query["$and"] = and_conditions

    # Find posts based on the query
    result = conn.event.post.find(query)

    # Iterate over the result and print each post
    response_list = serializeList(result)
    if response_list:
        lis = []
        d1 = {}
        for singleDict in response_list:
            d1 = singleDict
            d1["event_start_date"] = d1["event_start_date"].strftime("%d-%m-%Y")
            d1["event_end_date"] = d1["event_end_date"].strftime("%d-%m-%Y")
            lis.append(serializeDict(d1))
        return serializeList(lis)
    else:
        return {"error": "No Such Post Available", "success": False}

# User Participate in Event
@event.put("/eventparticipate/{id}")
async def event_participate(id:str,data:dict):
    data["age"] = int(data["age"])
    post = conn.event.post.find_one({"_id":ObjectId(id)})
    if post:
        p1 = serializeDict(post)["participate"]
        # print(p1)
        p1.append(data)
        conn.event.post.find_one_and_update({"_id":ObjectId(id)},{"$set": {"participate":p1}})
        return {"data": "Partcipated Successfully"}
    else:
        return {"error": "Event Not Found", "success": False}

# Post Search by User using Title
@event.post("/postsearchbyuser")
async def post_search_user(data : dict):
    result = conn.event.post.find()
    posts = []
    # print(data)
    regex_pattern = re.compile(f"^{re.escape(data['title'])}.*", re.IGNORECASE)
    # print(re.match(regex_pattern,title))
    
    if (result != []):
        allpost = serializeList(result)
        for i in allpost:
            if re.match(regex_pattern,i["event_title"]):
                if len(i["participate"]) !=0:
                    for j in i["participate"]:
                        if j["username"] == data["uname"]:
                            break
                    else:
                        i["event_start_date"] = i["event_start_date"].strftime("%d-%m-%Y")
                        i["event_end_date"] = i["event_end_date"].strftime("%d-%m-%Y")
                        posts.append(i)
                else:
                    i["event_start_date"] = i["event_start_date"].strftime("%d-%m-%Y")
                    i["event_end_date"] = i["event_end_date"].strftime("%d-%m-%Y")
                    posts.append(i)
        return posts

# Get All Organization for Subscribe
@event.get("/getallorganizatonforuser")
async def getall_organization():
    org = conn.event.organization.find()
    if org:
        org1 = serializeList(org)
        return org1
    else:
        return {"error": "Organization Not Found", "success": False}

# USer Search Organization by Name
@event.post("/usersearchingorgbyname")
async def search_org_byname(data:dict):
    search_query = data["clubname"]
    regex_pattern = re.compile(f"{re.escape(search_query)}.*", re.IGNORECASE)
    result = conn.event.organization.find({"clubname": {"$regex": regex_pattern}})

    result = serializeList(result)
    if result:
        # print(result)
        return result
    else:
        return {"error":"No organisation found","success":False}
    
# User Subscribe 
@event.put('/usersubscribe')
async def user_subscribe(user: User):
    
    appliedmem = dict(user)
    appliedmem["start_date"] = appliedmem["start_date"].strftime("%Y-%m-%d")
    appliedmem["expiry_date"] = appliedmem["expiry_date"].strftime("%Y-%m-%d")
    appliedmem["start_date"] = datetime.strptime(appliedmem["start_date"], "%Y-%m-%d")
    appliedmem["expiry_date"] = datetime.strptime(appliedmem["expiry_date"], "%Y-%m-%d")
    # print(appliedorg)
    flag =0
    orgdict = serializeDict(conn.event.organization.find_one({"clubname":appliedmem["clubname"]}))
    # return orgdict
    if len(orgdict) !=0:
        orgmem = orgdict["members"]
        orgapplied = orgdict["memapplied"]
        if len(orgmem) !=0:
            for i in orgmem:
                if i["username"] == appliedmem["username"]:
                    return {"error":"Username already Exist", "success":False}
            else:
                if len(orgapplied) !=0:
                    for j in orgapplied:
                        if j["username"] == appliedmem["username"] and j["email"] == appliedmem["email"] and j["pnumber"] == appliedmem["pnumber"]:
                            return {"error":"Similar Username,MemberId,Email and Phone Number are already Applied", "success":False}
                    else:
                        orgapplied.append(appliedmem)
                        conn.event.organization.update_one({"clubname":appliedmem["clubname"]}, {"$set":  {"memapplied": orgapplied}})
                        return {"data":"Applied For Subscription Successfully.","success":True}
                else:
                    orgapplied.append(appliedmem)
                    conn.event.organization.update_one({"clubname":appliedmem["clubname"]}, {"$set":  {"memapplied": orgapplied}})
                    return {"data":"Applied For Subscription Successfully.","success":True}
        else:
            orgapplied.append(appliedmem)
            conn.event.organization.update_one({"clubname":appliedmem["clubname"]}, {"$set":  {"memapplied": orgapplied}})
            return {"data":"Applied For Subscription Successfully.","success":True}
    else:
        return {"error":"Organization Not Found", "success":False}

# Get User Participated Events
@event.post("/userparticipated/{uname}")
async def user_participated(uname:str):
    post = conn.event.post.find()
    allpost=[]
    if post:
        postlist = serializeList(post)
        for singlepost in postlist:
            if len(singlepost)!=0:
                for singlepart in singlepost["participate"]:
                    if singlepart["username"] == uname:
                        singlepost["event_start_date"] = singlepost["event_start_date"].strftime("%d-%m-%Y")
                        singlepost["event_end_date"] = singlepost["event_end_date"].strftime("%d-%m-%Y")
                        allpost.append(singlepost)
        if len(allpost)!=0:
            return allpost
        else:
            return {"error":"You are not Participated in any Event", "success":False}
    else:
        return {"error":"Post Not Found", "success":False}
    
# Get Membership Type using Clubname and Username
@event.post("/filtermemtype")
async def filter_memtype(data : dict):
    org = serializeDict(conn.event.organization.find_one({"clubname":data["clubname"]}))
    if len(org) !=0:
        memtype = org["memtype"]
        # print(memtype)
        for singlemember in org["members"]:
            if singlemember["username"] == data["username"]:
                memtype = [item for item in memtype if item["type"] != singlemember["membertype"]]
        return memtype


    


# General Routes ---------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# Get all the Clubnames
@event.get("/clubnames/")
async def get_clubnames():
    clubname = []
    cursor = conn.event.organization.find({}, {"clubname": 1, "_id": 0})
    for i in serializeList(cursor):
        clubname.append(i["clubname"])
    return clubname

# Get all type of Membership 
@event.get("/allmembershiptype")
async def  all_membershiptype():
    allmemtype =[]
    allorg = conn.event.organization.find({})
    if allorg:
        allorg1 = serializeList(allorg)
        for i in allorg1:
            if i["memtype"] != []:
                for j in i["memtype"]:
                    if j["type"] not in allmemtype:
                        allmemtype.append(j["type"])
    return allmemtype
    
# Send Email 
# @event.post("/send-email")
# async def send_email(to: str, subject: str, message: str):
#     try:
#         # Create an EmailMessage
#         email = EmailMessage()
#         email.set_content(message)
#         email["Subject"] = subject
#         email["From"] = gmail_user
#         email["To"] = to

#         # Connect to Gmail SMTP server
#         with smtplib.SMTP("smtp.gmail.com", 587) as server:
#             server.starttls()
#             # Log in to the Gmail account
#             server.login(gmail_user, gmail_password)
#             # Send the email
#             server.send_message(email)

#         return JSONResponse(content={"message": "Email sent successfully"}, status_code=200)
#     except smtplib.SMTPAuthenticationError as e:
#         raise HTTPException(status_code=401, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @event.get("/generate-qr")
# async def generate_qr(data: str):
#     try:
#         # Generate QR code
#         qr = qrcode.QRCode(
#             version=1,
#             error_correction=qrcode.constants.ERROR_CORRECT_L,
#             box_size=10,
#             border=4,
#         )
#         qr.add_data(data)
#         qr.make(fit=True)

#         # Create a QR code image
#         img = qr.make_image(fill_color="black", back_color="white")

#         # Save the image temporarily
#         img_path = "temp_qr.png"
#         img.save(img_path)

#         # Return the QR code image as a response
#         return FileResponse(img_path, media_type="image/png")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    # finally:
    #     # Clean up: Delete the temporary image file
    #     if img_path and os.path.exists(img_path):
    #         os.remove(img_path)