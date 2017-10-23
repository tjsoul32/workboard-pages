<template>
  <div class="tasklist">
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

export default {
  name: 'TaskList',
  data () {
    return {
      username: this.$store.state.user.username,
      tasks_raw: [],
      Color: {
        0: '#D9D9D9',
        1: '#FF0000',
        2: '#CD661D',
        3: '#9400D3'
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
    gettasks: function () {
      let vue = this
      let params = {username: this.username}

      api('/tasklist/', 'get', params, function (res) {
        vue.tasks_raw = res.data
      })
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
