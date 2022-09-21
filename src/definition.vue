<template>
  <div class="workflow-definition">
    <template>
      <el-button
        v-show="openBpmn == true"
        class="close-bpmn-btn"
        type="danger"
        plain
        @click="openBpmn = false"
      >关闭流程图</el-button>
      <el-table
        v-show="openBpmn == false"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="name" label="name" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="deploymentId" label="deploymentId" />
        <el-table-column prop="flowKey" label="flowKey" />
        <el-table-column prop="category" label="category" />
        <el-table-column prop="version" label="version" />
        <el-table-column prop="suspensionState" label="suspensionState" />
        <el-table-column prop="deploymentTime" label="deploymentTime" />
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleClick(scope.row)"
            >流程图</el-button>
            <el-button
              type="text"
              size="small"
              @click="openEvent(scope.row.id)"
            >启动</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <bpmn-modeler
      v-if="openBpmn"
      ref="refNode"
      :xml="xml"
      :users="users"
      :groups="groups"
      :categorys="categorys"
      :is-view="isView"
    />
  </div>
</template>

<script>
import bpmnModeler from '../package/index'

import axios from '../package/http.js'
export default {
  components: {
    bpmnModeler
  },
  props: {
    users: {
      type: Array,
      default: () => []
    },
    groups: {
      type: Array,
      default: () => []
    },
    categorys: {
      type: Array,
      default: () => []
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      xml: '', // 后端查询到的xml
      openBpmn: false,

      tableData: []
    }
  },
  unmount() {
    this.$bus.$off('save')
  },
  methods: {
    init() {
      this.$bus.$on('save', (result) => {
        axios
          .request({
            url: '/flowable/definition/save',
            method: 'post',
            data: {
              category: 'demo',
              name: result.process.name,
              xml: result.xml
            }
          })
          .then((res) => {
            this.$message.success('保存成功')

            this.getFlowList()
          })
          .catch((err) => {
            this.$message.error(err)
          })
      })

      this.getFlowList()
    },
    // 获取工作流的定义
    getFlowList() {
      axios
        .request({
          url: '/flowable/definition/list?pageNum=1&pageSize=999999',
          method: 'get'
        })
        .then((res) => {
          this.tableData = res.data
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    getFlowXml(deployId) {
      axios
        .request({
          url: '/flowable/definition/readXml/' + deployId,
          method: 'get'
        })
        .then((res) => {
          this.xml = res.data
          this.openBpmn = true
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    openEvent(id) {
      this.$prompt('请为' + id + '配置变量集合', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          this.startEvent(id, value)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消启动'
          })
        })
    },
    startEvent(procDefId, data) {
      axios
        .request({
          url: '/flowable/instance/startBy/' + procDefId,
          method: 'post',
          data
        })
        .then((res) => {
          this.$message.success('启动成功')
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    handleClick(row) {
      this.getFlowXml(row.deploymentId)
    }
  }
}
</script>

<style lang="scss">
.workflow-bpmn-modeler {
  height: 100%;
  margin: 0;
}
</style>
