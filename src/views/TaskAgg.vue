<template>
  <div class='taskagg'>
    <div id='bar_level' style='height: 300px; width: 40%; float: left;'></div>
    <div id='bar_role' style='height: 300px; width: 40%; float: left;'></div>
  </div>
</template>

<script>
import api from '@/api/api-workboard'
import barOption from './options/bar.js'

export default {
  name: 'TaskAgg',
  data () {
    return {
      username: this.$store.state.user.username,
      aggs: {
        roles: {},
        levels: {}
      }
    }
  },
  computed: {
  },
  methods: {
    genBar: function (items) {
      var bar = this.$echarts.init(document.getElementById(items.id))
      let colors = ['#73ccff', '#42d885', '#f7ba2a', '#ff4949']
      let title = items.title
      let legend = items.legend
      let data = items.data

      barOption.series = []
      barOption.title.text = title
      barOption.legend.data = Object.keys(legend)

      for (let i in barOption.legend.data) {
        let name = barOption.legend.data[i]
        let color = colors[i]
        let num = data[legend[barOption.legend.data[i]]]

        let s = {
          name: name,
          type: 'bar',
          barGap: 4,
          barWidth: 10,
          itemStyle: {
            normal: {
              color: color
            }
          },
          label: {
            normal: {
              show: true,
              position: 'left',
              formatter: name
            }
          },
          data: [num]
        }
        barOption.series.push(s)
      }
      bar.setOption(barOption)
    },
    getTaskStatistics: function () {
      let vue = this
      let params = {
        username: this.username
      }
      api('/taskagg/', 'get', params, function (res) {
        vue.aggs.roles = res.data.roles
        vue.aggs.levels = res.data.levels
        let itemsLevel = {
          id: 'bar_level',
          title: 'task level',
          legend: {
            '普通': 1,
            '重要': 2,
            '很重要': 3,
            '非常重要': 4
          },
          data: vue.aggs.levels
        }
        vue.genBar(itemsLevel)

        let itemsRole = {
          id: 'bar_role',
          title: 'task role',
          legend: {
            '创建': 'creator',
            '管理': 'operator',
            '参与': 'member'
          },
          data: vue.aggs.roles
        }
        vue.genBar(itemsRole)
      })
    }
  },
  mounted () {
    this.getTaskStatistics()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
