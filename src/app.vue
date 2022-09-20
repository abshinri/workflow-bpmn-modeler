<template>
  <div class="workflow-demo">
    <definition
      v-if="type === 'definition'"
      :users="users"
      :groups="groups"
      :categorys="categorys"
      :is-view="isView"
    />
  </div>
</template>

<script>
import definition from './definition'

import init from './init.js'
import axios from '../package/http.js'
export default {
  components: {
    definition
  },
  data() {
    return {
      type: 'definition',
      users: [],
      groups: [],
      categorys: [],
      isView: false
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
    })
  },
  methods: {}
}
</script>

<style lang="scss">
.workflow-bpmn-modeler {
  height: 100%;
  margin: 0;
}
</style>
