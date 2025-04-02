import oss2
import os
from datetime import datetime, timedelta, UTC

class OssClient:
    def __init__(self):
        """Initialize OSS client
        Default to get configuration from environment variables
        """
        self.access_key_id = os.environ.get('OSS_ACCESS_KEY_ID')
        self.access_key_secret = os.environ.get('OSS_ACCESS_KEY_SECRET')
        self.endpoint = os.environ.get('OSS_ENDPOINT', 'https://oss-cn-beijing.aliyuncs.com')
        self.bucket_name = os.environ.get('OSS_BUCKET_NAME')
        
        auth = oss2.Auth(self.access_key_id, self.access_key_secret)
        self.bucket = oss2.Bucket(auth, self.endpoint, self.bucket_name)

    def write_binary(self, binary_data: bytes, file_name: str) -> str:
        """Write binary data to OSS and return public access URL
        
        Args:
            binary_data (bytes): Binary data to write
            file_name (str): Name of the file
            
        Returns:
            str: Public access URL for the file
            
        Raises:
            oss2.exceptions.OssError: When OSS operation fails
        """
        try:
            self.bucket.put_object(file_name, binary_data)
            
            expiration_time = datetime.now(UTC) + timedelta(days=1)
            self.bucket.update_object_meta(
                file_name,
                headers={'x-oss-expiration-time': expiration_time.isoformat()}
            )
            
            url = f'https://{self.bucket_name}.{self.endpoint.replace("https://", "")}/{file_name}'
            return url
            
        except oss2.exceptions.OssError as e:
            raise Exception(f"OSS operation failed: {str(e)}")
