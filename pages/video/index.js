// pages/video/songDetail.js
import request from "../../utils/request";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList: [],
        navId: '',
        videoList: [],
        videoId: '',
        videoUpdateTime: [], // 记录视频的播放时长
        isTriggered: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getVideoGroupList()

    },
    // 获取视频导航栏的数据
    async getVideoGroupList() {
        let videoGroupListData = await request('/video/group/list') // 使用id方法获取数据的时候会将数据自动转换为 string，所以需要在下面更新数据的时候重新将其转换为 num
        let id = videoGroupListData.data[0].id
        this.setData({
            // videoGroupList: res.data.data.splice(0,14),
            videoGroupList: videoGroupListData.data.splice(0,14),
            // navId: 58100 //给 navId 设置一个初始值，使得导航栏的第一项被选中
            // 方式一
            // navId: videoGroupListData.data.data[0].id
            // 方式二
            navId: id
        })
        await this.getVideoList(id)
    },
    // 点击切换导航的 callback
    changeNav(e) {
        let navId = e.currentTarget.id
        // console.log(e.currentTarget.dataset.id)
        // let navId = e.currentTarget.dataset.id
        this.setData({
            navId: navId>>>0,
            videoList: []
        })
        wx.showLoading({
            title: '正在加载，请稍后'
        })
        this.getVideoList(this.data.navId)

    },
    // 获取视频列表数据
    async getVideoList(navId) {
        // console.log(navId)
        if(!navId) {
            return
        }
        let res =  await request('/video/group',{
            id: navId
        })
        wx.hideLoading()
        console.log(res)
        let index = 0
        let videoList = res.datas.map(item => {
            item.id = index++;
            return item
        })
        this.setData({
            videoList: videoList,
            isTriggered: false
        })

    },
    // 视频播放的回调
    handlePlay(e) {
        console.log(e.currentTarget.id)
        let vid = e.currentTarget.id
        // 判断上个实例是否存在 且 关闭
       /* 单例模式：
            1.需要船舰福哦个对象的场景下，通过一个变量接受，始终保存只有一个对象，
            2.节省内存空间
        */
        // this.vid !== vid && this.videoContext && this.videoContext.stop()
        // this.vid = vid
        // 更新data中videoId的数据
        this.setData({
            videoId: vid
        })
        // 将实例挂载到this身上
        this.videoContext = wx.createVideoContext(vid)
        // 判断当前的视频之前是否播放过，是否有播放记录，如果有，跳转至指定的播放位置
        let {videoUpdateTime} = this.data
        let videoItem = videoUpdateTime.find(item => item.vid === vid)
        if(videoItem) {
            this.videoContext.seek(videoItem.currentTime)
        } else {
            this.videoContext.play()
        }

    },
    // 监听视频播放进度的回调
    handleTimeUpdate(e) {
        // console.log(e.detail.currentTime)
        let videoTimeObj = {vid: e.currentTarget.id, currentTime: e.detail.currentTime}
        let {videoUpdateTime} = this.data
        /*思路：判断记录播放时长的 videoUpdateTime 数组中是否有当前视频的播放记录
            1.如果有，在原有的播放记录中修改播放事件为当前的播放事件
            2.如果没有，需要在数组中添加当前视频的播放对象
            */
        let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
        if(videoItem) {
            videoItem.currentTime = e.detail.currentTime
        } else {
            videoUpdateTime.push(videoTimeObj)
        }
        // 更新videoUpdateTime 的状态
        this.setData({
            videoUpdateTime
        })
    },
    handleEnded(e) {
        let {videoUpdateTime} =this.data
        videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === e.currentTarget.id),1)
        this.setData({
            videoUpdateTime
        })
    },
    // 下拉刷新事件
    handleRefresher(e) {
        this.getVideoList(this.data.navId)
    },
    // 上拉刷新
    handleTolower() {
        let newVideoList = [
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_43EABBE4BCB59BFF1EF4E9C69530B267",
                    "coverUrl": "https://p2.music.126.net/a7ffpfCKuJmCi5oXNutIhA==/109951165666711068.jpg",
                    "height": 720,
                    "width": 1280,
                    "title": "“Minecraft生活” - Minecraft原创歌曲 (TryHardNinja)",
                    "description": null,
                    "commentCount": 171,
                    "shareCount": 35,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 16698820
                        },
                        {
                            "resolution": 480,
                            "size": 28767359
                        },
                        {
                            "resolution": 720,
                            "size": 34548672
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 370000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/wGW8lozT4ZlW5c2_C-dmDw==/109951165547758057.jpg",
                        "accountStatus": 0,
                        "gender": 1,
                        "city": 370100,
                        "birthday": 1635321477699,
                        "userId": 88541691,
                        "userType": 204,
                        "nickname": "Let_life_boil",
                        "signature": "🎥[YouTube] Minecraft-MV音乐资寻/动画资寻，不定期搬运.\n☕ 📻\nMore haste less speed:)",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951165547758060,
                        "backgroundImgId": 109951165865818080,
                        "backgroundUrl": "http://p1.music.126.net/15p0DUmcpaSFiEvxs6ke2Q==/109951165865818085.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": {
                            "1": "游戏视频达人"
                        },
                        "djStatus": 10,
                        "vipType": 0,
                        "remarkName": null,
                        "backgroundImgIdStr": "109951165865818085",
                        "avatarImgIdStr": "109951165547758057"
                    },
                    "urlInfo": {
                        "id": "43EABBE4BCB59BFF1EF4E9C69530B267",
                        "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/EF1NdVfH_1841951657_shd.mp4?ts=1653138369&rid=52EDB97503300BEEA4CDE70369DEDE75&rl=3&rs=RLBQeSNSIfjSVerJuzcqUUgKvvYghJyW&sign=93753361da5f977479001344448b7322&ext=%2FJPRfcIEIEDAPxNpAVMM58cnvH%2BK2KBevwYTjfK4%2By6DA%2FTdCz06hZNDBgKaETwzqggiEW%2BN47Qehi8WEPeyGe5mXCEZQjI%2F1RATpUpkKUbzS1zUNdHLgE9d5PbH2zUEM1Gb4aiqGjoGg21nL9K0W6RC0%2FstXm6fbeSfbN45XExYlVr%2BegaT62f9FGs9FsR3vSzuGiKmA4wbH2hzY%2BCpxtA5cLWBWh6xqDPmEywWaiG%2FLJ6joyc3xbmeqZtuoYnn",
                        "size": 34548672,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 720
                    },
                    "videoGroup": [
                        {
                            "id": 9104,
                            "name": "电子",
                            "alg": null
                        },
                        {
                            "id": 4104,
                            "name": "电音",
                            "alg": null
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": null
                        },
                        {
                            "id": 14212,
                            "name": "欧美音乐",
                            "alg": null
                        },
                        {
                            "id": 23116,
                            "name": "音乐推荐",
                            "alg": null
                        },
                        {
                            "id": 15149,
                            "name": "创意音乐",
                            "alg": null
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [
                        {
                            "name": "Minecraft Is Acid",
                            "id": 32341850,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 90056,
                                    "name": "C418",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 20,
                            "st": 0,
                            "rt": null,
                            "fee": 8,
                            "v": 217,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 3159332,
                                "name": "Life Changing Moments Seem Minor in Pictures",
                                "picUrl": "http://p3.music.126.net/OayCrFF2yZwhdJQ3o3VrRw==/109951166056616869.jpg",
                                "tns": [],
                                "pic_str": "109951166056616869",
                                "pic": 109951166056616860
                            },
                            "dt": 339000,
                            "h": {
                                "br": 320001,
                                "fid": 0,
                                "size": 13562819,
                                "vd": -18934
                            },
                            "m": {
                                "br": 192001,
                                "fid": 0,
                                "size": 8137709,
                                "vd": -16297
                            },
                            "l": {
                                "br": 128001,
                                "fid": 0,
                                "size": 5425154,
                                "vd": -14560
                            },
                            "a": null,
                            "cd": "1",
                            "no": 7,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 2,
                            "s_id": 0,
                            "cp": 1416729,
                            "mv": 0,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "publishTime": 1281542400007,
                            "privilege": {
                                "id": 32341850,
                                "fee": 8,
                                "payed": 1,
                                "st": 0,
                                "pl": 999000,
                                "dl": 999000,
                                "sp": 7,
                                "cp": 1,
                                "subp": 1,
                                "cs": false,
                                "maxbr": 999000,
                                "fl": 128000,
                                "toast": false,
                                "flag": 260,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "43EABBE4BCB59BFF1EF4E9C69530B267",
                    "durationms": 182974,
                    "playTime": 51508,
                    "praisedCount": 417,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_E13BCCF7BF575D727A53BA9BCE284E10",
                    "coverUrl": "https://p2.music.126.net/jqz1d2Bavqx4BDFoem7jiA==/109951164571225973.jpg",
                    "height": 1080,
                    "width": 1920,
                    "title": "【中英】Alan Walker最新现场！由Torine演唱的Darkside",
                    "description": "【中英】Alan Walker最新现场！由Torine演唱的Darkside\n#Alan Walker##Torine##音乐现场##艾伦沃克#",
                    "commentCount": 16,
                    "shareCount": 13,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 22000911
                        },
                        {
                            "resolution": 480,
                            "size": 38401451
                        },
                        {
                            "resolution": 720,
                            "size": 56664510
                        },
                        {
                            "resolution": 1080,
                            "size": 89137132
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 330000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/e22u-og2dB_ZPOTea1KDcg==/109951167203858705.jpg",
                        "accountStatus": 0,
                        "gender": 1,
                        "city": 330300,
                        "birthday": 1081094400000,
                        "userId": 88438686,
                        "userType": 207,
                        "nickname": "泡沫肥皂BS",
                        "signature": "World of Walker 2022\nThe journey continued....",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951167203858700,
                        "backgroundImgId": 109951166619996320,
                        "backgroundUrl": "http://p1.music.126.net/OLfRNyvoQ83ZpinZJ060Rw==/109951166619996323.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": null,
                        "djStatus": 0,
                        "vipType": 0,
                        "remarkName": null,
                        "backgroundImgIdStr": "109951166619996323",
                        "avatarImgIdStr": "109951167203858705"
                    },
                    "urlInfo": {
                        "id": "E13BCCF7BF575D727A53BA9BCE284E10",
                        "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/7lYQgZ9H_2850474289_uhd.mp4?ts=1653138369&rid=52EDB97503300BEEA4CDE70369DEDE75&rl=3&rs=OEBfDStrDnKwEFfJTtrTTixfuoJLWzvs&sign=dc9ed2f4c54b3ec948653a131ef9bbf3&ext=%2FJPRfcIEIEDAPxNpAVMM58cnvH%2BK2KBevwYTjfK4%2By6DA%2FTdCz06hZNDBgKaETwzqggiEW%2BN47Qehi8WEPeyGe5mXCEZQjI%2F1RATpUpkKUbzS1zUNdHLgE9d5PbH2zUEM1Gb4aiqGjoGg21nL9K0W6RC0%2FstXm6fbeSfbN45XExYlVr%2BegaT62f9FGs9FsR3vSzuGiKmA4wbH2hzY%2BCpxtA5cLWBWh6xqDPmEywWaiEeUTelFTXfDxpVtD5iFkfC",
                        "size": 89137132,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 1080
                    },
                    "videoGroup": [
                        {
                            "id": 58100,
                            "name": "现场",
                            "alg": null
                        },
                        {
                            "id": 9136,
                            "name": "艾兰·沃克",
                            "alg": null
                        },
                        {
                            "id": 1100,
                            "name": "音乐现场",
                            "alg": null
                        },
                        {
                            "id": 9104,
                            "name": "电子",
                            "alg": null
                        },
                        {
                            "id": 4104,
                            "name": "电音",
                            "alg": null
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": null
                        },
                        {
                            "id": 15249,
                            "name": "Alan Walker",
                            "alg": null
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [
                        {
                            "name": "Darkside",
                            "id": 1296410418,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 1045123,
                                    "name": "Alan Walker",
                                    "tns": [],
                                    "alias": []
                                },
                                {
                                    "id": 12143031,
                                    "name": "Au/Ra",
                                    "tns": [],
                                    "alias": []
                                },
                                {
                                    "id": 12073571,
                                    "name": "Tomine Harket",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 100,
                            "st": 0,
                            "rt": null,
                            "fee": 8,
                            "v": 18,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 72006345,
                                "name": "Darkside",
                                "picUrl": "http://p4.music.126.net/QgA1cIpCY3DN3ov9rrYb_A==/109951165984614060.jpg",
                                "tns": [],
                                "pic_str": "109951165984614060",
                                "pic": 109951165984614060
                            },
                            "dt": 211931,
                            "h": {
                                "br": 320000,
                                "fid": 0,
                                "size": 8477301,
                                "vd": -60991
                            },
                            "m": {
                                "br": 192000,
                                "fid": 0,
                                "size": 5086398,
                                "vd": -58593
                            },
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 3390946,
                                "vd": -57250
                            },
                            "a": null,
                            "cd": "01",
                            "no": 1,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 1,
                            "s_id": 0,
                            "cp": 7001,
                            "mv": 10738268,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "publishTime": 1532620800000,
                            "privilege": {
                                "id": 1296410418,
                                "fee": 8,
                                "payed": 1,
                                "st": 0,
                                "pl": 320000,
                                "dl": 320000,
                                "sp": 7,
                                "cp": 1,
                                "subp": 1,
                                "cs": false,
                                "maxbr": 320000,
                                "fl": 128000,
                                "toast": false,
                                "flag": 4,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "E13BCCF7BF575D727A53BA9BCE284E10",
                    "durationms": 195836,
                    "playTime": 26917,
                    "praisedCount": 118,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_EF6FA6BF4DAA06F6092EC58D1BBFEE54",
                    "coverUrl": "https://p2.music.126.net/SnP8PGMgz96z4byAO9jU8Q==/109951163572747184.jpg",
                    "height": 720,
                    "width": 1280,
                    "title": "OMFG《Hello》还能这么玩？这是爱因斯坦搭建的设备吧！",
                    "description": "OMFG《Hello》还能这么玩？这是爱因斯坦搭建的设备吧！",
                    "commentCount": 2339,
                    "shareCount": 5919,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 26178107
                        },
                        {
                            "resolution": 480,
                            "size": 37372216
                        },
                        {
                            "resolution": 720,
                            "size": 59503293
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 1000000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/1vXZspuEC2GmhQfqqZQb6g==/109951166006968184.jpg",
                        "accountStatus": 0,
                        "gender": 0,
                        "city": 1004400,
                        "birthday": 960566400000,
                        "userId": 18607052,
                        "userType": 204,
                        "nickname": "YouTube",
                        "signature": "音乐视频自媒体 Vx：307752336",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951166006968200,
                        "backgroundImgId": 109951166584722620,
                        "backgroundUrl": "http://p1.music.126.net/tSYDGbYWtl_TQ1zW8RxJMw==/109951166584722618.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": {
                            "1": "泛生活视频达人",
                            "2": "生活图文达人"
                        },
                        "djStatus": 10,
                        "vipType": 11,
                        "remarkName": null,
                        "backgroundImgIdStr": "109951166584722618",
                        "avatarImgIdStr": "109951166006968184"
                    },
                    "urlInfo": {
                        "id": "EF6FA6BF4DAA06F6092EC58D1BBFEE54",
                        "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/CdWF0MqU_73612670_shd.mp4?ts=1653138369&rid=52EDB97503300BEEA4CDE70369DEDE75&rl=3&rs=TcxBWmYshaHOkGgMVHfzEwPlduLtnRju&sign=107efca5ce3d514384e405ecc92be263&ext=%2FJPRfcIEIEDAPxNpAVMM58cnvH%2BK2KBevwYTjfK4%2By6DA%2FTdCz06hZNDBgKaETwzqggiEW%2BN47Qehi8WEPeyGe5mXCEZQjI%2F1RATpUpkKUbzS1zUNdHLgE9d5PbH2zUEM1Gb4aiqGjoGg21nL9K0W6RC0%2FstXm6fbeSfbN45XExYlVr%2BegaT62f9FGs9FsR3vSzuGiKmA4wbH2hzY%2BCpxtA5cLWBWh6xqDPmEywWaiG%2FLJ6joyc3xbmeqZtuoYnn",
                        "size": 59503293,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 720
                    },
                    "videoGroup": [
                        {
                            "id": 9104,
                            "name": "电子",
                            "alg": null
                        },
                        {
                            "id": 4104,
                            "name": "电音",
                            "alg": null
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": null
                        },
                        {
                            "id": 23116,
                            "name": "音乐推荐",
                            "alg": null
                        },
                        {
                            "id": 13164,
                            "name": "快乐",
                            "alg": null
                        },
                        {
                            "id": 15229,
                            "name": "英语",
                            "alg": null
                        },
                        {
                            "id": 15149,
                            "name": "创意音乐",
                            "alg": null
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [
                        {
                            "name": "Hello",
                            "id": 33211676,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 381949,
                                    "name": "OMFG",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 100,
                            "st": 0,
                            "rt": null,
                            "fee": 8,
                            "v": 63,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 3190201,
                                "name": "Hello",
                                "picUrl": "http://p4.music.126.net/sylTociq8lh0QP7BuXRLGQ==/109951164852190706.jpg",
                                "tns": [],
                                "pic_str": "109951164852190706",
                                "pic": 109951164852190700
                            },
                            "dt": 226307,
                            "h": {
                                "br": 320000,
                                "fid": 0,
                                "size": 9055129,
                                "vd": -72865
                            },
                            "m": {
                                "br": 192000,
                                "fid": 0,
                                "size": 5433095,
                                "vd": -70531
                            },
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 3622078,
                                "vd": -69149
                            },
                            "a": null,
                            "cd": "1",
                            "no": 1,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 0,
                            "s_id": 0,
                            "cp": 1416729,
                            "mv": 5309845,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "publishTime": 1416672000000,
                            "privilege": {
                                "id": 33211676,
                                "fee": 8,
                                "payed": 1,
                                "st": 0,
                                "pl": 999000,
                                "dl": 999000,
                                "sp": 7,
                                "cp": 1,
                                "subp": 1,
                                "cs": false,
                                "maxbr": 999000,
                                "fl": 128000,
                                "toast": false,
                                "flag": 260,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "EF6FA6BF4DAA06F6092EC58D1BBFEE54",
                    "durationms": 224095,
                    "playTime": 2005863,
                    "praisedCount": 20188,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_6A545F9DF71D5C6D1AE6AD2AF34E0167",
                    "coverUrl": "https://p2.music.126.net/48EC7pYe4_UXSuV65CZP1Q==/109951164843918228.jpg",
                    "height": 1080,
                    "width": 1920,
                    "title": "最近大火的《Ferrari》太好听了！绝处逢生的感觉很上头",
                    "description": "最近火起来的《Ferrari》太好听了！绝处逢生的感觉，十分上头！\n@云音乐视频酱",
                    "commentCount": 16,
                    "shareCount": 13,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 18655966
                        },
                        {
                            "resolution": 480,
                            "size": 31107278
                        },
                        {
                            "resolution": 720,
                            "size": 48845486
                        },
                        {
                            "resolution": 1080,
                            "size": 78386367
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 370000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/HNHNC-cWLsnhdK4A6BMmag==/109951166651496410.jpg",
                        "accountStatus": 0,
                        "gender": 1,
                        "city": 370800,
                        "birthday": 790508917446,
                        "userId": 1742136054,
                        "userType": 204,
                        "nickname": "咖啡影音",
                        "signature": "喧嚣的生活需要音乐洗涤不安的灵魂",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951166651496420,
                        "backgroundImgId": 109951162868128400,
                        "backgroundUrl": "http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": {
                            "1": "音乐视频达人"
                        },
                        "djStatus": 10,
                        "vipType": 11,
                        "remarkName": null,
                        "backgroundImgIdStr": "109951162868128395",
                        "avatarImgIdStr": "109951166651496410"
                    },
                    "urlInfo": {
                        "id": "6A545F9DF71D5C6D1AE6AD2AF34E0167",
                        "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/td0LkjpY_2950611997_uhd.mp4?ts=1653138369&rid=52EDB97503300BEEA4CDE70369DEDE75&rl=3&rs=QJMNwLGVqnPQLufkQDArzqAqbTyElZGj&sign=37b3ef1a5c835ae002f70c9eeed9773b&ext=%2FJPRfcIEIEDAPxNpAVMM58cnvH%2BK2KBevwYTjfK4%2By6DA%2FTdCz06hZNDBgKaETwzqggiEW%2BN47Qehi8WEPeyGe5mXCEZQjI%2F1RATpUpkKUbzS1zUNdHLgE9d5PbH2zUEM1Gb4aiqGjoGg21nL9K0W6RC0%2FstXm6fbeSfbN45XExYlVr%2BegaT62f9FGs9FsR3vSzuGiKmA4wbH2hzY%2BCpxtA5cLWBWh6xqDPmEywWaiEeUTelFTXfDxpVtD5iFkfC",
                        "size": 78386367,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 1080
                    },
                    "videoGroup": [
                        {
                            "id": 9104,
                            "name": "电子",
                            "alg": null
                        },
                        {
                            "id": 4104,
                            "name": "电音",
                            "alg": null
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": null
                        },
                        {
                            "id": 14212,
                            "name": "欧美音乐",
                            "alg": null
                        },
                        {
                            "id": 23116,
                            "name": "音乐推荐",
                            "alg": null
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [
                        {
                            "name": "Ferrari",
                            "id": 550936829,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 336466,
                                    "name": "Bebe Rexha",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 100,
                            "st": 0,
                            "rt": null,
                            "fee": 1,
                            "v": 10,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 39763861,
                                "name": "Expectations",
                                "picUrl": "http://p3.music.126.net/J5TqXUNo7vCFF9m-I85AIA==/109951163848879403.jpg",
                                "tns": [],
                                "pic_str": "109951163848879403",
                                "pic": 109951163848879410
                            },
                            "dt": 212584,
                            "h": {
                                "br": 320000,
                                "fid": 0,
                                "size": 8504468,
                                "vd": -23000
                            },
                            "m": {
                                "br": 192000,
                                "fid": 0,
                                "size": 5102698,
                                "vd": -20400
                            },
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 3401813,
                                "vd": -18800
                            },
                            "a": null,
                            "cd": "1",
                            "no": 1,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 1,
                            "s_id": 0,
                            "cp": 7002,
                            "mv": 5888082,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "publishTime": 1523548800000,
                            "privilege": {
                                "id": 550936829,
                                "fee": 1,
                                "payed": 1,
                                "st": 0,
                                "pl": 320000,
                                "dl": 320000,
                                "sp": 7,
                                "cp": 1,
                                "subp": 1,
                                "cs": false,
                                "maxbr": 320000,
                                "fl": 0,
                                "toast": false,
                                "flag": 260,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "6A545F9DF71D5C6D1AE6AD2AF34E0167",
                    "durationms": 200917,
                    "playTime": 116463,
                    "praisedCount": 521,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_473202CA482CE12BCD98A6C8B65DAA37",
                    "coverUrl": "https://p2.music.126.net/CiHqPJErJmz7nqRz0_UzoQ==/109951164189628026.jpg",
                    "height": 1080,
                    "width": 1920,
                    "title": "Samet Yıldırım & Tayfur Avcı - Soldier",
                    "description": "\nSözer Sepetci - Bangerz ( Oriental Mix )",
                    "commentCount": 2,
                    "shareCount": 40,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 16032770
                        },
                        {
                            "resolution": 480,
                            "size": 30249859
                        },
                        {
                            "resolution": 720,
                            "size": 39800764
                        },
                        {
                            "resolution": 1080,
                            "size": 71747095
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 650000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/r7Cr1_BxiiultCe20wwEvw==/109951167347226391.jpg",
                        "accountStatus": 0,
                        "gender": 1,
                        "city": 653000,
                        "birthday": 891792000000,
                        "userId": 111259490,
                        "userType": 204,
                        "nickname": "uRRa",
                        "signature": "Aşıklar ölmez\nÖlen hayvandir🪐",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951167347226380,
                        "backgroundImgId": 109951164996625360,
                        "backgroundUrl": "http://p1.music.126.net/2iHgy7mewFmPCrhG1ErQqA==/109951164996625356.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": {
                            "1": "影视视频达人"
                        },
                        "djStatus": 10,
                        "vipType": 11,
                        "remarkName": null,
                        "backgroundImgIdStr": "109951164996625356",
                        "avatarImgIdStr": "109951167347226391"
                    },
                    "urlInfo": {
                        "id": "473202CA482CE12BCD98A6C8B65DAA37",
                        "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/Bz99IY2Z_2468737028_uhd.mp4?ts=1653138369&rid=52EDB97503300BEEA4CDE70369DEDE75&rl=3&rs=zCEyDLkcDsuIUcLlaQZCuLLmxxcDjqNY&sign=3c23ab789b0f8999dd47dc1295246cea&ext=%2FJPRfcIEIEDAPxNpAVMM58cnvH%2BK2KBevwYTjfK4%2By6DA%2FTdCz06hZNDBgKaETwzqggiEW%2BN47Qehi8WEPeyGe5mXCEZQjI%2F1RATpUpkKUbzS1zUNdHLgE9d5PbH2zUEM1Gb4aiqGjoGg21nL9K0W6RC0%2FstXm6fbeSfbN45XExYlVr%2BegaT62f9FGs9FsR3vSzuGiKmA4wbH2hzY%2BCpxtA5cLWBWh6xqDPmEywWaiG%2FLJ6joyc3xbmeqZtuoYnn",
                        "size": 71747095,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 1080
                    },
                    "videoGroup": [
                        {
                            "id": 1105,
                            "name": "最佳饭制",
                            "alg": null
                        },
                        {
                            "id": 9104,
                            "name": "电子",
                            "alg": null
                        },
                        {
                            "id": 4104,
                            "name": "电音",
                            "alg": null
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": null
                        },
                        {
                            "id": 25137,
                            "name": "音乐资讯",
                            "alg": null
                        },
                        {
                            "id": 14212,
                            "name": "欧美音乐",
                            "alg": null
                        },
                        {
                            "id": 74120,
                            "name": "鬼畜",
                            "alg": null
                        },
                        {
                            "id": 15241,
                            "name": "饭制",
                            "alg": null
                        },
                        {
                            "id": 23116,
                            "name": "音乐推荐",
                            "alg": null
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": [
                        102
                    ],
                    "relateSong": [
                        {
                            "name": "Soldier",
                            "id": 1379495902,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 32736931,
                                    "name": "Samet Yıldırım",
                                    "tns": [],
                                    "alias": []
                                },
                                {
                                    "id": 0,
                                    "name": "Tayfur Avcı",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 20,
                            "st": 0,
                            "rt": "",
                            "fee": 0,
                            "v": 3,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 80540160,
                                "name": "Soldier",
                                "picUrl": "http://p4.music.126.net/9uoVxX4tRIJ8impemLKuHg==/109951164231969538.jpg",
                                "tns": [],
                                "pic_str": "109951164231969538",
                                "pic": 109951164231969540
                            },
                            "dt": 220499,
                            "h": null,
                            "m": null,
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 3528873,
                                "vd": -31844
                            },
                            "a": null,
                            "cd": "01",
                            "no": 1,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 0,
                            "s_id": 0,
                            "cp": 0,
                            "mv": 0,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "publishTime": 0,
                            "privilege": {
                                "id": 1379495902,
                                "fee": 0,
                                "payed": 0,
                                "st": 0,
                                "pl": 128000,
                                "dl": 128000,
                                "sp": 7,
                                "cp": 1,
                                "subp": 1,
                                "cs": false,
                                "maxbr": 128000,
                                "fl": 128000,
                                "toast": false,
                                "flag": 128,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "473202CA482CE12BCD98A6C8B65DAA37",
                    "durationms": 220520,
                    "playTime": 6202,
                    "praisedCount": 36,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_5DA5B896F72FD0D6A643E723D77DA4C6",
                    "coverUrl": "https://p2.music.126.net/vZy587_W-oz2PoGiackvmQ==/109951163766420173.jpg",
                    "height": 720,
                    "width": 1632,
                    "title": "Furkan Soysal ft Sözer Sepetci - Low Station",
                    "description": "Furkan Soysal ft Sözer Sepetci - Low Station",
                    "commentCount": 10,
                    "shareCount": 499,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 18954656
                        },
                        {
                            "resolution": 480,
                            "size": 31939144
                        },
                        {
                            "resolution": 720,
                            "size": 39401539
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 650000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/r7Cr1_BxiiultCe20wwEvw==/109951167347226391.jpg",
                        "accountStatus": 0,
                        "gender": 1,
                        "city": 653000,
                        "birthday": 891792000000,
                        "userId": 111259490,
                        "userType": 204,
                        "nickname": "uRRa",
                        "signature": "Aşıklar ölmez\nÖlen hayvandir🪐",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951167347226380,
                        "backgroundImgId": 109951164996625360,
                        "backgroundUrl": "http://p1.music.126.net/2iHgy7mewFmPCrhG1ErQqA==/109951164996625356.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": {
                            "1": "影视视频达人"
                        },
                        "djStatus": 10,
                        "vipType": 11,
                        "remarkName": null,
                        "backgroundImgIdStr": "109951164996625356",
                        "avatarImgIdStr": "109951167347226391"
                    },
                    "urlInfo": {
                        "id": "5DA5B896F72FD0D6A643E723D77DA4C6",
                        "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/OaAJeIQj_2230234657_shd.mp4?ts=1653138369&rid=52EDB97503300BEEA4CDE70369DEDE75&rl=3&rs=UMaQjXyCAvhbMgaiZurzyROwyDpgwTGe&sign=e8a9abd4b460674cbc972390b3138f95&ext=%2FJPRfcIEIEDAPxNpAVMM58cnvH%2BK2KBevwYTjfK4%2By6DA%2FTdCz06hZNDBgKaETwzqggiEW%2BN47Qehi8WEPeyGe5mXCEZQjI%2F1RATpUpkKUbzS1zUNdHLgE9d5PbH2zUEM1Gb4aiqGjoGg21nL9K0W6RC0%2FstXm6fbeSfbN45XExYlVr%2BegaT62f9FGs9FsR3vSzuGiKmA4wbH2hzY%2BCpxtA5cLWBWh6xqDPmEywWaiG%2FLJ6joyc3xbmeqZtuoYnn",
                        "size": 39401539,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 720
                    },
                    "videoGroup": [
                        {
                            "id": 1000,
                            "name": "MV",
                            "alg": null
                        },
                        {
                            "id": 9104,
                            "name": "电子",
                            "alg": null
                        },
                        {
                            "id": 4104,
                            "name": "电音",
                            "alg": null
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": null
                        },
                        {
                            "id": 3102,
                            "name": "二次元",
                            "alg": null
                        },
                        {
                            "id": 14176,
                            "name": "体育",
                            "alg": null
                        },
                        {
                            "id": 14212,
                            "name": "欧美音乐",
                            "alg": null
                        },
                        {
                            "id": 23116,
                            "name": "音乐推荐",
                            "alg": null
                        },
                        {
                            "id": 72116,
                            "name": "短片",
                            "alg": null
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "5DA5B896F72FD0D6A643E723D77DA4C6",
                    "durationms": 184853,
                    "playTime": 97703,
                    "praisedCount": 336,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_8AC5C69C3C4CD1D80B5D2217C82423DA",
                    "coverUrl": "https://p2.music.126.net/1LjuW2BWYPoi9aTPg2gwsw==/109951164551395425.jpg",
                    "height": 360,
                    "width": 640,
                    "title": "泳池小姐姐火了，成了渣男统一屏保，网友：这BGM太好听了",
                    "description": "泳池小姐姐火了，成了渣男统一屏保，网友：这BGM太好听了",
                    "commentCount": 249,
                    "shareCount": 133,
                    "resolutions": [
                        {
                            "resolution": 720,
                            "size": 29456028
                        },
                        {
                            "resolution": 480,
                            "size": 19244225
                        },
                        {
                            "resolution": 240,
                            "size": 11699001
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 440000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/1FIup24CxtQQu4BAukvo9w==/109951163310275691.jpg",
                        "accountStatus": 0,
                        "gender": 0,
                        "city": 440300,
                        "birthday": 759081600000,
                        "userId": 329924712,
                        "userType": 204,
                        "nickname": "mimo音视",
                        "signature": "感谢在音乐的世界有你有我还有他",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951163310275700,
                        "backgroundImgId": 2002210674180202,
                        "backgroundUrl": "http://p1.music.126.net/pmHS4fcQtcNEGewNb5HRhg==/2002210674180202.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": {
                            "1": "音乐原创视频达人"
                        },
                        "djStatus": 0,
                        "vipType": 0,
                        "remarkName": null,
                        "backgroundImgIdStr": "2002210674180202",
                        "avatarImgIdStr": "109951163310275691"
                    },
                    "urlInfo": {
                        "id": "8AC5C69C3C4CD1D80B5D2217C82423DA",
                        "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/lyT852mr_2839509310_shd.mp4?ts=1653138369&rid=52EDB97503300BEEA4CDE70369DEDE75&rl=3&rs=VODnWmUmhKWUTntlANSZQQquStgtXdRb&sign=33aa8f3ec684df8d3b4cc77c6b1c51f1&ext=%2FJPRfcIEIEDAPxNpAVMM58cnvH%2BK2KBevwYTjfK4%2By6DA%2FTdCz06hZNDBgKaETwzqggiEW%2BN47Qehi8WEPeyGe5mXCEZQjI%2F1RATpUpkKUbzS1zUNdHLgE9d5PbH2zUEM1Gb4aiqGjoGg21nL9K0W6RC0%2FstXm6fbeSfbN45XExYlVr%2BegaT62f9FGs9FsR3vSzuGiKmA4wbH2hzY%2BCpxtA5cLWBWh6xqDPmEywWaiG%2FLJ6joyc3xbmeqZtuoYnn",
                        "size": 29456028,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 720
                    },
                    "videoGroup": [
                        {
                            "id": 1105,
                            "name": "最佳饭制",
                            "alg": null
                        },
                        {
                            "id": 9104,
                            "name": "电子",
                            "alg": null
                        },
                        {
                            "id": 4104,
                            "name": "电音",
                            "alg": null
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": null
                        },
                        {
                            "id": 15241,
                            "name": "饭制",
                            "alg": null
                        },
                        {
                            "id": 23116,
                            "name": "音乐推荐",
                            "alg": null
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "8AC5C69C3C4CD1D80B5D2217C82423DA",
                    "durationms": 177216,
                    "playTime": 648697,
                    "praisedCount": 2414,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_A24C8DF6283CD4356D86F92652989573",
                    "coverUrl": "https://p2.music.126.net/ixCc5NdWsaMnXBhi0ZENpg==/109951165050596015.jpg",
                    "height": 720,
                    "width": 1694,
                    "title": "2018 Destr0yer 作曲_削除(sakuzyo) 演唱_Nikki Simmons",
                    "description": "",
                    "commentCount": 86,
                    "shareCount": 76,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 16244790
                        },
                        {
                            "resolution": 480,
                            "size": 25628976
                        },
                        {
                            "resolution": 720,
                            "size": 30046804
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 420000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/oEuvgZJXIFHsa6rOgsJDfA==/109951165711524083.jpg",
                        "accountStatus": 0,
                        "gender": 2,
                        "city": 420100,
                        "birthday": 1018627200000,
                        "userId": 1617779867,
                        "userType": 0,
                        "nickname": "F-Forristsis_as_霜落",
                        "signature": "有点冷呢，来杯咖啡？",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951165711524080,
                        "backgroundImgId": 109951165711522620,
                        "backgroundUrl": "http://p1.music.126.net/dC5-99ELOWUNVUtPpY6Hzg==/109951165711522616.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": null,
                        "djStatus": 0,
                        "vipType": 0,
                        "remarkName": null,
                        "backgroundImgIdStr": "109951165711522616",
                        "avatarImgIdStr": "109951165711524083"
                    },
                    "urlInfo": {
                        "id": "A24C8DF6283CD4356D86F92652989573",
                        "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/wQ83dPLE_3025218398_shd.mp4?ts=1653138369&rid=52EDB97503300BEEA4CDE70369DEDE75&rl=3&rs=TDyAwFbAwGsyzvZIqizxEaHnUoMevrrb&sign=e354f76fb39cda4d44ced97e8cd1f0e6&ext=%2FJPRfcIEIEDAPxNpAVMM58cnvH%2BK2KBevwYTjfK4%2By6DA%2FTdCz06hZNDBgKaETwzqggiEW%2BN47Qehi8WEPeyGe5mXCEZQjI%2F1RATpUpkKUbzS1zUNdHLgE9d5PbH2zUEM1Gb4aiqGjoGg21nL9K0W6RC0%2FstXm6fbeSfbN45XExYlVr%2BegaT62f9FGs9FsR3vSzuGiKmA4wbH2hzY%2BCpxtA5cLWBWh6xqDPmEywWaiEeUTelFTXfDxpVtD5iFkfC",
                        "size": 30046804,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 720
                    },
                    "videoGroup": [
                        {
                            "id": 1105,
                            "name": "最佳饭制",
                            "alg": null
                        },
                        {
                            "id": 9104,
                            "name": "电子",
                            "alg": null
                        },
                        {
                            "id": 4104,
                            "name": "电音",
                            "alg": null
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": null
                        },
                        {
                            "id": 14212,
                            "name": "欧美音乐",
                            "alg": null
                        },
                        {
                            "id": 15241,
                            "name": "饭制",
                            "alg": null
                        },
                        {
                            "id": 23116,
                            "name": "音乐推荐",
                            "alg": null
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [
                        {
                            "name": "Destr0yer",
                            "id": 1403449766,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 12073277,
                                    "name": "削除",
                                    "tns": [],
                                    "alias": []
                                },
                                {
                                    "id": 29785818,
                                    "name": "Nikki Simmons",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 90,
                            "st": 0,
                            "rt": "",
                            "fee": 0,
                            "v": 8,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 83327894,
                                "name": "Destr0yer",
                                "picUrl": "http://p4.music.126.net/3jE-6EXSL3wLp3hVURfCyw==/109951164487140323.jpg",
                                "tns": [],
                                "pic_str": "109951164487140323",
                                "pic": 109951164487140320
                            },
                            "dt": 180741,
                            "h": null,
                            "m": null,
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 2892321,
                                "vd": -64556
                            },
                            "a": null,
                            "cd": "01",
                            "no": 0,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 0,
                            "s_id": 0,
                            "cp": 0,
                            "mv": 14299953,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "publishTime": 0,
                            "privilege": {
                                "id": 1403449766,
                                "fee": 0,
                                "payed": 0,
                                "st": 0,
                                "pl": 128000,
                                "dl": 128000,
                                "sp": 7,
                                "cp": 1,
                                "subp": 1,
                                "cs": false,
                                "maxbr": 128000,
                                "fl": 128000,
                                "toast": false,
                                "flag": 128,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "A24C8DF6283CD4356D86F92652989573",
                    "durationms": 183329,
                    "playTime": 59387,
                    "praisedCount": 1022,
                    "praised": false,
                    "subscribed": false
                }
            }
        ]
        let videoList = this.data.videoList
        videoList.push(...newVideoList)
        this.setData({
            videoList
        })
    },
    toSearch() {
        wx.navigateTo({
            url: "../../pages/search/search"
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage({from}) {
        console.log(from)
        if(from === 'button') {
            return {
                title: '来自button的转发',
                page: 'pages/video/video',
                imageUrl: '/static/images/nvsheng.jpg'
            }
        } else {
            return {
                title: '来自页面的转发',
                page: 'pages/video/video',
                imageUrl: '/static/images/nvsheng.jpg'
            }
        }
    }
})
