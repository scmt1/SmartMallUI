<template>
  <div class="mod-prod">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="keyword" :label="$t('product.prodName') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.keyword" :placeholder="$t('product.prodName')"></el-input>
          </el-form-item>
          <el-form-item prop="status" :label="$t('product.status') + ':'" class="search-form-item">
            <el-select v-model="searchForm.status" :placeholder="$t('product.status')">
              <el-option :label="$t('prodList.offShelf')" :value="0"></el-option>
              <el-option :label="$t('prodList.onShelf')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('product.search')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div class="default-btn primary-btn" @click="addOrUpdateHandle()" v-if="isAuth('score:prod:save')">
          {{$t('brand.add')}}
        </div>
      </div>
      <div class="table-con">
        <el-table
          ref="scoreProLisTTable"
          :data="dataList"
          style="width: 100%"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          >
          <el-table-column
            align="left"
            prop="prodName"
            :label="$t('product.prodName')"
            width="230">
            <template slot-scope="scope">
              <span class="table-cell-text">
                {{scope.row.prodName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="pic"
            :label="$t('product.pic')"
            width="200">
            <template slot-scope="scope">
              <div class="table-cell-image">
                <img :src="scope.row.pic" :alt="scope.row.prodName">
              </div>
            </template>
          </el-table-column>
          <!-- 市场价(元) -->
          <el-table-column
            prop="oriPrice"
            :label="$t('prodList.marketValue')"
            width="190">
          </el-table-column>
          <!-- 销售价(元) -->
          <el-table-column
            prop="price"
            :label="$t('prodList.salesPrice')"
            width="190">
          </el-table-column>
          <el-table-column
            prop="scorePrice"
            :label="$t('scoreProdList.needAccumulatePoints')"
            width="200">
          </el-table-column>
          <el-table-column
            prop="totalStocks"
            :label="$t('product.availableInventory')"
            width="200">
          </el-table-column>
          <el-table-column
            prop="status"
            :label="$t('product.status')"
            width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 1">{{$t("prodList.onShelf")}}</div>
              <div v-else-if="scope.row.status === 0" >{{$t("scoreProdList.platformOffShelf")}}</div>
              <div v-else-if="scope.row.status === 2" >{{$t("prodList.violation")}}</div>
              <div v-else-if="scope.row.status === 3" >{{$t("product.pendingReview")}}</div>
              <div v-else-if="scope.row.status === 4" >{{$t("prodList.refusePass")}}</div>
              <div v-else >{{$t("prodList.other")}}</div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="230">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                v-if="isAuth('score:prod:update')"
                class="default-btn text-btn"
                @click="addOrUpdateHandle(scope.row.prodId)"
                >{{$t("brand.revise")}}</div>
                <div
                  class="default-btn text-btn"
                  v-if="scope.row.status === 0"
                  @click="changeProdStatus(scope.row.prodId, 1)"
                >{{$t("prodList.onShelf")}}</div>
                <div
                  class="default-btn text-btn"
                  v-if="scope.row.status === 1"
                  @click="changeProdStatus(scope.row.prodId, 0)"
                >{{$t("prodList.offShelf")}}</div>
                <div
                  class="default-btn text-btn"
                  v-if="scope.row.status > 1"
                  @click="applyAuditHandle(scope.row.prodId)"
                >{{$t("prodList.offShelfManage")}}</div>
                <div
                  v-if="isAuth('score:prod:delete')"
                  class="default-btn text-btn"
                  @click="deleteHandle(scope.row.prodId)"
                >{{$t("remindPop.delete")}}</div>
              </div>
            </template>
          </el-table-column>


        </el-table>
      </div>
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

    <!-- 下线管理弹窗-->
    <ProdOfflineHandleEvent
      v-if="prodOfflineHandleEventVisible"
      selectUrl="/prod/prod/getOfflineHandleEventByProdId"
      applyUrl="/prod/prod/auditApply"
      ref="prodOfflineHandleEvent"
      @refreshDataList="refreshChange"
    ></ProdOfflineHandleEvent>
  </div>
</template>

<script>
import ProdOfflineHandleEvent from '@/components/offline-event-handle'
export default {
  name: 'prod-scoreProdList',
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件

      dataForm: {
        prodName: ''
      },
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        keyword: '',
        status: ''
      },
      dataListSelections: [],
      dataListLoading: false,
      prodOfflineHandleEventVisible: false,
      prodNameRouter: '',
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  components: {
    ProdOfflineHandleEvent
  },
  created () {
    if (this.$route.query.prodName) {
      this.prodNameRouter = this.$route.query.prodName
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true
      // var urls = ''
      // if (this.searchForm.type === 0) {
      //   urls = '/score/page'
      // } else {
      //   urls = '/platform/coupon/scorePage'
      // }
      // console.log(urls)
      if (newData || !this.theData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.theData = {
          current: page == null ? this.page.currentPage : page.currentPage,
          keyword: this.prodNameRouter ? this.prodNameRouter : this.dataForm.prodName,
          size: page == null ? this.page.pageSize : page.pageSize,
          prodType: 3
        }
      } else {
        this.theData.current = page == null ? this.page.currentPage : page.currentPage
        this.theData.size = page == null ? this.page.pageSize : page.pageSize
      }

      this.$http({
        url: this.$http.adornUrl('/platform/search/prod/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
           this.theData,
            this.theParams
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        for (const key in this.dataList) {
          if (this.dataList.hasOwnProperty(key)) {
            const element = this.dataList[key]
            element.imgs = element.pic
          }
        }
        this.dataForm.prodName = ''
        this.prodNameRouter = null
        this.page.total = data.total
        this.dataListLoading = false

        // 末尾页数据为空重新请求
        if (!this.dataList.length && this.page.currentPage > 1) {
          this.page.currentPage = 1
          this.getDataList()
        }
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.$router.push({
        path: '/prod-scoreProdInfo',
        query: { prodId: id }
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('scoreProdList.isDelete'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/platform/scoreProduct/${id}`),
            method: 'delete',
            data: this.$http.adornData({})
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('remindPop.succeeded'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList(this.page)
              }
            })
          })
        })
        .catch(() => { })
    },
    changeProdStatus (id, status) {
      this.$confirm(this.$i18n.t('remindPop.makeSure') + ' ' + `[${status ? this.$i18n.t('prodList.onShelf') : this.$i18n.t('prodList.offShelf')}]` + ' ' + this.$i18n.t('remindPop.operation') + '?', this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/platform/scoreProduct/prodStatus`),
            method: 'put',
            data: this.$http.adornData({
              status: status,
              prodId: id
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('remindPop.succeeded'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList(this.page)
              }
            })
          })
        })
    },
    // 条件查询
    searchChange (newData = false) {
      this.getDataList(this.page, newData)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    // 申请审核
    applyAuditHandle (id) {
      this.prodOfflineHandleEventVisible = true
      this.$nextTick(() => {
        this.$refs.prodOfflineHandleEvent.init(id)
      })
    },
    // 回调刷新
    refreshChange () {
      this.getDataList()
    },
        /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
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

<style lang='scss' scoped>

</style>
