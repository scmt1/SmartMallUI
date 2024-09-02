<template>
  <div>
    <el-dialog
      :title="$t('platform.selectTag')"
      :visible.sync="visible"
      width="36%"
      class="el-upload-list el-upload-list--picture-card"
    >
      <el-form :inline="true" :model="searchForm" class="demo-form-inline form">
        <el-form-item>
          <el-input v-model="tagName" size="small" :placeholder="$t('user.tagTip1')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <div
            class="default-btn primary-btn"
            @click="searchChange"
          >{{$t("pictureManager.query")}}</div>
        </el-form-item>
      </el-form>
      <el-main>
        <div class="main">
          <div v-for="item in tagList" :key="item.tagId">
            <span
              :class="active.includes(item.userTagId)?'active':'Classification'"
              @click="oncheck(item)"
            >{{item.tagName}}</span>
          </div>
        </div>
        <div v-if="tagList.length < 1" style="text-align:center">{{$t('order.noData')}}</div>
      </el-main>

      <!-- 分页 -->
      <el-pagination
        v-if="tagList.length"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <!-- /分页 -->
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
        <div class="default-btn primary-btn" @click="confirm">{{$t('remindPop.confirm')}}</div>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {

  data () {
    return {
      visible: false,
      confirmLoad: false,
      dataForm: {
        tagList: [], // 标签
        userIds: []
      },
      tagList: [], // 标签
      selectedTags: [],
      dataRule: {
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      active: [], // 选种的标签
      searchForm: {
        tagType: 0, // 标签类型0手动1条件2系统
        tagName: null
      },
      tagName: null
    }
  },
  components: {
  },
  props: {
    value: {
      default: '',
      type: String
    },
    // 最大上传数量
    limit: {
      default: 10,
      type: Number
    }
  },
  mounted () {
  },
  methods: {
    init (ids) {
      this.visible = true
      this.dataForm.userIds = ids
      this.tagName = ''
      this.searchForm.tagName = ''
      this.getTagList()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getTagList(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getTagList(this.page)
    },
    // 分页获取标签
    getTagList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/userTag/byTagType'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.searchForm
          )
        )
      }).then(({ data }) => {
        this.tagList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 搜索
    searchChange () {
      this.searchForm.tagName = this.tagName
      this.getTagList(this.page)
    },
    // 多选
    oncheck (item) {
      if (this.active.includes(item.userTagId)) {
        let index = this.active.indexOf(item.userTagId)
        this.active.splice(index, 1)
      } else {
        this.active.push(item.userTagId)
      }
      if (this.active.length > this.limit) {
        let index = this.active.indexOf(item.userTagId)
        this.active.splice(index, 1)
        return this.$message.error(this.$i18n.t('user.tipError2').replace('NUM', this.limit))
      }
    },
    confirm () {
      if (!this.dataForm.userIds) {
        return
      }
      if (!this.active.length) {
        this.$message.error(this.$i18n.t('platform.selectTagError'))
        return
      }
      this.confirmLoad = true
      this.dataForm.tagList = []
      this.active.forEach(item => {
        // this.dataForm.tagList.push(item.userTagId)
        this.dataForm.tagList.push(item)
      })
      let param = this.dataForm
      this.$http({
        url: this.$http.adornUrl(`/user/userTag/updateUserTag`),
        method: 'put',
        data: this.$http.adornData(param)
      }).then(({ data }) => {
        this.active = []
        this.$message({
          message: this.$i18n.t('remindPop.success'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.confirmLoad = false
            this.$emit('refreshDataList', this.page)
          }
        })
      }).catch((e) => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.active {
  float: left;
  margin-left: 10px;
  padding: 10px;
  background: #155bd4;
  margin-bottom: 10px;
  border-radius: 4px;
  font-size: 14px;
  color:#f7f7f7;
}
.Classification {
  float: left;
  margin-left: 10px;
  padding: 10px;
  background: #f7f7f7;
  margin-bottom: 10px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
</style>
