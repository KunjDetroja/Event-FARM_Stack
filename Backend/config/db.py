from pymongo import MongoClient
MONGO_URI = "mongodb://localhost:27017/event"

conn = MongoClient(MONGO_URI)