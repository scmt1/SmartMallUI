<template>
  <div class="mod-weixin-keywordresponse">
    <el-form :inline="true"
             :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('weixin:keywordresponse:save')"
                   type="primary"
                   @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              v-loading="dataListLoading"
              style="width: 100%;">
      <el-table-column prop="keyword"
                       header-align="center"
                       align="center"
                       label="关键字">
      </el-table-column>
      <el-table-column prop="pptype"
                       header-align="center"
                       align="center"
                       label="匹配模式">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pptype === 1"
                  size="small">模糊匹配</el-tag>
          <el-tag v-else-if="scope.row.pptype === 2"
                  size="small">完全匹配</el-tag>
        </template>
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
                       label="回复内容">
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
          <el-button v-if="isAuth('weixin:keywordresponse:update')"
                     type="text"
                     size="small"
                     @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <el-button v-if="isAuth('weixin:keywordresponse:delete')"
                     type="text"
                     size="small"
                     @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="keywordresponseAddOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './keywordresponse-add-or-update'
export default {
  data () {
    return {
      dataForm: {
        user: ''
      },
      msgTypes: { text: '文本消息', image: '图片消息', voice: '语音消息', video: '视频消息', news: '图文消息' },
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
        url: this.$http.adornUrl('/weixin/keywordresponse/page'),
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
        this.$refs.keywordresponseAddOrUpdate.init(val)
      })
    },
    // 删除
    // 删除
    deleteHandle (id) {
      this.$confirm(`${this.$i18n.t('weixin.makeSure')}${id ? this.$i18n.t('weixin.delete') : this.$i18n.t('weixin.batchDelete')}?`, this.$i18n.t('weixin.tips'), {
        confirmButtonText: this.$i18n.t('weixin.yes'),
        cancelButtonText: this.$i18n.t('weixin.no'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/weixin/keywordresponse/${id}`),
          method: 'delete',
          data: this.$http.adornData({}, false)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('text.success'),
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
