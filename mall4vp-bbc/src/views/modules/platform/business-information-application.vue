<template>
  <div class="mod-seckill-shopAuditing">
    <div class="search-bar">
      <el-form :inline="true" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row margin-bottom-none">
          <el-form-item prop="shopName" :label="$t('shop.storeName') + ':'">
            <el-input v-model="searchForm.shopName" size="small" :placeholder="$t('shop.storeName')"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('shop.applicationDate') + ':'"
          >
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
          <div class="default-btn" @click="resetList">{{$t('product.reset')}}</div>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="table-con audit-shop-table">
        <el-table
          v-loading="dataListLoading"
          ref="auditShop"
          :data="dataList"
          header-cell-class-name="table-header"
          style="width: 100%">

          <el-table-column
            prop="shopName"
            :label="$t('shop.storeName')"
          >
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.shopName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="intro"
            :label="$t('shop.shopProfile')"
          >
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.shopIntro }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            :label="$t('shop.applicationDate')"
          >
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          
          <el-table-column
            :label="$t('publics.operating')"
            width="150px">
            <template slot-scope="scope">
              <div
                class="default-btn text-btn"
                v-if="isAuth('shop:shopAuditing:audit')"
                @click="auditHandle(scope.row.shopId)"
              >{{ $t('shopProcess.audit') }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-if="dataList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>

    <!-- 审核操作 -->
    <auditBusinessInfor
      @closePops="closeAuditBusiness"
      v-if="addOrUpdateVisible"
      ref="auditBusiness">
    </auditBusinessInfor>

  </div>
</template>

<script>
import auditBusinessInfor from './audit-business-infor.vue'
export default {
  data () {
    return {
      addOrUpdateVisible: false,
      dataList: [], // 申请数据
      page: {
        total: 0, // 总页数
        current: 1, // 当前页数
        size: 10 // 每页显示多少条
      },

      // 搜索
      searchForm: {
        shopName: '', // 店铺名
        beginTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      dateRange: [], // 申请时间

      dataListLoading: false // 加载框
    }
  },
  components: {
    auditBusinessInfor
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      let param = {}
      Object.assign(param, this.searchForm)
      console.log(param)
      param.size = this.page.size
      param.current = this.page.current

      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/companyAuditing/page'),
        method: 'get',
        params: this.$http.adornParams(param)
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
      }).finally(() => {
        this.dataListLoading = false
      })
    },
    // 重置
    resetList () {
      for (let i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.dateRange = ''
      this.page.current = 1
    },
    // 查看审核
    auditHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.auditBusiness.init(id)
      })
    },
    // 关闭审核弹窗
    closeAuditBusiness () {
      this.addOrUpdateVisible = false
      this.getDataList()
    },
    // 检索
    searchChange () {
      this.searchForm.beginTime = ''
      this.searchForm.endTime = ''
      if (this.dateRange && this.dateRange.length != 0) {
        this.searchForm.beginTime = this.dateRange[0]
        this.searchForm.endTime = this.dateRange[1]
      }
      this.page.current = 1
      this.getDataList()
    },
    // 修改分页
    handleSizeChange (val) {
      this.page.size = val
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.page.current = val
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
