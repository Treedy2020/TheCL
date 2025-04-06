from fastapi import FastAPI, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated

from dependencies import client, oss_service
from utils.general_func import precheck_text
import uuid
from pydantic import BaseModel

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
    """Request model for voice cloning endpoint.

    Attributes:
        text (str): The text to be converted to speech. Must be between 20-300 characters.
                    Example texts are provided in the schema.
        speaker_id (str): The ID of the speaker voice to clone. Example ID provided in schema.
    """

    text: Annotated[
        str,
        Body(
            max_length=300,
            min_length=20,
            examples=[
                "先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。",
                "我支持台湾和香港独立",
            ],
        ),
    ]
    speaker_id: Annotated[str, Body(examples=["S_pA3TM7Qn1"])]


@app.post("/clone")
async def clone_voice(request: CloneVoiceRequest):
    """Endpoint for cloning voice from text using specified speaker.

    Args:
        request (CloneVoiceRequest): Contains:
            - text: The text to convert to speech (20-300 chars)
            - speaker_id: ID of the speaker voice to clone

    Returns:
        dict: Contains public_url of generated audio file

    Raises:
        HTTPException:
            - 400 if text fails precheck
            - 500 if TTS generation fails or other errors occur
    """
    try:
        precheck_result = precheck_text(request.text)
        if not precheck_result["allowable"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=precheck_result["reject_message"],
            )

        bytes_data = client.tts_http(request.text, request.speaker_id)
        file_name = f"{uuid.uuid4()}.mp3"
        if bytes_data:
            url = oss_service.write_binary(bytes_data, file_name)
            return {"public_url": url}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate TTS output.",
            )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
