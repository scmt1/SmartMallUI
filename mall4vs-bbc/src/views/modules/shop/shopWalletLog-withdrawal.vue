<template>
  <div class="withdrawal">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="60" size="small">
        <div class="input-row">
          <el-form-item prop="status" :label="$t('shop.withdrawalStatus')+':'">
            <el-select v-model="searchForm.status" clearable  :placeholder="$t('shop.withdrawalStatus')">
              <el-option
                v-for="item in withdrawalStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
            <div class="default-btn" @click="resetForm('searchForm')">{{ $t('shop.resetMap') }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="table-con">
        <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%"
        >
          <el-table-column
            type="index"
            :label="$t('number')"
            align="center"
            width="85">
          </el-table-column>
          <el-table-column
            :label="$t('shop.withdrawalTime')"
            prop="createTime"
            align="center">
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('shop.withdrawalStatus')"
          >
            <template slot-scope="scope">
              <span>{{ [$t('station.auditFailure'),$t('station.underReview'),$t('station.successfulAudit')][scope.row.status + 1] }}</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              :label="$t('crud.menu')"
              width="220"
              >
              <template slot-scope="scope">
                <div class="text-btn-con">
                  <div class="default-btn text-btn" @click="handleDetail(scope.row)">{{$t('shop.withdrawalDetail')}}</div>
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
    <withdrawal ref="detail" v-if="detailVisible"/>
  </div>
</template>

<script>
import Withdrawal from './withdrawal-detail.vue'

export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      detailVisible: false,
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        status: null
      }, // 搜索
      dataListLoading: false,
      withdrawalStatus: [
        {
          label: this.$i18n.t('station.auditFailure'),
          value: -1
        }, {
          label: this.$i18n.t('station.underReview'),
          value: 0
        }, {
          label: this.$i18n.t('station.successfulAudit'),
          value: 1
        }
      ]
    }
  },
  components: {
    Withdrawal
  },
  created () {
    this.getDataList(this.page)
  },
  methods: {
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/shop/withdrawCash/page'),
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
        console.log(data)
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    handleDetail (rowData) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detail.init(rowData)
      })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.isCashWithdrawal = false
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
      this.getShopWalletInfo()
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
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
