<template>
  <el-dialog
    :title="this.$i18n.t('product.select')"
    :modal="false"
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
            <el-form-item :label="this.$i18n.t('product.itemName') + '：'" :label-width=" lang === 'en' ? '145px' : '85px'">
              <el-input
                v-model="prodName"
                :placeholder="this.$i18n.t('product.itemName')"
                clearable
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item :label="this.$i18n.t('product.singleProductBar') + '：'" :label-width=" lang === 'en' ? '145px' : '85px'">
              <el-input
                v-model="barCode"
                :placeholder="this.$i18n.t('product.singleProductBar')"
                clearable
                size="small"
              ></el-input>
            </el-form-item>

            <div class="operation-box">
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
            </div>
          </div>
        </el-form>
      </div>
      <!-- {{ "已选择：" + this.selectIds.length + '件商品'}} -->
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
              <el-col :span="3" class="column-title">
                <span class="item">{{ $t("product.singleProdPic") }}</span>
              </el-col>
              <el-col :span="4" class="column-title">
                <span class="item">{{ $t("product.itemName") }}</span>
              </el-col>
              <el-col :span="3" class="column-title">
                <span class="item">{{ $t("product.singleProdSpe") }}</span>
              </el-col>
              <el-col :span="3" class="column-title">
                <span class="item">{{ $t("product.singleProd") }}</span>
              </el-col>
              <el-col :span="3" class="column-title">
                <span class="item">{{ $t("product.singleProdInve") }}</span>
              </el-col>
              <el-col :span="4" class="column-title">
                <span class="item">{{ $t("product.singleProductBar") }}</span>
              </el-col>
              <el-col :span="3" class="column-title">
                <span class="item">{{ $t("product.singleProdClas") }}</span>
              </el-col>
            </el-row>
          </div>

          <div
            class="prod"
            v-for="prod in dataList"
            :key="prod.prodId"
            style="margin-bottom: 15px"
          >
            <div class="prod-cont">
              <el-row style="width: 100%">
                <el-col :span="1" style="height: 100%">
                  <div class="item">
                    <el-checkbox v-model="prod.check" @change="checkProd(prod)" :disabled="prod.disable"></el-checkbox>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="prod-item">
                    <div class="item">
                      <div class="prod-image">
                        <img v-if="prod.pic" :src="prod.pic" />
                        <img v-else src="../../assets/img/def.png" width="60" height="60" />
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="prod-item">
                    <div class="item">
                      {{prod.name}}
                    </div>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="prod-item">
                    <div class="item">
                      {{prod.spec}}
                    </div>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="prod-item">
                    <div class="item">
                      {{prod.costPrice}}
                    </div>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="prod-item">
                    <div class="item">
                      {{prod.stocks}}
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="prod-item">
                    <div class="item">
                      {{prod.barCode}}
                    </div>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="prod-item">
                    <div class="item">
                      {{prod.categoryName}}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <el-pagination
        v-if="dataList.length"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      </div>
    </div>
    <!-- 提交及返回按钮 -->
    <div slot="footer" class="dialog-footer">
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
      selectIds: [],
      retailProdIds: [],
      dataList: [],
      prodName: '',
      barCode: '',
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
      default: '/shop/retailProd/page',
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
      this.retailProdIds = data.retailProdIds ? data.retailProdIds : []
      this.visible = true
      this.checkAll = false
      this.selectProds = []
      this.selectIds = []
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
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
              name: this.prodName ? this.prodName : null,
              barCode: this.barCode,
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
        if (prod.pic && prod.pic.indexOf('http') === -1 && prod.pic.indexOf('https') === -1) {
          prod.pic = this.resourcesUrl + prod.pic
        }
        var check = true
        prod.disable = true
        // 禁用已选择的商品
        if (this.retailProdIds.indexOf(prod.retailProdId) === -1) {
          prod.disable = false
          if (check) {
            check = false
          }
        }
        prod.check = check
        if (checkAll && !prod.check) {
          checkAll = false
        }
      })
      this.disable = checkAll
      this.checkAll = checkAll
    },
    selectProduct (prod) {
      if (prod.disable) {
        return
      }
      // 勾选
      if (prod.check) {
        if (this.selectIds.indexOf(prod.retailProdId) !== -1) {
          return
        }
        this.selectProds.push({
          retailProdId: prod.retailProdId,
          prodName: prod.name,
          stocks: prod.stocks,
          spec: prod.spec,
          partyCode: prod.barCode,
          pic: prod.pic,
          price: prod.costPrice
        })
        this.selectIds.push(prod.retailProdId)
      } else {
        if (this.selectIds.indexOf(prod.retailProdId) === -1) {
          return
        }
        // 取消勾选
        for (var i = 0; i < this.selectProds.length; i++) {
          if (this.selectProds[i].retailProdId === prod.retailProdId) {
            this.selectProds.splice(i, 1)
          }
        }
        this.selectIds.splice(this.selectIds.indexOf(prod.retailProdId), 1)
      }
      // console.log('this.length', this.selectProds.length, this.selectIds.length)
    },
    checkAllProd () {
      this.dataList.forEach(prod => {
        prod.check = this.checkAll
        this.selectProduct(prod)
        this.$set(prod, prod)
      })
    },
    checkProd (prod) {
      this.selectProduct(prod)
      this.checkStatus()
    },
    checkStatus () {
      var checkAll = true
      for (var i = 0; i < this.dataList.length; i++) {
        if (!this.dataList[i].check) {
          checkAll = false
          break
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
      this.prodName = ''
      this.barCode = ''
    },
    // 确定事件
    submitProds () {
      this.$emit('refreshSelectRetailProds', this.selectProds)
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
</script>
