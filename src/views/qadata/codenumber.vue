<template>
  <div v-if="building">
    <h1>代码量统计</h1>
    部门<a-select default-value="商业QA" style="width: 100px; margin-left: 5px">
      <a-select-option
        v-for="apartment in qadatas.data.apartments"
        :key="apartment.id"
        :value="apartment.name"
        @click="setapartmentid(apartment.id)"
      >
        {{ apartment.name }}
      </a-select-option>
    </a-select>

    <!--时间选择框-->
    <a-range-picker class="a-range-picker" style="width: 400px;margin-left:10px;" show-time v-model="dateRange">
      <template slot="renderExtraFooter"> 日期选择</template>
    </a-range-picker>

    <!--选择仓库-->
    <a-input placeholder="选择仓库" style="width: 200px;margin-left:10px;"/>

    <!--选择分支-->
    <a-input placeholder="选择分支" style="width: 200px;margin-left:10px;margin-right:10px;"/>

    <!--查询按钮-->
    <a-button type="primary" icon="search" @click="getneedtimelist(dateRange)"> 查询 </a-button>

    <div id='download' style="margin-top:10px;">
    <!--下载按钮-->
    <a-button type="primary" icon="download"> 下载 </a-button>
    </div>

    <a-tabs>
      <a-tab-pane key="1" tab="仓库聚合">
        <a-table
          :columns="columns_store"
          :data-source="qadata"
          style="margin-top: 20px"
          :loading="isLoading"
          :pagination="{ defaultPageSize: 100 }"
        >
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="员工聚合"> Content of tab 2 </a-tab-pane>
      <a-button slot="tabBarExtraContent"> Extra Action </a-button>
    </a-tabs>
  </div>
  <div v-else>
     <building></building>
  </div>
</template>

<script>
const qadatas = {
  statuscode: 200,
  data: {
    apartments: [{ id: 1, name: '商业QA' }],
  },
}
const columns_store = [
  { title: '姓名', width: 30, dataIndex: 'name', key: 'name' },
  { title: '仓库名', width: 30, dataIndex: 'jobHour', key: 'jobHour' },
  { title: '分支名', width: 30, dataIndex: 'jobDay', key: 'jobDay' },
  { title: '增加行数', width: 30, dataIndex: 'caseNum', key: 'caseNum' },
]

const columns_member = [
  { title: '业务线', width: 30, dataIndex: 'projectName', key: 'projectName' },
  { title: '姓名', width: 30, dataIndex: 'name', key: 'name' },
  { title: '技术类型', width: 30, dataIndex: 'skilltype', key: 'skilltype' },
  { title: '技术线', width: 30, dataIndex: 'skillline', key: 'skillline' },
  { title: '代码行数', width: 30, dataIndex: 'codenum', key: 'codenum' },
  { title: 'bug数', width: 30, dataIndex: 'bugnum', key: 'bugnum' },
  { title: '千行代码bug数', width: 30, dataIndex: 'bugnumofthousand', key: 'bugnumofthousand' },
  {
    title: 'bug详情',
    key: 'bugDetail',
    width: 250,
    scopedSlots: { customRender: 'action' },
  },
  { title: '备注', width: 30, dataIndex: 'other', key: 'other' },
]

import building from '../building.vue'


export default {
  components: { building },
  //技术效能
  name: 'codenumber',
  data() {
    return {
      qadatas,
      dateRange: [],
      building:false
    }
  },
  methods: {
    init() {
      //周一 周日
      const monday = this.dayjs().startOf('week').add(1, 'day')
      const sunday = this.dayjs().endOf('week').add(1, 'day')

      //时间转moment对象
      this.dateRange = [
        moment(monday.format('dddd MMM DD YYYY HH:mm:ss ZZ')),
        moment(sunday.format('dddd MMM DD YYYY HH:mm:ss ZZ')),
      ]
    },
  },
  computed: {},

  comments:{building},
}
</script>

<style scoped>
</style>