<template>
  <div class="mod-discount">

    <!-- 新版规范 -->
    <div class="discount-mod">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" class="search-form" ref="test-form" :model="searchForm" size="small">
          <div class="input-row">
            <el-form-item :label="$t('prodList.shopName') + ':'">
                <el-input v-model="searchForm.shopName" :placeholder="$t('prodList.shopName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('groups.eventName') + ':'">
                <el-input v-model="searchForm.discountName" :placeholder="$t('groups.eventName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('group.actStatus') + ':'">
              <el-select v-model="searchForm.status" :placeholder="$t('group.actStatus')">
                <el-option
                  v-for="item in searchForm.statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('shopFeature.searchBar.search')}}</div>
              <div class="default-btn" @click="clearSearch">{{$t('product.reset')}}</div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- 搜索栏end -->
      <!-- 表格主体 -->
      <div class="main-container">
        <div class="operation-bar">
          <div
            class="default-btn primary-btn"
            size="small"
            v-if="isAuth('seckill:seckill:save')"
            @click="addOrUpdateHandle()"
            >{{ $t("crud.addTitle") }}
          </div>
        </div>
        <!-- 表格 -->
        <div class="table-con seckill-table">
          <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%">

            <el-table-column
              prop="shopName"
              :label="$t('shop.storeName')"
              min-width="450"
              >
              <template slot-scope="scope">
                <span class="table-cell-text">{{ scope.row.shopName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              prop="discountName"
              :label="$t('groups.eventName')"
              min-width="240"
              >
              <template slot-scope="scope">
                <span class="table-cell-text line-clamp-one">{{ scope.row.discountName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="startTime"
              :label="$t('coupon.startTime')"
              min-width="200"
              >
            </el-table-column>

            <el-table-column
              prop="endTime"
              :label="$t('coupon.endTime')"
              min-width="200"
              >
            </el-table-column>

            <el-table-column
              prop="status"
              :label="$t('group.actStatus')"
              min-width="120"
              >
              <template slot-scope="scope">
                <div class="tag-text">
                  {{[$t("seckill.close"), $t("seckill.open"), $t("groups.offlineViolation"),
                  $t('product.pendingReview')]
                  [scope.row.status]}} </div>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$i18n.t('crud.menu')" width="300" fixed="right">
              <template slot-scope="scope">
                <div class="text-btn-con">
                  <div class="default-btn text-btn"
                  @click="showDiscountInfoHandle(scope.row.discountId)"
                  >
                    {{$t('discount.viewActivities')}}
                  </div>
                  <div class="default-btn text-btn"
                   @click="showProds(scope.row.discountId)"
                  >
                    {{$t('prodList.lookOverProd')}}
                  </div>
                  <div class="default-btn text-btn"
                    v-if="isAuth('platform:discount:update') && scope.row.status > 1"
                    @click="discountAuditHandle(scope.row.discountId)"
                  >
                    {{scope.row.status === 2?$t("prodList.offShelfManage"):$t("product.pendingReview")}}

                  </div>
                  <div
                      class="default-btn text-btn"
                      v-if="isAuth('platform:discount:update') && scope.row.status<2"
                      @click="offlineDiscountHandle(scope.row)"
                    >
                    {{$t('product.violation')}}
                  </div>
                  <div
                    class="default-btn text-btn"
                    @click="deleteHandle(scope.row.discountId)"
                  >{{$t('remindPop.delete')}}</div>
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
      <!-- 表格主体end -->
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"></add-or-update>
    <discount-info
      v-if="discountInfoVisible"
      ref="discountInfo"
      @refreshSelectProds="refreshChange"
    ></discount-info>
    <!-- 商品审核弹窗 -->
    <DiscountAudit
      v-if="discountAuditVisible"
      ref="discountAudit"
      selectUrl="/platform/discount/getOfflineHandleEventByDiscountId"
      updateUrl="/platform/discount/auditDiscount"
      @refreshDataList="refreshChange"
    ></DiscountAudit>
  </div>
</template>

<script>
import AddOrUpdate from './discountProd-add-or-update'
import DiscountInfo from './discountInfo'
import DiscountAudit from '@/components/offline-audit'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataForm: {
        discountName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 头部搜索表单
      searchForm: {
        shopName: null,
        discountName: null,
        status: null,
        statusList: [
          {
            label: this.$i18n.t('seckill.close'),
            value: 0
          }, {
            label: this.$i18n.t('seckill.open'),
            value: 1
          }, {
            label: this.$i18n.t('groups.offlineViolation'),
            value: 2
          }, {
            label: this.$i18n.t('product.pendingReview'),
            value: 3
          }
        ]
      },
      dataListLoading: false,
      discountAuditVisible: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      discountInfoVisible: false
    }
  },
  components: {
    AddOrUpdate,
    DiscountInfo,
    DiscountAudit
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (page, newData = false) {
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/discount/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              shopName: this.searchForm.searchForm,
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

        // 末尾页数据为空重新请求
        if (!this.dataList.length && this.page.currentPage > 1) {
          this.page.currentPage = 1
          this.getDataList()
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增
    addOrUpdateHandle (id) {
      this.$router.push({ path: '/discountInfo', query: { discountId: id } })
    },
    // 查看商品
    showProds (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.showProd(id, 1)
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
            url: this.$http.adornUrl(`/platform/discount/${id}`),
            method: 'delete',
            data: this.$http.adornData({}, false)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
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
    // 条件查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    showDiscountInfoHandle (id) {
      this.discountInfoVisible = true
      this.$nextTick(() => {
        this.$refs.discountInfo.init(id)
      })
    },
    // 更新数据
    refreshChange () {
      this.getDataList()
    },
    // 下架活动
    offlineDiscountHandle (row) {
      // '确定对活动[' + row.discountName + ']进行下架操作？如是，请填写下架理由'
      var tips = this.$i18n.t('seckill.offlineTip')
      tips = tips.replace('ACTIVITYNAME', row.discountName)
      this.$prompt(tips, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        inputPattern: /\s\S+|S+\s|\S/, // 不能全为空格 空字符串
        inputErrorMessage: this.$i18n.t('seckill.offlineReasonTip'),
        inputValidator: (value) => {
          if (value.length > 100) {
            return this.$i18n.t('seckill.offlineReasonTip1')
          }
        }
      }).then((obj) => {
        this.$http({
          url: this.$http.adornUrl(`/platform/discount/offline`),
          method: 'post',
          data: this.$http.adornData({
            handleId: row.discountId,
            offlineReason: obj.value || null
          })
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList(this.page)
            }
          })
        })
      })
    },
    clearSearch () {
      this.searchForm.shopName = null
      this.searchForm.discountName = null
      this.searchForm.status = null
    },
    // 每页数量变更
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList()
    },
    // 页数变更
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList()
    },
    // 弹窗处理
    discountAuditHandle (id) {
      this.discountAuditVisible = true
      this.$nextTick(() => {
        this.$refs.discountAudit.init(id)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.discount-mod {

}
</style>
