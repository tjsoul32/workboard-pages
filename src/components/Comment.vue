<template>
  <div class="comment">
    <div v-if="contentRows <= 10">
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
import Convert from '@/components/Convert'

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
      return this.content.split('\n').slice(0, 10).join('\n') + '......'
    },
    contentRows: function () {
      return this.content.split('\n').length
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
}

</style>
