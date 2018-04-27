// member/login/login.js
var Bmob = require('../../utils/bmob.js');
var that;

Page({
  onLoad: function (options) {
    that = this;
    if (options.objectId) {
      // 缓存数据
      that.setData({
        isEdit: true,
        objectId: options.objectId
      });
      // 请求待编辑的商家对象
      var query = new Bmob.Query('Seller');
      query.get(that.data.objectId).then(function (seller) {
        that.setData({
          seller: seller
        });
      });
    }
  },
  data: {
    disabled: true,
    btnstate: "default",
    account: "",
    password: ""
  },
  accountInput: function (e) {
    var content = e.detail.value;
    console.log(content);
    if (content != '') {
      this.setData({ disabled: false, btnstate: "primary", account: content });
    } else {
      this.setData({ disabled: true, btnstate: "default" });
    }
  },
  pwdBlur: function (e) {
    var password = e.detail.value;
    if (password != '') {
      this.setData({ password: password });
    }
  },
  add: function (e) {
    // form 表单取值，格式 e.detail.value.account(account为input中自定义name值) ；使用条件：需通过<form bindsubmit="formSubmit">与<button formType="submit">一起使用
    var form = e.detail.value; 
    var account = form.account;
    var password = form.password;
    var subPassword = form.subPassword;
    var that = this;
    // 判断账号是否为空和判断该账号名是否被注册  
    if ("" == form.account) {
      wx.showModal({
        title: '请填写账号',
        showCancel: false
      });
      return;
    } 
    
    // 判断密码是否为空  
    if ("" == form.password) {
      wx.showModal({
        title: '请填写密码',
        showCancel: false
      });
      return;
    } 
    // 两个密码必须一致  
    else if (subPassword != password) {
      wx.showModal({
        title: '密码不一致',
        showCancel: false
      });
      return;
    } 
    // 验证都通过了执行注册方法  
    var seller = new Bmob.Object('Seller');
    seller.save(form).then(function (updatedSeller) {
      // that.setData({
      // 	seller: updatedSeller
      // });
      //操作成功提示并返回上一页
      wx.showModal({
        title: '注册成功',
        content: '请点击确定登录吧',
        showCancel: false,
        success: function () {
          wx.navigateBack();
        }
      });
    });
    // app.ajax.req('/itdragon/register', {
    //   "account": account,
    //   "password": password
    // }, function (res) {
    //   if (true == res) {
    //     // 显示模态弹窗  
    //     wx.showModal({
    //       title: '注册状态',
    //       content: '注册成功，请点击确定登录吧',
    //       success: function (res) {
    //         if (res.confirm) {
    //           // 点击确定后跳转登录页面并关闭当前页面  
    //           wx.redirectTo({
    //             url: '../login/login?account=' + account + '&password?=' + password + ''
    //           })
    //         }
    //       }
    //     })
    //   } else {
    //     // 显示消息提示框  
    //     wx.showToast({
    //       title: '注册失败',
    //       icon: 'error',
    //       duration: 2000
    //     })
    //   }
    // });
  }
})  