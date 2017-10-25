<template>
  <div class="tasklist">
    <el-button type="primary" @click="dialogFormVisible = true; form.description=''; input=''"><i class="el-icon-edit"></i></el-button>

    <el-dialog title="创建任务" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="任务描述" :label-width="formLabelWidth">
          <buttoms></buttoms>
          <el-input type="textarea" :row="15" v-model="form.description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="成员" :label-width="formLabelWidth">
          <el-input auto-complete="off" v-model='input' @keyup.native="selectUser"></el-input>
        </el-form-item>
      </el-form>
      <button v-for="user in selects">{{ user }}</button>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addtask">确 定</el-button>
      </div>
    </el-dialog>


    <el-row v-for="(taskline, line) in tasks" :key="line">
      <el-col :span="6" v-for="(task, index) in taskline" :key="index">

        <div style="margin-top: 20px; height: 200px;" @mouseenter="slidein(task)" @mouseleave="slideout(task)" :style="task.border">
          <el-collapse-transition>
            <div v-show="task.detail">
              <div class="transition-box" @click="entertask(task)">{{ task.taskid }}: {{ task.member }}</div>
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
      selects: [],
      tasks_raw: [],
      Color: {
        0: '#D9D9D9', 1: '#FF0000', 2: '#CD661D', 3: '#9400D3'
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        description: '',
        member: ''
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
    entertask: function (task) {
      let id = task.taskid
      this.$router.push({ path: '/taskdetail/' + id })
    },
    addtask: function () {
      for (let u of this.users) {
        console.log(u)
      }
      console.log('----------------')
      for (let u of this.usersForSelect) {
        console.log(u)
      }
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
    selectUser: function () {
      this.selects = []
      this.usersForSelect = this.users
      let ipts = this.input.split(' ').filter(function (d) {
        if (d) { return d }
      })

      for (let u of this.usersForSelect) {
        for (let i of ipts) {
          if (u.indexOf(i) > -1) {
            this.selects.push(u)
          }
        }
      }
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
