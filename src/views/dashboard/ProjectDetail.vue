<template>
  <div>
    <div class="ant-title">{{ projectName }}详细数据</div>
    <a-table
      :pagination="showPagination"
      row-key="index"
      :columns="projectColumns"
      :data-source="loadProjectData"
      @expand="expand"
      :expandedRowKeys="expandedRowKeys"
    >
      <template slot="delayed" slot-scope="record">
        <span :class="record.delay == '正常' ? 'normalColumn' : 'warningColumn'">
          {{ record.delay }}
        </span>
      </template>
      <template slot="rdJobDays" slot-scope="record">
        <span>
          {{ getFixedNumber(record.rdJobDays) }}
        </span>
      </template>
      <template slot="qaJobDays" slot-scope="record">
        <span>
          {{ getFixedNumber(record.qaJobDays) }}
        </span>
      </template>
      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <div v-if="'date' in loadProjectData[record.index].detail[0]">
          <a-tabs :default-active-key="0" tab-position="left" style="margin-left: -48px">
            <a-tab-pane v-for="(detail, index) in loadProjectData[record.index].detail" :key="index" :tab="detail.date"
              ><a-row>
                <div v-html="detail.raw" style="width: 100%"></div>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </div>
        <div v-else><span v-html="loadProjectData[record.index].detail[0].raw"></span></div>
      </div>
    </a-table>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import _ from 'lodash'
import Vue from 'vue'

export default {
  components: {},
  data() {
    return {
      showPagination: false,
      loadingDetail: false,
      projectName: this.$route.query.projectName,
      expandedRowKeys: [],
      projectColumns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 90,
        },
        {
          title: '需求名称',
          dataIndex: 'functionName',
          key: 'functionName',
          width: 400,
        },
        {
          title: '需求等级',
          dataIndex: 'function_level',
          key: 'function_level',
          align: 'center',
        },
        {
          title: '开发人日',
          key: 'rdJobDays',
          align: 'right',
          scopedSlots: { customRender: 'rdJobDays' },
        },
        {
          title: '测试人日',
          key: 'qaJobDays',
          align: 'right',
          scopedSlots: { customRender: 'qaJobDays' },
        },
        {
          title: '开发测试人日比',
          dataIndex: 'ManDayRatio',
          key: 'ManDayRatio',
          align: 'center',
        },
        {
          title: '是否延期提测',
          key: 'delay',
          align: 'center',
          scopedSlots: { customRender: 'delayed' },
        },
        {
          title: '冒烟结果',
          dataIndex: 'smoking',
          key: 'smoking',
          align: 'center',
        },
      ],
      detailCache: {},
      loadProjectData: [],
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      axios
        .post('/BusinessController/getFunctionDetails', {
          stime: this.$route.query.stime,
          etime: this.$route.query.etime,
          projectId: this.$route.query.projectId,
        })
        .then((res) => {
          let data = res.data[0].list
          for (let i = 0; i < data.length; i++) {
            data[i].index = i + 1
            if (!('function_level' in data[i]) || _.isEmpty(data[i].function_level)) {
              data[i].function_level = '-'
            }
            if (!('smoking' in data[i])) {
              data[i].smoking = '-'
            }
            data[i].detail = [{ raw: '加载中' }]
          }
          this.loadProjectData = data
          if (data.length > 10) {
            this.showPagination = true
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    expand(expanded, record) {
      console.log('expand ', expanded, record)
      if (expanded) {
        this.expandedRowKeys = [record.index]
      } else {
        this.expandedRowKeys = []
      }
      this.getRowDetail(record)
    },
    getRowDetail(record) {
      if (!(record.index in this.detailCache)) {
        this.getQaDaily(record)
      }
    },
    getQaDaily(record) {
      this.loadingDetail = true
      axios
        .get('/BusinessController/getQaDaily?functionId=' + record.functionId)
        .then((res) => {
          let data = res.data.length > 0 ? res.data : [{ raw: '暂无测试进度数据' }]
          Vue.set(this.detailCache, record.index, data)
          this.loadProjectData[record.index].detail = data
          this.loadingDetail = false
        })
        .catch(function (error) {
          console.log(error)
          this.loadingDetail = false
        })
    },
    getFixedNumber(day) {
      return Math.round(Number(day) * 100) / 100
    },
  },
  computed: {
    title() {
      return this.$route.meta.title
    },
  },
}
</script>

<style lang="less" scoped>
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  width: 100%;
  height: calc(100% - 24px);
  /* /deep/ .ant-card-head {
    position: relative;
  } */
}

.ant-col-3 {
  width: 33%;
}

.ant-font-2 {
  font-size: 13px;
}
.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}
.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}

.timeRadioGroup {
  margin-left: 54px;
}

.timeRadioButtons.ant-radio-button-wrapper::before {
  display: none;
  visibility: hidden;
}
.timeRadioButtons {
  border: none;
}
.timeRadioGroup {
  margin-left: 54px;
  border: none;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  z-index: 1;
  color: #1890ff;
  background: #fff;
  border-color: #ffffff;
  -webkit-box-shadow: -1px 0 0 0 #ffffff;
  box-shadow: -1px 0 0 0 #ffffff;
}
.ant-title {
  color: #1890ff;
  font-size: 16px;
  margin-bottom: 24px;
  font-weight: 500;
}
.warningColumn {
  color: #ef3c59;
  font-weight: bold;
  padding: 5px;
}
</style>
