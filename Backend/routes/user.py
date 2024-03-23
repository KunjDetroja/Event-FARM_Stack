from fastapi import APIRouter, HTTPException
from models.user import *
from config.db import conn
from schemas.user import serializeDict, serializeList
from bson import ObjectId
from datetime import datetime
import re
from bson.regex import Regex
from fastapi.responses import JSONResponse
from email.message import EmailMessage
import smtplib
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os


event = APIRouter()
# from fastapi import status

load_dotenv()

gmail_user = os.getenv("GMAIL_USER")
gmail_password = os.getenv("GMAIL_PASSWORD")

# Send Email


def send_email(to: str, subject: str, message: str):
    try:
        # Create an EmailMessage
        # email = EmailMessage()
        # email.set_content(message)
        email = MIMEMultipart()
        email.attach(MIMEText(message, "html"))
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


def acceptinguser(data):
    print(data)
    name = data["name"]
    clubname = data["clubname"]
    email = data["email"]

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
        }}
        .content {{
            margin-bottom: 20px;
            font-size : 1.5rem;
        }}
    </style>
    </head>
    <body>
    
    <div class="content">
        <p>Dear <strong>{name}</strong>,</p>
        
        <p>We hope this message finds you well. We are writing to inform you about the status of your subscription to organizations on EventWiz.</p>
        
        <p><strong>Great news!</strong> You have been successfully subscribed to <strong>{clubname}</strong>. Welcome to our community, and we look forward to your active participation.</p>
        
        <p>Additionally, if you had previously applied for a subscription to another organization, we regret to inform you that your application for other Organization has been removed. This is because you are already a valued member of <strong>{clubname}</strong>.</p>
        
        <p>If you wish to join other organization, we kindly ask you to create a separate account for this organization. Feel free to reach out if you have any questions or need assistance in the process.</p>
        
        <p>Thank you for being a part of EventWiz, and we look forward to your continued engagement.</p>
        
        <p>Best regards,<br>EventWiz Team</p>
    </div>
    </body>
    </html>
    """

    send_email(to=email, subject="Subscription Status Update",
               message=html_content)

    return True


def acceptingorg(data):

    clubname = data["clubname"]
    email = data["email"]

    html_content = f""" <!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
        }}
        .content {{
            margin-bottom: 20px;
            font-size : 1.5rem;
        }}
    </style>
</head>
<body>

<div class="content">

    <p>Dear <strong>{clubname}</strong>,</p>
    
    <p>Congratulations! We are thrilled to inform you that your organization's application to join EventWiz has been approved. Welcome to our vibrant community!</p>
    
    <p>Your members can now access and explore all the exciting events available on our platform. This opens up opportunities for collaboration, networking, and growth within our diverse community.</p>
    
    <p>Should you have any questions or need assistance, please don't hesitate to reach out. We look forward to seeing your organization thrive on EventWiz.</p>
    
    <p>Thank you for considering EventWiz.</p>
    
    <p>Best regards,<br>EventWiz Team</p>
</div>
</body>
</html> """

    send_email(to=email, subject="Welcome to EventWiz - Your Organization's Application Approved!",
               message=html_content)

    return True


def rejectinguser(data):

    name = data["name"]
    clubname = data["clubname"]
    email = data["email"]

    html_content = f"""<!DOCTYPE html>
    <html>
        <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 20px;
            }}
            .content {{
                margin-bottom: 20px;
            }}
        </style>
        </head>
    <body>

    <div class="content">

        <p>Dear <strong>{name}</strong>,</p>

        <p>We hope this message finds you well. We appreciate your interest in becoming a member of [Organization Name]. After careful consideration, we regret to inform you that your subscription request has not been accepted at this time.</p>

        <p>While we understand this news may be disappointing, we encourage you to explore other organizations on EventWiz that align with your interests. Our platform offers a diverse range of opportunities, and we're confident you'll find a community that suits your preferences.</p>

        <p>Thank you for considering <strong>{clubname}</strong>, and we hope you continue to explore and engage with the exciting opportunities available through EventWiz.</p>

        <p>If you have any questions or require further assistance, feel free to reach out.</p>

        <p>Best regards,<br>EventWiz Team</p>
    </div>
    </body>
    </html>
 """

    send_email(to=email, subject="Subscription Status Update",
               message=html_content)

    return True


def rejectingorg(data):

    clubname = data["clubname"]
    email = data["email"]

    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
        }}
        .content {{
            margin-bottom: 20px;
            font-size:1.5rem;
        }}
    </style>
</head>
<body>

<div class="content">

    <p>Dear <strong>{clubname}</strong>,</p>
    
    <p>We trust this message finds you well. Thank you for your application to join EventWiz. After careful review, we regret to inform you that your organization's application has not been approved at this time.</p>
    
    <p>While we appreciate your interest in being part of our platform, we must adhere to certain criteria to ensure the best experience for all our users. If you have any questions or would like further clarification on the decision, please don't hesitate to reach out.</p>
    
    <p>We encourage you to explore other opportunities within our community, and we wish you continued success in your endeavors.</p>
    
    <p>Thank you for considering EventWiz.</p>
    
    <p>Best regards,<br>EventWiz Team</p>
</div>
</body>
</html>

 """

    send_email(to=email, subject="Application Status Update",
               message=html_content)

    return True


def admindeletingorg(data):

    clubname = data["clubname"]
    email = data["email"]

    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
        }}
        .content {{
            margin-bottom: 20px;
            font-size:1.5rem;
        }}
    </style>
</head>
<body>

<div class="content">

    <p>Dear <strong>{clubname}</strong>,</p>
    
    <p>We hope this message finds you well. We regret to inform you that, after careful consideration, your organization has been deleted from EventWiz.</p>
    
    <p>This decision was made based on some reasons, and we understand this news may come as a disappointment. If you have any questions or concerns regarding this decision, please feel free to reach out to us for further clarification.</p>
    
    <p>We appreciate your understanding and thank you for your past engagement with EventWiz.</p>
    
    <p>Best regards,<br>EventWiz Team</p>
</div>
</body>
</html>

 """

    send_email(to=email, subject="Important Notice - Organization Deletion from EventWiz",
               message=html_content)

    return True


def admindeletingnewuser(data):

    name = data["name"]
    email = data["email"]

    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
        }}
        .content {{
            margin-bottom: 20px;
            font-size:1.5rem;
        }}
    </style>
</head>
<body>

<div class="content">

    <p>Dear <strong>{name}</strong>,</p>
    
    <p>We hope this message finds you well. We regret to inform you that, after careful consideration, your account on EventWiz has been deleted.</p>
    
    <p>If you have any questions or concerns regarding this decision, please feel free to reach out to us for further clarification.</p>
    
    <p>We appreciate your understanding and thank you for your past engagement with EventWiz.</p>
    
    <p>Best regards,<br>EventWiz Team</p>
</div>
</body>
</html>

 """

    send_email(to=email, subject="Important Notice - Account Deletion from EventWiz",
               message=html_content)

    return True

def admindeletingorgpost(data):

    clubname = data["clubname"]
    email = data["email"]
    postname = data["postname"]

    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
        }}
        .content {{
            margin-bottom: 20px;
            font-size:1.5rem;
        }}
    </style>
</head>
<body>

<div class="content">

    <p>Dear <strong>{clubname}</strong>,</p>
    
    <p>We hope this message finds you well. We regret to inform you that, after careful consideration, your organization's post <strong>{postname}</strong> has been deleted from EventWiz.</p>
    
    <p>This decision was made based on some reasons, and we understand this news may come as a disappointment. If you have any questions or concerns regarding this decision, please feel free to reach out to us for further clarification.</p>
    
    <p>We appreciate your understanding and thank you for your past engagement with EventWiz.</p>
    
    <p>Best regards,<br>EventWiz Team</p>
</div>
</body>
</html>

 """

    send_email(to=email, subject="Important Notice - Post Deletion from EventWiz",
               message=html_content)

    return True

def orgdeletingmember(data):

    clubname = data["clubname"]
    name = data["name"]
    email = data["email"]
    orgowner = data["ownname"]

    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
        }}
        .content {{
            margin-bottom: 20px;
            font-size:1.5rem;
        }}
    </style>
</head>
<body>

<div class="content">

    <p><strong>Subject:</strong> </p>

    <p>Dear <strong>{name}</strong>,</p>
    
    <p>We hope this message finds you well. We regret to inform you that, after careful consideration, your membership with <strong>{clubname}</strong> on EventWiz has been deleted.</p>
    
    <p>If you have any questions or concerns regarding this decision, please feel free to reach out to the organization's admin for further clarification.</p>
    
    <p>We appreciate your understanding and thank you for your past engagement with <strong>{clubname}</strong> on EventWiz.</p>
    
    <p>Best regards,<br>{orgowner}<br>{clubname} EventWiz Team</p>
</div>
</body>
</html>

 """

    send_email(to=email, subject=f"Important Notice - Membership Deletion from {clubname}",
               message=html_content)

    return True


def orgupdatingmemberdata(data):

    clubname = data["clubname"]
    name = data["name"]
    email = data["email"]
    orgowner = data["ownname"]

    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
        }}
        .content {{
            margin-bottom: 20px;
            font-size:1.5rem;
        }}
    </style>
</head>
<body>

<div class="content">

    <p><strong>Subject:</strong> </p>

    <p>Dear <strong>{name}</strong>,</p>
    
    <p>We hope this message finds you well. We wanted to inform you that your information on EventWiz has been updated by <strong>{clubname}</strong>.</p>
    
    <p>If you have any specific questions about the updates or need further clarification, feel free to reach out to the organization's admin.</p>
    
    <p>Thank you for being a valued member of <strong>{clubname}</strong> on EventWiz.</p>
    
    <p>Best regards,<br>{orgowner}<br>{clubname} EventWiz Team</p>
</div>
</body>
</html>

 """

    send_email(to=email, subject=f"Update: Your Information has been Updated by {clubname}",
               message=html_content)

    return True



@event.get('/')
async def find_all_users():
    # return {"message": "Welcome to EventWiz"}
    org = conn.EventWiz.organisation.find()
    if org:
        return serializeList(org)
    else:
        return {"error": "No Organisations", "success": False}

# /////////////////////////////ADMIN///////////////////////////////////////////

# admin login


@event.post("/adminlogin")
async def admin_login(data: Admin):
    adminform = dict(data)
    # print(adminform)
    adminlist = conn.EventWiz.admin.find(
        {"$and": [{"username": adminform["username"]}, {"pwd": adminform["pwd"]}]})
    content = serializeList(adminlist)
    # print(content)
    if (len(content) != 0):
        # print(content)
        # singledict = content[0]
        # print(singledict["applied_org"])
        # singledict["applied_org"] = serializeList(singledict["applied_org"])

        return content
    else:
        return {"error": "Invalid Username Password", "success": False}

# fetching all organisations


@event.get("/allorganisations")
async def fetch_all_org():
    result = conn.EventWiz.organisation.find()
    if result:
        org = serializeList(result)
        for i in org:
            for j in i["members"]:
                j["expiry_date"] = j["expiry_date"].strftime("%Y-%m-%d")
                j["start_date"] = j["start_date"].strftime("%Y-%m-%d")
    return org

# searching any org by org-name


@event.post("/searchingorgbyname")
async def search_org_byname(data: dict):
    search_query = data["clubname"]
    regex_pattern = re.compile(f"^{re.escape(search_query)}.*", re.IGNORECASE)
    result = conn.EventWiz.organisation.find(
        {"clubname": {"$regex": regex_pattern}})

    result = serializeList(result)
    if result:
        # print(result)
        return result
    else:
        return {"error": "No organisation found", "success": False}

# search org member details


@event.post("/adminorgsearchfilter")
async def org_search_filters(data: dict):

    memberlist = data["memberlist"]
    # print(memberlist)
    newdata = data
    del newdata["memberlist"]
    # print(newdata)
    if (newdata["expiry_date"] != ''):
        # data["expiry_date"] = data["expiry_date"].strftime("%Y-%m-%d")
        newdata["expiry_date"] = datetime.strptime(
            newdata["expiry_date"], "%Y-%m-%d")
    if (newdata["start_date"] != ''):
        # data["start_date"] = data["start_date"].strftime("%Y-%m-%d")
        newdata["start_date"] = datetime.strptime(
            newdata["start_date"], "%Y-%m-%d")

    # print(data)
    filtered_data = {}
    for key, value in newdata.items():
        if (value != '' or value != ""):
            filtered_data[key] = value
    print(filtered_data)

    # if not filtered_data:
    #     return {"error": "Empty Filter inputs", "success": False}

    print("inside else")
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

    print(result)
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
    # print(filtered_data)
    content = []
    if (len(filtered_data) != 0):

        regex_patterns = {}
        for key, value in data.items():
            if value:
                regex_patterns[key] = re.compile(
                    f'^{re.escape(value)}', re.IGNORECASE)

        # print (regex_patterns)
        # organisation = conn.EventWiz.organisation.find_one({"_id":ObjectId(orgid)})
        membersList = filters["memberlist"]
        # if membersList:
        # org1 = serializeDict(organisation)
        # membersList = org1["members"]
        if (membersList != []):
            for memberdict in membersList:
                match = all(regex.match(str(memberdict.get(key, '')))
                            for key, regex in regex_patterns.items())
                if match:
                    content.append(memberdict)
            if content:
                return content
            else:
                return {"error": "No Members", "success": False}
        else:
            return {"error": "No Members", "success": False}
        # else:
        #     return {"error":"Organisation not found","success":False}
    else:

        return {"error": "Please enter data in filter input", "success": False, "data_dict": "empty"}

# admin side org delete


@event.post("/admindeletesorg")
async def adminside_orgdelete(data: dict):
    # print(data)
    clubname = data["clubname"]
    org = conn.EventWiz.organisation.find_one({"clubname": clubname})

    org = serializeDict(org)
    members = org["members"]

    for member in members:

        content = conn.EventWiz.users.find_one(
            {"username": member["username"]})
        if content:
            userdetails = serializeDict(content)

            userdetails["memberid"] = None
            userdetails["membertype"] = "Public"
            userdetails["start_date"] = None
            userdetails["expiry_date"] = None
            userdetails["clubname"] = None

            conn.EventWiz.users.find_one_and_update({"username": member["username"]}, {
                                                    "$set": {key: value for key, value in userdetails.items() if key != '_id'}})

            print(userdetails)
    conn.EventWiz.deletedorg.insert_one(org)
    conn.EventWiz.organisation.delete_one({"clubname": clubname})
    # print(memberslist)
    data = {"clubname": org["clubname"], "email": org["email"]}
    print(data)
    admindeletingorg(data)
    return True


# admin side loggedin members
@event.post("/loggedinmembers")
async def loggedin_members(data: dict):

    logginemembers = []
    for singledict in data["data"]:
        if singledict["loggedin"] == True:
            logginemembers.append(singledict)
    if logginemembers:
        print(logginemembers)
        for i in logginemembers:
            if (i["expiry_date"] != ''):
                i["expiry_date"] = i["expiry_date"][0:10]

            if (i["start_date"] != ''):
                i["start_date"] = i["start_date"][0:10]
        return logginemembers
    else:
        return {"error": "No loggedin members", "success": False}
        # print("no members has loggedin")


# admin side loggedin members
@event.post("/inactivemembers")
async def inactive_members(data: dict):

    inactivemembers = []
    for singledict in data["data"]:
        if singledict["loggedin"] == False:
            inactivemembers.append(singledict)
    if inactivemembers:
        # print(logginemembers)
        for i in inactivemembers:
            if (i["expiry_date"] != ''):
                i["expiry_date"] = i["expiry_date"][0:10]

            if (i["start_date"] != ''):
                i["start_date"] = i["start_date"][0:10]
        return inactivemembers
    else:
        return {"error": "No loggedin members", "success": False}
        # print("no members has loggedin")

# all subscribe users


@event.post("/subscribeusers")
async def adminside_subscribedusers(data: dict):
    print(data["data"])
    if data["data"]:
        userdata = data["data"]
        content = []
        for user in userdata:
            if user["subscribe"] == True:
                content.append(user)
        if content:
            for i in content:
                if (i["expiry_date"] != ''):
                    i["expiry_date"] = i["expiry_date"][0:10]

                if (i["start_date"] != ''):
                    i["start_date"] = i["start_date"][0:10]
            return content
        else:
            return {"message": "No EventWiz Members", "success": False, "error": "empty"}

    else:
        return {"error": "No members", "success": False}


# fetching all users
@event.get("/adminmemberdetails")
async def adminside_allusers():
    result = conn.EventWiz.users.find({})
    result = serializeList(result)
    # print(result)
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
    result = conn.EventWiz.users.find({})
    result = serializeList(result)
    # print(result)
    if result:
        for i in result:
            if (i["memberid"] == None):
                newuserslist.append(i)
        # print(newuserslist)
        return newuserslist
    else:
        return {"error": "No New Users", "success": False}

# deleting a new website user


@event.post("/deletenewuser")
async def adminside_deletenewuser(data: dict):
    past_events()

    print(data["data"])
    data = data["data"]
    givenusername = data["username"]
    org = serializeList(conn.EventWiz.organisation.find())
    for singleorg in org:
        appliedlist = []
        for singlemember in singleorg["memapplied"]:
            if singlemember["username"] != givenusername:
                appliedlist.append(singlemember)
        if (len(appliedlist) != 0):
            conn.EventWiz.organisation.find_one_and_update({"_id": ObjectId(singleorg["_id"])}, {"$set": {
                "memapplied": appliedlist
            }})

    publicpost = serializeList(conn.EventWiz.post.find({"type": "Public"}))
    for singlepost in publicpost:
        allparticipaters = []
        for singleparticipate in singlepost["participate"]:
            if singleparticipate["username"] != givenusername:
                allparticipaters.append(singleparticipate)
        if (len(allparticipaters) != 0):
            conn.EventWiz.post.find_one_and_update({"_id": ObjectId(singlepost["_id"])}, {"$set": {
                "participate": allparticipaters
            }})

    conn.EventWiz.deletedusers.insert_one(serializeDict(
        conn.EventWiz.users.find_one({"username": givenusername})))

    conn.EventWiz.users.find_one_and_delete({"username": givenusername})

    data = {"name": data["name"], "email": data["email"]}
    admindeletingnewuser(data)
    return True

# removing a website user/member


@event.post("/removingmember")
async def adminside_removeuser(data: dict):
    past_events()
    print(data["data"])
    data = data["data"]
    givenusername = data["username"]

    org = serializeList(conn.EventWiz.organisation.find())
    for singleorg in org:
        appliedlist = []
        for singlemember in singleorg["memapplied"]:
            if singlemember["username"] != givenusername:
                appliedlist.append(singlemember)
        if (len(appliedlist) != 0):
            conn.EventWiz.organisation.find_one_and_update({"_id": ObjectId(singleorg["_id"])}, {"$set": {
                "memapplied": appliedlist
            }})
        memberlist = []
        for singlemember in singleorg["members"]:
            if singlemember["username"] != givenusername:
                memberlist.append(singlemember)
        if (len(memberlist) != 0):
            conn.EventWiz.organisation.find_one_and_update({"_id": ObjectId(singleorg["_id"])}, {"$set": {
                "members": memberlist
            }})

    publicpost = serializeList(conn.EventWiz.post.find())
    for singlepost in publicpost:
        allparticipaters = []
        for singleparticipate in singlepost["participate"]:
            if singleparticipate["username"] != givenusername:
                allparticipaters.append(singleparticipate)
        if (len(allparticipaters) != 0):
            conn.EventWiz.post.find_one_and_update({"_id": ObjectId(singlepost["_id"])}, {"$set": {
                "participate": allparticipaters
            }})

    conn.EventWiz.deletedusers.insert_one(serializeDict(
        conn.EventWiz.users.find_one({"username": givenusername})))

    conn.EventWiz.users.find_one_and_delete({"username": givenusername})

    data = {"name": data["name"], "email": data["email"]}
    admindeletingnewuser(data)

    return True

# searching user by name , start_date/expiry_date


@event.post("/usersearchform")
async def adminside_searchuser(data: dict):
    memberlist = serializeList(conn.EventWiz.users.find({}))
    # print(memberlist)

    # print(newdata)
    if (data["expiry_date"] != ''):
        # data["expiry_date"] = data["expiry_date"].strftime("%Y-%m-%d")
        data["expiry_date"] = datetime.strptime(
            data["expiry_date"], "%Y-%m-%d")
    if (data["start_date"] != ''):
        # data["start_date"] = data["start_date"].strftime("%Y-%m-%d")
        data["start_date"] = datetime.strptime(data["start_date"], "%Y-%m-%d")

    # print(data)
    filtered_data = {}
    for key, value in data.items():
        if (value != '' or value != ""):
            filtered_data[key] = value
    print(filtered_data)

    if not filtered_data:
        return {"error": "Empty Filter inputs", "success": False}

    print("inside else")
    result = []
    partial_name = data.get("membername", "")
    regex_pattern = re.compile(f"{re.escape(partial_name)}.*", re.IGNORECASE)

    for memberdict in memberlist:
        if "name" in memberdict and re.match(regex_pattern, memberdict["name"]):
            result.append(memberdict)

    print(result)
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
            filtered_data[key] = (value)
    print(filtered_data)

    content = []
    if (len(filtered_data) != 0):

        regex_patterns = {}
        for key, value in filtered_data.items():
            if value:
                regex_patterns[key] = re.compile(
                    f'^{re.escape(value)}.*', re.IGNORECASE)
        # print(regex_patterns)

        membersList = data["memberlist"]

        # print(membersList)
        if membersList:

            for memberdict in membersList:
                match = all(regex.match(str(memberdict.get(key, '')))
                            for key, regex in regex_patterns.items())
                if match:
                    content.append(memberdict)
            # print(content)
            if content:
                # for i in content:
                #     if i["expiry_date"]:
                #         i["expiry_date"] = i["expiry_date"].strftime("%Y-%m-%d")
                #     if i["start_date"]:
                #         i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
                return content
            else:
                return {"error": "No Members", "success": False}

        else:
            return {"error": "No members in org", "success": False}
    else:

        return {"error": "Please enter data in filter input", "success": False, "data_dict": "empty"}


# fetching all appiled organisations
@event.get("/allappliedorg")
async def adminside_allappliedorg():
    appliedlist = serializeList(conn.EventWiz.admin.find())
    # print(appliedlist)

    for singledict in appliedlist:
        content = singledict["applied_org"]

    for appliedorg in content:
        for i in appliedorg["members"]:
            i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
            i["expiry_date"] = i["expiry_date"].strftime("%Y-%m-%d")

    # print(content)

    if (len(content) != 0):
        return serializeList(content)
    else:
        return {"error": "No Applied Organisation", "success": False, "message": "empty"}

# searching by organisation name


@event.post("/searchorgbyname")
async def adminside_searchorgbyname(data: dict):
    # clubname = data["clubname"]
    # print(clubname)
    search_org = data["clubname"]
    regex_pattern = f"^{re.escape(search_org)}.*"
    pipeline = [
        {"$unwind": "$applied_org"},
        {"$match": {"applied_org.clubname": Regex(regex_pattern, "i")}},
    ]
    adminlist = conn.EventWiz.admin.aggregate(pipeline)

    content = []

    if adminlist:
        # print(adminlist)
        for admin in adminlist:
            org_dict = admin.get("applied_org", {})
            content.append(org_dict)
        # print(content)
        if content:
            return content
        else:
            return {"error": "Organisation Not Found", "success": False}
    else:
        return {"error": "No Admin Data", "success": False}

# admin side applied org table filters


@event.post("/appliedorgtablefilters")
async def adminside_applied_orgtablefilters(data: dict):
    print(data)
    allfiltersdata = data["data"]

    filtered_data = {}
    for key, value in allfiltersdata.items():
        if (value != '' or value != ""):
            filtered_data[key] = re.escape(value)
    # print(filtered_data)
    content = []

    if (len(filtered_data) != 0):

        regex_patterns = {}
        for key, value in allfiltersdata.items():
            if value:
                regex_patterns[key] = re.compile(
                    f'^{re.escape(value)}.*', re.IGNORECASE)
        print(regex_patterns)

        membersList = serializeList(conn.EventWiz.users.find({}))

        appliedlist = serializeList(conn.EventWiz.admin.find({}))
        for singleapplieddict in appliedlist:
            membersList = singleapplieddict["applied_org"]

        if membersList:

            for memberdict in membersList:
                match = all(regex.match(str(memberdict.get(key, '')))
                            for key, regex in regex_patterns.items())
                if match:
                    content.append(memberdict)
            print(content)
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
    # print(data["data"])
    acceptedOrg = data["data"]
    memberlist = acceptedOrg["members"]

    for i in memberlist:
        i["start_date"] = datetime.strptime(i["start_date"], "%Y-%m-%d")
        i["expiry_date"] = datetime.strptime(i["expiry_date"], "%Y-%m-%d")

    acceptedOrg["members"] = memberlist

    conn.EventWiz.organisation.insert_one(acceptedOrg)

    adminlist = serializeList(conn.EventWiz.admin.find())

    for singleadmin in adminlist:
        appliedorglist = singleadmin["applied_org"]

        updated_org = [i for i in appliedorglist if i["clubname"]
                       != acceptedOrg["clubname"]]
        # #print("Updated Member list",updated_members)
        content = conn.EventWiz.admin.find_one_and_update(
            {"_id": ObjectId(singleadmin["_id"])}, {"$set": {"applied_org": updated_org}})
    if content:
        data = {"clubname": acceptedOrg["clubname"],
                "email": acceptedOrg["email"]}
        acceptingorg(data)
        return True
    else:
        return {"error": "Nothing To Update", "success": False}

# rejecting org


@event.post("/rejectingorg")
async def adminside_rejectorg(data: dict):
    # print(data["data"])
    rejectedorg = data["data"]
    result = conn.EventWiz.rejectedorg.insert_one(rejectedorg)

    adminlist = serializeList(conn.EventWiz.admin.find())

    for singleadmin in adminlist:
        appliedorglist = singleadmin["applied_org"]

        updated_org = [i for i in appliedorglist if i["clubname"]
                       != rejectedorg["clubname"]]
        # #print("Updated Member list",updated_members)
        content = conn.EventWiz.admin.find_one_and_update(
            {"_id": ObjectId(singleadmin["_id"])}, {"$set": {"applied_org": updated_org}})
    if content:
        data = {"clubname": rejectedorg["clubname"],
                "email": rejectedorg["email"]}
        rejectingorg(data)
        return True
    else:
        return {"error": "Nothing To Update", "success": False}

# Get all Post For Users


@event.post("/fetchingallpostforadmin")
async def fetch_all_post_adminside():
    past_events()
    result = conn.EventWiz.post.find()
    allpost = serializeList(result)
    # print(allpost)
    posts = []
    today = datetime.now()
    if allpost:
        for singlepost in allpost:
            eventstart = singlepost["event_start_date"]
            eventend = singlepost["event_end_date"]

            if isinstance(eventstart, str):
                eventstart = datetime.strptime(eventstart, "%Y-%m-%d %H:%M:%S")
            if isinstance(eventend, str):
                eventend = datetime.strptime(eventend, "%Y-%m-%d %H:%M:%S")

            if eventstart <= today <= eventend:
                posts.append(singlepost)
        # print(result)
        if posts:
            return posts
        else:
            return {"error":"No Current Event Posts" , "success":False}
    else:
        return {"error":"No Event Posts" , "success":False}
    # if (result != []):
        
    #     for i in allpost:
    #         i["event_start_date"] = i["event_start_date"].strftime("%d-%m-%Y")
    #         i["event_end_date"] = i["event_end_date"].strftime("%d-%m-%Y")
    #         posts.append(i)
    #     # print(posts)
    #     return (posts)
    # else:
    #     return {"error": "No post found", "success": False}


# fetcing all past events
@event.post("/allpasteventposts")
async def past_events():
    data = serializeList(conn.EventWiz.pastevent.find())
    # print(data)
    for i in data:
        # print(i["event_start_date"])
        i["event_start_date"] = i["event_start_date"].strftime("%Y-%m-%d")

        i["event_end_date"] = i["event_end_date"].strftime("%Y-%m-%d")

    if data:
        return data
    else:
        return {"error":"No Past Events" , "success":False}


#  fetching all future events
@event.post("/allfutureeventposts")
async def future_events():
    today = datetime.now()
    clubpost = serializeList(conn.EventWiz.post.find())

    # print(today)
    result = []
    
    if clubpost:
        for singlepost in clubpost:
            # Assuming you have a 'event_start_date' and 'event_end_date' field in your database
            eventstart = singlepost["event_start_date"]
            eventend = singlepost["event_end_date"]

            # Ensure 'eventstart' and 'eventend' are datetime objects
            if isinstance(eventstart, str):
                eventstart = datetime.strptime(eventstart, "%Y-%m-%d %H:%M:%S")
            if isinstance(eventend, str):
                eventend = datetime.strptime(eventend, "%Y-%m-%d %H:%M:%S")

            if today <= eventstart:
                result.append(singlepost)
        # print(result)
        if result:
            return result
        else:
            return {"error": "No Future Event Posts", "success": False}
    else:
        return {"error": "No Event Posts", "success": False}

# Post Search by User using Title


@event.post("/postsearchbyadmin")
async def post_search_admin(data: dict):
    past_events()
    result = conn.EventWiz.post.find()
    posts = []
    # print(data)
    regex_pattern = re.compile(f"^{re.escape(data['title'])}.*", re.IGNORECASE)
    # print(re.match(regex_pattern,title))

    if (result != []):
        allpost = serializeList(result)
        for i in allpost:
            if re.match(regex_pattern, i["event_title"]):
                i["event_start_date"] = i["event_start_date"].strftime(
                    "%d-%m-%Y")
                i["event_end_date"] = i["event_end_date"].strftime(
                    "%d-%m-%Y")
                posts.append(i)
        return posts
    

# filtering post for admin and user
    

@event.post("/postfilter")
async def post_filter_admin(data: dict):
    eventsdata = data["eventposts"]
    data = data["filteredFormData"]
    print(data)
    result = []

    for post in eventsdata:
        for field, value in data.items():
            if field in ["event_start_date", "event_end_date"] and value != "":
                value = datetime.strptime(value, "%Y-%m-%d")
                post[field] = datetime.strptime(post[field], "%Y-%m-%d")
            if field == "event_start_date" and post["event_start_date"]< value:
                break
            elif field == "event_end_date" and post["event_end_date"] > value:
                break
            elif field == "venue_city":
                regex_pattern = re.compile(f"^{re.escape(value)}", re.IGNORECASE)
                if re.match(post["venue_city"],regex_pattern)== None:
                    break
            
            elif field == "minprice" and post["ticket_price"]<float(value):
                break
            elif field == "maxprice" and post["ticket_price"]>float(value):
                break
            elif field in ["clubname","type"] and post[field] != value:
                break
        else:
            result.append(post) 
    if result:
        return result
    else:
        return {"error": "No Such Post Available", "success": False}


# organisation delete post


@event.delete("/deletepost/{id}")
async def adminside_delete_post(id):
    # past_events()
    # print(id)
    post1 = serializeDict(conn.EventWiz.post.find_one({"_id": ObjectId(id)}))
   
    conn.EventWiz.deletedposts.insert_one(post1)

    response = serializeDict(
        conn.EventWiz.post.find_one_and_delete({"_id": ObjectId(id)}))
    
    if response:

        org1 = serializeDict(conn.EventWiz.organisation.find_one({"clubname": post1["clubname"]}))
        # print(post1["event_title"])
        data = {"clubname":post1["clubname"],"email":org1["email"],"postname":post1["event_title"]}
        admindeletingorgpost(data)
        return True
    else:
        return {"error": "no post found", "success": False}
    
@event.delete("/deletepastpost/{id}")
async def adminside_delete_pastpost(id):
    # past_events()
    print(id)
    post1 = conn.EventWiz.pastevent.find_one({"_id": id})
    # print(post1)
    if post1:
        post1= serializeDict(post1)
        del post1["_id"]
        conn.EventWiz.deletedpastposts.insert_one(post1)

    response = serializeDict(
        conn.EventWiz.pastevent.find_one_and_delete({"_id": id}))
    
    if response:
        # for email
        # org1 = serializeDict(conn.EventWiz.organisation.find_one({"clubname": post1["clubname"]}))
        # # print(post1["event_title"])
        # data = {"clubname":post1["clubname"],"email":org1["email"],"postname":post1["event_title"]}
        # admindeletingorgpost(data)

        return True
    else:
        return {"error": "no post found", "success": False}
    

# fetching admin details
@event.get("/admin/getadmin")
async def get_admin():
    result = conn.EventWiz.admin.find_one()
    return serializeDict(result)        


# deleting user's platform feedback


@event.delete("/admin/deleteuserfeedback")
async def adminside_delete_userfeedback(data: dict):
    print(data["userfeedback"])
    response = conn.EventWiz.admin.find_one_and_update({},{"$set":{"userfeedback":data["userfeedback"]} })
    if response:
        admindata = serializeList(conn.EventWiz.admin.find({}))
        return admindata[0]
    else:
        return {"error": "No feedback found", "success": False}
    

# deleting org's platform feedback
    

@event.delete("/admin/deleteorgfeedback")
async def adminside_delete_orgfeedback(data: dict):
    print(data["orgfeedback"])
    response = conn.EventWiz.admin.find_one_and_update({},{"$set":{"orgfeedback":data["orgfeedback"]} })
    if response:
        admindata = serializeList(conn.EventWiz.admin.find({}))
        return admindata[0]
    else:
        return {"error": "No feedback found", "success": False}


# deleting user's org feedback
    

@event.put("/admin/deleteuserorgfeedback")
async def adminside_delete_orgfeedback(data: dict):
    print(data["orguserfeedback"])
    orguserfeedback = data["orguserfeedback"]
    clubname = data["clubname"]
    response = conn.EventWiz.organisation.find_one_and_update({"clubname": clubname},{"$set":{"feedback":orguserfeedback}})
    if response:
        return True
    else:
        return {"error": "No feedback found", "success": False}

    
# fetching org details of admin
@event.post("/admin/fetchingsingleorg")
async def fetch_org_details(data: dict):
    # print(data["clubname"])
    result = conn.EventWiz.organisation.find_one({"clubname": data["clubname"]})
    if result:
        return serializeDict(result)
    else:
        return {"error": "No such Organisation found", "success": False}


# fetching single org data for admin
    

@event.post("/admin/fetchingsingleorgpostfeedback")
async def fetch_single_org(data: dict):
    # print("hey data")
    print(data["eventid"])
    result = conn.EventWiz.pastevent.find_one({"_id": data["eventid"]})
    if result:
        print(result)
        result = serializeDict(result)
        event_feedback = result["feedback"]
        return event_feedback
    else:
        return {"error": "No such Post found", "success": False}
    
# deleting post feedback by admin
@event.put("/admin/deleteorgeventfeedback")
async def adminside_delete_postfeedback(data: dict):
    print(data["postfeedback"])
    postfeedback = data["postfeedback"]
    postid = data["postid"]
    print(postid)
    response = conn.EventWiz.pastevent.find_one_and_update({"_id": postid},{"$set":{"feedback":postfeedback}})
    if response:
        return True
    else:
        return {"error": "No feedback found", "success": False}


import math 
# fetchin the cards data for org dashboard

@event.post("/admindashboardcards")
async def org_dashboard_cards():
    # clubname = data["clubname"]
    org = conn.EventWiz.organisation.find()
    users = conn.EventWiz.users.find()
    currentevents = conn.EventWiz.post.find()
    pastevents = conn.EventWiz.pastevent.find()
    result= [] 
    if currentevents:
        currentevents = serializeList(currentevents)
        currenteventscounts = len(currentevents) 
    else:
        currenteventscounts = 0
    if pastevents:
        pastevents = serializeList(pastevents)
        pasteventscounts = len(pastevents)
    else:
        pasteventscounts = 0

    totalposts = currenteventscounts + pasteventscounts
    result.append({"totalposts":totalposts})

    totalevents = []
    for i in currentevents:
        totalevents.append(i)
    for i in pastevents:
        totalevents.append(i)
    
    if users:
        users = serializeList(users)
        totalusers = len(users)
        result.append({"totalusers":totalusers})
    else:
        result.append({"totalusers":0})
    
    if org:
        org = serializeList(org)
        totalorg = len(org)
        result.append({"totalorg":totalorg})
    else:
        result.append({"totalorg":0})

    totalparticipants = []
    for i in totalevents:
        for j in i["participate"]:
            totalparticipants.append(j)
    totalparticipants = len(totalparticipants)
    avgparticipants = math.ceil(totalparticipants / totalposts)
    result.append({"avgparticipants":avgparticipants})


    totalprofit = 0

    for i in org:
        for j in i["members"]:
            if j["subscribe"] == True:
                
                for memtypes in i["memtype"]:
                    if j["membertype"] == memtypes["type"]:
                        totalprofit = totalprofit + memtypes["price"]
    print(totalprofit)
    
    
        
    totalprofit = totalprofit * 0.12
    totalprofit = math.ceil(totalprofit)
    print(totalprofit)
    result.append({"totalprofit":totalprofit})

    if result:
        print(result)
        return result
    else:
        return {"error": "No Data Found", "success": False}

       
# fetching the cards data of popular events for admin
    

@event.post("/admindashboardpopulareventcards")
async def admin_dashboard_popularevents():
    allevents = conn.EventWiz.post.find()
    events = []
    if allevents:
        allevents = serializeList(allevents)
        for i in allevents:
            events.append(i)
    allpastevents = conn.EventWiz.pastevent.find()
    if allpastevents:
        allpastevents = serializeList(allpastevents)

        for i in allpastevents:
            events.append(i)

    events = sorted(events, key = lambda i: len(i["participate"]),reverse=True)
        # print(allevents)
    popularevents = []
    for count in range(3):
        events[count]["event_start_date"] = events[count]["event_start_date"].strftime("%d-%m-%Y")
        events[count]["event_end_date"] = events[count]["event_end_date"].strftime("%d-%m-%Y")     
        # print(count)
        # print(events[count]["event_title"])
        popularevents.append(events[count])

    if popularevents:
        return popularevents
    else:
        return {"error": "No Data Found", "success": False}

    
# Total Profit by Subscribe Users Yearly
@event.get("/subscribeprofitadmin")
async def total_profit_yearly_Admin():
    profit = {}
    tprofit = []
    result = []
    org = serializeList(conn.EventWiz.organisation.find())
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
    post1 = conn.EventWiz.post.find()
    post2  = conn.EventWiz.pastevent.find()
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
    org  = conn.EventWiz.organisation.find_one({"clubname":data["clubname"]})
    if org:
        orgevent1  = conn.EventWiz.post.find({"clubname":data["clubname"]})
        orgevent2  = conn.EventWiz.pastevent.find({"clubname":data["clubname"]})
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
    




# /////////////////////////////////////////////////////////////////////////////

# //////////////////////////////////////USER////////////////////////////////////

# user login


@event.post('/userlogin/')
async def check_user(data: dict):
    if data["clubname"] == "None" or data["clubname"] == "":
        data["clubname"] = None
    flag = 0
    d1 = {}
    u1 = conn.EventWiz.users.find_one({"$and": [{"username": data["username"]}, {
                                      "pwd": data["pwd"]}, {"clubname": data["clubname"]}]})
    u3 = conn.EventWiz.organisation.find_one({"clubname": data["clubname"]})
    if u1:
        return serializeDict(u1)
    elif u3:
        user3 = serializeDict(u3)
        # print(user3)
        membersList = user3["members"]
        for singleDict in membersList:
            if (singleDict["username"] == data["username"]) and (singleDict["pwd"] == data["pwd"]):
                flag = 1
                d1 = singleDict
                d1["clubname"] = data["clubname"]
                singleDict["loggedin"] = True

                print(membersList)
                conn.EventWiz.organisation.find_one_and_update(
                    {"clubname": d1["clubname"]}, {"$set": {"members": membersList}})

                del d1["loggedin"]
                conn.EventWiz.users.insert_one(d1)

                return serializeDict(d1)
        if flag == 0:
            return {"error": "Invalid Username , Password and Clubname", "success": False}
    else:
        return {"error": "Invalid Clubname", "success": False}


# user registration
@event.post('/userregistration/')
async def create_user(user: User):
    d1 = dict(user)
    # print(d1)
    email_pattern = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, d1["email"]) == None:
        return {"error": "Invalid Email Format", "success": False}
    number_pattern = r'^\d{10}$'
    if re.match(number_pattern, str(d1["pnumber"])) == None:
        return {"error": "Phone Number in 10 Digits", "success": False}
    allorg = conn.EventWiz.organisation.find()
    allorg = serializeList(allorg)

    for singleorg in allorg:
        memberlist = singleorg["members"]
        for i in memberlist:
            if d1["username"] == i["username"]:
                return {"error": "Username already exists", "success": False}

    allactiveusers = conn.EventWiz.users.find()
    allactiveusers = serializeList(allactiveusers)
    for j in allactiveusers:
        if d1["username"] == j["username"]:
            return {"error": "Username already exists", "success": False}

    conn.EventWiz.users.insert_one(dict(user))
    return dict(user)


# Get all Post For Users
@event.post("/fetchingallpostforuser/{uname}")
async def fetch_all_post_userside(uname: str):
    past_events()
    result = conn.EventWiz.post.find()
    posts = []
    today = datetime.now()
    allpost = serializeList(result)
    # print(allpost)
    if (result != []):

        for i in allpost:
            print(i["event_end_date"])
            eventstart = i["event_start_date"]
            eventend = i["event_end_date"]

            if isinstance(eventstart, str):
                eventstart = datetime.strptime(eventstart, "%Y-%m-%d %H:%M:%S")
            if isinstance(eventend, str):
                eventend = datetime.strptime(eventend, "%Y-%m-%d %H:%M:%S")
            
            if eventstart <= today <= eventend:
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
                    
        return posts
    else:
        return {"error": "No post found", "success": False}

    
# fetching all future events post for user


@event.post("/alluserfutureeventposts/") 
async def future_event_posts(orgdata: dict):
    today = datetime.now()
    uname = orgdata["uname"]
    clubpost = serializeList(conn.EventWiz.post.find())
    print(uname)
    # print(today)
    result = []
    
    if clubpost:
        for singlepost in clubpost:
            # Assuming you have a 'event_start_date' and 'event_end_date' field in your database
            eventstart = singlepost["event_start_date"]
            eventend = singlepost["event_end_date"]

            # Ensure 'eventstart' and 'eventend' are datetime objects
            if isinstance(eventstart, str):
                eventstart = datetime.strptime(eventstart, "%Y-%m-%d %H:%M:%S")
            if isinstance(eventend, str):
                eventend = datetime.strptime(eventend, "%Y-%m-%d %H:%M:%S")
            
            if today <= eventstart:
                if len(singlepost["participate"]) != 0:
                    for j in singlepost["participate"]:
                        if j["username"] == uname:
                            for j in singlepost["participate"]:
                                    break
                    else:
                        singlepost["event_start_date"] = singlepost["event_start_date"].strftime("%d-%m-%Y")
                        singlepost["event_end_date"] = singlepost["event_end_date"].strftime("%d-%m-%Y")
                        result.append(singlepost)
                else:
                    singlepost["event_start_date"] = singlepost["event_start_date"].strftime(
                        "%d-%m-%Y")
                    singlepost["event_end_date"] = singlepost["event_end_date"].strftime("%d-%m-%Y")
                    result.append(singlepost)
                
        # print(result)
        if result:
            return result
        else:
            return {"error": "No Future Event Posts", "success": False}
    else:
        return {"error": "No Event Posts", "success": False}


# fetching all past events post for user

 
@event.get("/alluserpasteventposts")
async def pastevent_posts():
    data = serializeList(conn.EventWiz.pastevent.find())
    # print(data)
    for i in data:
        # print(i["event_start_date"])
        i["event_start_date"] = i["event_start_date"].strftime("%Y-%m-%d")

        i["event_end_date"] = i["event_end_date"].strftime("%Y-%m-%d")

    if data:
        return data
    else:
        return {"error":"No Past Events" , "success":False}

    


# User Participate in Event


@event.put("/eventparticipate/{id}")
async def event_participate(id: str, data: dict):
    past_events()

    email_pattern = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, data["email"]) == None:
        return {"error": "Invalid Email Format", "success": False}
    number_pattern = r'^\d{10}$'
    if re.match(number_pattern, str(data["pnumber"])) == None:
        return {"error": "Phone Number in 10 Digits", "success": False}
    
    data["age"] = int(data["age"])
    post = conn.EventWiz.post.find_one({"_id": ObjectId(id)})
    if post:
        p1 = serializeDict(post)["participate"]
        # print(p1)
        p1.append(data)
        conn.EventWiz.post.find_one_and_update(
            {"_id": ObjectId(id)}, {"$set": {"participate": p1}})
        return {"data": "Partcipated Successfully"}
    else:
        return {"error": "Event Not Found", "success": False}




# Post Search by User using Title


@event.post("/postsearchbyuser")
async def post_search_user(data: dict):
    past_events()

    result = conn.EventWiz.post.find()
    posts = []
    # print(data)
    regex_pattern = re.compile(f"^{re.escape(data['title'])}.*", re.IGNORECASE)
    # print(re.match(regex_pattern,title))

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
    org = conn.EventWiz.organisation.find()
    if org:
        org1 = serializeList(org)
        return org1
    else:
        return {"error": "Organization Not Found", "success": False}


# User Subscribe
@event.put('/usersubscribe')
async def user_subscribe(user: dict):

    appliedmem = user

    email_pattern = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, appliedmem["email"]) == None:
        return {"error": "Invalid Email Format", "success": False}
    number_pattern = r'^\d{10}$'
    if re.match(number_pattern, str(appliedmem["pnumber"])) == None:
        return {"error": "Phone Number in 10 Digits", "success": False}
    
    # print(appliedorg)
    flag = 0
    orgdict = serializeDict(conn.EventWiz.organisation.find_one(
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
                        conn.EventWiz.organisation.update_one({"clubname": appliedmem["clubname"]}, {
                                                              "$set":  {"memapplied": orgapplied}})
                        return {"data": "Applied For Subscription Successfully.", "success": True}
                else:
                    orgapplied.append(appliedmem)
                    conn.EventWiz.organisation.update_one({"clubname": appliedmem["clubname"]}, {"$set":  {"memapplied": orgapplied}})
                    return {"data": "Applied For Subscription Successfully.", "success": True}
        else:
            orgapplied.append(appliedmem)
            conn.EventWiz.organisation.update_one({"clubname": appliedmem["clubname"]}, {
                                                  "$set":  {"memapplied": orgapplied}})
            return {"data": "Applied For Subscription Successfully.", "success": True}
    else:
        return {"error": "Organization Not Found", "success": False}

# Get User Participated Events


@event.post("/userparticipated/{uname}")
async def user_participated(uname: str):
    past_events()

    post = conn.EventWiz.post.find()
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


#  fetching user past participated events
@event.post("/userpastparticipated/{uname}")
async def user_pastparticipated(uname: str):
    past_events()
    post = conn.EventWiz.pastevent.find()
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
    org = serializeDict(conn.EventWiz.organisation.find_one(
        {"clubname": data["clubname"]}))
    if len(org) != 0:
        memtype = org["memtype"]
        # print(memtype)
        for singlemember in org["members"]:
            if singlemember["username"] == data["username"]:
                memtype = [item for item in memtype if item["type"]
                           != singlemember["membertype"]]
        return memtype


@event.post("/adminmembersorting")
async def member_sorting(data: dict):
    # org = conn.event.organization.find_one({"clubname" : data["clubname"]})
    print(data["col"])
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
                sorted_list = sorted(
                    org, key=lambda x: x[data["col"]], reverse=True)
                # for i in sorted_list:
                #     i["expiry_date"] = i["expiry_date"].strftime("%Y-%m-%d")
                #     i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
                return sorted_list

    else:
        return {"error": "Organization not Found", "success": False}
    

# event feedback
@event.post("/eventfeedback")
async def event_feedback(data: dict):
    print(data["lFormData"])
    feedbackform = data["lFormData"]
    postData = data["postData"]
    print(postData["_id"])
    post = conn.EventWiz.pastevent.find_one({"_id": postData["_id"]})
    feedback = []

    if post:
        
        post = serializeDict(post)
        if len(post["feedback"]) !=0:
            
            feedback = post["feedback"]
            feedback.append(feedbackform)
            
            result = conn.EventWiz.pastevent.find_one_and_update({"_id": postData["_id"]}, {"$set": {"feedback": feedback}})
            
            if result:
                return True
            else:
                return {"error": "Feedback Not Submitted", "success": False}
        else:   
            feedback.append(feedbackform)
            result = conn.EventWiz.pastevent.find_one_and_update({"_id": postData["_id"]}, {"$set": {"feedback": feedback}})
            print("7")
            if result:

                return True
            else:
                return {"error": "Feedback Not Submitted", "success": False}
    else:   
        return {"error": "Post Not Found", "success": False}

# user platform feedback
@event.post("/userplatformfeedback")
async def event_feedback(data: dict):
    print(data["lFormData"])
    feedbackform = data["lFormData"]
    admindata = conn.EventWiz.admin.find()
    feedback = []

    if admindata:
        
        admindata = serializeList(admindata)[0]
        if len(admindata["userfeedback"]) !=0:
            
            feedback = admindata["userfeedback"]
            feedback.append(feedbackform)
            
            result = conn.EventWiz.admin.find_one_and_update({}, {"$set": {"userfeedback": feedback}})
            
            if result:
                return True
            else:
                return {"error": "Feedback Not Submitted", "success": False}
        else: 

            feedback.append(feedbackform)
            result = conn.EventWiz.admin.find_one_and_update({}, {"$set": {"userfeedback": feedback}})

            if result:

                return True
            else:
                return {"error": "Feedback Not Submitted", "success": False}
    else:   
        return {"error": "Post Not Found", "success": False}
    


  

# //////////////////////////////////////////////////////////////////////////////

# ////////////////////////////////////////ORGANISATION///////////////////////////////////


# fetching all clubname


@event.get("/clubnames/")
async def get_clubnames():
    clubname = []
    cursor = conn.EventWiz.organisation.find({}, {"clubname": 1, "_id": 0})
    for i in serializeList(cursor):
        clubname.append(i["clubname"])
    return clubname

# Get all type of Membership


@event.get("/allmembershiptype")
async def all_membershiptype():

    allorg = conn.EventWiz.organisation.find({})
    allorg = serializeList(allorg)
    membertypes = []
    for singleorg in allorg:
        for i in singleorg["memtype"]:
            membertypes.append(i["type"])

    allmembtype = list(set(membertypes))
    # print(allmembtype)
    return allmembtype


# organisation login
@event.post('/organisationlogin')
async def check_org(data: dict):
    # print(data["username"])

    d1 = conn.EventWiz.organisation.find_one({"$and":[{"username": data["username"]},{"pwd": data["pwd"]}]})
    # #print(d1["username"],d1["pwd"])
    if d1:
        # #print(d1)
        return serializeDict(d1)
    else:
        return {"error": "No matching user found", "success": False}


# organisation registration
@event.post('/organisationregistration')
async def create_org(organisation: Organisation):

    appliedorg = dict(organisation)
    # print(appliedorg)

    email_pattern = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, appliedorg["email"]) == None:
        return {"error": "Invalid Email Format", "success": False}
    number_pattern = r'^\d{10}$'
    if re.match(number_pattern, str(appliedorg["pnumber"])) == None:
        return {"error": "Phone Number in 10 Digits", "success": False}
    
    usernamelist = []
    allorg = serializeList(conn.EventWiz.organisation.find())
    for singleorg in allorg:
        memberlist = singleorg["members"]
        for i in memberlist:
            usernamelist.append(i["username"])
    usernamelist = list(set(usernamelist))

    memberlist = appliedorg["members"]
    print(memberlist)

    for singlemember in memberlist:
        if singlemember["username"] in usernamelist:
            return {"error": "Your members username already exits pls update and resubmit", "success": False}

    for singlemember in memberlist:
        singlemember["loggedin"] = False
        singlemember["subscribe"] = False

    for i in appliedorg["members"]:
        i["start_date"] = datetime.strptime(i["start_date"], "%Y-%m-%d")
        i["expiry_date"] = datetime.strptime(i["expiry_date"], "%Y-%m-%d")

    # print(appliedorg["members"])

    allorg = conn.EventWiz.organisation.find()
    allorg = serializeList(allorg)
    orgusernameList = []
    for i in allorg:
        orgusernameList.append(i["username"])

    if appliedorg["username"] in orgusernameList:
        return {"error": "Username Already Exists", "success": False}
    else:
        adminlist = serializeList(conn.EventWiz.admin.find())
        # print(adminlist)
        if adminlist:
            for singleadmindict in adminlist:
                appliedlist = singleadmindict["applied_org"]
                for singleorg in appliedlist:
                    if singleorg["clubname"] == appliedorg["clubname"]:
                        return {"error": "You Have Already   Applied", "success": False}

                singleadmindict["applied_org"].append(appliedorg)
                conn.EventWiz.admin.update_one({"_id": ObjectId(singleadmindict["_id"])}, {
                                               "$set":      {"applied_org": singleadmindict["applied_org"]}})
            return {"message": "Applied Successfully"}
        else:
            return {"error": "No Admin Available",   "success": False}


# organisation create post
@event.post("/createeventpost")
async def create_event_post(data: EventPost):
    # print(dict(data))
    try:
        # Directly assign datetime.date objects
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

        if data_dict["type"] == "":
            return {"error": "Select Membership Type", "success": False}
        data_dict["event_start_date"] = data_dict["event_start_date"].strftime(
            "%Y-%m-%d")
        data_dict["event_end_date"] = data_dict["event_end_date"].strftime(
            "%Y-%m-%d")
        data_dict["event_start_date"] = datetime.strptime(
            data_dict["event_start_date"], "%Y-%m-%d")
        data_dict["event_end_date"] = datetime.strptime(
            data_dict["event_end_date"], "%Y-%m-%d")

    except ValueError:
        raise HTTPException(
            status_code=422, detail="Invalid date format. Use 'yyyy-mm-dd'.")

    # Insert data into the database
    conn.EventWiz.post.insert_one(data_dict)

    return {"message": "Event data successfully submitted"}

# organisation fetch all post details


@event.post("/geteventposts")
async def get_event_posts(data: dict):
    past_events()

    response = conn.EventWiz.post.find({"clubname": data["clubname"]})
    # #print(serializeList(response))
    if response:
        lis = []
        d1 = {}
        for singleDict in response:
            d1 = singleDict
            d1["event_start_date"] = d1["event_start_date"].strftime(
                "%d-%m-%Y")
            d1["event_end_date"] = d1["event_end_date"].strftime("%d-%m-%Y")
            # conn.EventWiz.users.insert_one(d1)
            lis.append(serializeDict(d1))
        return serializeList(lis)
        # return serializeList(response)
    else:
        return {"error": "no post found", "success": False}

# other organisation's fetch all post details


@event.post("/getotherorgeventposts")
async def get_other_org_eventposts(data: dict):
    past_events()

    response = conn.EventWiz.post.find({"clubname": {"$ne": data["clubname"]}})
    # #print(serializeList(response))
    if response:
        lis = []
        d1 = {}
        for singleDict in response:
            d1 = singleDict
            d1["event_start_date"] = d1["event_start_date"].strftime(
                "%d-%m-%Y")
            d1["event_end_date"] = d1["event_end_date"].strftime("%d-%m-%Y")
            # conn.EventWiz.users.insert_one(d1)
            lis.append(serializeDict(d1))
        return serializeList(lis)
        # return serializeList(response)
    else:
        return {"error": "no post found", "success": False}

# organisation delete post


@event.delete("/deleteeventposts/{id}")
async def delete_user(id):
    past_events()

    # fetch the details using id
    # if details found execute the delete query
    # always test in swagger first
    # then bind with UI
    response = serializeDict(
        conn.EventWiz.post.find_one_and_delete({"_id": ObjectId(id)}))
    if response:
        return True
    else:
        return {"error": "no post found", "success": False}

# organisation filter functionality to fetch post


@event.post("/orgfilters")
async def org_filters(data: dict):
    # Build the query based on the filteredFormData
    cname = data["clubname"]
    filtereddata = data["filteredFormData"]
    query = {}

    and_conditions = [{"clubname": cname}]

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

    if and_conditions:
        query["$and"] = and_conditions

    if data["pastevent"]:
        result = conn.EventWiz.pastevent.find(query)
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
            return {"error": "No such Post Available", "success": False}


    result = conn.EventWiz.post.find(query)

    # Iterate over the result and print each post
    response_list = serializeList(result)
    today = datetime.now()
    postresult = []
    if response_list:
        if data["currentevent"]:
            for singleDict in response_list:
                eventstart = singleDict["event_start_date"]
                eventend = singleDict["event_end_date"]

                if isinstance(eventstart, str):
                    eventstart = datetime.strptime(eventstart, "%Y-%m-%d %H:%M:%S")
                if isinstance(eventend, str):
                    eventend = datetime.strptime(eventend, "%Y-%m-%d %H:%M:%S")

                if eventstart <= today <= eventend:
                    postresult.append(singleDict)
            print(postresult)
            # is it past,future or current?
            if (len(postresult) !=0):
                response_list = postresult
                # is it past,future or current
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
                return {"error": "No such Post Available", "success": False}
        if data["futureevent"]:
            for singleDict in response_list:
                eventstart = singleDict["event_start_date"]
                eventend = singleDict["event_end_date"]

                if isinstance(eventstart, str):
                    eventstart = datetime.strptime(eventstart, "%Y-%m-%d %H:%M:%S")
                if isinstance(eventend, str):
                    eventend = datetime.strptime(eventend, "%Y-%m-%d %H:%M:%S")

                if today <= eventstart:
                    postresult.append(singleDict)
            print(postresult)
            # is it past,future or current?
            if (len(postresult) !=0):
                response_list = postresult
                # is it past,future or current
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
                return {"error": "No such Post Available", "success": False}
    else:
        return {"error": "No such Post Available", "success": False}

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
            # print(value)
            if field == "event_start_date":
                and_conditions.append({"event_start_date": {"$gte": value}})
                # print(query)
            if field == "event_end_date":
                and_conditions.append({"event_start_date": {"$lte": value}})
                # print(query)

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
    # Find posts based on the query
    result = conn.EventWiz.post.find(query)

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


# organisation fetch member details
@event.post("/organizationmemberdetails/")
async def organisation_member_details(data: dict):
    org = conn.EventWiz.organisation.find({"clubname": data["clubname"]})
    # #print(serializeList(org))
    if org:
        data_dict = serializeList(org)[0]["members"]
        for i in data_dict:
            i["expiry_date"] = i["expiry_date"].strftime("%Y-%m-%d")
            i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
        return data_dict
    else:
        return {"data": "Member doesn't Exist", "success": False}

# organisation member table search


@event.post("/orgmemberfilter")
async def filter_members(data: dict):
    if (data["expiry_date"] != ''):
        data["expiry_date"] = datetime.strptime(
            data["expiry_date"], "%Y-%m-%d")
    if (data["start_date"] != ''):
        data["start_date"] = datetime.strptime(data["start_date"], "%Y-%m-%d")

    print(data)
    filtered_data = {}
    for key, value in data.items():
        if (value != '' or value != ""):
            filtered_data[key] = value
    organisation = conn.EventWiz.organisation.find_one(
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

# organisation route for fetching  member's membership-type


@event.post("/getmemtype/")
async def get_memtype(data: dict):
    type = []
    cursor = conn.EventWiz.organisation.find(
        {"clubname": data["clubname"]}, {"memtype": 1, "_id": 0})
    # #print(serializeList(cursor))
    d1 = serializeList(cursor)
    # #print(d1[0]["memtype"])
    for i in d1[0]["memtype"]:
        type.append(i["type"])
    return type

# organisation route for adding a member


@event.put("/addorganizationmember/{id}")
async def add_organizaton_member(id: str, member: User):
    given_dict = dict(member)
    email_pattern = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'

    if re.match(email_pattern, given_dict["email"]) == None:
        return {"error": "Invalid Email Format", "success": False}
    number_pattern = r'^\d{10}$'
    if re.match(number_pattern, str(given_dict["pnumber"])) == None:
        return {"error": "Phone Number in 10 Digits", "success": False}
    
    start = given_dict["start_date"].strftime("%Y-%m-%d")
    expiry = given_dict["expiry_date"].strftime("%Y-%m-%d")
    start = datetime.strptime(start, "%Y-%m-%d")
    expiry = datetime.strptime(expiry, "%Y-%m-%d")
    if start > expiry or start == expiry:
        return {"error": "Start Date should be less than Expiry Date", "success": False}
    
    org = conn.EventWiz.organisation.find({"_id": ObjectId(id)})

    allorg = conn.EventWiz.organisation.find()
    allorg = serializeList(allorg)

    for singleorg in allorg:
        memberlist = singleorg["members"]
        for i in memberlist:
            if i["username"] == given_dict["username"]:
                return {"error": "Username already exists", "success": False}
    if org:
        data_dict1 = serializeList(org)[0]["members"]
        for i in data_dict1:

            if (i["memberid"] == given_dict["memberid"]):
                return {"error": "Member ID already Exists", "success": False}

    given_dict["expiry_date"] = given_dict["expiry_date"].strftime("%Y-%m-%d")
    given_dict["expiry_date"] = datetime.strptime(
        given_dict["expiry_date"], "%Y-%m-%d")
    given_dict["start_date"] = given_dict["start_date"].strftime("%Y-%m-%d")
    given_dict["start_date"] = datetime.strptime(
        given_dict["start_date"], "%Y-%m-%d")

    if given_dict["membertype"] == "":
        return {"error": "Select Membership Type", "success": False}
    d1 = conn.EventWiz.organisation.find_one({"_id": ObjectId(id)})
    if d1:
        # serializeDict(d1)["members"].append(data_dict)
        org1 = serializeDict(d1)

        del given_dict["clubname"]
        given_dict["loggedin"] = False
        given_dict["subscribe"] = False

        org1["members"].append(given_dict)

        conn.EventWiz.organisation.find_one_and_update(
            {"_id": ObjectId(id)}, {"$set": {"members": org1["members"]}})
        return {"error": "Member Added Successfully", "success": True}
    else:
        return {"error": "Invalid Input", "success": False}


# updating member details
@event.put("/organizationupdatememberdetails/")
async def update_member_details(data: dict):

    

    organisation = conn.EventWiz.organisation.find_one(
        {"clubname": data["clubname"]})
    if organisation:

        org1 = serializeDict(organisation)
    
        formdata = data["formData"]
        
        email_pattern = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if re.match(email_pattern, formdata["email"]) == None:
            return {"error": "Invalid Email Format", "success": False}
        number_pattern = r'^\d{10}$'
        if re.match(number_pattern, str(formdata["pnumber"])) == None:
            return {"error": "Phone Number in 10 Digits", "success": False}
    
        formdata["expiry_date"] = datetime.strptime(
            formdata["expiry_date"], "%Y-%m-%d")
        formdata["start_date"] = datetime.strptime(
            formdata["start_date"], "%Y-%m-%d")
        member_id = data["memberId"]
        # print(member_id)
        for memberdict in org1["members"]:
            # print(memberdict["memberid"])
            if memberdict["memberid"] == data["memberId"]:

                memberdict.update(data["formData"])
                # print(org1["members"])
                # conn.EventWiz.organisation.replace_one({"_id": org1["_id"]}, org1)
                conn.EventWiz.organisation.find_one_and_update(
                    {"_id": ObjectId(org1["_id"])}, {"$set": {"members": org1["members"]}})
                # #print(org1["members"])

                data = {"name": formdata["name"], "email": formdata["email"],
                        "clubname": org1["clubname"], "orgowner": org1["ownname"]}
                orgupdatingmemberdata(data)
                return True

    else:
        return {"error": "Organisation not found", "success": False}


# deleting a member
@event.put("/deletemember")
async def delete_member(data: dict):
    # print(data)
    org = conn.EventWiz.organisation.find_one({"_id": ObjectId(data['orgid'])})
    if org:
        org1 = serializeDict(org)
        clubname = org1["clubname"]
        org1 = serializeDict(org)["members"]

        for i in org1:
            if i["memberid"] == data["memberid"]:
                i["clubname"] = clubname
                conn.EventWiz.deletemembers.insert_one(i)

        userdata = conn.EventWiz.users.find_one({"memberid": data["memberid"]})
        userdata = serializeDict(userdata)
        userdata["memberid"] = None
        userdata["membertype"] = "Public"
        userdata["start_date"] = None
        userdata["expiry_date"] = None
        userdata["clubname"] = None
        print(userdata)
        conn.EventWiz.users.find_one_and_update({"_id": ObjectId(userdata["_id"])}, {
                                                "$set": {key: value for key, value in userdata.items() if key != '_id'}})

        updated_members = [
            i for i in org1 if i["memberid"] != data["memberid"]]
        # print("Updated Member list",updated_members)
        conn.EventWiz.organisation.find_one_and_update(
            {"_id": ObjectId(data["orgid"])}, {"$set": {"members": updated_members}})

        data = {"name": userdata["name"], "email": userdata["email"],
                "clubname": org1["clubname"], "orgowner": org1["ownname"]}

        orgdeletingmember(data)
        return {"data": "Member deleted Successfully", "success": True}
    else:
        return {"error": "Invalid Input", "success": False}

# fetching member details for updating


@event.post("/organisationunupdatedmemberdetails")
async def update_member_details(data: dict):
    organisation = conn.EventWiz.organisation.find_one(
        {"_id": ObjectId(data["cid"])})

    if not organisation:
        return {"error": "Organization Not Found", "success": False}

    memtype_cursor = conn.EventWiz.organisation.find(
        {"clubname": data["clubname"]}, {"memtype": 1, "_id": 0})
    memtype_cursor = serializeList(memtype_cursor)
    memtypes = []
    for i in memtype_cursor[0]["memtype"]:
        memtypes.append(i["type"])

    result = []
    for memberdict in organisation.get("members", []):
        if memberdict["memberid"] == data["memberid"]:
            result.append(memberdict)
            break

    if not result:
        return {"error": "Member Not Found", "success": False}

    return {"memtypes": memtypes, "memberDetails": result[0], "success": True}

# fetching organisation event posts by title


@event.post("/organisationeventpostsbytitle")
async def organisation_eventpost_bytitle(data: dict):
    past_events()

    clubname = data["clubname"]
    organisation = conn.EventWiz.organisation.find_one({"clubname": clubname})
    if organisation:

        posts = conn.EventWiz.post.find({"clubname": clubname})
        result = []
        if (posts != []):
            partial_name = data["title"]
            regex_pattern = re.compile(
                f".*{re.escape(partial_name)}.*", re.IGNORECASE)

            for postdict in serializeList(posts):
                # if postdict["event_title"] == data["title"]:
                if "event_title" in postdict and re.match(regex_pattern, postdict["event_title"]):
                    result.append(postdict)
                    break
            if (result != []):
                return result
            else:
                return {"error": "No post found", "success": False}
        else:
            return {"error": "No post found", "success": False}
    return {"error": "No organisation found", "success": False}

# fetching other organisation's event posts by title


@event.post("/otherorgeventpostsbytitle")
async def otherorg_eventpost_bytitle(data: dict):
    past_events()

    clubname = data["clubname"]
    organisation = conn.EventWiz.organisation.find_one({"clubname": clubname})
    if organisation:

        posts = conn.EventWiz.post.find({"clubname": {"$ne": clubname}})
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


# organisation's member table filters
@event.post("/organisationmembertablefilters")
async def membertable_filtering(filters: dict):
    data = filters["data"]
    orgid = filters["orgid"]

    filtered_data = {}
    for key, value in data.items():
        if (value != '' or value != ""):
            filtered_data[key] = re.escape(value)
    # print(filtered_data)
    content = []
    if (len(filtered_data) != 0):

        regex_patterns = {}
        for key, value in data.items():
            if value:
                regex_patterns[key] = re.compile(
                    f'^{re.escape(value)}', re.IGNORECASE)

        print(regex_patterns)
        organisation = conn.EventWiz.organisation.find_one(
            {"_id": ObjectId(orgid)})
        if organisation:
            org1 = serializeDict(organisation)
            membersList = org1["members"]
            if (membersList != []):
                for memberdict in membersList:

                    # match = all(regex.match(str(memberdict.get(key, ''))) for key, regex in regex_patterns.items())
                    match = all(regex.match(str(memberdict.get(key, '')))
                                for key, regex in regex_patterns.items())
                    if match:
                        # print("Match found:", memberdict)
                        content.append(memberdict)

                if content:
                    for i in content:
                        i["expiry_date"] = i["expiry_date"].strftime(
                            "%Y-%m-%d")
                        i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
                    return content
                else:
                    # return content
                    return {"error": "Members not found", "success": False}
            else:
                return {"error": "No Members", "success": False}
        else:
            return {"error": "Organisation not found", "success": False}
    else:

        return {"error": "Please enter data in filter input", "success": False, "data_dict": "empty"}
        # result = conn.EventWiz.find(query)

# fetching all memberships


@event.post("/organisationgetallmembership")
async def get_all_membership(data: dict):
    membership = conn.EventWiz.organisation.find_one(
        {"clubname": data["clubname"]}, {"memtype": 1, "_id": 0})
    if membership:
        memtype = serializeDict(membership)["memtype"]
        if len(memtype) != 0:
            return memtype
        else:
            return {"error": "No Membership Type Available", "success": False}
    else:
        return {"error": "Organization Not Found", "success": False}

# org inserting new membership type


@event.put("/addmembership/{clubname}")
async def add_membership(clubname: str, data: dict):
    if type(data["price"]) == str:
        data["price"] = int(data["price"])
    membership = conn.EventWiz.organisation.find_one(
        {"clubname": clubname}, {"memtype": 1, "_id": 0})
    if membership:
        memtype = serializeDict(membership)["memtype"]
        for i in memtype:
            if i["type"] == data["type"]:
                i["price"] = data["price"]
                conn.EventWiz.organisation.find_one_and_update(
                    {"clubname": clubname}, {"$set": {"memtype": memtype}})
                return {"data": "Membership Updated Successfully", "success": True}
        memtype.append(data)
        conn.EventWiz.organisation.find_one_and_update(
            {"clubname": clubname}, {"$set": {"memtype": memtype}})
        return {"data": "Membership Added Successfully", "success": True}
    else:
        return {"error": "Organization Not Found", "success": False}

# Get all Membership of Organization by Clubname


@event.post("/getallmembership")
async def get_all_membership(data: dict):
    membership = conn.EventWiz.organisation.find_one(
        {"clubname": data["clubname"]}, {"memtype": 1, "_id": 0})
    if membership:
        memtype = serializeDict(membership)["memtype"]
        if len(memtype) != 0:
            return memtype
        else:
            return {"error": "No Membership Type Available", "success": False}
    else:
        return {"error": "Organization Not Found", "success": False}

# user side fetch all post


# @event.get("/fetchingallpostforuser")
# async def fetch_all_post_userside():
#     past_events()

#     result = conn.EventWiz.post.find()
#     if (result != []):
#         return serializeList(result)
#     else:
#         return {"error": "No post found", "success": False}


# user side search filter by title for post


@event.post("/usersidesearchtitle")
async def search_by_title(data: dict):
    past_events()

    result = conn.EventWiz.post.find({"event_title": data["title"]})
    if result != []:
        return result
    else:
        return {"error": "No post found", "success": False}


# sorting user side in org member table
@event.post("/membersortinguserside")
async def member_sorting_userside(data: dict):
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
                sorted_list = sorted(
                    org, key=lambda x: x[data["col"]], reverse=True)
                # for i in sorted_list:
                #     i["expiry_date"] = i["expiry_date"].strftime("%Y-%m-%d")
                #     i["start_date"] = i["start_date"].strftime("%Y-%m-%d")
                return sorted_list

    else:
        return {"error": "Organization not Found", "success": False}


# fetch all the applied users
@event.post("/allappliedusers")
async def adminside_allappliedusers(data: dict):
    clubId = data["clubid"]
    orgData = conn.EventWiz.organisation.find({"_id": ObjectId(clubId)})
    orgData = serializeList(orgData)
    neworgdata = orgData[0]
    # print(orgData[0])
    applied_users = neworgdata["memapplied"]
    # print("-----------------------------")
    # for singleuser in applied_users:
    #     print(singleuser)
    #     print("-----------------------------")

    if (len(applied_users) != 0):
        return applied_users
    else:
        return {"error": "No Applied Users", "success": False, "message": "empty"}


# accepting a user's subscription
@event.post("/acceptingusersubscription")
async def adminside_acceptorg(data: dict):
    # print(data)

    memberdata = data["memberdata"]
    acceptedUser = data["data"]
    givenmemberid = memberdata["memberid"]
    startdate = memberdata["start_date"]
    startdate = datetime.strptime(startdate, "%Y-%m-%d")
    expirydate = memberdata["expiry_date"]
    expirydate = datetime.strptime(expirydate, "%Y-%m-%d")
    clubid = data["clubid"]

   
    if startdate > expirydate or startdate == expirydate:
        return {"error": "Start Date should be less than Expiry Date", "success": False}

    org = serializeDict(conn.EventWiz.organisation.find_one(
        {"_id": ObjectId(clubid)}))

    # print(org)

    memberslists = org["members"]
    orgappliedmemberslist = org["memapplied"]
    # print(memberslists)

    allmemberid = []
    for singlemember in memberslists:
        allmemberid.append(singlemember["memberid"])
    # print(allmemberid)

    if (len(allmemberid) != 0):
        if givenmemberid in allmemberid:
            return {"error": "MemberId Already Exists", "success": False, "closeform": False}
        else:

            acceptedUser["memberid"] = givenmemberid
            acceptedUser["start_date"] = startdate
            acceptedUser["expiry_date"] = expirydate

            # print(acceptedUser)

            usersloggedindata = acceptedUser

            if (conn.EventWiz.users.find_one({"username": acceptedUser["username"]})):

                content = conn.EventWiz.users.find_one_and_update(
                    {"username": acceptedUser["username"]}, {"$set": usersloggedindata})
            else:
                conn.EventWiz.users.insert_one(usersloggedindata)

            acceptedUser["loggedin"] = True
            acceptedUser["subscribe"] = True
            # print(acceptedUser)
            del acceptedUser["clubname"]
            print(acceptedUser)
            if "_id" in acceptedUser:
                del acceptedUser["_id"]

            memberslists.append(acceptedUser)

            updated_user = [
                i for i in orgappliedmemberslist if i["username"] != acceptedUser["username"]]

            content = conn.EventWiz.organisation.find_one_and_update({"_id": ObjectId(
                org["_id"])}, {"$set": {"memapplied": updated_user, "members": memberslists}})

            allorg = serializeList(conn.EventWiz.organisation.find())

            if content:
                # print("1")
                for other_org in allorg:
                    # print("2")
                    if other_org["_id"] != org["_id"]:
                        # print("3")
                        # print(acceptedUser["username"])

                        updated_applied_members = [
                            i for i in other_org["memapplied"] if i["username"] != acceptedUser["username"]]
                        # print(updated_applied_members)

                        conn.EventWiz.organisation.find_one_and_update(
                            {"_id": ObjectId(other_org["_id"])},
                            {"$set": {"memapplied": updated_applied_members}}
                        )

                data = {
                    "name": acceptedUser["name"], "clubname": org["clubname"], "email": acceptedUser["email"]}
                acceptinguser(data)

                return True
            else:
                return {"error": "Nothing To Update", "success": False}
    else:
        acceptedUser["memberid"] = givenmemberid
        acceptedUser["start_date"] = startdate
        acceptedUser["expiry_date"] = expirydate

        usersloggedindata = acceptedUser
        conn.EventWiz.users.insert_one(usersloggedindata)

        acceptedUser["loggedin"] = True
        acceptedUser["subscribe"] = True
        del acceptedUser["clubname"]
        if "_id" in acceptedUser:
            del acceptedUser["_id"]

        # print(acceptedUser)

        memberslists.append(acceptedUser)

        updated_user = [
            i for i in orgappliedmemberslist if i["username"] != acceptedUser["username"]]

        content = conn.EventWiz.organisation.find_one_and_update({"_id": ObjectId(
            org["_id"])}, {"$set": {"memapplied": updated_user, "members": memberslists}})

        if content:
            # print("1")
            for other_org in allorg:
                # print("2")
                if other_org["_id"] != org["_id"]:
                    # print("3")
                    # print(acceptedUser["username"])
                    updated_applied_members = [
                        i for i in other_org["memapplied"] if i["username"] != acceptedUser["username"]]
                    # print(updated_applied_members)
                    conn.EventWiz.organisation.find_one_and_update(
                        {"_id": ObjectId(other_org["_id"])},
                        {"$set": {"memapplied": updated_applied_members}}
                    )

            return True
        else:
            return {"error": "Nothing To Update", "success": False}


# rejecting subscribing user
@event.post("/rejectingsubscribinguser")
async def adminside_rejectorg(data: dict):
    # print(data["data"])
    rejectedUser = data["data"]

    conn.EventWiz.rejectedusers.insert_one(rejectedUser)

    orgdata = serializeDict(conn.EventWiz.organisation.find_one(
        {"_id": ObjectId(data["clubid"])}))

    orgappliedmemberslist = orgdata["memapplied"]

    updated_user = [
        i for i in orgappliedmemberslist if i["username"] != rejectedUser["username"]]

    content = conn.EventWiz.organisation.find_one_and_update(
        {"_id": ObjectId(orgdata["_id"])}, {"$set": {"memapplied": updated_user}})

    if content:
        data = {"name": rejectedUser["name"],
                "clubname": orgdata["clubname"], "email": rejectedUser["email"]}
        rejectinguser(data)
        return True
    else:
        return {"error": "Nothing To Update", "success": False}


# event post price update
    

@event.put("/updatepostprice")
async def event_priceupdate(data:dict):
    past_events()

    pricedata = data["pricedata"]
    postdata = data["postdata"]
    print("1")
    print(pricedata)
    oldprice = int(pricedata["oldprice"])
    newprice = int(pricedata["newprice"])

    if  oldprice != postdata["ticket_price"]:
        print("2")
        return {"error":"Old Price Doesn't Match" , "success":False}
    
    print("3")
    result = conn.EventWiz.post.find_one_and_update({"_id":ObjectId(postdata["_id"])},{"$set":{"ticket_price":newprice}})
    # print(postdata["ticket_price"])
    print("4")
    if result:
        return {"message":"Successfully Updated Ticket Price", "success":True}
    else:
        return {"error":"Error in updating" , "success":False}
    

# fetching org's past event posts
    
@event.post("/allorgpasteventposts")
async def pastevent_posts(orgdata:dict):
    data = serializeList(conn.EventWiz.pastevent.find({"clubname":orgdata["clubname"]}))
    # print(data)
    for i in data:
        # print(i["event_start_date"])
        i["event_start_date"] = i["event_start_date"].strftime("%Y-%m-%d")

        i["event_end_date"] = i["event_end_date"].strftime("%Y-%m-%d")

    if data:
        return data
    else:
        return {"error":"No Past Events" , "success":False}

        
# to fetch org's current event's posts


@event.post("/allorgcurrenteventposts/") 
async def currentevent_posts(orgdata:dict):
    today = datetime.now()
        # Assuming you have a 'start_date' and 'end_date' field in your database
    clubname = orgdata["clubname"]
    clubpost = serializeList(conn.EventWiz.post.find({"clubname":clubname}))

    # print(today)
    result = []
    if clubpost:
        for singlepost in clubpost:
            eventstart = singlepost["event_start_date"]
            eventend = singlepost["event_end_date"]

            if isinstance(eventstart, str):
                eventstart = datetime.strptime(eventstart, "%Y-%m-%d %H:%M:%S")
            if isinstance(eventend, str):
                eventend = datetime.strptime(eventend, "%Y-%m-%d %H:%M:%S")

            if eventstart <= today <= eventend:
                result.append(singlepost)
        # print(result)
        if result:
            return result
        else:
            return {"error":"No Current Event Posts" , "success":False}
    else:
        return {"error":"No Event Posts" , "success":False}

# fetching all org's future events


@event.post("/allorgfutureeventposts/") 
async def future_event_posts(orgdata: dict):
    today = datetime.now()
    clubname = orgdata["clubname"]
    clubpost = serializeList(conn.EventWiz.post.find({"clubname": clubname}))

    # print(today)
    result = []
    
    if clubpost:
        for singlepost in clubpost:
            # Assuming you have a 'event_start_date' and 'event_end_date' field in your database
            eventstart = singlepost["event_start_date"]
            eventend = singlepost["event_end_date"]

            # Ensure 'eventstart' and 'eventend' are datetime objects
            if isinstance(eventstart, str):
                eventstart = datetime.strptime(eventstart, "%Y-%m-%d %H:%M:%S")
            if isinstance(eventend, str):
                eventend = datetime.strptime(eventend, "%Y-%m-%d %H:%M:%S")

            if today <= eventstart:
                result.append(singlepost)
        # print(result)
        if result:
            return result
        else:
            return {"error": "No Future Event Posts", "success": False}
    else:
        return {"error": "No Event Posts", "success": False}



# org feedback
@event.post("/orgfeedback")
async def event_feedback(data: dict):
    print(data["lFormData"])
    feedbackform = data["lFormData"]
    postData = data["postData"]
    print(postData["_id"])
    org = conn.EventWiz.organisation.find_one({"clubname": postData["clubname"]})
    feedback = []

    if org:
        
        org = serializeDict(org)
        if len(org["feedback"]) !=0:
            
            feedback = org["feedback"]
            feedback.append(feedbackform)
            
            result = conn.EventWiz.organisation.find_one_and_update({"clubname": postData["clubname"]}, {"$set": {"feedback": feedback}})
            
            if result:
                return True
            else:
                return {"error": "Feedback Not Submitted", "success": False}
        else:   
            feedback.append(feedbackform)
            result = conn.EventWiz.organisation.find_one_and_update({"clubname": postData["clubname"]}, {"$set": {"feedback": feedback}})
            
            if result:

                return True
            else:
                return {"error": "Feedback Not Submitted", "success": False}
    else:   
        return {"error": "Post Not Found", "success": False}



# org platform feedback
@event.post("/orgplatformfeedback")
async def event_feedback(data: dict):
    print(data["lFormData"])
    feedbackform = data["lFormData"]
    admindata = conn.EventWiz.admin.find()
    feedback = []

    if admindata:
        
        admindata = serializeList(admindata)[0]
        if len(admindata["orgfeedback"]) !=0:
            
            feedback = admindata["orgfeedback"]
            feedback.append(feedbackform)
            
            result = conn.EventWiz.admin.find_one_and_update({}, {"$set": {"orgfeedback": feedback}})
            
            if result:
                return True
            else:
                return {"error": "Feedback Not Submitted", "success": False}
        else: 

            feedback.append(feedbackform)
            result = conn.EventWiz.admin.find_one_and_update({}, {"$set": {"orgfeedback": feedback}})

            if result:

                return True
            else:
                return {"error": "Feedback Not Submitted", "success": False}
    else:   
        return {"error": "Post Not Found", "success": False}
  
  # get all year in which member is subscribed

# fetching all years of subscribed members

@event.post("/getallsubscribedyear")
async def get_all_subscribed_year(data: dict):
    org = serializeDict(conn.EventWiz.organisation.find_one(
        {"clubname": data["clubname"]}))
    years=[]
    if len(org) != 0:
        subscribers = []

        for singlemember in org["members"]:
            if singlemember["start_date"].year not in years and singlemember["subscribe"] == True:
                years.append(singlemember["start_date"].year)
        years.sort(reverse=True)
        return years


from collections import defaultdict

# org dashboard graph data
@event.post("/orgdashboardgraph")

async def org_dashboard_graph(data: dict):
    clubname = data["clubname"]
    org = conn.EventWiz.organisation.find_one({"clubname": clubname})
    
    if org:
       
        org = serializeDict(org)
        memtype = org["memtype"]
        nonsubscribers = []
        subscribers = []
        for i in org["members"]:
            if i["subscribe"] and i["start_date"].year == data["datayear"]:
                subscribers.append(i)
            else:
                nonsubscribers.append(i)    
        month_names = [
            "Jan", "Feb", "March", "April",
            "May", "June", "July", "Aug",
            "Sept", "Oct", "Nov", "Dec"
        ]
        
        totalmembers = {}
        totalprofit = {}
        tmembers = []
        tprofit = []
        
        result = []
        
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
            
        for key, value in totalmembers.items():
            tmembers.append({"month": key, "subscribers": value})
        tmembers = sorted(tmembers, key=lambda x: month_names.index(x['month']))
        
        for key, value in totalprofit.items():
            tprofit.append({"month": key, "profit": value})

        tprofit = sorted(tprofit, key=lambda x: month_names.index(x['month']))
        
        
        
        result.append(tmembers)
        result.append(tprofit) 
         
        print(result)
        return result
    else:
        return {"error": "Organisation Not Found", "success": False}


import math 
# fetchin the cards data for org dashboard

@event.post("/orgdashboardcards")
async def org_dashboard_cards(data: dict):
    clubname = data["clubname"]
    org = conn.EventWiz.organisation.find_one({"clubname": clubname})
    result= []
    if org:
        org = serializeDict(org)
        nonsubscribers = []
        subscribers = []
        membertypelist = []

        for i in org["members"]:


            if i["subscribe"]:

                membertypelist.append(i["membertype"])
                subscribers.append(i)
            else:
                nonsubscribers.append(i)

        totalmembers = len(org["members"])
        totalsubscribers = len(subscribers)
        totalnonsubscribers = len(nonsubscribers)

        card1data = {
            "totalmembers": totalmembers,
            "totalsubscribers": totalsubscribers,
            "totalnonsubscribers": totalnonsubscribers
        }

        result.append(card1data)
        print("hello")
        print(result)

        total = 0
        for i in org["memtype"]:

            membertype = i["type"]
            membertypecount = membertypelist.count(membertype)

            total = total + ( membertypecount *  i["price"])

        print(total)
        card2data = {
            "totalprofit" : total
        }
        result.append(card2data)

        allposts = conn.EventWiz.post.find({"clubname": clubname})
        allposts = serializeList(allposts)
        totalposts = len(allposts)

        card3data = {
            "totalposts": totalposts
        }
        result.append(card3data)

        totalparticipants = []
        for i in allposts:
            for j in i["participate"]:
                totalparticipants.append(j)

        if len(totalparticipants)!=0 and totalposts:
            averageparticipants = len(totalparticipants) / totalposts
        else:
            averageparticipants = 0

        card4data = {
            "averageparticipants": math.ceil(averageparticipants)
        }
  
        result.append(card4data)

        if result:
            print(result)
            return result
        else:
            return {"error": "No Data Found", "success": False}

    else:
        return {"error": "Organisation Not Found", "success": False}   
    
# get all year in which Event posts
@event.post("/getalleventyear")
async def get_all_event_year(data: dict):
    post1 = serializeList(conn.EventWiz.post.find({"clubname": data["clubname"]}))
    post2 = serializeList(conn.EventWiz.pastevent.find({"clubname": data["clubname"]}))
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
    post1 = serializeList(conn.EventWiz.post.find({"clubname": data["clubname"]}))
    post2 = serializeList(conn.EventWiz.pastevent.find({"clubname": data["clubname"]}))
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


     
# fetching the cards data of popular events for admin
    
    
@event.post("/orgdashboardpopulareventcards")
async def admin_dashboard_popularevents(data:dict):
    allevents = conn.EventWiz.post.find({"clubname": data["clubname"]})
    events = []
    if allevents:
        allevents = serializeList(allevents)
        for i in allevents:
            events.append(i)
    allpastevents = conn.EventWiz.pastevent.find({"clubname": data["clubname"]})
    if allpastevents:
        allpastevents = serializeList(allpastevents)

        for i in allpastevents:
            events.append(i)

    if len(events) != 0:
        events = sorted(events, key = lambda i: len(i["participate"]),reverse=True)
            # print(allevents)
        popularevents = []
        for count in range(3):
            events[count]["event_start_date"] = events[count]["event_start_date"].strftime("%d-%m-%Y")
            events[count]["event_end_date"] = events[count]["event_end_date"].strftime("%d-%m-%Y")     
            # print(count)
            # print(events[count]["event_title"])
            popularevents.append(events[count])

        if popularevents:
            print(popularevents)
            return popularevents
        else:
            return {"error": "No Event Found", "success": False}
    else:
        return {"error": "No Event Found", "success": False}


# ///////////////////////////////////////////////////////////////////////////////////


# //////////////General Routes/////////////////////////////////////

    
def past_events():
    events = conn.EventWiz.post.find()
    if events:
        eventlist = serializeList(events)
        today = datetime.now()
        for i in eventlist:
            merged_datetime = datetime.combine(i["event_end_date"], datetime.strptime(i["end_time"], "%H:%M").time())
            if merged_datetime < today:
                conn.EventWiz.pastevent.insert_one(i)
                conn.EventWiz.post.find_one_and_delete({"_id": ObjectId(i["_id"])})


 
   


# //////////////////////////////////////////////////////////////////