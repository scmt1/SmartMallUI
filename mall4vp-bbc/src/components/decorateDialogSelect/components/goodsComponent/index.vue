<template>
  <div class="goods-modal-content">
    <div class="goods-form">
      <el-form inline ref="searchForm" :model="searchForm" label-width="90px">
          <el-form-item label="店铺" prop="shopId">
              <el-select
                      filterable
                      v-model="searchForm.shopId"
                      placeholder="请选择店铺"
                      style="width: 100%"
              >
                  <el-option
                          v-for="item in shopList"
                          :key="item.shopId"
                          :label="item.shopName"
                          :value="item.shopId"
                  >
                  </el-option>
              </el-select>
          </el-form-item>
      <el-form-item :label="$t('shopFeature.goods.prodName') + '：'">
        <el-input v-model.trim="searchForm.keyword" :placeholder="$t('pcdecorate.shopMessage.prodNameTips')"></el-input>
      </el-form-item>
        <!-- <el-form-item
          v-if="!prodType"
          :label="$t('pcdecorate.shopMessage.goodsType')+'：'">
          <el-select
            v-model="searchForm.prodType"
            :placeholder="$t('pcdecorate.placeholder.selectGoods')"
            clearable>
            <el-option
              v-for="(item, index) in goodsTypeList"
              :key="index"
              :label="item.label"
              :value="item.value">
              {{item.label}}
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('pcdecorate.shopMessage.goodsCategory')+'：'">
          <el-cascader
            expand-trigger="hover"
            :options="categoryList"
            :props="categoryTreeProps"
            :clearable="true"
            v-model="selectedCategory"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="searchbtn" @click="handleSearch">{{$t('pcdecorate.commonModal.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table
        ref="multipTable"
        style="width: 100%"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        row-key="prodId"
        :data="tableList"
        height="320"
        v-loading="tableLoading"
        :class="{'tables-checkedbox': !isMulilt}"
        @select="handleCancelSelected"
        @selection-change="handleSelectChange">
          <el-table-column type="selection" :reserve-selection="true"></el-table-column>
          <el-table-column
            prop="shopName"
            min-width="100px"
            :label="$t('pcdecorate.shopMessage.shopName')"
            align="left"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="prodName"
            min-width="150px"
            :label="$t('pcdecorate.shopMessage.goods')"
            align="left"
            show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="names" style="display: flex;align-items: center">
                  <el-image
                    :src="scope.row.pic"
                    style="width: 48px;height: 48px;margin-right: 15px">
                    <div slot="error" class="image-slot">
                      <img src="@/assets/img/def.png">
                    </div>
                  </el-image>
                  <span
                    style="width: calc(100% - 65px);overflow:hidden;text-overflow: ellipsis;white-space: nowrap">{{scope.row.prodName}}</span>
                </div>
              </template>
          </el-table-column>
          <el-table-column
              prop="price"
              width="140px"
              :label="$t('pcdecorate.shopMessage.goodsPrice')"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <span style="color: #E1251B ">￥{{scope.row.price}}</span>
              </template>
          </el-table-column>
          <el-table-column prop="totalStocks" width="120px" :label="$t('pcdecorate.shopMessage.inventory')" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 12px; text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="perProps.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="perProps.perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="perProps.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { treeDataTranslate } from '@/utils'
export default {
  props: {
    activeName: {
      type: String,
      default: () => ''
    },
    currentGoodsType: { // 商品类型
      type: String,
      default: () => 'normal'
    },
    goodsType: { // 商品类型(对应PC端的限时秒和优惠团购)
      type: String | Number,
      default: () => ''
    },
    isMulilt: { // 是否支持多选
      type: Boolean,
      default: () => false
    },
    goodsNumber: { // 限制添加的个数
      type: Number | String,
      default: () => 0
    },
    dataUrl: { // 活动的url
      type: String
    },
    prodType: { // 类型(对于移动端的限时秒杀和团购)
      type: Number
    },
    deviceType: { // 弹窗类型 pc端： pc , 移动:mobile
      type: String,
      default: () => 'pc'
    },
    echoDataList: { // 回显数据
      type: Array,
      default: () => []
    },
    customLinkArr: { // 自定义链接回显数据
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      searchForm: {}, //  查询条件
      tableList: [], // 商品列表
      multipleSelection: [], // 表格选中的数据
      tableLoading: false, // 表格的loading
      perProps: { // 分页
        perPage: 10,
        page: 1,
        total: 0
      },
      goodsTypeList: [ // 商品类型下拉列表
        { label: this.$i18n.t('pcdecorate.commonModal.goodsType.normalgoods'), value: 0 },
        { label: this.$i18n.t('pcdecorate.commonModal.goodsType.spellgroup'), value: 1 },
        { label: this.$i18n.t('pcdecorate.commonModal.goodsType.secondskill'), value: 2 },
        { label: this.$i18n.t('pcdecorate.commonModal.goodsType.activitiy'), value: 5}
      ],
      categoryList: [], // 商品分类下拉列表
      selectedCategory: [], // 选中的商品分类
      categoryTreeProps: {
        value: 'categoryId',
        label: 'categoryName'
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      showEchData: [], // 回显数据
      flag: false,
      singleSelected: {}, // 单选选中的
      shopList: [],
    }
  },
  methods: {
      // 这里拿到取消选中的哪项
    handleCancelSelected (rows, row) {
      let selected = rows.length && rows.indexOf(row) != -1
      if (this.isMulilt) { // 如果当前是多选
          // 如果当前是取消勾选的情况
        if (!selected) {
          this.showEchData.forEach((item, index) => {
            if (item.prodId == row.prodId) {
              this.showEchData.splice(index, 1)
            }
          })
          this.multipleSelection.forEach((item, index) => {
            if (item.prodId == row.prodId) {
              this.multipleSelection.splice(index, 1)
            }
          })
        }
        this.$emit('handleGoodsSelect', { type: 'goodsItem', value: this.multipleSelection})
      } else { // 单选
        if (!selected) { // 取消选中
          this.multipleSelection = []
          setTimeout(() => {
            this.multipleSelection.push(row)
            this.$refs.multipTable.toggleRowSelection(row, true)
          }, 100)
        }
      }
    },
    handleSelectChange (rows) {
      if (this.flag) return
      if (this.isMulilt) { // 当前支持多选
        this.multipleSelection = this.removeDuplicCateObj([...this.multipleSelection, ...rows])
        if (this.goodsNumber != 0) { // 如果不为0的情况下，说明用户限制了当前选择的数量
          if (this.multipleSelection.length > this.goodsNumber) {
            let del_row = this.multipleSelection.shift()
            this.tableList.forEach(item => {
              if (del_row.prodId == item.prodId) {
                this.$refs.multipTable.toggleRowSelection(item, false)
              }
            })
          }
        }
        this.$emit('handleGoodsSelect', { type: 'goodsItem', value: this.multipleSelection})
      } else { // 否则就是单选
        this.multipleSelection = rows
        if (this.multipleSelection.length > 1) {
          let del_row = this.multipleSelection.shift()
          this.tableList.forEach(item => {
            if (del_row.prodId == item.prodId) {
              this.$refs.multipTable.toggleRowSelection(item, false)
            }
          })
        }
        this.$emit('handleGoodsSelect', { type: 'goodsItem', value: this.multipleSelection[0]})
      }
    },
      // 移除重复
    removeDuplicCateObj (arr) {
      let obj = {}
      arr = arr.reduce((newArr, next) => {
        obj[next.prodId] ? '' : (obj[next.prodId] = true && newArr.push(next))
        return newArr
      }, [])
      return arr
    },
      // 获取商品信息
    getGoodsListMessage (val) {
      if (val === 'search') {
        this.perProps.page = 1
      }
      let { page, perPage} = this.perProps
      if (this.dataUrl) { // 活动url存在
        this.tableLoading = true
        this.$http({
          url: this.$http.adornUrl(this.dataUrl),
          method: 'get',
          params: this.$http.adornParams({
            current: page,
            size: perPage,
            categoryId: this.searchForm.categoryId, // 商品分类
            prodType: this.prodType, // 商品类型
            keyword: this.searchForm.keyword, // 商品名称
            status: 1,
            isActive: 1 // 过滤活动商品
          })
        }).then(({data}) => {
          data.records.forEach(item => {
            if (item.pic.indexOf('http') === -1 && item.pic.indexOf('https') === -1) {
              item.pic = this.resourcesUrl + item.pic
            }
          })
          this.tableList = data.records
          this.perProps.total = data.total
          this.tableLoading = false
          this.setDataShow(val)
        }).catch(err => {
          this.tableLoading = false
        })
      } else { // 普通商品
        this.tableLoading = true
        this.$http({
          url: this.$http.adornUrl('/platform/search/prod/renovationPage'),
          method: 'get',
          params: this.$http.adornParams({
            prodType: this.searchForm.prodType, // 商品类型
            categoryId: this.searchForm.categoryId, // 商品分类
            keyword: this.searchForm.keyword, // 商品名称
            shopId: this.searchForm.shopId,
            current: page,
            size: perPage,
            status: 1
          })
        }).then(({data}) => {
          this.tableList = data.records
          this.perProps.total = data.total
          this.tableLoading = false
          this.setDataShow(val) // 选中数据回显
        }).catch((error) => {
          this.tableLoading = false
        })
      }
    },
      // 分页每页多少条
    handleSizeChange (val) {
      this.perProps.perPage = val
      this.showEchData = this.multipleSelection
      this.getGoodsListMessage()
    },
      // 分页当前第几页
    handleCurrentChange (val) {
      this.perProps.page = val
      this.showEchData = this.multipleSelection
      this.getGoodsListMessage()
    },
      // 搜索
    handleSearch () {
      this.getGoodsListMessage('search')
    },
      // 选择商品分类
    handleChange (val) {
      this.$set(this.searchForm, 'categoryId', val[val.length - 1])
    },
      // 获取商品分类
    getGoodsCategoryList () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/prod/category/listCategory'),
          method: 'get',
          params: this.$http.adornParams({
            maxGrade: 2,
            status: 1
          })
        }).then(({data}) => {
          this.categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
          this.$set(this.searchForm, 'prodType', this.goodsType)
          resolve(true)
        }).catch((err) => {

        })
      })
    },
      // 数据回显
    setDataShow (val) {
      this.flag = true
      let arr = []
      let otherArr = []
      let userArr = []
      this.$nextTick(() => {
        if (val === 'search') {
          this.$refs.multipTable && this.$refs.multipTable.clearSelection() // 清除上一次回显内容
        }
        this.tableList.forEach(item => {
          this.showEchData.forEach(v => {
            if (item.prodId === v.prodId) { // 设置当前页的选中
              arr.push(item)
              this.$refs.multipTable && this.$refs.multipTable.toggleRowSelection(item, true)
            } else if (item.prodId != v.prodId) { // 不是当前页的也要记录下来
              otherArr.push(v)
              otherArr = this.removeDuplicCateObj(otherArr)
            }
          })
        })
        userArr = [...arr, ...otherArr]
        userArr = this.removeDuplicCateObj(userArr)
          // 回显的时候，需要emit通知父组件这次是回显，可以直接点击确定
        if (this.isShowData() || !this.isMulilt) { // 单选通知
          this.$emit('handleGoodsSelect', { type: 'goodsItem', value: userArr[0]})
        } else { // 多选通知
          this.$emit('handleGoodsSelect', { type: 'goodsItem', value: userArr})
        }
        setTimeout(() => {
          this.flag = false
        }, 200)
      })
    },
      // 判断当前是否是多选回显还是单选回显
    isShowData () {
      return this.customLinkArr && this.customLinkArr.type != '' && this.customLinkArr.type === '1'
    },
    compoundName () {
      this.showEchData.forEach(item => {
        item.prodName = item.name || item.prodName // 商品名称
        item.pic = item.imgs || item.pic // 商品图片
        item.brief = item.description || item.brief // 商品描述
        item.oriPrice = item.orignPrice ? item.orignPrice : item.oriPrice ? item.oriPrice : '' // 商品原价
        if (this.goodsType == 2) {
          item.prodId = item.prodId // 商品id
          item.activityId = item.id // 活动id
        } else {
          item.prodId = item.id || item.prodId // 商品id
        }
      })
    },
    // 获取所有营业店铺
    getShopList() {
      this.$http({
        url: this.$http.adornUrl("/platform/shopDetail/getAllShop"),
        method: "get",
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        this.shopList = data;
      });
    },
  },
  watch: {
    async activeName (val) { // 监听当前激活的是
      if (val === '1') { // 当前是选择商品
        this.$set(this.searchForm, 'keyword', '')
        this.$set(this.searchForm, 'shopId', '')
        this.selectedCategory = ''
        this.$set(this.searchForm, 'categoryId', '')
          // 获取商品分类
        await this.getGoodsCategoryList()
        this.getShopList();
          // 回显数据
        if (this.isShowData()) { // 判断如果在操作热区
          let obj = {
            name: this.customLinkArr.title,
            id: this.customLinkArr.link,
            imgs: '',
            brief: ''
          }
          let arr = []
          arr.push(obj)
          this.showEchData = JSON.parse(JSON.stringify(arr))
            // 做这一步是为了商品组件等下可以将之前选的数据和用户操作的商品进行合并(保证点击确定的时候字段名一样)
          if (!this.prodType) { // 非移动活动商品
            this.compoundName()
          }
          this.multipleSelection = this.showEchData
        } else {
          this.showEchData = JSON.parse(JSON.stringify(this.echoDataList))
          this.multipleSelection = this.showEchData
          if (!this.prodType) { // 非移动活动商品
            this.compoundName()
          }
        }
          // 获取商品列表
        await this.getGoodsListMessage('search')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-modal-content {
  .goods-form {
    .searchbtn {
      width: 68px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #155BD4;
      border-radius: 2px;
      margin: 4px 0 0 10px;
    }
  }
  .tables {
    width: 93%;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}
</style>
<style lang="scss">
.goods-modal-content {
  min-height: 450px;
  max-height: 450px;
  height: 450px;
  overflow-y: auto;
  .goods-form {
    .el-input__inner {
      height: 32px;
    }
  }
  .table-header {
    &:nth-child(1) {
      .cell {
          display: none;
      }
    }
  }
}
.tables-checkedbox {
  .el-checkbox {
    .el-checkbox__inner {
        position: relative;
        &:after {
          border: 0;
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fff;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    .el-checkbox__inner {
        border-radius: 50%;
    }
    &.is-checked {
      .el-checkbox__inner {
        position: relative;
        &:after {
          border: 0;
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fff;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
}
</style>
