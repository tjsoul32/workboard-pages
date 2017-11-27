<template>
  <div class="taskstandalone">
      <TaskDetail :taskidNow="taskid"></TaskDetail>
  </div>
</template>

<script>
import TaskDetail from '@/components/TaskDetail'

export default {
  name: 'TaskStandalone',
  data () {
    return {
      username: this.$store.state.user.username,
      taskid: 0
    }
  },
  computed: {
  },
  components: {TaskDetail},
  methods: {
  },
  mounted () {
    this.taskid = this.$route.params.id
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
