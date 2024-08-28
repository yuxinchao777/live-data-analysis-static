// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/qadata',
    //redirect: noredirect,
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/qadata',
        //redirect: noredirect,
        component: RouteView,
        meta: { title: '菜单',  icon: bxAnaalyse, permission: [ 'analysis' ] },
        children: [
          // {
          //   path: '/dashboard/analysis',
          //   name: 'Analysis',
          //   hidden: true,
          //   component: () => import('@/views/dashboard/BusinessAnalysis'),
          //   meta: { title: '业务', keepAlive: true, permission: ['analysis'] }
          // },
          // {
          //   path: '/dashboard/member',
          //   name: 'Member',
          //   hidden: true,
          //   component: () => import('@/views/dashboard/Member'),
          //   meta: { title: '人员', keepAlive: true, permission: ['member'] }
          // },
          // {
          //   path: '/dashboard/viporder',
          //   name: 'VipOrder',
          //   hidden: true,
          //   component: () => import('@/views/dashboard/VipOrder'),
          //   meta: { title: '问题跟进', keepAlive: true, permission: ['analysis'] }
          // },
          // {
          //   path: '/dashboard/qualitydetail',
          //   name: 'qualitydetail',
          //   hidden: true,
          //   component: () => import('@/views/dashboard/QualityDetail'),
          //   meta: { title: '质量详细数据', keepAlive: true, permission: [ 'analysis' ] }
          // },
          // {
          //   path: '/dashboard/projectdetail',
          //   name: 'projectdetail',
          //   hidden: true,
          //   component: () => import('@/views/dashboard/ProjectDetail'),
          //   meta: { title: '业务详细数据', keepAlive: true, permission: [ 'analysis' ] }
          // },
          {
            path: '/dashboard/businessquality',
            name: 'businessquality',
            // hidden: true,
            component: () => import('@/views/qadata/businessquality'),
            meta: { title: '业务质量', keepAlive: true, permission: [ 'analysis' ] }
          },
          {
            path: '/dashboard/qadata',
            name: 'qadata',
            // hidden: true,
            component: () => import('@/views/qadata/qadata'),
            meta: { title: '测试效能', keepAlive: true, permission: [ 'analysis' ] }
          },
          {
            path: '/dashboard/codenumber',
            name: 'codenumber',
            //hidden: true,
            component: () => import('@/views/qadata/codenumber'),
            meta: { title: '技术效能', keepAlive: true, permission: [ 'analysis' ] }
          },
          {
            path: '/dashboard/qamemberdata',
            name: 'qamemberdata',
            component: () => import('@/views/qadata/qamemberdata'),
            meta: { title: '测试周排期安排', keepAlive: true, permission: [ 'analysis' ] }
          },
          {
            path: '/dashboard/questions',
            name: 'questions',
            component: () => import('@/views/qadata/questions'),
            meta: { title: '故障&问题记录', keepAlive: true, permission: [ 'analysis' ] }
          },
          {
            path: '/dashboard/hubblewarn',
            name: 'hubblewarn',
            component: () => import('@/views/tools/hubblewarn'),
            meta: { title: 'hubble报警', keepAlive: true, permission: [ 'analysis' ] }
          },
          {
            path: '/dashboard/autotest',
            name: 'autotest',
            component: () => import('@/views/tools/autotest'),
            meta: { title: '自动化测试', keepAlive: true, permission: [ 'analysis' ] }
          },      
          {
            path: '/dashboard/qamember',
            name: 'qamember',
            component: () => import('@/views/qadata/memberconfig'),
            meta: { title: '人员维护', keepAlive: true, permission: [ 'analysis' ] }
          },
          {
            path: '/dashboard/logtext',
            name: 'logtext',
            component: () => import('@/views/tools/logtext'),
            meta: { title: '操作日志', keepAlive: true, permission: [ 'analysis' ] }
          },   
          {
            path: '/dashboard/test001',
            name: 'test001',
            //hidden: true,
            component: () => import('@/views/qadata/test001'),
            meta: { title: 'test001', keepAlive: true, permission: [ 'analysis' ] }
          },
        ]
      },

      // forms
/*       {
        path: '/form',
        redirect: '/form/base-form',
        component: RouteView,
        meta: { title: '表单页', icon: 'form', permission: [ 'form' ] },
        children: [
          {
            path: '/form/base-form',
            name: 'BaseForm',
            component: () => import('@/views/form/basicForm'),
            meta: { title: '基础表单', keepAlive: true, permission: [ 'form' ] }
          },
          {
            path: '/form/step-form',
            name: 'StepForm',
            component: () => import('@/views/form/stepForm/StepForm'),
            meta: { title: '分步表单', keepAlive: true, permission: [ 'form' ] }
          },
          {
            path: '/form/advanced-form',
            name: 'AdvanceForm',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: '高级表单', keepAlive: true, permission: [ 'form' ] }
          }
        ]
      }, */

      // list
/*       {
        path: '/list',
        name: 'list',
        component: RouteView,
        redirect: '/list/table-list',
        meta: { title: '列表页', icon: 'table', permission: [ 'table' ] },
        children: [
          {
            path: '/list/table-list/:pageNo([1-9]\\d*)?',
            name: 'TableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TableList'),
            meta: { title: '查询表格', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/list/basic-list',
            name: 'BasicList',
            component: () => import('@/views/list/BasicList'),
            meta: { title: '标准列表', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/list/card',
            name: 'CardList',
            component: () => import('@/views/list/CardList'),
            meta: { title: '卡片列表', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/list/search',
            name: 'SearchList',
            component: () => import('@/views/list/search/SearchLayout'),
            redirect: '/list/search/article',
            meta: { title: '搜索列表', keepAlive: true, permission: [ 'table' ] },
            children: [
              {
                path: '/list/search/article',
                name: 'SearchArticles',
                component: () => import('../views/list/search/Article'),
                meta: { title: '搜索列表（文章）', permission: [ 'table' ] }
              },
              {
                path: '/list/search/project',
                name: 'SearchProjects',
                component: () => import('../views/list/search/Projects'),
                meta: { title: '搜索列表（项目）', permission: [ 'table' ] }
              },
              {
                path: '/list/search/application',
                name: 'SearchApplications',
                component: () => import('../views/list/search/Applications'),
                meta: { title: '搜索列表（应用）', permission: [ 'table' ] }
              }
            ]
          }
        ]
      }, */

      // profile
/*       {
        path: '/profile',
        name: 'profile',
        component: RouteView,
        redirect: '/profile/basic',
        meta: { title: '详情页', icon: 'profile', permission: [ 'profile' ] },
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic'),
            meta: { title: '基础详情页', permission: [ 'profile' ] }
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: '高级详情页', permission: [ 'profile' ] }
          }
        ]
      },

      // result
/*       {
        path: '/result',
        name: 'result',
        component: RouteView,
        redirect: '/result/success',
        meta: { title: '结果页', icon: 'check-circle-o', permission: [ 'result' ] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess', */
//            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
/*             meta: { title: '成功', keepAlive: false, hiddenHeaderContent: true, permission: [ 'result' ] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail', */
//            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
/*             meta: { title: '失败', keepAlive: false, hiddenHeaderContent: true, permission: [ 'result' ] }
          }
        ]
      }, */

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning', permission: [ 'exception' ] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: [ 'exception' ] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: [ 'exception' ] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: [ 'exception' ] }
          }
        ]
      },

      // account
/*       {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: '个人中心', keepAlive: true, permission: [ 'user' ] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: '安全设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: [ 'user' ] }
              }
            ]
          }
        ]
      } */

      // other
      /*
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
          }
        ]
      }
      */
    ]
  },
 {
   path: '*', redirect: '/403', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  //{ path: '/login', component: () => import('@/views/login/index'), hidden: true },
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        //component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/index')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/403',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403')
  }

]
