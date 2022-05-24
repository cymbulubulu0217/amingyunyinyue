// pages/serach/search.js
import request from "../../utils/request";
// let isSend = false //函数节流参数

Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholderContent: '', // 搜索框内容
        hotSearchList: [],
        searchContent: '',
        searchList: [],
        historyList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getPlaceholderContent()
        this.getHotSearchList()
    },
    // 获取搜索框内容
    async getPlaceholderContent() {
        let res = await request('/search/default')
        console.log(res.data.showKeyword)
        this.setData({
            placeholderContent: res.data.showKeyword
        })
    },
    // 获取热搜榜数据
    async getHotSearchList() {
        let res = await request("/search/hot/detail")
        console.log(res)
        this.setData({
            hotSearchList: res.data
        })
    },
    // 表单项内容发生的回调
    handleInputChange(e) {
        // console.log(e.detail.value)
        let searchContent = e.detail.value.trim()
        this.setData({
            searchContent
        })

        // if(isSend) {
        //     return
        // }
        // isSend = true
        // this.getSearchList()
        // //函数节流
        // setTimeout(() => {
        //     isSend = false
        // }, 300)
        // 利用防抖
        // let timer = null
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            if(searchContent) {
                this.getSearchList()
            }
        },1000)
    },
    //请求搜索模糊匹配的功能函数
    async getSearchList() {
        // 发起请求获取关键词模糊匹配数据
        let {historyList, searchContent} = this.data
        let searchListData = await request('/search', {keywords: searchContent, limit: 10})
        historyList.unshift(searchContent)
        // let historyListData = []
        // console.log(historyList)
        for(let i = 0;i<historyList;i++) {
            if(historyList[i] === null) {
                historyList.splice(i,1)
                i=i-1
            }
        }
        this.setData({
            searchList: searchListData.result.songs,
            historyList: historyList
        })

    },
    clearContent() {
        // let {searchContent} = this.data
        // searchContent = ''
        this.setData({
            searchContent: '',
            searchList: []
        })
    },
    deleteSearchHistory() {
        this.setData({
            historyList: []
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
