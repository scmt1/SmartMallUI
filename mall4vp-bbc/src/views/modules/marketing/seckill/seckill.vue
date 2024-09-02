<template>
  <div class="mod-seckill-seckill">
    <!-- 新版规范 -->
    <div class="seckill-list-mod">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" class="search-form" ref="test-form" :model="searchForm" size="small">
          <div class="input-row">
            <el-form-item :label="$t('prodList.shopName') + ':'" class="search-form-item">
              <el-input v-model="searchForm.shopName" :placeholder="$t('prodList.shopName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('groups.eventName') + ':'" class="search-form-item">
                <el-input v-model="searchForm.seckillName" :placeholder="$t('groups.eventName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('group.actStatus') + ':'" class="search-form-item">
              <el-select v-model="searchForm.status" :placeholder="$t('group.actStatus')">
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
              <div class="default-btn" @click="clearSearch">{{$t('product.reset')}}</div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- 搜索栏end -->
      <!-- 表格主体 -->
      <div class="main-container">
        <div class="operation-bar">
          <div
            class="default-btn primary-btn"
            v-if="isAuth('seckill:seckill:save')"
            @click="addOrUpdateHandle()"
            >{{ $t("crud.addTitle") }}
          </div>
        </div>
        <!-- 表格 -->
        <div class="table-con seckill-table">
          <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%">

            <!-- <el-table-column
              align="center"
              type="index"
              :label="$t('number')"
              width="50"
              >
            </el-table-column> -->

            <el-table-column
              fixed="left"
              prop="shopName"
              min-width="230"
              :label="$t('coupon.shopName')"
              >
              <template slot-scope="scope">
                <span class="table-cell-text">{{ scope.row.shopName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              fixed="left"
              prop="seckillName"
              min-width="340"
              :label="$t('seckill.activityName')"
              >
              <template slot-scope="scope">
                <span class="table-cell-text">{{ scope.row.seckillName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="startTime"
              min-width="240"
              :label="$t('coupon.startTime')"
              >
            </el-table-column>

            <el-table-column
              prop="endTime"
              width="240"
              :label="$t('coupon.endTime')"
              >
            </el-table-column>

            <el-table-column
              prop="maxNum"
              min-width="150"
              :label="$t('seckill.purchaseLimit')"
              >
            </el-table-column>

            <el-table-column
              prop="status"
              min-width="150"
              :label="$t('group.actStatus')"
              >
              <template slot-scope="scope">
                <div class="tag-text">
                  {{[$t("seckill.loseEffectiveness"), $t("publics.normal"), $t("groups.offlineViolation"),
                  $t('product.pendingReview')]
                  [scope.row.status]}}</div>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$i18n.t('crud.menu')" width="230" fixed="right">
              <template slot-scope="scope">
                <div class="text-btn-con">
                  <div
                      class="default-btn text-btn"
                      @click="addOrUpdateHandle(scope.row.seckillId)"
                      >{{ $t("seckill.view") }}
                    </div>
                  <div
                      class="default-btn text-btn"
                      v-if="isAuth('platform:seckill:update') && scope.row.status === 1"
                     @click="offlineSeckillHandle(scope.row)"
                      >{{ $t("coupon.violationOffShelf") }}
                    </div>
                  <div
                      class="default-btn text-btn"
                      v-if="isAuth('platform:seckill:update') && scope.row.status > 1"
                      @click="seckillAuditHandle(scope.row.seckillId)"
                      >{{
                        scope.row.status === 2
                          ? $t("prodList.offShelfManage")
                          : $t("coupon.checkPending")
                      }}
                    </div>
                  <div
                    class="default-btn text-btn"
                    v-if="isAuth('platform:seckill:update')"
                    @click="deleteHandle(scope.row.seckillId, scope.row.status)"
                    >{{ $t("coupon.delete") }}</div>
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
    </div>

    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>

    <!-- 商品审核弹窗 -->
    <SeckillAudit
      v-if="seckillAuditVisible"
      ref="seckillAudit"
      selectUrl="/platform/seckill/getOfflineHandleEventBySeckillId"
      updateUrl="/platform/seckill/auditSeckill"
      @refreshDataList="refreshChange"
    ></SeckillAudit>
  </div>
</template>

<script>
import AddOrUpdate from './seckill-add-or-update'
import SeckillAudit from '@/components/offline-audit'
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
      // 头部搜索表单
      searchForm: {
        shopName: null,
        seckillName: null,
        status: null
      },
      statusList: [
        {
          label: this.$i18n.t('seckill.loseEffectiveness'),
          value: 0
        }, {
          label: this.$i18n.t('publics.normal'),
          value: 1
        }, {
          label: this.$i18n.t('groups.offlineViolation'),
          value: 2
        }, {
          label: this.$i18n.t('product.pendingReview'),
          value: 3
        }
      ],
      seckillAuditVisible: false,
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    SeckillAudit
  },
  created () {
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/platform/seckill/page'),
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
        data.records.forEach(element => {
          if (element.maxNum === -1) {
            element.maxNum = this.$i18n.t('seckill.unlimited')
          }
        })
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false

        // 末尾页数据为空重新请求
        if (!this.dataList.length && this.page.currentPage > 1) {
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
    deleteHandle (id, status) {
      // if (status === 2) {
      //   return
      // }
      this.$confirm(this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/seckill/' + id),
          method: 'delete',
          data: this.$http.adornData({})
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
      }).catch(() => { })
    },
    invalidHandle (id) {
      this.$confirm(this.$i18n.t('seckill.invalidateActivity'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/seckill/invalid/' + id),
          method: 'put',
          data: this.$http.adornData({})
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
      }).catch(() => { })
    },
    // 刷新回调用
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 下线活动
    offlineSeckillHandle (row) {
      // '确定对活动[' + row.seckillName + ']进行下线操作？如是，请填写下线理由'
      var tips = this.$i18n.t('seckill.offlineTip')
      tips = tips.replace('ACTIVITYNAME', row.seckillName)
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
          url: this.$http.adornUrl(`/platform/seckill/offline`),
          method: 'post',
          data: this.$http.adornData({
            handleId: row.seckillId,
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
    seckillAuditHandle (id) {
      this.seckillAuditVisible = true
      this.$nextTick(() => {
        this.$refs.seckillAudit.init(id)
      })
    },
    clearSearch () {
      this.searchForm.shopName = null
      this.searchForm.seckillName = null
      this.searchForm.status = null
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
<style lang="scss" scoped>
.mod-seckill-seckill {

 ::v-deep .el-table__fixed{
    height: auto !important;
    bottom: 16px !important;
    &::before {
      background-color: transparent !important;
    }
  }
 ::v-deep .el-table__fixed-right{
    height: auto !important;
    bottom: 16px !important;
    &::before {
      background-color: transparent !important;
    }
  }
}
</style>
