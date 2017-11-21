<template>
  <div class="searchuser">
    <div v-for="(user, index) in member" :key="index">
      <el-button type="info" @click.native="selectOperator(user)" v-if="operator.indexOf(user) !== -1">{{ user }}</el-button>
      <el-button @click.native="selectOperator(user)" v-else>{{ user }}</el-button>
      <el-button @click.native="unSelectUser(user)">X</el-button>
    </div>
    <el-form-item label="成员" label-width="120px">
      <el-input auto-complete="off" v-model='input' @keyup.native="searchUser"></el-input>
    </el-form-item>
    <el-button v-for="(user, index) in selects" :key="index" @click.native="selectUser(user)">{{ user }}</el-button>
  </div>
</template>

<script>
import api from '@/api/api-workboard'

export default {
  name: 'searchuser',
  data () {
    return {
      selects: [],
      usersForSelect: [],
      input: '',
      users: []
    }
  },
  props: ['member', 'operator'],
  computed: {
  },
  methods: {
    getusers: function () {
      let vue = this
      api('/userlist/', 'get', {}, function (res) {
        for (let u of res.data) {
          if (u.username !== vue.username) {
            vue.users.push(u.username)
          }
        }
      })
    },
    searchUser: function () {
      this.selects = []
      this.usersForSelect = this.users
      let ipts = this.input.split(' ').filter(function (d) {
        if (d) { return d }
      })

      for (let u of this.usersForSelect) {
        for (let i of ipts) {
          if (u.indexOf(i) > -1 && this.member.indexOf(u) === -1 && this.selects.indexOf(u) === -1) {
            this.selects.push(u)
          }
        }
      }
    },
    selectOperator: function (user) {
      let idx = this.operator.indexOf(user)
      if (idx === -1) {
        this.operator.push(user)
      } else {
        this.operator.splice(idx, 1)
      }
    },
    selectUser: function (user) {
      this.member.push(user)
      this.selects.splice(this.selects.indexOf(user), 1)
    },
    unSelectUser: function (user) {
      this.selects.push(user)
      this.member.splice(this.member.indexOf(user), 1)
      const isOps = this.operator.indexOf(user)
      if (isOps > -1) {
        this.operator.splice(isOps, 1)
      }
    }
  },
  mounted () {
    this.getusers()
  }
}
</script>

<style scoped>
</style>
