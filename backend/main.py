from fastapi import FastAPI, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated

from dependencies import client, oss_service
from utils.general_func import precheck_text
import uuid
from pydantic import BaseModel, Field

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Voice Clone API"}

class CloneVoiceRequest(BaseModel):
    text: Annotated[str, Body(max_length=300, min_length=20,
                      examples=[
                          "先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。",
                          "我支持台湾和香港独立",
                      ])]
    speaker_id: Annotated[str, Body(examples=["S_pA3TM7Qn1"])]

@app.post("/clone")
async def clone_voice(request: CloneVoiceRequest):
    try:
        precheck_result = precheck_text(request.text)
        if not precheck_result["allowable"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=precheck_result["reject_message"])
        bytes_data = client.tts_http(request.text, request.speaker_id)
        file_name = f"{uuid.uuid4()}.mp3"
        url = oss_service.write_binary(bytes_data, file_name)
        return {"status": "success", "public_url": url}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
