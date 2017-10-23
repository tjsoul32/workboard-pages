<template>
  <div class="login">
    <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="80px">
      <el-form-item prop="username">
        <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="submitForm('ruleForm')">login</el-button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 20, message: '请输入正确的用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.ruleForm).then(() => {
            this.loading = false
            if (this.$store.state.user.token.length === 0) {
              this.loginFailed()
            } else {
              this.ruleForm.password = ''
            }
            this.$router.push({ path: '/' })
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    loginFailed: function () {
      this.$message({
        message: '用户名或密码错误!',
        type: 'warning',
        duration: 1500
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  width: 30%;
  text-align: center;
}

</style>
