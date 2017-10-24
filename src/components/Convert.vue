<template>
  <div class="convert">
    <div v-for="(it, index) in items">
      <div v-if="it.type === 0">{{ it.value }}</div>
      <el-button v-if="it.type === 1">{{ it.value }}</el-button>
      <el-button v-if="it.type === 2" type="info">{{ it.value }}</el-button>
      <el-button v-if="it.type === 3" type="success">{{ it.value }}</el-button>
      <el-button v-if="it.type === 4" type="warning">{{ it.value }}</el-button>
      <a v-if="it.type === 10" :href="it.value">{{ it.value }}</a>
      <h1 v-if="it.type === 20">{{ it.value }}</h1>
    </div>

  </div>
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
      let res = []
      let its = []
      let content = this.content
      // var re = /@\d+\|([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9.:/])+@/g
      var re = /@\d+\|.+@/g
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
          res.push(before)
          now += before.value.length
        }

        res.push(it)
        now += it.raw.length
      }
      // console.log(content)
      // console.log(now)
      res.push({
        type: 0,
        value: content.slice(now)
      })
      return res
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
