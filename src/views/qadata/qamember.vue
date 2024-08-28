<template>
  <div>
    <h1>人员配置</h1>
    <a-tabs default-active-key="qa" @change="callback">
      <a-tab-pane key="qa" tab="测试人员配置">
        <a-table
          :columns="columns"
          :data-source="qadata"
          style="margin-top: 20px"
          :loading="isLoading"
          :pagination="{ defaultPageSize: 100 }"
        >
          <div slot="action" slot-scope="text, record">
            <div>
              <a-button type="primary" @click="showModal(record.id, record.name, record.userType, record.orderId)"
                >编辑</a-button
              >
            </div>
          </div>
        </a-table>
      </a-tab-pane>
        <a-tab-pane key="rd" tab="开发人员配置" force-render>
          <building></building>
         </a-tab-pane>
      </a-tabs>

    <div>
      <a-modal v-model="visible" title="编辑" @ok="handleOk" :afterClose="onClose">
        <p>姓名: {{ modelname }}</p>
        <p>权重: <a-input-number placeholder="权重" style="width: 80px" v-model="modelorder" /></p>
        <p>显示: <a-switch v-model="modeluserType" @change="onChange" /></p>
      </a-modal>
    </div>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import { method } from 'lodash'

const columns = [
  { title: 'id', width: 30, dataIndex: 'id', key: 'id' },
  { title: '姓名', width: 30, dataIndex: 'name', key: 'name' },
  { title: '权重', width: 30, dataIndex: 'orderId', key: 'orderId' },
  { title: '列表显示', width: 30, dataIndex: 'userType', key: 'userType' },
  {
    title: '操作',
    key: 'taskDetail',
    width: 250,
    scopedSlots: { customRender: 'action' },
  },
]

import building from '../building.vue'

export default {
  //人员维护页面
  name: 'member',
  data() {
    return {
      columns,
      qadata: [],
      visible: false,
      modelid: '',
      modelorder: '',
      modelname: '',
      modeluserType: true,
      tabkey:"qa"
    }
  },

  methods: {
    init() {
      this.getmemberdata()
    },
    getmemberdata() {
      this.isLoading = true
      let params = new FormData()
      params.append('Department', 'qa')
      axios
        .post('/queryEmployee', params, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          if (response.code === 200) {
            this.isLoading = false
            response.data.forEach((item) => {
              if (item.userType === 1) {
                item.userType = '是'
              } else {
                item.userType = '否'
              }
            })
            this.qadata = response.data
          }
        })
        .catch((error) => {
          this.isLoading = false
          this.$message.error('内网数据获取失败')
        })
    },

    showModal(id, name, userType, order) {
      this.modelid = id
      this.modelname = name
      this.modelorder = order
      if (userType === '是') {
        this.modeluserType = 1
      } else {
        this.modeluserType = 0
      }

      document.documentElement.style = ''
      this.visible = true
    },
    handleOk() {
      let params = new FormData()
      params.append('id', this.modelid)
      params.append('orderId', this.modelorder)
      params.append('userType', Number(this.modeluserType))
      axios
        .post('/editEmployee', params, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          if (response.code === 200) {
            this.$message.success('提交成功')
            this.visible = false
            this.init()
          } else {
            this.$message.error('提交失败')
          }
        })
        .catch((error) => {
          this.isLoading = false
          this.$message.error('内网数据获取失败')
        })
    },
    onClose() {
      document.documentElement.style.overflowY = 'overlay'
    },
    onChange(checked) {
      modeluserType = checked
    },
  },
  computed: {},

  components:{building},
  created() {
    this.init()
  },
}
</script>

<style scoped>
</style>
