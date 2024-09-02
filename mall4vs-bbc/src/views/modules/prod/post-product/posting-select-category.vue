<template>
<!-- 发布商品：01、选择商品类目 -->
  <div class="posting-select-category">
    <!-- 商品类型 -->
    <div class="prod-type-box">
      <div class="prod-title-row">
        <span>{{ $t("product.prodMold") }}</span>
      </div>
      <div class="type-select">
        <!-- 实物商品（物流发货） -->
        <div
          class="type-item"
          :class="{'active': value.mold !== 1}"
          @click="switchProdType(0)"
        >
          <div class="big-txt">{{ $t("product.physicalGoods") }}</div>
          <div class="weak-txt">{{ $t("product.logisticsDelivery") }}</div>
          <i class="active-icon"></i>
        </div>
        <!-- 虚拟商品（无需物流） -->
        <div
          class="type-item"
          :class="{'active': value.mold === 1}"
          @click="switchProdType(1)"
        >
          <div class="big-txt">{{ $t("product.virtualGoods") }}</div>
          <div class="weak-txt">{{ $t("product.noLogisticsRequired") }}</div>
          <i class="active-icon"></i>
        </div>
        <!-- 商品模板（模板导入） -->
        <!-- <div
          class="type-item"
          :class="{'active': value.prodType === 3}"
          @click="switchProdType(3)"
        >
          <div class="big-txt">{{ $t("product.productTemplates") }}</div>
          <div class="weak-txt">{{ $t("product.templateImport") }}</div>
          <i class="active-icon"></i>
        </div> -->
      </div>
    </div>

    <!-- 商品分类 -->
    <div class="prod-category-box">
      <div class="prod-title-row">
        <span>{{ $t("product.productCategories") }}</span>
      </div>
      <div class="select-category-containers">
        <!-- 选择平台类目 -->
        <div class="category-com">
          <div class="title"><span class="stress">*</span>{{ $t("product.selectPlatformCategoryOnly") }}：</div>
          <categorySelection :categoryId="value.categoryId" :categoryType="'platform'" @close="getSelectedCategory(arguments)" @reSelection="reSelectionCategory" />
        </div>
        <!-- 选择店铺分类 -->
        <div class="category-com">
          <div class="title"><span class="stress">*</span>{{ $t("product.selectShopCategory") }}：</div>
          <categorySelection :categoryId="value.shopCategoryId" :categoryType="'store'" @close="getSelectedCategory(arguments)" @reSelection="reSelectionCategory" />
        </div>
      </div>
    </div>

    <!-- 模板导入 -->
    <prod-upload
      v-if="uploadVisible"
      ref="prodUpload"
      @refreshDataList="getWaitingConsignmentExcel"
    ></prod-upload>
  </div>
</template>

<script>
import categorySelection from './category-selection'
import ProdUpload from '../prod-upload'
export default {
  components: {
    categorySelection,
    ProdUpload
  },
  props: {
    value: {
      default: {},
      type: Object
    }
  },
  data () {
    return {
      // 分类名称组合
      categoryName: '',
      // 分类类型
      categoryType: '',
      // 模板导入
      uploadVisible: false
    }
  },
  watch: {
    value (newVal, oldVal) {
      this.$forceUpdate()
    },
    categoryName (newVal, oldVal) {
      this.$emit('selectedCategoryName', newVal, this.categoryType)
    }
  },

  methods: {
    /**
     * 切换商品类型
     */
    switchProdType (type) {
      if (this.value.prodId) {
        if (type !== this.value.mold) {
          this.$message({
            message: this.$i18n.t('product.cannotModifyProdType'),
            type: 'error',
            duration: 1500,
            onClose: () => {
            }
          })
          return
        }
      }
      this.$set(this.value, 'mold', type)
      if (type === 3) {
        // 模板导入
        this.getUpload()
      }
    },
    // 跳转至导入选择
    getUpload () {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.prodUpload.init()
      })
    },
     // 刷新数据
    getWaitingConsignmentExcel () {
      this.$emit('refreshDataForm')
    },

    /**
     * 获取选定的类别
     */
    getSelectedCategory (flag) {
      // 分类类型（平台/店铺）
      this.categoryType = flag[0]
      // 选择的末级分类id
      if (flag[0] === 'platform') {
        this.$set(this.value, 'categoryId', flag[1])
      }
      if (flag[0] === 'store') {
        this.$set(this.value, 'shopCategoryId', flag[1])
      }
      // 是否组合商品
      // this.$set(this.value, 'isCompose', flag[2])
      // 分类名称展示
      this.categoryName = flag[5] && flag[4] && flag[3] ? flag[3] + ' > ' + flag[4] + ' > ' + flag[5]
                          : flag[4] && flag[3] ? flag[3] + ' > ' + flag[4]
                          : flag[3] ? flag[3] : ''
    },
    /**
     * 重选分类
     */
    reSelectionCategory (categoryType) {
      if (categoryType === 'platform' && this.value.categoryId) {
        this.$set(this.value, 'categoryId', null)
        this.categoryName = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.posting-select-category {
  // 商品类型
  .prod-type-box {
    .type-select {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .type-item:not(:last-child) {
        margin-right: 10px;
      }
      .type-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        padding: 16px;
        border: 1px solid #DCDCDC;
        cursor: pointer;
        .weak-txt {
          font-size: 12px;
          color: #999;
        }
        &.active {
          border-color: #155BD4;
          .big-txt {
            color: #155BD4;
          }
          .active-icon {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 0;
            height: 0;
            border-bottom: 20px solid #155BD4;
            border-left: 20px solid transparent;
            &::after {
              content: "";
              position: absolute;
              right: 2px;
              bottom: -16px;
              width: 10px;
              height: 5px;
              border: 1px solid #fff;
              border-radius: 1px;
              border-top: none;
              border-right: none;
              background: transparent;
              transform: rotate(-45deg);
            }
          }
        }
      }
      .type-item:last-child {
        &.active {
          .active-icon {
            right: -1px;
          }
        }
      }
    }
  }

  // 商品分类
  .prod-category-box {
    margin-top: 30px;
    .select-category-containers {
      .category-com {
        display: inline-block;
        margin-right: 50px;
        .title {
          font-size: 12px;
          margin-bottom: 10px;
          .stress {
            font-size: 14px;
            color: #D40000;
            padding-right: 4px;
          }
        }
      }
    }
  }
}
</style>
