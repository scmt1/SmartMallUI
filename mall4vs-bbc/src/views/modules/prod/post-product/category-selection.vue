<template>
<!-- 发布商品：分类选择组件 -->
  <div class="category-selection-component">
    <div class="category-select-box">
      <!-- 第一级 -->
      <div class="category-select-item">
        <div class="int-box">
          <input disabled class="se-int" :placeholder="this.$i18n.t('product.selectFirstLevelCategory')"></input>
        </div>
        <ul class="category-list">
          <li
            v-show="showFirstCat(item.categoryId)"
            v-for="(item, index) in firstCat.dataList"
            :key="item.categoryId"
            class="category-item"
            :class="item.categoryId == firstCat.id ? 'active' : ''"
            @click="selectFirstCat(item.categoryId, index)"
          >
            {{ categoryType === 'store' && lang === 'en' ? item.categoryNameEn : item.categoryName }}
            <span v-if="categoryType === 'platform'" class='el-icon-arrow-right' style="float:right"></span>
          </li>
          <div class="category-empty-tips" v-if="!initCategoryIng && categoryType === 'platform' && !allDataList.length">{{ $t('product.noContractedCategories') }}
            <span class="default-btn text-btn" @click="toShopInfo">{{$t('product.shopInfo')}}</span>
            {{ $t('product.applyContracting') }}
          </div>
          <div class="category-empty-tips" v-if="!initCategoryIng && categoryType === 'store' && !allDataList.length">{{ $t('product.noShopCategories') }}
            <span class="default-btn text-btn" @click="toCategory">{{$t('menuList.classificationManage')}}</span>
            {{ $t('product.createShopCategory') }}
          </div>
        </ul>
      </div>
      <!-- 第二级 v-if="firstCat.id !== 0 && secondCat.dataList.length" -->
      <div v-if="categoryType === 'platform' && firstCat.dataList.length" class="category-select-item">
        <div class="int-box">
          <input disabled class="se-int" :placeholder="this.$i18n.t('product.selectSecondLevelCategory')"></input>
        </div>
        <ul class="category-list">
          <li
            v-show="showSecondCat(item.categoryId)"
            v-for="(item, index) in secondCat.dataList"
            :key="item.categoryId"
            class="category-item"
            :class="item.categoryId == secondCat.id ? 'active' : ''"
            @click="selectSecondCat(item.categoryId, index)"
          >
            {{ item.categoryName }}
            <span v-if="categoryType === 'platform'" class='el-icon-arrow-right' style="float:right"></span>
          </li>
          <li v-if="!secondCat.dataList.length" class="cate-empty">{{$t('product.selectFirstCategory')}}</li>
        </ul>
      </div>
      <!-- 第三级 v-if="secondCat.id !== 0 && threeCat.dataList.length && categoryType === 'platform'" -->
      <div v-if="categoryType === 'platform' && firstCat.dataList.length" class="category-select-item">
        <div class="int-box">
          <input disabled class="se-int" :placeholder="this.$i18n.t('product.selectThirdLevelCategory')"></input>
        </div>
        <ul class="category-list">
          <li
            v-for="(item, index) in threeCat.dataList"
            :key="item.categoryId"
            class="category-item"
            :class="item.categoryId == threeCat.id ? 'active' : ''"
            @click="selectThreeCat(item.categoryId, index)"
          >
            {{ item.categoryName }}
            <!-- <span class='el-icon-arrow-right' style="float:right"></span> -->
          </li>
          <li v-if="!threeCat.dataList.length" class="cate-empty">{{$t('product.selectSecondCategory')}}</li>
        </ul>
      </div>
    </div>

    <!-- 已选 -->
    <div class="selected-results">
      <div v-if="categoryType === 'platform'" class="sel-con">
        {{ $t("product.selectedPlatformCategories") }}：
        <span class="cur-cate">{{ firstCat.categoryName }}</span>
        <span v-if="secondCat.id" class="cur-cate">&nbsp;>&nbsp;&nbsp;{{ secondCat.categoryName }}</span>
        <span v-if="threeCat.id" class="cur-cate">&nbsp;>&nbsp;&nbsp;{{ threeCat.categoryName }}</span>
      </div>
      <div v-if="categoryType === 'store'" class="sel-con">
        {{ $t("product.selectedShopCategories") }}：
        <span class="cur-cate">{{ firstCat.categoryName }}</span>
        <span v-if="secondCat.id" class="cur-cate">&nbsp;>&nbsp;&nbsp;{{ secondCat.categoryName }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['noshopCategoryId'],
  props: {
    // 分类类型：platfor平台分类 store店铺分类
    categoryType: {
      default: 'platform',
      type: String
    },
    categoryId: {
      default: null,
      type: String / Number
    }
  },
  data () {
    return {
      isSingle: true,
      // 第一个分类
      firstCat: {
        id: 0,
        categoryName: '',
        dataList: []
      },
      // 第二个分类
      secondCat: {
        id: 0,
        categoryName: '',
        dataList: []
      },
      // 第三个分类
      threeCat: {
        id: 0,
        categoryName: '',
        dataList: []
      },
      allDataList: [],
      composeType: 0, // 是否是组合商品
      initCategoryIng: true,
      isUnsignedCategories: false,
      lang: window.localStorage.getItem('lang')
    }
  },
  created () {
    this.initCategoryIng = true
    this.clearAllCategories()
    // 请求分类列表
    this.getDataList()
  },

  methods: {
    showSecondCat (categoryId) {
      let dataList = this.allDataList.filter(item => item.parentId === categoryId)
      return dataList.length
    },
    showFirstCat (categoryId) {
      if (this.categoryType === 'store') {
        return true
      }
      let flag = 0
      let dataList = this.allDataList.filter(item => item.parentId === categoryId)
      dataList.forEach(i => {
        if (this.allDataList.filter(item => item.parentId === i.categoryId).length) {
          flag++
        }
      })
      return flag
    },
    /**
     * 获取分类数据
     */
    getDataList () {
      const that = this
      this.isUnsignedCategories = true
      const url = this.categoryType === 'platform'
                  ? '/prod/category/listAvailableSigningCategory'
                  : '/prod/category/listCategory'
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'get',
        params: this.categoryType === 'store' ? this.$http.adornParams({ status: 1 }) : this.$http.adornParams()
      }).then(({ data }) => {
        this.allDataList = data
        this.firstCat.dataList = data.filter(item => item.grade === 0 && item.status)
        if (this.categoryType === 'store' && this.categoryId) {
          let categoryIdList = this.firstCat.dataList.map((item) => { return item.categoryId })
          if (categoryIdList.indexOf(this.categoryId) < 0) {
            console.log(categoryIdList, this.categoryId, categoryIdList.indexOf(this.categoryId))
            this.noshopCategoryId()
          }
        }
        this.isUnsignedCategories = false
        if (this.threeCat.id && !data.find(el => el.categoryId === this.threeCat.id)) {
          this.clearAllCategories()
        }
        // 存在传入的categoryId且最新分类列表中包含categoryId
        if (this.categoryId && this.allDataList.find(el => el.categoryId === this.categoryId)) {
          this.categoryBackDisplay(data)
        } else {
          // 有传入categoryId但是最新分类列表中无对应categoryId（例：已选categoryId被删除），则必须重选
          this.resetCategory(true)
          this.categoryBackDisplay(data)
        }
        this.initCategoryIng = false
        console.log(this.firstCat, 'this.firstCatthis.firstCatthis.firstCat')
      }).catch(() => {
        this.initCategoryIng = false
      })
    },

    /**
     * 分类数据回显
     */
    categoryBackDisplay (data) {
      data.forEach((el, index) => {
        if (this.categoryType === 'platform') {
          // 根据第三级分类id回填第二级分类id（parentId）
          if (el.categoryId === this.categoryId) {
            this.$set(this.secondCat, 'id', el.parentId)
            this.$set(this.threeCat, 'categoryName', el.categoryName)
          }
          // 根据第二级分类id回填第一级分类id（parentId）
          if (el.categoryId === this.secondCat.id) {
            this.$set(this.firstCat, 'id', el.parentId)
            this.$set(this.secondCat, 'categoryName', el.categoryName)
          }
          // 第一级分类名称
          if (el.categoryId === this.firstCat.id) {
            this.$set(this.firstCat, 'categoryName', el.categoryName)
            this.selectFirstCat(this.firstCat.id, null)
            this.selectSecondCat(this.secondCat.id, null)
            this.selectThreeCat(this.categoryId, null)
          }
        }
        if (this.categoryType === 'store') {
          this.firstCat.id = this.categoryId
          if (el.categoryId === this.categoryId) {
            this.firstCat.categoryName = this.$i18n.t('language') === 'English' ? el.categoryNameEn : el.categoryName
            this.selectFirstCat(this.firstCat.id)
          }
        }
      })
    },

    // 重选
    resetCategory (isRequired) {
      this.threeCat = { id: 0, categoryName: '', dataList: [] }
      // 如果点击时已存在categoryId，表示正在重选分类
      if (this.categoryType === 'platform' && (this.categoryId || isRequired)) {
        this.$emit('reSelection', this.categoryType)
      }
    },

    selectFirstCat (categoryId, index) {
      this.firstCat.id = categoryId
      if (index !== null && index !== undefined) {
        this.resetCategory()
        this.firstCat.categoryName = this.categoryType === 'store' && this.lang === 'en' ? this.firstCat.dataList[index].categoryNameEn : this.firstCat.dataList[index].categoryName
        this.secondCat.id = 0
        this.threeCat.id = 0
      }
      this.secondCat.dataList = this.allDataList.filter(item => item.parentId === categoryId)
      if (this.categoryType === 'store') {
        this.$emit('close', this.categoryType, this.firstCat.id, this.composeType, this.firstCat.categoryName)
        this.$store.commit('prod/addStoreProdCategory', {
          firstCat: JSON.parse(JSON.stringify(this.firstCat)),
          // save: true,
          composeType: this.composeType
        })
      } else {
        this.$emit('close', this.categoryType)
      }
    },
    selectSecondCat (categoryId, index) {
      this.secondCat.id = categoryId
      if (index !== null && index !== undefined) {
        this.resetCategory()
        this.secondCat.categoryName = this.secondCat.dataList[index].categoryName
        this.threeCat.id = 0
      }
      this.threeCat.dataList = this.allDataList.filter(item => item.parentId === categoryId)
      if (this.categoryType === 'platform') {
        this.$emit('close', this.categoryType)
      }
    },
    selectThreeCat (categoryId, index) {
      this.threeCat.id = categoryId
      if (index !== null && index !== undefined) {
        this.threeCat.categoryName = this.threeCat.dataList[index].categoryName
      }
      if (this.categoryType === 'platform') {
        this.$emit('close', this.categoryType, this.threeCat.id, this.composeType, this.firstCat.categoryName,
          this.secondCat.categoryName, this.threeCat.categoryName)
        this.$store.commit('prod/addPlatProdCategory', {
          firstCat: JSON.parse(JSON.stringify(this.firstCat)),
          secondCat: JSON.parse(JSON.stringify(this.secondCat)),
          threeCat: JSON.parse(JSON.stringify(this.threeCat)),
          // save: true,
          composeType: this.composeType
        })
      }
    },

    // 提交选择分类
    submitChoice (type) {
      if (!this.threeCat.id) {
        return
      }
      this.handleClose(type)
    },

    // 右上角X关闭弹窗
    closePopUps (type) {
      this.handleClose(type)
    },

    handleClose (type) {
      this.isSingle = false
      if (type !== 1) {
        if (this.$store.state.prod.prodCategory.save) {
          this.$emit('close', this.isSingle, this.$store.state.prod.prodCategory.threeCat.id, this.$store.state.prod.prodCategory.composeType, this.$store.state.prod.prodCategory.firstCat.categoryName,
                    this.$store.state.prod.prodCategory.secondCat.categoryName, this.$store.state.prod.prodCategory.threeCat.categoryName)
        } else {
          this.$emit('close', this.isSingle)
        }
      } else {
        this.$emit('close', this.isSingle, this.threeCat.id, this.composeType, this.firstCat.categoryName,
        this.secondCat.categoryName, this.threeCat.categoryName)
        this.$store.commit('prod/addProdCategory', {
          firstCat: this.firstCat,
          secondCat: this.secondCat,
          threeCat: this.threeCat,
          save: true,
          composeType: this.composeType
        })
      }
    },

    toShopInfo () {
      this.isSingle = false
      this.$emit('close', this.isSingle)
      window.open(location.href.split('#')[0] + '#/shop-shopInfo?navStatus=2', '_blank', 'noopener,noreferrer')
    },

    toCategory () {
      this.isSingle = false
      this.$emit('close', this.isSingle)
      window.open(location.href.split('#')[0] + '#/prod-category', '_blank', 'noopener,noreferrer')
    },

    /**
     * 清空已选分类
     */
    clearAllCategories () {
      this.firstCat = {
        id: 0,
        categoryName: '',
        dataList: []
      }
      this.secondCat = {
        id: 0,
        categoryName: '',
        dataList: []
      }
      this.threeCat = {
        id: 0,
        categoryName: '',
        dataList: []
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.category-selection-component {
  margin-bottom: 15px;
  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .category-select-box {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    .category-select-item:not(:last-child) {
      margin-right: 10px;
    }
    .category-select-item {
      width: 240px;
      height: auto;
      box-sizing: border-box;
      border: 1px solid #DCDCDC;
      .int-box {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        .se-int {
          width: 100%;
          height: 30px;
          line-height: 30px;
          &::placeholder {
            font-size: 12px;
            color: #999;
            padding: 6px;
            box-sizing: border-box;
          }
        }
      }
      .category-list {
        // margin: 10px;
        height: 240px;
        overflow-y: auto;
        .category-item {
          font-size: 12px;
          color: #333;
          padding: 8px;
          box-sizing: border-box;
          cursor: pointer;
          & ::v-deep .el-icon-arrow-right {
            color: #999;
          }
        }
        .category-empty-tips {
          font-size: 12px;
          color: #333;
          padding: 0 10px;
          margin-top: 45px;
        }
        .ca-up-btn {
          font-size: 12px;
          color: #333;
          padding: 0 10px;
        }
        .category-item:hover {
          background: rgba(245,248,255, .6);
          border-radius: 2px;
        }
        .category-item.active {
          background: #e8effa;
          border-radius: 2px;
        }
      }

      // 空
      .cate-empty {
        margin-top: 50px;
        color: #bbb;
        text-align: center;
        font-size: 12px;
        padding: 0 10px;
        box-sizing: border-box;
        line-height: 1.5em;
      }
    }
  }

  // 已选中
  .selected-results {
    margin-top: 10px;
    .sel-con {
      display: block;
      background: #f9f9f9;
      font-size: 12px;
      padding: 10px;
      margin-bottom: 20px;
      .cur-cate {
        color: #155BD4;
      }
    }
  }
}
</style>
