/* eslint-disable no-undef */
<template>
  <div class="mod-live-liveProdStore">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item :label="$t('product.prodName')+':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.name" :placeholder="$t('product.prodName')"></el-input>
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
          v-if="isAuth('live:liveProdStore:save')"
          @click="addOrUpdateHandle(0,1)">
          {{ $t("crud.addTitle") }}
        </div>
        <span class="live-tips">
          （{{ $t("live.numNewLiveProsRem") }}：<span class="stress">{{ shopNum
          }}</span>{{ $t("live.times") }}，{{ $t("live.subPlatRemLimi") }}<span class="stress">{{ totalNum
          }}</span>{{ $t("live.times") }}）</span>
      </div>
      <!-- 表格 -->
      <div class="table-con live-prod-table">
        <el-table
          ref="liveProdTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          >
          <el-table-column
            fixed
            align="left"
            prop="prodName"
            :label="$t('product.prodInfo')"
            min-width="400">
            <template slot-scope="scope">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <prod-pic
                  :pic="scope.row.coverPic"
                ></prod-pic>
                </div>
                <span class="table-cell-text">{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="price"
            :label="$t('product.prices')"
            min-width="180"
            >
            <template slot-scope="scope">
              <div v-if="scope.row.priceType == 1">
                <span>￥{{ scope.row.price }} </span>
              </div>
              <div v-if="scope.row.priceType == 2">
                <span
                  >￥{{ scope.row.price }} {{ $t("admin.dollar") }} - ￥{{
                    scope.row.price2
                  }}
                  {{ $t("admin.dollar") }}</span
                >
              </div>
              <div v-if="scope.row.priceType == 3">
                <span
                  >{{ $t("live.marketPrice") }} ￥{{ scope.row.price }}
                  {{ $t("admin.dollar") }}</span
                >
                <br />
                <span
                  >{{ $t("live.currentPrice") }} ￥{{ scope.row.price2 }}
                  {{ $t("admin.dollar") }}</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="status"
            :label="$t('product.status')"
            min-width="170"
            >
            <template slot-scope="scope">
              <span class="tag-text" v-if="scope.row.status === -1">{{
                $t("live.itemDeleted")
              }}</span>
              <span class="tag-text" v-if="scope.row.status === 0">{{
                $t("productComm.waitPass")
              }}</span>
              <span class="tag-text" v-if="scope.row.status === 1">{{
                $t("station.underReview")
              }}</span>
              <span class="tag-text" v-if="scope.row.status === 2">{{
                $t("productComm.pass")
              }}</span>
              <span class="tag-text" v-if="scope.row.status === 3">{{
                $t("productComm.noPass")
              }}</span>
              <span class="tag-text" v-if="scope.row.status === 4">{{
                $t("product.violation")
              }}</span>
              <span class="tag-text" v-if="scope.row.status === 5">{{
                $t("live.platformOffShelf")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="createTime"
            :label="$t('product.merAddProdTime')"
            min-width="210">
          </el-table-column>
          <el-table-column
            align="left"
            prop="verifyTime"
            :label="$t('product.meSubRevTime')"
            min-width="210">
          </el-table-column>
          <el-table-column
            align="left"
            prop="successTime"
            :label="$t('product.proApprTime')"
            min-width="210">
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            min-width="200"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('live:liveProdStore:update') && scope.row.status === 0"
                  @click="addOrUpdateHandle(scope.row.liveProdStoreId,2)"
                  >{{ $t("crud.updateBtn") }}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="scope.row.status !== 0"
                  @click="addOrUpdateHandle(scope.row.liveProdStoreId,3)"
                  >{{ $t("live.view") }}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('live:liveProdStore:submitVerify') && (scope.row.status === 0 || scope.row.status === 5)"
                  @click="submitVerify(scope.row.liveProdStoreId)"
                  >{{
                    scope.row.status === 5
                      ? $t("live.reReview")
                      : $t("live.submitReview")
                    }}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('live:liveProdStore:delete')"
                  @click="deleteHandle(scope.row.liveProdStoreId)"
                  >{{$t("text.delBtn")}}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <el-pagination
        v-if="dataList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './liveProdStore-add-or-update'
import ProdPic from '@/components/prod-pic'

export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataList: [],
      shopNum: 0,
      totalNum: 0,
      deleteShopNum: 0,
      deleteTotalNum: 0,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        name: ''
      }, // 搜索
      dataListLoading: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    ProdPic
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
        url: this.$http.adornUrl('/live/liveProdStore/page'),
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
    // 获取剩余可新增得数量
    getAddProdNum () {
      this.$http({
        url: this.$http.adornUrl('/live/liveProdStore/getAddProdNum'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.shopNum = data.shopNum
        this.totalNum = data.totalNum
        this.deleteShopNum = data.deleteShopNum
        this.deleteTotalNum = data.deleteTotalNum
      })
    },
    // 新增 / 修改 / 查看
    addOrUpdateHandle (id, type) {
      // type = 1 新增 type = 2 修改  type = 3 查看
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },
    /**
     * 提交审核
     */
    submitVerify (id) {
      this.$confirm(this.$i18n.t('live.contForReview'), this.$i18n.t('live.submitReview'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/live/liveProdStore/submitVerify'),
          method: 'put',
          data: this.$http.adornData({
            liveProdStoreId: id
          })
        }).then(({ data }) => {
          if (data) {
            this.$message({
              message: this.$i18n.t('live.submitReview'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.refreshChange()
              }
            })
          }
        })
      }).catch(() => {
      })
    },
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('live.consumeRemainingTimes') + this.deleteShopNum + this.$i18n.t('live.times') + ',' + this.$i18n.t('admin.isDeleOper'), this.$i18n.t('text.tips') + '?', {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/live/liveProdStore/' + id),
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
      }).catch(() => {
      })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      // this.page.currentPage = 1
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },

    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.searchForm.name = ''
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
.mod-live-liveProdStore {
  .live-tips {
    .stress {
      color: #ff4141;
    }
  }
  .table-cell-con {
    margin-right: 70px;
  }
}
</style>
<style scoped>
>>> .el-table__fixed-right::before {
  background-color: transparent;
}
>>> .el-table__fixed::before, .el-table__fixed-right::before {
  background-color: transparent;
}
>>> .el-table::before {
  z-index: 6
}
</style>
