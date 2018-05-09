var Bmob = require('../../utils/bmob.js');
var that;
Page({
  onLoad: function () {
    that = this;
    // 管理员认证
    getApp().auth();
  },
  onShow: function () {
    that.loadDetails();
  },
  loadDetails: function () {
    var query = new Bmob.Query('Details');
    query.include('category');
    query.ascending('priority');
    query.limit(Number.Max_VALUE);
    query.find().then(function (detailsObjects) {
      // console.log(detailsObjects);
      that.setData({
        detailsObjects: detailsObjects
      });
    });
  },
  add: function () {
    // 跳转添加页面
    wx.navigateTo({
      url: '../add/add'
    });
  },
  showDetail: function (e) {
    var index = e.currentTarget.dataset.index;
    var objectId = that.data.detailsObjects[index].id;
    wx.navigateTo({
      url: '../add/add?objectId=' + objectId
    });
    // console.log(objectId);
  }
})