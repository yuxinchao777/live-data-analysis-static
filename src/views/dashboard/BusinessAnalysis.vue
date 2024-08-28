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
          <a-tab-pane tab="项目数量" key="1">
            <a-row>
              <!-- 必须保证相同类型组件的ID为字符串且不一致，否则组件内render渲染会有问题！！！ -->
              <a-col :span="12">
                <a-card :bordered="false" class="datacard" title="项目统计">
                  <AntBar
                    :id="'busiBar' + businessKey"
                    :data="businessData"
                    :isStack="false"
                    :isGroup="true"
                    xField="project"
                    yField="count"
                    seriesField="name"
                  />
                </a-card>
              </a-col>
              <a-col :span="12">
                <a-card :bordered="false" class="datacard" title="人力统计">
                  <AntLine
                    id="development"
                    :data="developmentHours"
                    xField="projectName"
                    yField="jobDays"
                    seriesField="taskType"
                  />
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
    <br />

    <!-- 业务数据 -->
    <a-card :loading="loading" :bordered="false" :body-style="{ paddingLeft: '16px' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <a-tab-pane tab="业务数据" key="1">
            <a-row :gutter="36">
              <a-col :style="{ marginBottom: '24px' }" :span="7">
                <chart-card :loading="loading" title="项目总数" :total="functionRank.sumFunciton">
                  <a-tooltip title="所有业务线需求总数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <span slot="term" style="color: #ff0000"
                      >A1:{{ functionRank.A1 }} A2:{{ functionRank.A2 }} A3:{{ functionRank.A3 }} A4:{{
                        functionRank.A4
                      }}
                    </span>
                  </div>
                  <template slot="footer">
                    <trend
                      :flag="functionRank.trend === 'up' ? 'up' : 'down'"
                      :style="{
                        visibility: functionRank.trend == 'hide' ? 'hidden' : 'visible',
                        'margin-right': '16px',
                      }"
                    >
                      <span slot="term">{{ reletiveText }}</span>
                      {{ functionRank.FunctionChainComparison }}
                    </trend>
                  </template>
                </chart-card>
              </a-col>
              <a-col :span="7" :style="{ marginBottom: '24px' }">
                <chart-card :loading="loading" title="开发饱和度" :total="rdSaturation.rdSaturation">
                  <a-tooltip placement="topLeft" title="需求开发工时总和/(工作日*测试人数)" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <mini-progress
                      color="rgb(19, 194, 194)"
                      :target="100"
                      :percentage="rdSaturation.rdSaturationNum"
                      height="8px"
                    />
                  </div>
                  <template slot="footer">
                    <trend
                      :flag="rdSaturation.trend === 'up' ? 'up' : 'down'"
                      :style="{
                        visibility: rdSaturation.trend == 'hide' ? 'hidden' : 'visible',
                        'margin-right': '16px',
                      }"
                    >
                      <span slot="term">{{ reletiveText }}</span>
                      {{ rdSaturation.changeSaturation }}
                    </trend>
                  </template>
                </chart-card>
              </a-col>
              <a-col :style="{ marginBottom: '24px' }" :span="7">
                <chart-card :loading="loading" title="测试饱和度" :total="qaSaturation.qaSaturation">
                  <a-tooltip placement="topLeft" title="项目累计测试人日/(工作日*测试人数)" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <mini-progress
                      color="rgb(19, 194, 194)"
                      :target="100"
                      :percentage="qaSaturation.qaSaturationNum"
                      height="8px"
                    />
                  </div>
                  <template slot="footer">
                    <trend
                      :flag="qaSaturation.trend === 'up' ? 'up' : 'down'"
                      :style="{
                        visibility: qaSaturation.trend == 'hide' ? 'hidden' : 'visible',
                        'margin-right': '16px',
                      }"
                    >
                      <span slot="term">{{ reletiveText }}</span>
                      {{ qaSaturation.changeSaturation }}
                    </trend>
                  </template>
                </chart-card>
              </a-col>
            </a-row>
            <!-- 业务线表格 -->
            <a-row>
              <a-col :span="21">
                <div class="ant-table-wrapper" style="margin-left: 40px">
                  <a-table
                    row-key="projectName"
                    :columns="functionColumns"
                    :data-source="functionData"
                    :pagination="false"
                  >
                    <template slot="rdSumJobDays" slot-scope="record">
                      <span>
                        {{ getFixedNumber(record.rdSumJobDays) }}
                      </span>
                    </template>
                    <template slot="qaSumJobDays" slot-scope="record">
                      <span>
                        {{ getFixedNumber(record.qaSumJobDays) }}
                      </span>
                    </template>
                    <template slot="proportioOfDelayed" slot-scope="record">
                      <div v-if="!inRange(record.proportioOfDelayed, 0, 0)">
                        <a-tooltip placement="top" title="延期提测比例合格线为0%">
                          <span class="warningColumn">
                            {{ record.proportioOfDelayed }}
                          </span>
                        </a-tooltip>
                      </div>
                      <div v-else>
                        {{ record.proportioOfDelayed }}
                      </div>
                    </template>
                    <template slot="projectdetail" slot-scope="record">
                      <a-button
                        type="link"
                        style="color: #40a9ff"
                        @click="checkProjectDetail(record.projectId, record.projectName)"
                        >点击查看全部项目信息</a-button
                      >
                    </template>
                  </a-table>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

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
                <a-tab-pane tab="质量数据" key="1" :style="{ paddingRight: '24px', paddingLeft: '24px' }">
                  <a-row :gutter="48">
                    <a-col :span="12">
                      <div>
                        <a-radio-group
                          v-model="status"
                          default-value="beta"
                          button-style="solid"
                          @change="handleBugEnvChange"
                        >
                          <a-radio-button value="beta">内网BUG数</a-radio-button>
                          <a-radio-button value="prod">外网BUG数</a-radio-button>
                        </a-radio-group>
                      </div>
                      <br />
                      <div style="padding-top: 72px">
                        <!-- 绑定key，修改key后强制刷新pie component 参考https://michaelnthiessen.com/force-re-render/-->
                        <a-spin :spinning="tableLoading">
                          <pie
                            :key="pieKey"
                            :data="pieData"
                            :height="248"
                            :lineWidth="30"
                            hasLegend
                            :total="() => pieData.reduce((acc, item) => (acc += item.y), 0)"
                            :subTitle="currentEnv == 'beta' ? '内网BUG' : '外网BUG'"
                          />
                        </a-spin>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <a-card title="外网BUG级别汇总" :bordered="false">
                        <bar2
                          id="fault"
                          :data="faultData"
                          xField="projectName"
                          yField="sumBug"
                          seriesField="level"
                          :style="{ paddingBottom: '24px' }"
                      /></a-card>
                    </a-col>
                  </a-row>
                  <!-- 测试质量表格 -->
                  <a-row>
                    <a-col :span="21">
                      <div class="ant-table-wrapper" style="margin-left: 5px">
                        <a-table
                          row-key="projectName"
                          :columns="qualityColumns"
                          :data-source="qualityData"
                          :pagination="false"
                          :loading="tableLoading"
                        >
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
                          <template slot="bugResolutionRate" slot-scope="record">
                              <div v-if="!inRange(record.bugResolutionRate, 90, 100)">
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
                          <template slot="qualitydetail" slot-scope="record">
                            <a-button
                              type="link"
                              style="color: #40a9ff"
                              @click="checkQualityDetail(record.projectId, record.projectName)"
                              >点击查看全部项目信息</a-button
                            >
                          </template>
                        </a-table>
                      </div>
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
import bar2 from '@/components/Charts/Bar2'
import 'moment/locale/zh-cn'

const timePeriod = {
  all: 'all',
  year: 'year',
  quarter: 'quarter',
  month: 'month',
  lastMonth: 'lastMonth',
  custom: 'custom',
}

const functionColumns = [
  {
    title: '业务线',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 100,
  },
  {
    title: '项目数',
    dataIndex: 'functionSum',
    key: 'functionSum',
  },
  {
    title: '开发人日',
    key: 'rdSumJobDays',
    scopedSlots: { customRender: 'rdSumJobDays' },
  },
  {
    title: '测试人日',
    key: 'qaSumJobDays',
    scopedSlots: { customRender: 'qaSumJobDays' },
  },
  {
    title: 'Case数',
    dataIndex: 'caseCount',
    key: 'caseCount',
  },
  // {
  //   title: '延期提测项目占比',
  //   key: 'proportioOfDelayed',
  //   align: 'center',
  //   scopedSlots: { customRender: 'proportioOfDelayed' },
  // },
  {
    title: '详情',
    key: 'projectdetail',
    scopedSlots: { customRender: 'projectdetail' },
    align: 'center',
  },
]
const qualityColumns = [
  {
    title: '业务线',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 100,
  },
  {
    title: '内网BUG数',
    dataIndex: 'sumBug',
    key: 'sumBug',
    align: 'center',
  },
  {
    title: 'BUG解决率',
    key: 'bugResolutionRate',
    align: 'center',
    scopedSlots: { customRender: 'bugResolutionRate' },
  },
  {
    title: 'BUG率',
    dataIndex: 'bugRate',
    key: 'bugRate',
    align: 'center',
  },
  {
    title: '线上BUG数',
    dataIndex: 'onlineBug',
    key: 'onlineBug',
    align: 'center',
  },
  {
    title: '提测质量',
    key: 'rdTestQuality',
    align: 'center',
    scopedSlots: { customRender: 'rdTestQuality' },
  },
  {
    title: '详情',
    key: 'qualitydetail',
    align: 'center',
    scopedSlots: { customRender: 'qualitydetail' },
  },
]

const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment().add(i, 'days').format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10),
  })
}
const searchUserScale = [
  {
    dataKey: 'x',
    alias: '时间',
  },
  {
    dataKey: 'y',
    alias: '用户数',
    min: 0,
    max: 10,
  },
]

const searchTableColumns = [
  {
    dataIndex: 'index',
    title: '',
    width: 90,
  },
  {
    dataIndex: 'keyword',
    title: '搜索关键词',
  },
  {
    dataIndex: 'count',
    title: '用户数',
  },
  {
    dataIndex: 'range',
    title: '周涨幅',
    align: 'right',
    sorter: (a, b) => a.range - b.range,
    scopedSlots: { customRender: 'range' },
  },
]

export default {
  name: 'BusinessAnalysis',
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
    bar2,
  },
  data() {
    return {
      timePeriod,
      loading: true,
      affixed: false,
      status: 'beta',
      pieKey: 0,
      businessKey: 0,
      functionData: [],
      faultData: [],
      functionColumns,
      qualityData: [],
      qualityColumns,
      functionsum: 0,
      reletiveText: '月环比',
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1,
      },
      functionRank: {
        A1: 0,
        A2: 0,
        A3: 0,
        A4: 0,
        sumFunciton: 0,
        lastNumSum: 0,
        FunctionChainComparison: '0%',
        trend: 'up',
      },
      rdSaturation: {
        rdjobDays: 0,
        workDays: 0,
        rdLists: 0,
        rdSaturation: '0.00%',
        lrdSaturation: 0,
        trend: 'up',
        changeSaturation: '0.00%',
        rdSaturationNum: 0,
      },
      qaSaturation: {
        qajobDays: 0,
        workDays: 0,
        qaLists: 0,
        qaSaturation: '0.00%',
        trend: 'up',
        lqaSaturation: 0.0,
        changeSaturation: '0.00%',
        qaSaturationNum: 0,
      },
      businessData: [],
      developmentHours: [],
      betaBugData: [],
      prodBugData: [],
      pieData: [
        { x: '媒体', y: 0 },
        { x: '社交&基础', y: 0 },
        { x: '视频SC组', y: 0 },
        { x: '营收产品', y: 0 },
        { x: '营收活动', y: 0 },
        { x: '增长', y: 0 },
      ],
      bulletData: [],
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
      this.getBusinessCount()
      this.getDevelopmentHours()
      this.getBetaBugCount()
      this.getProdBugsCount()
      this.getQualityData()
      this.getFunctionData()
      this.funcitonTotal()
      this.getOverviewAnalysis()
      this.getFaultData()
    },
    refreshData() {
      this.tableLoading = true
      console.log(
        `refreshData: type = ${this.currentType}, stime = ${this.currentStartTime}, etime = ${this.currentEndTime}, period = ${this.currentPeriod}`
      )
      this.getBusinessCount()
      this.getDevelopmentHours()
      this.getBetaBugCount()
      this.getProdBugsCount()
      this.getOverviewAnalysis()
      this.getFaultData()
      this.getQualityData()
      this.getFunctionData()
      this.$store.commit('RECORD_PERIOD', {
        period: this.currentPeriod,
        start: this.currentStartTime,
        end: this.currentEndTime,
      })
    },
    //计算项目总数
    funcitonTotal() {
      axios
        .post('/BusinessController/getBusinessVolume', {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
        })
        .then((response) => {
          var functionsum = 0
          response.data.forEach((e) => {
            functionsum = functionsum + e.functionCount
          })
          this.functionsum = functionsum
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('计算项目总数错误')
        })
    },
    //跳转质量数据详细页面
    checkQualityDetail(projectId, projectName) {
      this.$router.push({
        path: '/dashboard/qualitydetail',
        query: {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
          projectId: projectId,
          projectName: projectName,
        },
      })
    },
    //跳转项目数据详细页面
    checkProjectDetail(projectId, projectName) {
      this.$router.push({
        path: '/dashboard/projectdetail',
        query: {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
          projectId: projectId,
          projectName: projectName,
        },
      })
    },
    getFunctionData() {
      axios
        .post('/BusinessController/getQualityData', {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
        })
        .then((response) => {
          this.functionData = response.data
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('业务数据获取失败')
        })
    },
    /**
     * 项目总数
     * 开发饱和度
     * 测试饱和度
     */
    getOverviewAnalysis() {
      axios
        .post('/BusinessController/overviewAnalysis', {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
          period: this.currentPeriod,
        })
        .then((response) => {
          var res = response.data
          this.functionRank = res[0]
          this.rdSaturation = res[1]
          this.qaSaturation = res[2]
          this.rdSaturation.rdSaturationNum = parseInt(this.rdSaturation.rdSaturation)
          this.qaSaturation.qaSaturationNum = parseInt(this.qaSaturation.qaSaturation)
          this.$nextTick(() => {
            this.functionRank = res[0]
            this.rdSaturation = res[1]
            this.qaSaturation = res[2]
          })
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('项目总数、开发饱和度、测试饱和度获取失败')
        })
    },
    getQualityData() {
      axios
        .post('/BusinessController/getBetaBugCount', {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
        })
        .then((response) => {
          let data = response.data
          data.forEach((e) => {
            if (!('onlineBug' in e)) {
              e.onlineBug = 0
            }
          })
          this.qualityData = response.data
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('质量数据获取失败')
        })
    },
    /**
     * 获取业务线下的需求数量和延期提测需求数量
     * 项目数量-项目统计-柱形图
     */
    getBusinessCount() {
      axios
        .post('/BusinessController/getBusinessVolume', {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
        })
        .then((response) => {
          let data = []
          response.data.forEach((e) => {
            data.push({
              name: '项目数量',
              project: e.project_name,
              count: e.functionCount,
            })
            data.push({
              name: '延期提测项目数量',
              project: e.project_name,
              count: e.delayCount,
            })
          })
          this.businessData = data
          this.businessKey += 1
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('项目统计数据获取失败')
        })
    },
    /**
     * 各个业务线下对应开发测试人日
     * 项目数量-人力统计-折线图
     */
    getDevelopmentHours() {
      axios
        .post('/BusinessController/getDevelopmentHours', {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
        })
        .then((response) => {
          let data = []
          response.data.forEach((e) => {
            data.push({
              taskType: '开发人日',
              projectName: e.ProjectName,
              jobDays: e.rdjobDays,
            })
            data.push({
              taskType: '测试人日',
              projectName: e.ProjectName,
              jobDays: e.qajobDays,
            })
          })
          this.developmentHours = data
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('人力统计数据获取失败')
        })
    },
    /**
     * 质量数据-内网bug数
     * 更新表格和饼形图
     */
    getBetaBugCount() {
      axios
        .post('/BusinessController/getBetaBugCount', {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
        })
        .then((response) => {
          this.tableLoading = false
          let data = response.data.map((item) => {
            return { x: item.projectName, y: item.sumBug }
          })
          data = data.sort((a, b) => a.x.localeCompare(b.x, 'zh-CN'))
          this.betaBugData = data
          if (this.currentEnv == 'beta') {
            this.pieData = data
            // 饼图绑定的key增加1，强制re-render
            this.pieKey += 1
          }
        })
        .catch((error) => {
          this.tableLoading = false
          console.log(error)
          this.$message.error('内网bug数据获取失败')
        })
    },
    /**
     * 质量数据-外网bug数
     * 仅更新饼形图
     */
    getProdBugsCount() {
      axios
        .post('/VipOrderController/getVipOrder', {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
        })
        .then((response) => {
          let data = response.data.map((item) => {
            return { x: item.name, y: Number(item.value) }
          })
          data = data.sort((a, b) => a.x.localeCompare(b.x, 'zh-CN'))
          this.prodBugData = data
          if (this.currentEnv == 'prod') {
            this.pieData = data
            // 饼图绑定的key增加1，强制re-render
            this.pieKey += 1
          }
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('外网bug数据获取失败')
        })
    },
    getVipOrderDuration() {
      axios
        .post('VipOrderController/getVipOrderDuration', {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
        })
        .then((response) => {
          let data = response.data.map((item) => {
            return {
              businessTeam: item.businessTeam,
              measures: [Number(item.respond), Number(item.duration)],
              ranges: [24, 48, 72],
              // ranges: [2, 8, 12],
              target: 12,
            }
          })
          data = data.sort((a, b) => a.businessTeam.localeCompare(b.businessTeam, 'zh-CN'))
          this.bulletData = data
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('外网bug数据获取失败')
        })
    },
    /**
     * 质量数据
     * 故障堆叠图
     */
    getFaultData() {
      axios
        .post('/BugTicketController/getBugTicketSummary', {
          stime: this.currentStartTime,
          etime: this.currentEndTime,
        })
        .then((response) => {
          let data = []
          response.data.forEach((e) => {
            data.push({
              sumBug: e.sumBug,
              projectName: e.projectName,
              level: e.level,
            })
          })
          data = data.sort((a, b) => a.level.localeCompare(b.level, 'en-US'))
          this.faultData = data
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('故障数据获取失败')
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
    /** bug环境变化 */
    handleBugEnvChange(env) {
      this.currentEnv = env.target.value
      console.log('currentEnv', this.currentEnv)
      if (env.target.value === 'beta') {
        this.pieData = this.betaBugData
      } else {
        this.pieData = this.prodBugData
      }
      this.pieKey += 1
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
    getFixedNumber(day) {
      return Math.round(Number(day) * 100) / 100
    },
    getDateRange() {
      console.log('getDateRange', this.currentStartTime, this.currentEndTime)
      return [moment(this.currentStartTime, this.dateFormat), moment(this.currentEndTime, this.dateFormat)]
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
  computed: {},
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
.datacard {
  padding: 20px;
}
</style>
