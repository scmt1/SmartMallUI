<template>
  <div class="mod-service-notifyTemplate">
    <el-row align="left">
      <div
        class="default-btn primary-btn"
        v-if="isAuth('platform:smsPackage:save')"
        @click="addOrUpdateHandle()"
      >{{$t('crud.addTitle')}}</div>
    </el-row>
    <el-row>
      <el-col :span="7" v-for="(smsPackage, index) in dataList" :key="index">
        <div style="padding: 14px;">
          <el-card :body-style="{ padding: '0px'}">
            <!-- <img
              src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
              class="image"
            />-->
            <div style="padding: 16px;line-height:40px;min-height:360px;" class="text">
              <span style="font-size:20px;font-weight:bold">{{smsPackage.packageName}}</span>
              <br />
              <span style="font-size:15px;color:#808080">{{smsPackage.smsDesc}}</span>
              <!-- <hr style="background-color:#808080;border:none;height: 1px;" /> -->
              <el-divider class="line"></el-divider>
              <span style="font-size:15px;color:#808080">{{$t('platform.proFeat')}}：</span>
              <br />
              <i class="el-icon-finished"></i>
              <span style="font-size:15px;">{{smsPackage.propertyOne}}</span>
              <br />
              <i class="el-icon-finished"></i>
              <span style="font-size:15px;">{{smsPackage.propertyTwo}}</span>
              <br />
              <span
                style="font-size:15px;color:#808080;  padding-top: 33px;"
              >{{$t('platform.eveMsm')}}{{Number.parseFloat(smsPackage.amount / smsPackage.smsNum).toFixed(3)}}</span>
              <br />
              <span
                style="font-size: 22px;color: #ff8a00;padding-bottom: 13.5px;"
              >¥{{smsPackage.amount}}/ {{smsPackage.smsNum}}{{$t('platform.amoAndMon')}}</span>
            </div>
            <div class="bottom clearfix">
                <!-- <time class="time">{{ currentDate }}</time> -->
                <div
                  class="default-btn text-btn button"
                  v-if="isAuth('platform:smsPackage:delete')"
                  @click="deleteHandle(smsPackage)"
                >{{$t('crud.delBtn')}}</div>
                <div
                  class="default-btn text-btn button"
                  v-if="isAuth('platform:smsPackage:update')"
                  @click="addOrUpdateHandle(smsPackage.smsPackageId)"
                >{{$t('crud.updateBtn')}}</div>
              </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>
<script>
import AddOrUpdate from './smsPackage-add-or-update'
export default {

  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      currentDate: new Date(),
      searchForm: {}, // 搜索
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    // this.getDataList()
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/smsPackage/page'),
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
        console.log(data)
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
    deleteHandle (row) {
      this.$confirm(this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/smsPackage/' + row.smsPackageId),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.refreshChange()
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500
          })
        })
      }).catch(() => { })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.page = this.page
      this.getDataList(this.page)
    },
    searchChange (params) {
      this.searchForm = params
      this.getDataList(this.page)
    }
  }
}
</script>
<style lang="scss">
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  padding: 0 24px 24px 0;
}

.clearfix{
  .button {
    padding-left: 15px;
    float: right;
  }
}

.image {
  width: 100%;
  display: block;
}
.line {
  margin-top: 15px;
  margin-bottom: 15px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
