<template>
  <div>
    <div v-if="showtable">
      <div>
        <!--业务线下拉框-->
        <a-select default-value="商业技术部" style="width: 150px; margin-left: 5px">
          <a-select-option
            v-for="group in qadata_groups"
            :key="group.groupId"
            :value="group.groupName"
            @click="setgroupid(group.groupId)"
          >
            {{ group.groupName }}
          </a-select-option>
        </a-select>

        <!--项目下拉框-->
        <a-select default-value="所有业务线" style="width: 150px; margin-left: 20px" :value="setprojectname">
          <a-select-option
            v-for="project in qadata_projects"
            :key="project.projectId"
            :value="project.projectName"
            @click="setprojectid(project.projectId)"
          >
            {{ project.projectName }}
          </a-select-option>
        </a-select>

        <!--时间选择框-->
        <a-range-picker class="a-range-picker" style="width: 400px" show-time v-model="dateRange">
          <template slot="renderExtraFooter"> 日期选择</template>
        </a-range-picker>
        <!--查询按钮-->
        <a-button type="primary" icon="search" @click="getneedtimelist(dateRange)"> 查询 </a-button>
      </div>

      <!--表格-->
      <a-table
        :columns="columns"
        :data-source="qadata"
        style="margin-top: 20px"
        :loading="isLoading"
        :scroll="{ x: 1500 }"
        :pagination="{ defaultPageSize: 100 }"
      >
        <!-- 提交Bug数量 -->
        <div slot="bugNum" slot-scope="text, record">
          <!--        {{record.bugNum}}-->
          <div>
            <span>代码错误：</span><span>{{ record.betaCodeBugNum }}</span
            ><br />
            <span>非代码错误：</span><span>{{ record.betaNotCodeBugNum }}</span>
            <a-button type="primary" size='small' style="margin-top: 10px" @click="showbugdetail(record.userId)">查看详情</a-button>
          </div>
        </div>

        <!-- 线上bug详情列表 -->
        <div slot="onlinebugdetail" slot-scope="text, record">
          <!--        {{record.details}}-->
          <div v-if="record.onlineBugDetail && record.onlineBugDetail.length">
            <a v-for="(detail, index) in record.onlineBugDetail" :key="index" @click="jumpto(detail && detail.bugUrl)">
              <span>
                <span>{{ detail.tbId }}</span>
              </span>
              <br />
            </a>
          </div>
          <div v-else>
            <a>无</a>
          </div>
        </div>

        <!-- 任务详情列表 -->
        <div slot="taskDetail" slot-scope="text, record">
          <!--        {{record.details}}-->
          <div v-if="record.taskDetail && record.taskDetail.length">
            <a v-for="(detail, index) in record.taskDetail" :key="index" @click="jumpto(detail && detail.taskUrl)">
              <span class="record-text" style="margin-top: 20px; margin-bottom: 20px">
                <span style="color: rgb(0, 209, 178)">[{{ detail.jobHours }}H]</span>
                <span>{{ detail.taskName }}</span>
              </span>
              <br />
            </a>
          </div>
          <div v-else>
            <a>无</a>
          </div>
        </div>
      </a-table>
    </div>
    <div v-else style="width: 500px">
      <a-row class="bugdetail-text">
        <a-col :span="8"><span>技术线:</span> </a-col>
        <a-col :span="12"
          ><span style="color: #1890ff">{{ bugdetail.groupName }}</span></a-col
        >
      </a-row>

      <a-row class="bugdetail-text">
        <a-col :span="8"><span>业务线:</span> </a-col>
        <a-col :span="12"
          ><span style="color: #1890ff">{{ bugdetail.projectName }}</span></a-col
        >
      </a-row>

      <a-row class="bugdetail-text">
        <a-col :span="8"><span>创建人:</span> </a-col>
        <a-col :span="12"
          ><span style="color: #1890ff">{{ bugdetail.name }}</span></a-col
        >
      </a-row>

      <a-row class="bugdetail-text">
        <a-col :span="8"><span>提交Bug数量:</span> </a-col>
        <a-col :span="12"
          ><span
            ><span style="color: #1890ff">代码错误：</span
            ><span style="color: #1890ff">{{ bugdetail.betaCodeBugNum }}</span
            ><br />
            <span style="color: #1890ff">非代码错误：</span
            ><span style="color: #1890ff">{{ bugdetail.betaNotCodeBugNum }}</span></span
          >
        </a-col>
      </a-row>

      <a-row class="bugdetail-text">
        <a-col :span="8"><span>总计:</span></a-col>
        <a-col :span="12"
          ><span style="color: #1890ff">{{ bugdetail.bugNum }}</span></a-col
        >
      </a-row>

      <a-row class="bugdetail-text">
        <a-col :span="8"><span>代码错误:</span></a-col>
        <a-col :span="12"
          ><div v-if="bugdetail.array1 && bugdetail.array1.length">
            <a v-for="(detail, index) in bugdetail.array1" :key="index" @click="jumpto(detail && detail.bugUrl)">
              <span>
                <span>{{ detail.bugId }}</span>
              </span>
              <br />
            </a>
          </div>
          <div v-else>
            <a>无</a>
          </div>
        </a-col>
      </a-row>

      <a-row class="bugdetail-text">
        <a-col :span="8"><span>体验问题:</span></a-col>
        <a-col :span="12"
          ><div v-if="bugdetail.array2 && bugdetail.array2.length">
            <a v-for="(detail, index) in bugdetail.array2" :key="index" @click="jumpto(detail && detail.bugUrl)">
              <span>
                <span>{{ detail.bugId }}</span>
              </span>
              <br />
            </a>
          </div>
          <div v-else>
            <a>无</a>
          </div>
        </a-col>
      </a-row>

      <a-row class="bugdetail-text">
        <a-col :span="8"><span>产品设计缺陷:</span></a-col>
        <a-col :span="12"
          ><div v-if="bugdetail.array3 && bugdetail.array3.length">
            <a v-for="(detail, index) in bugdetail.array3" :key="index" @click="jumpto(detail && detail.bugUrl)">
              <span>
                <span>{{ detail.bugId }}</span>
              </span>
              <br />
            </a>
          </div>
          <div v-else>
            <a>无</a>
          </div>
        </a-col>
      </a-row>

      <a-row class="bugdetail-text">
        <a-col :span="8"><span>遗留问题:</span></a-col>
        <a-col :span="12"
          ><div v-if="bugdetail.array4 && bugdetail.array4.length">
            <a v-for="(detail, index) in bugdetail.array4" :key="index" @click="jumpto(detail && detail.bugUrl)">
              <span>
                <span>{{ detail.bugId }}</span>
              </span>
              <br />
            </a>
          </div>
          <div v-else>
            <a>无</a>
          </div>
        </a-col>
      </a-row>

      <a-button type="primary" style="margin-top: 10px; margin-left: 50px" @click="showindex">返回</a-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import { axios } from '@/utils/request'
import { forEach } from 'store/storages/all'

const columns = [
  { title: '技术线', width: 40, dataIndex: 'groupName', key: 'groupName' },
  { title: '业务线', width: 40, dataIndex: 'projectName', key: 'projectName' },
  { title: '姓名', width: 40, dataIndex: 'name', key: 'name' },
  {
    title: '用例编写行数',
    width: 70,
    dataIndex: 'caseNum',
    key: 'caseNum',
    align: 'center',
    sorter: (a, b) => a.caseNum - b.caseNum,
  },
  {
    title: '用例执行天数',
    width: 70,
    dataIndex: 'jobHours',
    key: 'jobHours',
    align: 'center',
    sorter: (a, b) => a.jobHours - b.jobHours,
  },
  {
    title: '提交bug数量',
    dataIndex: 'bugNum',
    width: 70,
    align: 'center',
    scopedSlots: { customRender: 'bugNum' },
    sorter: (a, b) => a.bugNum - b.bugNum,
  },
  { title: '线上bug数量', width: 60, dataIndex: 'onlineBugNum', key: 'onlineBugNum', align: 'center' },
  {
    title: '线上Bug详情列表',
    dataIndex: 'onlinebugdetail',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'onlinebugdetail' },
  },
  {
    title: '任务详情列表',
    dataIndex: 'taskDetail',
    width: 250,
    scopedSlots: { customRender: 'taskDetail' },
  },
]

export default {
  //测试效能
  name: 'qadata',
  data() {
    return {
      //表头
      columns,

      //列表数据
      qadata: [],

      //技术部
      qadata_groups: [],

      //业务线
      qadata_projects: [],

      //小组和业务线
      qadatas: [],

      //项目id
      setprojectId: 0,

      //设置项目名称
      setprojectname: '所有业务线',

      //业务线id
      setgroupId: 0,

      //时间框
      dateRange: [],

      isLoading: false,

      showtable: true,

      bugdetail: {},
    }
  },

  methods: {
    init() {
      //获取业务线
      this.getproject()
      
      //判断是否为周日
      var temp=this.dayjs().day()
      if(temp===0){
        var monday = this.dayjs().startOf('week').add(-6, 'day')
        var sunday = this.dayjs().endOf('week').add(-6, 'day')
      }
      else{
      //周一 周日
        var monday = this.dayjs().startOf('week').add(1, 'day')
        var sunday = this.dayjs().endOf('week').add(1, 'day')
      }

      //时间转moment对象
      this.dateRange = [
        moment(monday.format('dddd MMM DD YYYY HH:mm:ss ZZ')),
        moment(sunday.format('dddd MMM DD YYYY HH:mm:ss ZZ')),
      ]

      let temptime = [monday.format('YYYY-MM-DD HH:mm:ss'), sunday.format('YYYY-MM-DD HH:mm:ss')]
      this.getqadate(temptime[0], temptime[1])
    },
    getqadate(starttime, endtime) {
      this.isLoading = true
      axios
        .post('/qaStatistics', {
          groupId: this.setgroupId,
          projectId: this.setprojectId,
          startTime: starttime,
          endTime: endtime,
        })
        .then((response) => {
          if (response.code === 200) {
            this.isLoading = false
            response.data.forEach((item) => {
              item.jobHours = item.jobHours.toFixed(2)
            })
            this.qadata = response.data
          }
        })
        .catch((error) => {
          this.isLoading = false
          this.$message.error('内网数据获取失败')
        })
    },

    //获取业务线和项目
    getproject() {
      axios
        .get('/project/query')
        .then((response) => {
          if (response.code === 200) {
            this.qadatas = response.data

            var qadata_groups = new Array()
            var qadata_projects = new Array()

            qadata_groups.push({ groupId: 0, groupName: '商业技术部' })

            qadata_projects.push({ projectId: 0, projectName: '所有业务线' })
            //获取所有业务线
            response.data.forEach((groupitem) => {
              qadata_groups.push({ groupId: groupitem.groupId, groupName: groupitem.groupName })

              //获取所有项目
              groupitem.projectList.forEach((projectitem) => {
                qadata_projects.push({ projectId: projectitem.projectId, projectName: projectitem.projectName })
              })
            })
            this.qadata_groups = qadata_groups
            this.qadata_projects = qadata_projects
            this.allproject = qadata_projects
          }
        })
        .catch((error) => {
          this.$message.error('内网数据获取失败')
        })
    },

    //设置查询技术部的id
    setgroupid(groupid) {
      this.setgroupId = groupid
      //项目增加所有业务线
      var temp = [{ projectId: 0, projectName: '所有业务线' }]
      this.qadatas.forEach((item) => {
        if (groupid === item.groupId) {
          this.qadata_projects = temp.concat(item.projectList)
        } else if (groupid === 0) {
          this.qadata_projects = this.allproject
        }
      })
      //重置业务线名称和id
      this.setprojectname = '所有业务线'
      this.setprojectId = 0
    },

    //设置查询技术部id
    setprojectid(projectid) {
      this.setprojectId = projectid
      this.qadata_projects.forEach((item) => {
        if (projectid === item.projectId) {
          this.setprojectname = item.projectName
        }
      })
    },

    getneedtimelist(dateRange) {
      if (dateRange.length === 0) {
        this.$message.info('时间不能为空')
      }

      let currentStartTime = this.dayjs(dateRange[0].valueOf()).format('YYYY-MM-DD HH:mm:ss')
      let currentEndTime = this.dayjs(dateRange[1].valueOf()).format('YYYY-MM-DD HH:mm:ss')
      this.getqadate(currentStartTime, currentEndTime)
    },

    //点击打开新页面
    jumpto(hrefhost) {
      window.open(hrefhost)
    },

    //时间类型转换
    getcurrenttime(rangetime) {
      const starttime = this.dayjs(rangetime[0]).format('YYYY-MM-DD HH:mm:ss')
      const endtime = this.dayjs(rangetime[1]).format('YYYY-MM-DD HH:mm:ss')
      return [starttime, endtime]
    },

    //显示详情
    showbugdetail(userid) {
      this.showtable = false
      this.qadata.forEach((item) => {
        if (userid === item.userId) {
          this.bugdetail = item

          //代码错误
          var array1 = new Array()

          //体验问题
          var array2 = new Array()

          //产品设计缺陷
          var array3 = new Array()

          //遗留问题
          var array4 = new Array()

          item.bugDetail.forEach((item) => {
            if (item.bugType === '代码错误') {
              array1.push(item)
            }
            if (item.bugType === '体验问题') {
              array2.push(item)
            }
            if (item.bugType === '产品设计问题') {
              array3.push(item)
            }
            if (item.bugType === '遗留问题') {
              array4.push(item)
            }
          })
          this.bugdetail['array1'] = array1
          this.bugdetail['array2'] = array2
          this.bugdetail['array3'] = array3
          this.bugdetail['array4'] = array4
        }
      })
      console.log(this.bugdetail)
    },

    //显示表格
    showindex() {
      this.showtable = true
    },
  },
  computed: {},
  created() {
    this.init()
  },
}
</script>

<style scoped>
.a-range-picker {
  margin-left: 20px;
  margin-right: 20px;
}

/* a {
  display: inline-block;
  height: 22px;
  line-height: 22px;
} */

a:hover {
  /* text-decoration: underline; */
  border-bottom: 1px solid #409eff;
}

.bugdetail-text {
  margin-top: 10px;
  margin-left: 50px;
}
</style>