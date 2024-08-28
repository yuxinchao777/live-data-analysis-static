<template>
  <a-result status="403" title="403" sub-title="你没有权限访问该页面，请申请aegis权限">
    <template #extra>
      <a-button type="primary" @click="toHome">
        回到登录页面
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Exception403',
  methods: {
    toHome () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
