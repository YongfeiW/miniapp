// shop/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      sellerStates:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  loadSeller: function () {
    var query = new Bmob.Query('Seller');
    query.ascending('dayinji_num');
    query.limit(Number.MAX_VALUE);
    query.find().then(function (sellerObjects) {
      // console.log(sellerObjects);
      var sellerStates = [];
      for (var i = 0; i < sellerObjects.length; i++) {
        sellerStates.push(false);
      }
      // sellerStates[0] = true;
      that.setData({
        sellerObjects: sellerObjects,
        sellerStates: sellerStates
      });
    });
  },

  loadFood: function (seller) {
    var query = new Bmob.Query('Food');
    if (category != undefined) {
      query.equalTo('seller', seller);
    }
    query.ascending('priority');
    query.limit(Number.MAX_VALUE);
    query.find().then(function (foodObjects) {
      that.setData({
        foodObjects: foodObjects
      });
    });
  },
  switchSeller: function (e) {
    // 获取分类id并切换分类
    var index = e.currentTarget.dataset.index;
    var sellerId = that.data.sellerObjects[index].id;
    // console.log(sellerId);
    var seller = Bmob.Object.createWithoutData('Seller', sellerId);
    // 更改分类项高亮状态
    var sellerStates = that.data.sellerStates;
    sellerStates = sellerStates.map(function (item, i) {
      if (index == i) {
        item = true;
      } else {
        item = false;
      }
      return item;
    });
    that.setData({
      seller: seller,
      sellerStates: sellerStates
    });
    that.loadFood(seller);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})