// cityPicker.js
const AreaData = require("../../lib/Area.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyer_name: '',                                                 //收件人
    buyer_phone: '',                                                //收件人电话
    detail_address: '',                                              //详情地址
    addressName: '',                                                //所在地区
    isdefault: false,                                               //控制设置默认地址
    provId: '',                                                     //省ID
    cityId: '',                                                     //市ID
    areaId: '',                                                     //区ID
    showPickerView: false,                                          //控制省市区三级联动显隐
    value: [0, 0, 0],
    tempValue: [0, 0, 0],
    provArr: AreaData.result,                                       //省数组
    cityArr: AreaData.result[0].city,                               //市数组
    areaArr: AreaData.result[0].city[0].area,                       //区数组
    type: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.navbartitle,
    });
  
    // options.type == 0     从添加新地址按钮进入
    // options.type == 1     点击地址列表item进入
    let that = this;
    that.setData({
      type: options.type
    });
    console.log('options', options);
    if (options.type == 1) {
      let addressData = JSON.parse(options.addressData);
      that.saveAddressData(addressData);
    }

  },

  saveAddressData(addressData) {
    let ProvArr = AreaData.result;
    let valArr = [];
    // 遍历省数组
    for (let i = 0; i < ProvArr.length; i++) {
      // console.log(ProvArr[i].id); 
      // 找到省对应的id
      if (ProvArr[i].id == addressData.province) {
        //提取对应省名
        let provName = ProvArr[i].name;
        // 提取对应省名在数组中对应的id
        valArr.push(i);
        // 提取对应省名下的城市数组
        let cityArr = ProvArr[i].city;
        console.log('provName:', provName);
        console.log('valArr:', valArr);
        // 遍历对应省名下的城市数组
        for (let j = 0; j < ProvArr[i].city.length; j++) {
          //console.log("cityId", ProvArr[i].city[j].id);
          // 找到市对应的id
          if (ProvArr[i].city[j].id == addressData.city) {
            // 提取对应市名
            let cityName = ProvArr[i].city[j].name;
            // 提取对应市名在数组中对应的id
            valArr.push(j);
            // 提取对应市名下的区数组
            let areaArr = ProvArr[i].city[j].area;
            console.log('cityName:', cityName);
            console.log('valArr:', valArr);
            // 遍历对应市名下的区数组
            for (let k = 0; k < ProvArr[i].city[j].area.length; k++) {
              //console.log('areaId', ProvArr[i].city[j].area[k].id);
              // 找到区对应的id
              if (ProvArr[i].city[j].area[k].id == addressData.region) {
                // 提取对应区名
                let areaName = ProvArr[i].city[j].area[k].name;
                // 提取对应区名在数组中对应的id
                valArr.push(k);
                console.log('areaName:', areaName);
                console.log('valArr:', valArr);
                let addressName = provName + cityName + areaName;
                this.setData({
                  buyer_name: addressData.name,
                  buyer_phone: addressData.buyerPhone,
                  detail_address: addressData.address,
                  addressName: addressName,
                  value: valArr,
                  cityArr: cityArr,
                  areaArr: areaArr,
                  provId: addressData.province,
                  cityId: addressData.city,
                  areaId: addressData.region,
                  isdefault: addressData.isdefault == 1 ? true : false
                })
              }
            }
          }
        }

      }
    }
  },

  //收件人
  bindNameInput(event) {
    console.log('nameInput:', event);
    this.setData({ buyer_name: event.detail.value });
  },

  //手机号码
  bindPhoneNumInput(event) {
    console.log('phoneNum:', event);
    this.setData({ buyer_phone: event.detail.value });
  },

  //详细地址
  bindDetailAddress(event) {
    console.log('detail_address:', event);
    this.setData({ detail_address: event.detail.value });
  },

  //三级联动触发方法
  bindChange: function (e) {
    let val = e.detail.value
    if (val[0] != this.data.tempValue[0]) {
      val = [val[0], 0, 0]
    }
    if (val[1] != this.data.tempValue[1]) {
      val = [val[0], val[1], 0]
    }
    console.log('bindChange:', val);
    this.setData({
      tempValue: val,
      value: val,
      cityArr: AreaData.result[val[0]].city,
      areaArr: AreaData.result[val[0]].city[val[1]].area,
    })
  },

  //打开省市区三级联动
  openPickerView() {
    this.setData({ showPickerView: true });
  },
  //关闭省市区三级联动
  closePickerView() {
    this.setData({ showPickerView: false });
  },

  //省市区三级联动确定
  confirmPickerView() {
    let val = this.data.value;
    let provName = AreaData.result[val[0]].name;
    let cityName = AreaData.result[val[0]].city[val[1]].name;
    let areaName = AreaData.result[val[0]].city[val[1]].area[val[2]].name;
    let addressName = provName + cityName + areaName;
    let provId = AreaData.result[val[0]].id;
    let cityId = AreaData.result[val[0]].city[val[1]].id;
    let areaId = AreaData.result[val[0]].city[val[1]].area[val[2]].id;
    this.setData({
      addressName: addressName,
      provId: provId,
      cityId: cityId,
      areaId: areaId,
      showPickerView: false,
    })
  },


  //设为默认地址
  bindDefAddress() {
    this.setData({ isdefault: !this.data.isdefault });
  },

  //取消按钮
  bindCancelButton() {
    wx.navigateBack();
  },

  //保存按钮
  bindSaveButton() {
    let that = this;
    if (!that.data.buyer_name) {
      wx.showModal({
        title: '提示',
        content: '请填写收件人姓名',
      })
    }

    else if (!that.data.buyer_phone) {
      wx.showModal({
        title: '提示',
        content: '请填写收件人电话',
      })
    }

    else if (!that.data.provId && !that.data.cityId && !that.data.areaId) {
      wx.showModal({
        title: '提示',
        content: '请填写地址',
      })
    }
    else if (!that.data.detail_address) {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
      })
    } else {
      if(that.data.type == 0){
        console.log('请求保存接口');
      }

      if(that.data.type == 1){
        console.log('请求地址更新接口');
      }
      
      wx.navigateBack();

    }

  },
})