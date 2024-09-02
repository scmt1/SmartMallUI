<template>
<!-- 签约信息 -->
  <div class="shop-signing-list">
    <div class="signing-content">
      <!-- 表格上方标题 -->
      <div class="table-data-title">
        <div class="text">
          <span v-if="signingType === 1" class="stress">*</span>{{ $t('shopProcess.signing') }}{{ signingType === 2 ? $t('shopProcess.brand') : $t('shopProcess.category')}}
        </div>
        <div class="tips">
          {{ $t('shopProcess.chosen') }}
          <span class="txt-bold">{{ dataList.length }}</span>
          {{ $t('shopProcess.piece') }}{{ signingType === 2 ? $t('shopProcess.brand') : $t('shopProcess.category')}}&nbsp;{{ $t('shopProcess.mostAdd') }}
          <span class="txt-bold">{{ signingType === 2 ? maxNumOfBrandsSigneds : maxNumOfCategoriesSigneds}}</span>
          {{ $t('shopProcess.piece') }}{{ signingType === 2 ? $t('shopProcess.brand') : $t('shopProcess.category')}}
        </div>
        <div v-if="!isNotEdit" class="edit-btn default-btn primary-btn" @click="addOrUpdateHandle()">
          {{ signingType === 2 ? $t('shopProcess.editSigningBrand') : $t('shopProcess.editSigningCategory')}}
        </div>
      </div>

      <!-- 类目表格 -->
      <div v-if="signingType === 1" class="table-con signing-table">
        <el-table
          ref="categoriesSigningTable"
          :data="dataList"
          header-cell-class-name="table-header"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            :label="this.$i18n.t('shopProcess.categoryName')"
          />
          <el-table-column
            prop="parentName"
            :label="this.$i18n.t('shopProcess.parentCategoryName')"
          />
          <el-table-column
            prop="platformRate"
            :label="this.$i18n.t('shopProcess.categoryRate')"
          >
            <template slot-scope="{ row }">
              <span v-if="row.platformRate || row.platformRate === 0">{{ row.platformRate }} %</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="imgs"
            :label="this.$i18n.t('shopProcess.categoryQualifications')"
          >
            <template slot-scope="{row}">
              <div v-if="row.imgs.length" class="img-box">
                <el-image
                  v-for="(img,index) in row.imgs"
                  :key="index"
                  class="info-img"
                  :src="img"
                  :preview-src-list="row.imgs"
                />
                <!-- <img
                  v-for="(item, index) in row.imgs"
                  :key="index"
                  :src="item.indexOf('http')===-1 ? resourcesUrl + item : item"
                  @click="picturePreview(item)"
                > -->
              </div>
              <span v-if="!row.imgs.length">--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="categoryStatus"
            :label="this.$i18n.t('shopProcess.categoryStatus')"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.categoryStatus === 1">{{ $t('publics.normal') }}</div>
              <div v-if="scope.row.categoryStatus === 0">{{ $t('publics.LowerShelf') }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 品牌表格 -->
      <div v-if="signingType === 2" class="table-con signing-table">
        <el-table
          ref="brandsSigningTable"
          :data="dataList"
          header-cell-class-name="table-header"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            :label="this.$i18n.t('shopProcess.brandName')"
          />
          <el-table-column
            prop="firstLetter"
            :label="this.$i18n.t('shopProcess.firstLetter')"
            align="center"
          />
          <el-table-column
            prop="brandLogo"
            :label="this.$i18n.t('shopProcess.brandLogo')"
          >
            <template slot-scope="scope">
              <div class="brand-logo img-box">
                <el-image
                  v-if="scope.row.imgUrl"
                  class="info-img"
                  :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl"
                  :preview-src-list="scope.row.imgUrl.indexOf('http')===-1 ? [resourcesUrl + scope.row.imgUrl] : [scope.row.imgUrl]"
                />
                <!-- <img v-if="scope.row.imgUrl" :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl" @click="picturePreview(scope.row.imgUrl)"> -->
                <span v-if="!scope.row.imgUrl">--</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="imgs"
            :label="this.$i18n.t('shopProcess.brandQualifications')"
          >
            <template slot-scope="{row}">
              <div v-if="row.imgs.length" class="brand-logo img-box">
                <el-image
                  v-for="(item,index) in row.imgs"
                  :key="index"
                  class="info-img"
                  :src="item"
                  :preview-src-list="row.imgs"
                />
              </div>
              <div v-if="!row.imgs.length">--</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="brandStatus"
            :label="this.$i18n.t('shopProcess.brandStatus')"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.brandStatus === -1" class="tag-txt">{{ $t('shop.notAudit') }}</div>
              <div v-if="scope.row.brandStatus === 1" class="tag-txt">{{ $t('publics.normal') }}</div>
              <div v-if="scope.row.brandStatus === 0" class="tag-txt red-tag-txt">{{ $t('publics.LowerShelf') }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 类目签约弹窗 -->
    <category-add-or-update
      v-if="cateAddOrUpdateVisible"
      ref="cateAddOrUpdate"
      :isCreate="true"
      :isFirst="false"
      :sign-category-list="signCategories"
      @closePopup="closePopup"
    />
    <!-- 品牌签约弹窗 -->
    <brand-add-or-update
      v-if="brandAddOrUpdateVisible"
      :isFirst="false"
      :brandNameList="brandNameList"
      ref="brandAddOrUpdate"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import categoryAddOrUpdate from './category-add-or-update'
import brandAddOrUpdate from './brand-add-or-update'
export default {
  components: {
    categoryAddOrUpdate,
    brandAddOrUpdate
  },
  props: {
    // 申请步骤 3.签约信息
    applyStep: {
      default: 3,
      type: String / Number
    },
    // 是否不可以编辑信息, 当申请状态为待审核时不能编辑
    isNotEdit: {
      default: false,
      type: Boolean
    },
    // 店铺申请状态 0：未审核 1：已通过 -1：未通过 -2：未提交过申请
    applyStatus: {
      default: 0,
      type: String / Number
    },
    // 签约类型：1类目 2品牌
    signingType: {
      default: 1,
      type: Number
    }
  },
  data () {
    return {
      // 图片前缀
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,

      // 最大类目签约数量
      maxNumOfCategoriesSigneds: 200,
      // 最大品牌签约数量
      maxNumOfBrandsSigneds: 50,
      // 签约（类目/品牌）列表
      dataList: [],

      // 签约类目列表
      signCategories: [],

      // 类目签约弹窗显隐
      cateAddOrUpdateVisible: false,
      // 品牌签约弹窗显隐
      brandAddOrUpdateVisible: false,
      // 已有品牌类目
      brandNameList: []
    }
  },

  mounted () {
    if (this.applyStep === 3 && this.signingType === 1) {
      // 类目
      this.getSignedCategories()
    }
    if (this.applyStep === 3 && this.signingType === 2) {
      this.getSignedBrands()
    }
  },

  methods: {
    /**
     * 签约类目列表
     */
    getSignedCategories () {
      this.$http({
        url: this.$http.adornUrl(`/prod/category/listSigningCategory`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data) {
          this.signCategories = data
          this.signCategories.forEach(item => {
            item.imgs = item.qualifications ? item.qualifications.split(',') : []
            if (item.imgs.length) {
              item.imgs.forEach(img => {
                img = this.getImgSrc(img)
              })
            }
          })
          this.dataList = this.signCategories
          this.$emit('getCategories', this.signCategories)
        }
      })
    },

    /**
     * 获取图片路径
     */
    getImgSrc (img) {
      if (!img) {
        return ''
      }
      if (img.indexOf('http://') === 0 || img.indexOf('https://') === 0) {
        return img
      }
      return this.resourcesUrl + img
    },

    /**
     * 获取签约品牌列表
     */
    getSignedBrands () {
      this.$http({
        url: this.$http.adornUrl(`/admin/brand/listSigningBrand`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data) {
          let signedBrands = []
          let brandNameList = []
          data.platformBrandList.forEach(item => {
            brandNameList.push(item.name)
          })
          data.platformBrandList.length ? signedBrands.push(...data.platformBrandList) : signedBrands = []
          data.customizeBrandList.forEach(el => { el.brandStatus = -1 })
          if (data.customizeBrandList.length > 0) {
            signedBrands.push(...data.customizeBrandList)
          }
          signedBrands.forEach(item => {
            // item.imgs = item.qualifications ? item.qualifications.split(',') : []
            item.imgs = item.qualifications ? item.qualifications.split(',') : []
            if (item.imgs.length) {
              item.imgs.forEach(img => {
                img = this.getImgSrc(img)
              })
            }
          })
          this.dataList = signedBrands
          this.brandNameList = brandNameList
        }
      })
    },

    /**
     * 编辑签约信息弹窗
     */
    addOrUpdateHandle () {
      if (this.applyStatus === 0) {
        return
      }
      if (this.signingType === 1) {
        this.cateAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.cateAddOrUpdate.init()
        })
        return
      }
      if (this.signingType === 2) {
        this.brandAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.brandAddOrUpdate.init()
        })
      }
    },

    /**
     * 关闭弹窗
     */
    closePopup (val) {
      if (val === 'category') {
        this.cateAddOrUpdateVisible = false
        this.getSignedCategories()
      } else if (val === 'brand') {
        this.brandAddOrUpdateVisible = false
        this.getSignedBrands()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-signing-list {
  .signing-content {
    display: block;
    width: 90%;
    margin: 0 auto;
  }
  // 表格上方标题
  .table-data-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .text {
      font-size: 16px;
      .stress {
        color: #FF2120;
        padding-right: 5px;
      }
    }
    .tips {
      font-size: 12px;
      color: #999;
      margin-left: 10px;
      .txt-bold {
        color: #333;
      }
    }
    .edit-btn {
      width: auto;
      min-width: 117px;
      padding: 0 8px;
      height: 30px;
      line-height: 28px;
      font-size: 14px;
      // color: #1890FF;
      // background: #FFFFFF;
      text-align: center;
      // border: 1px solid #1890FF;
      border-radius: 2px;
      box-sizing: border-box;
      margin-left: auto;
      cursor: pointer;
    }
  }

  // 表格
  .table-con.signing-table {
    margin-bottom: 30px;
    // 表格滚动条设置
    & >>> .el-table__body-wrapper {
      max-height: 312px;
      overflow-y: scroll;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
    }
    & >>> .el-table__body-wrapper::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    & >>> .el-table__body {
      width: 100%;
    }
    .img-box {
      display: block;
      width: 100%;
      height: 60px;
      & .info-img {
        width: 60px;
        height: 60px;
        margin-right: 5px;
      }
    }
  }

}
</style>
