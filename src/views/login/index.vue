
<template>
  <div>
    <div class="login-container">
      <a-form ref="loginForm" class="login-form" auto-complete="on" label-position="left">
        <h3 class="title">TestLab</h3>
        <a-form-item>
          <a-button type="primary" style="width: 100%"
            ><a :href="'http://aegis.momo.com/sso/login/' + aegisKey">Aegis登录</a></a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import store from '../../store'

export default {
  data() {
    return {
      aegisKey: '',
    }
  },
  name: 'Login',
  created() {
    this.aegisKey = store.getters.aegisKey
    var url = decodeURIComponent(window.location.href)
    if (url.indexOf('token') != -1) {
      var dz_url = url.split('?')[2]
      var cs = dz_url.split('&')[0]
      var cs_arr = cs.split('=')[1]
      var cs={};
      for(var i=0;i<cs_arr.length;i++){
        cs[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1]
      } 
      var token = cs.token
      var momoid = cs.momoid
      this.$store
        .dispatch('Login', cs_arr)
        .then(() => {
          this.loading = false
          this.$router.push({ path: '/' })
        })
        .catch(() => {
          this.loading = false
        })
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  methods: {},
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
