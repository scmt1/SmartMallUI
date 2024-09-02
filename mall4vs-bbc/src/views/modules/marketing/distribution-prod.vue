<template>
  <div class="mod-distribution-prod">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="test-form" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item :label="$t('product.prodName')+':'" class="search-form-item">
              <el-input v-model="searchForm.prodName" :placeholder="$t('product.prodName')"></el-input>
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
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('shopFeature.searchBar.search')}}</div>
            <div class="default-btn" @click="clearSearch">{{$t('shop.resetMap')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 搜索栏end -->
    <!-- 表格主体 -->
    <div class="main-container">
      <div class="operation-bar">
        <el-checkbox v-model="selectAll" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox>
        <span v-if="dataListSelections.length" class="had-selected">{{$t('publics.selected')}} {{dataListSelections.length}}</span>
        <div
          class="default-btn primary-btn"
          v-if="isAuth('seckill:seckill:save')"
          @click="addOrUpdateHandle()"
          >{{ $t("crud.addTitle") }}
        </div>
        <div
          :class="[!dataListSelections.length ? 'disabled-btn':'','default-btn']"
          v-if="isAuth('distribution:distributionProd:delete')"
          @click.stop="deleteHandle">{{$t("sys.batchDelete")}}</div>
      </div>
      <!-- 表格 -->
      <div class="table-con seckill-table">
        <el-table
          ref="prodListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          @selection-change="selectionChange"
          style="width: 100%">

          <el-table-column
            v-if="dataList.length"
            align="left"
            type="selection"
            width="55"
            >
          </el-table-column>

          <el-table-column
            prop="prodName"
            :label="$t('product.prodName')"
            width="517"
            >
            <template slot-scope="scope">
              <div>
                <span class="table-cell-text">{{ scope.row.product.prodName }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="pic"
            :label="$t('product.pic')"
            >
            <template slot-scope="scope">
              <div class="table-cell-image">
                <prod-pic
                  height="60"
                  width="60"
                  :pic="scope.row.product.pic"
                ></prod-pic>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="state"
            :label="$t('product.status')"
            >
            <template slot-scope="scope">
              <div class="tag-text">
                {{[$t("publics.metLowerShelf"), $t("publics.metUpperShelf"), $t("product.violation"),
                  $t("product.pendingReview")]
                [scope.row.state]}}</div>
            </template>
          </el-table-column>

           <!-- 奖励比例 -->
          <el-table-column
            prop="state"
            :label="$t('marketing.rewardRatio')"
            width="150"
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
              <div class="tag-text" v-if="scope.row.parentAwardSet === 0">{{ $t("station.close") }}</div>
              <div class="tag-text" v-if="scope.row.parentAwardSet === 1">{{ $t("groups.turnOn") }}</div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            :label="$i18n.t('crud.menu')"
            fixed="right"
            width="240">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('distribution:distributionProd:update')"
                  @click="addOrUpdateHandle(scope.row)"
                  >{{$t("crud.updateBtn")}}</div
                >
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('distribution:distributionProd:delete')"
                  @click="deleteHandle(scope.row)"
                  >{{ $t("text.delBtn") }}</div
                >
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('distribution:distributionProd:auditApply') && scope.row.state > 1"
                  @click="auditEventHandle(scope.row.distributionProdId)">{{$t(scope.row.state === 2 ? "groups.applyForListing":"groups.moderated")}}</div
                >
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
    <!-- 表格主体end -->

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>

    <!-- 下线管理弹窗-->
    <offlineEventHandle v-if="offlineEventHandleVisible"
                        selectUrl="/distribution/distributionProd/getOfflineEventByDistProdId"
                        applyUrl="/distribution/distributionProd/auditApply"
                        ref="offlineEvent"
                        @refreshDataList="refreshChange"></offlineEventHandle>
  </div>
</template>

<script>
import AddOrUpdate from './distribution-prod-add-or-update'
import OfflineEventHandle from '@/components/offline-event-handle'
import ProdPic from '@/components/prod-pic'
export default {
  name: 'marketing-distribution-prod',
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件

      dataForm: {
        prodName: ''
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      selectAll: null,
      searchForm: {
        prodName: null,
        state: null
      },
      statusList: [
        {
          label: this.$i18n.t('publics.metLowerShelf'),
          value: 0
        }, {
          label: this.$i18n.t('publics.metUpperShelf'),
          value: 1
        }, {
          label: this.$i18n.t('product.violation'),
          value: 2
        }, {
          label: this.$i18n.t('product.pendingReview'),
          value: 3
        }
      ],
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      offlineEventHandleVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  components: {
    AddOrUpdate,
    OfflineEventHandle,
    ProdPic
  },
  mounted () {

  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 多选回调
    selectionChange (val) {
      this.dataListSelections = val
      this.selectAll = val.length === this.dataList.length
    },
    // 新增 / 修改
    addOrUpdateHandle (data) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(data)
      // })
      this.$router.push({
        path: '/marketing-newDistribution-prod'
      })
      sessionStorage.setItem('distributionProdData', JSON.stringify(data))
    },
    // 点击查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getDataList(this.page, newData)
    },
    // 刷新回调
    refreshChange () {
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true

      if (newData || !this.theData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.theData = {
          'status': this.searchForm.status,
          current: page ? page.currentPage : this.page.currentPage,
          size: page ? page.pageSize : this.page.pageSize
        }
      } else {
        this.theData.current = page ? page.currentPage : this.page.currentPage
        this.theData.size = page ? page.pageSize : this.page.pageSize
      }
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionProd/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign(this.theData, this.theParams))
      }).then(({ data }) => {
        this.page.total = data.total
        this.page.pageSize = data.size
        this.page.currentPage = data.current
        this.dataList = data.records
        this.dataListLoading = false
      })
    },
    // 删除
    deleteHandle (row) {
      var ids = row.distributionProdId ? [row.distributionProdId] : this.dataListSelections.map(item => {
        return item.distributionProdId
      })
      if (!ids.length) {
        this.$message.warning(this.$i18n.t('marketing.pleaseSelectAProduct'))
        return
      }
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[${row.distributionProdId ? this.$i18n.t('text.delBtn') : this.$i18n.t('sys.batchDelete')}]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/distribution/distributionProd'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refreshChange()
            }
          })
        })
      })
    },
    // 下线管理
    auditEventHandle (id) {
      this.offlineEventHandleVisible = true
      this.$nextTick(() => {
        this.$refs.offlineEvent.init(id)
      })
    },
    /**
     * 全选按钮
     */
    handleSelectAll () {
      if (this.$refs.prodListTable.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.$refs.prodListTable.toggleAllSelection()
    },
    clearSearch () {
      this.searchForm.prodName = null
      this.searchForm.state = null
    },
    // 每页数量变更
    handleSizeChange (val) {
      console.log(val)
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
.main-container {
  .table-con {
    .table-cell-image {
      margin: 0;
    }
  }
}

</style>
