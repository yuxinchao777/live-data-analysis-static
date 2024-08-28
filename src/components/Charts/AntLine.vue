<template>
  <div :id="id"></div>
</template>

<script>
import { Line } from '@antv/g2plot'
export default {
  name: 'line',
  components: {},
  props: {
    id: {
      type: String,
      default: 'antbar',
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
  data() {
    return {
      lineChart: null,
    }
  },
  created() {},
  watch: {
    data: function (val) {
      this.$nextTick(() => {
        this.refreshData()
      })
    },
  },
  methods: {
    refreshData() {
      this.lineChart.changeData(this.data)
    },
  },
  mounted() {
    this.lineChart = new Line(this.id, {
      data: this.data,
      xField: this.xField,
      yField: this.yField,
      seriesField: this.seriesField,
      // color: ['#f78c6d', '#8543e0'],
      label: {},
      // xAxis: {
      //   type: 'time',
      // },
      // yAxis: {
      //   label: {
      //     // 数值格式化为千分位
      //     formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      //   },
      // },
    })

    this.lineChart.render()
  },
}
</script>

<style lang="less" scoped>
</style>
