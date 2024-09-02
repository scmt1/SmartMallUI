<template>
  <div class="mod--station">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="shopName" :label="$t('coupon.shopName') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.shopName" :placeholder="$t('coupon.shopName')"></el-input>
          </el-form-item>
          <el-form-item prop="stationName" :label="$t('order.pickUpPoint') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.stationName" :placeholder="$t('order.pickUpPoint')"></el-input>
          </el-form-item>
          <el-form-item prop="addr" :label="$t('shop.address') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.addr" :placeholder="$t('shop.address')"></el-input>
          </el-form-item>
          <el-form-item prop="account" :label="$t('shop.accountNumber') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.account" :placeholder="$t('shop.accountNumber')"></el-input>
          </el-form-item>
          <el-form-item prop="status" :label="$t('brand.status') + ':'" class="search-form-item">
            <el-select v-model="searchForm.status" :placeholder="$t('brand.status')">
              <el-option :label="$t('seckill.close')" :value="0"></el-option>
              <el-option :label="$t('shop.business')" :value="1"></el-option>
              <el-option :label="$t('components.platformOffline')" :value="2"></el-option>
              <el-option :label="$t('liveRoom.underReview')" :value="3"></el-option>
              <el-option :label="$t('productComm.noPass')" :value="4"></el-option>
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
      <div class="table-con station-table">
        <el-table
          ref="stationListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%">
          <el-table-column
            fixed
            type="index"
            :label="$t('brand.serialNumber')"
            width="80">
          </el-table-column>

          <el-table-column
            fixed
            prop="shopName"
            :label="$t('coupon.shopName')"
            width="260">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.shopName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="stationName"
            :label="$t('order.pickUpPoint')"
            width="260">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.stationName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="addr"
            :label="$t('shop.address')"
            width="260">
            <template slot-scope="scope">
              <span class="table-cell-text">{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.addr}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="phone"
            :label="$t('platform.phoNumber')"
            width="180">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.phonePrefix && scope.row.phonePrefix !== null"
                >{{scope.row.phonePrefix}}-</span>
                <span>{{scope.row.phone}}</span>
              </template>
          </el-table-column>

          <el-table-column
            prop="account"
            :label="$t('shop.accountNumber')"
            width="auto">
          </el-table-column>

          <el-table-column
            prop="status"
            :label="$t('brand.status')"
            width="auto">
            <template slot-scope="scope">
              <span
                v-if="scope.row.status === 4"
                class="tag-text"
              >{{$t('components.auditNotPassed')}}</span>
              <span v-else-if="scope.row.status === 3" class="tag-text">{{$t('liveRoom.underReview')}}</span>
              <span v-else-if="scope.row.status === 2" class="tag-text">{{$t('components.platformOffline')}}</span>
              <span v-else-if="scope.row.status === 1" class="tag-text">{{$t('shop.business')}}</span>
              <span v-else class="tag-text">{{$t('seckill.close')}}</span>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="230"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="isAuth('platform:station:update')"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row.stationId)"
                >{{$t('coupon.viewDetails')}}</div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('platform:station:update') && scope.row.status<2"
                  @click="offlineSeckillHandle(scope.row)"
                >{{$t('product.violation')}}</div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('platform:station:update') && scope.row.status > 1"
                  @click="stationAuditHandle(scope.row.stationId)"
                >{{scope.row.status === 2?$t('prodList.offShelfManage'):scope.row.status === 3?$t('coupon.checkPending'):$t('productComm.noPass')}}</div>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    <!-- 商品审核弹窗 -->
    <OfflineAudit
      v-if="stationAuditVisible"
      ref="offlineAudit"
      selectUrl="/platform/station/getOfflineHandleEventByStationId"
      updateUrl="/platform/station/auditStation"
      @refreshDataList="refreshChange"
    ></OfflineAudit>
  </div>
</template>

<script>
import AddOrUpdate from './station-add-or-update'
import OfflineAudit from '@/components/offline-audit'

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
        shopName: '',
        stationName: '',
        addr: '',
        account: '',
        status: ''
      }, // 搜索
      dataListLoading: false,
      addOrUpdateVisible: false,
      stationAuditVisible: false
    }
  },
  components: {
    AddOrUpdate,
    OfflineAudit
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList (page, newData = false) {
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/station/page'),
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

        // 末尾页数据为空重新请求
        if (!this.dataList.length && data.current > 1) {
          this.page.currentPage = 1
          this.getDataList()
        }
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // deleteHandle (id) {
    //   this.$confirm('确定进行删除操作?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.$http({
    //       url: this.$http.adornUrl('/platform/station/' + id),
    //       method: 'delete',
    //       data: this.$http.adornData({})
    //     }).then(({ data }) => {
    //       this.$message({
    //         message: '操作成功',
    //         type: 'success',
    //         duration: 1500,
    //         onClose: () => {
    //           this.refreshChange()
    //         }
    //       })
    //     })
    //   }).catch(() => { })
    // },
    // 下线活动
    offlineSeckillHandle (row) {
      // '确定对活动[' + row.stationName + ']进行下线操作？如是，请填写下线理由'
      var tips = this.$i18n.t('seckill.stationOfflineTip')
      tips = tips.replace('STATIONNAME', row.stationName)
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
          url: this.$http.adornUrl(`/platform/station/offline`),
          method: 'post',
          data: this.$http.adornData({
            handleId: row.stationId,
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
    stationAuditHandle (id) {
      this.stationAuditVisible = true
      this.$nextTick(() => {
        this.$refs.offlineAudit.init(id)
      })
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
    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.prodName = ''
      this.isTop = ''
      this.categoryId = null
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

</style>
