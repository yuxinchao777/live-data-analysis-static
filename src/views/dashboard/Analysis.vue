<template>
  <div>
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>本月</a>
              <a>本季度</a>
              <a>本年</a>
            </div>
            <a-range-picker :style="{ width: '256px' }" />
          </div>
          <a-tab-pane loading="true" tab="项目数量" key="1">
            <a-row>
              <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                <!-- <bar1 :data="barData" title="项目数量和延期提测" />-->
                 <bar1 />
              </a-col>
              <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                <!-- <bar :data="barData" title="项目数量和延期提测" /> -->
                <line1 />
              </a-col>
            </a-row>
          </a-tab-pane> </a-tabs
        >
      </div>

    </a-card>
    <br />

    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <a-tab-pane loading="true" tab="业务数据" key="1">
            <a-row :gutter="36">
              <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }" :span="3">
                <chart-card :loading="loading" title="项目总数" total="120">
                  <a-tooltip title="指标说明" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <span slot="term" style="color: #ff0000">A1:20 A3:30 A2:40 A4:30</span>
                  </div>
                  <template slot="footer"
                    ><trend flag="up" style="margin-right: 16px">
                      <span slot="term">月环比</span>
                      12%
                    </trend></template
                  >
                </chart-card>
              </a-col>
              <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }" :span="3">
                <chart-card :loading="loading" title="开发饱和度" total="86%">
                  <a-tooltip title="指标说明" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="96" height="8px" />
                  </div>
                  <template slot="footer"
                    ><trend flag="up" style="margin-right: 16px">
                      <span slot="term">月环比</span>
                      12%
                    </trend></template
                  >
                </chart-card>
              </a-col>
              <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }" :span="3">
                <chart-card :loading="loading" title="测试饱和度" total="78%">
                  <a-tooltip title="指标说明" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="90" height="8px" />
                  </div>
                  <template slot="footer"
                    ><trend flag="up" style="margin-right: 16px">
                      <span slot="term">月环比</span>
                      12%
                    </trend></template
                  >
                </chart-card>
              </a-col>
              <div class="ant-table-wrapper" style="margin-left: 40px">
                <a-table :columns="rdcolumns" :data-source="rddata" style="width: 1000px">
                  <template slot="name" slot-scope="text">{{ text }} </template>
                  <template slot="projectdetail" slot-scope="text">
                    <a>点击查看全部项目信息</a>
                  </template>
                </a-table>
              </div>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="antd-pro-pages-dashboard-analysis-salesCard"
            :loading="loading"
            :bordered="false"
            :style="{ width: '1075px', height: '100%' }"
          >
            <div class="salesCard">
              <a-tabs
                default-active-key="1"
                size="large"
                :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }"
              >
                <a-tab-pane loading="true" tab="质量数据" key="1">
                  <a-row>
                    <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                      <div>
                       <!--  <a-button-group style="margin-right: 4px">
                          <a-button type="primary">内网BUG数</a-button>
                          <a-button>外网BUG数</a-button>
                        </a-button-group> -->
                        <a-radio-group v-model="status" default-value="beta" button-style="solid">
          <a-radio-button value="beta">内网BUG数</a-radio-button>
          <a-radio-button value="prod">外网BUG数</a-radio-button>

        </a-radio-group>
                      </div>
                      <br />
                      <div>
                        <!-- style="width: calc(100% - 240px);" -->
                        <div>
                          <pie
                            :data="testData"
                            :height="248"
                            :lineWidth="30"
                            hasLegend
                            :total="() => testData.reduce((acc, item) => (acc += item.y), 0)"
                            subTitle="内网BUG数"
                          />
                          <!-- <v-chart :force-fit="true" :height="405" :data="pieData" :scale="pieScale">
                            <v-tooltip :showTitle="false" dataKey="item*percent" />
                            <v-axis />

                           <v-legend dataKey="item" />
                            <v-pie position="percent" color="item" :vStyle="pieStyle" />
                            <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />

                          </v-chart> -->
                        </div>
                      </div>
                    </a-col>
                    <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                      <bar2 />
                    </a-col>
                  </a-row>

                  <div class="ant-table-wrapper" style="margin-left: 5px">
                    <a-table :columns="qualityColumns" :data-source="qualityData" style="width: 1000px">
                      <template slot="name" slot-scope="text">{{ text }}</template>
                      <template slot="projectdetail" slot-scope="text">
                        <a>点击查看全部项目信息</a>
                      </template>
                    </a-table>
                  </div>
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
import moment from 'moment'
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
import { Line } from '@antv/g2plot'
import Pie from '@/components/Charts/Pie'
import Line1 from '@/components/Charts/Line1'
import Bar1 from '@/components/Charts/Bar1'
import Bar2 from '@/components/Charts/Bar2'

const rdcolumns = [
  {
    title: '业务线',
    dataIndex: 'project',
    key: 'project',
    width: 10,
  },
  {
    title: '项目数',
    dataIndex: 'functions',
    key: 'function',
    width: 10,
  },
  {
    title: '开发人日',
    dataIndex: 'devdays',
    key: 'devdays',
    width: 10,
  },
  {
    title: '测试人日',
    dataIndex: 'testdays',
    key: 'testdays',
    width: 10,
  },
  {
    title: 'Case数',
    dataIndex: 'cases',
    key: 'cases',
    width: 10,
  },
  {
    title: '延期提测项目占比',
    dataIndex: 'delayfunctionrate',
    key: 'delayfunctions',
    width: 10,
    align: 'center',
  },
  {
    title: '详情',
    key: 'projectdetail',
    width: 10,
    scopedSlots: { customRender: 'projectdetail' },
  },
]
const qualityColumns = [
  {
    title: '业务线',
    dataIndex: 'project',
    key: 'project',
    width: 10,
  },
  {
    title: '内网BUG数',
    dataIndex: 'betabugs',
    key: 'betabugs',
    width: 10,
    align: 'center',
  },
  {
    title: 'BUG解决率',
    dataIndex: 'bugfixrate',
    key: 'bugfixrate',
    width: 10,
    align: 'center',
  },
  {
    title: 'BUG率',
    dataIndex: 'bugrate',
    key: 'bugrate',
    width: 10,
    align: 'center',
  },
  {
    title: '线上BUG数',
    dataIndex: 'probugs',
    key: 'probugs',
    width: 10,
    align: 'center',
  },
  {
    title: '提测质量',
    dataIndex: 'smokequality',
    key: 'smokequality',
    width: 10,
    align: 'center',
  },
  {
    title: '详情',
    key: 'projectdetail',
    width: 10,
    align: 'center',
    scopedSlots: { customRender: 'projectdetail' },
  },
]
const rddata = [
  {
    key: '1',
    project: '营收产品',
    functions: 2234,
    devdays: 1123,
    testdays: 1234,
    cases: 3999,
    delayfunctionrate: '50%',
  },
  {
    key: '2',
    project: '营收活动',
    functions: 2234,
    devdays: 1123,
    testdays: 1234,
    cases: 3999,
    delayfunctionrate: '50%',
  },
  {
    key: '3',
    project: 'pk',
    functions: 2234,
    devdays: 1123,
    testdays: 1234,
    cases: 3999,
    delayfunctionrate: '50%',
  },
  {
    key: '4',
    project: '社交',
    functions: 2234,
    devdays: 1123,
    testdays: 1234,
    cases: 3999,
    delayfunctionrate: '50%',
  },
  {
    key: '5',
    project: '增长',
    functions: 2234,
    devdays: 1123,
    testdays: 1234,
    cases: 3999,
    delayfunctionrate: '50%',
  },
  {
    key: '6',
    project: '基础',
    functions: 2234,
    devdays: 1123,
    testdays: 1234,
    cases: 3999,
    delayfunctionrate: '50%',
  },
]
const qualityData = [
  {
    key: '1',
    project: '营收产品',
    betabugs: 234,
    bugfixrate: '80%',
    bugrate: '10%',
    probugs: 10,
    smokequality: '50%',
  },
  {
    key: '2',
    project: '营收活动',
    betabugs: 234,
    bugfixrate: '80%',
    bugrate: '10%',
    probugs: 10,
    smokequality: '50%',
  },
  {
    key: '3',
    project: 'pk',
    betabugs: 234,
    bugfixrate: '80%',
    bugrate: '10%',
    probugs: 10,
    smokequality: '50%',
  },
  {
    key: '4',
    project: '社交',
    betabugs: 234,
    bugfixrate: '80%',
    bugrate: '10%',
    probugs: 10,
    smokequality: '50%',
  },
  {
    key: '5',
    project: '增长',
    betabugs: 234,
    bugfixrate: '80%',
    bugrate: '10%',
    probugs: 10,
    smokequality: '50%',
  },
  {
    key: '6',
    project: '基础',
    betabugs: 234,
    bugfixrate: '80%',
    bugrate: '10%',
    probugs: 10,
    smokequality: '50%',
  },
]
const barData = [
  { x: '营收产品', y: 4544 },
  { x: '营收活动', y: 3321 },
  { x: 'pk', y: 3113 },
  { x: '社交', y: 2341 },
  { x: '增长', y: 1231 },
  { x: '基础', y: 1231 },
]
const barData2 = []
for (let i = 0; i < 12; i += 1) {
/*   barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  }) */
  barData2.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  })
}

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100,
  })
}

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
const searchData = []
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2),
  })
}

const DataSet = require('@antv/data-set')

const bugData = [
  { item: '营收产品', count: 32.2 },
  { item: '营收活动', count: 21 },
  { item: 'pk', count: 17 },
  { item: '社交', count: 13 },
  { item: '增长', count: 9 },
  { item: '基础', count: 7.8 },
]
const testData = [
  { x: '营收产品', y: 4544 },
  { x: '营收活动', y: 3321 },
  { x: 'pk', y: 3113 },
  { x: '社交', y: 2341 },
  { x: '增长', y: 1231 },
  { x: '基础', y: 1231 },
]
const pieScale = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%',
  },
]

const dv = new DataSet.View().source(bugData)
dv.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent',
})
const pieData = dv.rows

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
    Pie,
    Line1,
    Bar1,
    Bar2,
  },
  data() {
    return {
      loading: true,
      rankList,

      // 搜索用户数
      searchUserData,
      searchUserScale,
      searchTableColumns,
      searchData,
      rddata,
      rdcolumns,
      barData,
      barData2,
      qualityData,
      qualityColumns,
      //
      pieScale,
      pieData,
      bugData,
      testData,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1,
      },
    }
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  mounted () {
    const data = [
      { year: '1991', value: 3 },
      { year: '1992', value: 4 },
      { year: '1993', value: 3.5 },
      { year: '1994', value: 5 },
      { year: '1995', value: 4.9 },
      { year: '1996', value: 6 },
      { year: '1997', value: 7 },
      { year: '1998', value: 9 },
      { year: '1999', value: 13 },
    ];

  },

  computed: {
    total() {
      return this.testData.reduce((total, item) => (total += item.count), 0)
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
</style>
