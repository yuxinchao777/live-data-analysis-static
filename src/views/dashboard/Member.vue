<template>
  <div>
    <a-row>
      <a-col :span="24" :style="{ background: '#ffffff', 'margin-bottom': '24px' }">
        <a-row type="flex" justify="end">
          <a-col>
            <a-affix :offset-top="10" @change="affixChanged">
              <div :class="affixed ? 'affixed' : 'affix'">
                <a style="paddingright: 48px">
                  <a-select default-value="all" style="width: 120px" @change="handleTypeChange">
                    <a-select-option v-for="(option, index) in typeOptions" :key="index" :value="option.value">
                      {{ option.name }}
                    </a-select-option>
                  </a-select>
                </a>
                <a-radio-group :value="currentPeriod" class="timeRadioGroup" @change="handleTimeChange">
                  <a-radio-button
                    v-for="(time, index) in timeOptions"
                    :key="index"
                    :value="time.value"
                    class="timeRadioButtons"
                  >
                    {{ time.name }}
                  </a-radio-button>
                </a-radio-group>
                <a-range-picker
                  :disabled-date="disabledDate"
                  @change="handleDateRangeChange"
                  :style="{ width: '256px', 'margin-left': '24px', 'margin-right': '48px' }"
                  :value="dateRange"
                />
              </div>
            </a-affix>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="代码行数" :total="formatNumberString(codeAnalysis.codeNum)">
          <a-tooltip title="RD增加和删减累计代码行数" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div style="postion: relative">
            <span class="ant-font-2" slot="term">新增</span>
            {{ formatNumberString(codeAnalysis.addCodeNum) }}
            <br />
            <span class="ant-font-2" slot="term">删除</span>
            {{ formatNumberString(codeAnalysis.delCodeNum) }}
            <a-progress
              style="position: absolute; right: 0; bottom: 0px"
              type="circle"
              :percent="formatPercentString(codeAnalysis.addProportion * 100)"
              :width="90"
              :format="(percent) => `新增占比  ${percent}% `"
              :strokeWidth="10"
            />
          </div>
          <template slot="footer">
            <trend
              :flag="codeAnalysis.comparisonDirection === 'down' ? 'down' : 'up'"
              :style="{
                visibility: codeAnalysis.comparisonDirection == 'hide' ? 'hidden' : 'visible',
                'margin-right': '16px',
              }"
            >
              <span slot="term">{{ reletiveText }}</span>
              {{ formatPercentString(codeAnalysis.comparison * 100) }}%
            </trend>
          </template>
        </chart-card>
      </a-col>

      <a-col :span="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="新需求测试case数" :total="formatNumberString(newCaseCount.sum)">
          <a-tooltip title="新需求累计执行case数" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <template slot="footer">
            <trend
              :flag="newCaseCount.trend == 'down' ? 'down' : 'up'"
              :style="{ visibility: newCaseCount.trend == 'hide' ? 'hidden' : 'visible', 'margin-right': '16px' }"
            >
              <span slot="term">{{ reletiveText }}</span>
              {{ formatPercentString(newCaseCount.ratio * 100) }}%
            </trend>
          </template>
        </chart-card>
      </a-col>

      <a-col :span="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="公测包回归case数" :total="formatNumberString(publicBetaTestCase.caseNum)">
          <a-tooltip title="公测包累计回归case数" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div style="postion: relative">
            <span class="ant-font-2" slot="term">人工</span>
            {{ formatNumberString(publicBetaTestCase.manualCaseNum) }}
            <br />
            <span class="ant-font-2" slot="term">自动化</span>
            {{ formatNumberString(publicBetaTestCase.autoCaseNum) }}
            <a-progress
              style="position: absolute; right: 0; bottom: 0px"
              type="circle"
              :percent="formatPercentString(publicBetaTestCase.autoProportion * 100)"
              :width="90"
              :format="(percent) => `自动化占比${percent}% `"
              :strokeWidth="10"
            />
          </div>
          <template slot="footer">
            <span style="margin-right: 16px"></span>
          </template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '30px' }">
      <div class="salesCard">
        <a-tabs
          default-active-key="RD"
          :activeKey="currentTab"
          size="large"
          :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }"
          @change="handleTabChange"
        >
          <a-tab-pane :forceRender="true" tab="RD" key="RD">
            <div class="ant-table-wrapper">
              <a-table
                row-key="index"
                size="middle"
                :columns="rdTableColumns"
                :dataSource="rdData"
                :pagination="{ pageSize: 10 }"
                :loading="loadingRD"
                :scroll="{ scrollToFirstRowOnChange: false }"
              >
                <span slot="codeVsbugComparison" slot-scope="codeVsbugComparison"> {{ codeVsbugComparison }}‰ </span>
                <span slot="unresolvedBugProbability" slot-scope="unresolvedBugProbability">
                  {{ unresolvedBugProbability }}%
                </span>
              </a-table>
            </div>
          </a-tab-pane>
          <a-tab-pane :forceRender="true" tab="QA" key="QA">
            <div class="ant-table-wrapper">
              <a-table
                row-key="index"
                size="middle"
                :columns="qaTableColumns"
                :dataSource="qaData"
                :pagination="{ pageSize: 10 }"
                :loading="loadingQA"
                :scroll="{ scrollToFirstRowOnChange: false }"
              >
                <span slot="missBugProbability" slot-scope="missBugProbability"> {{ missBugProbability }}% </span>
              </a-table>
            </div>
          </a-tab-pane>
          <a-auto-complete
            class="global-search"
            size="large"
            style="width: 100%"
            placeholder="输入姓名"
            option-label-prop="value"
            @select="onSelect"
            @search="handleSearch"
            slot="tabBarExtraContent"
            v-model="searchWord"
            allow-clear
          >
            <template slot="dataSource">
              <a-select-option v-for="word in keywords" :key="word" :value="word">
                {{ word }}
              </a-select-option>
            </template>
            <a-input>
              <a-icon slot="prefix" type="search" />
            </a-input>
          </a-auto-complete>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea,
} from '@/components'
import { baseMixin } from '@/store/app-mixin'
import Vue from 'vue'
import moment from 'moment'
import _ from 'lodash'

// RD表头
const rdTableColumns = [
  {
    dataIndex: 'index',
    title: '序号',
    width: 90,
  },
  {
    dataIndex: 'name',
    title: '姓名',
    width: 150,
  },
  {
    dataIndex: 'functionNum',
    title: '项目数量',
    align: 'right',
    sorter: (a, b) => a.functionNum - b.functionNum,
  },
  {
    dataIndex: 'addCodeNum',
    title: '新增代码行数',
    align: 'right',
    sorter: (a, b) => a.codeNum - b.codeNum,
  },
  {
    dataIndex: 'delCodeNum',
    title: '删除代码行数',
    align: 'right',
    sorter: (a, b) => a.codeNum - b.codeNum,
  },
  {
    dataIndex: 'bugNum',
    title: 'BUG总数',
    align: 'right',
    sorter: (a, b) => a.bugNum - b.bugNum,
  },
  {
    dataIndex: 'codeVsbugComparison',
    title: '千行代码BUG率',
    align: 'right',
    sorter: (a, b) => a.codeVsbugComparison - b.codeVsbugComparison,
    scopedSlots: { customRender: 'codeVsbugComparison' },
  },
  {
    dataIndex: 'unresolvedBug',
    title: '遗留bug数',
    align: 'right',
    sorter: (a, b) => a.unresolvedBug - b.unresolvedBug,
  },
  {
    dataIndex: 'unresolvedBugProbability',
    title: '遗留bug率',
    align: 'right',
    sorter: (a, b) => a.unresolvedBugProbability - b.unresolvedBugProbability,
    scopedSlots: { customRender: 'unresolvedBugProbability' },
  },
]

// QA表头
const qaTableColumns = [
  {
    dataIndex: 'index',
    title: '序号',
    width: 90,
  },
  {
    dataIndex: 'name',
    title: '姓名',
    width: 150,
  },
  {
    dataIndex: 'functionNum',
    title: '项目数量',
    align: 'right',
    sorter: (a, b) => a.functionNum - b.functionNum,
  },
  {
    dataIndex: 'writeCaseNum',
    title: 'case编写数量',
    align: 'right',
    sorter: (a, b) => a.writeCaseNum - b.writeCaseNum,
  },
  {
    dataIndex: 'executeCaseNum',
    title: 'case执行数量',
    align: 'right',
    sorter: (a, b) => a.executeCaseNum - b.executeCaseNum,
  },
  {
    dataIndex: 'submitBugNum',
    title: '提交bug数',
    align: 'right',
    sorter: (a, b) => a.range - b.range,
  },
  {
    dataIndex: 'missBugNum',
    title: '漏测bug数',
    align: 'right',
    sorter: (a, b) => a.missBugNum - b.missBugNum,
  },
  {
    dataIndex: 'missBugProbability',
    title: '漏测bug率',
    align: 'right',
    sorter: (a, b) => a.missBugProbability - b.missBugProbability,
    scopedSlots: { customRender: 'missBugProbability' },
  },
]

const timePeriod = {
  all: 'all',
  year: 'year',
  quarter: 'quarter',
  month: 'month',
  lastMonth: 'lastMonth',
  custom: 'custom',
}

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea,
  },

  data() {
    return {
      keywords: new Set(),
      keywordsBackup: null,
      searchWord: '',
      timePeriod,
      affixed: false,
      loading: true,
      loadingQA: true,
      loadingRD: true,
      rdTableColumns,
      rdData: [],
      rdDataBackup: [],
      qaTableColumns,
      qaData: [],
      qaDataBackup: [],
      currentTab: 'RD',
      currentType: 'all',
      currentStartTime: this.getFirstDayOfMonth(),
      currentEndTime: this.getEndOfMonth(),
      currentPeriod: this.dayjs().date() < 10 ? timePeriod.lastMonth : timePeriod.month,
      dateRange: [],
      reletiveText: '月环比',
      codeAnalysis: {
        codeNum: 0,
        addCodeNum: 0,
        delCodeNum: 0,
        addProportion: 0.0,
        comparison: 0.0,
        comparisonDirection: 'up',
      },
      newCaseCount: {
        sum: 0,
        trend: 'hide',
        ratio: 0.0,
      },
      publicBetaTestCase: {
        caseNum: 0,
        manualCaseNum: 0,
        autoCaseNum: 0,
        autoProportion: 0.0,
      },
      typeOptions: [
        { name: '全部', value: 'all' },
        { name: '营收产品', value: 'products' },
        { name: '营收活动', value: 'activity' },
        { name: 'SC', value: 'SC' },
        { name: '增长', value: 'increase' },
        { name: '社交&基础', value: 'social' },
        { name: '媒体', value: 'basic' },
      ],
      timeOptions: [
        { name: '上月', value: timePeriod.lastMonth },
        { name: '本月', value: timePeriod.month },
        { name: '本季度', value: timePeriod.quarter },
        { name: '本年', value: timePeriod.year },
      ],
    }
  },
  watch: {
    currentPeriod: function (val) {
      if (val == this.timePeriod.month) {
        this.reletiveText = '月环比'
      } else if (val == this.timePeriod.quarter) {
        this.reletiveText = '季环比'
      } else if (val == this.timePeriod.year) {
        this.reletiveText = '年环比'
      }
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      console.log('currentPeriod', this.currentPeriod)
      this.changeTime(this.currentPeriod)
      this.initCodeAnalysis()
      this.initPublicBetaTestCase()
      this.initQAData()
      this.initRDData()
      this.getNewCaseCount()
      this.$nextTick(() => {
        this.loading = false
      })
    },
    refreshData() {
      console.log(
        `refreshData: tab = ${this.currentTab}, type = ${this.currentType}, stime = ${this.currentStartTime}, etime = ${this.currentEndTime}, period = ${this.currentPeriod}`
      )
      this.loadingQA = true
      this.initQAData()
      this.loadingRD = true
      this.initRDData()
      this.initCodeAnalysis()
      this.initPublicBetaTestCase()
      this.getNewCaseCount()
    },
    /** 获取QA表格数据 */
    initQAData() {
      axios
        .post('/QAPersonalController/getQAPersonalDetails', {
          projectName: this.currentType,
          stime: this.currentStartTime,
          etime: this.getEndOfMonth(),
          period: this.currentPeriod,
        })
        .then((response) => {
          let data = response.result
          for (let i = 0; i < data.length; i++) {
            data[i].index = i + 1
            data[i].missBugProbability = Math.round(Number(data[i].missBugProbability) * 10000) / 100
          }
          this.$nextTick(() => {
            this.qaData = data
          })
          this.qaDataBackup = data
          data.forEach((e) => this.keywords.add(e.name))
          this.keywordsBackup = this.keywords
          this.loadingQA = false
        })
        .catch((error) => {
          this.loadingQA = false
          console.log(error)
          this.$message.error('QA表格数据获取失败')
        })
    },
    /** 获取RD表格数据 */
    initRDData() {
      axios
        .post('/RDPersonalController/getRDPersonalDetails', {
          projectName: this.currentType,
          stime: this.currentStartTime,
          etime: this.getEndOfMonth(),
          period: this.currentPeriod,
        })
        .then((response) => {
          let data = response.data
          for (let i = 0; i < data.length; i++) {
            data[i].index = i + 1
            for (var key in data[i]) {
              if (data[i][key] == null) {
                data[i][key] = 0
              }
            }
            data[i].unresolvedBugProbability = Math.round(Number(data[i].unresolvedBugProbability) * 10000) / 100
            data[i].codeVsbugComparison = Math.round(Number(data[i].codeVsbugComparison) * 100000) / 100
          }
          this.$nextTick(() => {
            this.rdData = data
          })
          this.rdDataBackup = data
          data.forEach((e) => this.keywords.add(e.name))
          this.loadingRD = false
        })
        .catch((error) => {
          this.loadingRD = false
          console.log(error)
          this.$message.error('RD表格数据获取失败')
        })
    },
    /** 初始化代码行数数据 */
    initCodeAnalysis() {
      axios
        .post('/RDPersonalController/getCodeAnalysis', {
          projectName: this.currentType,
          stime: this.currentStartTime,
          etime: this.getEndOfMonth(),
          period: this.currentPeriod,
        })
        .then((response) => {
          this.codeAnalysis = response.data
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('代码行数数据获取失败')
        })
    },
    /** 初始化公测包回归case数数据 */
    initPublicBetaTestCase() {
      axios
        .post('/QAPersonalController/getPublicBetaTestCase', {
          stime: this.currentStartTime,
          etime: this.getEndOfMonth(),
          period: this.currentPeriod,
        })
        .then((response) => {
          this.publicBetaTestCase = response.data
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('公测包case数据获取失败')
        })
    },
    /** 初始化新需求case数数据 */
    getNewCaseCount() {
      axios
        .post('/QAPersonalController/getNewCaseCount', {
          stime: this.currentStartTime,
          etime: this.getEndOfMonth(),
          period: this.currentPeriod,
          projectName: this.currentType,
        })
        .then((response) => {
          this.newCaseCount = response.data
          Vue.set(this.newCaseCount, 'trend', response.data.trend)
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('新需求case数据获取失败')
        })
    },
    /** tab变更。QA/RD 两种tab */
    handleTabChange(tabKey) {
      this.currentTab = tabKey
    },
    /** 类型变更。全部、基础、PK等 */
    handleTypeChange(type) {
      this.currentType = type
      this.refreshData()
    },
    /** 时间段变更。当月、当季度等 */
    handleTimeChange(scope) {
      let time = scope.target.value
      this.changeTime(time)
      console.log('time changed ' + time)
      this.refreshData()
    },
    changeTime(time) {
      switch (time) {
        case 'lastMonth':
          this.currentStartTime = this.getFirstDayOfLastMonth()
          this.currentEndTime = this.getEndOfLastMonth()
          this.currentPeriod = this.timePeriod.lastMonth
          this.dateRange = this.getDateRange()
          break
        case 'month':
          this.currentStartTime = this.getFirstDayOfMonth()
          this.currentEndTime = this.getEndOfMonth()
          this.currentPeriod = this.timePeriod.month
          this.dateRange = this.getDateRange()
          break
        case 'year':
          this.currentStartTime = this.getFirstDayOfYear()
          this.currentEndTime = this.getEndOfMonth()
          this.currentPeriod = this.timePeriod.year
          this.dateRange = this.getDateRange()
          break
        case 'quarter':
          this.currentStartTime = this.getFirstDayOfQuarter()
          this.currentEndTime = this.getEndOfMonth()
          this.currentPeriod = this.timePeriod.quarter
          this.dateRange = this.getDateRange()
          break
        // TODO: all的时间段是多少？
        case 'all':
          this.currentStartTime = this.getFirstDayOfYear()
          this.currentEndTime = this.getEndOfMonth()
          this.currentPeriod = this.timePeriod.all
          this.dateRange = this.getDateRange()
          break
        default:
      }
    },
    /** 日期选择器范围变化 */
    handleDateRangeChange(range) {
      this.currentStartTime = this.dayjs(range[0].valueOf()).startOf('day').format('YYYY-MM-DD HH:mm:ss')
      this.currentEndTime = this.dayjs(range[1].valueOf()).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      this.currentPeriod = timePeriod.custom
      this.refreshData()
    },
    onSelect(value) {
      console.log('onSelect', value)
      this.filterData(value)
      this.searchWord = value
    },
    handleSearch(value) {
      if (_.isEmpty(value)) {
        this.qaData = this.qaDataBackup
        this.rdData = this.rdDataBackup
        this.keywords = this.keywordsBackup
      }
      console.log('handleSearch', value)
      this.filterData(value)
    },
    filterData(value) {
      this.keywords = Array.from(this.keywordsBackup).filter((e) => e.indexOf(value) >= 0)
      this.qaData = this.qaDataBackup.filter((e) => e.name.indexOf(value) >= 0)
      this.rdData = this.rdDataBackup.filter((e) => e.name.indexOf(value) >= 0)
      if (this.qaData.length == 0 && this.rdData.length > 0) {
        this.currentTab = 'RD'
      }
      if (this.qaData.length > 0 && this.rdData.length == 0) {
        this.currentTab = 'QA'
      }
    },
    // 获取初始时间，参考 https://day.js.org/docs/en/manipulate/start-of
    /** 获取当月第一天的格式化时间戳 */
    getFirstDayOfMonth() {
      return this.dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss')
    },
    /** 获取当季度第一天的格式化时间戳 */
    getFirstDayOfQuarter() {
      return this.dayjs().startOf('quarter').format('YYYY-MM-DD HH:mm:ss')
    },
    /** 获取当自然年第一天的格式化时间戳 */
    getFirstDayOfYear() {
      return this.dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss')
    },
    /** 获取当天结束时间的格式化时间戳 */
    getEndOfMonth() {
      return this.dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')
    },
    getFirstDayOfLastMonth() {
      return this.dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss')
    },
    getEndOfLastMonth() {
      return this.dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss')
    },
    getDateRange() {
      console.log('getDateRange', this.currentStartTime, this.currentEndTime)
      return [moment(this.currentStartTime, this.dateFormat), moment(this.currentEndTime, this.dateFormat)]
    },
    formatNumberString(number) {
      return Number(number).toLocaleString('en')
    },
    formatPercentString(number) {
      if (number == null) {
        return number
      }
      return Number(Number(number).toFixed(2))
    },
    affixChanged() {
      this.affixed = !this.affixed
    },
    disabledDate(current) {
      // 不能选择今天之后的日期
      return current && current > moment().endOf('day')
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
.affixed {
  padding: 12px;
  background-color: #e6f7ff;
  -webkit-transition: background-color 300ms linear;
  -ms-transition: background-color 300ms linear;
  transition: background-color 300ms linear;
}
.affix {
  padding: 12px;
  background-color: white;
  -webkit-transition: background-color 300ms linear;
  -ms-transition: background-color 300ms linear;
  transition: background-color 300ms linear;
}
</style>
