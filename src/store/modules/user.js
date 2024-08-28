import storage from 'store'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { getToken, setToken, removeToken } from '@/utils/auth'
import store from "../index";

const user = {
  state: {
    //token: '',
    token: getToken(),
    name: '',
    welcome: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: [],
    email:'',
    momoid:'',
    info: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
       //state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_MOMOID: (state, momoid) => {
      state.momoid = momoid
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_INFO: (state, info) => {
      state.info = info
    } 
  },

  actions: {
   
     // 登录
     Login({ commit }, userInfo) {
      setToken(userInfo)
      commit('SET_TOKEN', userInfo)
    }, 
   

    // 获取用户信息
    GetInfo({ commit,state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token,store.getters.aegisKey,store.getters.aegisSecret).then(response => {
          const data = response
          if (data.permissions && data.permissions.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.permissions)
          } else {
            reject('验证信息失效，请重新认证')
          }
          commit('SET_NAME', data.user.name)
          console.log("用户名字",data.user.name)
          //缓存中增加登录人momoid
          localStorage.setItem('momoid',data.user.momoid)
          //缓存中增加登录人name
          localStorage.setItem('momoname',data.user.name)
          commit('SET_PHONE', data.user.phone)
          commit('SET_MOMOID', data.user.momoid)
          commit('SET_EMAIL', data.user.email)
          resolve(response)
        }).catch(error => {
          reject('调用getinfo报错')
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_NAME', '')
          commit('SET_PHONE', '')
          commit('SET_MOMOID', '')
          commit('SET_EMAIL', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    } 

  }
}

export default user
