<template>
  <div class="workflow-task">
    <template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="taskId" label="taskId" />
        <el-table-column prop="taskName" label="taskName" />
        <el-table-column prop="taskDefKey" label="taskDefKey" />
        <el-table-column prop="assigneeId" label="assigneeId" />
        <el-table-column prop="assigneeName" label="assigneeName" />
        <el-table-column prop="startUserName" label="startUserName" />
        <el-table-column prop="category" label="category" />
        <el-table-column prop="procDefKey" label="procDefKey" />
        <el-table-column prop="procDefName" label="procDefName" />
        <el-table-column prop="procInsId" label="procInsId" />
        <el-table-column prop="comment" label="comment" />
        <el-table-column prop="candidate" label="candidate" />
        <el-table-column prop="createTime" label="createTime" />
        <el-table-column prop="finishTime" label="finishTime" />
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="complete(scope.row)"
            >审批</el-button>
            <el-button
              type="text"
              size="small"
              @click="reject(scope.row)"
            >回退</el-button>

            <el-button
              type="text"
              size="small"
              @click="getFlowRecord(scope.row)"
            >审批记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-dialog
      title="审批记录"
      :visible.sync="dialogVisible"
      width="90%"
      lock-scroll
      custom-class="record-dialog"
      top="3vh"
      @closed="dialogClosed"
    >
      <el-table :data="recoedData" style="width: 100%">
        <el-table-column prop="taskId" label="taskId" />
        <el-table-column prop="taskName" label="taskName" />
        <el-table-column prop="taskDefKey" label="taskDefKey" />
        <el-table-column prop="assigneeId" label="assigneeId" />
        <el-table-column prop="assigneeName" label="assigneeName" />
        <el-table-column prop="startUserName" label="startUserName" />
        <el-table-column prop="category" label="category" />
        <el-table-column prop="procDefKey" label="procDefKey" />
        <el-table-column prop="procDefName" label="procDefName" />
        <el-table-column prop="procInsId" label="procInsId" />
        <el-table-column prop="comment" label="comment" />
        <el-table-column prop="candidate" label="candidate" />
        <el-table-column prop="createTime" label="createTime" />
        <el-table-column prop="finishTime" label="finishTime" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import axios from '../package/http.js'
export default {
  data() {
    return {
      dialogVisible: false,
      recoedData: [],

      tableData: []
    }
  },

  methods: {
    init() {
      this.getTaskList()
    },
    // 获取工作流的定义
    getTaskList() {
      axios
        .request({
          url: '/flowable/task/todoList?pageNum=1&pageSize=999999',
          method: 'get'
        })
        .then((res) => {
          this.tableData = res.data.list
        })
    },
    // 审批任务

    complete(row) {
      axios
        .request({
          url: '/flowable/task/complete',
          method: 'post',
          data: {
            comment: 'early demo data - complete',
            instanceId: row.procInsId,
            taskId: row.taskId
          }
        })
        .then((res) => {
          this.$message.success('审批成功')
          this.getTaskList()
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },

    reject(row) {
      axios
        .request({
          url: '/flowable/task/reject',
          method: 'post',
          data: {
            comment: 'early demo data - reject',
            instanceId: row.procInsId,
            taskId: row.taskId
          }
        })
        .then((res) => {
          this.$message.success('回退成功')
          this.getTaskList()
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },

    // 获取流程审批记录
    getFlowRecord(row) {
      axios
        .request({
          url: `/flowable/task/flowRecord?deployId=${row.deployId}&procInsId=${row.procInsId}`,
          method: 'get'
        })
        .then((res) => {
          this.recoedData = res.data
          this.dialogVisible = true
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    dialogClosed() {
      this.recoedData = []
    }
  }
}
</script>

<style lang="scss">
.workflow-bpmn-modeler {
  height: 100%;
  margin: 0;
}
.record-dialog {
  .el-dialog__body {
    height: 75vh;
    overflow: auto;
  }
}
</style>
