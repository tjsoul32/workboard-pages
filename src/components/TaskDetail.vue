<template>
  <div class="taskdetail">
    <div v-for="(value, key) in task">
      {{ key }}: {{ value }}
    </div>

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
              <el-input type="textarea" :row="15" v-model="commit.content"></el-input>
            </div>
            <div v-else>
              <Comment :content="commit.content"></Comment>
            </div>
            <el-button type="info">{{ commit.author_name }}</el-button>
            <el-button @click="edit(commit)">edit</el-button>
            <el-button @click="del(commit)">X</el-button>
          </div>
  
          <div v-else>
            <el-button>{{ commit.author_name }}</el-button>
            <Comment :content="commit.content"></Comment>
          </div>
  
        </div>
      </transition-group>
    </el-card>

    <br>
    <Items></Items>
    <el-input type="textarea" :rows="5" v-model="textarea"></el-input>
    <el-button @click="submit">submit</el-button>
  </div>
</template>

<script>
import Comment from './Comment'
import Items from './Items'
import api from '@/api/api-workboard'

export default {
  name: 'TaskDetail',
  data () {
    return {
      username: this.$store.state.user.username,
      task: {},
      commits: [],
      textarea: '',
      dialogFormVisible: false,
      commitFordel: ''
    }
  },
  computed: {
  },
  components: {Comment, Items},
  methods: {
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
    }
  },
  mounted () {
    let vue = this
    let taskid = this.$route.params.taskid
    let params = {
      taskid: taskid,
      username: this.username
    }

    api('/taskdetail/', 'get', params, function (res) {
      vue.task = res.data.task
      vue.commits = res.data.commits
    })
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

</style>
