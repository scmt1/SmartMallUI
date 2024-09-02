<template>
  <div class="mod-service-notifyTemplate">
    <div class="screening-conditions">
      <!-- <el-divider direction="vertical" class="lineColor"></el-divider> -->
      <i class="el-icon-s-order"></i>
      <span style="fontsize: 20px">{{ $t("admin.mallTranRem") }}</span>
    </div>
    <el-row :gutter="50" style="margin-left: 20px">
      <el-col :span="6" v-for="(msgTemplate, index) in dataList" :key="index">
        <div style="padding: 14px">
          <el-card :body-style="{ padding: '0px' }">
            <!-- <img
              src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
              class="image"
            />-->
            <div style="padding: 16px; line-height: 40px">
              <span style="font-size: 15px; font-weight: bold">{{
                typeMap.get(msgTemplate.sendType)
              }}</span>
              <span
                style="
                  font-size: 15px;
                  color: #ffffff;
                  border-color: #155bd4;
                  background-color: #155bd4;
                  border: 5px solid transparent;
                "
                v-if="msgTemplate.sendType > 100"
                >{{ $t("admin.sendMer") }}</span
              >
              <br />
              <span style="font-size: 15px; color: #808080">{{
                msgTemplate.smsDesc
              }}</span>
              <!-- <hr style="background-color:#808080;border:none;height: 1px;" /> -->
              <el-divider class="line"></el-divider>
              <span style="font-size: 15px; color: #808080"
                >{{ $t("admin.notifyType") }}：</span
              >
              <br />
              <div v-if="msgTemplate.sms">
                <i
                  class="el-icon-check"
                  style="margin-left: 10px"
                  v-if="msgTemplate.shopSms"
                ></i>
                <i class="el-icon-close" style="margin-left: 10px" v-else></i>
                <span
                  style="font-size: 15px"
                  v-if="msgTemplate.sendType !== 2"
                  >{{ $t("admin.msgNotify") }}</span
                >
                <span style="font-size: 15px" v-else>{{
                  $t("admin.msgNotifyFree")
                }}</span>
                <span
                  style="
                    font-size: 15px;
                    color: #ffffff;
                    border-color: #2da641;
                    background-color: #2da641;
                    border: 5px solid transparent;
                  "
                  v-if="msgTemplate.sendType === 2"
                  >{{ $t("admin.free") }}</span
                >
              </div>
              <div v-if="msgTemplate.sub && msgTemplate.sendType < 100">
                <i
                  class="el-icon-check"
                  style="margin-left: 10px"
                  v-if="msgTemplate.shopSub"
                ></i>
                <i class="el-icon-close" style="margin-left: 10px" v-else></i>
                <span style="font-size: 15px">{{
                  $t("admin.publicNotify")
                }}</span>
              </div>
              <div v-if="msgTemplate.app && msgTemplate.sendType < 100">
                <i
                  class="el-icon-check"
                  style="margin-left: 10px"
                  v-if="msgTemplate.shopApp"
                ></i>
                <i class="el-icon-close" style="margin-left: 10px" v-else></i>
                <span style="font-size: 15px">{{
                  $t("admin.appletMessage")
                }}</span>
              </div>
              <div class="bottom clearfix">
                <div
                  class="default-btn text-btn button"
                  @click="addOrUpdateHandle(msgTemplate.templateId)"
                  >{{ $t("crud.updateBtn") }}</div
                >
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>
  </div>
</template>
<script>
import AddOrUpdate from './msg-add-or-update'

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
      typeMap: new Map([
        [1, this.$i18n.t('admin.orderPay')],
        [2, this.$i18n.t('admin.paySuccNotify')],
        [3, this.$i18n.t('admin.merAgreeReturn')],
        [4, this.$i18n.t('admin.merRefuseRefund')],
        [5, this.$i18n.t('admin.wriOffRem')],
        [6, this.$i18n.t('admin.shipRem')],
        [7, this.$i18n.t('admin.groupFailRem')],
        [8, this.$i18n.t('admin.groupSuccRem')],
        [9, this.$i18n.t('admin.startGroupRem')],
        [10, this.$i18n.t('admin.memUpRem')],
        [11, this.$i18n.t('admin.timeoutRem')],
        [102, this.$i18n.t('admin.confirmReceRem')],
        [103, this.$i18n.t('admin.buyerRefundRem')],
        [104, this.$i18n.t('admin.buyerReturnRem')]
      ]),
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
        url: this.$http.adornUrl('/multishop/notifyTemplate/getList'),
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
        this.dataList = data
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      console.log('ggg')
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    deleteHandle (row) {
      this.$confirm(`${this.$i18n.t('admin.isDeleOper')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/msgTemplate/' + row.msgTemplateId),
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
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange (params) {
      this.searchForm = params
      this.getDataList(this.page)
    }
  }
}
</script>
<style lang="scss" scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding-left: 15px;
  float: right;
}
.screening-conditions {
  display: block;
  padding: 20px;
  font-size: 20px;
  background: #f8f8f9;
  margin-bottom: 20px;
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

.el-col-6:nth-of-type(4) {
  margin-bottom: 80px !important;
}

// @media screen and (max-width: 1620px) {
//   .el-col-6:nth-of-type(4) {
//     margin-bottom: 40px !important;
//   }
// }
</style>
