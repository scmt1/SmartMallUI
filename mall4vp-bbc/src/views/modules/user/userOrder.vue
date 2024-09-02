<template>
  <div class="mod-stock=flow">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="stockBillNo" :label="$t('sys.nickName')+':'">
            <el-input v-model="searchForm.nickName" size="small" type="text" :placeholder="$t('sys.nickName')" clearable/>
          </el-form-item>
          <el-form-item :label="$t('order.buyTime')+':'">
            <el-date-picker
              size="small"
              v-model="createDateRange"
              type="datetimerange"
              :range-separator="$t('date.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="$t('text.startTime')"
              :end-placeholder="$t('date.end')"
              @change="createTimeChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item >
            <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
            <div class="default-btn" @click="resetForm('searchForm')">{{ $t('product.reset') }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="table-con">
        <el-table
          ref="dataListRef"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%">
          <el-table-column :label="$t('sys.nickName')" prop="nickName" align="left" width="190">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.nickName}}</span>
            </template>
          </el-table-column>
<!--          <el-table-column :label="$t('sys.userName')" prop="userName" align="left" width="190">-->
<!--            <template slot-scope="scope">-->
<!--              <span class="table-cell-text line-clamp-one">{{scope.row.userName}}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            prop="pic"
            :label="$t('publics.profilePicture')"
          >
            <template slot-scope="scope">
              <div class="table-cell-image">
                <img src="~@/assets/img/userImg.jpg" v-if="!scope.row.pic" width="130px" />
                <img :src="scope.row.pic" v-else />
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('order.buyLevel')" prop="levelName" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.levelName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('user.memberTime')" prop="term" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.term}}{{scope.row.termType | termType}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('order.buyTime')" prop="createTime" align="left"
          :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('order.payAmount')" prop="payAmount" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.payAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('order.paymentMethod')" prop="stockBillType" align="left"
          :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">
                <span v-if="scope.row.isPayed === 0">{{
                    $t("order.unpaid")
                  }}</span>
                    <span v-else>{{
                        [
                          $t("order.pointsPayment"),
                          $t("order.wecProPay"),
                          $t("order.alipayPCPayment"),
                          $t("order.wechatScanCodePayment"),
                          $t("order.wechatH5Payment"),
                          $t("order.weclAccountPay"),
                          $t("order.alipayH5Payment"),
                          $t("order.alipayAPPPayment"),
                          $t("order.wechatAPPPayment"),
                          $t("order.balancePayment"),
                          $t("order.payPalPayment")
                        ][scope.row.payType]
                      }}</span>
              </span>
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
        layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>

<script>
// 用于指向this
let vueApp = null

export default {
  filters: {
    termType (val) {
      switch (val) {
        case 1:
          return vueApp.$i18n.t('coupon.day')
        case 2:
          return vueApp.$i18n.t('user.week')
        case 3:
          return vueApp.$i18n.t('user.month')
        case 4:
          return vueApp.$i18n.t('user.season')
        case 5:
          return vueApp.$i18n.t('user.year')
      }
    }
  },
  beforeCreate () {
    vueApp = this
  },
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      createTimeActive: 0,
      dataList: [],
      createDateRange: [], // 购买时间范围
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        nickName: '',
        createStartTime: null, // 制单起始时间
        createEndTime: null, // 制单结束时间
        stockBillItemType: 1
      }, // 搜索
      dataListLoading: false
    }
  },
  components: {
  },
  mounted () {
    this.getDataList(this.page)
  },
  methods: {
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/user/userLevelLog/pageBuyLevelLog'),
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
      }).then(({data}) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      }).catch(() => {
        this.dataListLoading = false
      })
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
      this.searchForm.nickName = ''
      this.searchForm.createStartTime = null
      this.searchForm.createEndTime = null
      this.createDateRange = []
    },
    createTimeChange () {
      if (!this.createDateRange || this.createDateRange.length === 0) {
        this.searchForm.createStartTime = null
        this.searchForm.createEndTime = null
      } else {
        this.searchForm.createStartTime = this.createDateRange[0]
        this.searchForm.createEndTime = this.createDateRange[1]
      }
    }
  }
}
</script>

<style scoped>
div >>> .el-tabs__item.is-active{
  color:#000;
  font-weight: 800;
}
div >>> .el-col-md-6{
  width:30%
}
div >>> .table-cell-text{
  display: inline !important;
}
</style>

<style lang="scss">
.select-time-btn {
  margin-right: 20px;
  display: inline-block;
  color: #AAAAAA;
  font-size: 14px;
  cursor:pointer;
}
.select-time-btn:last-child {
  margin-right: 0;
}
.select-time-btn.is-active {
  color: #155BD4;
}
</style>
