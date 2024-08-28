import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

const locale = {
  'message': '-',
  'menu.home': '主页',
  'menu.dashboard': '数据项',
  'menu.dashboard.analysis': '业务',
  'menu.dashboard.member': '个人',
  'menu.dashboard.auth': '权限',
}

export default {
  ...components,
  ...locale
}
