<template>
  <el-dialog
    :title="this.$i18n.t('product.chooseProdCateg')"
    :visible.sync="isSingle"
    :before-close="closePopUps"
    style="margin-top: -10vh"
  >
  <div class="prod-category clearfix">
    <div  v-if="!isUnsignedCategories" class="category">
      <!-- 分类 -->
      <div class="category-box">
        <el-input
          :placeholder="this.$i18n.t('product.chooseProdCateg')"
          :disabled="true"
        ></el-input>
        <ul class="category-list">
          <li
            class="category-item"
            :class="item.categoryId == firstCat.id ? 'active' : ''"
            @click="selectFirstCat(item.categoryId, index)"
            v-for="(item, index) in firstCat.dataList"
            :key="item.categoryId"
            v-show="showFirstCat(item.categoryId)"
          >
            {{ item.categoryName }}
            <span class='el-icon-arrow-right' style="float:right"></span>
          </li>
        </ul>
      </div>
      <!-- 分类 -->
      <div class="category-box" v-if="firstCat.id != 0">
        <el-input
          :placeholder="this.$i18n.t('product.productSecondaryClassification')"
          :disabled="true"
        ></el-input>

        <ul class="category-list">
          <li
            class="category-item"
            :class="item.categoryId == secondCat.id ? 'active' : ''"
            @click="selectSecondCat(item.categoryId, index)"
            v-for="(item, index) in secondCat.dataList"
            :key="item.categoryId"
            v-show="showSecondCat(item.categoryId)"
          >
            {{ item.categoryName }}
            <span class='el-icon-arrow-right' style="float:right"></span>
          </li>
        </ul>
      </div>
      <!-- 分类 -->
                <!-- v-model="threeCat.categoryName" -->
      <div class="category-box" v-if="secondCat.id != 0">
        <el-input
          :placeholder="this.$i18n.t('product.productThreeClassification')"
          :disabled="true"
        ></el-input>

        <ul class="category-list">
          <li
            class="category-item"
            :class="item.categoryId == threeCat.id ? 'active' : ''"
            @click="selectThreeCat(item.categoryId, index)"
            v-for="(item, index) in threeCat.dataList"
            :key="item.categoryId"
          >
            {{ item.categoryName }}
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="empty-tips">
      <span class="txt">暂无已签约分类，请前往
        <span class="default-btn text-btn" @click="toShopInfo">店铺信息</span>
      中申请签约</span>
    </div>
    <!-- 当前选择 -->
    <div class="current-selected">
      <span class="blod">{{ $t("product.currCho") }}：</span>
      <span class="select-item">{{ firstCat.categoryName }}</span>
      <span class="select-item" v-if="secondCat.id"
        >&nbsp;>&nbsp;&nbsp;{{ secondCat.categoryName }}</span
      >
      <span class="select-item" v-if="threeCat.id"
        >&nbsp;>&nbsp;&nbsp;{{ threeCat.categoryName }}</span
      >
    </div>
    <!-- 是否新建组合商品 -->
    <div class="current-selected">
      <span class="blod">{{ $t("product.isItAComtionPro") }}：</span>
      <el-radio-group v-model="composeType">
        <el-radio :label="0">{{ $t("live.generalMerchandise") }}</el-radio>
        <el-radio :label="1">{{ $t("product.combinationGoods") }}</el-radio>
      </el-radio-group>
    </div>
    <!-- 阅读规则 -->
    <div class="read-rule">
      <div
        class="read-rule-txt"
        :class="threeCat.id != 0 ? 'todo' : ''"
        @click="submitChoice(1)"
      >
        {{ $t("product.haveReadFol") }}
      </div>
    </div>
    <!-- 规则 -->
    <div class="rule">
      <p class="notice">
        <span class="blod">{{ $t("product.releaseNotice") }}：</span>
        {{ $t("product.banInf") }}
      </p>
      <div class="rule-text">
        <p class="rule-tit blod">{{ $t("product.rule") }}</p>
        <p class="rule-txt">{{ $t("product.userMustFollRule") }}</p>
      </div>
    </div>
  </div>
  </el-dialog>
</template>

<script>
export default {
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

      isUnsignedCategories: false
    }
  },
  created () {
    this.getDataList()
    let showSave = this.$store.state.prod.prodCategory.save

    if (showSave) {
      this.firstCat = JSON.parse(JSON.stringify(this.$store.state.prod.prodCategory.firstCat))
      this.secondCat = JSON.parse(JSON.stringify(this.$store.state.prod.prodCategory.secondCat))
      this.threeCat = JSON.parse(JSON.stringify(this.$store.state.prod.prodCategory.threeCat))
      this.composeType = Number(this.$store.state.prod.prodCategory.composeType)
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    showSecondCat (categoryId) {
      let dataList = this.allDataList.filter(item => item.parentId === categoryId)
      return dataList.length
    },
    showFirstCat (categoryId) {
      let flag = 0
      let dataList = this.allDataList.filter(item => item.parentId === categoryId)
      dataList.forEach(i => {
        if (this.allDataList.filter(item => item.parentId === i.categoryId).length) {
          flag++
        }
      })
      return flag
    },
    getDataList () {
      this.isUnsignedCategories = true
      // 获取产品数据
      this.$http({
        url: this.$http.adornUrl(`/prod/category/listAvailableSigningCategory`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.length) {
          this.allDataList = data
          this.firstCat.dataList = data.filter(item => item.grade === 0)
          this.isUnsignedCategories = false
          if (this.threeCat.id && !data.find(el => el.categoryId === this.threeCat.id)) {
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
            this.getDataList()
          }
        }
      })
    },
    selectFirstCat (categoryId, index) {
      this.secondCat.dataList = this.allDataList.filter(item => item.parentId === categoryId)
      this.firstCat.categoryName = this.firstCat.dataList[index].categoryName
      this.firstCat.id = categoryId
      this.secondCat.id = 0
      this.threeCat.id = 0
    },
    selectSecondCat (categoryId, index) {
      this.threeCat.dataList = this.allDataList.filter(item => item.parentId === categoryId)
      this.secondCat.id = categoryId
      this.secondCat.categoryName = this.secondCat.dataList[index].categoryName
      this.threeCat.id = 0
    },
    selectThreeCat (categoryId, index) {
      this.threeCat.id = categoryId
      this.threeCat.categoryName = this.threeCat.dataList[index].categoryName
    },
    // 新增 / 修改
    goProdInfo () {
      if (!this.secondCat.id) {
        return
      }
      this.$store.commit('common/removeMainActiveTab')
      // if (this.composeType === 1) {
      //   // 是组合商品
      //   console.log('是否为组合商品：' + this.composeType)
      // }
      this.$router.push({
        path: '/prodInfo',
        query: { categoryId: this.threeCat.id, isCompose: this.composeType }
      })
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
          this.$emit('closee', this.isSingle, this.$store.state.prod.prodCategory.threeCat.id, this.$store.state.prod.prodCategory.composeType, this.$store.state.prod.prodCategory.firstCat.categoryName,
                    this.$store.state.prod.prodCategory.secondCat.categoryName, this.$store.state.prod.prodCategory.threeCat.categoryName)
        } else {
          this.$emit('closee', this.isSingle)
        }
      } else {
        this.$emit('closee', this.isSingle, this.threeCat.id, this.composeType, this.firstCat.categoryName,
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
      this.$emit('closee', this.isSingle)
      window.open('/#/shop-shopInfo?navStatus=2', '_blank', 'noopener,noreferrer')
    }

  }
}
</script>
<style lang="scss" scoped>
.prod-category {
  .clearfix::after {
    display: block;
    content: "";
    visibility: hidden;
    height: 0;
    clear: both;
  }
  width: 95%;
  height: 758px;
  overflow-y: auto;
  margin: 0 auto;
  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .tips {
    // display: inline-block;
    float: right;
    padding: 10px 12px;
    background: #155bd4;
    color: #fff;
    font-size: 13px;
    margin: 0;
  }
  .category-box {
    box-sizing: border-box;
    width: 33.33%;
    box-sizing: border-box;
    display: inline-block;
    border: 1px solid #e4e4e4;
    margin-right: -5px;
    padding: 20px;
    background: #fff;
    // box-shadow: 0px 5px 8px -4px #e2e2e2;
  }
  .int {
    width: 100%;
    height: 2.5em;
    line-height: 2.5em;
    text-indent: 1em;
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    outline: none;
    /* box-shadow: 0px 5px 8px -4px #e2e2e2; */
  }
  input.int::placeholder {
    color: #bdbdbd;
  }
  .category-list {
    margin-top: 10px;
    height: 250px;
    margin-left: 10px;
    overflow-y: auto;
  }
  .category-item {
    padding: 6px;
    cursor: pointer;
  }
  .category-item:hover,
  .category-item.active {
    // background: #e9f9ff;
    background: #f5f5f5;
    border-radius: 3px;
  }
  .current-selected {
    margin-top: 20px;
    border: 2px solid #fedbab;
    padding: 6px;
    background: #fffaf2;
    line-height: 1.5em;
  }
  .read-rule {
    width: 100%;
    margin-top: 20px;
  }
  .read-rule-txt {
    text-align: center;
    color: #fff;
    background: #999999;
    line-height: 3em;
    width: 50%;
    margin: 0 auto;
  }
  .rule {
    border: 1px solid #b9b9b9;
    padding: 0 10px;
    font-size: 13px;
    color: #777;
    margin-top: 20px;
  }
  .notice {
    line-height: 3em;
    border-bottom: 1px dashed #b9b9b9;
    margin: 0;
  }
  .blod {
    font-weight: bold;
  }
  .rule-tit {
    text-align: center;
  }
  .rule-txt {
    line-height: 1.5em;
    padding-bottom: 30px;
  }
  .todo {
    background: #155bd4;
    cursor: pointer;
  }

  .empty-tips {
    display: block;
    line-height: 1.5em;
    margin: 30px auto;
    text-align: center;
  }
}
</style>
