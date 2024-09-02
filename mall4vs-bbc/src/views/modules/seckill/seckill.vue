<template>
  <div class="mod-seckill-seckill">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="test-form" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item :label="$t('product.prodName')+':'" class="search-form-item">
            <el-input v-model="searchForm.prodName" :placeholder="$t('product.prodName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('groups.eventName')+':'" class="search-form-item">
            <el-input v-model="searchForm.seckillName" :placeholder="$t('groups.eventName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('group.actStatus')+':'" class="search-form-item">
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
            <div class="default-btn" @click="clearSearch">{{$t('shop.resetMap')}}</div>
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

          <el-table-column
            prop="seckillName"
            :label="$t('groups.eventName')"
            >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.seckillName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="startTime"
            :label="$t('coupon.startTime')"
            >
          </el-table-column>

          <el-table-column
            prop="endTime"
            :label="$t('coupon.endTime')"
            >
          </el-table-column>

          <el-table-column
            prop="maxNum"
            :label="$t('product.maxNum')"
            >
          </el-table-column>

          <el-table-column
            prop="maxCancelTime"
            :label="$t('product.maxCancelTime')"
            >
          </el-table-column>

          <el-table-column
            prop="status"
            :label="$t('group.actStatus')"
            >
            <template slot-scope="scope">
              <div class="tag-text">
                {{[$t("station.close"), $t("station.open"), $t("product.offViol"),
                $t('product.pendingReview')]
                [scope.row.status]}}</div>
            </template>
          </el-table-column>

          <el-table-column :label="$i18n.t('crud.menu')" align="center" width="200">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('seckill:seckill:info')"
                  @click="addOrUpdateHandle(scope.row.seckillId)"
                  >{{ $t("live.view") }}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('seckill:seckill:invalid') && scope.row.status === 1"
                  @click="invalidHandle(scope.row.seckillId)"
                  >{{ $t("station.close") }}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('seckill:seckill:auditApply') && scope.row.status > 1"
                  @click="auditEventHandle(scope.row.seckillId)"
                  >{{
                    scope.row.status === 2
                      ? $t("groups.applyForListing")
                      : $t("coupon.waitReview")
                  }}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('seckill:seckill:delete')"
                  @click="deleteHandle(scope.row.seckillId, scope.row.status)"
                  >{{ $t("text.delBtn") }}</div>
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

    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>
    <!-- 下线管理弹窗-->
    <offlineEventHandle
      v-if="offlineEventHandleVisible"
      selectUrl="/seckill/seckill/getOfflineHandleEventBySeckillId"
      applyUrl="/seckill/seckill/auditApply"
      ref="offlineEvent"
      @refreshDataList="refreshChange"
    ></offlineEventHandle>
  </div>
</template>

<script>
import AddOrUpdate from './seckill-add-or-update'
import OfflineEventHandle from '@/components/offline-event-handle'
export default {
  name: 'seckill-seckill',
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
        seckillName: null,
        status: null,
        prodName: ''
      },
      statusList: [
        {
          value: 0,
          label: this.$i18n.t('station.close')
        },
        {
          value: 1,
          label: this.$i18n.t('station.open')
        },
        {
          value: 2,
          label: this.$i18n.t('product.violation')
        },
        {
          value: 3,
          label: this.$i18n.t('coupon.waitReview')
        }
      ],
      dataListLoading: false,
      offlineEventHandleVisible: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    OfflineEventHandle
  },
  created () {

  },
  activated () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList (page, newData = false) {
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/seckill/seckill/page'),
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
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.$router.push({
        path: '/seckill-new-seckill',
        query: {
          seckillId: id
        }
      })
    },
    deleteHandle (id, status) {
      // if (status === 2) {
      //   return
      // }
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.seckillId
      })
      this.$confirm(this.$i18n.t('admin.isDeleOper') + '?', this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/seckill/seckill/' + id),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.page.total = this.page.total - ids.length
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
      this.$confirm(this.$i18n.t('seckill.makeSurateTheAct'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/seckill/seckill/invalid/' + id),
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
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 下线管理
    auditEventHandle (id) {
      this.offlineEventHandleVisible = true
      this.$nextTick(() => {
        this.$refs.offlineEvent.init(id)
      })
    },
    clearSearch () {
      this.searchForm.seckillName = null
      this.searchForm.status = null
      this.searchForm.prodName = ''
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
