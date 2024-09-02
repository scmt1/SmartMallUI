<template>
  <div class="mod-admin-groupTeam">
    <!-- 新版规范 -->
    <div class="group-list-mod">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" class="search-form" ref="test-form" :model="searchForm" label-width="auto" size="small">
          <div class="input-row">
            <el-form-item :label="$t('groups.eventName') + ':'" class="search-form-item">
              <el-input v-model="searchForm.activityName" :placeholder="$t('groups.eventName')"></el-input>
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
        <div class="table-con group-team">
          <el-table :data="dataList" header-cell-class-name="table-header" row-class-name="table-row-low" style="width: 100%">
            <el-table-column align="left" type="index" :label="$t('formData.serialNumber')" width="85"></el-table-column>
              <el-table-column prop="activityName" :label="$t('groups.eventName')" width="300">
              <template slot-scope="scope">
                <div>
                  <span class="table-cell-text">{{ scope.row.activityName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="startTime" :label="$t('group.groupTime')">
              <template slot-scope="scope">
                <div>
                  <span class="table-cell-text">{{ scope.row.startTime ? scope.row.startTime : $t('group.notOpenGroup') }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="groupNumber" :label="$t('groups.numberOfParticipants')" sortable>
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.joinNum }}/{{ scope.row.groupNumber }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" :label="$t('group.totalOrderAmount')" sortable>
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.totalPrice }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="status" :label="$t('order.status')" width="100px">
              <template slot-scope="scope">
                <div class="tag-text">
                  {{[$t("group.waitGroupUnpay"),
                      $t("group.inAGroup"),
                      $t("group.succ"),
                      $t("group.failGroup"),
                    ][scope.row.status] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('order.operation')">
              <template slot-scope="scope">
                <div class="default-btn text-btn marginLe" v-if="isAuth('group:team:info')"
                  @click="viewGroupTeamInfo(scope.row.groupTeamId)">{{ $t("groups.viewGroupOrders") }}</div>
                <div class="default-btn text-btn marginLBtn"
                     @click="viewGroupActivityInfo(scope.row.groupActivityId)">{{ $t("groups.viewGroupActivityInfo") }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <el-pagination
          style="margin-top:20px"
          v-if="dataList.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"></el-pagination>
      </div>
      <!-- 表格主体end -->
    </div>
    <group-team-info v-if="groupTeamInfoVisible" ref="groupTeamInfo"></group-team-info>
    <group-activity-info v-if="groupActivityInfoVisible" ref="groupActivityInfo"></group-activity-info>
  </div>
</template>

<script>
import GroupTeamInfo from './groupTeam-info'
import GroupActivityInfo from './groupActivityInfo'
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
      searchForm: {},
      dataListLoading: false,
      groupTeamInfoVisible: false,
      groupActivityInfoVisible: false
    }
  },
  components: {
    GroupTeamInfo,
    GroupActivityInfo
  },
  created () { this.getDataList() },
  mounted () {},
  methods: {
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/group/team/page'),
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
    /**
     * 刷新回调
     */
    refreshChange () {
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    // 查看同团订单
    viewGroupTeamInfo (id) {
      this.groupTeamInfoVisible = true
      this.$nextTick(() => {
        this.$refs.groupTeamInfo.init(id)
      })
    },
    // 查看活动详情
    viewGroupActivityInfo (id) {
      this.groupActivityInfoVisible = true
      this.$nextTick(() => {
        this.$refs.groupActivityInfo.init(id)
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
    },

    searchChange (newData = false) {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getDataList(this.page, newData)
    },
    clearSearch () {
      this.searchForm.activityName = null
      this.searchForm.status = null
    }
  }
}
</script>
<style lang="scss" scope>
@media (max-width: 1440px) {
  .marginLe {
    margin-left: -5px;
  }
  .marginLBtn {
    margin-left: 0 !important;
  }
}
</style>
