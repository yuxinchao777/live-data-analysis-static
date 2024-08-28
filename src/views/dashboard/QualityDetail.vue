<template>
  <div>
    <div class="ant-title">{{ projectName }}详细数据</div>
    <a-table
      :pagination="pagination"
      row-key="index"
      :columns="qualityColumns"
      :data-source="loadQualityData"
      @change="handleTableChange"
      :loading="loading"
    >
      <template slot="bugResolutionRate" slot-scope="record">
        <div v-if="record.bugSum>0&&!inRange(record.bugResolutionRate, 90, 100)">
          <a-tooltip placement="top" title="BUG解决率合格线为90%">
            <span class="warningColumn">
              {{ record.bugResolutionRate }}
            </span>
          </a-tooltip>
        </div>
        <div v-else>
          {{ record.bugResolutionRate }}
        </div>
      </template>
      <template slot="rdTestQuality" slot-scope="record">
        <div v-if="!inRange(record.rdTestQuality, 90, 100)">
          <a-tooltip placement="top" title="开发提测质量合格线为90%">
            <span class="warningColumn">
              {{ record.rdTestQuality }}
            </span>
          </a-tooltip>
        </div>
        <div v-else>
          {{ record.rdTestQuality }}
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import Vue from 'vue'

export default {
  components: {},
  data() {
    return {
      loading: true,
      pagination: {
        current: 1,
        total: 0,
      },
      projectName: this.$route.query.projectName,
      qualityColumns: [
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
          title: '内网BUG数',
          dataIndex: 'bugSum',
          key: 'bugSum',
          align: 'right',
        },
        {
          title: '遗留BUG数',
          dataIndex: 'bugDeferred',
          key: 'bugDeferred',
          align: 'right',
        },
        {
          title: 'BUG解决率',
          key: 'bugResolutionRate',
          align: 'right',
          scopedSlots: { customRender: 'bugResolutionRate' },
        },
        {
          title: '提测质量',
          key: 'rdTestQuality',
          align: 'right',
          scopedSlots: { customRender: 'rdTestQuality' },
        },
      ],
      loadQualityData: [],
      dataCache: {},
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getDataByPage()
    },
    getDataByPage() {
      this.loading = true
      axios
        .post('/BusinessController/getFunctionByProductId', {
          stime: this.$route.query.stime,
          etime: this.$route.query.etime,
          projectId: this.$route.query.projectId,
          offset: (this.pagination.current - 1) * 10,
        })
        .then((res) => {
          let data = res.data.list
          for (let i = 0; i < data.length; i++) {
            data[i].index = i + 1
          }
          this.loadQualityData = data
          this.dataCache[this.pagination.current] = data
          if (this.pagination.current == 1) {
            Vue.set(this.pagination, 'total', res.data.total)
          }
          this.loading = false
        })
        .catch(function (error) {
          this.loading = false
          console.log(error)
        })
    },
    onChange(page, pageSize) {
      console.log('page', page, 'pageSize', pageSize)
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = pagination
      if (pagination.current in this.dataCache) {
        this.loadQualityData = this.dataCache[pagination.current]
      } else {
        this.getDataByPage()
      }
    },
    getNumberFromPercentString(str) {
      let numStr = str.slice(0, -1)
      return Number(numStr)
    },
    isWarningColor(record, floor, ceil) {
      if (record === '-') {
        return 'normalColumn'
      }
      if (!this.inRange(record, floor, ceil)) {
        return 'warningColumn'
      }
      return 'normalColumn'
    },
    inRange(record, floor, ceil) {
      if (record === '-') {
        return true
      }
      let stat = this.getNumberFromPercentString(record)
      return stat >= floor && stat <= ceil
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
.warningColumn {
  color: #ef3c59;
  font-weight: bold;
  padding: 5px;
}
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
</style>
