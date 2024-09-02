<template>
  <el-dialog
    :title="this.$i18n.t('product.select')"
    top="100px"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div class="mod-order-order">
      <div class="screening-conditions">
        <el-form
          :inline="true"
          :model="dataForm"
          @keyup.enter.native="getDataList(this.page)"
        >
          <div class="search">
            <!-- &nbsp;&nbsp;&nbsp; -->
            <el-form-item :label="this.$i18n.t('publics.code') + '：'" :label-width=" lang === 'en' ? '145px' : '85px'">
              <el-input
                v-model="dataForm.partyCode"
                :placeholder="this.$i18n.t('publics.code')"
                clearable
                size="small"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <div
                class="default-btn primary-btn"
                @click="searchProd()"
                >{{ $t("order.query") }}</div
              >
              <div
                class="default-btn"
                @click="clear()"
                >{{ $t("shop.resetMap") }}</div
              >
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- {{ "已选择：" + this.selectSkuIds.length + '件商品'}} -->
      <div class="main">
        <div class="content">
          <!-- 列标题 -->
          <div :class="['tit']">
            <el-row style="width: 100%">
              <el-col :span="1">
                <span class="item">
                  <el-checkbox v-model="checkAll" @change="checkAllProd()" :disabled="disable"></el-checkbox>
                </span>
              </el-col>
              <el-col :span="7" class="column-title">
                <span class="item" >{{ $t("product.prodInfo") }}</span>
              </el-col>
              <el-col  :span="3" class="column-title">
                <span class="item">{{ $t("product.prodStatus") }}</span>
              </el-col>
              <el-col  :span="6" class="column-title">
                <span class="item">{{ $t("product.productSpecifi") }}</span>
              </el-col>
              <el-col :span="3" class="column-title">
                <span class="item">{{ $t("publics.code") }}</span>
              </el-col>
              <!-- <el-col :span="1" class="column-title">
                <span class="item">{{ " " }}</span>
              </el-col> -->
              <el-col :offset="1" :span="2" class="column-title">
                <span class="item">{{ $t("coupon.stock") }}</span>
              </el-col>
            </el-row>
          </div>

          <div
            class="prod"
            v-for="(prod, index) in dataList"
            :key="prod.prodId"
            style="margin-bottom: 10px"
          >
            <div class="prod-cont">
              <el-row style="width: 100%">
                <el-col :span="1" style="height: 100%">
                  <div class="item">
                    <el-checkbox v-model="prod.check" @change="checkProd(index)" :disabled="prod.disable"></el-checkbox>
                  </div>
                </el-col>
                <el-col :span="7" class="public-height">
                  <div class="prod-item">
                    <div class="item" style="margin-left:15%;width:80%">
                      <div class="prod-image" style="margin-right:0">
                        <img v-if="prod.pic" :src="prod.pic" />
                        <img v-else src="../../assets/img/def.png" width="60" height="60" />
                      </div>
                      <div class="prod-name">
                        {{prod.prodName}}
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="3" style="height: 100%">
                  <div class="item">
                    {{
                      [
                        $t("publics.LowerShelf"),
                        $t("publics.UpperShelf"),
                        $t("publics.violationShelf"),
                        $t("publics.pendingReview"),
                      ][prod.status]
                    }}
                  </div>
                </el-col>
                <el-col :span="13" style="height: 100%">
                  <div
                    class="items name"
                    :class="{'public-height': prod.skuList.length === 1}"
                    v-for="(sku, skuIndex) in prod.skuList"
                    :key="sku.skuId"
                  >
                    <el-row style="width: 100%" class="public-height">
                      <el-col :span="1" style="height: 100%">
                        <div class="item">
                          <el-checkbox v-model="sku.check" v-if="prod.skuList.length > 1" @change="checkSku(index, skuIndex)" :disabled="sku.disable"></el-checkbox>
                          <span></span>
                        </div>
                      </el-col>
                      <el-col :span="9" style="height: 100%">
                        <div class="item" >
                          {{sku.skuName}}
                        </div>
                      </el-col>
                      <el-col :span="8" style="height: 100%">
                        <div class="item">
                          {{sku.partyCode}}
                        </div>
                      </el-col>
                      <el-col :span="6" style="height: 100%">
                        <div class="item">
                          {{sku.stocks}}
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-if="!dataList||dataList.length===0" class="notData-tip">{{$t("order.noData")}}</div>
        </div>
        <el-pagination
        v-if="dataList.length"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      </div>
    </div>
    <div slot="footer">
      <!-- 提交及返回按钮 -->
      <div class="submit-box">
        <div class="default-btn" @click="back()" size="mini">{{
          $t("shopFeature.edit.back")
        }}</div>
        <div class="default-btn primary-btn" type="primary" size="mini" @click="submitProds()">{{
          $t("groups.submit")
        }}</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        product: ''
      },
      lang: localStorage.getItem('lang'),
      supplierId: 0,
      allData: [],
      selectProds: [],
      selectSkuIds: [],
      disableSkuIds: [],
      disableRetailProdIds: [],
      dataList: [],
      prodName: '',
      checkAll: false,
      disable: false,
      shopCategoryId: null,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dataListSelections: [],
      categoryList: [],
      selectedCategory: [],
      categoryTreeProps: {
        value: 'categoryId',
        label: 'categoryName'
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
    }
  },
  props: {
    type: {
      // 0：普通商品， 1：供应商商品
      default: 0,
      type: Number
    },
    dataUrl: {
      default: '/prod/prod/prodSkuPage',
      type: String
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    init (data) {
      this.supplierId = data.supplierId
      this.disableSkuIds = data.skuIds ? data.skuIds : []
      this.disableRetailProdIds = data.retailProdIds ? data.retailProdIds : []
      this.visible = true
      this.checkAll = false
      this.selectProds = []
      this.selectSkuIds = []
      this.page = {
        total: 0,
        currentPage: 1,
        pageSize: 10
      }
      this.selectRetailProdIds = []
      this.pageIndex = 1
      this.pageSize = 10
      this.totalPage = 0
      this.dataListLoading = true
      this.getDataList()
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl(this.dataUrl),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize,
              prodName: this.prodName ? this.prodName : null,
              partyCode: this.dataForm.partyCode ? this.dataForm.partyCode : null,
              status: 1,
              supplierId: this.supplierId
            }
          )
        )
      }).then(({ data }) => {
        this.loadCheck(data)
        this.dataList = data.records
        this.page.total = data.total
        this.totalPage = data.total
        this.dataListLoading = false
      })
    },
    loadCheck (data) {
      var checkAll = true
      data.records.forEach(prod => {
        if (this.type === 0) {
          prod.type = 1
        }
        if (prod.pic && prod.pic.indexOf('http') === -1 && prod.pic.indexOf('https') === -1) {
          prod.pic = this.resourcesUrl + prod.pic
        }
        var check = true
        prod.disable = true
        prod.skuList.forEach(sku => {
          // 禁用已选择的sku及商品
          if (this.containsId(prod, sku.skuId)) {
            sku.check = true
            sku.disable = true
          } else {
            prod.disable = false
            sku.disable = false
            if (this.containsId(prod, sku.skuId)) {
              sku.check = true
            } else {
              sku.check = false
            }
          }
          if (!sku.check) {
            // 普通商品
            sku.check = this.selectSkuIds.indexOf(sku.skuId) !== -1
          }
          if (check && !sku.check) {
            check = false
          }
        })
        prod.check = check
        if (checkAll && !prod.check) {
          checkAll = false
        }
      })
      this.disable = checkAll
      this.checkAll = checkAll
    },
    containsId (prod, skuId) {
      return this.disableSkuIds.indexOf(skuId) !== -1
    },
    selectProduct (prod, sku) {
      // 勾选
      if (sku.check) {
        if (this.type === 0) {
          if (this.selectSkuIds.indexOf(sku.skuId) !== -1) {
            return
          }
          this.selectProds.push({
            prodId: prod.prodId,
            skuId: sku.skuId,
            prodName: prod.prodName,
            skuName: sku.skuName,
            stocks: sku.stocks,
            partyCode: sku.partyCode,
            pic: prod.pic
          })
        } else if (this.type === 1) {
          // 普通商品
          if (this.selectSkuIds.indexOf(sku.skuId) !== -1) {
            return
          }
          this.selectProds.push({
            prodId: prod.prodId,
            prodName: prod.prodName,
            pic: prod.pic,
            skuId: sku.skuId,
            skuName: sku.skuName,
            stocks: sku.stocks,
            partyCode: sku.partyCode,
            minOrderQuantity: sku.minOrderQuantity,
            purchasePrice: sku.purchasePrice,
            supplierProdId: sku.supplierProdId,
            type: prod.type
          })
        }
        this.selectSkuIds.push(sku.skuId)
      } else {
        if (this.selectSkuIds.indexOf(sku.skuId) === -1) {
          return
        }
        // 取消勾选
        for (var i = 0; i < this.selectProds.length; i++) {
          if (this.selectProds[i].skuId === sku.skuId) {
            this.selectProds.splice(i, 1)
          }
        }
        this.selectSkuIds.splice(this.selectSkuIds.indexOf(sku.skuId), 1)
      }
    },
    checkAllProd () {
      this.dataList.forEach(prod => {
        prod.check = this.checkAll
        prod.skuList.forEach(sku => {
          // 勾选或取消勾选没有被禁用的sku
          if (!sku.disable) {
            sku.check = this.checkAll
            this.selectProduct(prod, sku)
          }
        })
        this.$set(prod, prod)
      })
    },
    checkProd (index) {
      const prod = this.dataList[index]
      prod.skuList.forEach(sku => {
        // 勾选或取消勾选没有被禁用的sku
        if (!sku.disable) {
          sku.check = prod.check
          this.selectProduct(prod, sku)
        }
      })
      this.$set(this.dataList, index, prod)
      this.checkStatus()
    },
    checkSku (index, skuIndex) {
      const prod = this.dataList[index]
      var check = true
      for (var i = 0; i < prod.skuList.length; i++) {
        const sku = prod.skuList[i]
        if (check && !sku.check) {
          check = false
        }
        if (skuIndex === i) {
          this.selectProduct(prod, sku)
        }
      }
      prod.check = check
      this.$set(this.dataList, index, prod)
      this.checkStatus()
    },
    checkStatus () {
      var checkAll = true
      for (var i = 0; i < this.dataList.length; i++) {
        if (!this.dataList[i].check) {
          checkAll = false
          break
        }
        const prod = this.dataList[i]
        for (var j = 0; j < prod.skuList.length; j++) {
          if (!prod.skuList[j].check) {
            checkAll = false
            break
          }
        }
      }
      this.checkAll = checkAll
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
    // 单选商品事件
    getSelectProdRow (row) {
      this.dataListSelections = [row]
    },
    /**
     * 获取分类id
     */
    handleChange (val) {
      this.shopCategoryId = val[val.length - 1]
    },
    /**
     * 根据条件搜索商品
     */
    searchProd () {
      this.pageIndex = 1
      this.getDataList()
    },
    /**
     * 清空搜索条件
     */
    clear () {
      this.dataForm.prodName = ''
      this.dataForm.partyCode = null
    },
    // 确定事件
    submitProds () {
      console.log('this.selectProds', this.selectProds)
      this.$emit('refreshSelectSupplier', this.selectProds)
      this.dataListSelections = []
      this.visible = false
    },
    // 取消事件
    back () {
      this.dataListSelections = []
      this.visible = false
    }
  }
}
</script >
<style lang="scss">
.search {
  width: 100%;
}
.public-height {
  height: 100%;
}
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
.screening-conditions {
  display: block;
  padding: 20px !important;
  background: #f8f8f9;
  margin-bottom: 20px;
}
.operation-box {
}
.submit-box {
  display: inline-block;
  margin-top: 15px;
}
.mod-order-order {
  .main {
    .status-nav {
      position: relative;
      display: block;
      width: 100%;
      margin-bottom: 15px;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #ddd;
      ul,
      li {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .nav-item {
        float: left;
        height: 40px;
        line-height: 40px;
        background: #F7F8FA;
        border: 1px solid #ddd;
        padding: 0 20px;
        margin: 0 -1px -1px 0;
        cursor: pointer;
      }

      .selected {
        background: #fff;
        border-bottom: 1px solid #fff;
      }
    }
    .tit {
      margin-bottom: 15px;
      background: #F7F8FA;
      z-index: 11;
      height: 57px;
      font-weight: bold;
    }
    .column-title {
      text-align: center;
    }
    .transaction-price {
      text-align: right;
    }
    .notData-tip{
      text-align: center;
      color:#999;
    }
  }
  // .prod {
  //   margin-bottom: 15px;
  // }
  .tit {
    display: flex;
    height: 45px;
    align-items: center;
  }
  .tit .item {
    padding: 0 10px;
    width: 10%;
    text-align: center;
  }
  .tit .product {
    width: 25%;
  }
  .prod-tit {
    padding: 10px;
    background: #F7F8FA;
    height: 49px;
    display: flex;
    align-items: center;
    border-left: 1px solid #EBEDF0;
    border-top: 1px solid #EBEDF0;
    border-right: 1px solid #EBEDF0;
  }
  .prod-tit .order-number{
    color: #333333;
    font-size: 14px
  }
  .prod-tit .order-time{
    color: #999999;
    font-size: 14px
  }
  .prod-tit span {
    margin-right: 15px;
  }
  .prod-cont {
    display: flex;
    // border-top: 1px solid #EBEDF0;
    // border-bottom: 1px solid #EBEDF0;
    // border-left: 1px solid #EBEDF0;
    border: 1px solid #EBEDF0;
    color: #495060;
  }
  .prod-cont .item {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    // width: 10%;
    text-align: center;
    height: 100%;
  }
  button.revise-btn {
    margin-top: 10px;
  }
  .el-button--text {
    padding-top: 0;
    padding-bottom: 0;
  }
  // .prod-cont .item span {
  //   display: block;
  // }
  .item span {
    display: inline-block !important;
  }
  .prod-cont .prod-item {
    // width: 38%;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .prod-name {
    width: 55%;
    text-align: left;
    // 超过2行溢出隐藏
    display:-webkit-box;
    word-break: break-word !important;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
    overflow:hidden;
  }
  .prod-con {
    display: block;
    padding: 0 !important;
  }
  .prod-price {
    position: absolute;
    right: 10px;
    text-align: center;
  }
  .prod-price span {
    display: block;
  }
  .prod-price span:first-child {
    margin-bottom: 10px;
  }
  .prod-name .prod-info {
    display: block;
    color: #80848f;
    margin-top: 30px;
  }
  .order-status {
    display: inline-block;
    margin-top: 15px;
    padding: 2px 4px;
    border: 1px solid #e43130;
    border-radius: 2px;
    color: #e43130;
    font-size: 12px;
  }
  .prod-cont .items.name {
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px;
    // height: 100px;
    border-bottom: 1px solid #EBEDF0;
  }
  .prod-cont .items.name:last-child {
    border-bottom: none;
  }
  .prod-image {
    margin-right: 5px; 
    width: 80px;
    height: 80px;
  }
  .prod-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .item span {
    display: block;
  }
  .item .operate {
    color: #2d8cf0;
  }
  .item .operate .el-button + .el-button {
    display: block;
    margin-top: 10px;
    margin-left: 0;
  }
  .item .totalprice {
    color: #c00;
    margin-bottom: 10px;
  }
  .prod .remark {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #e8f7f6;
    border-left: 1px solid #EBEDF0;
    border-right: 1px solid #EBEDF0;
    border-bottom: 1px solid #EBEDF0;
    margin-bottom: 20px;
  }
  .buyer-remark {
    padding: 0 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .empty {
    display: block;
    height: 200px;
    line-height: 200px;
    text-align: center;
    color: #aaa;
  }

  // 修改物流弹窗
  .change-logistics {
    color: #333;
    padding: 0 20px;
  }
  // .change-logistics,
  // .revise-log {
  //   max-height: 300px;
  //   overflow-y: auto;
  // }
  .log-list {
    max-height: 600px;
    overflow-y: auto;
  }

  .log-info-table {
    margin-top: 20px;
    max-height: 600px;
    overflow-y: auto;
  }

  .change-logistics .warning {
    padding: 10px;
    border: 1px solid #f1924e;
    background: #fff5ed;
  }

  .change-logistics .item {
    padding-bottom: 20px;
  }

  .change-logistics .item .i-tit {
    display: flex;
    align-items: center;
  }

  .change-logistics .item .i-tit .big {
    font-weight: 600;
    margin-right: 15px;
  }

  .change-logistics .item .i-con {
    display: flex;
    align-items: center;
    margin-top: 15px;
  }

  .change-logistics .item .i-con .label {
    width: 80px;
  }

  .change-logistics .item .i-con .con {
    display: flex;
    align-items: center;
  }

  .change-logistics .item .i-con .con .con-radio {
    margin-right: 10px;
  }

  .change-logistics .item .i-con .con .con-radio input,
  .change-logistics .item .i-con .con .con-radio span {
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }

  .change-logistics .item .i-con .con .con-radio input[type="radio"] {
    margin-left: 5px;
  }

  .change-logistics .item .i-con .con .con-select {
    position: relative;
    padding: 6px 25px 6px 12px;
    width: 220px;
    height: 32px;
    line-height: 18px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 2px;
  }

  .change-logistics .item .i-con .con .con-select::after {
    position: absolute;
    top: 13px;
    right: 8px;
    display: block;
    width: 0;
    height: 0;
    content: " ";
    font-size: 0;
    border: 5px solid transparent;
    border-top: 5px solid #333;
    border-radius: 2px;
  }

  .change-logistics .item .i-con .con .con-text {
    margin-left: 10px;
    display: flex;
    align-items: center;
  }

  .change-logistics .item .i-con .con .con-text .text {
    width: 80px;
  }

  .change-logistics .item .i-con .con .con-text input[type="text"] {
    border: 1px solid #ddd;
    padding: 0 10px;
    height: 30px;
    width: 160px;
    border-radius: 2px;
  }
  // 修改物流弹窗end

  // 修改物流信息弹窗
  .log-list {
    margin-top: 30px;
  }
  .el-form-item__label {
    width: 100px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .info-int {
    display: flex;
  }
  .form-item {
    margin-right: 15px;
  }
  .info-int .el-form-item__content,
  .info-int .el-form-item__label,
  .el-input__suffix-inner,
  .el-input__icon {
    height: 32px;
    line-height: 32px;
  }
  input.el-input__inner {
    // border: 0;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
  // 修改物流信息弹窗end
  // 确认修改
  .el-table .cell {
    text-align: center;
  }
  .el-form-item__label {
    text-align: left;
  }
  .item-goods {
    position: relative;
    width: 340px;
    height: 85px;
    overflow: hidden;
  }
 .goods-box {
    position: absolute;
    left: 0;
    display: flex;
    margin-top: 0;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
  }

  .goods-box .item {
    margin-right: 10px;
    font-size: 12px;
    cursor: pointer;
  }

  .goods-box .item:last-child {
    margin: 0;
  }

  .goods-box .item .img {
    width: 60px;
    height: 60px;
    font-size: 0;
    margin-bottom: 4px;
    margin-top: 4px;
    position: relative;
  }

  .goods-box .item .img img {
    width: 100%;
    height: 100%;
  }

  .goods-box .item .img .number {
    position: absolute;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    border-radius: 6px 0 6px 0;
    font-size: 12px;
    height: 16px;
    line-height: 16px;
    padding: 0 5px;
  }

  .goods-box .item .name {
    width: 60px;
    height: 16px;
    line-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #999;
  }
}
</style>
<style scoped>
.default-btn + .default-btn {
  margin-left: 0;
}
div >>> .el-tabs__active-bar {
  width: 0 !important;
}
div >>> .el-tabs__item {
  padding: 0 20px !important;
  min-width: 68px;
  width: auto;
  text-align: center;
}
div >>> .el-tabs__item.is-active {
  background: rgba(21, 91, 212, 0.1);
  border-bottom: 2px solid #155BD4;
}
.default-btn {
  margin: 0 12px;
}
.select-time-btn {
  margin: 0 12px;
  display: inline-block;
  color: #AAAAAA;
  font-size: 14px;
  cursor:pointer;
}
.select-time-btn.is-active {
  color: #155BD4;
}
.operate-btn {
  margin: 0 !important;
}
</style>
