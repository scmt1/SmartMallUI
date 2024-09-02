<template>
  <div class="mod-distribution-prod">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('coupon.commodityName') + ':'">
            <el-input type="text" v-model="searchForm.prodName" :placeholder="$t('coupon.commodityName')"></el-input>
          </el-form-item>
          <el-form-item prop="state" :label="$t('product.status') + ':'">
            <el-select v-model="searchForm.state" :placeholder="$t('product.status')" clearable>
              <el-option :label="$t('prodList.ShopkeeperOffShelf')" :value="0"></el-option>
              <el-option :label="$t('publics.metUpperShelf')" :value="1"></el-option>
              <el-option :label="$t('groups.offlineViolation')" :value="2"></el-option>
              <el-option :label="$t('product.pendingReview')" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-container">
      <!-- 操作栏 -->
      <!-- <div class="operation-bar">
        <el-checkbox v-model="selectAll" :disabled="!dataList.length" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox>
        <span v-if="dataListSelections.length" class="had-selected">{{$t('dataAnalysis.selected')}} {{dataListSelections.length}}</span>
        <div
          class="default-btn"
          :disabled="dataListSelections.length <= 0"
          @click="deleteHandle()">
          {{ $t('publics.batchDelete') }}
        </div>
      </div> -->
      <!-- 表格 -->
      <div class="table-con distribution-prod-table">
        <el-table
          ref="distributionProdListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
        >
        <!-- @selection-change="handleSelectionChange" -->
          <!-- <el-table-column
            type="selection"
            width="55">
          </el-table-column> -->
          <!-- 店铺名称 -->
          <el-table-column
            width="300"
            prop="shopName"
            :label="$t('prodList.shopName')"
          >
            <template slot-scope="scope">
              <div class="table-cell-text">{{scope.row.product.shopName}}</div>
            </template>
          </el-table-column>
          <!-- 产品名称 -->
          <el-table-column
            width="400"
            prop="prodName"
            :label="$t('coupon.commodityName')"
          >
            <template slot-scope="scope">
              <div class="table-cell-text">{{scope.row.product.prodName}}</div>
            </template>
          </el-table-column>
          <!-- 产品图片 -->
          <el-table-column
            prop="pic"
            :label="$t('discount.commodityPictures')"
          >
            <template slot-scope="scope">
              <div class="table-cell-image">
                <prod-pic
                  :pic="scope.row.product.pic"
                ></prod-pic>
              </div>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            prop="state"
            :label="$t('product.status')"
          >
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.state === 0">{{ $t("prodList.ShopkeeperOffShelf") }}</div>
              <div class="tag-text" v-if="scope.row.state === 1">{{ $t("publics.metUpperShelf") }}</div>
              <div class="tag-text" v-if="scope.row.state === 2">{{ $t("groups.offlineViolation") }}</div>
              <div class="tag-text" v-if="scope.row.state === 3">{{ $t("product.pendingReview") }}</div>
            </template>
          </el-table-column>
          <!-- 奖励比例 -->
          <el-table-column
            width="120"
            prop="state"
            :label="$t('marketing.rewardRatio')"
          >
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.awardProportion === 0">{{ $t("marketing.proporteward") }}</div>
              <div class="tag-text" v-if="scope.row.awardProportion === 1">{{ $t("marketing.rewardByFixedValue") }}</div>
            </template>
          </el-table-column>
          <!-- 间推奖励 -->
          <el-table-column
            prop="state"
            :label="$t('marketing.inviterReward')"
          >
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.parentAwardSet === 0">{{ $t("seckill.close") }}</div>
              <div class="tag-text" v-if="scope.row.parentAwardSet === 1">{{ $t("seckill.open") }}</div>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="230"
          >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="isAuth('platform:distributionProd:info')"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row)"
                >
                  {{$t('prodList.lookOver')}}
                </div>
                <div
                  v-if="isAuth('platform:distributionProd:update') && scope.row.state<2"
                  class="default-btn text-btn"
                  @click="offlineDistributionProdHandle(scope.row)"
                >
                  {{$t('product.violation')}}
                </div>
                <div
                  v-if="isAuth('platform:distributionProd:update') && scope.row.state > 1"
                  class="default-btn text-btn"
                  @click="distributionProdAuditHandle(scope.row.distributionProdId)"
                >
                  {{scope.row.state === 2
                        ? $t("prodList.offShelfManage")
                        : $t("coupon.checkPending")}}
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

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    <!-- 商品审核弹窗 -->
    <DistributionProdAudit
      v-if="distributionProdAuditVisible"
      ref="distributionProdAudit"
      selectUrl="/platform/distributionProd/getOfflineEventByDistProdId"
      updateUrl="/platform/distributionProd/auditDistributionProd"
      @refreshDataList="refreshChange"
    ></DistributionProdAudit>
  </div>
</template>

<script>
import AddOrUpdate from './distribution-prod-add-or-update'
import DistributionProdAudit from '@/components/offline-audit'
import ProdPic from '@/components/prod-pic'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataForm: {
        prodName: ''
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        prodName: ''
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      distributionProdAuditVisible: false,
      selectAll: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  components: {
    AddOrUpdate,
    DistributionProdAudit,
    ProdPic
  },
  created () {
    this.getDataList(this.page)
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle (data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data)
      })
    },
    // 点击查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    /**
     * 全选按钮
     */
    handleSelectAll () {
      if (this.$refs.distributionProdListTable.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.$refs.distributionProdListTable.toggleAllSelection()
    },
    // 多选变化
    handleSelectionChange (val) {
      this.dataListSelections = val
      this.selectAll = val.length === this.dataList.length
    },
    // 刷新回调
    refreshChange () {
      this.getDataList(this.page)
    },
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/platform/distributionProd/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page ? page.currentPage : 1,
          size: page ? page.pageSize : 20
        }, this.theData))
      }).then(({ data }) => {
        this.page.total = data.total
        this.page.pageSize = data.size
        this.page.currentPage = data.current
        this.dataList = data.records
        this.dataListLoading = false

        // 末尾页数据为空重新请求
        if (!this.dataList.length && this.page.currentPage > 1) {
          this.page.currentPage = 1
          this.getDataList()
        }
      })
    },
    // 删除
    deleteHandle (row, index) {
      var ids = row.distributionProdId ? [row.distributionProdId] : this.dataListSelections.map(item => {
        return item.distributionProdId
      })
      // `确定进行[${row.distributionProdId ? '删除' : '批量删除'}]操作?`
      var tip = this.$i18n.t('remindPop.makeSure') + '[' + row.distributionProdId ? this.$i18n.t('remindPop.delete') : this.$i18n.t('remindPop.batchDeletion')
      tip = tip + ']' + this.$i18n.t('remindPop.operation') + '?'
      this.$confirm(tip, this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/distributionProd'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refreshChange()
            }
          })
        })
      })
    },
    // 下线活动
    offlineDistributionProdHandle (row) {
      // '确定对活动需要修改[' + row.couponName + ']进行下线操作？如是，请填写下线理由'
      var tips = this.$i18n.t('groups.removeActivityNameTips')
      tips = tips.replace('ACTIVITYNAME', row.product.prodName)
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
          url: this.$http.adornUrl(`/platform/distributionProd/offline`),
          method: 'post',
          data: this.$http.adornData({
            handleId: row.distributionProdId,
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
    // 弹窗处理
    distributionProdAuditHandle (id) {
      this.distributionProdAuditVisible = true
      this.$nextTick(() => {
        this.$refs.distributionProdAudit.init(id)
      })
    },

    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.searchForm = {}
    },

    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
