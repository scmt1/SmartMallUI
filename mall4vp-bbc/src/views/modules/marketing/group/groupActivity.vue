<template>
  <div class="mod-admin-groupActivity">

   <!-- 新版规范 -->
    <div class="seckill-list-mod">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
          <div class="input-row">
            <el-form-item :label="$t('prodList.shopName') + ':'" class="search-form-item">
              <el-input v-model="searchForm.shopName" :placeholder="$t('prodList.shopName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('groups.eventName') + ':'" class="search-form-item">
              <el-input v-model="searchForm.activityName" :placeholder="$t('groups.eventName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('group.actStatus') + ':'" class="search-form-item">
              <el-select v-model="searchForm.status" :placeholder="$t('product.status')">
                <el-option :label="$i18n.t('groups.expired')" :value="0"></el-option>
                <el-option :label="$i18n.t('groups.startUsing')" :value="1"></el-option>
                <el-option :label="$i18n.t('groups.notEnabled')" :value="2"></el-option>
                <el-option :label="$i18n.t('groups.offlineViolation')" :value="3"></el-option>
                <el-option :label="$i18n.t('groups.moderated')" :value="4"></el-option>
                <el-option :label="$i18n.t('groups.over')" :value="5"></el-option>
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
              :label="$t('coupon.shopName')"
              min-width="230"
              >
              <template slot-scope="scope">
                <span class="table-cell-text">{{ scope.row.shopName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              fixed="left"
              prop="activityName"
              :label="$t('seckill.activityName')"
              min-width="230"
              >
              <template slot-scope="scope">
                <span class="table-cell-text">{{ scope.row.activityName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="groupNumber"
              :label="$t('groups.groupType')"
              min-width="140"
              >
              <template slot-scope="scope">
                <span class="table-cell-text">{{ scope.row.groupNumber + '人团'}}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="groupOrderCount"
              :label="$t('groups.groupOrderCount')"
              min-width="180"
              >
            </el-table-column>

            <el-table-column
              prop="startTime"
              :label="$t('coupon.startTime')"
              min-width="180"
              >
            </el-table-column>

            <el-table-column
              prop="endTime"
              :label="$t('coupon.endTime')"
              min-width="180"
              >
            </el-table-column>

            <el-table-column
              prop="status"
              :label="$t('product.status')"
              min-width="140"
              >
              <template slot-scope="scope">
                <div class="tag-text">
                  {{[$t("groups.expired"), $t("groups.startUsing"), $t("groups.notEnabled"),
                  $t('groups.offlineViolation'), $t('groups.moderated'), $t('groups.over'),]
                  [scope.row.status]}}</div>
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              align="center"
              :label="$i18n.t('crud.menu')"
              :width="lang ==='en' ? '380' : '280'"
              >
              <template slot-scope="scope">
                <div class="text-btn-con">
                    <div
                      type="text"
                      class="default-btn text-btn"
                      @click="addOrUpdateHandle(scope.row.groupActivityId)"
                      >{{ $t("discount.viewActivities") }}
                    </div>
                    <!-- <div
                      type="text"
                      class="default-btn text-btn"
                      @click="selectActivityProd(scope.row.groupActivityId)"
                      >{{ $t("prodList.lookOverProd") }}
                    </div> -->
                    <div
                      class="default-btn text-btn"
                      v-if="isAuth('group:activity:update') && scope.row.status < 3 && scope.row.status !== 0"
                      @click="offlineGroupHandle(scope.row)"
                      >{{ $t("coupon.violationOffShelf") }}
                    </div>
                    <div
                      type="text"
                      class="default-btn text-btn"
                      v-if="
                          isAuth('group:activity:update') &&
                          scope.row.status > 2 &&
                          scope.row.status != 5 &&
                          scope.row.activityStatus !== 3
                        "
                        @click="groupAuditHandle(scope.row.groupActivityId)"
                        >{{
                          scope.row.status === 3
                            ? $t("prodList.offShelfManage")
                            : $t("coupon.checkPending")
                        }}
                    </div>
                  <!-- <div
                    :class="[!((scope.row.activityStatus === 1 && scope.row.status !== 1) || (scope.row.activityStatus >= 3 && scope.row.activityStatus <= 6))?'disabled-btn':'','default-btn text-btn']"
                    @click="deleteHandle(scope.row)"
                    >{{ $t("coupon.delete") }}</div> -->
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
    <groupProds
      v-if="groupProdsVisible"
      ref="groupProds"
      @refreshDataList="refreshChange"
    ></groupProds>

    <!-- 商品审核弹窗 -->
    <groupAudit
      v-if="groupAuditVisible"
      ref="groupAudit"
      selectUrl="/platform/group/activity/getOfflineHandleEventByActivityId"
      updateUrl="/platform/group/activity/auditGroupActivity"
      @refreshDataList="refreshChange"
    ></groupAudit>
  </div>
</template>

<script>
import AddOrUpdate from './groupActivity-add-or-update'
import GroupProds from './groupProd'
import groupAudit from '@/components/offline-audit'
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
        activityName: null,
        status: null
      },
      dataListLoading: false,
      groupAuditVisible: false,
      groupProdsVisible: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    groupAudit,
    GroupProds
  },
  computed: {
    lang () {
      return localStorage.getItem('lang')
    }
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
        url: this.$http.adornUrl('/platform/group/activity/page'),
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
    deleteHandle (row) {
      if (!((row.activityStatus === 1 && row.status !== 1) || (row.activityStatus >= 3 && row.activityStatus <= 6))) {
        return
      }
      this.$confirm(this.$i18n.t('groups.confirmDelete') + row.activityName + this.$i18n.t('groups.active'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/platform/group/activity/${row.groupActivityId}`),
          method: 'delete',
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
    /**
     * 刷新回调
     */
    refreshChange (isRouteToGroupProd, groupActivityId) {
      if (isRouteToGroupProd === 1) {
        this.$router.push({
          path: '/groupProds',
          query: { activityId: groupActivityId }
        })
      }
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 管理拼团活动商品
    manageGroupProdHandle (groupActivityId) {
      this.visible = false
      this.$router.push({
        path: '/groupProds',
        query: { activityId: groupActivityId }
      })
    },
    // 失效活动活动
    invalidActivityHandle (row) {
      this.$confirm(this.$i18n.t('groups.determinedToFail') + row.activityName + this.$i18n.t('groups.actTip'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(
        () => {
          this.$http({
            url: this.$http.adornUrl('/group/activity/invalid/' + row.groupActivityId),
            method: 'PUT',
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
    // 下架活动
    offlineGroupHandle (row) {
      var tips = this.$i18n.t('groups.removeActivityNameTips')
      tips = tips.replace('ACTIVITYNAME', row.activityName)
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
        // if (!obj.value) {
        //   this.$message.error(this.$i18n.t('groups.offShelfReasonTips'))
        //   return
        // }
        // if (/^\s+$/g.test(obj.value)) {
        //   this.$message.error(this.$i18n.t('shopProcess.inputAllSpace'))
        //   return
        // }
        this.$http({
          url: this.$http.adornUrl(`/platform/group/activity/offline`),
          method: 'post',
          data: this.$http.adornData({
            handleId: row.groupActivityId,
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
    groupAuditHandle (id) {
      this.groupAuditVisible = true
      this.$nextTick(() => {
        this.$refs.groupAudit.init(id)
      })
    },
    // 弹窗处理
    selectActivityProd (id) {
      this.groupProdsVisible = true
      this.$nextTick(() => {
        this.$refs.groupProds.init(id)
      })
    },
    clearSearch () {
      this.searchForm.shopName = null
      this.searchForm.activityName = null
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

</style>
