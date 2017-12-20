


// 系统启动后，根据前端指令获取指定页面设备最新状态
checkLogin().then((res) => {
  if (res.result) {
    loginInfo = res.loginInfo;
    console.log('login success.');
    return getDeviceInfo(0, 4);
  }
}).catch((error) => {
  console.log(`error:${error}`);
}).then((res) => {
  if (res.result) {
    console.log('getDeviceInfo success.');
  }
});