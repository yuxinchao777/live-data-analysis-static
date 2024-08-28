<template>
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

    <!--技术类型下拉框-->
    <a-select default-value="所有技术类型" style="width: 150px; margin-left: 20px">
      <a-select-option v-for="techtype in techtypes" :key="techtype" :value="techtype" @click="settechtype(techtype)">
        {{ techtype }}
      </a-select-option>
    </a-select>

    <!--查询按钮-->
    <a-button type="primary" icon="search" @click="getmemberdata()" style="margin-left: 20px"> 查询 </a-button>

    <!--添加按钮-->
    <a-button type="primary" style="margin-left: 20px" @click="showModal(1)"> 添加成员 </a-button>

    <a-table :columns="columns" :data-source="qadata" style="margin-top: 20px" :pagination="{ defaultPageSize: 200 }">
      <div slot="action" slot-scope="text, record">
        <div>
          <a-button
            type="primary"
            @click="
              showModal(
                2,
                record.id,
                record.userName,
                record.groupName,
                record.groupId,
                record.projectName,
                record.projectId,
                record.techStack
              )
            "
            >编辑</a-button
          >
          <a-button
            v-if="record.userType === 1"
            type="primary"
            style="margin-left: 10px"
            @click="setshow(record.id, record.userType)"
            >隐藏</a-button
          >
          <a-button
            v-if="record.userType === 0"
            type="primary"
            style="margin-left: 10px"
            @click="setshow(record.id, record.userType)"
            >显示</a-button
          >
        </div>
      </div>
    </a-table>

    <div>
      <a-modal v-model="visible" :title="modeltitle" @ok="handleOk" :afterClose="onClose">
        <div>
          <a-row>
            <a-col :span="4">
            成员名称:
            </a-col>
            <a-col :span="12">
            <a-select
              class = 'modeltext'
              mode="combobox"
              :disabled="cansetname"
              allowClear:true
              showSearch
              notFoundContent="暂无结果"
              placeholder="请输入成员名称"
              v-model="setname"
              @change="getmembersearch(setname)"
            >
              <a-select-option
                :v-model="searchnamelist"
                v-for="searchname in searchnamelist"
                :key="searchname.userId"
                :value="searchname.userName"
                @click="setsearchname(searchname.userName,searchname.userId)"
              >
                {{ searchname.userName }}
              </a-select-option>
            </a-select>
            </a-col>
          </a-row>
          
          <a-row style="margin-top:20px">
            <a-col :span="4">技术线:</a-col>
            <a-col :span="12">
            <!--业务线下拉框-->
            <a-select class = 'modeltext' :value="modelgroupname">
              <a-select-option
                v-for="group in modelgrouplist"
                :key="group.groupId"
                :value="group.groupName"
                @click="setmodelgroupid(group.groupId)"
              >
                {{ group.groupName }}
              </a-select-option>
            </a-select>
            </a-col>
          </a-row>

          <a-row style="margin-top:20px">
            <a-col :span="4">业务线:</a-col>
            <a-col :span="12">
            <!--项目下拉框-->
            <a-select class = 'modeltext'  :value="modelprojectname">
              <a-select-option
                v-for="project in modelprojectlist"
                :key="project.projectId"
                :value="project.projectName"
                @click="setmodelprojectid(project.projectId)"
              >
                {{ project.projectName }}
              </a-select-option>
            </a-select>
            </a-col>
          </a-row>

          <a-row style="margin-top:20px">
            <a-col :span="4">技术类型:</a-col>
             <a-col :span="12">
            <!--技术类型下拉框-->
            <a-select class = 'modeltext' :value="modeltechname">
              <a-select-option
                v-for="modeltech in modeltechtype"
                :key="modeltech"
                :value="modeltech"
                @click="setmodeltechtype(modeltech)"
              >
                {{ modeltech }}
              </a-select-option>
            </a-select>
            </a-col>
          </a-row>
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script>
import { axios } from '@/utils/request'


const columns = [
  { title: '姓名', width: 30, dataIndex: 'userName', key: 'userName' },
  { title: '技术线', width: 60, dataIndex: 'groupName', key: 'groupName' },
  { title: '业务线', width: 30, dataIndex: 'projectName', key: 'projectName' },
  { title: '技术类型', width: 50, dataIndex: 'techStack', key: 'techStack' },
  { title: '操作人', width: 30, dataIndex: 'operatorName', key: 'operatorName' },
  { title: '操作时间', width: 60, dataIndex: 'operatorTime', key: 'operatorTime' },
  {
    title: '操作',
    key: 'taskDetail',
    width: 250,
    scopedSlots: { customRender: 'action' },
  },
]

const techtypes = ['所有技术类型', 'H5', 'Lua', 'iOS', 'Android', 'JAVA', 'PHP', 'QA']

import building from '../building.vue'

export default {
  //人员维护页面
  name: 'member',
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

      //全部技术类型
      techtypes,

      //techtypeid
      techtypeid: '0',

      //弹窗是否显示
      visible: false,

      //模糊搜索人员名称
      setname: '',

      //模糊搜索人员是否可以编辑
      cansetname: false,

      //模糊搜索人员列表
      searchnamelist: [],

      //弹窗的技术部，不包括全部
      modelgrouplist: [],

      //弹窗的业务线，不包括全部
      modelprojectlist: [],

      //弹窗用户id
      modelnameid: 0,

      //弹窗添加时的tbid
      modeladdid:0,

      //弹窗的技术部id
      modelgroupid: 1,

      //弹窗的业务线id
      modelprojectid: 1,

      //弹窗中的技术类型
      modeltechtype: [],

      //弹窗中技术部名称
      modelgroupname: '',

      //弹窗中业务线名称
      modelprojectname: '',

      //弹窗中技术类型名称
      modeltechname: '',

      //弹窗title
      modeltitle: '编辑',
    }
  },

  methods: {
    init() {
      //读取操作人
      var tempname = localStorage.getItem('momoname')
      
      this.operatorName = tempname 

      //获取业务线
      this.getproject()

      //获取列表数据
      this.getmemberdata()
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

    //设置技术类型
    settechtype(techtype) {
      this.techtypeid = techtype
      if(techtype === '所有技术类型'){
        this.techtypeid = '0'
      }
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

    getmemberdata() {
      //表单提交请求
      //
      // let params = new FormData()
      // params.append('Department', 'qa')
      // axios
      //   .post('/employee/query', params, { headers: { 'Content-Type': 'multipart/form-data' } })
      axios
        .post('/employee/query', {
          groupId: this.setgroupId,
          projectId: this.setprojectId,
          techStack: this.techtypeid,
        })
        .then((response) => {
          if (response.code === 200) {
            // response.data.forEach((item) => {
            //   if (item.userType === 1) {
            //     item.userType = '是'
            //   } else {
            //     item.userType = '否'
            //   }
            // })
            this.qadata = response.data
          }
        })
        .catch((error) => {
          this.$message.error('内网数据获取失败')
        })
    },

    //模糊搜索人员
    getmembersearch(name) {
      axios
        .post('employee/search', { userName: name })
        .then((response) => {
          if (response.code === 200) {
            this.searchnamelist = response.data
          }
          else{
            this.searchnamelist = []
          }
          console.log(this.searchnamelist)
        })
        .catch((error) => {
          this.$message.error('内网数据获取失败')
        })
    },

    //设置搜索人员名称
    setsearchname(name,addid) {
      this.setname = name
      this.modeladdid = addid
    },

    //设置弹窗中的技术部列表和业务线列表
    setmodellist() {
      this.modelgrouplist = this.qadata_groups.slice(1)
      this.modelprojectlist = this.qadata_projects.slice(1)
      this.modeltechtype = this.techtypes.slice(1)
    },

    //打开弹窗
    showModal(type, id, name, group, groupid, project, projectid, tech) {
      //设置弹窗的技术部列表、业务线列表、技术类型列表
      this.setmodellist()

      this.modeltype = type
      //type=1 是添加弹窗
      if (type === 1) {
        this.cansetname = false
        this.setname = ''
        this.modelgroupname = ''
        this.modelprojectname = ''
        this.modeltechname = ''
        this.modelnameid = id
        this.modeltitle = '添加'
        this.OperationType = 0
      }
      //type=2 是编辑弹窗
      else if (type === 2) {
        this.cansetname = true
        this.setname = name
        this.modelgroupname = group
        this.modelprojectname = project
        this.modeltechname = tech
        this.modelnameid = id
        this.modelgroupid = groupid
        this.modelprojectid = projectid
        this.modeltitle = '编辑'
        this.OperationType = 1
        this.setmodelgroupid(groupid)
      }

      document.documentElement.style = ''
      this.visible = true
    },

    //点击确定
    handleOk() {
      //点击编辑 提交
      if(this.modeltype===2){
      axios
        .post('/employee/update', {
          id: this.modelnameid,
          operatorName: this.operatorName,
          projectId: this.modelprojectid,
          techStack: this.modeltechname,
          operationType: this.OperationType,
        })
        .then((response) => {
          if (response.code === 200) {
            this.$message.success('提交成功')
            this.visible = false
            this.init()
          } else {
            this.$message.error(response.message)
          }
        })
        .catch((error) => {
          this.$message.error('内网数据获取失败')
        })}

        //点击添加提交
        else if(this.modeltype===1){
          axios
        .post('/employee/update', {
          userId: this.modeladdid,
          userName:this.setname,
          operatorName: this.operatorName,
          projectId: this.modelprojectid,
          techStack: this.modeltechname,
          operationType: this.OperationType,
        })
        .then((response) => {
          if (response.code === 200) {
            this.$message.success('提交成功')
            this.visible = false
            this.init()
          } else {
            this.$message.error(response.message)
          }
        })
        .catch((error) => {
          this.$message.error('内网数据获取失败')
        })
        }
    },
    onClose() {
      document.documentElement.style.overflowY = 'overlay'
    },

    //设置弹窗技术部id
    setmodelgroupid(id) {
      this.modelgroupid = id
      this.qadata_groups.forEach((item) => {
        if (item.groupId === id) {
          this.modelgroupname = item.groupName
        }
      })
      this.qadatas.forEach((item) => {
        if (item.groupId === id) {
          this.modelprojectlist = item.projectList
        }
      })
      //重置业务线名称和id
      this.modelprojectname = this.modelprojectlist[0].projectName
      this.modelprojectid = this.modelprojectlist[0].projectId
    },

    //设置弹窗业务线id
    setmodelprojectid(id) {
      this.modelprojectid = id
      this.qadata_projects.forEach((item) => {
        if (item.projectId === id) {
          this.modelprojectname = item.projectName
        }
      })
    },

    //设置弹窗技术类型
    setmodeltechtype(id) {
      this.modeltechname = id
    },

    //设置是否隐藏
    setshow(userid, showtype) {
      //如果用户显示，改为隐藏

      var userType = 0
      if (showtype === 0) {
        userType = 1
      }
      this.OperationType = 2

      axios
        .post('/employee/update', {
          id: userid,
          userType: userType,
          operatorName: this.operatorName,
          operationType: this.OperationType,
        })
        .then((response) => {
          if (response.code === 200) {
            this.getmemberdata()
          }
        })
        .catch((error) => {
          this.$message.error('内网数据获取失败')
        })
    },
  },
  computed: {},

  created() {
    this.init()

  },
}
</script>
<style scoped>
.modeltext{
  
  width : 300px;
 
}
</style>
