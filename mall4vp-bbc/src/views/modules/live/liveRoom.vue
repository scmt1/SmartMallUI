<template>
  <div class="mod-live-liveUser">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="name" :label="$t('liveRoom.roomName')+':'">
            <el-input v-model="searchForm.name" type="text" clearable  :placeholder="$t('liveRoom.roomName')"></el-input>
          </el-form-item>
          <el-form-item prop="anchorName" :label="$t('liveRoom.anchorNickname')+':'">
            <el-input v-model="searchForm.anchorName" type="text" clearable  :placeholder="$t('liveRoom.anchorNickname')"></el-input>
          </el-form-item>
          <el-form-item prop="liveStatus" :label="$t('liveRoom.liveRoomStatus')+':'">
            <el-select v-model="searchForm.liveStatus" clearable  :placeholder="$t('liveRoom.liveRoomStatus')">
              <el-option
                v-for="item in liveStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="roomTop" :label="$t('liveRoom.whetherToTop')+':'">
            <el-select v-model="searchForm.roomTop" clearable  :placeholder="$t('liveRoom.whetherToTop')">
              <el-option
                v-for="item in roomTops"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('liveRoom.liveBroadcastTime')+':'">
            <el-date-picker
              size="small"
              v-model="dateRange"
              type="datetimerange"
              range-separator="—"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="this.$i18n.t('date.start')"
              :end-placeholder="this.$i18n.t('date.end')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
            <div class="default-btn" @click="resetForm('searchForm')">{{ $t('product.reset') }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 搜索栏end -->
    <div class="main-container">
      <div class="tips">
        <span class="text"
        >{{
          $t("liveRoom.platformDeleteQuota")
        }}
        {{ totalNum }} {{ $t("distribution.bcTip4") }}</span>
      </div>
      <div class="table-con">
        <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            :label="$t('brand.serialNumber')"
            type="index"
            width="80"
          />
          <el-table-column
            prop="name"
            :label="$t('liveRoom.roomName')"
            width="200"
          >
            <template slot-scope="scope">
              <span class="table-cell-text">
                {{scope.row.name}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="anchorName"
            :label="$t('liveRoom.anchorNickname')"
            width="200"
          >
            <template slot-scope="scope">
              <span class="table-cell-text">
                {{scope.row.anchorName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="anchorWechat"
            :label="$t('liveRoom.anchorWechat')"
          />
          <el-table-column
            prop="liveStatus"
            :label="$t('liveRoom.liveRoomStatus')"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.liveStatus === 101"
              >{{$t('liveRoom.live')}}</span>
              <span v-if="scope.row.liveStatus === 102">{{$t('groups.hasNotStarted')}}</span>
              <span v-if="scope.row.liveStatus === 103">{{$t('groups.over')}}</span>
              <span v-if="scope.row.liveStatus === 104">{{$t('liveRoom.prohibitPlay')}}</span>
              <span v-if="scope.row.liveStatus === 105">{{$t('liveRoom.suspend')}}</span>
              <span v-if="scope.row.liveStatus === 106">{{$t('liveRoom.abnormal')}}</span>
              <span v-if="scope.row.liveStatus === 107">{{$t('liveRoom.expired')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="roomTop"
            :label="$t('liveRoom.whetherToTop')"
          >
            <template slot-scope="scope">
              <span>{{[$t('liveRoom.notPinned'),$t('liveRoom.pinned')][scope.row.roomTop]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="startTime"
            :label="$t('liveRoom.LiveStartTime')"
            width="160"
          />
          <el-table-column
            prop="endTime"
            :label="$t('liveRoom.LiveOverTime')"
            width="160"
          />
          <el-table-column
            prop="applyTime"
            :label="$t('order.applicationTime')"
            width="160"
          />
          <el-table-column
            :label="$t('crud.menu')"
            fixed="right"
            align="center"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  :class="{'disabled-btn':scope.row.liveStatus !== 101 && scope.row.liveStatus !== 102}"
                  v-if="scope.row.roomTop === 0"
                  @click="toTopHandle(scope.row)"
                >
                 {{$t('liveRoom.top')}}
                </div>
                <div
                 class="default-btn text-btn"
                 @click="toTopHandle(scope.row)"
                 v-if="scope.row.roomTop === 1"
                >
                 {{$t('liveRoom.cancelTopping')}}
                </div>
                <div
                  class="default-btn text-btn"
                  type="text"
                  icon="el-icon-delete"
                  size="small"
                  @click="deleteHandle(scope.row.id)"
                >{{$t('user.deleteBtn')}}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      </div>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './liveRoom-add-or-update'
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
      searchForm: {
        name: '',
        anchorName: '',
        liveStatus: '',
        roomTop: ''
      }, // 搜索
      // 时间区间
      dateRange: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      liveStatus: [
        {
          value: 101,
          label: this.$i18n.t('liveRoom.live')
        }, {
          value: 102,
          label: this.$i18n.t('groups.hasNotStarted')
        }, {
          value: 103,
          label: this.$i18n.t('groups.over')
        }, {
          value: 104,
          label: this.$i18n.t('liveRoom.prohibitPlay')
        }, {
          value: 105,
          label: this.$i18n.t('liveRoom.suspend')
        }, {
          value: 106,
          label: this.$i18n.t('liveRoom.abnormal')
        }, {
          value: 107,
          label: this.$i18n.t('liveRoom.expired')
        }
      ],
      roomTops: [
        {
          value: 1,
          label: this.$i18n.t('liveRoom.pinned')
        }, {
          value: 0,
          label: this.$i18n.t('liveRoom.notPinned')
        }
      ],
      totalNum: 0
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
  },
  mounted () {
    this.getDataList(this.page)
  },
  methods: {
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
      this.getAddProdNum()
      if (newData || !this.theData) {
        this.theparams = JSON.parse(JSON.stringify(this.searchForm))
        this.theData = {
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize,
          'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
          'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
        }
      } else {
        this.theData.current = page == null ? this.page.currentPage : page.currentPage
        this.theData.size = page == null ? this.page.pageSize : page.pageSize
      }
      this.$http({
        url: this.$http.adornUrl('/live/liveRoom/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(this.theData, this.theparams)
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
    // 获取剩余可删除得数量
    getAddProdNum () {
      this.$http({
        url: this.$http.adornUrl('/live/liveRoom/getRemoveRoomNum'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.shopNum = data.shopNum
        this.totalNum = data.totalNum
        this.deleteShopNum = data.deleteShopNum
        this.deleteTotalNum = data.deleteTotalNum
      })
    },
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('liveRoom.delUserTips') + ' ' + this.deleteTotalNum + this.$i18n.t('distribution.bcTip4') + ',' + this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/live/liveRoom/' + id),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.page.total = this.page.total - 1
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refreshChange()
            }
          })
        })
      }).catch(() => { })
    },
    toTopHandle (row) {
      if (row.liveStatus !== 101 && row.liveStatus !== 102) {
        return
      }
      var str = this.$i18n.t('liveRoom.top')
      if (row.roomTop) {
        str = this.$i18n.t('liveRoom.cancelTopping')
      }
      this.$confirm(this.$i18n.t('remindPop.makeSure') + ' ' + str + ' ' + this.$i18n.t('remindPop.operation') + '?', this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/live/liveRoom/toTop/' + row.id),
          method: 'put',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.succeeded'),
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
    refreshChange () {
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
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dateRange = []
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-live-liveUser {
  .tips .text {
    color: #FF0000;
  }
}
</style>
