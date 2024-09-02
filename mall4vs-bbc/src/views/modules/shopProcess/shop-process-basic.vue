<template>
<!-- 基本信息 -->
  <div class="shop-base-info">
    <el-form
      ref="baseInfoForm"
      :model="baseInfoForm"
      :rules="baseInfoRule"
      label-width="150px"
      size="small"
    >
      <div class="ci-wrapper">
        <div class="left-info">
          <el-form-item :label="this.$i18n.t('shopProcess.logo')" prop="shopLogo">
            <div class="form-item-content">
              <div class="img-content">
                <img-upload v-if="applyStatus !== 0" v-model="baseInfoForm.shopLogo" @input="imgChange(baseInfoForm.shopLogo, 'shopLogo')" />
                <el-image
                  v-if="applyStatus === 0 && baseInfoForm.shopLogo"
                  class="rotating-img"
                  :src="baseInfoForm.shopLogo.indexOf('http') === 0 ? baseInfoForm.shopLogo : resourcesUrl + baseInfoForm.shopLogo"
                  :preview-src-list="baseInfoForm.shopLogo.indexOf('http') === 0 ? [baseInfoForm.shopLogo] : [resourcesUrl + baseInfoForm.shopLogo]"
                />
              </div>
              <div class="upload-tips">{{ $t('shopProcess.logoTips') }}</div>
            </div>
          </el-form-item>
          
          <el-form-item :label="this.$i18n.t('shopProcess.merchantName')" prop="merchantName">
            <el-input
              v-model="baseInfoForm.merchantName"
              :placeholder="this.$i18n.t('shopProcess.merchantNameInputTips')"
              maxlength="10"
              :disabled="isNotEdit"
              @blur="
                baseInfoForm.merchantName =
                baseInfoForm.merchantName ?
                removeHeadAndTailSpaces(baseInfoForm.merchantName) :
                baseInfoForm.merchantName
              "
            />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shopProcess.shopName')" prop="shopName">
            <el-input
              v-model="baseInfoForm.shopName"
              :placeholder="this.$i18n.t('shopProcess.shopNameInputTips')"
              maxlength="20"
              :disabled="isNotEdit"
              @blur="
                baseInfoForm.shopName =
                baseInfoForm.shopName ?
                removeHeadAndTailSpaces(baseInfoForm.shopName) :
                baseInfoForm.shopName
              "
            />
          </el-form-item>
          <!-- <el-form-item label="联系人" prop="contactName">
            <el-input v-model="baseInfoForm.contactName" placeholder="请输入常用联系人姓名" maxlength="10" :disabled="isNotEdit" />
          </el-form-item> -->
          <el-form-item :label="this.$i18n.t('shopProcess.tel')" prop="tel">
            <el-input v-model="baseInfoForm.tel" :placeholder="this.$i18n.t('shopProcess.telInputTips')" maxlength="11" :disabled="isNotEdit" />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shopProcess.email')" prop="email">
            <el-input v-model="baseInfoForm.email" :placeholder="this.$i18n.t('shopProcess.emailInputTips')" maxlength="30" :disabled="isNotEdit" />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shopProcess.addr')" prop="currentAddr">
            <el-cascader
              ref="cascaderAddr"
              v-model="baseInfoForm.currentAddr"
              :options="addrList"
              :props="addrListTreeProps"
              :disabled="isNotEdit"
              style="width:100%"
              :placeholder="this.$i18n.t('shopProcess.addrInputTips')"
              @change="handleAddrChange"
            />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shopProcess.detailAddr')" prop="shopAddress" class="detail-addr">
            <el-input
              v-model="baseInfoForm.shopAddress"
              :placeholder="this.$i18n.t('shopProcess.detailAddrInputTips')"
              maxlength="50"
              :disabled="isNotEdit"
              @blur="
                baseInfoForm.shopAddress =
                baseInfoForm.shopAddress ?
                removeHeadAndTailSpaces(baseInfoForm.shopAddress) :
                baseInfoForm.shopAddress; shopAddressChange()
              "
            >
              <el-button slot="append" icon="el-icon-location" @click="mapLocation">{{$t("admin.location")}}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <baidu-map
              class="map"
              :scroll-wheel-zoom="false"
              :center="center"
              @moving="syncCenterAndZoom"
              @moveend="syncCenterAndZoom"
              @zoomend="syncCenterAndZoom"
              :zoom="zoom"
            >
              <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
              <bm-marker :position="center" :dragging="false" @click="infoWindowOpen">
                <bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen">{{$t("shop.storeLocation")}}</bm-info-window>
              </bm-marker>
            </baidu-map>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shopProcess.intro')" prop="intro">
            <el-input
              v-model="baseInfoForm.intro"
              :disabled="isNotEdit"
              type="textarea"
              :rows="4"
              maxlength="200"
              :placeholder="this.$i18n.t('shopProcess.introInput')"
              @blur="
                baseInfoForm.intro =
                baseInfoForm.intro ?
                removeHeadAndTailSpaces(baseInfoForm.intro) :
                baseInfoForm.intro
              "
            />
          </el-form-item>
        </div>

        <!-- <div class="right-info"> -->
          <!-- <el-form-item :label="this.$i18n.t('shopProcess.logo')" prop="shopLogo">
            <div class="form-item-content">
              <div class="img-content">
                <img-upload v-if="applyStatus !== 0" v-model="baseInfoForm.shopLogo" @input="imgChange(baseInfoForm.shopLogo, 'shopLogo')" />
                <el-image
                  v-if="applyStatus === 0 && baseInfoForm.shopLogo"
                  class="rotating-img"
                  :src="baseInfoForm.shopLogo.indexOf('http') === 0 ? baseInfoForm.shopLogo : resourcesUrl + baseInfoForm.shopLogo"
                  :preview-src-list="baseInfoForm.shopLogo.indexOf('http') === 0 ? [baseInfoForm.shopLogo] : [resourcesUrl + baseInfoForm.shopLogo]"
                />
              </div>
              <div class="upload-tips">{{ $t('shopProcess.logoTips') }}</div>
            </div>
          </el-form-item> -->
          <!-- 背景图 -->
          <!-- <div class="bg-img">
            <div class="form-item-content">
              <el-form-item :label="this.$i18n.t('shopProcess.backgroundPic')" prop="mobileBackgroundPic">
                <div class="img-content">
                  <img-upload v-if="applyStatus !== 0" v-model="baseInfoForm.mobileBackgroundPic" />
                  <div v-if="applyStatus === 0 && baseInfoForm.mobileBackgroundPic">
                    <el-image
                      class="rotating-img"
                      :src="baseInfoForm.mobileBackgroundPic.indexOf('http') === 0 ? baseInfoForm.mobileBackgroundPic : resourcesUrl + baseInfoForm.mobileBackgroundPic"
                      :preview-src-list="baseInfoForm.mobileBackgroundPic.indexOf('http') === 0 ? [baseInfoForm.mobileBackgroundPic] : [resourcesUrl + baseInfoForm.mobileBackgroundPic]"
                    />
                  </div>
                </div>
                <div class="img-tips">
                  <p>{{ $t('shopProcess.mobileBackgroundPic') }}</p>
                  <p>{{ $t('shopProcess.mobilePicTips') }}</p>
                </div>
              </el-form-item>
            </div>
            <div class="form-item-content">
              <el-form-item label-width="0" prop="pcBackgroundPic">
                <div class="img-content">
                  <img-upload v-if="applyStatus !== 0" v-model="baseInfoForm.pcBackgroundPic" />
                  <div v-if="applyStatus === 0 && baseInfoForm.pcBackgroundPic">
                    <el-image
                      class="rotating-img"
                      :src="baseInfoForm.pcBackgroundPic.indexOf('http') === 0 ? baseInfoForm.pcBackgroundPic : resourcesUrl + baseInfoForm.pcBackgroundPic"
                      :preview-src-list="baseInfoForm.pcBackgroundPic.indexOf('http') === 0 ? [baseInfoForm.pcBackgroundPic] : [resourcesUrl + baseInfoForm.pcBackgroundPic]"
                    />
                  </div>
                </div>
                <div class="img-tips">
                  <p>{{ $t('shopProcess.pcBackgroundPic') }}</p>
                  <p>{{ $t('shopProcess.pcPicTips') }}</p>
                </div>
              </el-form-item>
            </div>
          </div> -->
          <!-- 背景图 end -->

          <!-- <el-form-item :label="this.$i18n.t('shopProcess.businessLicense')" prop="businessLicense">
            <div class="business-license-box">
              <div class="license-content">
                <img-upload v-if="applyStatus !== 0" v-model="baseInfoForm.businessLicense" @input="imgChange(baseInfoForm.businessLicense, 'businessLicense')" />
                <el-image
                  v-if="applyStatus === 0 && baseInfoForm.businessLicense"
                  class="rotating-img"
                  :src="baseInfoForm.businessLicense.indexOf('http') === 0 ? baseInfoForm.businessLicense : resourcesUrl + baseInfoForm.businessLicense"
                  :preview-src-list="baseInfoForm.businessLicense.indexOf('http') === 0 ? [baseInfoForm.businessLicense] : [resourcesUrl + baseInfoForm.businessLicense]"
                />
                <div class="example-box">
                  <img src="~@/assets/img/example-img/Business-license.png">
                  <div class="tips">{{ $t('shopProcess.example') }}</div>
                </div>
              </div>
              <div class="upload-tips">{{ $t('shopProcess.logoTips') }}</div>
            </div>
          </el-form-item>
          <div class="id-box">
            <div class="upload-content"> -->
              <!-- 法人身份证 -->
              <!-- <div class="upload-img" :class="lang === 'en' ? 'en-upload-img' : 'zh-upload-img'">
                <el-form-item class="idcard" :label="this.$i18n.t('shopProcess.corporateIdentityCard')" prop="identityCardFront">
                  <img-upload
                    v-if="applyStatus !== 0 || (applyStatus === 0 && !baseInfoForm.identityCardFront)"
                    v-model="baseInfoForm.identityCardFront"
                    @input="imgChange(baseInfoForm.identityCardFront, 'identityCardFront')"
                  />
                  <el-image
                    v-if="applyStatus === 0 && baseInfoForm.identityCardFront"
                    class="rotating-img"
                    :src="baseInfoForm.identityCardFront.indexOf('http') === 0 ? baseInfoForm.identityCardFront : resourcesUrl + baseInfoForm.identityCardFront"
                    :preview-src-list="baseInfoForm.identityCardFront.indexOf('http') === 0 ?  [baseInfoForm.identityCardFront] : [resourcesUrl + baseInfoForm.identityCardFront]"
                  />
                </el-form-item>
                <el-form-item class="idcard" label-width="0" prop="identityCardLater">
                  <img-upload
                    v-if="applyStatus !== 0 || (applyStatus === 0 && !baseInfoForm.identityCardLater)"
                    v-model="baseInfoForm.identityCardLater"
                    @input="imgChange(baseInfoForm.identityCardLater, 'identityCardLater')"
                  />
                  <el-image
                    v-if="applyStatus === 0 && baseInfoForm.identityCardLater"
                    class="rotating-img"
                    :src="baseInfoForm.identityCardLater.indexOf('http') === 0 ? baseInfoForm.identityCardLater : resourcesUrl + baseInfoForm.identityCardLater"
                    :preview-src-list="baseInfoForm.identityCardLater.indexOf('http') === 0 ? [baseInfoForm.identityCardLater] : [resourcesUrl + baseInfoForm.identityCardLater]"
                  />
                </el-form-item>
              </div>
              
              <div :class="lang === 'en' ? 'en-left' : 'zh-left'">
                <div class="upload-example">
                  <div class="example-box">
                    <img src="~@/assets/img/example-img/idcard1.png">
                    <div class="tips">{{ $t('shopProcess.identityCardFront') }}</div>
                  </div>
                  <div class="example-box">
                    <img src="~@/assets/img/example-img/idcard2.png">
                    <div class="tips">{{ $t('shopProcess.identityCardLater') }}</div>
                  </div>
                </div>
                <div class="upload-tips">{{ $t('shopProcess.identityCardTips') }}</div>
              </div>
            </div>
          </div> -->


        <!-- </div> -->
      </div>

      <div class="btn-row">
        <div v-if="applyStatus !== 0 && applyStatus !== 1" class="default-btn primary-btn" @click="saveBasicInfo">{{ $t('shopProcess.submitAndNextStep') }}</div>
        <div v-if="applyStatus === 0 || applyStatus === 1" class="default-btn primary-btn" @click="viewNextStep">{{ $t('shopProcess.seeNextStep') }}</div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import { validEmail, isMobile, validNoEmptySpace, removeHeadAndTailSpaces } from '@/utils/validate'
import ImgUpload from '@/components/img-upload'
export default {
  components: {
    ImgUpload
  },
  props: {
    // 申请步骤 1.基本信息
    applyStep: {
      default: 1,
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
    }
  },
  data () {
    const validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error(this.$i18n.t('shopProcess.telErrorTips')))
      } else {
        callback()
      }
    }
    const validEmptyTab = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value) || value.indexOf(' ') !== -1) {
        callback(new Error(this.$i18n.t('shopProcess.emailErrorTips')))
      } else {
        callback()
      }
    }
    return {
      removeHeadAndTailSpaces: removeHeadAndTailSpaces,
      isSubmit: false,
      // 图片前缀
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      // 语言
      // lang: window.localStorage.getItem('lang'),
      addrList: [],
      addrListTreeProps: {
        value: 'areaId',
        label: 'areaName'
      },
      baseInfoForm: {
        merchantName: '',
        shopName: '',
        // contactName: '',
        tel: '',
        email: '',
        province: '',
        provinceId: '',
        city: '',
        cityId: '',
        area: '',
        areaId: '',
        currentAddr: '',
        shopAddress: '',
        shopLogo: '',
        intro: '',
        // mobileBackgroundPic: '',
        // pcBackgroundPic: '',
        // 纬度
        shopLat: '',
        // 经度
        shopLng: ''
        // businessLicense: '',
        // identityCardFront: '',
        // identityCardLater: ''
      },
      // 基础信息验证
      baseInfoRule: {
        merchantName: [
          { required: true, message: this.$i18n.t('shopProcess.merchantNameNotEmpty'), trigger: 'blur' },
          { min: 2, max: 10, message: this.$i18n.t('shopProcess.merchantNameErrorTips'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        shopName: [
          { required: true, message: this.$i18n.t('shopProcess.shopNameNotEmpty'), trigger: 'blur' },
          { min: 2, max: 20, message: this.$i18n.t('shopProcess.shopNameInputTips'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        // contactName: [
        //   { required: true, message: '联系人不能为空', trigger: 'blur' },
        //   { min: 2, max: 10, message: '联系人长度在2-10个字符之间', trigger: 'blur' },
        //   { validator: validEmptyTab, trigger: 'blur' }
        // ],
        tel: [
          { required: true, message: this.$i18n.t('shopProcess.telNotEmpty'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$i18n.t('shopProcess.emailInputTips'), trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        currentAddr: [
          { required: true, message: this.$i18n.t('shopProcess.addrInputTips'), trigger: ['blur', 'change'] }
        ],
        shopAddress: [
          { required: true, message: this.$i18n.t('shopProcess.detailAddrNotEmpty'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        intro: [
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        shopLogo: [
          { required: true, message: this.$i18n.t('shopProcess.logoNotEmpty'), trigger: 'change' }
        ]
        // mobileBackgroundPic: [
        //   { required: true, message: this.$i18n.t('shopProcess.mobilePicNotEmpty'), trigger: 'change' }
        // ],
        // pcBackgroundPic: [
        //   { required: true, message: this.$i18n.t('shopProcess.pcPicNotEmpty'), trigger: 'change' }
        // ],
        // businessLicense: [
        //   { required: true, message: this.$i18n.t('shopProcess.businessLicenseNotEmpty'), trigger: 'change' }
        // ],
        // identityCardFront: [
        //   { required: true, message: this.$i18n.t('shopProcess.identityCardFrontNotEmpty'), trigger: 'change' }
        // ],
        // identityCardLater: [
        //   { required: true, message: this.$i18n.t('shopProcess.identityCardLaterNotEmpty'), trigger: 'change' }
        // ]
      },

      // 定位
      show: false,
      center: {
        lng: 113.327955,
        lat: 23.136783
      },
      zoom: 18,
      mapLocationType: 'map' // 定位方式
    }
  },

  mounted () {
    // 地址
    this.queryAreaList()
    this.setCenter()

    if (this.applyStep === 1) {
      this.getBasicInfo()
    }
  },

  methods: {
    /**
     * 获取店铺基本信息
     */
    getBasicInfo () {
      this.$http({
        url: this.$http.adornUrl(`/shop/shopDetail/info`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data) {
          this.baseInfoForm = data

          this.baseInfoForm.currentAddr = [
            data.provinceId,
            data.cityId,
            data.areaId
          ]
          if (data.shopLat && data.shopLng) {
            this.center = {
              lng: data.shopLng,
              lat: data.shopLat
            }
          }
        }
      })
    },

    /**
     * 图片的值发生改变，重新校验对应表单字段
     */
    imgChange (value, prop) {
      if (value) {
        this.$refs.baseInfoForm.validateField(prop)
      }
    },

    /**
     * 获取地址列表
     */
    queryAreaList () {
      this.$http({
        url: this.$http.adornUrl(`/admin/area/list`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.addrList = treeDataTranslate(data, 'areaId', 'parentId')
        this.addrList = this.removeNotThirdCategoryItem(this.addrList)
      })
    },

    /**
     * 监听地址改变
     */
    handleAddrChange (value) {
      if (value.length > 0) {
        const labels = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels
        this.baseInfoForm.province = labels[0]
        this.baseInfoForm.provinceId = value[0]
        this.baseInfoForm.city = labels[1]
        this.baseInfoForm.cityId = value[1]
        this.baseInfoForm.area = labels[2]
        this.baseInfoForm.areaId = value[2]
        this.mapLocation(true)
      }
    },

    removeNotThirdCategoryItem (treeData) {
      if (treeData[0] && treeData[0].level === 3) {
        // 当为三级分类时，不需要再判断
        return treeData
      }

      const firstCategory = treeData
      let length = firstCategory.length
      for (let i = 0, index = 0; i < length; i++) {
        if (firstCategory[index].children && firstCategory[index].children !== undefined && (firstCategory[index].children.some(item => item.children) || firstCategory[index].level !== 1)) {
          const secondCategory = firstCategory[index].children
          firstCategory[index].children = this.removeNotThirdCategoryItem(secondCategory)
        } else {
          firstCategory.splice(index, 1)

          // 当前位置的元素已经被删除，当前位置索引不用++
          continue
        }
        index++
      }
      return firstCategory
    },

    /**
     * 初始化地图数据
     */
    setCenter () {
      this.center = null
      this.center = {
        lng: 113.327955,
        lat: 23.136783
      }
      this.zoom = 18
    },
    /**
     * 获取地图移动后回调的位置参数
     */
    syncCenterAndZoom (e) {
      this.mapLocationType = 'map'
      this.setCenter()
      const { lng, lat } = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.baseInfoForm.shopLng = lng
      this.baseInfoForm.shopLat = lat
      this.zoom = e.target.getZoom()
      this.isEditAddr = false
    },

    shopAddressChange () {
      this.mapLocationType = 'address'
      this.mapLocation(true)
    },
    /**
     * 关闭地图说明标签
     */
    infoWindowClose () {
      this.show = false
    },
    /**
     * 打开地图说明标签
     */
    infoWindowOpen () {
      this.show = true
    },
    // 定位地图
    mapLocation (isTrue) {
      let area = ''
      const that = this
      if (isTrue === true) {
        // 选择省市区时，定位地图
        if (this.baseInfoForm.provinceId) {
          area = this.baseInfoForm.province
          this.zoom = 6
          if (this.baseInfoForm.cityId) {
            area = area + this.baseInfoForm.city
            this.zoom = 10
            if (this.baseInfoForm.areaId) {
              area = area + this.baseInfoForm.area
              this.zoom = 18
              if (this.baseInfoForm.shopAddress) {
                // 详细地址
                area = this.baseInfoForm.province + this.baseInfoForm.city + this.baseInfoForm.area + this.baseInfoForm.shopAddress
                this.zoom = 18
              }
            }
          }
        }
        this.center = area
      } else {
        // this.center = null
        if (!this.baseInfoForm.provinceId || !this.baseInfoForm.cityId || !this.baseInfoForm.areaId) {
          this.baseInfoForm.shopAddress = null
          this.$message({
            message: this.$i18n.t('admin.selePCD'),
            type: 'error',
            duration: 1000
          })
          return
        }
        let point = new BMap.Point(this.center.lng, this.center.lat)
        let gc = new BMap.Geocoder()
        if (this.mapLocationType === 'map') {
          gc.getLocation(point, function (rs) {
            that.baseInfoForm.shopAddress = rs.address.replace(that.baseInfoForm.province + that.baseInfoForm.city + that.baseInfoForm.area, '')
          })
        }
        area = this.baseInfoForm.province + this.baseInfoForm.city + this.baseInfoForm.area + this.baseInfoForm.shopAddress
        this.center = this.mapLocationType === 'address' ? area : this.center
        this.zoom = 18
      }
      // this.center = area
      this.isEditAddr = true
    },

    /**
     * 保存基本信息
     */
    saveBasicInfo () {
      this.isSubmit = !this.isSubmit
      this.$refs['baseInfoForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/shop/shopDetail'),
            method: 'PUT',
            data: this.$http.adornData(this.baseInfoForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('shopProcess.baseSaveSuccess'),
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.toNextStep()
              }
            })
          })
        }
      })
    },

    /**
     * 查看下一步
     */
    viewNextStep () {
      this.$emit('viewNextStep')
    },
    /**
     * 提交，下一步
     */
    toNextStep () {
      this.$emit('toNextStep')
    }
  }
}
</script>

<style lang="scss" scoped>
// 基本信息
.shop-base-info {
  display: block;
  width: 90%;
  margin: 0 auto;
  .ci-wrapper {
    display: flex;
    align-items: flex-start;
    // justify-content: space-between;
    justify-content: center;
    & >>> .el-form-item {
      margin-bottom: 22px;
    }
    // 图片框大小统一
    & >>> .plugin-images {
      display: block;
      width: 130px;
      height: 130px;
      img {
        vertical-align: top;
      }
    }
    & >>> .el-upload--picture-card,
    & >>> .el-upload-list--picture-card .el-upload-list__item {
      width: 130px !important;
      height: 130px !important;
      line-height: 130px !important;
      margin: 0;
      background: #fff;
    }
    & >>> .el-upload-list--picture-card {
      display: block;
      width: auto;
      height: 100%;
    }
    .img-content {
      height: 130px;
      & dev {
        height: 100%;
      }
    }
    // 上传图片提示
    .upload-tips {
      font-size: 12px;
      color: #999;
      // height: 16px;
      line-height: 1.5em;
      margin-top: 5px;
    }
    // .left-info,
    // .right-info {
    //   width: 45%;
    // }
    .left-info {
      min-width: 692px;
      width: 45%;
    }
    .right-info {
      // 背景图
      .bg-img {
        display: flex;
        justify-content: flex-start;
        .form-item-content {
          margin-right: 30px;
          .img-tips {
            display: block;
            text-align: center;
            font-size: 12px;
            color: #666;
            line-height: 1.5em;
            margin-top: 8px;
            p  {
              margin: 0;
              padding: 0;
            }
          }
        }
      }
      .license-content {
        display: flex;
      }
      .en-left {
        // margin-left: 240px;
        margin-left: 150px;
      }
      .zh-left  {
        // margin-left: 120px;
        margin-left: 150px;
      }
      // 图片示例
      .upload-example {
        display: flex;
        .example-box {
          margin-left: 0;
          &:nth-child(2) {
            margin-left: 30px;
          }
        }
      }
      // 示例框
      .example-box {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 130px;
        min-width: 130px;
        height: 130px;
        background: #FFFFFF;
        border: 1px solid #EAEAEA;
        border-radius: 3px;
        box-sizing: border-box;
        margin-left: 30px;
        img {
          display: block;
          width: auto;
          max-width: 100%;
          height: auto;
          max-height: 100%;
        }
        .tips {
          position: absolute;
          left: -1px;
          bottom: 0;
          width: 130px;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          color: #fff;
          background: rgba(51, 51, 51, 0.5);
          text-align: center;
          border-radius: 0px 0px 3px 3px;
        }
      }
      .id-box {
        .upload-content {
          .upload-img {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            div {
              &:nth-child(2) {
                margin-left: 30px;
              }
            }
            .disabled-upload {
              & >>> .el-upload {
                background: #f5f7fa;
              }
            }
            & >>> .el-form-item__content {
              height: 130px;
            }
            & >>> .el-form-item {
              margin-bottom: 10px;
            }
          }
          .upload-img.en-upload-img {
            & >>> .el-form-item.is-error {
              margin-bottom: 45px;
            }
          }
          .upload-img.zh-upload-img {
            & >>> .el-form-item.is-error {
              margin-bottom: 22px;
            }
          }
        }
      }
    }
    .detail-addr {
      & >>> .el-input__inner {
        border-radius: 2px 0 0 2px!important;
      }
    }
  }
  .map {
    width: 100%;
    height: 300px;
  }
}
.shop-base-info .rotating-img {
  width: 130px;
  height: 130px;
}
</style>
