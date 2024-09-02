<template>
  <!-- 品牌签约弹窗 -->
  <el-dialog
    :visible.sync="visible"
    :show-close="false"
    :append-to-body="true"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    top="10vh"
    width="70%"
    class="shop-in-category-pup-dialog"
  >
    <div class="popup">
      <div class="title">
        <div class="text">{{ $t('shopProcess.applySigningBrand') }}</div>
        <div class="tips">
          <span v-if="isFirst">
            {{ $t('shopProcess.preSigned') }}
            <span class="bold">{{ signingCount }}</span>
            {{ $t('shopProcess.piece') }}{{ $t('shopProcess.brand') }}，
          </span>
          <span >{{ $t('shopProcess.chosen') }}&nbsp;</span>
          <span class="bold">{{ (signBrandList.length + dataForm.customSignBrandList.length) }}</span>
          {{ $t('shopProcess.piece') }}{{ $t('shopProcess.brand') }}，
          {{ $t('shopProcess.mostAdd') }}
          <span class="bold">50</span>
          {{ $t('shopProcess.piece') }}{{ $t('shopProcess.brand') }}
        </div>
        <div class="close-btn" @click="closePopup"><i class="el-icon-close" /></div>
      </div>
      <div class="content">
        <div class="left-box">
          <div class="search-box">
            <input v-model="keyword" class="search-input" @keyup.enter="searchBrand" :placeholder="this.$i18n.t('product.pleaEntBraName')">
            <div class="search-btn" @click="searchBrand">
              <i class="el-icon-search" />
            </div>
          </div>
          <div class="brand-box">
            <div class="brand-list">
              <div
                v-for="(item, index) in allBrandList"
                :key="index"
                class="brand-item"
                :class="{'active':item.isSelected===true}"
                @click="addBrand(item, index)"
              >
                <el-tooltip
                  :content="item.name"
                  placement="right"
                  effect="light"
                  :open-delay="500"
                >
                  <div class="brand-item-txt">{{ item.name }}</div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="right-box">
          <div class="table-box" :class="{'big-tb': !showCustomization}">
            <!-- height="482" -->
            <el-table
              :data="signBrandList"
              :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
            >
              <el-table-column
                prop="name"
                :label="this.$i18n.t('shopProcess.brandName')"
              />
              <el-table-column
                prop="firstLetter"
                :label="this.$i18n.t('shopProcess.firstLetter')"
              />
              <el-table-column
                prop="imgUrl"
                :label="this.$i18n.t('shopProcess.brandLogo')"
              >
                <template slot-scope="scope">
                  <img :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl" style="width:57px;height:57px">
                </template>
              </el-table-column>
              <el-table-column
                prop="qualifications"
                :label="this.$i18n.t('shopProcess.brandQualifications')"
                width="250px"
              >
                <template slot-scope="scope">
                  <div class="business-qual">
                    <imgs-upload
                      v-model="scope.row.qualifications"
                      :limit="2"
                      :prompt="false"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                :label="this.$i18n.t('sys.operation')"
                align="center"
              >
                <template slot-scope="scope">
                  <div class="default-btn text-btn" @click="deleteBrand(scope.row.brandId, scope.$index)">{{ $t('text.delBtn') }}</div>
                  <!-- <el-button type="text" @click="deleteBrand(scope.row.brandId, scope.$index)">删除</el-button> -->
                </template>
              </el-table-column>
            </el-table>

          </div>
          <div v-if="showCustomization" class="custom-box">
            <div class="text">{{ $t('shopProcess.customBrand') }}</div>
            <div class="add-btn default-btn" @click="addCustomBrand">{{ $t('shopProcess.add') }}&nbsp;{{ $t('shopProcess.customBrand') }}</div>
          </div>
          <!-- 添加自定义品牌 -->
          <div v-if="dataForm.customSignBrandList.length && showCustomization" class="table-box">
            <el-form
              ref="bankCartInfoForm"
              :model="dataForm"
              :rules="dataForm.customSignBrandRule"
              size="small"
            >
              <!-- height="265" -->
              <el-table
                class="add-bank-info-table"
                :data="dataForm.customSignBrandList"
                :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
              >
                <el-table-column
                  :label="this.$i18n.t('shopProcess.brandName')"
                  prop="name"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'customSignBrandList.' + scope.$index + '.name'"
                      :rules="dataForm.customSignBrandRule.name"
                    >
                      <el-input
                        v-model="scope.row.name"
                        :placeholder="$t('shopProcess.brandName')"
                        maxlength="30"
                        style="width:100%"
                        @blur="
                          scope.row.name =
                          scope.row.name ?
                          removeHeadAndTailSpaces(scope.row.name) :
                          scope.row.name;verifyBrandName(scope.row.name, scope.$index)
                        "
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="firstLetter"
                  :label="this.$i18n.t('shopProcess.firstLetter')"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'customSignBrandList.' + scope.$index + '.firstLetter'"
                      :rules="dataForm.customSignBrandRule.firstLetter"
                    >
                      <el-input v-model="scope.row.firstLetter" maxlength="1" :placeholder="$t('shopProcess.firstLetter')" style="width:100%" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="imgUrl"
                  :label="this.$i18n.t('shopProcess.brandLogo')"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :rules="dataForm.customSignBrandRule.logo"
                      :prop="'customSignBrandList.' + scope.$index + '.imgUrl'"
                    >
                      <div class="business-qual">
                        <img-upload v-model="scope.row.imgUrl" @input="imgChange(scope.row.imgUrl)" />
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="qualifications"
                  :label="this.$i18n.t('shopProcess.brandQualifications')"
                  width="200px"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'customSignBrandList.' + scope.$index + '.qualifications'"
                      :rules="dataForm.customSignBrandRule.qualifications"
                    >
                      <div class="business-qual">
                        <imgs-upload
                          v-model="scope.row.qualifications"
                          :limit="2"
                          :prompt="false"
                          @input="imgChange(scope.row.qualifications)"
                        />
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="address"
                  :label="this.$i18n.t('sys.operation')"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div class="default-btn text-btn" @click="deleteCustomBrandItem(scope.$index)">{{ $t('text.delBtn') }}</div>
                    <!-- <el-button type="text" @click="deleteCustomBrandItem(scope.$index)">删除</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </div>
      </div>

      <div class="btn-row foot-btn">
        <div class="default-btn" @click="closePopup">{{ $t('homes.no') }}</div>
        <div class="default-btn primary-btn" @click="comfirmSubmit">{{ $t('homes.yes') }}</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
// import * as api from '@/api/multishop/shop-process'
import imgsUpload from '@/components/imgs-upload'
import imgUpload from '@/components/img-upload'
import { removeHeadAndTailSpaces } from '@/utils/validate'
export default {
  components: {
    imgsUpload,
    imgUpload
  },
  props: {
    /**
     * 是否从店铺信息申请签约
     * applyForSign=true时，请求可以签约的平台品牌列表（已经签约的平台品牌不会返回）
     */
    applyForSign: {
      type: Boolean,
      default: false
    },
    signingCount: {
      type: Number,
      default: 0
    },
    isFirst: {
      type: Boolean,
      default: true
    },
    brandNameList: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    const validateFirstLetter = (rule, value, callback) => {
      const regexp = /^[A-Z]{1}$/
      if (!regexp.test(value)) {
        callback(new Error(this.$i18n.t('product.firstLetterErrorTips')))
      } else {
        callback()
      }
    }
    return {
      removeHeadAndTailSpaces: removeHeadAndTailSpaces,
      visible: false,
      // 图片前缀
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      keyword: '',
      allBrandList: [],
      signBrandList: [],
      dataForm: {
        customSignBrandList: [],
        customSignBrandRule: {
          name: [
            { required: true, message: this.$i18n.t('publics.noNull'), trigger: 'blur' },
            { min: 1, max: 50, message: this.$i18n.t('product.brandNameErrorTips'), trigger: 'blur' }
          ],
          firstLetter: [
            { required: true, message: this.$i18n.t('publics.noNull'), trigger: 'blur' },
            { validator: validateFirstLetter, trigger: 'blur' }
          ],
          logo: [
            { required: true, message: this.$i18n.t('product.brandLogoNotEmpty'), trigger: 'blur' }
          ],
          qualifications: [
            { required: true, message: this.$i18n.t('shopProcess.brandQualificationsNotEmpty'), trigger: 'blur' }
          ]
        }
      },
      filterBrandList: [],
      imgs: '',

      // 是否显示自定义品牌
      showCustomization: true,
      brandNameInputList: this.brandNameList
    }
  },
  watch: {
    brandNameList (val) {
      this.brandNameInputList = val
    }
  },
  methods: {
    // 初始化
    init (pageType) {
      this.visible = true
      if (pageType === 'editor') {
        this.showCustomization = false
      }
      this.getPlatformBrand()
      if (!this.applyForSign) {
        this.getSignBrandList()
      }
    },

    /**
     * 上传图片的值发生改变，重新校验表单
     */
    imgChange (value) {
      if (value) {
        this.$refs.bankCartInfoForm.validate()
      }
    },

    /**
     * 获取平台全部品牌
     */
    getPlatformBrand () {
      this.$http({
        url: this.applyForSign ? this.$http.adornUrl(`/shop/signingAuditing/listApplySigningBrand`) : this.$http.adornUrl(`/admin/brand/list`),
        method: 'get',
        params: this.$http.adornParams({ name: this.keyword, status: 1 })
      }).then(({ data }) => {
        const signBrandList = this.signBrandList
        const allBrandList = data
        if (this.showCustomization) {
          data.forEach(item => {
            this.brandNameInputList.push(item.name)
          })
          this.brandNameInputList = [...new Set(this.brandNameInputList)]
        }
        this.brandEcho(allBrandList, signBrandList)
      })
    },

    // 校验品牌名称是否重复
    verifyBrandName (value, index) {
      var nameList = this.dataForm.customSignBrandList.map((item, i) => {
        if (index !== i && item.name) {
          return item.name
        }
      })
      const bankNameList = [...new Set(nameList), ...new Set(this.brandNameInputList)]
      if (bankNameList.indexOf(value) >= 0) {
        let data = this.dataForm.customSignBrandList[index]
        data.name = ''
        this.$set(this.dataForm.customSignBrandList, index, data)
        this.$message({
          message: this.$i18n.t('shopProcess.brandNameRepeatTip'),
          type: 'error',
          duration: 1000
        })
      }
    },

    /**
     * 左侧回显选中品牌或已签约品牌
     * @param {Array} allBrandList 全部品牌
     * @param {Array} signBrandList 选中品牌和已签约品牌
     */
    brandEcho (allBrandList, signBrandList) {
      allBrandList.forEach(item => {
        item.isSelected = false
      })
      if (signBrandList.length > 0 && allBrandList.length > 0) {
        for (let i = 0; i < signBrandList.length; i++) {
          for (let j = 0; j < allBrandList.length; j++) {
            if (signBrandList[i].brandId === allBrandList[j].brandId) {
              allBrandList[j].isSelected = true
              break
            }
          }
        }
      }
      this.allBrandList = allBrandList
    },

    /**
     * 获取签约品牌列表
     */
    getSignBrandList () {
      this.$http({
        url: this.$http.adornUrl(`/admin/brand/listSigningBrand`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.signBrandList = data.platformBrandList
        this.dataForm.customSignBrandList = data.customizeBrandList
        const allBrandList = this.allBrandList
        const signBrandList = this.signBrandList
        this.brandEcho(allBrandList, signBrandList)
      })
    },

    /**
     * 搜索品牌
     */
    searchBrand () {
      this.getPlatformBrand()
    },

    /**
     * 选中添加品牌
     */
    addBrand (brandObj, index) {
      const length = this.signBrandList.length + this.dataForm.customSignBrandList.length + this.signingCount
      if (length >= 50) {
        this.$message.warning(this.$i18n.t('shopProcess.brandMaxLimitTips'))
      } else {
        if (brandObj.isSelected === false) {
          this.signBrandList.push(brandObj)
        }
        this.allBrandList[index].isSelected = true
      }
    },

    /**
     * 添加自定义品牌
     */
    addCustomBrand () {
      const length = this.signBrandList.length + this.dataForm.customSignBrandList.length
      if (length >= 50) {
        this.$message.warning(this.$i18n.t('shopProcess.brandMaxLimitTips'))
        return
      }
      this.dataForm.customSignBrandList.push(
        {
          name: '',
          // alias: '', // 品牌别名
          imgUrl: '',
          qualifications: ''
        }
      )
    },

    /**
     * 删除自定义品牌项
     */
    deleteCustomBrandItem (index) {
      this.dataForm.customSignBrandList.splice(index, 1)
    },

    /**
     * 删除选中品牌
     * @param {Number} id 品牌id
     * @param {Number} index 选中品牌列表索引
     */
    deleteBrand (id, index) {
      // 去除选中样式
      this.allBrandList.forEach(brandItem => {
        if (brandItem.brandId === id) {
          brandItem.isSelected = false
        }
      })
      this.signBrandList.splice(index, 1)
    },

    /**
     * 签约品牌
     */
    signBrand () {
      const params = {
        platformBrandList: [],
        customizeBrandList: []
      }
      this.signBrandList.forEach(item => {
        const param = {
          brandId: item.brandId,
          name: item.name,
          imgUrl: item.imgUrl,
          qualifications: item.qualifications
        }
        params.platformBrandList.push(param)
      })
      params.customizeBrandList = this.dataForm.customSignBrandList
      this.$http({
        url: this.applyForSign ? this.$http.adornUrl('/shop/signingAuditing/addSigningBrand') : this.$http.adornUrl('/admin/brand/signing'),
        method: 'post',
        data: this.$http.adornData(params)
      }).then(({ data }) => {
        this.$message({
          message: this.applyForSign ? this.$i18n.t('shopProcess.brandAddSuccess') : this.$i18n.t('shopProcess.brandSaveSuccess'),
          type: 'success',
          duration: 1000
        })
        this.closePopup()
      })
    },

    /**
     * 确认提交
     */
    comfirmSubmit () {
      let pass = true
      if (this.dataForm.customSignBrandList.length) {
        this.$refs['bankCartInfoForm'].validate((valid) => {
          if (!valid) {
            pass = false
            return
          }
          if (this.dataForm.customSignBrandList && this.dataForm.customSignBrandList.find(el => !el.imgUrl)) {
            this.$message.error(this.$i18n.t('product.brandLogoNotEmpty'))
            pass = false
            return
          }
          if (this.dataForm.customSignBrandList && this.dataForm.customSignBrandList.find(el => !el.qualifications)) {
            this.$message.error(this.$i18n.t('shopProcess.brandQualificationsNotEmpty'))
            pass = false
          }
        })
      }
      if (this.signBrandList.find(el => !el.qualifications)) {
        this.$message.error(this.$i18n.t('shopProcess.brandQualificationsNotEmpty'))
        pass = false
        return
      }
      if (!this.signBrandList.length && !this.dataForm.customSignBrandList.length) {
        this.$message.error(this.$i18n.t('shopProcess.noBrandSelected'))
        pass = false
        return
      }
      if (pass) {
        this.signBrand()
      }
    },

    /**
     * 关闭弹窗
     */
    closePopup () {
      this.$emit('closePopup', 'brand')
    },
    beforeClose (done) {
      this.$emit('closePopup', 'brand')
      deno()
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-in-category-pup-dialog {
  & ::v-deep .el-dialog__header {
    padding: 0;
  }
  & ::v-deep .el-dialog__body {
    padding-top: 0;
  }
  & ::v-deep .el-dialog {
    min-width: 950px;
  }
  .popup {
    display: block;
    // 表格上的标题
    .title {
      display: flex;
      align-items: center;
      width: 100%;
      height: 64px;
      border-bottom: 1px solid #EAEAEA;
      .text {
        height: 23px;
        line-height: 21px;
        font-size: 16px;
        .stress {
          color: #FF2120;
          padding-right: 5px;
        }
      }
      .tips {
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        color: #999;
        margin-left: 10px;
        .bold {
          color: #000;
        }
      }
      .close-btn {
        font-size: 23px;
        color: #999;
        margin-left: auto;
        cursor: pointer;
      }
    }

    // 内容
    .content {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      margin-top: 20px;
      .left-box {
        width: 20%;
        .search-box {
          position: relative;
          // width: 262px;
          width: 100%;
          height: 36px;
          background: #FFFFFF;
          border: 1px solid #E8E9EC;
          box-sizing: border-box;
          .search-input {
            width: 100%;
            height: 100%;
            padding: 0 0px 0 7px;
            border: none;
            outline: none;
            box-sizing: border-box;
          }
          input::-webkit-input-placeholder {
            font-size: 14px;
            color: #999;
          }
          .search-btn {
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 55px;
            height: 100%;
            font-size: 20px;
            color: #CBCED4;
            border-left: 1px solid #E8E9EC;
            cursor: pointer;
          }
        }
        .brand-box {
          // width: 262px;
          width: 100%;
          height: 525px;
          border: 1px solid #E9EAEC;
          box-sizing: border-box;
          overflow-y: scroll;
          margin-top: 14px;
          .brand-list {
            .brand-item {
              width: 100%;
              height: 47px;
              line-height: 47px;
              font-size: 14px;
              padding-left: 14px;
              overflow: hidden;
              cursor: pointer;
              margin-bottom: 3px;
              .brand-item-txt {
                display: inline-block;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .active {
              background: rgba(24, 144, 255, 0.13);
            }
          }
          /* 谷歌隐藏滚动条 */
          &::-webkit-scrollbar {
            display: none;
          }
          /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
          /* IE隐藏滚动条 */
          -ms-overflow-style: none;
          /* 火狐隐藏滚动条 */
          overflow: -moz-scrollbars-none;
        }
        /* 谷歌隐藏滚动条 */
        &::-webkit-scrollbar {
          display: none;
        }
        /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
        /* IE隐藏滚动条 */
        -ms-overflow-style: none;
        /* 火狐隐藏滚动条 */
        overflow: -moz-scrollbars-none;
      }
      .right-box {
        width: 80%;
        // width: 946px;
        margin-left: 21px;
        .table-box {
          border-left: 1px solid #E9EAEC;
          border-right: 1px solid #E9EAEC;
          box-sizing: border-box;
          // 表格滚动条设置
          & ::v-deep .el-table__body-wrapper {
            max-height: 432px;
            overflow-y: scroll;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE 10+ */
          }
          & ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
            // display: none; /* Chrome Safari */
            width: 6px; // 横向滚动条
            height: 6px; // 纵向滚动条 必写
          }
          & ::v-deep .el-table__body {
            width: 100%;
          }
          & ::v-deep tr.el-table__row:last-child {
            td {
              border-bottom: 0;
            }
          }
          & ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
          background-color: #ddd;
          border-radius: 3px;
        }

          // 上传图片样式
          .business-qual {
            & ::v-deep .up-img-box,
            & ::v-deep .plugin-images,
            & ::v-deep .mul-pic-upload {
              height: 80px;
            }
            & ::v-deep .el-upload-list--picture-card .el-upload-list__item {
              width: 80px;
              height: 80px;
              margin-bottom: 0;
              border-radius: 0;
            }
            & ::v-deep .pic-uploader-component .el-upload .pic-uploader-icon,
            & ::v-deep .el-upload--picture-card {
              width: 80px;
              height: 80px;
              line-height: 80px;
            }
            & ::v-deep .plugin-images .el-upload {
              width: 80px;
              height: 80px;
              .pic {
                display: block;
                width: 100%;
                height: 100%;
              }
            }
            & ::v-deep .pic-uploader-component .el-upload .pic {
              width: 80px;
              height: 80px;
            }
            & ::v-deep .el-upload-list--picture-card .el-upload-list__item {
              border-color: #dcdfe6;
            }
          }
          .add-bank-info-table {
            & ::v-deep .el-form-item {
              margin-top: 16px;
              margin-bottom: 16px;
            }
            // & ::v-deep .el-form-item.is-error {
            //   margin-bottom: 20px;
            // }
            // & ::v-deep .el-form-item__content {
            //   line-height: inherit;
            // }
            // & ::v-deep .el-table .cell {
            //   line-height: inherit;
            // }
          }
        }
        .table-box.big-tb {
          & ::v-deep .el-table__body-wrapper {
            max-height: 525px;
          }
        }
        .custom-box {
          display: flex;
          align-items: center;
          // width: 945px;
          width: 100%;
          height: 60px;
          font-size: 14px;
          background: #FAFAFA;
          border: 1px solid #EAEAEA;
          box-sizing: border-box;
          margin-top: 17px;
          padding: 0 10px;
          .text {
            padding-left: 10px;
          }
          .add-btn {
            // width: 140px;
            // height: 36px;
            // line-height: 34px;
            // text-align: center;
            // background: #FFFFFF;
            // border: 1px solid #EAEAEA;
            // box-sizing: border-box;
            // margin-right: 25px;
            margin-left: auto;
            cursor: pointer;
          }
        }

      }
    }

    .foot-btn.btn-row {
      margin-top: 30px;
      text-align: right;
    }

  }
}
</style>
