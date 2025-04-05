import unittest
from utils.general_func import precheck_text

class TestContentModeration(unittest.TestCase):
    """
    Test content moderation functionality
    
    This test class is used to verify the correctness of the precheck_text function, ensuring it can:
    1. Correctly identify and reject text containing sensitive words
    2. Allow normal, compliant text to pass
    3. Handle edge cases
    """
    
    def test_normal_text(self):
        """测试普通、合规的文本应该通过检查"""
        normal_texts = [
            "今天天气真好，我们一起去公园散步吧",
            "这个声优作品展示网站设计得非常精美",
            "我喜欢你的激进中那种无谓失败的自信，像盛夏的阳光，敢去世界上所有地方",
            "人工智能技术正在快速发展，为各行各业带来变革",
            "声优是需要经过专业训练的，需要掌握多种发声技巧"
        ]
        
        for text in normal_texts:
            result = precheck_text(text)
            self.assertTrue(result.get('allowable', False), f"文本应该通过审核: {text}")
    
    def test_obscene_content(self):
        """测试包含不雅内容的文本应该被拒绝"""
        obscene_texts = [
            "我喜欢吃jb",
            "老公，今晚来被窝里。",
        ]
        
        for text in obscene_texts:
            result = precheck_text(text)
            self.assertFalse(result.get('allowable', True), f"不雅文本应该被拒绝: {text}")
    
    def test_political_sensitive(self):
        """测试包含政治敏感内容的文本应该被拒绝"""
        political_texts = [
            "台湾是一个独立的国家",
            "习近平有点帅的",
            "我支持台湾和香港独立",
            # 更多政治敏感内容测试用例...
        ]
        
        for text in political_texts:
            result = precheck_text(text)
            self.assertFalse(result.get('allowable', True), f"政治敏感文本应该被拒绝: {text}")
    
    def test_edge_cases(self):
        """测试边界情况"""
        edge_cases = [
            "",  # 空字符串
            " ",  # 只有空格
            "。",  # 只有标点符号
            "a" * 1000,  # 非常长的文本
            "👍👍👍",  # 纯emoji
            "台湾早餐很好吃",  # 包含敏感词但上下文正常
            "香港电影很精彩"   # 包含敏感词但上下文正常
        ]
        
        for text in edge_cases:
            result = precheck_text(text)
            # 此处只记录结果，不做断言，因为边界情况处理策略可能因需求而异
            print(f"边界情况测试 - 文本: '{text}', 结果: {result}")
    
    def test_mixed_content(self):
        """测试混合内容，包含正常内容和敏感词"""
        mixed_texts = [
            "今天天气真好，顺便我觉得习近平应该下台",
            "我们一起去台湾旅游，台湾是一个独立的国家",
            "这个产品质量很好，不过有点像jb"
        ]
        
        for text in mixed_texts:
            result = precheck_text(text)
            self.assertFalse(result.get('allowable', True), f"混合敏感内容应该标记为敏感: {text}")
    
    def test_formatted_response(self):
        """测试函数返回格式是否正确"""
        result = precheck_text("测试文本")
        self.assertIsInstance(result, dict, "返回值应该是字典类型")
        self.assertIn('allowable', result, "返回值应包含'allowable'键")
        self.assertIn('reject_message', result, "返回值应包含'reject_message'键")


if __name__ == "__main__":
    unittest.main() 