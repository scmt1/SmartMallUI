<template>
  <el-dialog :close-on-click-modal="false" :visible.sync="visible" class="store-editor-pop" :title="dataForm.shopId ? $t('seckill.view') : $t('sysManagement.add')">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      :label-width="this.$i18n.t('language') === 'language' ? '170px' : '120px'"
      size="small"
    >
      <el-form-item :label="$t('prodList.shopName')" prop="shopName">
        <el-input
          v-model="dataForm.shopName"
          :disabled="notInsert"
          maxlength="50"
          show-word-limit
          :placeholder="$t('prodList.inputShopName')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('order.contactTel')" prop="tel">
        <el-input
          v-model="dataForm.tel"
          :disabled="notInsert"
          maxlength="11"
          show-word-limit
          :placeholder="$t('prodList.inputMobile')"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="店铺所在纬度" prop="shopLat">
        <el-input v-model="dataForm.shopLat" :disabled="notInsert"></el-input>
      </el-form-item>
      <el-form-item label="店铺所在经度" prop="shopLng">
        <el-input v-model="dataForm.shopLng" :disabled="notInsert"></el-input>
      </el-form-item>-->
      <el-form-item prop="province" :label="$t('platform.pcd')"
      class="pcd"
      >
        <el-row>
          <el-col :span="8">
            <el-select
              v-model="dataForm.provinceId"
              :placeholder="$t('platform.seleProv')"
              @change="selectProvince"
              :disabled="notInsert"
            >
              <el-option
                v-for="province in provinceList"
                :key="province.areaId"
                :label="province.areaName"
                :value="province.areaId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select
              v-model="dataForm.cityId"
              :placeholder="$t('platform.seleCity')"
              @change="selectCity"
              :disabled="notInsert"
            >
              <el-option
                v-for="city in cityList"
                :key="city.areaId"
                :label="city.areaName"
                :value="city.areaId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select
              v-model="dataForm.areaId"
              :placeholder="$t('platform.seleDC')"
              @change="mapLocation(true)"
              :disabled="notInsert"
              style="width:240px"
            >
              <el-option
                v-for="area in areaList"
                :key="area.areaId"
                :label="area.areaName"
                :value="area.areaId"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('shop.shopAddress')" prop="shopAddress">
        <el-input
          v-model="dataForm.shopAddress"
          @change="mapLocation"
          :disabled="notInsert"
          maxlength="100"
          show-word-limit
          :placeholder="$t('shop.addShopErrorTip1')"
        >
          <el-button
            slot="append"
            icon="el-icon-location"
            @click="mapLocation"
            >{{ $t("platform.location") }}</el-button
          >
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
          <bm-marker
            :position="center"
            :dragging="false"
            @click="infoWindowOpen"
          >
            <bm-info-window
              :show="show"
              @close="infoWindowClose"
              @open="infoWindowOpen"
              >{{ $t("shop.storeLocation") }}</bm-info-window
            >
          </bm-marker>
        </baidu-map>
      </el-form-item>

      <el-form-item :label="$t('shop.shopDescription')" prop="intro">
        <el-input
          type="textarea"
          :rows="2"
          maxlength="200"
          v-model="dataForm.intro"
          :disabled="notInsert"
          :autosize="{ minRows: 2, maxRows: 6 }"
          :placeholder="$t('shop.addShopErrorTip2')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('shop.shopAccount')"
        prop="mobile"
        v-if="!notInsert"
      >
        <el-input
          v-model="dataForm.mobile"
          maxlength="20"
          show-word-limit
          :placeholder="$t('shop.addShopErrorTip3')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('shop.loginPassword')"
        prop="password"
        v-if="!notInsert"
      >
        <el-input
          type="password"
          v-model="dataForm.password"
          :disabled="notInsert"
          :placeholder="$t('shop.loginPasswordTip')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('sys.confirmPassword')"
        prop="checkPassword"
        v-if="!notInsert"
      >
        <el-input
          type="password"
          v-model="dataForm.checkPassword"
          :disabled="notInsert"
          :placeholder="$t('shop.againInput')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('shop.shopLogo')" prop="shopLogo">
        <img-upload
          v-model="dataForm.shopLogo"
          :disabled="notInsert"
        ></img-upload>
      </el-form-item>
      <el-form-item :label="$t('shop.businessLicense')" prop="businessLicense">
        <pic-upload
          v-model="dataForm.businessLicense"
          :disabled="notInsert"
          v-if="dataForm.businessLicense && dataForm.shopId"
        ></pic-upload>
        <img-upload
          v-model="dataForm.businessLicense"
          :disabled="notInsert"
          v-else
        ></img-upload>
      </el-form-item>
      <el-form-item
        :label="$t('distributionMsg.idCardFront')"
        prop="identityCardFront"
        class="idcard-width"
      >
        <pic-upload
          v-model="dataForm.identityCardFront"
          :disabled="notInsert"
          class="idcard"
          v-if="dataForm.identityCardFront && dataForm.shopId"
        ></pic-upload>
        <img-upload
          v-model="dataForm.identityCardFront"
          :disabled="notInsert"
          v-else
        ></img-upload>
      </el-form-item>
      <el-form-item
        :label="$t('distributionMsg.idCardBack')"
        prop="identityCardLater"
        class="idcard-width"
      >
        <pic-upload
          v-model="dataForm.identityCardLater"
          :disabled="notInsert"
          class="idcard"
          v-if="dataForm.identityCardLater && dataForm.shopId"
        ></pic-upload>
        <img-upload
          v-model="dataForm.identityCardLater"
          :disabled="notInsert"
          v-else
        ></img-upload>
      </el-form-item>
      <el-form-item
        :label="$t('distributionMsg.auditStatus')"
        v-if="dataForm.shopStatus < 2 && notInsert && shopAudit.shopAuditingId"
        prop="shopAudit"
      >
        <el-radio-group
          v-model="shopAudit.status"
          :disabled="dataForm.shopStatus !== -1"
        >
          <el-radio :label="0" :disabled="true">{{
            $t("liveRoom.notReviewed")
          }}</el-radio>
          <el-radio :label="1">{{ $t("shop.passed") }}</el-radio>
          <el-radio :label="-1">{{ $t("shop.notPass") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('shop.shopStatus')"
        v-if="dataForm.shopStatus >= 2"
        prop="shopAudit"
      >
        <el-tag v-if="dataForm.shopStatus == 2" type="danger">{{
          $t("groups.offlineViolation")
        }}</el-tag>
        <el-tag v-if="dataForm.shopStatus == 3" type="warning">{{
          $t("liveRoom.underReview")
        }}</el-tag>
      </el-form-item>
      <el-form-item
        :label="$t('shop.auditNotes')"
        v-if="notInsert && shopAudit.shopAuditingId"
        prop="shopAudit"
      >
        <el-input
          type="textarea"
          v-model="shopAudit.remarks"
          :disabled="dataForm.shopStatus !== -1"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{
        $t("remindPop.cancel")
      }}</div>
      <div
        class="default-btn primary-btn"
        @click="dataFormSubmit()"
        v-if="dataForm.shopStatus === -1 && notInsert"
        >{{ $t("remindPop.confirm") }}</div
      >
      <div class="default-btn primary-btn" @click="insertShopSubmit()" v-if="!notInsert">{{
        $t("remindPop.confirm")
      }}</div>
    </span>
  </el-dialog>
</template>

<script>
import PicUpload from '@/components/pic-upload'
import ImgUpload from '@/components/img-upload'
export default {
  data () {
    var validateShopName = (rule, value, callback) => {
      var reg = /[^\w\u4e00-\u9fa5]/
      if (reg.test(value)) {
        callback(new Error(this.$i18n.t('shop.addShopErrorTip4')))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      var reg = /[^\d]/
      if (reg.test(value)) {
        callback(new Error(this.$i18n.t('shop.addShopErrorTip5')))
      } else {
        this.$http({
          url: this.$http.adornUrl('/shop/shopAuditing/checkMobile'),
          method: 'get',
          params: this.$http.adornParams({
            mobile: this.dataForm.mobile,
            shopId: ''
          })
        }).then(({ data }) => {
          if (data) {
            callback()
          } else {
            callback(new Error(this.$i18n.t('shop.addShopErrorTip6')))
          }
        })
      }
    }
    var validatePassword = (rule, value, callback) => {
      var reg = /[^\w]/
      if (reg.test(value)) {
        callback(new Error((this.$i18n.t('shop.addShopErrorTip7'))))
      } else {
        callback()
      }
    }
    var validateCheckPassword = (rule, value, callback) => {
      var reg = /[^\w]/
      if (reg.test(value)) {
        callback(new Error(this.$i18n.t('shop.addShopErrorTip7')))
      } else if (this.dataForm.password !== this.dataForm.checkPassword) {
        callback(new Error(this.$i18n.t('shop.notEmptyTip10')))
      } else {
        callback()
      }
    }
    var validateProvince = (rule, value, callback) => {
      if (!this.dataForm.provinceId) {
        callback(new Error(this.$i18n.t('platform.seleProv')))
      } else if (!this.dataForm.cityId) {
        callback(new Error(this.$i18n.t('platform.seleCity')))
      } else if (!this.dataForm.areaId) {
        callback(new Error(this.$i18n.t('platform.seleDC')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      notInsert: true,
      // 地址信息列表
      addrInfoList: [],
      provinceList: [],
      cityList: [],
      areaList: [],
      dataForm: {
        shopId: 0,
        shopName: '',
        shopOwner: '',
        mobile: '',
        password: '',
        checkPassword: '',
        tel: '',
        shopLat: '',
        shopLng: '',
        province: '',
        city: '',
        area: '',
        shopAddress: '',
        intro: '',
        shopLogo: '',
        identityCardFront: '',
        identityCardLater: '',
        businessLicense: '',
        areaId: 0,
        cityId: 0,
        provinceId: 0
      },
      show: false,
      isSubmit: false,
      center: {
        lng: 113.327955,
        lat: 23.136783
      },
      zoom: 18,
      dataRule: {
        shopName: [
          { required: true, message: this.$i18n.t('shop.notEmptyTip1'), trigger: 'blur' },
          { validator: validateShopName, trigger: 'blur' }
        ],
        province: [
          { validator: validateProvince, trigger: 'blur' }
        ],
        shopAddress: [
          { required: true, message: this.$i18n.t('shop.notEmptyTip2'), trigger: 'blur' }
        ],
        shopLogo: [
          { required: true, message: this.$i18n.t('shop.notEmptyTip3'), trigger: 'blur' }
        ],
        businessLicense: [
          { required: true, message: this.$i18n.t('shop.notEmptyTip4'), trigger: 'blur' }
        ],
        identityCardFront: [
          { required: true, message: this.$i18n.t('shop.notEmptyTip5'), trigger: 'blur' }
        ],
        identityCardLater: [
          { required: true, message: this.$i18n.t('shop.notEmptyTip6'), trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: this.$i18n.t('shop.notEmptyTip7'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$i18n.t('shop.notEmptyTip8'), trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: this.$i18n.t('shop.notEmptyTip9'), trigger: 'blur' },
          { validator: validateCheckPassword, trigger: 'blur' }
        ]
      },
      shopAudit: {
        status: 0 // 0未审核 1已通过 -1未通过
      }
    }
  },
  components: {
    ImgUpload,
    PicUpload
  },
  methods: {
    async init (shopId) {
      this.dataForm.shopId = shopId || 0
      this.notInsert = this.dataForm.shopId !== 0
      this.visible = true
      this.isSubmit = false
      this.setCenter()
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs.dataForm.resetFields()
        this.cityList = []
        this.areaList = []
        this.dataForm.provinceId = null
        this.dataForm.cityId = null
        this.dataForm.areaId = null
        this.dataForm.mobile = null
        this.dataForm.password = ''
        this.dataForm.checkPassword = ''
        this.dataForm.identityCardFront = ''
        this.dataForm.identityCardLater = ''
      })
      // 等待地址信息返回
      this.addrInfoList = await this.getAreaListInfo()
      this.provinceList = this.addrInfoList
      if (this.dataForm.shopId) {
        this.$http({
          url: this.$http.adornUrl('/shop/shopAuditing/' + this.dataForm.shopId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.shopAudit = data
          this.dataForm = data.shopDetail
          // 筛选出当前的市和区列表
          for (const proItem of this.addrInfoList) {
            if (proItem.areaId === this.dataForm.provinceId) {
              this.cityList = proItem.areas
              for (const cityItem of this.cityList) {
                if (cityItem.areaId === this.dataForm.cityId) {
                  this.areaList = cityItem.areas
                  this.center = {
                    lng: this.dataForm.shopLng,
                    lat: this.dataForm.shopLat
                  }
                  break
                }
              }
              break
            }
          }
          // this.listAreaByParentId(0).then(({ data }) => {
          //   this.provinceList = data
          // })
          // this.listAreaByParentId(data.shopDetail.provinceId).then(({ data }) => {
          //   this.cityList = data
          // })
          // this.listAreaByParentId(data.shopDetail.cityId).then(({ data }) => {
          //   this.areaList = data
          //   this.center = {
          //     lng: this.dataForm.shopLng,
          //     lat: this.dataForm.shopLat
          //   }
          // })
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      if (this.shopAudit.status === 0) {
        this.$message.warning(this.$i18n.t('components.aduitChangeTips'))
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/shop/shopAuditing/audit/' + this.dataForm.shopId),
            method: 'put',
            data: this.$http.adornData({
              shopId: this.dataForm.shopId,
              status: this.shopAudit.status,
              remarks: this.shopAudit.remarks
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList', this.page)
              }
            })
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    },
    /**
     * 新增店铺
     */
    insertShopSubmit () {
      if (this.dataForm.password && this.dataForm.checkPassword && this.dataForm.password !== this.dataForm.checkPassword) {
        this.$message.error(this.$i18n.t('shop.notEmptyTip10'))
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataForm.shopLng = this.center.lng
          this.dataForm.shopLat = this.center.lat
          let param = this.dataForm
          this.$http({
            url: this.$http.adornUrl('/shop/shopAuditing'),
            method: 'post',
            data: this.$http.adornData(param)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList', this.page)
              }
            })
          })
        }
      })
    },
    /**
     *查询省市区
     */
    listAreaByParentId (pid) {
      let paramData = {}
      if (!pid) {
        paramData = {level: 1}
      } else {
        paramData = {pid}
      }
      return this.$http({
        url: this.$http.adornUrl(`/admin/area/listByPid`),
        method: 'get',
        params: this.$http.adornParams(paramData)
      })
    },
    // 获取地址列表
    getAreaListInfo () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/admin/area/areaListInfo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          resolve(data)
        })
      })
    },
    getCurrentChild (curList, curId) {
      for (const item of curList) {
        if (item.areaId === curId) {
          return item.areas
        }
      }
    },
    // 选择省
    selectProvince (val) {
      this.dataForm.cityId = null
      this.dataForm.city = ''
      // 获取城市的select
      this.cityList = this.getCurrentChild(this.provinceList, val)
      // this.listAreaByParentId(val).then(({ data }) => {
      //   this.cityList = data
      // })
      this.mapLocation(true)
    },
    // 选择市
    selectCity (val) {
      this.dataForm.areaId = null
      this.dataForm.area = ''
      // 获取区的select
      this.areaList = this.getCurrentChild(this.cityList, val)
      // this.listAreaByParentId(val).then(({ data }) => {
      //   this.areaList = data
      // })
      this.mapLocation(true)
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
      this.setCenter()
      const { lng, lat } = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
    },
    /**
     * 通过省市区id,得到省市区名称
     */
    getAreaName () {
      for (let i = 0; i < this.provinceList.length; i++) {
        if (this.provinceList[i].areaId === this.dataForm.provinceId) {
          // 将省名字保存起来
          this.dataForm.province = this.provinceList[i].areaName
        }
      }
      for (let i = 0; i < this.cityList.length; i++) {
        if (this.cityList[i].areaId === this.dataForm.cityId) {
          // 将市名字保存起来
          this.dataForm.city = this.cityList[i].areaName
        }
      }
      for (let i = 0; i < this.areaList.length; i++) {
        if (this.areaList[i].areaId === this.dataForm.areaId) {
          // 将市名字保存起来
          this.dataForm.area = this.areaList[i].areaName
        }
      }
    },
    // 定位地图
    mapLocation (isTrue) {
      let area = ''
      this.getAreaName()
      if (isTrue === true) {
        // 选择省市区时，定位地图
        if (this.dataForm.provinceId) {
          area = this.dataForm.province
          this.zoom = 6
          if (this.dataForm.cityId) {
            area = area + this.dataForm.city
            this.zoom = 10
            if (this.dataForm.areaId) {
              area = area + this.dataForm.area
              this.zoom = 14
              if (this.dataForm.addr !== null) {
                // 详细地址
                area = this.dataForm.province + this.dataForm.city + this.dataForm.area + this.dataForm.addr
                this.zoom = 18
              }
            }
          }
        }
      } else {
        this.center = null
        if (!this.dataForm.provinceId || !this.dataForm.cityId || !this.dataForm.areaId) {
          // this.dataForm.shopAddress = null
          this.$message.error(this.$i18n.t('platform.selePCD'))
          return
        }
        area = this.dataForm.province + this.dataForm.city + this.dataForm.area + this.dataForm.shopAddress
        this.zoom = 18
      }
      this.center = area
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
    }
  }
}
</script>

<style lang="scss">
.store-editor-pop {
  // .idcard-width {
  //   width: 40% !important;
  // }
  .idcard .pic-uploader-component,
  .idcard .pic-uploader-component .el-upload--text > img {
    width: 260px !important;
    height: 150px !important;
  }
  .map {
    width: 100%;
    height: 500px;
  }
  div .el-dialog{
    margin-top: 5vh !important;
    margin-bottom: 5vh;
    overflow-y: scroll;
    height: 90vh;
  }
  /* 定义滚动条样式 */
  /* div ::v-deep ::-webkit-scrollbar {
    width: 10px;
    height: 5px;
    background-color: deepskyblue;
  } */
  .el-form-item {
    margin-bottom: 30px;
  }
  .pcd .el-form-item__label:before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
}
</style>
