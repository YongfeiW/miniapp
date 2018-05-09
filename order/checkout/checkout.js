// checkout.js
var Bmob = require('../../utils/bmob.js');
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');
var utils = require('../../utils/utils.js');

var that;

Page({
	data: {
		personCountIndex: 0
	},
	onLoad: function (options) {
		that = this;
		that.loadAddress();
		// 注册通知
        WxNotificationCenter.addNotification("addressSelectedNotification", that.getSelectedAddress, that);
        WxNotificationCenter.addNotification("remarkNotification", that.getRemark, that);
        // 购物车获取参数
        that.setData({
        	carts: JSON.parse(options.carts)
        });
        // 读取商家信息
        getApp().loadSeller(function (seller) {
        	that.setData({
        		seller: seller
        	});
        });
        that.setData({
        	amount: parseFloat(options.amount),
        	quantity: parseInt(options.quantity),
        	express_fee: parseInt(options.express_fee),
        	total: parseFloat(options.amount) + parseInt(options.express_fee)
        });
        that.initpersonCountArray();
	},
	selectAddress: function () {
		wx.navigateTo({
			url: '../../address/list/list?isSwitchAddress=true'
		});
	},
	getSelectedAddress: function (addressId) {
		console.log(addressId);
		// 回调查询地址对象
		var query = new Bmob.Query("Address");
		query.get(addressId).then(function (address) {
			that.setData({
				address: address
			});
		});
	},
	loadAddress: function () {
		var that = this;
		var query = new Bmob.Query('Address');
		query.equalTo('user', Bmob.User.current());
		query.descending('updatedAt');
		query.limit(1);
		query.find().then(function (addressObjects) {
			// 查到用户已有收货地址
			if (addressObjects.length > 0) {
				that.setData({
					address: addressObjects[0]
				});
			}
		});
	},
	initpersonCountArray: function () {
		// 初始化用户数
		var personCountArray = [];
		var length = 10;
		for (var i = 1; i <= length; i++) {
			personCountArray.push(i + '人');
		}
		personCountArray.push(length + '人以上');
		that.setData({
			personCountArray: personCountArray
		});
	},
	getRemark: function (remark) {
		console.log(remark)
		that.setData({
			remark: remark
		});
	},
	naviToRemark: function () {
		wx.navigateTo({
			url: '../remark/remark?remark=' + (that.data.remark || '')
		});	
	},
	bindPickerChange: function(e) {
		// 监听picker事件
		this.setData({
			personCountIndex: e.detail.value
		})
	},
	payment: function () {
		// 创建订单
		var order = new Bmob.Object('Order');
   
    order.set('thumb_url', that.data.thumb_url);
		order.set('user', Bmob.User.current());
		order.set('address', that.data.address);
		order.set('express_fee', that.data.express_fee);
		order.set('title', that.data.carts[0].title);
		order.set('quantity', that.data.quantity);
		order.set('amount', that.data.amount);
		order.set('total', that.data.total);
		order.set('status', 0);
		order.set('detail', that.data.carts);

    if (!that.data.thumb_url) {
      wx.showModal({
        title: '请上传文件',
        showCancel: false
      });
      return;
    }
		order.save().then(function (orderCreated) {
			// 保存成功，调用支付
			// getApp().payment(orderCreated);
      wx.showModal({
        title: '下单成功',
        showCancel: false,
        success: function () {
          wx.navigateBack();
        }
      });
		}, function (res) {
			console.log(res)
			wx.showModal({
				title: '订单创建失败',
				showCancel: false
			})
		});
	},
  // add: function(e){
  //     var form = e.detail.value;
  //     if (!that.data.thumb_url) {
  //       wx.showModal({
  //         title: '请上传文件',
  //         showCancel: false
  //       });
  //       return;
  //     }
  //     var file = new Bmob.Object('File');
  //     // 修改模式
  //     if (that.data.isEdit) {
  //       file = that.data.file;
  //     }
  //     file.set('thumb_url', that.data.thumb_url);
  //     file.save().then(function (updatedFile) {
  //       // 操作成功提示并返回上一页
  //       wx.showModal({
  //         title: that.data.isEdit ? '修改成功' : '添加成功',
  //         showCancel: false,
  //         success: function () {
  //           wx.navigateBack();
  //         }
  //       });
  //     }, function (err) {
  //       console.log(err);
  //     });
  // },
  upload: function () {
    // 上传或更换详情图片
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var name = utils.random_filename(tempFilePaths[0]);//上传的图片的别名，建议可以用日期命名
        console.log(name);
        var file = new Bmob.File(name, [tempFilePaths[0]]);
        file.save().then(function (thumb) {
          console.log(thumb)
          // 页面存值，wxml渲染
          that.setData({
            thumb_url: thumb.url()
          });
        }, function (error) {
          console.log(error);
        })
      }
    })
  }
})