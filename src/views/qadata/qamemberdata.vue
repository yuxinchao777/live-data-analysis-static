<template>
  <div class="qamember-wrapper">
    <div>
      <!--业务线下拉框-->
      <a-select 
        default-value="商业技术部" 
        style="width: 150px; margin-left: 5px; ">
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
      <a-select 
        default-value="所有业务线"
        style="width: 150px; margin-left: 20px; "
        :value="setprojectname"
      >
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
      <a-button type="primary" icon="search" @click="getdate(dateRange)"> 查询 </a-button>
    </div>
    <h6>（备注：绿色：等于8h，红色：大于8h，黑色：小于8h，橘色：请假，粉色：假期）</h6>
    <a-table
      :columns="all_columns_data"
      :data-source="qadata"
      style="margin-top: 20px"
      :scroll="{ x: columns_len }"
      bordered
      :pagination="{ defaultPageSize: 100 }"
    >
      <div slot="action" slot-scope="text, record">
        <!--tb内容-->
        <div v-if="text.tbWorkContent && text.tbWorkContent.length && text.line_show === true">
          <a v-for="(detail, index) in text.tbWorkContent" :key="index" @click="jumpto(detail && detail.url)">
            <span class="record-text" style="margin-top: 20px; margin-bottom: 20px">
              <span v-if="text.count === 8" style="color: rgb(106, 168, 79)">[{{ detail.hour }}H]</span>
              <span v-if="text.count > 8" style="color: rgb(205, 51, 51)">[{{ detail.hour }}H]</span>
              <span v-if="text.count < 8" style="color: rgb(0, 0, 0)">[{{ detail.hour }}H]</span>

              <span v-if="text.count === 8" style="color: rgb(106, 168, 79)">{{ detail.content }}</span>
              <span v-else-if="text.count > 8" style="color: rgb(205, 51, 51)">{{ detail.content }}</span>
              <span v-else-if="text.count < 8" style="color: rgb(0, 0, 0)">{{ detail.content }}</span>

              <span v-else-if="detail.work_type === 0" style="color: rgb(205, 149, 12)">{{ detail.content }}</span>
              <span v-else style="color: rgb(238, 99, 99)">{{ detail.content }}</span>
            </span>
            <br />
          </a>
        </div>

        <!-- 分割线 -->
        <hr v-if="text.line_show" />

        <!--自定义内容-->
        <div>
          <div v-if="text.workContents && text.workContents.length">
            <a v-for="(detail, index) in text.workContents" :key="index" @click="jumpto(detail && detail.url)">
              <span class="record-text" style="margin-top: 20px; margin-bottom: 20px">
                <span
                  v-if="detail.work_type === 1 && text.count === 8 && detail.content !== ''"
                  style="color: rgb(106, 168, 79)"
                  >[{{ detail.hour }}H]</span
                >
                <span
                  v-else-if="detail.work_type === 1 && text.count > 8 && detail.content !== ''"
                  style="color: rgb(205, 51, 51)"
                  >[{{ detail.hour }}H]</span
                >
                <span
                  v-else-if="detail.work_type === 1 && text.count < 8 && detail.content !== ''"
                  style="color: rgb(0, 0, 0)"
                  >[{{ detail.hour }}H]</span
                >

                <span v-if="detail.work_type === 1 && text.count === 8" style="color: rgb(106, 168, 79)">{{
                  detail.content
                }}</span>
                <span v-else-if="detail.work_type === 1 && text.count > 8" style="color: rgb(205, 51, 51)">{{
                  detail.content
                }}</span>
                <span v-else-if="detail.work_type === 1 && text.count < 8" style="color: rgb(0, 0, 0)">{{
                  detail.content
                }}</span>

                <span v-else-if="detail.work_type === 0" style="color: rgb(255, 20, 147)">{{ detail.content }}</span>

                <span v-else style="color: rgb(255, 127, 0)">{{ detail.content }}</span>
              </span>
              <br />
            </a>
          </div>
          <div>
            <div style="margin-top: 10px">
              <a-button id="editbutton" size="small" @click="showModal(text.date, text.workContents, record.id)"
                >编辑</a-button
              >
            </div>
          </div>
        </div>
      </div>
    </a-table>

    <!-- 弹窗 -->
    <div>
      <a-modal v-model="visible" title="编辑" @ok="handleOk" :afterClose="onClose" width="800px">
        <div v-for="(item, index) in contenttask" :key="index" style="margin-top: 5px">
          <span width="100px">工作内容: <a-input class="editstyle" v-model="item.content" /></span>
          <span>链接地址: <a-input class="editstyle" v-model="item.url" /></span>
          <span>工时: <a-input class="editstyle" v-model="item.hour" style="width: 50px" /></span>
          <span><a-button type="danger" @click="deltask(index)" style="margin-left: 5px">删除</a-button></span>
        </div>

        <div>
          <span><a-button type="primary" @click="addtask()">新增</a-button></span>
          <span
            ><a-button style="margin-left: 50px; margin-top: 10px" type="primary" @click="qingjia()"
              >请假</a-button
            ></span
          >
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import { axios } from '@/utils/request'
import { forEach } from 'store/storages/all'

export default {
  //排期日报页面
  name: 'qamemberdata',
  data() {
    return {
      //小组
      qadata_groups: [],

      //业务线
      qadata_projects: [],

      //小组和业务线
      qadatas: [],

      //时间选择框
      dateRange: [],

      //项目id
      setprojectId: 0,

      //设置项目名称
      setprojectname: '所有业务线',

      //业务线id
      setgroupId: 0,

      //表头
      all_columns_data: [],

      //列表长度
      columns_len: 0,

      //列表数据
      qadata: [],

      //弹窗是否显示
      visible: false,

      //弹窗中的任务
      contenttask: [],

      //弹窗任务日期
      edittaskdate: '',

      //弹窗人的id
      edituserid: '',
    }
  },

  methods: {
    init() {
      this.getproject()

      // //周一 周日
      // const monday = this.dayjs().startOf('week').add(1, 'day')
      // const sunday = this.dayjs().endOf('week').add(1, 'day')
      
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
      //let temptime = [monday.format('YYYY-MM-DD HH:mm:ss'), sunday.format('YYYY-MM-DD HH:mm:ss')]

      this.getdate(this.dateRange)
    },
    //获取列表数据
    getdate(dateRange) {
      let temptime = [
        this.dayjs(dateRange[0].valueOf()).format('YYYY/MM/DD HH:mm:ss'),
        this.dayjs(dateRange[1].valueOf()).format('YYYY/MM/DD HH:mm:ss'),
      ]
      this.get_columns(temptime)
      this.getneedtimelist(temptime)
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

    //点击查询获取列表数据
    getneedtimelist(dateRange) {
      dateRange[0] = this.dayjs(dateRange[0].valueOf()).format('YYYY-MM-DD')
      dateRange[1] = this.dayjs(dateRange[1].valueOf()).format('YYYY-MM-DD')
      axios
        .post('/DailyWork/query', {
          startTime: dateRange[0],
          endTime: dateRange[1],
          projectId: this.setprojectId,
          groupId: this.setgroupId,
        })
        .then((response) => {
          if (response.code === 200) {
            this.qadata = this.sortdata(response.data)
          }
        })
        .catch((error) => {
          this.$message.error('内网数据获取失败')
        })
    },

    //格式化数据
    sortdata(data) {
      var temp = new Array()
      temp = this.all_columns_data.slice(2)
      data.forEach((item) => {
        for (let i = 0; i < temp.length; i++) {
          item[temp[i].children[0].title] = item.dateWork[i]
        }
      })
      data = this.countdayhours(data)
      return data
    },

    //计算某人某日总时长和是否显示分割线
    countdayhours(data) {
      var temp = new Array()
      temp = this.all_columns_data.slice(2)
      data.forEach((item) => {
        for (var i = 0; i < temp.length; i++) {
          //每天总是长
          var count = 0

          //tb任务 work任务中间的分割线
          var line_show = true

          //workContents处理
          if (
            item[temp[i].children[0].title].workContents &&
            item[temp[i].children[0].title].workContents.length !== 0
          ) {
            item[temp[i].children[0].title].workContents.forEach((item) => {
              if (item.hour !== null) {
                count = count + item.hour
              }
              //请假或假期隐藏分割线
              if (item.work_type === 2 || item.work_type === 0) {
                line_show = false
              }
            })
          }

          //tbWorkContent处理
          if (
            item[temp[i].children[0].title].tbWorkContent &&
            item[temp[i].children[0].title].tbWorkContent.length !== 0
          ) {
            item[temp[i].children[0].title].tbWorkContent.forEach((item) => {
              if (item.hour !== null) {
                count = count + item.hour
              }
            })
          }

          if (
            item[temp[i].children[0].title].workContents &&
            item[temp[i].children[0].title].workContents.length === 0 &&
            item[temp[i].children[0].title].tbWorkContent &&
            item[temp[i].children[0].title].tbWorkContent.length === 0
          ) {
            line_show = false
          }

          item[temp[i].children[0].title].count = count
          item[temp[i].children[0].title].line_show = line_show
        }
      })
      return data
    },

    //点击跳转
    jumpto(hrefhost) {
      if (hrefhost !== null && hrefhost !== '') {
        window.open(hrefhost)
      }
    },

    //打开弹窗
    showModal(datatime, text, userid) {
      this.contenttask = text
      this.edittaskdate = datatime
      this.edituserid = userid
      document.documentElement.style = ''
      if (this.contenttask.length === 0) {
        this.contenttask = [
          {
            content: '',
            hour: 0,
            url: null,
            work_type: 1,
          },
        ]
      }
      this.visible = true
    },

    //删除数组元素
    deltask(num) {
      this.contenttask.splice(num, 1)
    },

    //新增任务
    addtask() {
      this.contenttask.push({
        content: '',
        hour: null,
        url: null,
        work_type: 1,
      })
    },

    //点击弹窗保存
    handleOk() {
      var temp = 1
      for (var i = 0; i < this.contenttask.length; i++) {
        if (this.contenttask[i].content === '' || this.contenttask[i].hour === null) {
          this.$message.error('内容和工时不能为空')
          temp = 0
          break
        }
      }
      if (temp === 1) {
        this.contenttask.forEach((item) => {
          item.work_type = 1
        })
        axios
          .post('/DailyWork/update', {
            userId: this.edituserid,
            date: this.edittaskdate,
            workContent: this.contenttask,
          })
          .then((response) => {
            if (response.code === 200) {
              this.$message.success('提交成功')
              this.visible = false
              this.getdate(this.dateRange)
            } else {
              this.$message.error('提交失败')
            }
          })
          .catch((error) => {
            this.isLoading = false
            this.$message.error('内网数据获取失败')
          })
      }
    },

    qingjia() {
      var temp_content = {
        content: '请假',
        hour: 0,
        url: null,
        work_type: 2,
      }
      axios
        .post('/DailyWork/update', { userId: this.edituserid, date: this.edittaskdate, workContent: [temp_content] })
        .then((response) => {
          if (response.code === 200) {
            this.$message.success('提交成功')
            this.visible = false
            this.getdate(this.dateRange)
          } else {
            this.$message.error('提交失败')
          }
        })
        .catch((error) => {
          this.isLoading = false
          this.$message.error('内网数据获取失败')
        })
      this.visible = false
    },

    //关闭弹窗
    onClose() {
      document.documentElement.style.overflowY = 'overlay'
    },

    //获取表头
    get_columns(dateRange) {
      // var start = this.dayjs(dateRange[0].valueOf()).format('YYYY-MM-DD HH:mm:ss')
      // var stop = this.dayjs(dateRange[1].valueOf()).format('YYYY-MM-DD HH:mm:ss')
      var start = dateRange[0]
      var stop = dateRange[1]
      var array = new Array()

      //添加业务线
      array.push({ title: '业务线', key: 'projectName', dataIndex: 'projectName', width: 30 })

      //添加姓名
      array.push({ title: '姓名', key: 'name', dataIndex: 'name', width: 30 })
      var current = new Date(start)
      stop = new Date(stop)
      while (current <= stop) {
        if (
          this.get_week(this.dayjs(new Date(current)).day()) === '星期六' ||
          this.get_week(this.dayjs(new Date(current)).day()) === '星期日'
        ) {
          array.push({
            title: this.get_week(this.dayjs(new Date(current)).day()),
            children: [
              {
                title: this.dayjs(new Date(current)).format('YYYY-MM-DD'),
                key: this.dayjs(new Date(current)).format('YYYY-MM-DD'),
                dataIndex: this.dayjs(new Date(current)).format('YYYY-MM-DD'),
                width: 35,
                scopedSlots: { customRender: 'action' },
              },
            ],
          })
        } else {
          array.push({
            title: this.get_week(this.dayjs(new Date(current)).day()),
            children: [
              {
                title: this.dayjs(new Date(current)).format('YYYY-MM-DD'),
                key: this.dayjs(new Date(current)).format('YYYY-MM-DD'),
                dataIndex: this.dayjs(new Date(current)).format('YYYY-MM-DD'),
                width: 50,
                scopedSlots: { customRender: 'action' },
              },
            ],
          })
        }

        current.setDate(current.getDate() + 1)
      }
      this.columns_len = array.length * 120
      this.all_columns_data = array
    },

    //获取日期的星期几
    get_week(num) {
      var weeks = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六')
      var week = weeks[num]
      return week
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
.ant-table td {
  white-space: nowrap;
}

.editstyle {
  width: 200px;
  margin-bottom: 2px;
}



</style>