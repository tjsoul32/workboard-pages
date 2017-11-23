<template>
 <div>
    <el-breadcrumb separator="/" class="breadcrumb-inner">
      <el-breadcrumb-item v-for="(item, index) in breadlist" :key="item.path" @click.native="$router.push(item.path)">
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
  export default{
    created () {
      this.getBreadcrumb(true)
    },
    data () {
      return {
        breadlist: ''
      }
    },
    methods: {
      getBreadcrumb: function (isreload) {
        // console.log('getBreadcrumb')
        var breadNumber = typeof this.$route.meta.breadNumber !== 'undefined' ? this.$route.meta.breadNumber : 1
        var breadLength = this.$store.state.user.breadListState.length
        var curName = this.$route.name
        var curPath = this.$route.fullPath
        var newBread = {name: curName, path: curPath}
        if (breadNumber === 0 || breadNumber === 1) {
          this.$store.commit('breadListStateRemove', 1)
          if (breadNumber === 1) {
            this.$store.commit('breadListStateAdd', newBread)
          }
        } else {
          if (!isreload) {
            if (breadLength <= breadNumber) {
              this.$store.commit('breadListStateAdd', newBread)
            } else {
              this.$store.commit('breadListStateRemove', parseInt(breadNumber) + 1)
            }
          } else {
            this.$store.state.user.breadListState = JSON.parse(sessionStorage.getItem('breadListStorage'))
          }
        }
        this.breadlist = this.$store.state.user.breadListState
        sessionStorage.setItem('breadListStorage', JSON.stringify(this.breadlist))
      }
    },
    watch: {
      $route () {
        this.getBreadcrumb()
      }
    }
  }
</script>
