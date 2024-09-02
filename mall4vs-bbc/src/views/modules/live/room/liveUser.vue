<template>
  <div class="mod-live-liveUser">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="anchorWechat" :label="$t('shop.weChatNumber')+':'" class="search-form-item">
            <el-input size="small" type="text" v-model="searchForm.anchorWechat" :placeholder="$t('shop.weChatNumber')"></el-input>
          </el-form-item>
          <el-form-item prop="nickName" :label="$t('users.name')+':'" class="search-form-item">
            <el-input size="small" type="text" v-model="searchForm.nickName" :placeholder="$t('users.name')"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('shop.resetMap')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div
          class="default-btn primary-btn"
          v-if="isAuth('live:liveUser:save')"
          @click="addOrUpdateHandle()"
          >{{ $t("crud.addTitle") }}</div
        >
        <span class="live-tips"
          >（{{ $t("live.newLiveUserNum") }}<span class="stress">{{ shopNum }}</span>{{ $t("live.times") }}，{{
            $t("live.subPlatRemLimi")
          }}<span class="stress">{{ totalNum }}</span>{{ $t("live.times") }}）</span
        >
      </div>
      <div class="table-con live-user-table">
        <el-table
          ref="liveUserTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            align="left"
            prop="nickName"
            :label="$t('users.name')"
            width="330">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.nickName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="anchorWechat"
            :label="$t('shop.weChatNumber')"
            width="330">
          </el-table-column>
          <el-table-column
            align="left"
            prop="roles"
            :label="$t('sys.roles')"
            width="250">
          </el-table-column>
          <el-table-column
            align="left"
            prop="createTime"
            :label="$t('sys.creationTime')"
            width="250">
          </el-table-column>
          <el-table-column
            align="left"
            prop="updateTime"
            :label="$t('home.updateTime')"
            width="250">
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('publics.operating')"
            width="auto">
             <template slot-scope="scope">
              <div
                class="default-btn text-btn"
                v-if="isAuth('live:liveUser:delete')"
                @click="deleteHandle(scope.row.liveUserId)"
                >{{ $t("crud.delBtn") }}</div
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './liveUser-add-or-update'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {}, // 搜索
      dataListLoading: false,
      totalNum: 0,
      shopNum: 0,
      deleteTotalNum: 0,
      deleteShopNum: 0,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList (page, newData = false) {
      this.dataListLoading = true
      this.getAddProdNum()
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/multishop/live/liveUser/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.theData
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 获取剩余可新增得数量
    getAddProdNum () {
      this.$http({
        url: this.$http.adornUrl('/multishop/live/liveUser/getAddProdNum'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.shopNum = data.shopNum
        this.totalNum = data.totalNum
        this.deleteShopNum = data.deleteShopNum
        this.deleteTotalNum = data.deleteTotalNum
      })
    },
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('live.delUserTips') + this.deleteShopNum + this.$i18n.t('live.times') + ',' + this.$i18n.t('admin.isDeleOper'), this.$i18n.t('text.tips') + '?', {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/multishop/live/liveUser/' + id),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refreshChange()
            }
          })
        })
      }).catch(() => { })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.getDataList(this.page, newData)
    },
    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },

    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList()
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-live-liveUser {
  .main-container {
    .live-tips {
      .stress {
        color: #ff4141;
      }
    }
  }
}
</style>
