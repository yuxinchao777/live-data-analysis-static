<template>
  <div :id="this.id"></div>
</template>

<script>
import { Column } from '@antv/g2plot'

export default {
  name: 'antbar',
  props: {
    id: {
      type: String,
      default: 'antbar',
    },
    data: {
      type: Array,
      default: [],
    },
    isGroup: {
      type: Boolean,
      default: true,
    },
    isStack: {
      type: Boolean,
      default: true,
    },
    xField: {
      type: String,
    },
    yField: {
      type: String,
    },
    seriesField: {
      type: String,
    },
  },
  components: {},
  data() {
    return {
      barColumn: null,
    }
  },
  watch: {
    data: function (val) {
      this.$nextTick(() => {
        this.refreshData()
      })
    },
  },
  created() {},
  methods: {
    refreshData() {
      this.barColumn.changeData(this.data)
    },
  },
  mounted() {
    this.barColumn = new Column(this.id, {
      data: this.data,
      isStack: this.isStack,
      isGroup: this.isGroup,
      xField: this.xField,
      yField: this.yField,
      seriesField: this.seriesField,
      maxColumnWidth: 40,
      /** 设置颜色 */
      // color: ['#5b8ff9', '#5ad8a6'],
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
    })
    this.barColumn.render()
  },
}
</script>

<style lang="less" scoped>
</style>

