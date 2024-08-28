const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  //nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  sidebar: state => state.app.sidebar,
  //device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  email: state => state.user.email,
  momoid: state => state.user.momoid,
  aegisKey: state=> state.app.aegisKey,
  aegisSecret: state=> state.app.aegisSecret,
  reportUrl:state=>state.app.reportUrl,
  serverUrl:state=>state.app.serverUrl

}

export default getters
