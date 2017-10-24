<template>
  <div class="comment">
    <div v-if="contentLen <= 200">
      <Convert :content="content"></Convert>
    </div>

    <div v-else>
      <div v-if="collapsed">
        <Convert :content="display"></Convert>
        <button @click="coll">展开</button>
      </div>
      <div v-else>
        <button @click="uncoll">折叠</button>
        <Convert :content="content"></Convert>
        <button @click="uncoll">折叠</button>
      </div>
    </div>
  </div>
</template>

<script>
import Convert from './Convert'

export default {
  name: 'comment',
  data () {
    return {
      collapsed: 1
    }
  },
  props: ['content'],
  components: {Convert},
  computed: {
    display: function () {
      return this.content.substr(0, 200) + '......'
    },
    contentLen: function () {
      return this.content.length
    }
  },
  methods: {
    coll: function () {
      this.collapsed = 0
    },
    uncoll: function () {
      this.collapsed = 1
    }
  }
}
</script>

<style scoped>
.comment {
  word-wrap: break-word;
}

</style>
