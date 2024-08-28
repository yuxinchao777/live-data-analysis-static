<template>
  <div :id="this.id"></div>
</template>

<script>
import { Column } from '@antv/g2plot'

export default {
  name: 'bar2',
  components: {},
  data() {
    return {
      stackedColumnPlot: null,
    }
  },
  props: {
    id: {
      type: String,
      default: 'bar2',
    },
    data: {
      type: Array,
      default: [],
    },
    xField: {
      type: String,
    },
    yField: {
      type: String,
    },
    seriesField: {
      type: String,
      default: '',
    },
  },
  watch: {
    data: function (val) {
      this.$nextTick(() => {
        this.refreshData()
      })
    },
  },
  methods: {
    refreshData() {
      this.stackedColumnPlot.changeData(this.data)
    },
  },
  created() {},
  mounted() {
    console.log('bar2')
    this.stackedColumnPlot = new Column(this.id, {
      data: this.data,
      isStack: true,
      xField: this.xField,
      yField: this.yField,
      seriesField: this.seriesField,
      label: {
        // 可手动配置 label 数据标签位置
        position: 'middle', // 'top', 'bottom', 'middle'
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
      minColumnWidth: 30,
      maxColumnWidth: 30,
      colorField: 'level',
      color: ({ level }) => {
        if (level == 'P3') {
          return '#f1647b'
        }
        if (level == 'P4') {
          return '#ffe06c'
        }
        return '#7fbffc'
      },
    })

    this.stackedColumnPlot.render()
  },
}
</script>

<style lang="less" scoped>
</style>
