<template>
  <div class="tasklist">

    <div v-show="isList">
      <el-button type="primary" @click="newtask"><i class="el-icon-edit"></i></el-button>
      <el-dialog title="创建任务" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="LEVEL" label-width="120px">
            <el-button-group>
              <el-button :type="level === 1 ? 'info' : 'default'" @click="setLevel(1)">普通</el-button>
              <el-button :type="level === 2 ? 'success' : 'default'" @click="setLevel(2)">重要</el-button>
              <el-button :type="level === 3 ? 'warning' : 'default'" @click="setLevel(3)">很重要</el-button>
              <el-button :type="level === 4 ? 'danger' : 'default'" @click="setLevel(4)">特别重要</el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item label="任务描述" label-width="120px">
            <el-input type="textarea" :row="15" v-model="form.description" auto-complete="off"></el-input>
          </el-form-item>
  
          <SearchUser :username="username" :member="member" :operator="operator"></SearchUser>
  
        </el-form>
  
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addtask">确 定</el-button>
        </div>
      </el-dialog>
  
      <el-row v-for="(taskline, line) in tasks" :key="line">
        <el-col :span="6" v-for="(task, index) in taskline" :key="index" style="padding: 5px;">
          <div style="margin-top: 20px; height: 200px;" @click="slidechange(task)" @mouseenter="slidein(task)" @mouseleave="slideout(task)" :style="task.border">
            <el-collapse-transition>
              <div v-show="task.detail">
                <div class="transition-box" @click="entertask(task)">{{ task.taskid }}: {{ task.creator }}</div>
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

    <div v-show="!isList">
      <TaskDetail @previous="previous" @after="after" @backToList="back" :isList="isList" :taskidNow="taskidNow"></TaskDetail>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import api from '@/api/api-workboard'
import SearchUser from '@/components/SearchUser'
import TaskDetail from '@/components/TaskDetail'

export default {
  name: 'TaskList',
  data () {
    return {
      username: this.$store.state.user.username,
      isList: true,
      taskidNow: 0,
      level: 1,
      operator: [],
      member: [],
      tasks_raw: [],
      Color: {
        1: '#73ccff', 2: '#42d885', 3: '#f7ba2a', 4: '#ff4949'
      },
      dialogFormVisible: false,
      form: {
        description: '',
        search: ''
      }
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
  components: {SearchUser, TaskDetail},
  methods: {
    slidechange: function (task) {
      task.detail = Math.abs(task.detail - 1)
      this.$set(this.tasks_raw, this.tasks_raw.indexOf(task), task)
    },
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
      this.isList = false
      this.taskidNow = task.taskid
    },
    addtask: function () {
      if (this.form.description.trim().length === 0) { return false }

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
          vue.gettasks()
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
    setLevel: function (level) {
      this.level = level
    },
    previous: function () {
      for (let idx in this.tasks_raw) {
        idx = parseInt(idx)
        if (this.tasks_raw[idx].taskid === this.taskidNow) {
          if (idx > 0) {
            this.taskidNow = this.tasks_raw[idx - 1].taskid
            break
          } else {
            Message({
              message: '已到头',
              type: 'info',
              duration: 3000
            })
          }
        }
      }
    },
    after: function () {
      for (let idx in this.tasks_raw) {
        idx = parseInt(idx)
        if (this.tasks_raw[idx].taskid === this.taskidNow) {
          if (idx < this.tasks_raw.length - 1) {
            this.taskidNow = this.tasks_raw[idx + 1].taskid
            break
          } else {
            Message({
              message: '已到底',
              type: 'info',
              duration: 3000
            })
          }
        }
      }
    },
    back: function () {
      this.isList = true
    }
  },
  mounted () {
    this.gettasks()
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
