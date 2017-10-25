<template>
  <div class="tasklist">
    <el-button type="primary" @click="newtask"><i class="el-icon-edit"></i></el-button>

    <el-dialog title="创建任务" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="LEVEL" :label-width="formLabelWidth">
          <el-button-group>
            <el-button :type="level === 1 ? 'info' : 'default'" @click="setLevel(1)">普通</el-button>
            <el-button :type="level === 2 ? 'success' : 'default'" @click="setLevel(2)">重要</el-button>
            <el-button :type="level === 3 ? 'warning' : 'default'" @click="setLevel(3)">很重要</el-button>
            <el-button :type="level === 4 ? 'danger' : 'default'" @click="setLevel(4)">特别重要</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item label="任务描述" :label-width="formLabelWidth">
          <Items></Items>
          <el-input type="textarea" :row="15" v-model="form.description" auto-complete="off"></el-input>
        </el-form-item>

        <div v-for="(user, index) in member" :key="index">
          <el-button type="info" @click.native="selectOperator(user)" v-if="operator.indexOf(user) !== -1">{{ user }}</el-button>
          <el-button @click.native="selectOperator(user)" v-else>{{ user }}</el-button>

          <el-button @click.native="unSelectUser(user)">X</el-button>
        </div>

        <el-form-item label="成员" :label-width="formLabelWidth">
          <el-input auto-complete="off" v-model='input' @keyup.native="searchUser"></el-input>
        </el-form-item>
      </el-form>
      <el-button v-for="(user, index) in selects" :key="index" @click.native="selectUser(user)">{{ user }}</el-button>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addtask">确 定</el-button>
      </div>
    </el-dialog>

    <el-row v-for="(taskline, line) in tasks" :key="line">
      <el-col :span="6" v-for="(task, index) in taskline" :key="index" style="padding: 5px;">
        <div style="margin-top: 20px; height: 200px;" @mouseenter="slidein(task)" @mouseleave="slideout(task)" :style="task.border">
          <el-collapse-transition>
            <div v-show="task.detail">
              <div class="transition-box" @click="entertask(task)">{{ task.taskid }}: {{ task.search }}</div>
            </div>
          </el-collapse-transition>
          <el-card :body-style="{ padding: '0px', height: '150px' }" class="box-card">
            <div style="padding: 14px;">
              <span class="content">{{ task.description }}</span>
            </div>
            <div class="bottom clearfix">
              <time class="time">{{ task.update_time }}</time>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import api from '@/api/api-workboard'
import Items from './Items'

export default {
  name: 'TaskList',
  data () {
    return {
      username: this.$store.state.user.username,
      users: [],
      usersForSelect: [],
      input: '',
      level: 1,
      selects: [],
      operator: [],
      member: [],
      tasks_raw: [],
      Color: {
        1: '#73ccff', 2: '#42d885', 3: '#f7ba2a', 4: '#ff4949'
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        description: '',
        search: ''
      },
      formLabelWidth: '120px'
    }
  },
  computed: {
    tasks: function () {
      let tks = []
      let n = 0
      let taskLine = []
      for (let task of this.tasks_raw) {
        task['border'] = 'border: 2px solid ' + this.Color[task['level']]
        taskLine.push(task)
        n += 1
        if (n % 4 === 0) {
          tks.push(taskLine)
          taskLine = []
        }
      }
      tks.push(taskLine)
      return tks
    }
  },
  components: { Items },
  methods: {
    slidein: function (task) {
      task.detail = 1
      this.$set(this.tasks_raw, this.tasks_raw.indexOf(task), task)
    },
    slideout: function (task) {
      task.detail = 0
      this.$set(this.tasks_raw, this.tasks_raw.indexOf(task), task)
    },
    newtask: function () {
      this.dialogFormVisible = true
      this.form.description = ''
      this.input = ''
      this.member = []
    },
    entertask: function (task) {
      let id = task.taskid
      this.$router.push({ path: '/taskdetail/' + id })
    },
    addtask: function () {
      if (this.member.length === 0 || this.form.description.trim().length === 0) { return false }

      let vue = this
      let params = new FormData()
      params.append('username', this.username)
      params.append('member', this.member)
      params.append('operator', this.operator)
      params.append('description', this.form.description)
      params.append('level', this.level)

      api('/taskadd/', 'post', params, function (res) {
        if (res.data.result === 'ok') {
          vue.dialogFormVisible = false
          vue.$router.push({ path: '/tasklist/' })
        } else {
          return false
        }
      }, 'create failed')
    },
    gettasks: function () {
      let vue = this
      let params = { username: this.username }

      api('/tasklist/', 'get', params, function (res) {
        vue.tasks_raw = res.data
      })
    },
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
    selectUser: function (user) {
      this.member.push(user)
      this.selects.splice(this.selects.indexOf(user), 1)
    },
    unSelectUser: function (user) {
      this.selects.push(user)
      this.member.splice(this.member.indexOf(user), 1)
    },
    selectOperator: function (user) {
      let idx = this.operator.indexOf(user)
      if (idx === -1) {
        this.operator.push(user)
      } else {
        this.operator.splice(idx, 1)
      }
    },
    setLevel: function (level) {
      this.level = level
    }
  },
  mounted () {
    this.gettasks()
    this.getusers()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  width: 100%;
  display: block;
  word-wrap: break-word;    
}

.time {
  font-size: 15px;
  color: #999;
}

.bottom {
  border: #999 solid 1px;
  margin-top: 13px;
  line-height: 15px;
  position: absolute;
  bottom: 0px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
    clear: both
}

.transition-box {
    margin-bottom: 10px;
    //width: 200px;
    height: 50px;
    border-radius: 4px;
    background-color: #20A0FF;
    text-align: center;
    color: #fff;
}
  
</style>
