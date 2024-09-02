<template>
  <div class="mod-weixin-subscribe">
    <el-form :inline="true"
             :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('weixin:subscribe:save')"
                   type="primary"
                   @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              v-loading="dataListLoading"
              style="width: 100%;">
      <el-table-column prop="createTime"
                       header-align="center"
                       align="center"
                       label="创建时间">
      </el-table-column>
      <el-table-column prop="msgType"
                       header-align="center"
                       align="center"
                       label="消息类型">
        <template slot-scope="scope">
          <el-tag size="small">{{msgTypes[scope.row.msgType]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       label="消息内容">
        <template slot-scope="scope">
          <div v-if="scope.row.msgType === 'text'">{{scope.row.content}}</div>
          <a v-else-if="scope.row.msgType === 'news'"
             :href="scope.row.news.url"
             target="_yami_weixin_news">查看</a>
          <img v-else-if="scope.row.msgType === 'image'"
               :src="scope.row.content" />
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       header-align="center"
                       align="center"
                       width="150"
                       label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('weixin:subscribe:update')"
                     type="text"
                     size="small"
                     @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <el-button v-if="isAuth('weixin:subscribe:delete')"
                     type="text"
                     size="small"
                     @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="subscribeAddOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './subscribe-add-or-update'
export default {
  data () {
    return {
      dataForm: {
        user: ''
      },
      msgTypes: { text: this.$i18n.t('weixin.text'), image: this.$i18n.t('weixin.image'), voice: this.$i18n.t('weixin.voice'), video: this.$i18n.t('weixin.video'), news: this.$i18n.t('weixin.news') },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/weixin/subscribe/page'),
        method: 'get',
        params: this.$http.adornParams({
        })
      }).then(({ data }) => {
        data.forEach(item => {
          if (item.msgType === 'news') {
            item.news = JSON.parse(item.content)
          }
        })
        this.dataList = data
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (val) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.subscribeAddOrUpdate.init(val)
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('remindPop.makeSure') + ' ' + `[${id ? this.$i18n.t('remindPop.delete') : this.$i18n.t('remindPop.batchDeletion')}]` + ' ' + this.$i18n.t('remindPop.operation') + '?', this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/weixin/subscribe/${id}`),
          method: 'delete',
          data: this.$http.adornData({}, false)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      }).catch(() => { })
    }
  }
}
</script>
