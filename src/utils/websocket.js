module.exports = (function () {
  var socketOpened = false; // 标记websocket是否已经打开


    function connect() { // 发起链接
      //建立连接
      wx.connectSocket({
        url: `wss://www.saddlepoint.cn:8004/api-ep-user/taskSocket/${wx.getStorageSync("UserId")}`,
        header: {
          "Content-Type": 'application/json',
          "Authorization": wx.getStorageSync("Authorization")
        },
        success(res) {
          console.log(res);
        },
      })
    }
  // webSocket打开事件处理
  function init() {
    wx.onSocketOpen(function (res) {
      socketOpened = true;
      console.log('websocket opened.');

    })
    //发送消息
    wx.onSocketMessage(function (data) {
      console.log('新的')
      let pages = getCurrentPages(); //当前页面栈
      //当前页面为页面栈的最后一个元素
      let prevPage = pages[pages.length - 1]; //当前页面
      //如果是tabar页面直接执行添加待办红点数量事件
      if (prevPage.route == 'pages/index/main' || prevPage.route == 'pages/shenpi/main' || prevPage.route == 'pages/self/main') {
        wx.setTabBarBadge({
          index: 2,
          text: JSON.parse(data.data).total + "",
        });
        wx.showToast({
          title: '你有新的待审批单据',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '你有新的待审批单据',
          icon: 'none',
          duration: 2000
        })
      }
    })
    //连接失败
    wx.onSocketError(function (res) { // 链接出错时的处理
      wx.showToast({
        title: '服务器连接出错',
        icon: 'error',
        duration: 2000
      })
    });

  }
  init();
  return {
    connect: connect,
    socketOpened: socketOpened
  };
})();
