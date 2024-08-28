<template>
    <div id="bar1"></div>
</template>


<script>
import { Column } from '@antv/g2plot';
import {getFunction} from '@/api/function';
//import func from 'vue-editor-bridge';
export default {
  name: 'bar1',
  components: {
  },
  props:{
    postDate:{stime:'',etime:''}
  },
  data() {
    return {
    }
  },
  watch:{
   'postDate.stime':{
     handler(newVal,oldVal){
       postDate.stime=newVal
     },
     deep:true
   },
   'postDate.etime':{
     handler(newVal,oldVal){
       postDate.etime=newVal
     },
     deep:true
   }
  },
  created() {
    // setTimeout(() => {
    //   this.loading = !this.loading
    // }, 1000)
  },
  mounted () { 
  const data = [
  {
    name: '项目数量',
    project: '营收产品',
    count: 18,
  },
  {
    name: '项目数量',
    project: '营收活动',
    count: 28,
  },
  {
    name: '项目数量',
    project: 'pk',
    count: 39,
  },
  {
    name: '项目数量',
    project: '社交',
    count: 51,
  },
  {
    name: '项目数量',
    project: '增长',
    count: 47,
  },
  {
    name: '项目数量',
    project: '基础',
    count: 20,
  },
   {
    name: '延期提测项目数量',
    project: '营收产品',
    count: 8,
  },
  {
    name: '延期提测项目数量',
    project: '营收活动',
    count: 18,
  },
  {
    name: '延期提测项目数量',
    project: 'pk',
    count: 19,
  },
  {
    name: '延期提测项目数量',
    project: '社交',
    count: 21,
  },
  {
    name: '延期提测项目数量',
    project: '增长',
    count: 17,
  },
  {
    name: '延期提测项目数量',
    project: '基础',
    count: 10,
  },

];  

const stackedColumnPlot = new Column('bar1', {
  data:this.getData(),
  isGroup: true,
  xField: 'project',
  yField: 'count',
  seriesField: 'name',
  /** 设置颜色 */
  //color: ['#1ca9e6', '#f88c24'],
  /** 设置间距 */
  // marginRatio: 0.1,
  label: {
    // 可手动配置 label 数据标签位置
    position: 'middle', // 'top', 'middle', 'bottom'
    // 可配置附加的布局方法
    layout: [
      // 柱形图数据标签位置自动调整
      { type: 'interval-adjust-position' },
      // 数据标签防遮挡
      { type: 'interval-hide-overlap' },
      // 数据标签文颜色自动调整
      { type: 'adjust-color' },
    ],
  },
});
//stackedColumnPlot.source(data);
stackedColumnPlot.render();
  },
  methods:{  
  getData() {
      var stime=this.postDate.stime;
      var etime=this.postDate.etime;
      getFunction(stime,etime).then((response) => {
      console.log('调用getfunction')
      console.log(response)
      debugger
      const data=[];
      if(response.code === 20000){
        for(i=0;i<response.data.length;i++){
          var item=response.data[i]
          data.push({
              name:'项目数量',
              project:item.project_name,
              count:item.functionCount,
          })  
        }
        return data;
      } else {
        this.$message({
          message: '服务端接口异常',
          type: 'warning'
        }) 
     }
    })
    .catch(error => {
      console.log(error);
    })
    }
  }
}

</script>

<style lang="less" scoped>

</style>