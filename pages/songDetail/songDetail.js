// pages/songDetail/songDetail.js
import request from "../../utils/request";
import PubSub from "pubsub-js";
import moment from "moment";
const appInstance =  getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,
        songDetail: [],
        song: {},
        musicId: '',
        musicLink: '',
        currentTime: '00:00', // 初始时间
        durationTime: '00:00', // 总时间
        currentWidth: 0, // 实时更新进度条的长度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // options 接受路由跳转的query参数
        let musicId = options.musicId
        this.getSongDetail(musicId)
        this.setData({
            musicId: musicId
        })

        // 判断当前页面音乐是否在播放
        if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
            this.setData({
                isPlay: true
            })
        }

        this.backgroundAudioManager = wx.getBackgroundAudioManager()
        // console.log(this.backgroundAudioManager)
        this.backgroundAudioManager.onPlay(()=> {
            this.changePlayState(true)
            appInstance.globalData.musicId = musicId
        })
        this.backgroundAudioManager.onPause(()=> {
            this.changePlayState(false)
        })
        this.backgroundAudioManager.onStop(()=> {
            this.changePlayState(false)
        })
        this.backgroundAudioManager.onTimeUpdate(() => {
            // 格式化实时的播放时长
            let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
            let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration *450
            this.setData({
                currentTime:currentTime,
                currentWidth
            })
        })
        // 监听音乐结束事件
        this.backgroundAudioManager.onEnded(() => {
            // 自动切换下一首，并自动播放
            // PubSub.publish('switchType', 'next')
            // 发布消息给 recommendSong 页面
            PubSub.publish('switchType','next')
            PubSub.subscribe('musicId',(msg, musicId) => {
                // console.log(msg,musicId)
                this.backgroundAudioManager.stop()
                // 获取音乐详情信息
                this.getSongDetail(musicId)
                // 自动播放
                this.musicControl(true,musicId)
                // 取消订阅
                PubSub.unsubscribe('musicId')
            })

            // 播放长度还原为0
            this.setData({
                currentWidth: 0,
                currentTime: '00:00'
            })
        })
    },
    // 修改播放状态的功能函数
    changePlayState(isPlay) {
        this.setData({
            isPlay
        })
        // 修改全局音乐播放的状态
        appInstance.globalData.isMusicPlay = isPlay
    },
    // 播放/暂停的回调
    handleMusicPlay() {
        let isPlay = !this.data.isPlay
        // this.setData({isPlay})
        let {musicId, musicLink} = this.data
        this.musicControl(isPlay,musicId, musicLink)
    },
    // 控制音乐播放暂停的功能回调函数
    async musicControl(isPlay, musicId, musicLink) {
        // let backgroundAudioManager = wx.getBackgroundAudioManager()
        if(isPlay) { // 音乐播放
            // 获取歌曲播放地址
            if(!musicLink) {
                const res = await request('/song/url', {id:musicId})
                musicLink = res.data[0].url
            }
            this.setData({
                musicLink
            })
            // console.log(res)
            // 创建控制音乐播放器的实例
            this.backgroundAudioManager.src = musicLink
            this.backgroundAudioManager.title = this.data.song.name

        } else { // 音乐暂停
            this.backgroundAudioManager.pause()
        }
    },
    // 获取歌曲信息
    async getSongDetail(id) {
        let res = await request("/song/detail",{ids:id})
        // console.log(res)
        let durationTime = moment(res.songs[0].dt).format('mm:ss')
        this.setData({
            song: res.songs[0],
            durationTime
        })
        // 动态修改窗口标题
        wx.setNavigationBarTitle({
            title: this.data.song.name
        })
    },
    // 切换歌曲
    handleSwitch(e) {
        let type = e.currentTarget.id
        PubSub.subscribe('musicId',(msg, musicId) => {
            // console.log(msg,musicId)
            this.backgroundAudioManager.stop()
            // 获取音乐详情信息
            this.getSongDetail(musicId)
            // 自动播放
            this.musicControl(true,musicId)
            // 取消订阅
            PubSub.unsubscribe('musicId')
        })
        // 发布消息给 recommendSong 页面
        PubSub.publish('switchType',type)
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
    onShareAppMessage() {

    }
})
