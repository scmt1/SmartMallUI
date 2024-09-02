<template>
  <div class="mod-live-liveRoom">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="name" :label="$t('live.liveName')+':'" class="search-form-item">
            <el-input size="small" type="text" v-model="searchForm.name" :placeholder="$t('live.liveName')"></el-input>
          </el-form-item>
          <el-form-item prop="anchorName" :label="$t('live.anchorName')+':'" class="search-form-item">
            <el-input size="small" type="text" v-model="searchForm.anchorName" :placeholder="$t('live.anchorName')"></el-input>
          </el-form-item>
          <el-form-item prop="roomTop" :label="$t('product.isTop')+':'" class="search-form-item">
            <el-select v-model="searchForm.roomTop" :placeholder="$t('product.isTop')">
              <el-option :label="$t('live.notPinned')" :value="0"></el-option>
              <el-option :label="$t('live.pinned')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="liveStatus" :label="$t('live.liveStatus')+':'" class="search-form-item">
            <el-select v-model="searchForm.liveStatus" :placeholder="$t('live.liveStatus')">
              <el-option :label="$t('live.liveing')" :value="101"></el-option>
              <el-option :label="$t('live.noStart')" :value="102"></el-option>
              <el-option :label="$t('live.over')" :value="103"></el-option>
              <el-option :label="$t('live.banned')" :value="104"></el-option>
              <el-option :label="$t('live.pause')" :value="105"></el-option>
              <el-option :label="$t('live.abnormal')" :value="106"></el-option>
              <el-option :label="$t('live.expired')" :value="107"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('live.startTime')+':'">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              :range-separator="this.$i18n.t('time.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="this.$i18n.t('time.start')"
              :end-placeholder="this.$i18n.t('time.end')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('shop.resetMap')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div
          class="default-btn primary-btn"
           v-if="isAuth('live:liveRoom:save')"
          @click="addOrUpdateHandle()"
          >{{ $t("crud.addTitle") }}
        </div>
        <span class="live-tips"
          >（{{ $t("live.numLiveBroRoom") }}：<span class="stress">{{ shopNum
          }}</span>{{ $t("live.times") }}，{{ $t("live.subPlatRemLimi") }}<span class="stress">{{ totalNum
          }}</span>{{ $t("live.times") }}）</span
        >
      </div>
       <div class="table-con live-room-table">
        <el-table
          ref="liveRoomTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
          >
          <el-table-column
            align="left"
            prop="name"
            :label="$t('live.liveName')"
            min-width="260">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="anchorName"
            :label="$t('live.anchorName')"
            min-width="200">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.anchorName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="anchorWechat"
            :label="$t('live.anchorWechat')"
            min-width="180"
            >
          </el-table-column>
          <el-table-column
            align="left"
            prop="roomTop"
            :label="$t('product.isTop')"
            min-width="100"
            >
            <template slot-scope="scope">
              <span class="tag-text" v-if="scope.row.roomTop === 0">{{
                $t("live.notPinned")
              }}</span>
              <span class="tag-text"
                v-else-if="scope.row.roomTop === 1"
                type="success"
                >{{ $t("live.pinned") }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="liveStatus"
            :label="$t('live.liveStatus')"
            min-width="120">
            <template slot-scope="scope">
              <span
                v-if="scope.row.liveStatus === 101"
                class="tag-text"
                >{{ $t("live.liveing") }}</span
              >
              <span v-if="scope.row.liveStatus === 102" class="tag-text">{{
                $t("live.noStart")
              }}</span>
              <span v-if="scope.row.liveStatus === 103" class="tag-text">{{
                $t("live.over")
              }}</span>
              <span v-if="scope.row.liveStatus === 104" class="tag-text">{{
                $t("live.banned")
              }}</span>
              <span v-if="scope.row.liveStatus === 105" class="tag-text">{{
                $t("live.pause")
              }}</span>
              <span v-if="scope.row.liveStatus === 106" class="tag-text">{{
                $t("live.abnormal")
              }}</span>
              <span v-if="scope.row.liveStatus === 107" class="tag-text">{{
                $t("live.expired")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="startTime"
            :label="$t('live.liveStartTime')"
            min-width="160">
          </el-table-column>
          <el-table-column
            align="left"
            prop="endTime"
            :label="$t('live.liveEndTime')"
            min-width="160">
          </el-table-column>
          <el-table-column
            align="left"
            prop="applyTime"
            :label="$t('live.applyTime')"
            min-width="170">
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            min-width="230"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('live:liveRoom:see') && scope.row.roomToolsVo.closeGoods == 0"
                  @click="seeProd(scope.row)"
                  >{{ $t("live.viewProduct") }}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('live:liveRoom:info')"
                  @click="addOrUpdateHandle(scope.row)"
                  >{{ $t("live.viewLRoomInfo") }}
                </div>
                <div
                  v-if="scope.row.liveStatus !== 101 && scope.row.liveStatus !== 106"
                  class="default-btn text-btn"
                  type="text"
                  icon="el-icon-delete"
                  size="small"
                  @click="deleteHandle(scope.row.id)"
                >{{$t('resource.Delete')}}</div>
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
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>
    <play-back
      v-if="playBackVisible"
      ref="playBack"
      @refreshDataList="refreshChange"
    ></play-back>
    <!-- <import-prod v-if="importProdVisible" ref="importProd" @refreshDataList="refreshChange"></import-prod> -->
    <!-- <room-prod v-if="liveRoomVisible" ref="roomProd" @refreshDataList="refreshChange"></room-prod> -->
  </div>
</template>

<script>
import AddOrUpdate from './liveRoom-add-or-update'
import importProd from './liveRoom-import-prod'
import playBack from './liveRoom-play-back'

// import roomProd from './live-room-prod'
export default {
  name: 'live-room/liveRoom',
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件

      dataList: [],
      prods: [],
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
      dataListLoading: false,
      totalNum: 0,
      shopNum: 0,
      dateRange: [],
      addOrUpdateVisible: false,
      seeProdVisible: false,
      playBackVisible: false,
      importProdVisible: false,
      liveRoomVisible: false
    }
  },
  components: {
    AddOrUpdate,
    importProd,
    playBack
    // roomProd,
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  activated () {
    if (!this.dataListLoading) {
      this.getDataList()
    }
  },
  methods: {
    getDataList (page, newData = false) {
      this.getAddRoomNum()
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
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
        url: this.$http.adornUrl('/multishop/live/liveRoom/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize,
              'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
              'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
            },
             this.theParams
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 获取剩余可新增得数量
    getAddRoomNum () {
      this.$http({
        url: this.$http.adornUrl('/multishop/live/liveRoom/getAddRoomNum'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.shopNum = data.shopNum
        this.totalNum = data.totalNum
        this.deleteShopNum = data.deleteShopNum
        this.deleteTotalNum = data.deleteTotalNum
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (data) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id)
      // })
      this.$router.push({
        path: '/live-room/newLiveRoom'
      })
      sessionStorage.setItem('liveRoomData', JSON.stringify(data))
    },
    // 查看直播回放
    seePlayBack (id) {
      this.playBackVisible = true
      this.$nextTick(() => {
        this.$refs.playBack.init(id)
      })
    },
    // 导入商品
    importProd (id) {
      this.importProdVisible = true
      this.$nextTick(() => {
        this.$refs.importProd.init(id)
      })
    },
    // 新增 / 修改
    seeProd (room) {
      this.$router.push({
        path: '/live-room/roomProds',
        query: { id: room.id, status: room.liveStatus }
      })
    },
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('live.delUserTips') + ' ' + this.deleteShopNum + this.$i18n.t('live.times') + ',' + this.$i18n.t('admin.isDeleOper'), this.$i18n.t('resource.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/multishop/live/liveRoom/' + id),
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
    // 清空自定义数据
    searchReset () {
      this.dateRange = []
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.searchReset()
      this.prodName = ''
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
<style lang="scss" scoped>
.mod-live-liveRoom {
  .main-container {
    .operation-bar {
      .live-tips {
        .stress {
          color: #ff4141;
        }
      }
    }
  }
}
</style>
