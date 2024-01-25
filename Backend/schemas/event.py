from bson import ObjectId

def eventEntity(item) -> dict:
    return{
        "id" : str(item['_id']),
        'name' : item['name'],
        'since' : item['since'],
    }

def eventsEntity(entity) ->list:
    return [eventEntity(item) for item in entity]


def serializeDict(a) -> dict:
    return {**{i:str(a[i]) for i in a if i=='_id'},**{i:a[i] for i in a if i!='_id'}}


def serializeList(entity) ->list:
    return [serializeDict(a) for a in entity]