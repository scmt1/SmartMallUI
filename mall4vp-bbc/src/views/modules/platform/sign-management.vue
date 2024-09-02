<template>
  <div class="mod-seckill-shopAuditing">
    <div class="search-bar">
      <el-form :inline="true" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row margin-bottom-none">
          <el-form-item prop="shopName" :label="$t('prodList.shopName')+':'">
            <el-input v-model="searchForm.shopName" size="small" :placeholder="$t('prodList.shopName')"></el-input>
          </el-form-item>
          <el-form-item prop="type" :label="$t('shop.signingType')+':'">
            <el-select v-model="searchForm.type" clearable :placeholder="$t('shop.signingType')">
              <el-option :label="$t('shopProcess.category')" :value="1"></el-option>
              <el-option :label="$t('shopProcess.brand')" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('order.applicationTime')+':'"
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
          ref="auditShopSign"
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
              <div class="table-cell-image" v-if="scope.row.shopLogo && scope.row.shopLogo !== null">
                <img :src="scope.row.shopLogo.indexOf('http') !== -1 ? scope.row.shopLogo : resourcesUrl + scope.row.shopLogo">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            :label="$t('shop.signingType')"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type === 1">{{ $t('shopProcess.category') }}</span>
              <span v-if="scope.row.type === 2">{{ $t('shopProcess.brand') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            :label="$t('order.applicationTime')"
          >
          </el-table-column>
          <el-table-column
            :label="$t('publics.operating')"
            width="150"
          >
            <template slot-scope="scope">
              <div
                class="default-btn text-btn"
                @click="auditHandle(scope.row.shopId, scope.row.type)"
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

  </div>
</template>

<script>
import AddOrUpdate from './sign-add-or-update.vue'
export default {
  components: {
    AddOrUpdate
  },
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件
      // 图片前缀
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
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
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    /**
     * 分页获取待审核的签约信息
     */
    getDataList (page, newData = false) {
      page = page || this.page
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = {
          'current': page.currentPage,
          'size': page.pageSize,
          'status': 0,
          'beginTime': this.dateRange ? this.dateRange[0] : null, // 开始时间
          'endTime': this.dateRange ? this.dateRange[1] : null // 结束时间
        }
        this.theParams = this.searchForm
      } else {
        this.theData.current = page.currentPage
        this.theData.size = page.pageSize
      }
      // status 0 未审核 1已通过 -1未通过 不传返回全部
      this.$http({
        url: this.$http.adornUrl('/platform/signingAuditing/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign(this.theData, this.theParams
        ))
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.page.currentPage = data.current
        this.dataListLoading = false
      })
    },
    // 查看 / 审核
    auditHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    },

    /**
     * 刷新回调
     */
    refreshChange () {
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 清空自定义数据
    searchReset () {
      this.dateRange = []
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 弹窗处理
    shopAuditHandle (id) {

    },
     /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.searchForm = {}
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
