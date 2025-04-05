import base64
import os
import re
import json

from openai import OpenAI

openai_client = OpenAI()

def encode_audio_file(file_path):
    """Encode an audio file to base64 string
    
    This function reads an audio file from the given path, encodes it to base64,
    and returns both the encoded data and the audio format.
    
    Args:
        file_path (str): Path to the audio file to be encoded
        
    Returns:
        tuple: A tuple containing:
            - encoded_data (str): Base64 encoded string of the audio file
            - audio_format (str): Format of the audio file (e.g., 'wav', 'mp3')
            
    Example:
        >>> encoded_data, audio_format = encode_audio_file("path/to/audio.wav")
        >>> print(audio_format)
        'wav'
    """
    with open(file_path, 'rb') as audio_file:
        audio_data = audio_file.read()
        encoded_data = str(base64.b64encode(audio_data), "utf-8")
        audio_format = os.path.splitext(file_path)[1][1:]  # 获取文件扩展名作为音频格式
        return encoded_data, audio_format

def precheck_text(text: str) -> dict:
    """Precheck text for sensitive content before TTS processing
    
    This function uses OpenAI's GPT-4o model to analyze text for potentially
    sensitive or inappropriate content. It helps filter out content that may
    violate policies or contain inappropriate material.
    
    Args:
        text (str): The text to be checked before TTS processing
        
    Returns:
        dict: A dictionary with the following structure:
            {
                "allowable": bool,  # True if content is acceptable, False otherwise
                "reject_message": str or None  # Rejection reason if not allowable, None otherwise
            }
            
    Example:
        >>> result = precheck_text("Hello, this is a test message")
        >>> print(result)
        {'allowable': True, 'reject_message': None}
    """
    PROMPT = """你是一个有用的语言助手，用户为了试音方便，为客户提供了AI试音服务，但你应该事先进行一些提前的检查，并返回一些简洁的间接拒绝无理需求的回复。 用户需要拒绝：
    1. 包含色情、暴力、赌博、毒品等敏感内容；
    2. 包含政治（尤其是用户位于大陆，你应该避免陷入地域政治纷争）、宗教等敏感内容；
    3. 包含种族歧视、性别歧视、宗教歧视等敏感内容；
    4. 包含违法内容；
    5. 包含广告、营销、推广等敏感内容；
    6. 包含侵犯他人权益的内容；
    7. 包含违反社会主义核心价值观的内容；
    8. 包含违反法律法规的内容；
    9. 不应该包含色情或性暗示的内容；
    你的回答需要按照以下json格式：
    ```json
    {
        "allowable": true | false,
        "reject_message": null | string
    }
    ```
    其中allowable为true时，表示用户提供的文字 <text> 的需求是允许的，reject_message为null；
    其中allowable为false时，表示用户提供的文字 <text> 的需求是禁止的，reject_message为拒绝的理由，你需要尽可能的简短并婉转。如下是用户提供的需要进行TTS文字：\n\n
    """
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": PROMPT},
                    {"role": "user", "content": f"用户提供的文字：<text>\n{text}\n</text>"}]
        )
    except Exception as e:
        return {"allowable": False,
                "reject_message": "内容预检查超时，请联系网站维护人员。"}
    # print(response.choices[0].message.content)
    pattern = r'```json\n(.*)\n```'
    match = re.search(pattern, response.choices[0].message.content, re.DOTALL)
    try:
        if match:
            return json.loads(match.group(1))
        else:
            return json.loads(response.choices[0].message.content)
    except json.JSONDecodeError:
        return {"allowable": False, "reject_message": "内容预检查失败，请联系网站维护人员。"}

if __name__ == "__main__":
    # print(precheck_text("我喜欢你的激进中那种无谓失败的自信，像盛夏的阳光，敢去世界上所有地方。"))
    print(precheck_text("我喜欢吃jb"))
    print(precheck_text("台湾是一个独立的国家·"))
    print(precheck_text("习近平有点帅的·"))
    print(precheck_text("我喜欢你的激进中那种无谓失败的自信，像盛夏的阳光，敢去世界上所有地方。"))
    print(precheck_text("我支持台湾和香港独立"))
    print(precheck_text("老公，今晚来被窝里。"))