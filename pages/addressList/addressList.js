// addressList.js
let addressData = [
  {
    address: "测试1",
    addressdDetail: "北京 北京市 东城区测试1",
    buyerPhone: "13111111111",
    city: "36",
    isdefault: 1,
    name: "测试1",
    province: "1",
    region: "37"
  },
  {
    address: "测试2",
    addressdDetail: "北京 北京市 西城区测试2",
    buyerPhone: "13122222222",
    city: "36",
    isdefault: 2,
    name: "测试2",
    province: "1",
    region: "38"
  }
];


Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 地址列表的初始数据
     */
    addressList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    // 模仿网络请求
    that.fetchAddressList();
  },

  //请求地址列表
  fetchAddressList() {
    setTimeout(res => {
      wx.hideLoading();
      this.setData({ addressList: addressData });
    }, 500);

  },




  //点击地址列表跳转到 添加地址
  pushToEdit(event) {
    let addressData = JSON.stringify(event.currentTarget.dataset.addressdata);
    wx.navigateTo({
      url: '../cityPicker/cityPicker?type=1&addressData=' + addressData,
    })
  },

  //底部‘添加新地址’按钮方法
  bindAddressAdd() {
    wx.navigateTo({
      url: '../cityPicker/cityPicker?type=0',
    })
  },
})