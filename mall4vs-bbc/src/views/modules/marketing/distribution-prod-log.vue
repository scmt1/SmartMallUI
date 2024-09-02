<template>
  <div class="mod-distribution-prod">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="test-form" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item :label="$t('product.prodName')+':'" class="search-form-item">
              <el-input v-model="searchForm.prodName" :placeholder="$t('product.prodName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('distribution.distributor')+':'" class="search-form-item">
              <el-input v-model="searchForm.nickName" :placeholder="$t('distribution.distributor')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('distribution.phoneNum')+':'" class="search-form-item">
              <el-input v-model="searchForm.userMobile" :placeholder="$t('distribution.phoneNum')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('product.status')+':'" class="search-form-item">
            <el-select v-model="searchForm.state" :placeholder="$t('product.status')">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-form-item :label="$t('distribution.orderNumber') + ':'">
              <el-input type="text" v-model="searchForm.orderNumber" :placeholder="$t('distribution.orderNumber')"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('shopFeature.searchBar.search')}}</div>
            <div class="default-btn" @click="clearSearch">{{$t('shop.resetMap')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 搜索栏end -->
    <!-- 表格主体 -->
    <div class="main-container">
      <!-- 表格 -->
      <div class="table-con seckill-table">
        <el-table
          ref="prodListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%">

          <el-table-column
            prop="prodName"
            :label="$t('product.prodName')"
            width="340"
            >
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.prodName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="pic"
            :label="$t('product.pic')"
            >
            <template slot-scope="scope">
              <div class="table-cell-image">
                <img :src="scope.row.pic.indexOf('http') == -1 ? resourcesUrl+scope.row.pic : scope.row.pic" />
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="incomeAmount"
            width="100"
            :label="$t('distribution.commAmount')"
            sortable
            >
          </el-table-column>

          <el-table-column
            prop="nickName"
            :label="$t('distribution.distributor')"
            >
          </el-table-column>

          <el-table-column
            width="110"
            prop="userMobile"
            :label="$t('distribution.phoneNum')"
            >
          </el-table-column>

          <el-table-column
            prop="placeTime"
            width="150"
            :label="$t('order.createTime')"
            >
          </el-table-column>

          <el-table-column
            width="190"
            prop="orderNumber"
            :label="$t('chat.orderNumber')"
            >
          </el-table-column>

          <el-table-column
            align="center"
            prop="state"
            :label="$t('distribution.distriStatus')"
            >
            <template slot-scope="scope">
                <div class="tag-text" v-if="scope.row.state>0">
                {{['', $t("distribution.waitSettle"), $t("distribution.settled")]
                [scope.row.state]}}</div>
                <div class="tag-text" v-else>
                  {{$t('distribution.invOrder')}}
                </div>
            </template>
          </el-table-column>
          <!--          失效-->
          <el-table-column
            align="center"
            prop="reson"
            :label="$t('distributionProdLog.lapseCase')"
          >
            <template  slot-scope="scope">
<!--              <span v-if="scope.row.reson === 0">{{ $t('distributionProdLog.lapse0') }}</span>-->
              <span v-if="scope.row.reson === 1">{{ $t('distributionProdLog.lapse1') }}</span>
              <span v-if="scope.row.reson === 2">{{ $t('distributionProdLog.lapse2') }}</span>
              <span v-if="scope.row.reson === 3">{{ $t('distributionProdLog.lapse3') }}</span>
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
</template>

<script>
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
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataListLoading: false,
      dataList: [],
      // 头部搜索表单
      searchForm: {
        prodName: null,
        state: null,
        userMobile: null,
        nickName: null,
        orderNumber: null
      },
      statusList: [
        {
          label: this.$i18n.t('distribution.waitSettle'),
          value: 1
        }, {
          label: this.$i18n.t('distribution.settled'),
          value: 2
        }, {
          label: this.$i18n.t('distribution.invOrder'),
          value: -1
        }
      ]
    }
  },
  components: {
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 刷新回调
    refreshChange () {
      this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionProd/getDistributionProdLogPage'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page ? page.currentPage : this.page.currentPage,
          size: page ? page.pageSize : this.page.pageSize
        }, this.theData))
      }).then(({ data }) => {
        this.page.total = data.total
        this.page.pageSize = data.size
        this.page.currentPage = data.current
        this.dataList = data.records
        this.dataListLoading = false
      })
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    clearSearch () {
      this.searchForm.prodName = null
      this.searchForm.state = null
      this.searchForm.nickName = ''
      this.searchForm.userMobile = ''
      this.searchForm.orderNumber = ''
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
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
