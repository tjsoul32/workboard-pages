<template>
  <div>

    <div>
      <div>
        <div>{{ username }}</div>
        <logout></logout>
      </div>
      <router-link to="/tasklist">tasklist</router-link>
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
import logout from './Logout'

export default {
  name: 'app',
  data () {
    return {
      username: this.$store.state.user.username
    }
  },
  components: {logout}
}
</script>
