<template>
  <div class="logout">
    <el-button @click="submitForm">logout</el-button>
  </div>
</template>

<script>
export default {
  name: 'Logout',
  data () {
    return {
      loading: false
    }
  },
  methods: {
    submitForm: function () {
      this.loading = true
      this.$store.dispatch('Logout').then(() => {
        this.loading = false
        this.$router.push({ path: '/login' })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logout {
  width: 30%;
  align: center;
}

</style>
