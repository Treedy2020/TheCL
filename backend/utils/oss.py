import oss2
import os

class OssService:
    def __init__(self):
        """Initialize OSS client
        Default to get configuration from environment variables
        """
        self.access_key_id = os.environ.get('OSS_ACCESS_ACCOUNT_ID')
        self.access_key_secret = os.environ.get('OSS_ACCESS_ACCOUNT_KEY')
        self.endpoint = os.environ.get('OSS_ENDPOINT', 'https://oss-cn-shanghai.aliyuncs.com')
        self.bucket_name = os.environ.get('OSS_BUCKET_NAME')
        
        auth = oss2.Auth(self.access_key_id, self.access_key_secret)
        self.bucket = oss2.Bucket(auth, self.endpoint, self.bucket_name)
    
    def list_objects(self):
        """List all objects in the bucket
        """
        objects = self.bucket.list_objects()
        return objects.object_list

    def write_binary(self, binary_data: bytes, 
                     file_name: str,
                     expires_in_seconds: int = 3600) -> str:
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
            url = self.bucket.sign_url("GET", file_name, expires_in_seconds)
            return url
            
        except oss2.exceptions.OssError as e:
            raise Exception(f"OSS operation failed: {str(e)}")

if __name__ == "__main__":
    oss_service = OssService()
    print(oss_service.write_binary(b'test', 'test.txt'))
    print(oss_service.list_objects())
