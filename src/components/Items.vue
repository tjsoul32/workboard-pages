<template>
  <div class="buttoms">
    <el-button @click="selectText(1)">default</el-button>
    <el-button @click="selectText(2)">info</el-button>
    <el-button @click="selectText(3)">success</el-button>
    <el-button @click="selectText(4)">warning</el-button>
    <el-button @click="selectText(10)">href</el-button>
    <el-button @click="selectText(21)">H1</el-button>
    <el-button @click="selectText(22)">H2</el-button>
    <el-button @click="selectText(23)">H3</el-button>
  </div>
</template>

<script>
export default {
  name: 'buttoms',
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    selectText: function (tp) {
      let selecter = window.getSelection()
      // console.log(window.getSelection().getRangeAt(0))

      let selectStr = selecter.toString()
      let newText = selectStr.trim() ? `@${tp}|` + selectStr + '@' : selectStr
      selecter.deleteFromDocument()
      document.execCommand('insertHTML', 'false', newText)
    }
  }
}
</script>

<style scoped>
.buttoms {
}
</style>
