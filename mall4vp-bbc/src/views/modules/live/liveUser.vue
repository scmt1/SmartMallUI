<template>
  <div class="mod-live-liveUser">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="nickName" :label="$t('users.name')+':'">
            <el-input v-model="searchForm.nickName" type="text" clearable  :placeholder="$t('users.name')"></el-input>
          </el-form-item>
          <el-form-item prop="anchorWechat" :label="$t('shop.weChatNumber')+':'">
            <el-input v-model="searchForm.anchorWechat" type="text" clearable  :placeholder="$t('shop.weChatNumber')"></el-input>
          </el-form-item>
          <el-form-item prop="roles" :label="$t('sys.roles')+':'">
            <el-select v-model="searchForm.roles" clearable  :placeholder="$t('sys.roles')">
              <el-option
                v-for="item in roles"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
            <div class="default-btn" @click="resetForm('searchForm')">{{ $t('product.reset') }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 搜索栏end -->
    <div class="main-container">
      <div class="operation-bar">
        <div class="default-btn primary-btn" @click="addOrUpdateHandle(0)">{{ $t('crud.addBtn') }}</div>
      </div>
      <div class="tips">
        <span class="text"
        >{{
          $t("liveRoom.platformRemainLimit")
        }}
        {{ totalNum }} {{ $t("distribution.bcTip4") }}</span>
      </div>
      <div class="table-con">
          <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%"
          >
            <el-table-column
              :label="$t('brand.serialNumber')"
              type="index"
              fixed
              :width="$t('language')=='语言'?80:180"
            />
            <el-table-column
              prop="nickName"
              :label="$t('users.name')"
              fixed
              width="280">
              <template slot-scope="scope">
                <span class="table-cell-text line-clamp-one">{{ scope.row.nickName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="anchorWechat"
              :label="$t('shop.weChatNumber')"
              width="270"
            />
            <el-table-column
              prop="anchorWechat"
              :label="$t('liveRoom.anchorWechat')"
              width="270"
            />
            <el-table-column
              prop="roles"
              :label="$t('sys.roles')"
              width="160"
            />
            <el-table-column
              prop="createTime"
              :label="$t('sys.creationTime')"
              width="200"
            />
            <el-table-column
              prop="updateTime"
              :label="$t('home.updateTime')"
              width="200"
            />
            <el-table-column
              align="center"
              :label="$t('crud.menu')"
              width="120"
              fixed="right"
              >
              <template slot-scope="scope">
                <div class="text-btn-con">
                  <div
                    class="default-btn text-btn"
                    v-if="isAuth('live:liveUser:delete')"
                    @click="deleteHandle(scope.row.liveUserId)">
                    {{ $t("crud.delBtn") }}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
      </div>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
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
      searchForm: {
        nickName: '',
        anchorWechat: '',
        roles: null
      }, // 搜索
      dataListLoading: false,
      totalNum: 0,
      deleteTotalNum: 0,
      addOrUpdateVisible: false,
      roles: [
        {
          label: this.$i18n.t('liveRoom.liveUser'),
          value: 1
        }, {
          label: this.$i18n.t('liveRoom.liveOperators'),
          value: 3
        }, {
          label: this.$i18n.t('liveRoom.anchor'),
          value: 2
        }
      ]
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
  },
  mounted () {
    this.getDataList(this.page)
  },
  methods: {
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
      this.getAddProdNum()
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/platform/live/liveUser/page'),
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
        this.page = page
        this.page.currentPage = data.current
        this.page.total = data.total
        this.dataList = data.records
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
        url: this.$http.adornUrl('/platform/live/liveUser/getAddProdNum'),
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
      this.$confirm(this.$i18n.t('liveRoom.delUserTips') + ' ' + this.deleteTotalNum + this.$i18n.t('distribution.bcTip4') + ',' + this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/live/liveUser/' + id),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.page.total = this.page.total - 1
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
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-live-liveUser {
  .tips {
    margin: 20px 0;
    .text {
      color: #FF0000;
    }
  }
}
</style>
