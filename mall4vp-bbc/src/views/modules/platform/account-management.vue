<template>
  <div class="mod-seckill-shopAuditing">
    <div class="search-bar">
      <el-form :inline="true" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row margin-bottom-none">
          <el-form-item prop="shopName" :label="$t('prodList.shopName') + ':'">
            <el-input v-model="searchForm.shopName" size="small" :placeholder="$t('prodList.shopName')"></el-input>
          </el-form-item>
          <el-form-item prop="intro" :label="$t('shop.shopProfile') + ':'">
            <el-input v-model="searchForm.intro" size="small" :placeholder="$t('shop.shopProfile')"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('order.applicationTime') + ':'"
          >
            <!-- :label-width="this.$i18n.t('language') === 'language' ? '120px' : '80px'" -->
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              :range-separator="$t('date.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
            ></el-date-picker>
          </el-form-item>
          <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('product.search')}}</div>
          <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="table-con audit-shop-table">
        <el-table
          ref="auditShop"
          :data="dataList"
          header-cell-class-name="table-header"
          style="width: 100%">
          <el-table-column
            prop="shopName"
            :label="$t('prodList.shopName')"
          >
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.shopName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="shopLogo"
            :label="$t('shop.shopLogo')"
          >
            <template slot-scope="scope">
              <div class="table-cell-image">
                <img :src="scope.row.shopLogo">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="intro"
            :label="$t('shop.shopProfile')"
          >
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.intro }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="shopStatusList"
            :label="$t('shop.storeStatus')"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.status === -1"
                class="tag-text"
              >{{$t('shop.failed')}}</span>
              <span v-else-if="scope.row.status === 0" class="tag-text">{{$t('shop.unreviewed')}}</span>
              <span
                v-else-if="scope.row.shopStatus === 1"
                class="tag-text"
              >{{$t('shop.passed')}}</span>

            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            :label="$t('order.applicationTime')"
          >
          </el-table-column>
          <el-table-column
            :label="$t('publics.operating')"
            width="150px">
            <template slot-scope="scope">
              <div
                class="default-btn text-btn"
                v-if="isAuth('shop:shopAuditing:audit')"
                @click="shopAuditHandle(scope.row.shopId)"
              >{{$t('productComm.audit')}}</div>
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
    <!-- <ShopAudit
      v-if="shopAuditVisible"
      ref="shopAudit"
      selectUrl="/platform/shopDetail/getOfflineHandleEventByShopId"
      updateUrl="/platform/shopDetail/auditShop"
      @refreshDataList="refreshChange"
    ></ShopAudit> -->
    <!-- 账号管理 -->
    <ShopAccount v-if="shopAccountVisible" ref="shopAccount" @refreshDataList="refreshChange"></ShopAccount>
  </div>
</template>

<script>
import AddOrUpdate from './auditShop-add-or-update.vue'
// import ShopAudit from '@/components/offline-audit'
import ShopAudit from './shopOfflineHandle'
import ShopAccount from './shop-account.vue'

export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        shopStatusList: undefined,
        intro: undefined,
        shopName: undefined
      }, // 搜索
      dateRange: [],
      dataListSelections: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      shopAuditVisible: false,
      shopAccountVisible: false,

      // 店铺状态
      shopStatusConstant: {
        // 已删除
        DELETED: -1,
        // 停业中
        STOP: 0,
        // 营业中
        OPEN: 1,
        // 平台下线
        OFFLINE: 2,
        // 平台下线待审核
        OFFLINE_AUDIT: 3,
        // 开店申请中
        APPLYING: 4,
        // 开店申请待审核
        OPEN_AWAIT_AUDIT: 5
      }
    }
  },
  components: {
    AddOrUpdate,
    ShopAudit,
    ShopAccount
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList (page, newData = false) {
      page = page || this.page
      if (newData || !this.theData) {
        this.theData = {
          'current': page.currentPage,
          'size': page.pageSize,
          'beginTime': this.dateRange ? this.dateRange[0] : null, // 开始时间
          'endTime': this.dateRange ? this.dateRange[1] : null // 结束时间
        }
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.theParams.shopStatusList = [5]
      } else {
        this.theData.current = page.currentPage
        this.theData.size = page.pageSize
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/shop/shopAuditing/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign(this.theData, this.theParams
        ))
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.page.currentPage = data.current
        this.dataListLoading = false

        // let pageCont = document.getElementsByClassName('el-pager')[1].children
        // if (data.current !== 1) {
        //   pageCont[0].classList.remove('active')
        // }
      })
    },
    // 查看 / 审核
    auditHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 账号管理
    shopAccountHandle (id) {
      this.shopAccountVisible = true
      this.$nextTick(() => {
        this.$refs.shopAccount.init(id)
      })
    },
    // 新增 / 修改
    insertShop () {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
      })
    },
    // 下架店铺
    offlineHandle (row) {
      // 确定对店铺[' + row.shopName + ']进行下线操作？如是，请填写下线理由
      var tips = this.$i18n.t('shop.shopTip1')
      tips = tips.replace('SHOPNAME', row.shopName)
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
          url: this.$http.adornUrl(`/platform/shopDetail/offline`),
          method: 'post',
          data: this.$http.adornData({
            handleId: row.shopId,
            offlineReason: obj.value || null
          })
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              if (this.dataList.length === 1) {
                this.page.currentPage = this.page.currentPage === 1 ? 1 : this.page.currentPage - 1
              }
              this.getDataList(this.page)
            }
          })
        })
      })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.getDataList(this.page)
    },
    // 清空自定义数据
    searchReset () {
      this.dateRange = []
    },
    searchChange (newData = false) {
      // 修复页数内容不对应问题
      // let pageCont = document.getElementsByClassName('el-pager')[1].children
      // for (var i = 0; i < pageCont.length; i++) {
      //   pageCont[i].classList.remove('active')
      // }
      // pageCont[0].classList.add('active')
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 弹窗处理
    shopAuditHandle (id) {
      // this.shopAuditVisible = true
      // this.$nextTick(() => {
      //   this.$refs.shopAudit.init(id)
      // })
      this.$router.push({ path: '/platform-auditShop-detail', query: {shopId: id, pageType: 'toAudit'} })
    },
     /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.searchForm.info = undefined
      this.dateRange = []
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
.mod-seckill-shopAuditing {

}
</style>
