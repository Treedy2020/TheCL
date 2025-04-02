import os
import requests
import json
import base64
from backend.utils.general_func import encode_audio_file

import uuid

class Client:
    def __init__(self):
        self.host = os.environ.get("host", "https://openspeech.bytedance.com")
        self.appid = os.environ.get("appid")
        self.access_token = os.environ.get("access_token")
        self.cluster = os.environ.get("cluster", "volcano_icl")

    def clone_voice(self, audio: str , spk_id: str):
        """Voice cloning API endpoint
        
        Args:
            audio (str): Path to the audio file
            spk_id (str): Speaker ID
            
        Returns:
            dict: JSON response from the API
            
        Raises:
            Exception: When response status code is not 200
            
        Example:
            >>> client = Client()
            >>> result = client.clone_voice("audio.wav", "speaker_123")
        """
        url = self.host + "/api/v1/mega_tts/audio/upload"
        headers = {
            "Content-Type": "application/json", 
            "Authorization": "Bearer;" + self.access_token,
            "Resource-Id": "volc.megatts.voiceclone",
        }
        encoded_data, audio_format = encode_audio_file(audio)
        audios = [{"audio_bytes": encoded_data, "audio_format": audio_format}]
        data = {"appid": self.appid,
                "speaker_id": spk_id,
                "audios": audios, 
                "source": 2,
                "language": 0,
                "model_type": 1}
        response = requests.post(url, json=data, headers=headers)
        if response.status_code != 200:
            raise Exception("train请求错误:" + response.text)
        return response.json()

    def get_spk_id_status(self, spk_id: str):
        """Get the status of a speaker ID
        
        Args:
            spk_id (str): Speaker ID

        Returns:
            dict: JSON response from the API
            
        Raises:
            Exception: When response status code is not 200
        """
        url = self.host + "/api/v1/mega_tts/status"
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer;" + self.access_token,
            "Resource-Id": "volc.megatts.voiceclone",
        }
        body = {"appid": self.appid, "speaker_id": spk_id}
        response = requests.post(url, headers=headers, json=body)
        return response.json()

    def tts_http(self, text: str, output_file: str, spk_id: str):
        """Call TTS HTTP API to convert text to speech

        Args:
            text (str): Text content to be converted
            output_file (str): Path to output audio file
            spk_id (str): Speaker ID to specify the voice

        Returns:
            None

        Raises:
            Exception: When API request fails
            
        Example:
            >>> client = Client()
            >>> client.tts_http("Hello world", "output.mp3", "speaker_123")
        """
        api_url = self.host + "/api/v1/tts"
        header = {"Authorization": f"Bearer;{self.access_token}"}

        request_json = {
            "app": {
                "appid": self.appid,
                "token": self.access_token, 
                "cluster": self.cluster
            },
            "user": {
                "uid": "388808087185088" # This can be fixed
            },
            "audio": {
                "voice_type": spk_id,
                "encoding": "mp3",
                "speed_ratio": 1.0,
                "volume_ratio": 1.0,
                "pitch_ratio": 1.0,
            },
            "request": {
                "reqid": str(uuid.uuid4()),
                "text": text,
                "text_type": "plain", 
                "operation": "query",
                "with_frontend": 1,
                "frontend_type": "unitTson"

            }
        }
        try:
            resp = requests.post(api_url, json.dumps(request_json), headers=header)
            if "data" in resp.json():
                data = resp.json()["data"]
                file_to_save = open(output_file, "wb")
                file_to_save.write(base64.b64decode(data))
        except Exception as e:
            e.with_traceback()



if __name__ == "__main__":
    client = Client()
    print(client.tts_http("我喜欢你的激进中那种无谓失败的自信，像盛夏的阳光，敢去世界上所有地方。", "output.mp3", "S_pA3TM7Qn1"))
