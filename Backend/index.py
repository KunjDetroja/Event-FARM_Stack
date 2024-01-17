from fastapi import FastAPI
from routes.event import event
from fastapi.middleware.cors import CORSMiddleware
from config.db import conn

app = FastAPI()

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(event)



