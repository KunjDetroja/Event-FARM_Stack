from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from config.db import conn
from model.event import *
from schemas.event import serializeDict, serializeList
from bson import ObjectId, Regex
import re
from collections import defaultdict
# import qrcode

from email.message import EmailMessage
import smtplib
from dotenv import load_dotenv
import os

load_dotenv()

gmail_user = os.getenv("GMAIL_USER")
gmail_password = os.getenv("GMAIL_PASSWORD")

event = APIRouter()


@event.get("/")
async def home():
    return {"message": "Welcome to the home page"}

# Routes For Admin -------------------------------------------------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>

# Get all Organization


@event.get("/allorganisations")
async def fetch_all_org():
    result = conn.event.organization.find()
    if result:
        org = serializeList(result)
        for i in org:
            for j in i["members"]:
                j["expiry_date"] = j["expiry_date"].strftime("%Y-%m-%d")
                j["start_date"] = j["start_date"].strftime("%Y-%m-%d")
        return org
    # return serializeList(conn.event.organization.find())

# Get one Organization by ID


@event.get("/organization/{id}")
async def find_one_organizaton(id):
    return serializeDict(conn.event.organization.find_one({"_id": ObjectId(id)}))

# Login Admin


@event.post("/adminlogin")
async def admin_login(data: dict):
    u = conn.event.admin.find_one(
        {"$and": [{"username": data["username"]}, {"pwd": data["pwd"]}]})
    user = serializeDict(u)
    if len(user) != 0:
        return user
    else:
        return {"error": "Invalid Username and Password", "success": False}


# search org member details
@event.post("/adminorgsearchfilter")
async def org_search_filters(data: dict):

    memberlist = data["memberlist"]
    newdata = data
    del newdata["memberlist"]
    if (newdata["expiry_date"] != ''):
        # data["expiry_date"] = data["expiry_date"].strftime("%Y-%m-%d")
        newdata["expiry_date"] = datetime.strptime(
            newdata["expiry_date"], "%Y-%m-%d")
    if (newdata["start_date"] != ''):
        # data["start_date"] = data["start_date"].strftime("%Y-%m-%d")
        newdata["start_date"] = datetime.strptime(
            newdata["start_date"], "%Y-%m-%d")
    filtered_data = {}
    for key, value in newdata.items():
        if (value != '' or value != ""):
            filtered_data[key] = value
    result = []
    partial_name = data.get("membername", "")
    regex_pattern = re.compile(f"{re.escape(partial_name)}.*", re.IGNORECASE)

    for memberdict in memberlist:
        if "name" in memberdict and re.match(regex_pattern, memberdict["name"]):
            memberdict["expiry_date"] = datetime.strptime(
                memberdict["expiry_date"], "%Y-%m-%d")
            memberdict["start_date"] = datetime.strptime(
                memberdict["start_date"], "%Y-%m-%d")
            if data["start_date"] != "" and data["expiry_date"] != "":
                if memberdict["start_date"] >= newdata["start_date"] and memberdict["start_date"] <= newdata["expiry_date"]:
                    result.append(memberdict)
            elif data["start_date"] != "":
                if memberdict["start_date"] >= newdata["start_date"]:
                    result.append(memberdict)
            elif data["expiry_date"] != "":
                if memberdict["start_date"] <= newdata["expiry_date"]:
                    result.append(memberdict)
            else:
                result.append(memberdict)
    if result:
        for singledict in result:
            singledict["expiry_date"] = singledict["expiry_date"].strftime(
                "%Y-%m-%d")
            singledict["start_date"] = singledict["start_date"].strftime(
                "%Y-%m-%d")
        return result
    else:
        return {"error": "No such Member found", "success": False}

# admin side org member table filters


@event.post("/adminorgmemberstablefilters")
async def adminside_orgmembertablefilter(filters: dict):
    data = filters["filterdict"]
    filtered_data = {}
    for key, value in data.items():
        if (value != '' or value != ""):
            filtered_data[key] = re.escape(value)
    content = []
    if (len(filtered_data) != 0):

        regex_patterns = {}
        for key, value in data.items():
            if value:
                regex_patterns[key] = re.compile(
                    f'^{re.escape(value)}', re.IGNORECASE)
        membersList = filters["memberlist"]
        if (membersList != []):
            for memberdict in membersList:
                match = all(regex.match(str(memberdict.get(key, '')))
                            for key, regex in regex_patterns.items())
                if match:
                    content.append(memberdict)
            if len(content) != 0:
                # for i in content:
                #     i["expiry_date"] = i["expiry_date"].strftime("%Y-%m-%d")
                #     i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
                return content
            else:
                return {"error": "No Members", "success": False}
        else:
            return {"error": "No Members", "success": False}
        # else:
        #     return {"error":"Organisation not found","success":False}
    else:

        return {"error": "Please enter data in filter input", "success": False, "data_dict": "empty"}


# admin side loggedin members
@event.post("/loggedinmembers")
async def loggedin_members(data: dict):

    logginemembers = []
    for singledict in data["data"]:
        if singledict["loggedin"] == True:
            logginemembers.append(singledict)
    if logginemembers:
        return logginemembers
    else:
        return {"error": "No loggedin members", "success": False}


# admin side loggedin members
@event.post("/inactivemembers")
async def inactive_members(data: dict):

    inactivemembers = []
    for singledict in data["data"]:
        if singledict["loggedin"] == False:
            inactivemembers.append(singledict)
    if inactivemembers:
        return inactivemembers
    else:
        return {"error": "No loggedin members", "success": False}

# fetching all users


@event.get("/adminmemberdetails")
async def adminside_allusers():
    result = conn.event.user.find({})
    result = serializeList(result)
    if result:
        for i in result:
            if i["expiry_date"]:
                i["expiry_date"] = i["expiry_date"].strftime("%Y-%m-%d")
            if i["start_date"]:
                i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
        return result
    else:
        return {"error": "No Users", "success": False}

# fetching all new users


@event.get("/fetchingnewusers")
async def adminside_allnewusers():
    newuserslist = []
    result = conn.event.user.find({})
    result = serializeList(result)
    if result:
        for i in result:
            if (i["memberid"] == None):
                newuserslist.append(i)
        return newuserslist
    else:
        return {"error": "No New Users", "success": False}

# searching user by name , start_date/expiry_date


@event.post("/usersearchform")
async def adminside_searchuser(data: dict):
    memberlist = serializeList(conn.event.user.find({}))
    filtered_data = {}
    for key, value in data.items():
        if (value != '' or value != ""):
            filtered_data[key] = value
    result = []
    partial_name = data.get("membername", "")
    regex_pattern = re.compile(f"{re.escape(partial_name)}.*", re.IGNORECASE)

    for memberdict in memberlist:
        if "name" in memberdict and re.match(regex_pattern, memberdict["name"]):
            result.append(memberdict)
    if result:
        return result
    else:
        return {"error": "No such Member found", "success": False}

# admin side user section table filters


@event.post("/adminusertablefilters")
async def allusers_tablefilters(data: dict):
    allfiltersdata = data["data"]

    filtered_data = {}
    for key, value in allfiltersdata.items():
        if (value != '' or value != ""):
            filtered_data[key] = re.escape(value)

    content = []
    if (len(filtered_data) != 0):

        regex_patterns = {}
        for key, value in filtered_data.items():
            if value:
                regex_patterns[key] = re.compile(
                    f'^{re.escape(value)}.*', re.IGNORECASE)

        membersList = serializeList(conn.event.user.find({}))
        if membersList:

            for memberdict in membersList:
                match = all(regex.match(str(memberdict.get(key, '')))
                            for key, regex in regex_patterns.items())
                if match:
                    content.append(memberdict)
            if content:
                for i in content:
                    if i["expiry_date"]:
                        i["expiry_date"] = i["expiry_date"].strftime(
                            "%Y-%m-%d")
                    if i["start_date"]:
                        i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
                return content
            else:
                return {"error": "No Members", "success": False}

        else:
            return {"error": "No members", "success": False}
    else:

        return {"error": "Please enter data in filter input", "success": False, "data_dict": "empty"}


# fetching all appiled organisations
@event.get("/allappliedorg")
async def adminside_allappliedorg():
    appliedlist = serializeList(conn.event.admin.find())
    content = []
    for singledict in appliedlist:
        content = singledict["applied_org"]
    if (len(content) != 0):
        return serializeList(content)
    else:
        return {"error": "No Applied Organisation", "success": False}

# searching by organisation name


@event.post("/searchorgbyname")
async def adminside_searchorgbyname(data: dict):
    search_org = data["clubname"]
    regex_pattern = f"^{re.escape(search_org)}.*"
    pipeline = [
        {"$unwind": "$applied_org"},
        {"$match": {"applied_org.clubname": Regex(regex_pattern, "i")}},
    ]
    adminlist = conn.event.admin.aggregate(pipeline)

    content = []

    if adminlist:
        for admin in adminlist:
            org_dict = admin.get("applied_org", {})
            content.append(org_dict)
        if content:
            return content
        else:
            return {"error": "Organisation Not Found", "success": False}
    else:
        return {"error": "No Admin Data", "success": False}

# admin side applied org table filters


@event.post("/appliedorgtablefilters")
async def adminside_applied_orgtablefilters(data: dict):
    allfiltersdata = data["data"]

    filtered_data = {}
    for key, value in allfiltersdata.items():
        if (value != '' or value != ""):
            filtered_data[key] = re.escape(value)
    content = []

    if (len(filtered_data) != 0):

        regex_patterns = {}
        for key, value in allfiltersdata.items():
            if value:
                regex_patterns[key] = re.compile(
                    f'^{re.escape(value)}.*', re.IGNORECASE)

        membersList = serializeList(conn.event.user.find({}))

        appliedlist = serializeList(conn.event.admin.find({}))
        for singleapplieddict in appliedlist:
            membersList = singleapplieddict["applied_org"]

        if membersList:

            for memberdict in membersList:
                match = all(regex.match(str(memberdict.get(key, '')))
                            for key, regex in regex_patterns.items())
                if match:
                    content.append(memberdict)
            if content:
                return content
            else:
                return {"error": "Organisation not found", "success": False}

        else:
            return {"error": "No Applied Organisation", "success": False}
    else:

        return {"error": "Please enter data in filter input", "success": False, "data_dict": "empty"}

# accepting org


@event.post("/acceptingorg")
async def adminside_acceptorg(data: dict):
    acceptedOrg = data["data"]
    result = conn.event.organization.insert_one(acceptedOrg)
    adminlist = serializeList(conn.event.admin.find())

    for singleadmin in adminlist:
        appliedorglist = singleadmin["applied_org"]

        updated_org = [i for i in appliedorglist if i["clubname"]
                       != acceptedOrg["clubname"]]
        content = conn.event.admin.find_one_and_update(
            {"_id": ObjectId(singleadmin["_id"])}, {"$set": {"applied_org": updated_org}})
    if content:
        return True
    else:
        return {"error": "Nothing To Update", "success": False}

# rejecting org


@event.post("/rejectingorg")
async def adminside_rejectorg(data: dict):
    acceptedOrg = data["data"]
    result = conn.event.rejectedorg.insert_one(acceptedOrg)

    adminlist = serializeList(conn.event.admin.find())

    for singleadmin in adminlist:
        appliedorglist = singleadmin["applied_org"]

        updated_org = [i for i in appliedorglist if i["clubname"]
                       != acceptedOrg["clubname"]]
        content = conn.event.admin.find_one_and_update(
            {"_id": ObjectId(singleadmin["_id"])}, {"$set": {"applied_org": updated_org}})
    if content:
        return True
    else:
        return {"error": "Nothing To Update", "success": False}


# Total Profit by Subscribe Users
@event.post("/totalprofit")
async def total_profit():
    profit = 0
    org = serializeList(conn.event.organization.find())
    if len(org):
        for singleorg in org:
            memtype = singleorg["memtype"]
            for singlemember in singleorg["members"]:
                if singlemember["subscribe"]:
                    for singlememtype in memtype:
                        if singlemember["membertype"] == singlememtype["type"]:
                            profit += singlememtype["price"]
        profit = profit*0.12
        return profit

# Total Profit by Subscribe Users Yearly
@event.get("/subscribeprofitadmin")
async def total_profit_yearly_Admin():
    profit = {}
    tprofit = []
    result = []
    org = serializeList(conn.event.organization.find())
    if len(org):
        for singleorg in org:
            memtype = singleorg["memtype"]
            for singlemember in singleorg["members"]:
                if singlemember["subscribe"] :
                    for singlememtype in memtype:
                        if singlemember["membertype"] == singlememtype["type"]:
                            if singlemember["start_date"].year in profit:
                                profit[int(singlemember["start_date"].year)] += singlememtype["price"]
                            else:
                                profit[int(singlemember["start_date"].year)] = singlememtype["price"]
        profit = dict(sorted(profit.items()))
        for key, value in profit.items():
            tprofit.append({"year": key, "Subscribers": value * 0.12})
        return tprofit
    else:
        return {"error": "No Organization", "success": False}

# Total Profit by Events Yearly
@event.get("/eventprofitadmin")
async def event_profit_admin():
    post1 = conn.event.post.find()
    post2  = conn.event.pastevent.find()
    profit = {}
    tprofit = []
    result = []
    if post1:
        for singlepost in post1:
            totalparticipate = len(singlepost["participate"])
            totalprofit = totalparticipate * singlepost["ticket_price"]
            if singlepost["event_start_date"].year in profit:
                profit[int(singlepost["event_start_date"].year)] += totalprofit
            else:
                profit[int(singlepost["event_start_date"].year)] = totalprofit
    if post2:
        for singlepost in post2:
            totalparticipate = len(singlepost["participate"])
            totalprofit = totalparticipate * singlepost["ticket_price"]
            if singlepost["event_start_date"].year in profit:
                profit[int(singlepost["event_start_date"].year)] += totalprofit
            else:
                profit[int(singlepost["event_start_date"].year)] = totalprofit
    # result.append(profit)
    profit = dict(sorted(profit.items()))
    for key, value in profit.items():
        tprofit.append({"year": key, "Events": int(value * 0.04)})
    return tprofit
                    
# Total Profit per Organization
@event.post("/profitperorg")
async def profit_per_org(data:dict):
    profit = {}
    eventprofit = {}
    tprofit = []
    org  = conn.event.organization.find_one({"clubname":data["clubname"]})
    if org:
        orgevent1  = conn.event.post.find({"clubname":data["clubname"]})
        orgevent2  = conn.event.pastevent.find({"clubname":data["clubname"]})
        memtype = org["memtype"]
        for singlemember in org["members"]:
            for singlememtype in memtype:
                if singlemember["subscribe"] and singlemember["membertype"] == singlememtype["type"]:
                    if singlemember["start_date"].year in profit:
                        profit[int(singlemember["start_date"].year)] += singlememtype["price"] * 0.12
                    else:
                        profit[int(singlemember["start_date"].year)] = singlememtype["price"] * 0.12
        for singlepost in orgevent1:
            totalparticipate = len(singlepost["participate"])
            totalprofit = totalparticipate * singlepost["ticket_price"]
            if singlepost["event_start_date"].year in eventprofit:
                eventprofit[int(singlepost["event_start_date"].year)] += totalprofit
            else:
                eventprofit[int(singlepost["event_start_date"].year)] = totalprofit
        for singlepost in orgevent2:
            totalparticipate = len(singlepost["participate"])
            totalprofit = totalparticipate * singlepost["ticket_price"]
            if singlepost["event_start_date"].year in eventprofit:
                eventprofit[int(singlepost["event_start_date"].year)] += totalprofit
            else:
                eventprofit[int(singlepost["event_start_date"].year)] = totalprofit
        for key, value in eventprofit.items():
            if key in profit:
                profit[key] += value * 0.04
            else:
                profit[key] = value * 0.04
        profit = dict(sorted(profit.items()))
        for key, value in profit.items():
            tprofit.append({"year": key, "Revenue": int(value)})
        return tprofit


# Routes for Organization -------------------------------------------------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>

# Get all Members of Organization by Clubname
@event.post("/organizationmember/")
async def organization_member(data: dict):
    org = conn.event.organization.find({"clubname": data["clubname"]})
    if org:
        data_dict = serializeList(org)[0]["members"]
        for i in data_dict:
            i["expiry_date"] = i["expiry_date"].strftime("%Y-%m-%d")
            i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
        return data_dict
    else:
        return {"error": "Member doesn't Exist", "success": False}

# Signup for Organizaton


@event.post("/organisationsignup/")
async def create_organization(organisation: Organization):
    appliedorg = dict(organisation)
    email_pattern = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, appliedorg["email"]) == None:
        return {"error": "Invalid Email Format", "success": False}

    number_pattern = r'^\d{10}$'
    if re.match(number_pattern, str(appliedorg["pnumber"])) == None:
        return {"error": "Phone Number in 10 Digits", "success": False}

    allorg = conn.event.organization.find()
    allorg = serializeList(allorg)
    orgusernameList = []
    for i in allorg:
        orgusernameList.append(i["username"])

    if appliedorg["username"] in orgusernameList:
        return {"error": "Username Already Exists", "success": False}
    else:
        adminlist = serializeList(conn.event.admin.find())
        if adminlist:
            for singleadmindict in adminlist:
                appliedlist = singleadmindict["applied_org"]
                for singleorg in appliedlist:
                    if singleorg["clubname"] == appliedorg["clubname"]:
                        return {"error": "You Have Already Applied", "success": False}

                singleadmindict["applied_org"].append(appliedorg)
                conn.event.admin.update_one({"_id": ObjectId(singleadmindict["_id"])}, {
                                            "$set":      {"applied_org": singleadmindict["applied_org"]}})
            return {"message": "Applied Successfully"}
        else:
            return {"error": "No Admin Available",   "success": False}

# Login for Organization


@event.post("/organisationlogin/")
async def organization_login(data: dict):
    d1 = conn.event.organization.find_one({"username": data["username"]})
    if d1 and d1["pwd"] == data["pwd"]:
        return serializeDict(d1)
    else:
        return {"error": "Invalid Username and Password", "success": False}

# Get all Membership Type (Only Type Name) by Clubname


@event.post("/getmemtype/")
async def get_memtype(data: dict):
    type = []
    cursor = conn.event.organization.find(
        {"clubname": data["clubname"]}, {"memtype": 1, "_id": 0})
    d1 = serializeList(cursor)
    for i in d1[0]["memtype"]:
        type.append(i["type"])
    return type


# Add Member in Organization
@event.put("/addorganizationmember/{id}")
async def add_member(id: str, member: User):
    data_dict = dict(member)

    email_pattern = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, data_dict["email"]) == None:
        return {"error": "Invalid Email Format", "success": False}

    number_pattern = r'^\d{10}$'
    if re.match(number_pattern, str(data_dict["pnumber"])) == None:
        return {"error": "Phone Number in 10 Digits", "success": False}

    start = data_dict["start_date"].strftime("%Y-%m-%d")
    expiry = data_dict["expiry_date"].strftime("%Y-%m-%d")
    start = datetime.strptime(start, "%Y-%m-%d")
    expiry = datetime.strptime(expiry, "%Y-%m-%d")
    if start > expiry or start == expiry:
        return {"error": "Start Date should be less than Expiry Date", "success": False}
    org = conn.event.organization.find({"_id": ObjectId(id)})
    if org:
        data_dict1 = serializeList(org)[0]["members"]
        for i in data_dict1:
            if (i["username"] == data_dict["username"]):
                return {"error": "Username already Exists", "success": False}
            if (i["memberid"] == data_dict["memberid"]):
                return {"error": "Member ID already Exists", "success": False}
    if data_dict["membertype"] == '':
        return {"error": "Select Membership Type", "success": False}
    del data_dict["clubname"]
    data_dict["expiry_date"] = data_dict["expiry_date"].strftime("%Y-%m-%d")
    data_dict["expiry_date"] = datetime.strptime(
        data_dict["expiry_date"], "%Y-%m-%d")
    data_dict["start_date"] = data_dict["start_date"].strftime("%Y-%m-%d")
    data_dict["start_date"] = datetime.strptime(
        data_dict["start_date"], "%Y-%m-%d")
    d1 = conn.event.organization.find_one({"_id": ObjectId(id)})
    if d1:
        # serializeDict(d1)["members"].append(data_dict)
        org1 = serializeDict(d1)
        org1["members"].append(data_dict)
        conn.event.organization.find_one_and_update(
            {"_id": ObjectId(id)}, {"$set": {"members": org1["members"]}})
        return {"data": "Member Added Successfully", "success": True}
    else:
        return {"error": "Invalid Input", "success": False}

# Update Member Details in Organization


@event.put("/organizationupdatememberdetails/")
async def update_member_details(data: dict):
    d1 = data["formData"]
    email_pattern = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, d1["email"]) == None:
        return {"error": "Invalid Email Format", "success": False}
    number_pattern = r'^\d{10}$'
    if re.match(number_pattern, str(d1["pnumber"])) == None:
        return {"error": "Phone Number in 10 Digits", "success": False}
    organisation = conn.event.organization.find_one(
        {"clubname": data["clubname"]})
    if organisation:

        org1 = serializeDict(organisation)
        # formdata = data["formData"]

        data["formData"]["expiry_date"] = datetime.strptime(
            data["formData"]["expiry_date"], "%Y-%m-%d")
        data["formData"]["start_date"] = datetime.strptime(
            data["formData"]["start_date"], "%Y-%m-%d")
        for memberdict in org1["members"]:
            if memberdict["memberid"] == data["memberId"]:
                memberdict.update(data["formData"])
                conn.event.organization.find_one_and_update({"_id": ObjectId(org1["_id"])}, {
                                                            "$set": {"members": org1["members"]}})
               
                return True
    else:
        return {"error": "Organisation not found", "success": False}

# Delete Member from Organization


@event.put("/deletemember")
async def delete_member(data: dict):
    org = conn.event.organization.find_one({"_id": ObjectId(data['orgid'])})
    if org:
        org1 = serializeDict(org)
        clubname = org1["clubname"]
        org1 = serializeDict(org)["members"]
        for i in org1:
            if i["memberid"] == data["memberid"]:
                i["clubname"] = clubname
                conn.event.deletemember.insert_one(i)
        updated_members = [
            i for i in org1 if i["memberid"] != data["memberid"]]
        conn.event.organization.find_one_and_update({"_id": ObjectId(data["orgid"])}, {
                                                    "$set": {"members": updated_members}})
        return {"data": "Member deleted Successfully", "success": True}
    else:
        return {"error": "Invalid Input", "success": False}

# Get all Membership of Organization by Clubname


@event.post("/getallmembership")
async def get_all_membership(data: dict):
    membership = conn.event.organization.find_one(
        {"clubname": data["clubname"]}, {"memtype": 1, "_id": 0})
    if membership:
        memtype = serializeDict(membership)["memtype"]
        if len(memtype) != 0:
            return memtype
        else:
            return {"error": "No Membership Type Available", "success": False}
    else:
        return {"error": "Organization Not Found", "success": False}

# Add New Membership in Organization


@event.put("/addmembership/{clubname}")
async def add_membership(clubname: str, data: dict):
    if type(data["price"]) == str:
        data["price"] = int(data["price"])
    membership = conn.event.organization.find_one(
        {"clubname": clubname}, {"memtype": 1, "_id": 0})
    if membership:
        memtype = serializeDict(membership)["memtype"]
        for i in memtype:
            if i["type"] == data["type"]:
                i["price"] = data["price"]
                conn.event.organization.find_one_and_update(
                    {"clubname": clubname}, {"$set": {"memtype": memtype}})
                return {"data": "Membership Updated Successfully", "success": True}
        memtype.append(data)
        conn.event.organization.find_one_and_update(
            {"clubname": clubname}, {"$set": {"memtype": memtype}})
        return {"data": "Membership Added Successfully", "success": True}
    else:
        return {"error": "Organization Not Found", "success": False}


# organisation's member table filters
@event.post("/organisationmembertablefilters")
async def membertable_filtering(filters: dict):
    data = filters["data"]
    filtered_data = {}
    for key, value in data.items():
        if (value != '' or value != ""):
            filtered_data[key] = re.escape(value)
    content = []
    if (len(filtered_data) != 0):

        regex_patterns = {}
        for key, value in data.items():
            if value:
                regex_patterns[key] = re.compile(
                    f'^{re.escape(value)}', re.IGNORECASE)
        membersList = filters["members"]
        if (membersList != []):
            for memberdict in membersList:
                match = all(regex.match(str(memberdict.get(key, '')))
                            for key, regex in regex_patterns.items())
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
            return {"error": "No Members", "success": False}
        # else:
        #     return {"error":"Organisation not found","success":False}
    else:

        return {"error": "Please enter data in filter input", "success": False, "data_dict": "empty"}

# Filtering a members by name,start date and expiry date


@event.post("/orgmemberfilter")
async def filter_members(data: dict):
    if (data["expiry_date"] != ''):
        data["expiry_date"] = datetime.strptime(
            data["expiry_date"], "%Y-%m-%d")
    if (data["start_date"] != ''):
        data["start_date"] = datetime.strptime(data["start_date"], "%Y-%m-%d")

    filtered_data = {}
    for key, value in data.items():
        if (value != '' or value != ""):
            filtered_data[key] = value
    organisation = conn.event.organization.find_one(
        {"_id": ObjectId(data["cid"])})
    result = []
    if organisation:

        org1 = serializeDict(organisation)
        partial_name = data["membername"]
        regex_pattern = re.compile(
            f"^{re.escape(partial_name)}.*", re.IGNORECASE)

        for memberdict in org1["members"]:
            if "name" in memberdict and re.match(regex_pattern, memberdict["name"]):
                if data["start_date"] != "" and data["expiry_date"] != "":
                    if memberdict["start_date"] >= filtered_data["start_date"] and memberdict["start_date"] <= filtered_data["expiry_date"]:
                        result.append(memberdict)
                elif data["start_date"] != "":
                    if memberdict["start_date"] >= filtered_data["start_date"]:
                        result.append(memberdict)
                elif data["expiry_date"] != "":
                    if memberdict["start_date"] <= filtered_data["expiry_date"]:
                        result.append(memberdict)
                else:
                    result.append(memberdict)
        if (result != []):
            for singledict in result:
                singledict["expiry_date"] = singledict["expiry_date"].strftime(
                    "%Y-%m-%d")
                singledict["start_date"] = singledict["start_date"].strftime(
                    "%Y-%m-%d")

            return result
        else:
            return {"error": "Member Not Found", "success": False}
    else:
        return {"error": "Organisation Not Found", "success": False}

# fetch all the applied users


@event.post("/allappliedusers")
async def adminside_allappliedusers(data: dict):
    clubId = data["clubid"]
    orgData = conn.event.organization.find({"_id": ObjectId(clubId)})
    orgData = serializeList(orgData)
    neworgdata = orgData[0]
    applied_users = neworgdata["memapplied"]
    if (len(applied_users) != 0):
        return applied_users
    else:
        return {"error": "No Applied Organisation", "success": False}

# accepting a user's subscription


@event.post("/acceptingusersubscription")
async def adminside_acceptorg(data: dict):

    memberdata = data["memberdata"]
    acceptedUser = data["data"]
    givenmemberid = memberdata["memberid"]
    startdate = memberdata["start_date"]
    startdate = datetime.strptime(startdate, "%Y-%m-%d")
    expirydate = memberdata["expiry_date"]
    expirydate = datetime.strptime(expirydate, "%Y-%m-%d")
    if (expirydate <= startdate):
        return {"error": "Start Date should be less than Expiry Date", "success": False}
    clubid = data["clubid"]

    org = conn.event.organization.find({"_id": ObjectId(clubid)})
    org = serializeList(org)[0]

    memberslists = org["members"]
    orgappliedmemberslist = org["memapplied"]

    allmemberid = []
    for singlemember in memberslists:
        allmemberid.append(singlemember["memberid"])

    if (len(allmemberid) != 0):
        if givenmemberid in allmemberid:
            return {"error": "MemberId Already Exists", "success": False, "closeform": False}
        else:

            acceptedUser["memberid"] = givenmemberid
            acceptedUser["start_date"] = startdate
            acceptedUser["expiry_date"] = expirydate

            usersloggedindata = acceptedUser

            # conn.event.user.insert_one(usersloggedindata)
            if (conn.event.user.find_one({"username": acceptedUser["username"]})):
                content = conn.event.user.find_one_and_update(
                    {"username": acceptedUser["username"]}, {"$set": usersloggedindata})
            else:
                conn.event.user.insert_one(usersloggedindata)

            acceptedUser["loggedin"] = True
            acceptedUser["subscribe"] = True
            del acceptedUser["clubname"]
            if "_id" in acceptedUser:
                del acceptedUser["_id"]

            memberslists.append(acceptedUser)

            updated_user = [
                i for i in orgappliedmemberslist if i["username"] != acceptedUser["username"]]

            content = conn.event.organization.find_one_and_update({"_id": ObjectId(
                org["_id"])}, {"$set": {"memapplied": updated_user, "members": memberslists}})

            if content:
                return True
            else:
                return {"error": "Nothing To Update", "success": False}
    else:
        acceptedUser["memberid"] = givenmemberid
        acceptedUser["start_date"] = startdate
        acceptedUser["expiry_date"] = expirydate

        usersloggedindata = acceptedUser
        conn.event.user.insert_one(usersloggedindata)

        acceptedUser["loggedin"] = True
        acceptedUser["subscribe"] = True
        del acceptedUser["clubname"]
        if "_id" in acceptedUser:
            del acceptedUser["_id"]

        memberslists.append(acceptedUser)

        updated_user = [
            i for i in orgappliedmemberslist if i["username"] != acceptedUser["username"]]

        content = conn.event.organization.find_one_and_update({"_id": ObjectId(
            org["_id"])}, {"$set": {"memapplied": updated_user, "members": memberslists}})

        if content:
            return True
        else:
            return {"error": "Nothing To Update", "success": False}

# rejecting subscribing user


@event.post("/rejectingsubscribinguser")
async def adminside_rejectorg(data: dict):
    rejectedUser = data["data"]

    conn.event.rejectedusers.insert_one(rejectedUser)

    orgdata = serializeDict(conn.event.organization.find_one(
        {"_id": ObjectId(data["clubid"])}))

    orgappliedmemberslist = orgdata["memapplied"]

    updated_user = [
        i for i in orgappliedmemberslist if i["username"] != rejectedUser["username"]]

    content = conn.event.organization.find_one_and_update(
        {"_id": ObjectId(orgdata["_id"])}, {"$set": {"memapplied": updated_user}})

    if content:
        return True
    else:
        return {"error": "Nothing To Update", "success": False}

# other organisation's fetch all post details


@event.post("/getotherorgeventposts")
async def get_other_org_eventposts(data: dict):
    response = conn.event.post.find({"clubname": {"$ne": data["clubname"]}})
    if response:
        lis = []
        d1 = {}
        for singleDict in response:
            d1 = singleDict
            d1["event_start_date"] = d1["event_start_date"].strftime(
                "%d-%m-%Y")
            d1["event_end_date"] = d1["event_end_date"].strftime("%d-%m-%Y")
            # conn.event.user.insert_one(d1)
            lis.append(serializeDict(d1))
        return serializeList(lis)
        # return serializeList(response)
    else:
        return {"error": "no post found", "success": False}

# other organisation event post filter functionality to fetch post


@event.post("/otherorgeventpostfilters")
async def other_org_eventpost_filters(data: dict):
    past_events()
    filtereddata = data["filteredFormData"]
    clubname = data["clubname"]
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

    and_conditions.append({"clubname": {"$ne": clubname}})
    if and_conditions:
        query["$and"] = and_conditions

    result = conn.event.post.find(query)

    # Iterate over the result and print each post
    response_list = serializeList(result)
    if response_list:
        lis = []
        d1 = {}
        for singleDict in response_list:
            d1 = singleDict
            d1["event_start_date"] = d1["event_start_date"].strftime(
                "%d-%m-%Y")
            d1["event_end_date"] = d1["event_end_date"].strftime("%d-%m-%Y")
            lis.append(serializeDict(d1))
        return serializeList(lis)
    else:
        return {"error": "Error, please fill the form again", "success": False}

# fetching other organisation's event posts by title


@event.post("/otherorgeventpostsbytitle")
async def otherorg_eventpost_bytitle(data: dict):
    past_events()
    clubname = data["clubname"]
    organisation = conn.event.organization.find_one({"clubname": clubname})
    if organisation:

        posts = conn.event.post.find({"clubname": {"$ne": clubname}})
        result = []
        if (posts != []):
            partial_name = data["title"]
            if (partial_name == ""):
                return {"error": "No Title input", "success": False}
            else:
                regex_pattern = re.compile(
                    f"^{re.escape(partial_name)}.*", re.IGNORECASE)

                for postdict in serializeList(posts):
                    # if postdict["event_title"] == data["title"]:
                    if "event_title" in postdict and re.match(regex_pattern, postdict["event_title"]):
                        result.append(postdict)
                        break
                if result:
                    return result
                else:
                    return {"error": "No post found", "success": False}
        else:
            return {"error": "No post found", "success": False}
    return {"error": "No organisation found", "success": False}

# Organization Feedback
@event.post("/organisationfeedback/")
async def organisation_feedback(data: dict):
    org = conn.event.organization.find_one({"clubname": data["clubname"]})
    if org:
        org1 = serializeDict(org)
        org1["feedback"].append(data["feedback"])
        conn.event.organization.find_one_and_update(
            {"clubname": data["clubname"]}, {"$set": {"feedback": org1["feedback"]}})
        return {"data": "Feedback Submitted Successfully", "success": True}
    else:
        return {"error": "Organization Not Found", "success": False}

# Feedback for Admin by Organization
@event.post("/adminfeedback/")
async def admin_feedback(data: dict):
    admin = conn.event.admin.find_one()
    if admin:
        admin1 = serializeDict(admin)
        if data["name"] =="organization":
            admin1["orgfeedback"].append(data["feedback"])
            conn.event.admin.find_one_and_update(
                {"username":"kunj"}, {"$set": {"orgfeedback": admin1["feedback"]}})
            return {"data": "Feedback Submitted Successfully", "success": True}
        elif data["name"] =="user":
            admin1["userfeedback"].append(data["feedback"])
            conn.event.admin.find_one_and_update(
                {"username":"kunj"}, {"$set": {"userfeedback": admin1["feedback"]}})
            return {"data": "Feedback Submitted Successfully", "success": True}
    else:
        return {"error": "Admin Not Found", "success": False}


# org dashboard graph data
@event.post("/orgdashboardgraph")
async def org_dashboard_graph(data: dict):
    clubname = data["clubname"]
    org = conn.event.organization.find_one({"clubname": clubname})
    # post = conn.event.post.find({"clubname": clubname})
    if org:
        # posts = serializeList(post)
        org = serializeDict(org)
        memtype = org["memtype"]
        nonsubscribers = []
        subscribers = []
        for i in org["members"]:
            if i["subscribe"] and i["start_date"].year == data["year"]:
                subscribers.append(i)
            else:
                nonsubscribers.append(i)
        month_names = [
            "Jan", "Feb", "March", "April",
            "May", "June", "July", "Aug",
            "Sept", "Oct", "Nov", "Dec"
        ]
        # totalevents = {}
        totalmembers = {}
        totalprofit = {}
        tmembers = []
        tprofit = []
        # tevent = []
        result = []
        # for i in posts:
        #     if i["event_start_date"].year == data["year"]:
        #         if month_names[i["event_start_date"].month-1] in totalevents:
        #             totalevents[month_names[i["event_start_date"].month-1]] += 1
        #         else:
        #             totalevents[month_names[i["event_start_date"].month-1]] = 1
        for i in subscribers:
            # Code For total Members in a month
            if month_names[i["start_date"].month-1] in totalmembers:
                totalmembers[month_names[i["start_date"].month-1]] += 1
            else:
                totalmembers[month_names[i["start_date"].month-1]] = 1
            # Code For total Profit in a month
            for j in memtype:
                if j["type"] == i["membertype"]:
                    if month_names[i["start_date"].month-1] in totalprofit:
                        totalprofit[month_names[i["start_date"].month-1]] += j["price"]
                    else:
                        totalprofit[month_names[i["start_date"].month-1]] = j["price"]
                    break
             
        for i in month_names:
            if i not in totalmembers:
                totalmembers[i] = 0
            if i not in totalprofit:
                totalprofit[i] = 0
            # if i not in totalevents:
            #     totalevents[i] = 0
        
        for key, value in totalmembers.items():
            tmembers.append({"month": key, "subscribers": value})
        tmembers = sorted(tmembers, key=lambda x: month_names.index(x['month']))
        for key, value in totalprofit.items():
            tprofit.append({"month": key, "profit": value})
        tprofit = sorted(tprofit, key=lambda x: month_names.index(x['month']))

        # for key, value in totalevents.items():
        #     tevent.append({"month": key, "events": value})
        result.append(tmembers)
        result.append(tprofit)
        return result
    else:
        return {"error": "Organisation Not Found", "success": False}
    
# get all year in which Event posts
@event.post("/getalleventyear")
async def get_all_event_year(data: dict):
    post1 = serializeList(conn.event.post.find({"clubname": data["clubname"]}))
    post2 = serializeList(conn.event.pastevent.find({"clubname": data["clubname"]}))
    years=[]
    if len(post1):
        for singlepost in post1:
            if singlepost["event_start_date"].year not in years:
                years.append(singlepost["event_start_date"].year)
    if len(post2):
        for singlepost in post2:
            if singlepost["event_start_date"].year not in years:
                years.append(singlepost["event_start_date"].year)
    years.sort(reverse=True)
    return years

# get all event post by year
@event.post("/geteventpostbyyear")
async def get_event_post_by_year(data: dict):
    month_names = [
            "Jan", "Feb", "March", "April",
            "May", "June", "July", "Aug",
            "Sept", "Oct", "Nov", "Dec"
        ]
    post1 = serializeList(conn.event.post.find({"clubname": data["clubname"]}))
    post2 = serializeList(conn.event.pastevent.find({"clubname": data["clubname"]}))
    result = []
    totalevents = {}
    tevents = []
    for i in post1:
        if i["event_start_date"].year == data["year"]:
            if month_names[i["event_start_date"].month-1] in totalevents:
                totalevents[month_names[i["event_start_date"].month-1]] += 1
            else:
                totalevents[month_names[i["event_start_date"].month-1]] = 1
    for i in post2:
        if i["event_start_date"].year == data["year"]:
            if month_names[i["event_start_date"].month-1] in totalevents:
                totalevents[month_names[i["event_start_date"].month-1]] += 1
            else:
                totalevents[month_names[i["event_start_date"].month-1]] = 1
    for i in month_names:
            if i not in totalevents:
                totalevents[i] = 0
    for key, value in totalevents.items():
        tevents.append({"month": key, "events": value})
    tevents = sorted(tevents, key=lambda x: month_names.index(x['month']))
    result.append(tevents)
    return result



# Routes for Post ------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>

# Insert Event Post
@event.post("/eventpost/")
async def event_post(data: EventPost):

    try:

        data_dict = dict(data)
        email_pattern = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if re.match(email_pattern, data_dict["event_organizer_email"]) == None:
            return {"error": "Invalid Email Format", "success": False}
        number_pattern = r'^\d{10}$'
        if re.match(number_pattern, str(data_dict["event_organizer_pnumber"])) == None:
            return {"error": "Phone Number in 10 Digits", "success": False}
        start = data_dict["event_start_date"].strftime("%Y-%m-%d")
        end = data_dict["event_end_date"].strftime("%Y-%m-%d")
        start = datetime.strptime(start, "%Y-%m-%d")
        end = datetime.strptime(end, "%Y-%m-%d")
        if start > end:
            return {"error": "Start Date should be less than or equal to End Date", "success": False}
        tstart = datetime.strptime(data_dict["start_time"], "%H:%M").time()
        tend = datetime.strptime(data_dict["end_time"], "%H:%M").time()
        if (tstart > tend):
            return {"error": "Start Time should be less than End Time", "success": False}
        if data_dict["type"] == '':
            return {"error": "Select Membership Type", "success": False}
        data_dict["event_start_date"] = data_dict["event_start_date"].strftime(
            "%Y-%m-%d")
        data_dict["event_end_date"] = data_dict["event_end_date"].strftime(
            "%Y-%m-%d")
        data_dict["event_start_date"] = datetime.strptime(
            data_dict["event_start_date"], "%Y-%m-%d")
        data_dict["event_end_date"] = datetime.strptime(
            data_dict["event_end_date"], "%Y-%m-%d")
        conn.event.post.insert_one(data_dict)
        return {"data": "Event data successfully submitted"}
    except ValueError:
        return {"error": "ValueError", "success": False}

# Get Event Post by Clubname


@event.post("/geteventposts")
async def get_event_posts(data: dict):
    past_events()
    response = conn.event.post.find({"clubname": data["clubname"]})
    if response:
        lis = []
        d1 = {}
        for singleDict in response:
            d1 = singleDict
            d1["event_start_date"] = d1["event_start_date"].strftime(
                "%d-%m-%Y")
            d1["event_end_date"] = d1["event_end_date"].strftime("%d-%m-%Y")
            lis.append(serializeDict(d1))
        return serializeList(lis)
    else:
        return {"error": "no post found", "success": False}

# Event Post filter by parameters


@event.post("/postfilters/{clubname}")
async def org_filters(clubname: str, filtereddata: dict):
    # Build the query based on the filteredFormData
    query = {}
    past_events()

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

    and_conditions.append({"clubname": clubname})
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
            d1["event_start_date"] = d1["event_start_date"].strftime(
                "%d-%m-%Y")
            d1["event_end_date"] = d1["event_end_date"].strftime("%d-%m-%Y")
            lis.append(serializeDict(d1))
        return serializeList(lis)
    else:
        return {"error": "No Such Post Available", "success": False}

# Delete Event Post


@event.delete("/deleteeventposts/{id}")
async def delete_user(id):
    past_events()
    # fetch the details using id
    # if details found execute the delete query
    # always test in swagger first
    # then bind with UI
    response = serializeDict(
        conn.event.post.find_one_and_delete({"_id": ObjectId(id)}))
    if response:
        return True
    else:
        return {"error": "no post found", "success": False}


# Post Feedback
@event.post("/postfeedback/")
async def post_feedback(data: dict):
    post = conn.event.post.find_one({"_id": ObjectId(data["postid"])})
    if post:
        post1 = serializeDict(post)
        post1["feedback"].append(data["feedback"])
        conn.event.post.find_one_and_update(
            {"_id": ObjectId(data["postid"])}, {"$set": {"feedback": post1["feedback"]}})
        return {"data": "Feedback Submitted Successfully", "success": True}
    else:
        return {"error": "Post Not Found", "success": False}


# Routes For User -------------------------------------------------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>

# Signup for User
@event.post("/usersignup/")
async def create_user(user: User):
    d1 = dict(user)
    email_pattern = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, d1["email"]) == None:
        return {"error": "Invalid Email Format", "success": False}
    number_pattern = r'^\d{10}$'
    if re.match(number_pattern, str(d1["pnumber"])) == None:
        return {"error": "Phone Number in 10 Digits", "success": False}
    allorg = conn.event.organization.find()
    allorg = serializeList(allorg)

    usernameList = []
    for singleorg in allorg:
        memberlist = singleorg["members"]
        for i in memberlist:
            usernameList.append(i["username"])
    allactiveusers = conn.event.user.find()
    allactiveusers = serializeList(allactiveusers)
    for j in allactiveusers:
        usernameList.append(j["username"])

    uniqueusernameList = list(set(usernameList))

    if d1["username"] in uniqueusernameList:
        return {"error": "Username already exists", "success": False}
    else:
        conn.event.user.insert_one(dict(user))
        return dict(user)

# Login for User


@event.post("/userlogin/")
async def check_user(data: dict):
    if data["clubname"] == "None" or data["clubname"] == "":
        data["clubname"] = None
    flag = 0
    d1 = {}
    u1 = conn.event.user.find_one({"$and": [{"username": data["username"]}, {
                                  "pwd": data["pwd"]}, {"clubname": data["clubname"]}]})
    u3 = conn.event.organization.find_one({"clubname": data["clubname"]})
    if u1:
        return serializeDict(u1)
    elif u3:
        user3 = serializeDict(u3)
        membersList = user3["members"]
        for singleDict in membersList:
            if (singleDict["username"] == data["username"]) and (singleDict["pwd"] == data["pwd"]):
                flag = 1
                d1 = singleDict
                d1["loggedin"] = True
                singleDict.update(d1)
                conn.event.organization.find_one_and_update({"clubname": data["clubname"]}, {
                                                            "$set": {"members": membersList}})
                del d1["loggedin"]
                d1["clubname"] = data["clubname"]
                conn.event.user.insert_one(d1)
                return serializeDict(d1)
        if flag == 0:
            return {"error": "Invalid Username , Password and Clubname", "success": False}
    else:
        return {"error": "Invalid Username , Password and Clubname", "success": False}

# Get all Post For Users


@event.post("/fetchingallpostforuser/{uname}")
async def fetch_all_post_userside(uname: str):
    past_events()
    result = conn.event.post.find()
    posts = []
    if (result != []):
        allpost = serializeList(result)
        for i in allpost:
            if len(i["participate"]) != 0:
                for j in i["participate"]:
                    if j["username"] == uname:
                        break
                else:
                    i["event_start_date"] = i["event_start_date"].strftime(
                        "%d-%m-%Y")
                    i["event_end_date"] = i["event_end_date"].strftime(
                        "%d-%m-%Y")
                    posts.append(i)
            else:
                i["event_start_date"] = i["event_start_date"].strftime(
                    "%d-%m-%Y")
                i["event_end_date"] = i["event_end_date"].strftime("%d-%m-%Y")
                posts.append(i)
        return (posts)
    else:
        return {"error": "No post found", "success": False}

# Post Filter for user


@event.post("/postfilterforuser")
async def postfilter_user(data: dict):
    past_events()
    query = {}
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

        if field == "type" and value != "":
            and_conditions.append({"type": value})
        if field == "clubname" and value != "":
            and_conditions.append({"clubname": value})

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
            d1["event_start_date"] = d1["event_start_date"].strftime(
                "%d-%m-%Y")
            d1["event_end_date"] = d1["event_end_date"].strftime("%d-%m-%Y")
            lis.append(serializeDict(d1))
        return serializeList(lis)
    else:
        return {"error": "No Such Post Available", "success": False}

# User Participate in Event


@event.put("/eventparticipate/{id}")
async def event_participate(id: str, data: dict):
    past_events()
    data["age"] = int(data["age"])
    email_pattern = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, data["email"]) == None:
        return {"error": "Invalid Email Format", "success": False}
    number_pattern = r'^\d{10}$'
    if re.match(number_pattern, str(data["pnumber"])) == None:
        return {"error": "Phone Number in 10 Digits", "success": False}
    post = conn.event.post.find_one({"_id": ObjectId(id)})
    if post:
        p1 = serializeDict(post)["participate"]
        p1.append(data)
        conn.event.post.find_one_and_update(
            {"_id": ObjectId(id)}, {"$set": {"participate": p1}})
        return {"data": "Partcipated Successfully"}
    else:
        return {"error": "Event Not Found", "success": False}

# Post Search by User using Title
@event.post("/postsearchbyuser")
async def post_search_user(data: dict):
    past_events()
    result = conn.event.post.find()
    posts = []
    regex_pattern = re.compile(f"^{re.escape(data['title'])}.*", re.IGNORECASE)

    if (result != []):
        allpost = serializeList(result)
        for i in allpost:
            if re.match(regex_pattern, i["event_title"]):
                if len(i["participate"]) != 0:
                    for j in i["participate"]:
                        if j["username"] == data["uname"]:
                            break
                    else:
                        i["event_start_date"] = i["event_start_date"].strftime(
                            "%d-%m-%Y")
                        i["event_end_date"] = i["event_end_date"].strftime(
                            "%d-%m-%Y")
                        posts.append(i)
                else:
                    i["event_start_date"] = i["event_start_date"].strftime(
                        "%d-%m-%Y")
                    i["event_end_date"] = i["event_end_date"].strftime(
                        "%d-%m-%Y")
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


# User Subscribe
@event.put('/usersubscribe')
async def user_subscribe(user: dict):

    appliedmem = user
    appliedmem["pnumber"] = int(appliedmem["pnumber"])
    email_pattern = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, appliedmem["email"]) == None:
        return {"error": "Invalid Email Format", "success": False}
    number_pattern = r'^\d{10}$'
    if re.match(number_pattern, str(appliedmem["pnumber"])) == None:
        return {"error": "Phone Number in 10 Digits", "success": False}
    # if datetime.strptime(appliedmem["event_start_date"], "%Y-%m-%d") < datetime.strptime(appliedmem["event_expiry_date"], "%Y-%m-%d"):
    #     return {"error":"Start Date should be less than Expiry Date","success":False}

    orgdict = serializeDict(conn.event.organization.find_one(
        {"clubname": appliedmem["clubname"]}))
    # return orgdict
    if len(orgdict) != 0:
        orgmem = orgdict["members"]
        orgapplied = orgdict["memapplied"]
        if len(orgmem) != 0:
            for i in orgmem:
                if i["username"] == appliedmem["username"]:
                    return {"error": "Username already Exist", "success": False}
            else:
                if len(orgapplied) != 0:
                    for j in orgapplied:
                        if j["username"] == appliedmem["username"] and j["email"] == appliedmem["email"] and j["pnumber"] == appliedmem["pnumber"]:
                            return {"error": "Similar Username,MemberId,Email and Phone Number are already Applied", "success": False}
                    else:
                        orgapplied.append(appliedmem)
                        conn.event.organization.update_one({"clubname": appliedmem["clubname"]}, {
                                                           "$set":  {"memapplied": orgapplied}})
                        return {"data": "Applied For Subscription Successfully.", "success": True}
                else:
                    orgapplied.append(appliedmem)
                    conn.event.organization.update_one({"clubname": appliedmem["clubname"]}, {
                                                       "$set":  {"memapplied": orgapplied}})
                    return {"data": "Applied For Subscription Successfully.", "success": True}
        else:
            orgapplied.append(appliedmem)
            conn.event.organization.update_one({"clubname": appliedmem["clubname"]}, {
                                               "$set":  {"memapplied": orgapplied}})
            return {"data": "Applied For Subscription Successfully.", "success": True}
    else:
        return {"error": "Organization Not Found", "success": False}

# Get User Participated Events
@event.post("/userparticipated/{uname}")
async def user_participated(uname: str):
    past_events()
    post = conn.event.post.find()
    allpost = []
    if post:
        postlist = serializeList(post)
        for singlepost in postlist:
            if len(singlepost) != 0:
                for singlepart in singlepost["participate"]:
                    if singlepart["username"] == uname:
                        singlepost["event_start_date"] = singlepost["event_start_date"].strftime(
                            "%d-%m-%Y")
                        singlepost["event_end_date"] = singlepost["event_end_date"].strftime(
                            "%d-%m-%Y")
                        allpost.append(singlepost)
        if len(allpost) != 0:
            return allpost
        else:
            return {"error": "You are not Participated in any Event", "success": False}
    else:
        return {"error": "Post Not Found", "success": False}

# Get Membership Type using Clubname and Username
@event.post("/filtermemtype")
async def filter_memtype(data: dict):
    org = serializeDict(conn.event.organization.find_one(
        {"clubname": data["clubname"]}))
    if len(org) != 0:
        memtype = org["memtype"]
        for singlemember in org["members"]:
            if singlemember["username"] == data["username"]:
                memtype = [item for item in memtype if item["type"]
                           != singlemember["membertype"]]
        return memtype


# General Routes ------------------------------------------------------------------------------------------>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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
async def all_membershiptype():
    allmemtype = []
    allorg = conn.event.organization.find({})
    if allorg:
        allorg1 = serializeList(allorg)
        for i in allorg1:
            if i["memtype"] != []:
                for j in i["memtype"]:
                    if j["type"] not in allmemtype:
                        allmemtype.append(j["type"])
    return allmemtype

# searching any org by org-name


@event.post("/searchingorgbyname")
async def search_org_byname(data: dict):
    search_query = data["clubname"]
    regex_pattern = re.compile(f"^{re.escape(search_query)}.*", re.IGNORECASE)
    result = conn.event.organization.find(
        {"clubname": {"$regex": regex_pattern}})

    result = serializeList(result)
    if result:
        return result
    else:
        return {"error": "No organisation found", "success": False}


# Sorting of Member list by Parameters
@event.post("/membersorting")
async def member_sorting(data: dict):
    org = data["members"]
    if org:
        if len(org) != 0:
            if data["value"]:
                sorted_list = sorted(org, key=lambda x: x[data["col"]])
                return sorted_list
            else:
                sorted_list = sorted(
                    org, key=lambda x: x[data["col"]], reverse=True)
                return sorted_list

    else:
        return {"error": "Organization not Found", "success": False}


def send_email(to: str, subject: str, message: str):
    try:
        # Create an EmailMessage
        email = EmailMessage()
        email.set_content(message)
        email["Subject"] = subject
        email["From"] = gmail_user
        email["To"] = to

        # Connect to Gmail SMTP server
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            # Log in to the Gmail account
            server.login(gmail_user, gmail_password)
            # Send the email
            server.send_message(email)

        return JSONResponse(content={"message": "Email sent successfully"}, status_code=200)
    except smtplib.SMTPAuthenticationError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def past_events():
    events = conn.event.post.find()
    if events:
        eventlist = serializeList(events)
        today = datetime.now()
        for i in eventlist:
            merged_datetime = datetime.combine(i["event_end_date"], datetime.strptime(i["end_time"], "%H:%M").time())
            if merged_datetime < today:
                conn.event.pastevent.insert_one(i)
                conn.event.post.find_one_and_delete({"_id": ObjectId(i["_id"])})
    
# get all year in which member is subscribed
@event.post("/getallsubscribedyear")
async def get_all_subscribed_year(data: dict):
    org = serializeDict(conn.event.organization.find_one(
        {"clubname": data["clubname"]}))
    years=[]
    if len(org) != 0:
        for singlemember in org["members"]:
            if singlemember["start_date"].year not in years and singlemember["subscribe"] == True:
                years.append(singlemember["start_date"].year)
        years.sort(reverse=True)
        return years

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

# Subject= "Subscription Status Update"
#                 message = """

#                     Dear KD,
#                     We hope this message finds you well. We are writing to inform you about the status of your subscription to organizations on EventWiz.

#                     Great news! You have been successfully subscribed to [Organization Name]. Welcome to our community, and we look forward to your active participation.

#                     Additionally, if you had previously applied for a subscription to another organization, we regret to inform you that your application for [Other Organization Name] has been removed. This is because you are already a valued member of [Accepted Organization Name].

#                     If you wish to join [Other Organization Name], we kindly ask you to create a separate account for this organization. Feel free to reach out if you have any questions or need assistance in the process.

#                     Thank you for being a part of EventWiz, and we look forward to your continued engagement.

#                     Best regards,
#                     EventWiz Team
#                 """
#                 send_email(to="kunjdetroja52@gmail.com", subject=Subject, message=message)
