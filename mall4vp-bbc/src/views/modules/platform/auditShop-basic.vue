<template>
  <div class="mod-seckill-shopAuditing">
    <div class="search-bar">
      <el-form :inline="true" ref="searchForm" :model="searchForm" size="small" :class="this.$i18n.t('language') === 'language' ? 'en-search-form': 'zh-search-form'">
        <div class="input-row">
          <el-form-item prop="shopName" :label="$t('prodList.shopName') + ':'">
            <el-input v-model="searchForm.shopName" size="small" :placeholder="$t('prodList.shopName')"></el-input>
          </el-form-item>
          <el-form-item prop="intro" :label="$t('shop.shopProfile') + ':'">
            <el-input v-model="searchForm.intro" size="small" :placeholder="$t('shop.shopProfile')"></el-input>
          </el-form-item>
          <!--(-1:已删除 0: 停业中 1:营业中 2:平台下线 3:上线待审核 4:开店申请中 5:开店申请待审核)-->
          <el-form-item prop="shopStatusList" :label="$t('shopProcess.shopStatus') + ':'">
            <el-select v-model="searchForm.shopStatusList" :placeholder="$t('shopProcess.shopStatus')">
              <el-option :label="$t('shop.inOperation')" :value="1"></el-option>
              <el-option :label="$t('shop.stop')" :value="0"></el-option>
              <el-option :label="$t('shop.offlineViolation')" :value="2"></el-option>
              <el-option :label="$t('shop.offlinePendingReview')" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="mobile" :label="$t('shop.contactTel') + ':'">
            <el-input v-model="searchForm.mobile" size="small" maxlength="11" :placeholder="$t('shop.contactTel')"></el-input>
          </el-form-item>
          <el-form-item prop="merchantMobile" :label="$t('shop.merchantMobile') + ':'">
            <el-input v-model="searchForm.merchantMobile" size="small" maxlength="11" :placeholder="$t('shop.merchantMobile')"></el-input>
          </el-form-item>
          <el-form-item prop="type" :label="$t('shop.shopType') + ':'">
            <el-select v-model="searchForm.type" :placeholder="$t('shop.shopType')">
              <el-option :label="$t('shop.generalStore')" :value="0"></el-option>
              <el-option :label="$t('shop.preferredStores')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('order.applicationTime') + ':'"
          >
            <!-- :label-width="this.$i18n.t('language') === 'language' ? '120px' : '80px'" -->
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              :range-separator="$t('date.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('product.search')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <el-checkbox v-model="selectAll" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox>
        <div
          class="default-btn primary-btn"
         @click="insertShop()">
          {{$t('crud.addTitle')}}
        </div>
        <div
          class="default-btn primary-btn"
          @click="exportShop()">
          {{$t('formData.export')}}
        </div>
        <div
          :class="[dataListSelections.length <= 0 ? 'disabled-btn' : '', 'default-btn']"
          @click.stop="shopTypeHandle()"
          v-if="isAuth('shop:shopAuditing:audit')"
        >{{$t('shop.shopType')}}
        </div>
      </div>
      <div class="table-con audit-shop-table">
        <div v-if="dataList.length === 0" class="empty-text">{{$t('user.noData')}}</div>
        <el-table
          ref="auditShop"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="shopName"
            :label="$t('prodList.shopName')"
            width="320">
            <template slot-scope="scope">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <img :src="scope.row.shopLogo" :alt="scope.row.prodName">
                </div>
                <span class="table-cell-text">{{ scope.row.shopName }}</span>
              </div>
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            prop="intro"-->
<!--            :label="$t('shop.shopProfile')"-->
<!--            width="280">-->
<!--            <template slot-scope="scope">-->
<!--              <span class="table-cell-text">{{ scope.row.intro }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            prop="shopStatusList"
            :label="$t('shopProcess.shopStatus')"
            width="100">
            <template slot-scope="scope">
              <span
                v-if="scope.row.shopStatus === -1"
                class="tag-text"
              >{{$t('shop.deleted')}}</span>
              <span v-else-if="scope.row.shopStatus === 0" class="tag-text">{{$t('shop.stop')}}</span>
              <span
                v-else-if="scope.row.shopStatus === 1"
                class="tag-text"
              >{{$t('shop.inOperation')}}</span>
              <span
                v-else-if="scope.row.shopStatus === 2"
                class="tag-text"
              >{{$t('shop.offlineViolation')}}</span>
              <span
                v-else-if="scope.row.shopStatus === 3 || scope.row.shopStatus === 5"
                class="tag-text"
              >{{$t('shop.offlinePendingReview')}}</span>
              <span
                v-else-if="scope.row.shopStatus === 4"
                class="tag-text"
              >{{$t('distributionMsg.applying')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            :label="$t('order.applicationTime')"
            width="170">
          </el-table-column>
          <el-table-column
            prop="mobile"
            :label="$t('shop.contactTel')"
            width="130">
          </el-table-column>
          <el-table-column
            prop="type"
            :label="$t('shop.shopType')"
            width="110">
            <template slot-scope="scope">
              <span class="tag-text">{{[$t('shop.generalStore'),$t('shop.preferredStores')][scope.row.type]}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="industryType"
              label="行业类型"
              width="120">
          </el-table-column>
          <el-table-column
              prop="isTicketScore"
              label="小票积分"
              width="110">
            <template slot-scope="scope">
              <el-switch :value="scope.row.isTicketScore"
                         active-color="#13ce66"
                         inactive-color="#ff4949"
                         :active-value="1"
                         :inactive-value="0"
                         @click.native="isTicketScoreChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column
                  prop="sort"
                  label="排序"
                  width="80">
          </el-table-column>

          <el-table-column
            align="center"
            fixed="right"
            :label="$t('publics.operating')"
            width="340"
            >
            <template slot-scope="scope">
              <div class="">
                <!-- 查看 -->
                <div
                  class="default-btn text-btn"
                  @click="auditHandle(scope.row.shopId, 0)"
                >{{$t('seckill.view')}}</div>
                <!-- 编辑 -->
                <div
                  class="default-btn text-btn"
                  @click="auditHandle(scope.row.shopId, 1)"
                >{{$t('coupon.edit')}}</div>
                <!-- 账号管理 -->
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('shop:shopAuditing:audit')"
                  @click="shopAccountHandle(scope.row.shopId)"
                >{{$t('shop.accountManagement')}}</div>
                <!-- 下线店铺 -->
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('shop:shopAuditing:lowerShelfShop') && scope.row.shopStatus <= 1"
                  @click="offlineHandle(scope.row)"
                >{{$t('shop.offlineShop')}}</div>
                <!-- 下线管理 -->
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('shop:shopAuditing:lowerShelfShop') && scope.row.shopStatus > 1"
                  @click="shopAuditHandle(scope.row.shopId)"
                >{{
                  scope.row.shopStatus === 2 ?
                  $t('distributionProdLog.offlineManagement')
                  : $t('product.pendingReview')
                }}</div>
                <!-- 小票 -->
                <div
                      class="default-btn text-btn"
                      @click="ticketManage(scope.row)"
                >小票管理</div>
              </div>
            </template>
          </el-table-column>

            <div slot="empty">
              &nbsp;
            </div>
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

    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    <!-- 商品审核弹窗 -->
    <!-- <ShopAudit
      v-if="shopAuditVisible"
      ref="shopAudit"
      selectUrl="/platform/shopDetail/getOfflineHandleEventByShopId"
      updateUrl="/platform/shopDetail/auditShop"
      @refreshDataList="refreshChange"
    ></ShopAudit> -->
     <!-- 下架管理 -->
    <offline-manage v-if="offlineDialogVisible" ref="offlineData" @refreshDataList="refreshChange" />
    <!-- 账号管理 -->
    <ShopAccount v-if="shopAccountVisible" ref="shopAccount" @refreshDataList="refreshChange"></ShopAccount>
    <!-- 导出店铺 -->
    <el-dialog
      :title="$t('shopProcess.exportShop')"
      :visible.sync="exportShopVisible"
    >
      <el-radio v-model="exportRadio" label="1">{{ $t('shopProcess.exportSearchShop') }}</el-radio>
      <el-radio v-model="exportRadio" label="2">{{ $t('shopProcess.exportSelectShop') }}</el-radio>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="exportShopVisible = false">{{ $t('coupon.cancel') }}</div>
        <div class="default-btn primary-btn" type="primary" @click="confirmExport">{{ $t('coupon.confirm') }}</div>
      </span>
    </el-dialog>
    <!-- 店铺类型 -->
    <ShopType v-if="shopTypeVisible" ref="shopType" @refreshDataList="refreshChange"></ShopType>
    <!-- 小票管理 -->
    <el-dialog
        title="小票配置"
        :visible.sync="ticketVisible"
        width="30%"
    >
      <el-form
          ref="ticketInfo"
          label-width="140px"
          :model="ticketInfo"
          :rules="ticketInfoRules"
          size="small"
      >
        <el-form-item label="是否开启小票积分" size="mini" prop="isTicketScore">
          <el-radio-group v-model="ticketInfo.isTicketScore">
            <el-radio :label="0">不开启</el-radio>
            <el-radio :label="1">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="积分方式" size="mini" prop="scoreMethod">
          <el-radio-group v-model="ticketInfo.scoreMethod">
            <el-radio :label="0">扫码</el-radio>
            <el-radio :label="1">OCR识别</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="小票兑换金额" prop="ticketRatio">
          <el-input v-model="ticketInfo.ticketRatio" type="number" :min="1">
              <template slot="append">元兑换1积分</template>
          </el-input>
        </el-form-item>
        <el-form-item label="小票图片" prop="ticketImg">
          <img-upload v-model="ticketInfo.ticketImg"></img-upload>
        </el-form-item>
        <el-form-item label="小票关键字段" prop="ticketField">
          <el-input v-model="ticketInfo.ticketField" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="ticketVisible = false">{{ $t('coupon.cancel') }}</div>
        <div class="default-btn primary-btn" type="primary" @click="confirmTicket">{{ $t('coupon.confirm') }}</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from './auditShop-add-or-update.vue'
import ImgUpload from '@/components/img-upload'
// import ShopAudit from '@/components/offline-audit'
// import ShopAudit from './shopOfflineHandle'
import offlineManage from './shopEdit/shop-offline-manage'
import ShopAccount from './shop-account.vue'
import ShopType from './shop-detail-update.vue'
export default {
  data () {
    return {
      ticketVisible:false,
      ticketInfo:{
        shopId:'',
        isTicketScore:0,
        scoreMethod:'',
        ticketImg:'',
        ticketField:'',
        ticketRatio:1
      },
      ticketInfoRules:{
        isTicketScore: [
          {required: true, message: "请选择是否开启小票积分", trigger: ["blur", "change"]}
        ],
        scoreMethod: [
          {required: true, message: "请选择是否开启小票积分", trigger: ["blur", "change"]}
        ],
        ticketImg: [
          {required: true, message: "请上传小票图片", trigger: ["blur"]}
        ],
        ticketField: [
          {required: true, message: "请填写小票关键字段", trigger: ["blur", "change"]}
        ],
        ticketRatio: [
          {required: true, message: "请填写小票兑换1积分金额", trigger: ["blur", "change"]}
        ]
      },
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        shopStatusList: undefined,
        shopName: undefined,
        intro: undefined,
        mobile: undefined,
        type: undefined,
        merchantMobile: undefined
      }, // 搜索
      dateRange: [],
      dataListSelections: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      shopAuditVisible: false,
      shopAccountVisible: false,
      shopTypeVisible: false,
      exportShopVisible: false,
      exportRadio: '1',
      isSubmit: false,
      selectAll: false,
      shopStatusShow: ['', this.$i18n.t('shop.inOperation'), this.$i18n.t('shop.offlineViolation')],

      offlineDialogVisible: false
    }
  },
  components: {
    AddOrUpdate,
    // ShopAudit,
    offlineManage,
    ShopAccount,
    ShopType,
    ImgUpload
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
      // 小票积分状态改变
      isTicketScoreChange (shopInfo) {
          if(!shopInfo.ticketField){
              this.$message.warning("请先配置小票信息")
              return
          }
          let isTicketScore = ''
          if(shopInfo.isTicketScore == 1){
              isTicketScore = 0
          }else{
              isTicketScore = 1
          }
          this.$http({
              url: this.$http.adornUrl('/platform/shopDetail/updateTicketInfo'),
              method: 'get',
              params: this.$http.adornParams({
                  shopId:shopInfo.shopId,
                  isTicketScore:isTicketScore
              })
          }).then(({data}) => {
              this.$message.success("操作成功")
              this.getDataList(this.page)
          })
      },
    //小票管理
    ticketManage(shopInfo){
      this.ticketInfo.shopId = shopInfo.shopId;
      this.ticketInfo.isTicketScore = shopInfo.isTicketScore;
      this.ticketInfo.ticketImg = shopInfo.ticketImg;
      this.ticketInfo.scoreMethod = shopInfo.scoreMethod;
      this.ticketInfo.ticketField = shopInfo.ticketField;
      this.ticketInfo.ticketRatio = shopInfo.ticketRatio;
      this.ticketVisible = true;
    },
    //小票确认管理
    confirmTicket(){
      this.$refs['ticketInfo'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/platform/shopDetail/updateTicketInfo'),
            method: 'get',
            params: this.$http.adornParams(this.ticketInfo)
          }).then(({ data }) => {
            this.ticketVisible = false
            this.$message.success("操作成功")
            this.getDataList()
          })
        }
      })
    },
    getDataList (page, newData = false) {
      page = page || this.page
      if (newData || !this.theData) {
        this.theData = {
          'current': page.currentPage,
          'size': page.pageSize,
          'beginTime': this.dateRange ? this.dateRange[0] : null, // 开始时间
          'endTime': this.dateRange ? this.dateRange[1] : null // 结束时间
        }
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.theParams.shopStatusList = (this.theParams.shopStatusList !== null && this.theParams.shopStatusList !== undefined) ? this.theParams.shopStatusList : [0, 1, 2, 3]
      } else {
        this.theData.current = page.currentPage
        this.theData.size = page.pageSize
      }

      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/shop/shopAuditing/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign(this.theData, this.theParams
        ))
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.page.currentPage = data.current
        this.dataListLoading = false

        // 末尾页数据为空重新请求
        if (!this.dataList.length && page.currentPage > 1) {
          this.page.currentPage = 1
          this.getDataList()
        }
      })
    },
    /**
     * 查看 / 审核
     * @param id 店铺id
     * @param type 0查看 1编辑
     */
    auditHandle (id, type) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id)
      // })
      if (type === 1) {
        this.$router.push({ path: '/platform-auditShop-edit', query: {shopId: id} })
      } else {
        this.$router.push({ path: '/platform-auditShop-detail', query: {shopId: id} })
      }
    },
    // 账号管理
    shopAccountHandle (id) {
      this.shopAccountVisible = true
      this.$nextTick(() => {
        this.$refs.shopAccount.init(id)
      })
    },
    // 账号管理
    shopTypeHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.shopId
      })
      if (!ids.length && !this.dataListSelections.length) {
        return
      }
      this.shopTypeVisible = true
      this.$nextTick(() => {
        this.$refs.shopType.init(ids)
      })
    },

    /**
     * 新增店铺
     */
    insertShop () {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init()
      // })
      this.$router.push({ path: '/platform-shopProcess/shopProcess' })
    },
    /**
     * 导出店铺
     */
    exportShop () {
      this.exportShopVisible = true
    },
    /**
     * 确定导出
     */
    confirmExport () {
      if (this.exportRadio !== '1' && this.exportRadio !== '2') {
        this.$message({
          message: this.$i18n.t('shop.exportRadioEmptyTips'),
          type: 'error',
          duration: 1500,
          onClose: () => {
            this.isSubmit = false
          }
        })
        return
      }
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      // 准备参数
      let params = {}
      if (this.exportRadio === '1') {
        // 导出模式为按搜索条件导出
        if (this.page.total === 0) {
          this.$message({
            message: this.$i18n.t('shop.exportShopSearchEmptyTips'),
            type: 'error',
            duration: 1500,
            onClose: () => {
              this.isSubmit = false
            }
          })
          return
        }
        // 赋值搜索参数
        params = JSON.parse(JSON.stringify(this.searchForm))
        params.shopStatusList = (params.shopStatusList !== null && params.shopStatusList !== undefined) ? params.shopStatusList : [0, 1, 2, 3]
        params.begintIME = this.dateRange ? this.dateRange[0] : null
        params.endTime = this.dateRange ? this.dateRange[1] : null
        params.shopIds = null
      } else {
        // 导出模式为按选中的店铺导出
        if (this.dataListSelections.length === 0) {
          this.$message({
            message: this.$i18n.t('shop.exportShopSelectEmptyTips'),
            type: 'error',
            duration: 1500,
            onClose: () => {
              this.isSubmit = false
            }
          })
          return
        }
        // 赋值选中的店铺id
        params.shopIds = this.dataListSelections.map(item => {
          return item.shopId
        })
      }
      const loading = this.$loading({
        lock: true,
        target: '.mod-seckill-shopAuditing',
        customClass: 'export-load',
        background: 'transparent',
        text: this.$i18n.t('shop.exportIng')
      })
      this.$http({
        url: this.$http.adornUrl('/platform/shopDetail/exportShop'),
        method: 'get',
        params: this.$http.adornParams(params),
        responseType: 'blob'
      }).then(({ data }) => {
        loading.close()
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.$i18n.t('shop.comInfoSorXls')
        const elink = document.createElement('a')
        if ('download' in elink) {
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
        this.$message({
          message: this.$i18n.t('shop.exportSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.isSubmit = false
            this.exportShopVisible = false
          }
        })
      }).catch((e) => {
        loading.close()
        this.isSubmit = false
      })
    },
    // 下架店铺
    offlineHandle (row) {
      // 确定对店铺[' + row.shopName + ']进行下线操作？如是，请填写下线理由
      var tips = this.$i18n.t('shop.shopTip1')
      tips = tips.replace('SHOPNAME', row.shopName)
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
          url: this.$http.adornUrl(`/platform/shopDetail/offline`),
          method: 'post',
          data: this.$http.adornData({
            handleId: row.shopId,
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
    // 多选变化
    handleSelectionChange (val) {
      this.dataListSelections = val
      this.selectAll = val.length === this.dataList.length
    },
    // 弹窗处理
    shopAuditHandle (id) {
      // this.shopAuditVisible = true
      // this.$nextTick(() => {
      //   this.$refs.shopAudit.init(id)
      // })
      this.getOfflineDetailByShopId(id)
    },

    /**
     * 获取最新店铺下线事件
     */
    getOfflineDetailByShopId (shopId) {
      // api.getEventsOfOfflineStores(shopId).then((data) => {
      //   this.offlineDetail = data
      //   this.$nextTick(() => {
      //     this.$refs.offlineData.init('offlineManage', data)
      //   })
      // })
      this.offlineDialogVisible = true
      this.$http({
        url: this.$http.adornUrl(`/platform/shopDetail/getOfflineHandleEventByShopId/${shopId}`),
        method: 'GET'
      }).then(({ data }) => {
        this.offlineDetail = data
        this.$nextTick(() => {
          this.$refs.offlineData.init(data)
        })
      })
    },

    /**
     * 全选按钮
     */
    handleSelectAll () {
      if (this.$refs.auditShop.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.$refs.auditShop.toggleAllSelection()
    },
    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.searchReset()
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
.mod-seckill-shopAuditing {
  .search-bar {
    // .en-search-form {
    //   & ::v-deep .el-form-item__label {
    //     width: 120px;
    //   }
    // }
    // .zh-search-form {
    //   & ::v-deep .el-form-item__label {
    //     width: 90px;
    //   }
    // }
  }
}

.table-con {
  position: relative;
}

 .empty-text {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: 50%;
  color: #909399;
 }
  ::v-deep .export-load {
    top: -50% !important;
  }
</style>

<style scoped>
>>>.el-table__fixed-right::before {
  z-index: 0;
}
</style>
