<template>
  <el-card class="box-card" style="overflow: auto;">
    <div v-for="(item, index) in items" :style="item[0].type === 999 ? 'display: block;' : 'display: block;clear: both'">
      <br v-if="item[0].type === 999">
      <span v-for="it in item" style="float:left; display:block!important; text-align:left;" v-else>
        <pre v-if="it.type === 0">{{ it.value }}</pre>
        <el-button v-if="it.type === 1">{{ it.value }}</el-button>
        <el-button v-if="it.type === 2" type="info">{{ it.value }}</el-button>
        <el-button v-if="it.type === 3" type="success">{{ it.value }}</el-button>
        <el-button v-if="it.type === 4" type="warning">{{ it.value }}</el-button>
        <a v-if="it.type === 10" :href="it.value">{{ it.value }}</a>
        <h1 v-if="it.type === 21">{{ it.value }}</h1>
        <h2 v-if="it.type === 22">{{ it.value }}</h2>
        <h3 v-if="it.type === 23">{{ it.value }}</h3>
      </span>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'convert',
  data () {
    return {
    }
  },
  props: ['content'],
  computed: {
    items: function () {
      let blocks = []
      let contents = this.content.split(/[\n]/)
      for (let content of contents) {
        let block = []
        let its = []
        blocks.push([{type: 999}])

        if (content.trim().length > 0) {
          var re = /@\d+\|.+?@/g
          let rs = 1
          while (rs != null) {
            rs = re.exec(content)
            let it = {}
            it.value = rs ? rs[0].split('|')[1].slice(0, rs[0].split('|')[1].length - 1) : ''
            it.raw = rs ? rs[0] : ''
            it.type = rs ? parseInt(rs[0].split('|')[0].slice(1)) : 0
            it.index = rs ? re.lastIndex - rs[0].length : content.length
            its.push(it)
          }
          let now = 0
          for (let it of its) {
            if (it.type !== 0) {
              let before = {}
              before.type = 0
              before.value = content.slice(now, it.index)
              block.push(before)
              now += before.value.length
            }
            block.push(it)
            now += it.raw.length
          }
          block.push({
            type: 0,
            value: content.slice(now)
          })
        } else {
          block.push({type: 999})
        }
        blocks.push(block)
      }
      return blocks
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.convert {
  word-wrap: break-word;
}

</style>
