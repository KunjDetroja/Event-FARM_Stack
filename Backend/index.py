from fastapi import FastAPI
from routes.user import event 
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.include_router(event)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],  #if axios cors error arises then remove this
)

