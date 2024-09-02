<template>
  <div class="mod-seckill-shopWithdrawCash">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="shopName" :label="$t('shop.storeName')+':'">
            <el-input v-model="searchForm.shopName" type="text" clearable  :placeholder="$t('shop.storeName')"></el-input>
          </el-form-item>
          <el-form-item prop="status" :label="$t('distributionMsg.auditStatus')+':'">
            <el-select v-model="searchForm.status" clearable  :placeholder="$t('distributionMsg.auditStatus')">
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
            <div class="default-btn" @click="resetForm('searchForm')">{{ $t('product.reset') }}</div>
            <div class="default-btn primary-btn" @click="exportShopWithdrawCash()">{{$t('formData.export')}}</div>

          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="table-con">
        <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row"
            style="width: 100%"
        >
          <el-table-column
            type="index"
            :label="$t('sysManagement.serialNumber')"
            width="80">
          </el-table-column>
          <el-table-column
            :label="$t('shop.storeName')"
            prop="shopName"
            >
          </el-table-column>
          <el-table-column
            :label="$t('shop.shopLogo')"
          >
            <template slot-scope="scope">
              <div class="table-cell-image">
                <img :src="scope.row.shopLogo" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            :label="$t('shopWithdrawCash.withdrawalAmount')"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            :label="$t('sys.creationTime')"
          >
          </el-table-column>
          <el-table-column
            prop="updateTime"
            :label="$t('home.updateTime')"
          >
          </el-table-column>
          <el-table-column
            prop="auditingTime"
            :label="$t('components.reviewTime')"
          >
          </el-table-column>
          <el-table-column
            :label="$t('distributionMsg.auditStatus')"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">{{$t('liveRoom.underReview')}}</span>
              <span v-if="scope.row.status === 1">{{$t('shopWithdrawCash.succeeded')}}</span>
              <span v-if="scope.row.status === -1">{{$t('shopWithdrawCash.failed')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('crud.menu')"
            width="200"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="isAuth('shop:shopWithdrawCash:audit') && scope.row.status === 0"
                  class="default-btn text-btn"
                  @click="auditHandle(scope.row)"
                >{{$t('productComm.audit')}}</div>
                <div
                  class="default-btn text-btn"
                  v-else-if="isAuth('shop:shopWithdrawCash:audit')"
                  @click="auditHandle(scope.row)"
                >{{$t('shopWithdrawCash.viewReviewInfo')}}</div>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './shopWithdrawCash-add-or-update.vue'
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
        status: null
      }, // 搜索
      dataListLoading: false,
      addOrUpdateVisible: false,
      status: [
        {
          label: this.$i18n.t('liveRoom.underReview'),
          value: 0
        }, {
          label: this.$i18n.t('shopWithdrawCash.succeeded'),
          value: 1
        }, {
          label: this.$i18n.t('shopWithdrawCash.failed'),
          value: -1
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
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/shop/shopWithdrawCash/page'),
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
    auditHandle (rowData) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(rowData)
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
    },
    /**
     * 导出商家提现记录
     */
    exportShopWithdrawCash () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.searchForm))
      const loading = this.$loading({
        lock: true,
        target: '.mod-seckill-shopWithdrawCash',
        customClass: 'export-load',
        background: 'transparent',
        text: this.$i18n.t('shop.exportIng')
      })
      this.$http({
        url: this.$http.adornUrl('/shop/shopWithdrawCash/exportShopWithdrawCash'),
        method: 'get',
        params: this.$http.adornParams(params),
        responseType: 'blob'
      }).then(({data}) => {
        loading.close()
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.$i18n.t('shop.withDrawCashXls')
        const elink = document.createElement('a')
        if ('download' in elink) {
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          // URL.revokeObjectURL(elink.href) // 释放URL 对象
          // document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
        this.$message({
          message: this.$i18n.t('shop.exportSuccess'),
          type: 'success',
          duration: 1500
        })
      }).catch((e) => {
        loading.close()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-seckill-shopWithdrawCash {

}
  ::v-deep .export-load {
    top: -50% !important;
  }
</style>
