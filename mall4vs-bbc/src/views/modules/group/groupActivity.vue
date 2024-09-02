<template>
  <div class="mod-admin-groupActivity">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="test-form" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item :label="$t('product.prodName')+':'" class="search-form-item">
            <el-input v-model="searchForm.prodName" :placeholder="$t('product.prodName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('groups.eventName')+':'" class="search-form-item">
            <el-input v-model="searchForm.activityName" :placeholder="$t('groups.eventName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('group.actStatus')+':'" class="search-form-item">
            <el-select v-model="searchForm.status" :placeholder="$t('group.actStatus')" @change="handleStatusChange">
              <el-option :label="$t('group.startUsing')" :value="1" />
              <el-option :label="$t('groups.expired')" :value="0" />
              <el-option :label="$t('groups.notEnabled')" :value="2" />
              <el-option :label="$t('groups.over')" :value="5" />
              <el-option :label="$t('groups.offlineViolation')" :value="3" />
              <el-option :label="$t('groups.moderated')" :value="4" />
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
          size="small"
          v-if="isAuth('group:activity:save')"
          @click="addOrUpdateHandle()"
          >
          {{ $t("groups.newJoinGroupActivity") }}
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-con prod-table">
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick"> -->
          <!-- <el-tab-pane :label="item.label" :name="item.value+''" v-for="(item,index) in statusList" :key="index"></el-tab-pane> -->
          <!-- <el-tab-pane :label="$t('home.all')" name="0"></el-tab-pane>
          <el-tab-pane :label="$t('group.startUsing')" name="1"></el-tab-pane>
          <el-tab-pane :label="$t('group.expired')" name="-1"></el-tab-pane>
          <el-tab-pane :label="$t('group.notEnabled')" name="2"></el-tab-pane>
          <el-tab-pane :label="$t('group.over')" name="5"></el-tab-pane>
          <el-tab-pane :label="$t('group.offlineViolation')" name="3"></el-tab-pane>
          <el-tab-pane :label="$t('group.moderated')" name="4"></el-tab-pane>
        </el-tabs> -->
        <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%">

          <el-table-column
            fixed
            prop="activityName"
            :label="$t('groups.eventName')"
            min-width="320"
            >
            <template slot-scope="scope">
              <div>
                <span class="table-cell-text line-clamp-one">{{ scope.row.activityName }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="groupNumber"
            :label="$t('group.groupType')"
            min-width="150"
            >
            <template slot-scope="scope">
              <div >{{scope.row.groupNumber}}{{$t('groups.groupOfPeople')}}</div>
            </template>
          </el-table-column>

          <el-table-column
            prop="startTime"
            :label="$t('group.actStartTime')"
            min-width="230"
            >
          </el-table-column>

          <el-table-column
            prop="endTime"
            :label="$t('group.actEndTime')"
            min-width="230"
            >
          </el-table-column>

          <el-table-column
            prop="groupOrderCount"
            :label="$t('group.groupOrderCount')"
            min-width="230"
            sortable>
          </el-table-column>

          <el-table-column
            prop="status"
            :label="$t('group.actStatus')"
            min-width="150"
            >
            <template slot-scope="scope">
              <div class="tag-text">
                {{[$t("groups.expired"), $t("group.startUsing"), $t("groups.notEnabled"),
                $t('groups.offlineViolation'),$t('groups.moderated'),$t('groups.over')
                ]
                [scope.row.status]}}</div>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            align="center"
            :label="$t('crud.menu')"
            min-width="280"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="scope.row.status === 2"
                  class="default-btn text-btn"
                  @click="activeGroupActivity(scope.row.groupActivityId)"
                >{{$t('groups.startUsing')}}</div>

                <div class="default-btn text-btn"
                  v-if="isAuth('group:activity:update')"
                  @click="addOrUpdateHandle(scope.row.groupActivityId)">{{ scope.row.status === 5 || scope.row.status === 0 ? $t('live.view') : $t('groups.editEvent')}}</div>

                <!-- <div class="default-btn text-btn"
                  v-if="isAuth('group:activity:manage')"
                  @click="manageGroupProdHandle(scope.row.groupActivityId)">{{$t('groups.manageEventProducts')}}</div> -->
                <div @click="invalidActivityHandle(scope.row)"
                  v-if="scope.row.status === 1"
                  class="default-btn text-btn">
                    {{$t('groups.invalidActivity')}}
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('groups.failureTip')"
                        placement="right"
                      >
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                  </div>
                  <!-- :class="[!((scope.row.activityStatus === 1 && scope.row.status !== 1) || (scope.row.activityStatus >= 3 && scope.row.activityStatus <= 6))?'disabled-btn':'','default-btn text-btn']" -->
                <div
                  v-if="isAuth('group:activity:delete')"
                  :class="[!(scope.row.status !== 1)?'disabled-btn':'','default-btn text-btn']"
                    @click="deleteHandle(scope.row)"
                  >{{$t('text.delBtn')}}</div>
                  <div
                    class="default-btn text-btn"
                    v-if="isAuth('group:activity:auditApply') && scope.row.status > 2 && scope.row.status < 5"
                    @click="auditEventHandle(scope.row.groupActivityId)"
                  >
                    {{scope.row.status === 3?$t('groups.applyForListing'):$t('coupon.waitReview')}}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('groups.ifNotDealtWith')"
                      placement="right"
                    >
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </div>
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

    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange" @closeAddOrUpdate="closeAddOrUpdate"></add-or-update>
    <!-- 下线管理弹窗-->
    <offlineEventHandle
      v-if="offlineEventHandleVisible"
      selectUrl="/group/activity/getOfflineHandleEventByActivityId"
      applyUrl="/group/activity/auditApply"
      ref="offlineEvent"
      @refreshDataList="refreshChange"
    ></offlineEventHandle>
  </div>
</template>

<script>
import AddOrUpdate from './groupActivity-add-or-update'
import OfflineEventHandle from '@/components/offline-event-handle'

export default {
  name: 'groupActivity',
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
        activityName: '',
        status: '',
        prodName: ''
      },
      dataListLoading: false,
      offlineEventHandleVisible: false,
      addOrUpdateVisible: false,
      activeName: ''
    }
  },
  components: {
    AddOrUpdate,
    OfflineEventHandle
  },
  mounted () {
    this.handleClick({ name: '0' })
  },
  methods: {
    handleStatusChange (val) {
      this.activeName = val === '' ? '0' : (val > 0 ? val : val === 0 ? -1 : val) + ''
      this.getDataList()
    },
    handleClick (tab) {
      const searchObj = JSON.parse(JSON.stringify(this.searchForm))
      searchObj.status = tab.name === '0' ? '' : tab.name === '-1' ? '0' : tab.name
      this.getDataList(null, searchObj)
    },
    getDataList (page, searchForm, newData = false) {
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(searchForm || this.searchForm))
      }
      // eslint-disable-next-line no-unused-expressions
      searchForm ? this.theData.status = searchForm.status : null
      // console.log(searchForm)
      this.$http({
        url: this.$http.adornUrl('/group/activity/page'),
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
        let form = searchForm || this.searchForm
        if (form.status !== null) {
          this.searchForm.status = form.status === '' ? null : Number(form.status)
        }
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
      // this.$router.push({
      //   name: 'group-newGroupActivity',
      //   query: {
      //     groupActivityId: id
      //   }
      // })
    },
    deleteHandle (row) {
      if (!(row.status !== 1)) {
        return
      }
      let ids = row ? [row] : this.dataListSelections.map(item => {
        return item.groupActivityId
      })
      this.$confirm(this.$i18n.t('groups.confirmDelete') + row.activityName + this.$i18n.t('groups.active'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/group/activity/' + row.groupActivityId),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.page.total = this.page.total - ids.length
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refreshChange()
            }
          })
        })
      }).catch(() => {
      })
    },
    closeAddOrUpdate () {
      this.addOrUpdateVisible = false
    },
    /**
     * 刷新回调
     */
    refreshChange (isRouteToGroupProd, groupActivityId) {
      this.addOrUpdateVisible = false
      if (isRouteToGroupProd === 1) {
        this.$router.push({
          path: '/group-groupProd',
          query: { activityId: groupActivityId }
        })
      }
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    // 点击搜索
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.page.pageSize = 10
      if (this.searchForm.status !== null) {
        this.activeName = this.searchForm.status === '' ? '0' : this.searchForm.status === 0 ? '-1' : this.searchForm.status + ''
      }
      this.getDataList(this.page, null, newData)
    },
    clearSearch () {
      this.searchForm.activityName = ''
      this.searchForm.status = ''
      this.searchForm.prodName = ''
    },
    // 管理拼团活动商品
    manageGroupProdHandle (groupActivityId) {
      this.visible = false
      this.$router.push({
        path: '/group-groupProd',
        query: { activityId: groupActivityId }
      })
    },
    // 失效活动活动
    invalidActivityHandle (row) {
      // if (row.activityStatus !== 2 || row.groupProdStatus === 2) {
      //   return
      // }
      this.$confirm(this.$i18n.t('groups.determinedToFail') + row.activityName + this.$i18n.t('groups.actTip'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
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
      }).catch(() => {
      })
    },
    // 启用拼团活动
    activeGroupActivity (groupActivityId) {
      this.$http({
        url: this.$http.adornUrl('/group/activity/active/' + groupActivityId),
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
    },
    // 下线管理
    auditEventHandle (id) {
      this.offlineEventHandleVisible = true
      this.$nextTick(() => {
        this.$refs.offlineEvent.init(id)
      })
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
<style lang="scss">

</style>
