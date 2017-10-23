import { login, logout } from '@/api/login'
import { getToken, setToken, removeToken, getUsername, setUsername, removeUsername } from '@/utils/auth'

const user = {
  state: {
    username: getUsername(),
    token: getToken()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    }
  },

  actions: {
    Login ({ commit }, userinfo) {
      const username = userinfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userinfo.password).then(response => {
          const data = response
          setToken(data.token)
          setUsername(username)
          commit('SET_TOKEN', data.token)
          commit('SET_USERNAME', username)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    Logout ({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_USERNAME', '')
          removeToken()
          removeUsername()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
