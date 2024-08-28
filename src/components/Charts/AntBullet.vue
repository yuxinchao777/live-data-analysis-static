<template>
  <div :id="this.id"></div>
</template>

<script>
import { Bullet } from '@antv/g2plot'

export default {
  name: 'antbullet',
  props: {
    id: {
      type: String,
      default: 'antbullet',
    },
    data: {
      type: Array,
      default: [],
    },
    xField: {
      type: String,
    },
    measureField: {
      type: String,
    },
  },
  components: {},
  data() {
    return {
      bulletPlot: null,
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
      this.bulletPlot.changeData(this.data)
    },
  },
  mounted() {
    this.bulletPlot = new Bullet(this.id, {
      data: this.data,
      layout: 'vertical',
      measureField: this.measureField,
      rangeField: 'ranges',
      targetField: 'target',
      xField: this.xField,
      color: {
        range: ['#FFbcb8', '#FFe0b0', '#bfeec8'],
        measure: ['#5B8FF9', '#61DDAA'],
        target: '#39a3f4',
      },
      meta: {
   measures_0: {
     alias: '自定义内容名'
   }
 },
      label: {
        measure: {
          position: 'middle',
          style: {
            fill: '#000',
          },
        },
      },
      xAxis: {
        line: null,
      },
      yAxis: false,
      // 自定义 legend
      legend: {
        custom: true,
        position: 'bottom',
        items: [
          {
            value: '优',
            name: '优',
            marker: { symbol: 'square', style: { fill: '#bfeec8', r: 5 } },
          },
          {
            value: '良',
            name: '良',
            marker: { symbol: 'square', style: { fill: '#FFe0b0', r: 5 } },
          },
          {
            value: '差',
            name: '差',
            marker: { symbol: 'square', style: { fill: '#FFbcb8', r: 5 } },
          },
          {
            value: '完成时间',
            name: '完成时间',
            marker: { symbol: 'square', style: { fill: '#5B8FF9', r: 5 } },
          },
          {
            value: '响应时间',
            name: '响应时间',
            marker: { symbol: 'square', style: { fill: ' #61DDAA', r: 5 } },
          },
          {
            value: '目标时间',
            name: '目标时间',
            marker: { symbol: 'line', style: { stroke: '#39a3f4', r: 5 } },
          },
        ],
      },
    })

    this.bulletPlot.render()
  },
}
</script>

<style lang="less" scoped>
</style>

