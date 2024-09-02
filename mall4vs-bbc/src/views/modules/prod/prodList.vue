<template>
  <div class="mod-prod prod-list-mod">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <!-- 表单项 -->
        <div class="input-row">
          <el-form-item :label="$t('product.prodName')+':'">
            <el-input type="text" v-model="prodName" :placeholder="$t('product.prodName')"></el-input>
          </el-form-item>
          <!-- 组合商品 -->
          <!-- <el-form-item prop="isCompose" :label="$t('product.comProd')+':'">
            <el-select v-model="searchForm.isCompose" :placeholder="$t('product.comProd')">
              <el-option :label="$t('publics.no')" :value="0"></el-option>
              <el-option :label="$t('publics.yes')" :value="1"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item prop="isCompose" :label="$t('product.prodType')+':'">
            <el-select v-model="searchForm.prodType" :placeholder="$t('product.prodType')">
              <el-option :label="$t('product.ordProd')" :value="0"></el-option>
              <el-option :label="$t('product.groupProd')" :value="1"></el-option>
              <el-option :label="$t('product.limitedTimeProd')" :value="2"></el-option>
              <el-option :label="$t('product.activeProd')" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="isCompose" :label="$t('product.prodMold')+':'">
            <el-select v-model="searchForm.mold" :placeholder="$t('product.prodMold')">
              <el-option :label="$t('product.physicalGoods')" :value="0"></el-option>
              <el-option :label="$t('product.virtualGoods')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="status" :label="$t('product.status')+':'">
            <el-select v-model="searchForm.status" :placeholder="$t('product.status')">
              <el-option :label="$t('publics.UpperShelf')" :value="1"></el-option>
              <el-option :label="$t('publics.LowerShelf')" :value="0"></el-option>
              <el-option :label="$t('publics.violationShelf')" :value="2"></el-option>
              <el-option :label="$t('product.violationPendingReview')" :value="3"></el-option>
              <el-option :label="$t('publics.pendingReview')" :value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="deliveryMode" :label="$t('product.delType')+':'">
            <el-select v-model="searchForm.deliveryMode" :placeholder="$t('product.delType')">
              <el-option :label="$t('product.userPickUp')" :value="2"></el-option>
              <el-option :label="$t('product.ExpressDistribution')" :value="1"></el-option>
              <el-option :label="$t('product.sameCityDelivery')" :value="4"></el-option>
              <el-option :label="$t('order.noNeedRequired')" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="isTop" :label="$t('publics.isTop')+':'">
            <el-select v-model="searchForm.isTop" :placeholder="$t('publics.isTop')">
              <el-option :label="$t('publics.no')" :value="0"></el-option>
              <el-option :label="$t('publics.yes')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <!-- 商品分类 -->
          <el-form-item :label="$t('product.shopCategories')+':'">
            <el-select v-model="searchForm.shopCategoryId" :placeholder="$t('product.shopCategories')">
              <el-option v-for="(item,i) in categoryList" :label="item.categoryName" :key="i" :value="item.categoryId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('product.platforation')+':'">
            <el-cascader
              v-model="selectedPlatformCategories"
              clearable
              expand-trigger="hover"
              :options="platformCategories"
              :props="platformCategoriesTreeProps"
              change-on-select
              @change="handlePlatformCategoryChange"
            />
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('shop.resetMap')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 主体内容 -->
    <div class="main-container">
      <!-- 操作按钮 -->
      <div class="operation-bar">
        <el-checkbox v-model="selectAll" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox>
        <span v-if="dataListSelections.length" class="had-selected">{{$t('publics.selected')}} {{dataListSelections.length}}</span>
        <div
          class="default-btn"
          v-if="isAuth('prod:prod:exportProd')"
          @click="getExportExcel()">
          {{ $t("formData.export") }}
        </div>
        <div
          class="default-btn"
          @click.stop="getUpload()"
          v-if="isAuth('prod:prod:downloadModel')">
          {{ $t("product.importGoods") }}
        </div>
        <div v-if="isAuth('prod:prod:batchStatus') || isAuth('prod:prod:batchDelete')" style="display:inline-block; margin-left: 20px" @click="showBatchSetting=true">
          <el-dropdown class="batch-setting-dropdown"
            @command="handleBatchSetting"
            :hide-on-click="true"
            trigger="click"
            @visible-change="handleVisibleChange">
            <div
              :class="[showBatchSetting? 'active' : '','default-btn batch-setting-btn']"
            >{{$t('publics.batchSetting')}}
              <i class="arrow"></i>
            </div>
              <!-- 批量设置功能列表 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="isAuth('prod:prod:batchStatus')" command="1">{{$t('product.batchUp')}}</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('prod:prod:batchStatus')" command="0">{{$t('product.batchDown')}}</el-dropdown-item>
              <el-dropdown-item v-if="isAuth('prod:prod:batchDelete')" command="-1">{{$t('publics.batchDelete')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-con prod-table">
        <el-table
          ref="prodListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            fixed
            prop="prodName"
            :label="$t('product.prodInfo')"
            width="340">
            <template slot-scope="scope">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <img v-if="scope.row.pic" :src="scope.row.pic" :alt="scope.row.prodName" @error="handlePicError">
                  <img v-else src="~@/assets/img/def.png" :alt="scope.row.prodName">
                </div>
                <span class="table-cell-text">{{ scope.row.prodName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="oriPrice"
            :label="$t('product.marketPrice')"
            width="140"
            sortable>
          </el-table-column>
          <el-table-column
            align="left"
            prop="price"
            :label="$t('product.sellingPrice')"
            width="140"
            sortable>
          </el-table-column>
          <el-table-column
            align="left"
            prop="totalStocks"
            :label="$t('product.availableInventory')"
            width="150"
            sortable>
          </el-table-column>
          <!-- 是否为组合商品(0否 1是) -->
          <!-- <el-table-column
            align="center"
            prop="prodType"
            :label="$t('product.comProd')"
            width="130"
          >
            <template slot-scope="scope">
              <div class="tag-text">{{[$t('publics.no'),$t('publics.yes')][scope.row.isCompose]}}</div>
            </template>
          </el-table-column> -->
          <el-table-column
            align="left"
            prop="prodType"
            :label="$t('product.prodType')"
            width="130">
            <template slot-scope="scope">
              <!-- 商品类型(0普通商品 1拼团 2秒杀 3积分 5活动商品) -->
              <div class="tag-text">{{[$t('product.ordProd'),$t('product.groupProd'),$t('product.limitedTimeProd'),$t('product.pointsProduct'),'', $t('product.activeProd')][scope.row.prodType]}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="prodMold"
            :label="$t('product.prodMold')"
          >
            <template slot-scope="scope">
              <!-- 虚拟商品(0否 1是) -->
              <div class="tag-text" v-if="scope.row.mold !== 1">{{$t('product.physicalGoods')}}</div>
              <div class="tag-text" v-if="scope.row.mold === 1">{{$t('product.virtualGoods')}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="status"
            :label="$t('product.status')"
            sortable>
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.status === 1">{{ $t("publics.UpperShelf") }}</div>
              <div class="tag-text" v-if="scope.row.status === 0">{{ $t("publics.LowerShelf") }}</div>
              <div class="tag-text" v-if="scope.row.status === 2">{{ $t("publics.violationShelf") }}</div>
              <div class="tag-text" v-if="scope.row.status === 3">{{ $t("product.violationPendingReview") }}</div>
              <div class="tag-text" v-if="scope.row.status === 6">{{ $t("publics.pendingReview") }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="deliveryMode"
            :label="$t('product.delType')"
            width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.prodType === 5">-</div>
              <div v-else>{{scope.row.deliveryMode | DeliveryMode(scope.row.mold, scope.row.prodType)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="isTop"
            :label="$t('publics.isTop')">
            <template slot-scope="scope">
              <div class="tag-text">{{[$t('publics.no'), $t('publics.yes')][scope.row.isTop]}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="seq"
            :label="$t('publics.seq')"
            sortable>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="180"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="isAuth('prod:prod:update')"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row.prodId)"
                  >{{$t('groups.edit')}}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:prod:status') && scope.row.status === 0"
                  @click="changeProdStatus(scope.row.prodId, 1)"
                  >{{$t('publics.UpperShelf')}}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:prod:status') && scope.row.status === 1"
                  @click="changeProdStatus(scope.row.prodId, 0)"
                  >{{$t('publics.LowerShelf')}}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:prod:audit') && scope.row.status === 2"
                  @click="applyAuditHandle(scope.row.prodId)"
                  >{{$t("groups.applyForListing")}}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:prod:audit') && scope.row.status === 3"
                  @click="applyAuditHandle(scope.row.prodId)"
                  >{{$t("product.auditHistory")}}
                </div>
                <div
                  v-if="isAuth('prod:prod:delete')"
                  class="default-btn text-btn"
                  @click="deleteHandle(scope.row.prodId)"
                  >{{$t("text.delBtn")}}
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

    <!-- 下线管理弹窗-->
    <ProdOfflineHandleEvent
      v-if="prodOfflineHandleEventVisible"
      selectUrl="/prod/prod/getOfflineHandleEventByProdId"
      applyUrl="/prod/prod/auditApply"
      ref="prodOfflineHandleEvent"
      @refreshDataList="refreshChange"
    ></ProdOfflineHandleEvent>
    <prod-upload
      v-if="uploadVisible"
      ref="prodUpload"
      @refreshDataList="getWaitingConsignmentExcel"
    ></prod-upload>
  </div>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import ProdUpload from './prod-upload'
import ProdOfflineHandleEvent from '@/components/offline-event-handle'
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
        isCompose: '',
        prodType: '',
        mold: '',
        status: '',
        deliveryMode: '',
        isTop: '',
        shopCategoryId: null
      },
      categoryList: [], // 店铺分类
      selectedPlatformCategories: [],
      platformCategories: [], // 平台分类
      platformCategoriesTreeProps: {
        value: 'categoryId',
        label: 'categoryName'
      },
      prodName: '',
      prodNameRouter: '',
      prodId: null,
      dataListSelections: [],
      // 0无 1.排序号排序
      sortParam: 0,
      // 0无 1 正序 2倒序
      sortType: 0,
      dataListLoading: false,
      uploadVisible: false,
      prodOfflineHandleEventVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,

      // 是否全选
      selectAll: false,
      // 显示批量操作
      showBatchSetting: false
    }
  },
  components: {
    ProdOfflineHandleEvent,
    ProdUpload
  },
  created () {
    if (this.$route.query.prodName) {
      this.prodNameRouter = this.$route.query.prodName
      this.prodName = this.$route.query.prodName
    }
    this.prodId = this.$route.query.prodId ? this.$route.query.prodId : null
    if (this.$route.query.page) {
      this.page = JSON.parse(this.$route.query.page)
    }
    this.getDataList()
  },
  mounted () {
    document.addEventListener('click', e => {
      if (!this.$el.contains(e.target)) {
        this.showBatchSetting = false
      }
    })
    // 获取店铺分类
    this.getProdCategoryList()
    // 获取平台分类
    this.getPlatformCategories()
  },
  watch: {
    $route () {
      if (this.$route.path === '/prod-prodList') {
        this.getDataList(this.page)
      }
    }
  },
  filters: {
    DeliveryMode: function (value, mold, prodType) {
      // mold 虚拟商品
      if (mold === 1 || prodType === 5) {
        return i18n.t('order.noNeedRequired')
      }
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

    /**
     * 监听平台分类选择变化
     */
    handlePlatformCategoryChange (val) {
      this.searchForm.primaryCategoryId = undefined
      this.searchForm.secondaryCategoryId = undefined
      this.searchForm.categoryId = undefined
      if (val.length === 1) { // 长度为1，表明当前选择的是一级分类（点击了一级分类）
        this.searchForm.primaryCategoryId = val[0] // 平台一级分类id
      } else if (val.length === 2) { // 长度为2，表明当前选择的是二级分类（点击了二级分类）
        this.searchForm.secondaryCategoryId = val[1] // 平台二级分类id
      } else if (val.length === 3) { // 长度为3，表明当前选择的是三级分类（点击了三级分类）
        this.searchForm.categoryId = val[2] // 平台三级分类id
      }
    },
    // 获取店铺分类
    getProdCategoryList () {
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams({ status: 1 })
      }).then(({ data }) => {
        this.categoryList = data
        // console.log(data)
      })
    },
    // 获取平台分类
    getPlatformCategories () {
      this.$http({
        url: this.$http.adornUrl('/prod/category/listAvailableSigningCategory'),
        method: 'get',
        params: this.$http.adornParams({ status: 1 })
      }).then(({ data }) => {
        this.platformCategories = treeDataTranslate(data, 'categoryId', 'parentId')
        // this.platformCategories = data
      })
    },

    handlePicError (e) {
      e.target.src = require('@/assets/img/def.png')
    },
    // 获取数据列表
    getDataList (page, newData = false) {
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
      // mysql 请求接口
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.theData = {
          current: page == null ? this.page.currentPage : page.currentPage,
          keyword: this.prodNameRouter ? this.prodNameRouter : this.prodName,
          size: page == null ? this.page.pageSize : page.pageSize,
          prodId: this.prodId ? this.prodId : null
        }
      } else {
        this.theData.current = page == null ? this.page.currentPage : page.currentPage
        this.theData.size = page == null ? this.page.pageSize : page.pageSize
      }
      this.theParams.mustNotProdTypes = null
      if (this.searchForm.deliveryMode && this.searchForm.deliveryMode === 5) {
        this.theParams.deliveryMode = null
        // 无需快递
        if (this.searchForm.mold == null || this.searchForm.mold === '') {
          this.theParams.mold = 1
        }
        if (this.searchForm.mold === 0) {
          // 实物商品
          this.dataList = []
          return
        }
      }
      if (this.searchForm.deliveryMode && this.searchForm.deliveryMode !== 5) {
          // 实物快递
        if (this.searchForm.mold === 1) {
          // 虚拟商品
          this.dataList = []
          return
        }
        this.theParams.mold = 0
        this.theParams.mustNotProdTypes = [5]
      }
      this.$http({
        url: this.$http.adornUrl('/admin/search/prod/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            this.theData,
            this.theParams
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        for (const key in this.dataList) {
          if (this.dataList.hasOwnProperty(key)) {
            const element = this.dataList[key]
            if (element.imgs != null && element.imgs !== '') {
              element.imgs = element.imgs.split(',')[0]
            }
          }
        }
        this.page.total = data.total
        this.dataListLoading = false
        this.prodNameRouter = null
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      if (!this.isAuth('prod:prod:save')) {
        this.$message.info(this.$i18n.t('homes.noPermissionAccessPage'))
        return
      }
      this.$router.push({
        path: '/prod-post-product/postProduct',
        query: { prodId: id, page: JSON.stringify(this.page) }
      })
    },
    // 刷新数据
    getWaitingConsignmentExcel () {
      this.getDataList(this.page)
    },
    // 删除
    deleteHandle (id) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.prodId
      })
      this.$confirm(`${this.$i18n.t('admin.isDeleOper')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/prod/prod/${id}`),
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
      })
        .catch(() => { })
    },
    // 多选变化
    handleSelectionChange (val) {
      this.dataListSelections = val
      this.selectAll = val.length === this.dataList.length
      if (this.dataList.length === 0) {
        this.selectAll = false
      }
    },
    // 批量改变状态
    batchChangeProdStatus (status) {
      var prodList = this.dataListSelections.filter(item => {
        if (status === 0 && item.status === 1) {
          // 进行下架商品操作，则只改变状态为上架的
          return true
        } else if (status === 1 && item.status === 0) {
          // 进行上架商品操作，则只改变状态为下架的
          return true
        } else {
          // 其他状态不做修改
          return false
        }
      })
      var ids = prodList.map(item => {
        return item.prodId
      })
      this.$confirm(`${this.$i18n.t('sys.makeSure')}【${status ? this.$i18n.t('product.batchUp') : this.$i18n.t('product.batchDown')}】${this.$i18n.t('publics.operating')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/prod/prod/batchProdStatus/' + status),
          method: 'put',
          data: this.$http.adornData(ids, false)
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
    // 批量删除
    batchDeleteHandle () {
      var ids = this.dataListSelections.map(item => {
        return item.prodId
      })
      this.$confirm(`${this.$i18n.t('sys.makeSure')}【${this.$i18n.t('sys.batchDelete')}】${this.$i18n.t('publics.operating')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/prod/prod'),
          method: 'delete',
          // data: this.$http.adornData({})
          data: this.$http.adornData(ids, false)
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
    changeProdStatus (id, status) {
      this.$confirm(`${this.$i18n.t('sys.makeSure')}【${status ? this.$i18n.t('publics.UpperShelf') : this.$i18n.t('publics.LowerShelf')}】${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/prod/prod/prodStatus`),
            method: 'put',
            data: this.$http.adornData({
              status: status,
              prodId: id
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.page.currentPage = 1
                this.getDataList(this.page)
              }
            })
          })
        })
    },
    // 条件查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 跳转至导入选择
    getUpload () {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.prodUpload.init()
      })
    },
    getExportExcel () {
      this.$confirm(`${this.$i18n.t('product.exportProduct')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          target: '.prod-list-mod',
          customClass: 'export-load',
          background: 'transparent',
          text: this.$i18n.t('formData.exportIng')
        })
        this.$http({
          url: this.$http.adornUrl('/admin/search/prod/prodExport'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              {
                prodName: this.prodNameRouter ? this.prodNameRouter : this.prodName,
                prodId: this.prodId ? this.prodId : null
              },
              this.searchForm,
              this.theData
            )
          ),
          responseType: 'blob' // 解决文件下载乱码问题
        }).then(({ data }) => {
          loading.close()
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = this.$i18n.t('product.comInfoSorXls')
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
      })
    },
    // 申请审核
    applyAuditHandle (id) {
      this.prodOfflineHandleEventVisible = true
      this.$nextTick(() => {
        this.$refs.prodOfflineHandleEvent.init(id)
      })
    },
    toTopHandle (row) {
      var str = this.$i18n.t('publics.isTop')
      if (row.roomTop) {
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
    sortChange (data) {
      // console.log(data)
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
    // 清空自定义数据
    searchReset () {
      this.prodName = ''
    },
    // 回调刷新
    refreshChange () {
      this.getDataList(this.page)
    },

    /**
     * 全选按钮
     */
    handleSelectAll () {
      if (this.$refs.prodListTable.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.$refs.prodListTable.toggleAllSelection()
    },

    /**
     * 批量设置菜单显隐
     */
    handleVisibleChange (val) {
      this.showBatchSetting = val
    },

    /**
     * 批量设置
     */
    handleBatchSetting (command) {
      const commands = Number(command)
      if (!this.dataListSelections.length) {
        this.$message.warning(this.$i18n.t('marketing.pleaseSelectAProduct'))
        return
      }
      if (commands !== -1) {
        this.batchChangeProdStatus(commands)
      } else {
        this.batchDeleteHandle()
      }
    },

    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.prodName = ''
      this.$router.push('/prod-prodList')
      this.prodId = null
      this.searchForm.mold = null
      this.searchForm.prodType = null
      this.searchForm.shopCategoryId = null
      this.searchForm.primaryCategoryId = ''
      this.searchForm.secondaryCategoryId = ''
      this.searchForm.categoryId = ''
      this.selectedPlatformCategories = []
      this.theParams.mustNotProdTypes = null
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
.prod-list-mod {
  .main-container {
    .table-con .table-cell-con .table-cell-text{
      word-break: break-all
    }
    .operation-bar {
      position: relative;
      .all-check-btn {
        margin-right: 10px;
      }
      .had-selected {
        font-size: 12px;
        margin-right: 10px;
      }
      .tag-text {
        font-size: 12px;
      }
      .batch-setting-mask {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 100;
      }
      .batch-setting-dropdown {
         .batch-setting-btn {
           padding-right: 15px;
           margin-right: 0;
          &:hover {
            .arrow::after {
              border-top: 1px solid #155bd4;
              border-right: 1px solid #155bd4;
            }
          }
          &.active {
            color: #155bd4;
            border-color: #155bd4;
            .arrow::after {
              border-top: 1px solid #155bd4;
              border-right: 1px solid #155bd4;
              transform: rotate(-45deg);
              top: 0px;
              right: 0px;
              transition: all .2s linear;
            }
          }
          .arrow {
            position: relative;
            margin-left: 9px;
            &::after{
              position: relative;
              top: -3px;
              right: 0px;
              transition: all .2s linear;
              content: '';
              display: inline-block;
              width: 6px;
              height: 6px;
              border-top: 1px solid #656565;
              border-right: 1px solid #656565;
              transform: rotate(135deg);
              -webkit-transform: rotate(135deg);
            }
          }
        }
      }
    }
  }
  ::v-deep .export-load {
    top: -50% !important;
  }
}
</style>
