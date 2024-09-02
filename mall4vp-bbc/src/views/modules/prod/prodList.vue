<template>
  <div class="mod-prod prod-list-mod">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="shopName" :label="$t('prodList.shopName') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.shopName" :placeholder="$t('prodList.shopName')"></el-input>
          </el-form-item>
          <el-form-item prop="keyword" :label="$t('product.prodName') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.keyword" :placeholder="$t('product.prodName')"></el-input>
          </el-form-item>
          <!-- <el-form-item prop="isCompose" :label="$t('product.comProd') + ':'">
            <el-select v-model="searchForm.isCompose" :placeholder="$t('product.comProd')">
              <el-option :label="$t('publics.no')" :value="0"></el-option>
              <el-option :label="$t('publics.yes')" :value="1"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item prop="isCompose" :label="$t('product.prodMold') + ':'">
            <el-select v-model="searchForm.mold" :placeholder="$t('product.prodMold')">
              <el-option :label="$t('product.physicalGoods')" :value="0"></el-option>
              <el-option :label="$t('product.virtualGoods')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="isCompose" :label="$t('product.prodType')+ ':'">
            <el-select v-model="searchForm.prodType" :placeholder="$t('product.prodType')">
              <el-option :label="$t('product.ordProd')" :value="0"></el-option>
              <el-option :label="$t('product.groupProd')" :value="1"></el-option>
              <el-option :label="$t('product.limitedTimeProd')" :value="2"></el-option>
              <el-option :label="$t('product.activeProd')" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="status" :label="$t('product.status') + ':'" class="search-form-item">
            <el-select v-model="searchForm.status" :placeholder="$t('product.status')">
              <el-option :label="$t('publics.LowerShelf')" :value="0"></el-option>
              <el-option :label="$t('publics.UpperShelf')" :value="1"></el-option>
              <el-option :label="$t('product.violation')" :value="2"></el-option>
              <el-option :label="$t('product.violationPendingReview')" :value="3"></el-option>
              <el-option :label="$t('product.pendingReview')" :value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="deliveryMode" :label="$t('product.delType') + ':'" class="search-form-item">
            <el-select v-model="searchForm.deliveryMode" :placeholder="$t('product.delType')">
              <el-option :label="$t('product.userPickUp')" :value="2"></el-option>
              <el-option :label="$t('product.ExpressDistribution')" :value="1"></el-option>
              <el-option :label="$t('product.sameCityDelivery')" :value="4"></el-option>
              <el-option :label="$t('order.noNeedRequired')" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="category" :label="$t('product.category') + ':'" class="search-form-item">
            <el-select v-model="searchForm.categoryId" :placeholder="$t('product.category')">
              <el-option v-for="(item,index) in categoryList" :key="index" :label="item.categoryName" :value="item.categoryId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="isTop" :label="$t('product.isTop') + ':'" class="search-form-item">
            <el-select v-model="isTop" :placeholder="$t('product.isTop')">
              <el-option :label="$t('publics.no')" :value="0"></el-option>
              <el-option :label="$t('publics.yes')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('product.search')}}</div>
            <div class="default-btn" @click="resetSearchForm()">{{$t('product.reset')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="export-btn">
      <el-button type="primary" size="small" v-if="isAuth('prod:prod:exportProd')" @click="exportFrom()">{{$t('order.export')}}</el-button>
    </div>
    <div class="main-container">
      <div ref="closepopover" class="table-con prod-table">
        <el-table
          ref="prodListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          @selection-change="selectionChange"
          @sort-change="changeTableSort"
          @cell-mouse-enter="enterTableRow"
          @cell-mouse-leave="leaveTableRow">
          <el-table-column
            type="selection"
            prop="prodId"
            width="55" />
          <el-table-column
            fixed
            prop="shopName"
            :label="$t('prodList.shopName')"
            width="auto">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.shopName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="prodName"
            :label="$t('group.prodInfo')"
            width="320">
            <template slot-scope="scope">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <img v-if="scope.row.pic" :src="scope.row.pic" @error="handlePicError" :alt="scope.row.prodName">
                  <img v-else src="~@/assets/img/def.png" :alt="scope.row.prodName">
                </div>
                <span class="table-cell-text">{{ scope.row.prodName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="oriPrice"
            :label="$t('prodList.marketValue')"
            width="100">
          </el-table-column>
          <el-table-column
            prop="price"
            :label="$t('prodList.salesPrice')"
            width="100">
          </el-table-column>
          <el-table-column
            :label="$t('product.waterSoldNum')"
            width="auto">
             <template slot-scope="scope">
               <div class="water-sold-con">
                 <span slot="reference">{{ scope.row.waterSoldNum }}</span>
                 <el-popover
                   placement="bottom"
                   trigger="click"
                   style="width: 150px !important;"
                   @show="showWaterSoldNum(scope.row.waterSoldNum)"
                   @after-enter="getCurrentSpuId(scope.row.prodId, 'waterSoldNum')"
                   @hide="initProdInf()"
                 >
                   <div class="popover-box">
                     <div>
                       <el-input-number
                         :value="waterSoldNum"
                         type="number"
                         size="small"
                         onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
                         @change="(currentValue, oldValue) => {changeWaterSoldNum(currentValue, oldValue)}"
                         class="sales-volume"
                         :min="0"
                         :max="1000000000"
                       />
                     </div>
                     <div class="popover-bottom">
                       <el-button size="mini" @click="closePopover()">取消</el-button>
                       <el-button size="mini" type="primary" @click="handleChange(scope.row.prodId)">保存</el-button>
                     </div>
                   </div>
                   <i v-show="scope.row.prodId===currentMoveProdId || (scope.row.prodId===currentClickProdId && currentShowPopover==='waterSoldNum')" slot="reference" class="el-icon-edit" />
                 </el-popover>
               </div>
            </template>
          </el-table-column>
           <el-table-column
            prop="totalStocks"
            :label="$t('product.availableInventory')"
            width="120">
          </el-table-column>
          <el-table-column
            prop="prodType"
            :label="$t('product.prodType')"
            width="120">
            <template slot-scope="scope">
              <!-- 商品类型(0普通商品 1拼团 2秒杀 3积分 5活动商品) -->
              <div class="tag-text">{{[$t('product.ordProd'),$t('product.groupProd'),$t('product.limitedTimeProd'),$t('goods.points'),'', $t('product.activeProd')][scope.row.prodType]}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="mold"
            :label="$t('product.prodMold')"
            width="120">
            <template slot-scope="scope">
              <!-- 商品类型(0普通商品 1拼团 2秒杀 3积分 5活动商品) -->
              <div class="tag-text">{{ scope.row.mold === 0 ? $t('product.physicalGoods') : $t('product.virtualGoods')}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            :label="$t('product.status')"
            width="auto">
            <!-- 0:商家下架 1:正常 2:平台下架 3:违规下架待平台审核 4:审核失败 6:待审核 -1表示删除 -->
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1" class="tag-text">{{ $t("prodList.onShelf") }}</span>
              <span v-else-if="scope.row.status === 0" class="tag-text">{{ $t("prodList.offShelf") }}</span>
              <span v-else-if="scope.row.status === 2" class="tag-text">{{ $t("product.violation") }}</span>
              <span v-else-if="scope.row.status === 3" class="tag-text">{{ $t("product.violationPendingReview") }}</span>
              <span v-else-if="scope.row.status === 4" class="tag-text">{{ $t("prodList.refusePass") }}</span>
              <span v-else-if="scope.row.status === 6" class="tag-text">{{ $t("product.pendingReview") }}</span>
              <span v-else class="tag-text">{{ $t("prodList.other") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="deliveryMode"
            align="center"
            :label="$t('product.delType')"
            width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.mold === 1">{{$t('order.noNeedRequired')}}</div>
              <div v-else-if="scope.row.prodType === 5">-</div>
              <div v-else>{{scope.row.deliveryMode | DeliveryMode}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="isTop"
            :label="$t('publics.isTop')"
            width="auto">
            <template slot-scope="scope">
              <span v-if="scope.row.isTop === 0" class="tag-text">{{$t('publics.no')}}</span>
              <span
                v-else-if="scope.row.isTop === 1"
                class="tag-text"
              >{{$t('publics.yes')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="seq"
            :label="$t('product.seq')"
            width="100"
            sortable="custom"
            >
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="280"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:prod:update')"
                  @click="showProdInfo(scope.row.prodId)"
                  >{{ $t("prodList.lookOver") }}</div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:prod:update') && scope.row.status > 1 && scope.row.status !== 6"
                  @click="auditProdHandle(scope.row)"
                  >{{ scope.row.status === 2 ? $t("prodList.offShelfManage") : $t("product.violationPendingReview") }}</div>
                <div
                  class="default-btn text-btn"
                  v-if="scope.row.status === 6"
                  @click="prodAuditHandle(scope.row)"
                >{{ $t("product.pendingReview")}}</div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:prod:update') && scope.row.status < 2"
                  @click="offlineProdHandle(scope.row)">
                  {{ $t("product.violation") }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    placement="right"
                    :content="$t('prodList.content')">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:prod:delete')"
                  @click="deleteHandle(scope.row.prodId)">{{ $t("remindPop.delete") }}</div>
                <div
                  class="default-btn text-btn"
                  v-if="scope.row.status === 1"
                  @click="toTopHandle(scope.row)"
              >{{scope.row.isTop === 1 ? $t('liveRoom.cancelTopping'):$t('publics.isTop')}}</div>
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
    <!-- 商品审核弹窗 -->
    <!-- <ProdAudit v-if="ProdAuditVisible"
               ref="ProdAudit"
    @refreshDataList="refreshChange"></ProdAudit>-->

    <!-- 商品审核弹窗 -->
    <ProdOfflineAudit
      v-if="ProdOfflineAuditVisible"
      ref="ProdOfflineAudit"
      selectUrl="/prod/prod/getOfflineHandleEventByProdId"
      updateUrl="/prod/prod/prodOfflineAudit"
      @refreshDataList="refreshChange"
    ></ProdOfflineAudit>
    <AuditProd
      v-if="prodAuditVisible"
      ref="AuditProd"
      updateUrl="/prod/prod/auditProd"
      @refreshDataList="refreshChange">
    </AuditProd>
    <!-- 商品详情弹窗 -->
    <el-dialog
      :title="this.$i18n.t('prodList.detailsTitle')"
      :visible.sync="showProdInfoDialog"
      width="70%"
      class="prod-detail-dialog"
    >
      <div class="prod-row">
        <span class="row-title">{{ $t("product.platformClassification") + ':' }}</span>
        <span class="row-txt">
          <span v-for="(itemCategory, indexCategory) in prodInfoCategory" :key="indexCategory">{{itemCategory + (indexCategory < (prodInfoCategory.length - 1) ? ' > ' : '')}}</span>
        </span>
      </div>
      <div class="prod-row">
        <span class="row-title">{{ $t("product.prodName") + ':' }}</span>
        <span class="row-txt">{{ prodInfo.prodName }}</span>
      </div>
      <div class="prod-row">
        <span class="row-title">{{ $t("prodList.sellingPoints") + ':' }}</span>
        <span class="row-txt">{{ prodInfo.brief }}</span>
      </div>
      <div class="prod-row">
        <span class="row-title inline-block">{{ $t("product.pic") + ':' }}</span>
        <div class="flex-box-img">
          <span v-for="(item,index) in prodInfo.imgs" class="detail-prod">
            <img :src="resourcesUrl + item" class="prod-img" alt />
          </span>
        </div>
      </div>
      <div class="prod-row" v-if="prodInfo.prodParameterList && prodInfo.prodParameterList.length > 0">
        <span class="row-title">{{ $t('prodList.parameters') }}:</span>
        <span class="row-txt params-box">
          <span class="prod-params" v-for="item in prodInfo.prodParameterList">
            <span>{{ item.parameterKey }}:</span>
            <span>{{ item.parameterValue }}</span>
          </span>
        </span>
      </div>
      <div class="main-container">
        <div class="table-con table-box">
          <span class="row-title">{{ $t("prodList.specs") + ':' }}</span>
          <!-- 规格表格 -->
          <el-table
            :data="prodInfo.skuList"
            header-cell-class-name="table-header"
            row-class-name="table-row"
            class="table"
            style="width: 100%">
            <el-table-column
              fixed
              prop="prodName"
              width="240"
              :label="this.$i18n.t('product.prodName')"
            >
              <template slot-scope="scope">
                <span class="table-cell-text">{{ scope.row.prodName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="properties"
              :label="this.$i18n.t('prodList.attribute')"
              width="240"
            >
              <template slot-scope="scope">
                <p class="table-cell-text" v-if="scope.row.properties">{{ $t('language') === 'language' ?scope.row.skuLangList[1].properties:scope.row.skuLangList[0].properties }}</p>
                <p class="table-cell-text" v-else>{{ $t("prodList.noAttribute") }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="pic"
              :label="this.$i18n.t('product.pic')"
            >
              <template slot-scope="scope">
                <img
                  :src="resourcesUrl + scope.row.pic"
                  class="tab-img"
                  v-if="scope.row.pic"
                  :key="scope.row.skuId"
                />
                <img
                  :src="resourcesUrl + prodInfo.imgs[0]"
                  class="tab-img"
                  :key="scope.row.skuId"
                  v-else
                />
                <p v-else class="weak">{{ $t("prodList.noPictures") }}</p>
              </template>
            </el-table-column>

            <el-table-column
              prop="price"
              :label="this.$i18n.t('prodList.salesPrice')"
            ></el-table-column>
            <el-table-column
              prop="oriPrice"
              :label="this.$i18n.t('prodList.marketValue')"
            ></el-table-column>
            <el-table-column
              prop="stocks"
              :label="this.$i18n.t('product.totalStocks')"
            ></el-table-column>
            <el-table-column
              prop="weight"
              :label="this.$i18n.t('prodList.prodWeight')"
            ></el-table-column>
            <el-table-column
              prop="volume"
              :label="this.$i18n.t('prodList.prodVolume')"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn primary-btn" @click="showProdInfoDialog = false">{{
          $t("remindPop.confirm")
        }}</div>
      </span>
    </el-dialog>

    <!-- 违规下架弹窗 --> 
    <el-dialog
      title="提示"
      :visible.sync="offlineProdDialog"
      width="500px"
      left
      class="offline-dialog"
      :close-on-click-modal="false"
      top="25vh">
      <div class="offline-title">
        <span>{{$i18n.t('remindPop.determine') + $i18n.t('remindPop.prod') + ` [${offlineProdInfo.prodName}] ` + $i18n.t('remindPop.offshelf') + $i18n.t('remindPop.reason')}}</span>
      </div>
      <el-input 
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 6}"
        maxlength="500"
        v-model.trim="offlineReason" 
        placeholder="下线理由"
        show-word-limit
        :class="{'reasonEmpty':isReasonEmpty}"
        @focus="isReasonEmpty = false"
        @blur="isReasonEmpty = offlineReason===''">
      </el-input>
      <div class="offline-reason-hint">
        <span v-show="isReasonEmpty">{{$i18n.t('remindPop.emptyReason')}}</span>
      </div>
      <span slot="footer">
        <el-button size="small" @click="offlineProdDialog = false">{{$i18n.t('remindPop.cancel')}}</el-button>
        <el-button size="small" type="primary" @click="submitOfflineProd()">{{$i18n.t('remindPop.confirm')}}</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import ProdOfflineAudit from '@/components/offline-audit'
import AuditProd from '@/components/prod-audit'
import i18n from '../../../i18n/i18n'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件
      dataForm: {
        prodName: ''
      },
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        shopName: '',
        keyword: '',
        status: '',
        deliveryMode: '',
        categoryId: ''
      },
      dataListSelections: [],
      currentMoveProdId: '', // 移入项的spuId
      currentClickProdId: '', // 点击项的spuId
      currentShowPopover: '', // 当前展示的弹窗
      waterSoldNum: '',
      dataListLoading: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      showProdInfoDialog: false,
      ProdOfflineAuditVisible: false,
      prodAuditVisible: false,
      prodName: '',
      prodNameRouter: '',
      prodId: null,
      // 0无 1.排序号排序
      sortParam: 0,
      isTop: null,
      // 0无 1 正序 2倒序
      sortType: 0,
      prodInfo: {},
      skuList: [],
      waterArr: [],
      categoryId: null,
      // 分类list
      categoryList: [],
      prodInfoCategory: [], // 商品详情分类
      prodListExport: [],
      // 违规下架相关
      offlineProdDialog: false, // 弹窗显隐
      offlineReason: '', // 下架原因
      offlineProdInfo: {}, // 所选下架商品的信息
      isReasonEmpty: false // 原因字段为空的提示显隐
    }
  },
  components: {
    ProdOfflineAudit,
    AuditProd
  },
  created () {
    if (this.$route.query.prodName) {
      this.prodNameRouter = this.$route.query.prodName
      this.prodName = this.$route.query.prodName
    }
    this.prodId = this.$route.query.prodId ? this.$route.query.prodId : null
    this.getDataList()
  },
  mounted () {
    // 获取平台分类
    this.getCategoryList()
  },
  filters: {
    DeliveryMode: function (value) {
      // 将商品的配送方式字符串转化为json
      let objValue = JSON.parse(value)
      // 声明返回结果 result
      let result = []
      if (objValue.hasCityDelivery === true) {
        result.push(i18n.t('product.sameCityDelivery'))
      }
      if (objValue.hasUserPickUp === true) {
        result.push(i18n.t('product.userPickUp'))
      }
      if (objValue.hasShopDelivery === true) {
        result.push(i18n.t('product.ExpressDistribution'))
      }
      return result.join(' / ')
    }
  },
  methods: {
    // 获取数据列表
    getDataList (page, sort, newData = false) {
      this.dataListLoading = true
      if (sort) {
        this.searchForm.sort = sort === 'ascending' ? 13 : 12
      } else {
        this.searchForm.sort = null
      }
      if (newData || !this.theData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.theData = {
          current: page == null ? this.page.currentPage : page.currentPage,
          keyword: this.prodNameRouter ? this.prodNameRouter : this.prodName,
          prodId: this.prodId ? this.prodId : null,
          size: page == null ? this.page.pageSize : page.pageSize,
          isTop: this.isTop,
          categoryId: this.categoryId,
          mustNotProdTypes: !this.searchForm.prodType ? [3] : null
        }
      } else {
        this.theData.current = page == null ? this.page.currentPage : page.currentPage
        this.theData.size = page == null ? this.page.pageSize : page.pageSize
      }
      if (this.searchForm.deliveryMode) {
        if (this.searchForm.deliveryMode === 5) {
          this.theParams.deliveryMode = null
          if (this.searchForm.mold === 0) {
          // 实物商品
            this.dataList = []
            return
          }
          // 无需快递
          if (this.searchForm.mold == null || this.searchForm.mold === '') {
            this.theParams.mold = 1
          }
        } else {
          // 实物快递
          if (this.searchForm.mold === 1) {
            // 虚拟商品
            this.dataList = []
            return
          }
          this.theParams.mold = 0
          if (this.theData.mustNotProdTypes && this.theData.mustNotProdTypes.length >= 0) {
            this.theData.mustNotProdTypes.push(5)
          } else {
            this.theData.mustNotProdTypes = [5]
          }
        }
      }
      this.$http({
        url: this.$http.adornUrl('/platform/search/prod/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            this.theData,
            this.theParams
          )
        )
      }).then(({ data }) => {
        // this.page = page
        this.dataList = data.records
        // console.log('00', this.dataList)
        for (const key in this.dataList) {
          if (this.dataList.hasOwnProperty(key)) {
            const element = this.dataList[key]
            element.imgs = element.pic
          }
        }
        this.prodName = ''
        this.prodNameRouter = null
        this.page.total = data.total
        // this.page.currentPage = this.page.currentPage
        this.dataListLoading = false

        // 末尾页数据为空重新请求
        if (!this.dataList.length && this.page.currentPage > 1) {
          this.page.currentPage = 1
          this.getDataList()
        }
      })
    },
    changeTableSort (column) {
      this.getDataList(this.page, column.order)
    },
    // 获取平台分类列表
    getCategoryList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategoryByGrade'),
        method: 'get',
        params: this.$http.adornParams({
          grade: 2
        })
      }).then(({ data }) => {
        // categoryId 的列所在位置
        // let categoryIdIndex = 11
        // this.tableOption.column[categoryIdIndex].dicData = data
        // this.$set(this.tableOption.column, categoryIdIndex, this.tableOption.column[categoryIdIndex])
        this.categoryList = data
        this.dataListLoading = false
      })
    },
    // 获取商品详情
    showProdInfo (id) {
      this.showProdInfoDialog = true
      this.$http({
        url: this.$http.adornUrl(`/prod/prod/info/${id}`),
        method: 'GET'
      })
        .then(res => {
          res.data.imgs = res.data.imgs.split(',')
          this.prodInfo = res.data
          this.skuList = res.data.skuList
          this.showProdCategory(res.data.categoryId)
        })
        .catch()
    },
    showProdCategory (id) {
      this.$http({
        url: this.$http.adornUrl(`/prod/category/getCategoryAndParent`),
        params: {
          categoryId: id
        },
        method: 'GET'
      }).then(res => {
        this.prodInfoCategory = []
        res.data.forEach((item, index) => {
          this.prodInfoCategory.push(item.categoryName)
        })
      }).catch()
    },
    showWaterSoldNum (val) {
      this.waterSoldNum = val
    },
    changeWaterSoldNum (currentValue, oldValue) {
      this.waterSoldNum = currentValue
    },
    // 更改注水销量
    handleChange (id) {
      let waterSoldNum = Math.round(this.waterSoldNum)
      if (waterSoldNum > 1000000000) {
        waterSoldNum = 1000000000
      }
      if (!waterSoldNum && waterSoldNum !== 0) {
        this.$message({
          message: this.$i18n.t('tip.input') + this.$i18n.t('product.waterSoldNum'),
          type: 'error',
          duration: 1500
        })
        return
      }
      this.$http({
        url: this.$http.adornUrl('/prod/prod/waterSoldNum'),
        method: 'put',
        params: {
          waterSoldNum: waterSoldNum,
          prodId: id
        }
      }).then(() => {
        this.$message({
          message: this.$i18n.t('remindPop.success'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.getDataList(this.page)
            this.closePopover()
          }
        })
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('remindPop.makeSure') + ' ' + `[${id ? this.$i18n.t('remindPop.delete') : this.$i18n.t('remindPop.batchDeletion')}]` + ' ' + this.$i18n.t('remindPop.operation') + '?', this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/prod/prod/${id}`),
            method: 'delete',
            data: this.$http.adornData({})
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('remindPop.succeeded'),
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
    // 提交商品下架原因
    submitOfflineProd () {
      if (this.offlineReason === '') {
        this.isReasonEmpty = true
        return
      }
      this.offlineProdDialog = false
      this.$http({
        url: this.$http.adornUrl(`/prod/prod/offline`),
        method: 'post',
        data: this.$http.adornData({
          handleId: this.offlineProdInfo.prodId,
          offlineReason: this.offlineReason || null
        })
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('remindPop.succeeded'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.getDataList(this.page)
          }
        })
      })
    },
    // 下架
    offlineProdHandle (row) {
      this.offlineProdInfo = row
      this.offlineReason = ''
      this.offlineProdDialog = true
      this.isReasonEmpty = false
    },
    // 条件查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, false, newData)
    },
    toTopHandle (row) {
      var str = this.$i18n.t('publics.isTop')
      if (row.isTop === 1) {
        str = this.$i18n.t('liveRoom.cancelTopping')
      }
      this.$confirm(this.$i18n.t('remindPop.makeSure') + ' ' + str + ' ' + this.$i18n.t('remindPop.operation') + '?', this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/prod/prod/toTop/' + row.prodId),
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
    // 获取弹出弹窗项信息
    getCurrentSpuId (spuId, currentShowPopover) {
      this.currentClickProdId = spuId
      this.currentShowPopover = currentShowPopover
    },
    // 清空选中项弹窗信息
    clearShowPopoverInf () {
      this.currentClickProdId = ''
      this.currentShowPopover = ''
    },
    // 关闭弹窗后,初始化数据
    initProdInf () {
      // row.waterSoldNum = row.waterSoldNum
      this.clearShowPopoverInf()
    },
    // 关闭popover弹窗
    closePopover () {
      this.$refs.closepopover.click()
    },
    /**
     * 鼠标移入单元格
     */
    cellMouseEnter (row) {
      this.currentMoveProdId = row.prodId
    },
    /**
     * 鼠标移出单元格
     */
    cellMouseLeave () {
      this.currentMoveProdId = ''
    },
    // 移入表格行
    enterTableRow (row) {
      this.currentMoveProdId = row.prodId
    },
    // 移出表格行
    leaveTableRow () {
      this.currentMoveProdId = ''
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    // 导出
    exportFrom () {
      let params = {
        prodIds: this.dataListSelections.map(x => x.prodId)
      }
      const loading = this.$loading({
        lock: true,
        target: '.prod-list-mod',
        customClass: 'export-load',
        background: 'transparent',
        text: this.$i18n.t('shop.exportIng')
      })
      this.$http({
        url: this.$http.adornUrl('/platform/search/prod/prodExport'),
        method: 'get',
        params: this.$http.adornParams(
            Object.assign(
              this.theData,
              this.theParams,
              params
            )
          ),
        responseType: 'blob'
      }).then(({ data }) => {
        loading.close()
        var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.$i18n.t('shopFeature.allCanUse.goodsList') + '.xlsx'

        const elink = document.createElement('a')
        if ('download' in elink) { // 非IE下载
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch((e) => {
        loading.close()
      })
    },
    // 违规下架的商品审核
    auditProdHandle (row) {
      this.ProdOfflineAuditVisible = true
      this.$nextTick(() => {
        this.$refs.ProdOfflineAudit.init(row.prodId)
      })
    },
    // 待审核的商品审核
    prodAuditHandle (row) {
      this.prodAuditVisible = true
      this.$nextTick(() => {
        this.$refs.AuditProd.init(row.prodId)
      })
    },
    // 清空自定义数据
    searchReset () {
    },
    sortChange (data) {
      // 排序字段 0无 1加入时间 2累计客户 3累计邀请 4累计收益
      switch (data.prop) {
        case 'seq': this.sortParam = 1
          break
      }
      // 排序类型 0无 1 正序 2倒序
      switch (data.order) {
        case 'descending': this.sortType = 2
          break
        case 'ascending': this.sortType = 1
          break
        default: this.sortType = 0
          break
      }
      this.getDataList(this.page)
    },
    // 刷新商品
    refreshChange () {
      this.getDataList(this.page)
    },
    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm () {
      this.searchForm = {
        shopName: '',
        keyword: '',
        status: '',
        deliveryMode: '',
        categoryId: ''
      }
      this.$router.push('/prod-prodList')
      this.prodId = null
      this.isTop = null
    },

    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList()
    },

/**
 * 当图片加载失败时，切换至默认图
 */
    handlePicError (event) {
      event.target.src = require('../../../assets/img/def.png')
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-prod.prod-list-mod {
  .main-container {
    .table-con {
      .water-sold-con {
        & ::v-deep .el-input--small .el-input__inner {
          padding: 0;
          padding-left: 12px;
          text-align: center;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
          -webkit-text-overflow: ellipsis;
          -moz-text-overflow: ellipsis;
          word-break: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }

  // 商品详情弹窗
  .prod-detail-dialog {
    .main-container {
      .table-cell-text {
        -webkit-line-clamp: 1;
      }
    }
    .row-title {
      display: inline-block;
      margin-right: 12px;
      min-width: 70px;
      line-height: 1.5em;
    }
    .prod-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15px;
      .row-txt {
        word-break: break-word;
        line-height: 1.5em;
      }
      .prod-img {
        display: inline-block;
        width: auto;
        height: auto;
        max-width: 100px;
        max-height: 100px;
      }
    }
    .table-box {
      .table {
        margin-top: 10px;
        .tab-img {
          display: block;
          width: auto;
          height: auto;
          max-width: 60px;
          max-height: 60px;
        }
        .weak {
          color: #aaa;
        }
      }
    }
    .params-box {
      display: flex;
      flex-wrap: wrap;
    }
    .prod-params {
      margin-right: 20px;
    }
  }
  .detail-prod {
    display: inline-block;
    margin-right: 10px;
    img {
      width: 100px !important;
      height: 100px !important;
    }
  }
}
.flex-box-img {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: 15px;
}
.inline-block {
  flex: none;
}
.popover-bottom {
  margin-top: 10px;
  text-align: right;
}
::v-deep .export-load {
  top: -50% !important;
}

 ::v-deep .el-table__fixed{
    height: auto !important;
    bottom: 16px !important;
    &::before {
      background-color: transparent !important;
    }
  }
 ::v-deep .el-table__fixed-right{
    height: auto !important;
    bottom: 16px !important;
    &::before {
      background-color: transparent !important;
    }
  }

  // 违规下架
  .offline-dialog{

    .offline-title{
      line-height: 24px;
      margin-bottom: 16px;
    }
    
    & ::v-deep .el-dialog__header{
      border: none;
    }

    & ::v-deep .el-dialog__footer{
      border: none;
    }

    & ::v-deep .el-dialog__body{
      padding: 20px;
    }

    .offline-reason-hint {
      color: #f56c6c;
      font-size: 12px;
      min-height: 18px;
      line-height: 18px;
    }

    & ::v-deep .el-textarea .el-input__count {
      bottom: -18px !important;
    }
  }
  
</style>
<style scoped>
.reasonEmpty /deep/ .el-textarea__inner{
  border:#f56c6c 1px solid !important;
}
</style>
