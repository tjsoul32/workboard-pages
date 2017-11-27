<template>
  <div class="taskdetail">
    <button @click="previous"><=</button>
    <button @click="backToList">O</button>
    <button @click="after">=></button>
    <div v-if="task.length !== 0">
      <button @click="LinkShare">share</button>
      <input id="url" type="text" readonly="readonly" :value="taskUrl"></input>
    </div>
    <el-dialog title="member" :visible.sync="dialogFormVisible_member">
      <el-form>

        <SearchUser :username="username" :member="task.member" :operator="task.operator"></SearchUser>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_member = false">取 消</el-button>
        <el-button type="primary" @click="confirmMember">确 定</el-button>
      </div>
    </el-dialog>

    <div>更新时间: {{ task.update_time }}</div>
    <div>创建人: {{ task.creator }} </div>

    <div>成员：
      <el-button :type="(task.operator.indexOf(m) > -1) ? 'info' : 'default'" v-for="(m, index) in task.member" :key="index" >{{m}}</el-button>
      <el-button @click="editmember" v-if="editor > 0"><i class="el-icon-edit"></i></el-button>
    </div>

    <div>创建时间: {{ task.create_time }}</div>

    <el-button-group>
      <el-button :type="task.level === 1 ? 'info' : 'default'" @click="setLevel(1)">普通</el-button>
      <el-button :type="task.level === 2 ? 'success' : 'default'" @click="setLevel(2)">重要</el-button>
      <el-button :type="task.level === 3 ? 'warning' : 'default'" @click="setLevel(3)">很重要</el-button>
      <el-button :type="task.level === 4 ? 'danger' : 'default'" @click="setLevel(4)">特别重要</el-button>
    </el-button-group>

    <el-dialog title="删除" :visible.sync="dialogFormVisible">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmdel">确 定</el-button>
      </div>
    </el-dialog>

    <el-card class="box-card">
      <transition-group name="fade" tag="div">
        <div v-for="(commit, index) in commits" :key="commit.commitid" class="fade-item">
          <hr>
          <div>{{ commit.create_time }}</div>
  
          <div v-if="commit.author_name === username">
            <div v-if="commit.edit">
              <Items></Items>
              <textarea class="el-textarea" v-model="commit.content"></textarea>
            </div>
            <div v-else>
              <Comment :content="commit.content"></Comment>
            </div>
            <el-button type="info">{{ commit.author_name }}</el-button>
            <el-button @click="edit(commit)">edit</el-button>
            <el-button @click="del(commit)">X</el-button>
          </div>
  
          <div v-else>
            <Comment :content="commit.content"></Comment>
            <el-button>{{ commit.author_name }}</el-button>
            <el-button @click="del(commit)" v-if="task.operator.indexOf(username) > -1">X</el-button>
          </div>
          <hr>  
        </div>
      </transition-group>
    </el-card>

    <br>
    <el-card class="box-card">
      <Items></Items>
      <textarea class="el-textarea" v-model="textarea"></textarea>
      <el-button @click="submit">submit</el-button>
    </el-card>
  </div>
</template>

<script>
import Comment from '@/components/Comment'
import Items from '@/components/Items'
import api from '@/api/api-workboard'
import SearchUser from '@/components/SearchUser'
import { Message } from 'element-ui'

export default {
  name: 'TaskDetail',
  data () {
    return {
      username: this.$store.state.user.username,
      task: {},
      commits: [],
      textarea: '',
      commitFordel: '',
      dialogFormVisible: false,
      dialogFormVisible_member: false
    }
  },
  computed: {
    editor: function () {
      return this.task.operator && this.task.operator.indexOf(this.username) > -1 ? 1 : 0
    },
    taskUrl: function () {
      return location.origin + '/#/taskstandalone/' + this.task.taskid
    }
  },
  components: {Comment, Items, SearchUser},
  props: ['isList', 'taskidNow'],
  watch: {
    taskidNow: function () {
      this.getTaskDetail()
    }
  },
  methods: {
    editmember: function () {
      this.dialogFormVisible_member = true
    },
    confirmMember: function () {
      let vue = this
      let params = new FormData()
      params.append('username', this.username)
      params.append('taskid', this.task.taskid)
      params.append('member', this.task.member)
      params.append('operator', this.task.operator)
      params.append('level', this.task.level)

      api('/tasksetmember/', 'post', params, function (res) {
        if (res.data.result === 'ok') {
          vue.dialogFormVisible_member = false
          return true
        } else {
          return false
        }
      }, 'setmember failed')
    },
    getTaskDetail: function () {
      let vue = this
      let taskid = this.taskidNow
      let params = {
        taskid: taskid,
        username: this.username
      }
      api('/taskdetail/', 'get', params, function (res) {
        vue.task = res.data.task
        vue.commits = res.data.commits
        vue.$emit('enterTask')
        if (vue.task.length === 0) {
          Message({
            message: '不是该任务成员',
            type: 'warning',
            duration: 3000
          })
        }
      })
    },
    getTaskInfo: function () {
      let vue = this
      let params = {
        taskid: this.taskidNow,
        username: this.username
      }
      api('/taskinfo/', 'get', params, function (res) {
        vue.task = res.data.task
      })
    },
    setLevel: function (level) {
      let vue = this
      let params = new FormData()
      params.append('username', this.username)
      params.append('taskid', this.task.taskid)
      params.append('level', level)

      api('/tasksetlevel/', 'post', params, function (res) {
        if (res.data.result === 'ok') {
          vue.task.level = level
          return true
        } else {
          return false
        }
      }, 'setlevel failed')
    },
    submit: function () {
      if (this.textarea.length < 3) {
        this.$message({
          message: 'xxxxx!',
          type: 'warning',
          duration: 1500
        })
        return false
      }
      let vue = this
      let params = new FormData()
      params.append('username', this.username)
      params.append('content', this.textarea)
      params.append('taskid', this.task.taskid)

      api('/contentnew/', 'post', params, function (res) {
        if (res.data.result === 'ok') {
          vue.commits.push(res.data.commit)
          vue.textarea = ''
          vue.getTaskInfo()
          return true
        } else {
          return false
        }
      }, 'commit newcontent failed')
    },
    edit: function (commit) {
      if (!commit.edit) {
        commit.edit = 1
        commit.contentEdit = commit.content
        this.$set(this.commits, this.commits.indexOf(commit), commit)
      } else {
        let vue = this
        if (commit.content === commit.contentEdit) {
          commit.edit = 0
          commit.contentEdit = ''
          vue.$set(vue.commits, vue.commits.indexOf(commit), commit)
          return true
        }
        let params = new FormData()
        params.append('commitid', commit.commitid)
        params.append('content', commit.content)
        params.append('taskid', this.task.taskid)

        api('/contentedit/', 'post', params, function (res) {
          if (res.data.result === 'ok') {
            commit.edit = 0
            commit.contentEdit = ''
            vue.$set(vue.commits, vue.commits.indexOf(commit), commit)
            vue.getTaskInfo()
            return true
          } else {
            return false
          }
        }, 'commit failed')
      }
    },
    del: function (commit) {
      this.commitFordel = commit
      this.dialogFormVisible = true
    },
    confirmdel: function () {
      let vue = this
      let params = new FormData()
      params.append('commitid', this.commitFordel.commitid)
      params.append('username', this.username)
      params.append('taskid', this.task.taskid)

      api('/contentdel/', 'post', params, function (res) {
        if (res.data.result === 'ok') {
          let index = vue.commits.indexOf(vue.commitFordel)
          vue.commits.splice(index, 1)
          vue.commitFordel = ''
          vue.dialogFormVisible = false
          return true
        } else {
          return false
        }
      }, 'commit delete failed')
    },
    previous: function () {
      this.$emit('previous')
    },
    after: function () {
      this.$emit('after')
    },
    backToList: function () {
      if (this.task.length > 0) {
        this.task = {}
        this.commits = []
        this.$emit('backToList')
      }
    },
    LinkShare: function () {
      var e = document.getElementById('url')
      e.value = this.taskUrl
      e.select()
      document.execCommand('Copy')
      Message({
        message: '任务地址已复制',
        type: 'info',
        duration: 3000
      })
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box-card {
  width: 80%;
}

.fade-item {
  transition: all 1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

.fade-leave-active {
  position: absolute;
}

.el-textarea {
  display: block;
  resize: vertical;
  padding: 5px 7px;
  line-height: 1.5;
  width: 100%;
  color: #1f2d3d;
  background-color: #fff;
  background-image: none;
  border: 1px solid #bfcbd9;
  border-radius: 4px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  white-space:nowrap;
  overflow: auto;
  word-wrap: normal;
  background-color: #FFFFF0;
  min-height: 400px;
  max-height: 850px;
  margin-top: 10px
}

</style>
