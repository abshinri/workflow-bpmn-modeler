<template>
  <div class="workflow-demo">
    <div class="header">
      <el-row>
        <el-col :span="15" :offset="1">
          <el-tabs v-model="type" @tab-click="handleClick">
            <el-tab-pane label="定义" name="definition" />
            <el-tab-pane label="任务" name="task" />
          </el-tabs>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-row :gutter="4" style="padding-top: 10px">
            <el-col :span="6" style="line-height: 40px">
              <div>当前：{{ loginName }}</div></el-col>
            <el-col :span="6">
              <el-input v-model="login.username" placeholder="用户名" />
            </el-col>
            <el-col :span="6">
              <el-input v-model="login.password" placeholder="密码" />
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="clickLogin">更换用户</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <definition
      v-if="type === 'definition'"
      ref="definition"
      :users="users"
      :groups="groups"
      :categorys="categorys"
      :is-view="isView"
    />

    <task v-if="type === 'task'" ref="task" />
  </div>
</template>

<script>
import definition from './definition'
import task from './task'

import init from './init.js'
import axios from '../package/http.js'
export default {
  components: {
    definition,
    task
  },
  data() {
    return {
      type: 'definition',
      users: [],
      groups: [],
      categorys: [],
      isView: false,
      loginName: '张一',
      login: {
        username: '张一',
        password: '123456'
      }
    }
  },
  mounted() {
    init(() => {
      const users = JSON.parse(window.sessionStorage.getItem('userList'))
      this.users = users.map((i) => {
        return {
          id: i.id,
          name: i.username
        }
      })
      const groups = JSON.parse(window.sessionStorage.getItem('userGroup'))
      for (const key in groups) {
        this.groups.push({
          id: key,
          name: key
        })
      }
      this.$refs.definition.init()
    })
  },
  methods: {
    clickLogin() {
      axios
        .request({
          url: '/user/login',
          method: 'post',
          data: {
            username: '张一',
            password: '123456'
          }
        })
        .then((res) => {
          this.type = 'definition'
          this.loginName = this.login.username
          window.sessionStorage.setItem('token', res.data)

          this.$refs.definition.init()
        })
    },
    handleClick(tab) {
      if (tab.name === 'definition') {
        this.$nextTick(() => {
          this.$refs.definition.init()
        })
      }
      if (tab.name === 'task') {
        this.$nextTick(() => {
          this.$refs.task.init()
        })
      }
    }
  }
}
</script>

<style lang="scss">
.workflow-demo {
  padding-top: 40px;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 100;
  background-color: #fff;
}
</style>
