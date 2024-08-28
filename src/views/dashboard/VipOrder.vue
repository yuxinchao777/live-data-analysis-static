<template>
  <div>
    <!-- 项目数量 -->
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <a-affix :offset-top="10" @change="affixChanged">
              <div :class="affixed ? 'affixed' : 'affix'">
                <div class="extra-item">
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
                </div>
                <a-range-picker
                  :disabled-date="disabledDate"
                  @change="handleDateRangeChange"
                  :style="{ width: '256px', 'margin-right': '24px' }"
                  :value="dateRange"
                />
              </div>
            </a-affix>
          </div>
          <a-tab-pane tab="说明" key="1">
            <a-card :bordered="false" class="datacard" style="font-size:16px;">
              <h3>超时升级机制</h3>
              <span style="white-space: pre-wrap">
                {{
                  `一般问题：工作时间30分钟内响应。2小时内定位并解决。否则，升级到组长处理。\n
                  重要问题：工作时间10分钟内响应，1小时内定位并解决。否则，升级到组长处理。\n
                  紧急问题：1分钟响应，10分钟内止损。否则，进入故障应急流程。\n\n
                  故障应急流程：\n`
                }}
              </span>
              <a href="https://moji.wemomo.com/doc#/detail/39621" target="_blank" style="font-size:16px;white-space: pre-wrap;"> {{ `\t故障应急处理规范` }}</a>
              <br />
              <a href="https://moji.wemomo.com/doc#/detail/146563" target="_blank" style="font-size:16px;white-space: pre-wrap;"> {{ `\t线上问题处理规范` }}</a>
              <br />
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
    <br />

    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :span="24">
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :bordered="false" :style="{ height: '100%' }">
            <div class="salesCard">
              <a-tabs
                default-active-key="1"
                size="large"
                :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }"
              >
                <a-tab-pane tab="工单响应数据" key="1" :style="{ padding: '24px' }">
                  <a-row :gutter="48">
                    <a-col :span="12">
                      <a-card :bordered="false" class="datacard" title="工单响应和处理时间">
                        <AntBar
                          :id="'respondBar' + respondKey"
                          :data="respondData"
                          :isStack="true"
                          :isGroup="false"
                          xField="businessTeam"
                          yField="time"
                          seriesField="name"
                        />
                      </a-card>
                    </a-col>
                    <a-col :span="12">
                      <a-card :bordered="false" class="datacard" title="催单次数">
                        <AntBar
                          :id="'hurryBar' + hurryKey"
                          :data="hurryData"
                          :isStack="false"
                          :isGroup="true"
                          xField="hurryUpCount"
                          yField="count"
                          :seriesField="null"
                        />
                      </a-card>
                    </a-col>
                  </a-row>
                </a-tab-pane>
              </a-tabs>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import moment from 'moment'
import { ChartCard, MiniArea, MiniBar, MiniProgress, Bar, Trend, NumberInfo, MiniSmoothArea } from '@/components'
import { baseMixin } from '@/store/app-mixin'
import Pie from '@/components/Charts/Pie'
import AntLine from '@/components/Charts/AntLine'
import AntBar from '@/components/Charts/AntBar'
import AntBullet from '@/components/Charts/AntBullet'
import Bar2 from '@/components/Charts/Bar2'
import 'moment/locale/zh-cn'

const timePeriod = {
  all: 'all',
  year: 'year',
  quarter: 'quarter',
  month: 'month',
  lastMonth: 'lastMonth',
  custom: 'custom',
}

export default {
  name: 'VipOrder',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea,
    Pie,
    AntLine,
    AntBar,
    AntBullet,
    Bar2,
  },
  data() {
    return {
      timePeriod,
      loading: true,
      affixed: false,
      status: 'beta',
      respondKey: 0,
      hurryKey: 0,
      functionsum: 0,
      reletiveText: '月环比',

      respondData: [],
      hurryData: [],
      tableLoading: true,
      currentEnv: 'beta',
      currentType: 'all',
      currentStartTime: this.getFirstDayOfMonth(),
      currentEndTime: this.getEndOfMonth(),
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      dateRange: [],
      currentPeriod: timePeriod.month,
      typeOptions: [
        { name: '全部', value: 'all' },
        { name: '营收产品', value: 'products' },
        { name: '营收活动', value: 'activity' },
        { name: 'PK', value: 'pk' },
        { name: '增长', value: 'increase' },
        { name: '社交&内容', value: 'social' },
        { name: '基础', value: 'basic' },
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
      console.log('currentPeriod watch', val)
      if (val == this.timePeriod.month || val == this.timePeriod.lastMonth) {
        this.reletiveText = '月环比'
      }
      if (val == this.timePeriod.quarter) {
        this.reletiveText = '季环比'
      }
      if (val == this.timePeriod.year) {
        this.reletiveText = '年环比'
      }
    },
  },
  created() {
    this.init()
    this.loading = false
  },
  mounted() {},
  methods: {
    init() {
      let period = this.$store.state.app.period
      this.currentPeriod = period.period
      this.changeTime(this.currentPeriod)
      if (period.start !== null && period.end !== null) {
        this.currentStartTime = period.start
        this.currentEndTime = period.end
      }
      this.dateRange = this.getDateRange()
      this.getVipOrderDuration()
      this.getVipOrderHurryCount()
    },
    refreshData() {
      this.tableLoading = true
      console.log(
        `refreshData: type = ${this.currentType}, stime = ${this.currentStartTime}, etime = ${this.currentEndTime}, period = ${this.currentPeriod}`
      )
      this.getVipOrderDuration()
      this.getVipOrderHurryCount()

      this.$store.commit('RECORD_PERIOD', {
        period: this.currentPeriod,
        start: this.currentStartTime,
        end: this.currentEndTime,
      })
    },
    getVipOrderDuration() {
      axios
        .post('VipOrderController/getVipOrderDuration', {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
        })
        .then((response) => {
          let data = []
          response.data.forEach((item) => {
            data.push({ businessTeam: item.businessTeam, time: item.duration, name: '处理时间(小时)' })
            data.push({ businessTeam: item.businessTeam, time: item.respond, name: '响应时间(小时)' })
          })
          this.respondData = data
          this.respondKey += 1
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('工单响应时间获取失败')
        })
    },
    getVipOrderHurryCount() {
      axios
        .post('VipOrderController/getVipOrderHurryCount', {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
        })
        .then((response) => {
          this.hurryData = response.data.map((item) => {
            return { hurryUpCount: item.hurryUpCount + '次', count: item.count }
          })
          this.hurryKey += 1
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('工单催单数量获取失败')
        })
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
    formatNumberString(number) {
      return Number(number).toLocaleString('en')
    },
    affixChanged() {
      this.affixed = !this.affixed
    },
    disabledDate(current) {
      // 不能选择今天之后的日期
      return current && current > moment().endOf('day')
    },
    getPercent(rate) {
      Math.round(Number(rate) * 10000) / 100
    },
    getDateRange() {
      console.log('getDateRange', this.currentStartTime, this.currentEndTime)
      return [moment(this.currentStartTime, this.dateFormat), moment(this.currentEndTime, this.dateFormat)]
    },
  },
  computed: {},
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

.affix {
  padding-right: 24px;
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
.timeRadioButtons.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  z-index: 1;
  color: #1890ff;
  background: #fff;
  border-color: #ffffff;
  -webkit-box-shadow: -1px 0 0 0 #ffffff;
  box-shadow: -1px 0 0 0 #ffffff;
}

.affixed {
  background-color: #e6f7ff;
  -webkit-transition: background-color 300ms linear;
  -ms-transition: background-color 300ms linear;
  transition: background-color 300ms linear;
}
.affix {
  background-color: white;
  -webkit-transition: background-color 300ms linear;
  -ms-transition: background-color 300ms linear;
  transition: background-color 300ms linear;
}
</style>
