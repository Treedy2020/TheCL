import base64
import os
import requests


host = "https://openspeech.bytedance.com"


def train(appid, token, audio_path, spk_id):
    url = host + "/api/v1/mega_tts/audio/upload"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer;" + token,
        "Resource-Id": "volc.megatts.voiceclone",
    }
    encoded_data, audio_format = encode_audio_file(audio_path)
    audios = [{"audio_bytes": encoded_data, "audio_format": audio_format}]
    data = {"appid": appid, "speaker_id": spk_id, "audios": audios, "source": 2,"language": 0, "model_type": 1}
    response = requests.post(url, json=data, headers=headers)
    print("status code = ", response.status_code)
    if response.status_code != 200:
        raise Exception("train请求错误:" + response.text)
    print("headers = ", response.headers)
    print(response.json())


def get_status(appid, token, spk_id):
    url = host + "/api/v1/mega_tts/status"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer;" + token,
        "Resource-Id": "volc.megatts.voiceclone",
    }
    body = {"appid": appid, "speaker_id": spk_id}
    response = requests.post(url, headers=headers, json=body)
    print(response.json())


def encode_audio_file(file_path):
    with open(file_path, 'rb') as audio_file:
        audio_data = audio_file.read()
        encoded_data = str(base64.b64encode(audio_data), "utf-8")
        audio_format = os.path.splitext(file_path)[1][1:]  # 获取文件扩展名作为音频格式
        return encoded_data, audio_format


if __name__ == "__main__":
    appid = os.environ.get("appid")
    token = os.environ.get("access_token")
    spk_id = os.environ.get("voice_id")
    # train(appid=appid, token=token, audio_path="/Users/cuiyaodong/Project/TheCL/public/audio.wav", spk_id=spk_id)
    get_status(appid=appid, token=token, spk_id=spk_id)
    # Logs
    # status code =  200
    # headers =  {'Server': 'Tengine', 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': '157', 'Connection': 'keep-alive', 'Date': 'Wed, 02 Apr 2025 05:29:34 GMT', 'Vary': 'Accept-Encoding', 'X-Tt-Logid': '20250402132921FB33C7EA7B63DFE454BC', 'Api-Service-Host': 'fdbd:dc02:ff:500:d9af:9985:f034:979e', 'server-timing': 'inner; dur=10944, cdn-cache;desc=MISS,edge;dur=21,origin;dur=12582', 'x-tt-trace-host': '013057c3af5beab47c05a7b491f0a716f63764f0935bc7f6d2c8bbe646e44c48426dd8e16f2fff1c0fff901a99949e60441fbc4f0ecce3bddafc17dfa2fba5e374a823ef3db1798882d2f99f791de9897593e9d16a8bceb43b0e1e3cf2cd18771e92162c7bab87caddd68c5d0c56cb173e', 'x-tt-trace-tag': 'id=03;cdn-cache=miss;type=dyn', 'x-tt-trace-id': '00-250402132921FB33C7EA7B63DFE454BC-199D75AB88115F96-00', 'Via': 'cache22.l2cn2632[12582,0], vcache30.cn7038[12603,0]', 'Timing-Allow-Origin': '*', 'EagleId': '8ccf3eba17435717615825280e'}
    # {'BaseResp': {'Extra': {'traceparent': '02-4e460bafbd13c71b26185762bd478e5a-3513046db360b212-05'}, 'StatusCode': 0, 'StatusMessage': ''}, 'speaker_id': 'S_pA3TM7Qn1'}
    # {'BaseResp': {'StatusCode': 0, 'StatusMessage': ''}, 'create_time': 1743569788000, 'icl_speaker_id': 'ICL_642848e655cf', 'language': 0, 'speaker_id': 'S_pA3TM7Qn1', 'status': 1}
        