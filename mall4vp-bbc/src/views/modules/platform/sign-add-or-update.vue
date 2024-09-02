<template>
  <el-dialog
    :title="dataForm.type === 1
    ? $t('shop.reviewSignCategoriesApply')
    : dataForm.type === 2
    ? $t('shop.reviewSignBrandsApply') : $t('productComm.audit')"
    :visible.sync="visible"
    :close-on-click-modal="false"
    class="sign-add-or-update"
  >
    <!-- 申请签约的类目/品牌列表 -->
    <div class="main-container">
      <div class="table-con">
        <!-- 类目 -->
        <el-table
          v-if="dataForm.type === 1"
          ref="shopSignTable"
          :data="dataList"
          header-cell-class-name="table-header"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            :label="$t('shopProcess.category')"
            align="center"
          />
          <el-table-column
            prop="parentName"
            :label="$t('shopProcess.parentCategoryName')"
            align="center"
          />
          <el-table-column
            prop="platformRate"
            :label="$t('shopProcess.categoryRate')"
            align="center"
          >
            <template slot-scope="{ row }">
              <div v-if="row.customizeRate || row.customizeRate === 0 || row.platformRate || row.platformRate === 0">
                <span v-if="row.customizeRate === null">{{ row.platformRate }} %</span>
                <span v-else>{{ row.customizeRate }} %</span>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="qualifications"
            :label="$t('shopProcess.categoryQualifications')"
            align="center"
          >
            <template slot-scope="{row}">
              <div v-if="row.imgs && row.imgs.length" class="img-box">
                <el-image
                  v-for="(img,index) in row.imgs"
                  :key="index"
                  class="rotating-img"
                  :src="img"
                  :preview-src-list="row.imgs"
                />
              </div>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="categoryStatus"
            :label="$t('shopProcess.categoryStatus')"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.categoryStatus === 1" class="tag-txt">{{ $t('publics.normal') }}</div>
              <div v-if="scope.row.categoryStatus === 0" class="tag-txt red-tag-txt">{{ $t('publics.LowerShelf') }}</div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 品牌 -->
        <div
          v-if="dataForm.type === 2
          && platformBrandList.length
          && customizeBrandList.length"
          class="pla-tit"
        >{{ $t('shopProcess.platformBrand') }}</div>
        <el-table
          v-if="dataForm.type === 2 && platformBrandList.length"
          ref="shopSignTable"
          :data="platformBrandList"
          header-cell-class-name="table-header"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            :label="$t('brand.brandName')"
            align="center"
          />
          <el-table-column
            prop="firstLetter"
            :label="$t('shopProcess.firstLetter')"
            align="center"
          />
          <el-table-column
            prop="platformRate"
            :label="$t('shopProcess.brandLogo')"
            align="center"
          >
            <template slot-scope="scope">
              <div class="brand-logo">
                <el-image
                  v-if="scope.row.imgUrl"
                  class="rotating-img"
                  :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl"
                  :preview-src-list="[scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl]"
                />
                <!-- <img v-if="scope.row.imgUrl" :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl"> -->
                <span v-else>--</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="imgs"
            :label="$t('shopProcess.brandQualifications')"
            align="center"
          >
            <template slot-scope="{row}">
              <div v-if="row.imgs.length" class="brand-logo">
                <el-image
                  v-for="(img,index) in row.imgs"
                  :key="index"
                  class="rotating-img"
                  :src="img"
                  :preview-src-list="row.imgs"
                />
              </div>
              <div v-if="!row.imgs.length">--</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="brandStatus"
            :label="$t('publics.status')"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.brandStatus === 1" class="tag-txt">{{ $t('publics.normal') }}</div>
              <div v-if="scope.row.brandStatus === 0" class="tag-txt red-tag-txt">{{ $t('publics.LowerShelf') }}</div>
            </template>
          </el-table-column>
        </el-table>

        <div
          v-if="dataForm.type === 2
          && customizeBrandList.length"
          class="cus-tit"
        >{{ $t('shopProcess.merchantCustomBrand') }}</div>
        <el-table
          v-if="dataForm.type === 2 && customizeBrandList.length"
          ref="shopSignTable"
          :data="customizeBrandList"
          header-cell-class-name="table-header"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            :label="$t('brand.brandName')"
            align="center"
          />
          <el-table-column
            prop="firstLetter"
            :label="$t('shopProcess.firstLetter')"
            align="center"
          />
          <el-table-column
            prop="platformRate"
            :label="$t('shopProcess.brandLogo')"
            align="center"
          >
            <template slot-scope="scope">
              <div class="brand-logo">
                <el-image
                  v-if="scope.row.imgUrl"
                  class="rotating-img"
                  :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl"
                  :preview-src-list="[scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl]"
                />
                <!-- <img v-if="scope.row.imgUrl" :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl"> -->
                <span v-else>--</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="imgs"
            :label="$t('shopProcess.brandQualifications')"
            align="center"
          >
            <template slot-scope="{row}">
              <div v-if="row.imgs.length" class="brand-logo">
                <el-image
                  v-for="(img,index) in row.imgs"
                  :key="index"
                  class="rotating-img"
                  :src="img"
                  :preview-src-list="row.imgs"
                />
              </div>
              <div v-if="!row.imgs.length">--</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="brandStatus"
            :label="$t('publics.status')"
            width="80"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.brandStatus === 1" class="tag-txt">{{ $t('publics.normal') }}</div>
              <div v-if="scope.row.brandStatus === 0" class="tag-txt red-tag-txt">{{ $t('publics.LowerShelf') }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 审核 -->
    <el-form
      :model="dataForm"
      ref="dataForm"
      label-width="auto"
      size="small"
    >
      <el-form-item
        :label="$t('distributionMsg.auditStatus')"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0" :disabled="true">{{ $t("liveRoom.notReviewed") }}</el-radio>
          <el-radio :label="1">{{ $t("shop.passed") }}</el-radio>
          <el-radio :label="-1">{{ $t("shop.notPass") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.status === -1"
        :label="$t('components.denialReason')" prop="remarks"
      >
        <el-input
          v-model="dataForm.remarks"
          maxlength="50"
          show-word-limit
          type="textarea"
          :placeholder="$t('components.denialReason')"
        ></el-input>
      </el-form-item>
    </el-form>


    <div slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("remindPop.cancel")}}</div>
      <div
        class="default-btn primary-btn"
        @click="dataFormSubmit()"
        >{{ $t("remindPop.confirm") }}</div
      >
    </div>

  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      // 图片前缀
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      visible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {},
      dataList: [],

      // 平台品牌
      platformBrandList: [],
      // 自定义品牌
      customizeBrandList: [],

      // 审核
      dataForm: {
        shopId: 0,
        status: 0, // 0 未审核 1已通过 -1未通过 不传返回全部
        remarks: '',
        type: 1  // 1类目 2品牌
      }
    }
  },

  methods: {
    init (id, type) {
      this.visible = true
      this.dataForm.shopId = id
      this.dataForm.type = type  // 1类目 2品牌
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataList = []
        this.platformBrandList = []
        this.customizeBrandList = []
        this.getDataList()
      })
    },

    /**
     * 获取签约的分类列表（状态参数为空则返回所有）
     */
    getDataList () {
      let url = ''
      url = this.dataForm.type === 1
      ? '/prod/category/signingInfoByShopId'
      : this.dataForm.type === 2
      ? '/platform/brand/listSigningByShopId' : ''
      // status 0 未审核 1已通过 -1未通过 不传返回全部
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          'shopId': this.dataForm.shopId,
          'status': this.dataForm.status
        }, this.searchForm
        ))
      }).then(({ data }) => {
        if (this.dataForm.type === 1) {
          this.dataList = this.handleImgData(data)
          return
        }
        if (this.dataForm.type === 2) {
          this.platformBrandList = this.handleImgData(data.platformBrandList)
          this.customizeBrandList = this.handleImgData(data.customizeBrandList)
        }
      })
    },

    handleImgData (dataList) {
      dataList.forEach(item => {
        const imgUrls = item.qualifications ? item.qualifications.split(',') : []
        if (imgUrls.length) {
          item.imgs = this.handleImgUrl(imgUrls)
        } else {
          item.imgs = []
        }
      })
      return dataList
    },

    handleImgUrl (imgUrls) {
      const imgs = []
      imgUrls.forEach((img, index) => {
        if (img.indexOf('http') === -1 && img.indexOf('https') === -1) {
          const image = this.resourcesUrl + img
          imgs.push(image)
        } else {
          imgs.push(img)
        }
      })
      return imgs
    },

    /**
     * 审核
     */
    dataFormSubmit () {
      if (this.dataForm.status === 0) {
        this.$message({
          message: this.$i18n.t('distributionMsg.tip2'),
          type: 'error',
          duration: 1000
        })
        return
      }
      if (this.dataForm.status === -1 && (!this.dataForm.remarks || !this.dataForm.remarks.trim())) {
        this.$message({
          message: this.$i18n.t('shopProcess.notApprovedReason'),
          type: 'error',
          duration: 1000
        })
        return
      }
      this.$http({
        url: this.$http.adornUrl('/platform/signingAuditing/audit'),
        method: 'PUT',
        data: this.dataForm
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1000,
          onClose: () => {
            this.visible = false
            this.$emit('refreshDataList')
          }
        })
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.sign-add-or-update {
  & >>> .el-dialog__body {
    padding-top: 20px;
  }
  .main-container {
    padding: 0;
    margin-top: 0;
    & >>> .el-table__body-wrapper {
      max-height: 350px;
      overflow-y: auto;
    }
    & >>> .img-box {
      text-align: center;
    }
    .rotating-img {
      display: inline-block;
      width: 60px;
      height: 60px;
    }
    .rotating-img:not(:last-child) {
      margin-right: 5px;
    }
    .pla-tit,
    .cus-tit {
      margin-bottom: 10px;
      font-weight: bold;
      color: #333;
    }
    .cus-tit {
      margin-top: 25px;
    }
  }
}
</style>
