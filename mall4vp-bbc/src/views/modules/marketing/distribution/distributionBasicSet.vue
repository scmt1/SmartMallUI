<template>
  <div class="mod--distributionBasicSet">
     <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="shopName" label="店铺名称" class="search-form-item">
            <el-input type="text" v-model="searchForm.shopName" placeholder="店铺名称"></el-input>
          </el-form-item>
          <el-form-item prop="distributionSwitch" label="分销状态" class="search-form-item">
            <el-select v-model="searchForm.distributionSwitch" placeholder="分销状态">
              <el-option label="关闭" :value="0"></el-option>
              <el-option label="开启" :value="1"></el-option>
              <el-option label="违规下线" :value="2"></el-option>
              <el-option label="等待审核" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="default-btn primary-btn" @click="searchChange">{{$t('product.search')}}</div>
        <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="table-con prod-table">
        <el-table
          ref="prodListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="shopName"
            label="店铺名称"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="distributionSwitch"
            label="分销状态"
            width="auto">
              <template slot-scope="scope">
              <span class="tag-text" v-if="scope.row.distributionSwitch == 0">关闭</span>
              <span class="tag-text" v-else-if="scope.row.distributionSwitch == 1">开启</span>
              <span class="tag-text" v-else-if="scope.row.distributionSwitch == 2">违规下线</span>
              <span class="tag-text" v-else-if="scope.row.distributionSwitch == 3">等待审核</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="parallelDeal"
            label="互购开关"
            width="auto">
            <template slot-scope="scope">
            <span class="tag-text" v-if="scope.row.parallelDeal == 0">关闭</span>
            <span class="tag-text" v-else-if="scope.row.parallelDeal == 1">开启</span>
          </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="ownBuyAward"
            label="自购佣金"
            width="auto">
            <template slot-scope="scope">
              <span class="tag-text" v-if="scope.row.settlementMethod == 0">关闭</span>
              <span class="tag-text" v-else-if="scope.row.settlementMethod == 1">开启</span>
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
                <div class="default-btn text-btn"
                  v-if="isAuth('platform:distributionBasicSet:info')"
                  type="text"
                  @click="showSettingInfo(scope.row.basicSetId)">查看设置</div>
                <div class="default-btn text-btn"
                  v-if="isAuth('platform:distributionBasicSet:update') && scope.row.distributionSwitch<2"
                  @click="offlineDistributionHandle(scope.row)">功能下线</div>
                <div class="default-btn text-btn"
                  v-if="isAuth('platform:distributionBasicSet:update') && scope.row.distributionSwitch > 1"
                  @click="distributionAuditHandle(scope.row.basicSetId)">下线管理</div>
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


    <!-- 商品审核弹窗 -->
    <DistributionAudit v-if="distributionAuditVisible"
                       ref="distributionAudit"
                       selectUrl='/platform/distributionBasicSet/getOfflineHandleEventByBasicSetId'
                       updateUrl='/platform/distributionBasicSet/auditDistribution'
                       @refreshDataList="refreshChange"></DistributionAudit>
  </div>
</template>
 <script>
import DistributionAudit from '@/components/offline-audit'
export default {
  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      distributionAuditVisible: false,
      addOrUpdateVisible: false,
      searchForm: {
        shopName: ''
      }
    }
  },
  components: {
    DistributionAudit
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/distributionBasicSet/getShopDistributionPage'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.searchForm
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    deleteHandle (id) {
      this.$confirm('确定进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/distributionBasicSet/' + id),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList(this.page)
            }
          })
        })
      }).catch(() => { })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange () {
      this.getDataList(this.page)
    },
    /**
     * 下线分销活动处理
     */
    offlineDistributionHandle (row) {
      this.$prompt('确定对店铺[' + row.shopName + ']分销功能进行下线操作吗？如是，请填写下线理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\s\S+|S+\s|\S/, // 不能全为空格 空字符串
        inputErrorMessage: this.$i18n.t('seckill.offlineReasonTip'),
        inputValidator: (value) => {
          if (value.length > 100) {
            return this.$i18n.t('seckill.offlineReasonTip1')
          }
        }
      }).then((obj) => {
        this.$http({
          url: this.$http.adornUrl(`/platform/distributionBasicSet/offline`),
          method: 'post',
          data: this.$http.adornData({
            handleId: row.basicSetId,
            offlineReason: obj.value || null
          })
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
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
    distributionAuditHandle (id) {
      this.distributionAuditVisible = true
      this.$nextTick(() => {
        this.$refs.distributionAudit.init(id)
      })
    },
    // 查看设置详情
    showSettingInfo (shopId) {
      this.$router.push({
        path: '/distributionSetting',
        query: {
          shopId: shopId
        }
      })
    },
    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
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
<style lang="scss">
.mod--distributionBasicSet {
}
</style>
