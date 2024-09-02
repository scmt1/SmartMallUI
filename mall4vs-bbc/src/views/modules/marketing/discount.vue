<template>
  <div class="mod-discount">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="test-form" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item :label="$t('groups.eventName')+':'" class="search-form-item">
              <el-input v-model="searchForm.discountName" :placeholder="$t('groups.eventName')"></el-input>
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
            prop="discountName"
            :label="$t('groups.eventName')"
            width="500"
            >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.discountName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="startTime"
            :label="$t('coupon.startTime')"
            min-width="160"
            >
          </el-table-column>

          <el-table-column
            prop="endTime"
            :label="$t('coupon.endTime')"
            min-width="160"
            >
          </el-table-column>

          <el-table-column
            prop="status"
            :label="$t('group.actStatus')"
            >
            <template slot-scope="scope">
              <div class="tag-text">
                {{[$t("station.close"), $t("station.open"), $t("product.violation"),
                $t('coupon.waitReview')]
                [scope.row.status]}}</div>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$i18n.t('crud.menu')" width="250">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div class="default-btn text-btn">
                  <div
                    type="text"
                    class="default-btn text-btn"
                    v-if="isAuth('admin:discount:update')"
                    @click="addOrUpdateHandle(scope.row.discountId)"
                  >{{$t("groups.editEvent")}}
                  </div>
                </div>
                <div class="default-btn text-btn">
                  <div
                    type="text"
                    class="default-btn text-btn"
                    v-if="isAuth('admin:discount:discountProd')"
                    @click="showProds(scope.row.discountId)"
                  >{{$t("live.view")}}
                  </div>
                </div>
                <div class="default-btn text-btn" v-if="isAuth('admin:discount:auditApply') && scope.row.status > 1">
                  <div
                    type="text"
                    class="default-btn text-btn"
                    v-if="isAuth('admin:discount:auditApply') && scope.row.status > 1"
                    @click="offlineEventHandle(scope.row.discountId)"
                  >{{scope.row.status === 2?$t("groups.applyForListing"):$t("coupon.waitReview")}}
                  </div>
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('admin:discount:delete')"
                  @click="deleteHandle(scope.row.discountId, scope.row.status)"
                >{{$t("text.delBtn")}}</div>
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

    <!-- 弹窗  新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"></add-or-update>

    <!-- 下线管理弹窗-->
    <offlineEventHandle
      v-if="offlineEventHandleVisible"
      selectUrl="/admin/discount/getOfflineHandleEventByDiscountId"
      applyUrl="/admin/discount/auditApply"
      ref="offlineEventHandle"
      @refreshDataList="refreshChange"
    ></offlineEventHandle>
  </div>
</template>

<script>
import AddOrUpdate from './discountProd-add-or-update'
import OfflineEventHandle from '@/components/offline-event-handle'

export default {
  name: 'marketing-discount',
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataForm: {
        discountName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 头部搜索表单
      searchForm: {
        discountName: null,
        status: null
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
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    OfflineEventHandle
  },
  created () {
    // this.getDataList()
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (page, newData = false) {
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/admin/discount/page'),
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
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增
    addOrUpdateHandle (id) {
      this.$router.push({ path: '/marketing-discountInfo', query: { discountId: id } })
    },
    // 查看商品
    showProds (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.showProdInit(id, 1)
      })
    },
    // 删除
    deleteHandle (id, status) {
      // if (status === 2 || status === 3) {
      //   return
      // }
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.discountId
      })
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[${this.$i18n.t('text.delBtn')}]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/admin/discount/' + id),
            method: 'delete',
            data: this.$http.adornData({}, false)
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
        })
        .catch(() => { })
    },
    // 条件查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getDataList(this.page, newData)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    // 下线管理
    offlineEventHandle (id) {
      this.offlineEventHandleVisible = true
      this.$nextTick(() => {
        this.$refs.offlineEventHandle.init(id)
      })
    },
    clearSearch () {
      this.searchForm.discountName = null
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
    },
    /**
     * 刷新数据
     */
    refreshChange () {
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
