// 声优作品数据配置
const voiceActorData = {
    profile: {
        name: "水何澹澹",
        years: "10+",
        specialties: ["有声书", "有声漫画", "游戏", "广告", "网剧", "电影", "电视剧"],
        voiceCharacteristics: "清澈明亮，情感表现丰富，能够塑造从可爱少女到成熟女性的多种角色",
        languages: ["中文", "粤语", "英语", "法语"]
    },
    
    works: [
        {
            year: 2024,
            type: "game",
            typeName: "游戏",
            title: "《新倩女幽魂x道诡异仙》",
            image: "./image1.png",
            role: "女主角'白灵淼'",
            description: "网络小说《道诡异仙》及其衍生作品中的女主角。出身为出马弟子和白莲教圣女，被赋予了慈悲与死亡司命无生老母的心蟠身份。她温柔善良、体贴入微，拥有二神、帮兵决，神打乩童等多种神通，持有红盖头，皮鼓，舍利子，十二品功德玉莲，人骨念珠等特殊物品。她曾发动白莲信徒对抗法教，解救无生老母，结束不死天灾",
            details: "温柔病弱善良天真体贴入微白月光守护者",
            link: "https://zuowangdao.163.com/#/",
            linkText: "跳转至网易游戏官网"
        },
        {
            year: 2023,
            type: "game",
            typeName: "游戏",
            title: "《房间的秘密3：女团回归夜》",
            image: "./image2.jpg",
            role: "绫花",
            description: "《房间的秘密3：女团回归夜》是Noface工作室第三部作品，是新视角女团题材的解谜游戏。女团“几何少女”最新回归单曲发表在即，作为粉丝的你，一觉醒来居然附身到了自己的偶像身上！古怪的事情接连发生：回归音源被黑客窃取，#几何少女塌房#的直播间也冲上热搜。关于女团成员的黑料被不断爆出，你必须尽快破解谜题，挖掘偶像真实的内心，找到证据，澄清各种流言蜚语。正当你修复音源，平复舆论时，经纪人却告诉你：这只是一场精心策划的黑红营销！更令人震惊的是，偶像的本体居然是仿生人？！她希望借助你的力量，拆穿公司更可怕的黑暗行径。在不同的房间中寻找线索，深入了解偶像故事的过程中，一个更大的秘密也随之浮出水面.....",
            details: "敏感自卑温柔勇敢大姐姐",
            link: "https://store.steampowered.com/app/2571240/3/?l=schinese",
            linkText: "跳转至 Steam 游戏官网"
        },
        {
            year: 2024,
            type: "game",
            typeName: "游戏",
            title: "《月白星斗》",
            image: "./image3.jpg",
            role: "白社长",
            description: "《月白星斗-Lunar Glow Stellar Dance》是中国美少女游戏品牌JROCKSTUDIO（玖石社）制作的全年龄向恋爱题材作品。主人公因为从小能看到鬼魂被卷入一个个非日常事件中，同时邂逅了五个可爱的女孩子，一切的阴谋都将逐渐揭晓。",
            details: "",
            link: "https://store.steampowered.com/app/2653460/Lunar_Glow_Stellar_Dance/",
            linkText: "跳转至 Steam 游戏官网"
        },
        {
            year: 2023, // Estimated
            type: "movie",
            typeName: "电影",
            title: "《战玄武》",
            image: "./image4.webp", // Placeholder path
            role: "女主",
            description: "爱奇艺出品的电影作品",
            details: "在该电影中担任女主角配音工作，作品在爱奇艺平台独家播出。",
            link: "https://www.iqiyi.com/search/战玄武.html",
            linkText: "爱奇艺官网"
        },
        {
            year: 2023, // Estimated
            type: "movie",
            typeName: "电影",
            title: "《守钻狙击》",
            image: "./image5.jpg", // Placeholder path
            role: "女主",
            description: "横行霸道的四海集团，在大律师梁生的庇护下，被逐渐洗白，并享誉一时。巨钻九龙壁的出现，让警方意识到这是一次良机。赵锦豪沉着笃定，身手了得，经上级委派化名郭豪暗中展开调查，不料却节外生枝，只能在机关陷阱中艰难应对。梁生发觉警方介入调查，主张暂避锋芒，放弃了钻石。黑蛇对梁生的做法感到不解，与梁生产生了分歧。郭豪约黑蛇进行钻石交易，不料发现钻石被人调包，追查之下才发现林悦竟是黑蛇手下。杀手铁虎与郭豪展开激烈角逐，郭豪意识到行动的危险，让助手安宁暂时躲避。未料，铁虎出手杀死安宁，郭豪悲愤不已。梁生发现大局已定，准备出国。郭豪与警方取得联系，对黑蛇实施抓捕，黑蛇最终落网。",
            details: "",
            link: "https://www.iqiyi.com/search/《夺钻狙击》.html",
            linkText: "爱奇艺官网"
        },
        
        // 有声漫 (Voice Comics)
        {
            year: 2022, // Estimated
            type: "voiceComic",
            typeName: "有声漫",
            title: "《在下铲屎官：喵王在上》",
            image: "./image6.jpg",
            role: "女主",
            description: "夜路走多了，竟捡到宝，带着巨钻的小黑猫一只！可这是猫吗？霸她浴缸，抢她粮，每天还要她暖暖床？为了钱她忍了，可这只死猫竟潜逃！直到一天，公司新来终极大BOSS，她惊悚发现，他脖子上的钻石，竟跟她半夜捡来的猫咪项圈上的一模一样⋯.",
            details: "",
            link: "https://www.iqiyi.com/a_19rrhwzn9d.html",
            linkText: "爱奇艺官网"
        },
        {
            year: 2022,
            type: "voiceComic",
            typeName: "有声漫",
            title: "《毒医狂妃》",
            image: "./image7.jpeg",
            role: "女主",
            description: "一朝穿越，成了大名鼎鼎的瑞王妃。原以为是好运来临了，却不知是更加倒霉的命运。今天刺杀，明天中毒。不管是娘家还是夫家，都有想置她于死地的人。不给她们点颜色瞧瞧真当她是吃素的，她苏月月可从来是吃荤的料。",
            details: "",
            link: "https://www.iqiyi.com/v_19rwk1ckmg.html?vfrm=pcw_album_auto",
            linkText: "爱奇艺官网"
        },
        {
            year: 2021, // Estimated
            type: "voiceComic",
            typeName: "有声漫",
            title: "《王爷你好贱》",
            image: "./image8.webp", // Placeholder path
            role: "朱无心",
            description: "Bilibili出品的有声漫画作品",
            details: "朱无心穿越回到了古代。这里有最丰富多彩的小贱人们，有最意想不到的扎堆撕，甚至还有最臭不要脸的莲花贱，最重要的是，还有五花八门的王爷们，走过路过不要错过，总有一款适合你！",
            link: "https://www.bilibili.com/bangumi/play/ss33164?spm_id_from=333.337.0.0",
            linkText: "Bilibili有声书官网"
        },
        
        // 广播剧 (Radio Dramas)
        {
            year: 2023, // Estimated
            type: "radioDrama",
            typeName: "广播剧",
            title: "《清平乐》",
            image: "./image9.jpg", // Placeholder path
            role: "太子妃 | 协役",
            description: "百合Hub出品的广播剧作品",
            details: "「鸿来燕去。又是秋光暮。冉冉流年嗟暗度。这心事还无据。」\n晋江文学城 ，若花辞树原著，金甲萤火虫工作室出品，全一季古风广播剧《清平乐》，2023年4月20日起，每周一漫播独家播出，逢节气不定期加更。",
            link: "https://baihehub.com/audio-dramas/1688", // Placeholder
            linkText: "百合Hub官网"
        },
        {
            year: 2021, // Estimated
            type: "radioDrama",
            typeName: "广播剧",
            title: "《我的男友不是人》",
            image: "./image10.webp", // Placeholder path
            role: "女主 | 主役",
            description: "妈妈这鬼好贤惠啊~~~ 改编自有妖气漫画，没有木桩同名漫画，咪波文化配音工作室联合制作，我的男友不是人广播剧第一季。",
            details: "",
            link: "https://c6.y.qq.com/base/fcgi-bin/u?__=CfKnSvjKtha4",
            linkText: "QQ音乐官网"
        },
        {
            year: 2020, // Estimated
            type: "radioDrama",
            typeName: "广播剧",
            title: "《不忧雅》",
            image: "./radiodramas/bya.jpg", // Placeholder path
            role: "女主",
            description: "QQ音乐出品的广播剧作品",
            details: "在该广播剧中担任女主角配音工作，作品在QQ音乐平台独家发布。",
            link: "https://www.kuwo.cn/album_detail/15639808",
            linkText: "酷我音乐官网"
        },
        // {
        //     year: 2020, // Estimated
        //     type: "radioDrama",
        //     typeName: "广播剧",
        //     title: "《次元突破！》",
        //     image: "./radiodramas/cytp.jpg", // Placeholder path
        //     role: "女主",
        //     description: "QQ音乐出品的广播剧作品",
        //     details: "科幻题材广播剧，讲述穿越次元的奇幻故事。",
        //     link: "https://y.qq.com/",
        //     linkText: "QQ音乐官网"
        // },
        
        // // 有声书 (Audiobooks)
        {
            year: 2020, // Estimated
            type: "audiobook",
            typeName: "有声书",
            title: "《病君的小邪后》",
            image: "/image11.jpg", // Placeholder path
            role: "女主",
            description: "热门网络小说有声书，🔥标记表示作品广受欢迎",
            details: "古风言情小说改编的有声书，担任女主角配音。",
            link: "https://m.ximalaya.com/album/53770535",
            linkText: "试听链接"
        },
        // {
        //     year: 2019, // Estimated
        //     type: "audiobook",
        //     typeName: "有声书",
        //     title: "《爵迹》",
        //     image: "./audiobooks/jj.jpg", // Placeholder path
        //     role: "女主",
        //     description: "官方授权小说有声书，👑标记表示官方认证作品",
        //     details: "郭敬明同名小说改编的有声书，担任女主角配音。",
        //     link: "https://example.com/jj",
        //     linkText: "试听链接"
        // },
        // {
        //     year: 2019, // Estimated
        //     type: "audiobook",
        //     typeName: "有声书",
        //     title: "《欢颜》",
        //     image: "./audiobooks/hy.jpg", // Placeholder path
        //     role: "女主",
        //     description: "官方授权小说有声书，👑标记表示官方认证作品",
        //     details: "在该有声书中担任女主角配音工作，官方授权改编作品。",
        //     link: "https://example.com/hy",
        //     linkText: "试听链接"
        // },
        // {
        //     year: 2018, // Estimated
        //     type: "audiobook",
        //     typeName: "有声书",
        //     title: "《惊蛰》",
        //     image: "./audiobooks/jz.jpg", // Placeholder path
        //     role: "女主",
        //     description: "悬疑题材小说有声书",
        //     details: "悬疑题材小说改编的有声书，担任女主角配音。",
        //     link: "https://example.com/jz",
        //     linkText: "试听链接"
        // },
        // {
        //     year: 2018, // Estimated
        //     type: "audiobook",
        //     typeName: "有声书",
        //     title: "《天才玩偶》",
        //     image: "./audiobooks/tcwo.jpg", // Placeholder path
        //     role: "配音",
        //     description: "科幻题材小说有声书",
        //     details: "科幻题材小说改编的有声书，参与角色配音工作。",
        //     link: "https://example.com/tcwo",
        //     linkText: "试听链接"
        // },
        // {
        //     year: 2017, // Estimated
        //     type: "audiobook",
        //     typeName: "有声书",
        //     title: "《隐匿者》",
        //     image: "./audiobooks/ynz.jpg", // Placeholder path
        //     role: "配音",
        //     description: "悬疑题材小说有声书",
        //     details: "悬疑题材小说改编的有声书，参与角色配音工作。",
        //     link: "https://example.com/ynz",
        //     linkText: "试听链接"
        // }
    ]
};