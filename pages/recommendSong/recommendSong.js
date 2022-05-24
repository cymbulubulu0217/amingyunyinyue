// pages/recommendSong/songDetail.js
import request from "../../utils/request";
import PubSub from 'pubsub-js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: '',  // 天
        month: '', // 月
        recommendSongList: [],
        index: 0 // 点击音乐的下标
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 判断用户是否登录
        let userInfo = wx.getStorageSync('userInfo')
        if(!userInfo) {
            wx.showToast({
                title: '请先登录',
                icon: 'none',
                success:() =>{
                    wx.reLaunch({
                        url: 'pages/login/login'
                    })
                }
            })
        }
        this.setData({
            day: new Date().getDay(),
            month: new Date().getMonth() +1
        })
        this.getRecommendSongList()

        // 订阅来自songDateil的发布消息
        PubSub.subscribe('switchType', (msg, type) => {
            let {recommendSongList, index} = this.data
            if(type === 'pre') {  // 上一首
                (index === 0) && (index = recommendSongList.length)
                index -=1
            } else { // 下一首
                (index === recommendSongList.length-1) && (index = -1)
                index += 1
            }
            this.setData({index})
            let musicId = recommendSongList[index].id
            PubSub.publish('musicId', musicId)
        })
    },
    async getRecommendSongList() {
        let res = await request("/recommend/songs")
        // console.log(res)
        this.setData({
            recommendSongList: res.recommend
        })
    },
    // 跳转到songDetail页面
    toSongDetail(e) {
      let {song, index} = e.currentTarget.dataset
      this.setData({index})
      wx.navigateTo({
          // url: "../../pages/songDetail/songDetail?song=" + JSON.stringify(song)
          url: "../../pages/songDetail/songDetail?musicId=" + song.id
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
    onShareAppMessage() {

    }
})
