<template>
  <el-dialog 
    :title="this.$i18n.t('components.modifyUseAddress')"
    top="200px"
    :close-on-click-modal="false"
    :append-to-body="visible"
    :visible.sync="visible"
    v-if="visible"
    width="850px"
  >
  <!-- language -->
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="this.$i18n.t('language') === 'English'? '130px' : '80px'"
    >
      <el-alert :title="this.$i18n.t('components.consultWithUsers')" type="warning" show-icon></el-alert>
      <br />
      <el-form-item :label="this.$i18n.t('publics.addressee')" prop="receiver">
        <el-input size="small" maxlength="15" v-model="dataForm.receiver" :placeholder="this.$i18n.t('shop.consigneeName')"></el-input>
      </el-form-item>

      <el-form-item :label="this.$i18n.t('publics.mobilePhone')" prop="mobile">
        <el-input size="small" v-model="dataForm.mobile" :placeholder="this.$i18n.t('publics.mobilePhone')" maxlength="11" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('address.province')" prop="province">
        <div class="select">
          <el-form-item prop="province">
            <el-select size="small" v-model="dataForm.provinceId" :disabled="order.dvyType === 4" :placeholder="this.$i18n.t('tip.select')" @change="selectProvince">
              <el-option
                v-for="province in provinceList"
                :key="province.areaId"
                :label="province.areaName"
                :value="province.areaId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="select">
          <el-form-item prop="city">
            <el-select size="small"  v-model="dataForm.cityId" :disabled="order.dvyType === 4" :placeholder="this.$i18n.t('tip.select')" @change="selectCity">
              <el-option
                v-for="city in cityList"
                :key="city.areaId"
                :label="city.areaName"
                :value="city.areaId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="select">
          <el-form-item prop="area">
            <el-select size="small" v-model="dataForm.areaId" :placeholder="this.$i18n.t('tip.select')" :disabled="!dataForm.cityId || order.dvyType === 4" @change="isShowMap ? mapLocation(true) : ''">
              <el-option
                v-for="area in areaList"
                :key="area.areaId"
                :label="area.areaName"
                :value="area.areaId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('address.detailed')" prop="addr">
        <el-input size="small" maxlength="30" v-model="dataForm.addr" :disabled="order.dvyType === 4" :placeholder="this.$i18n.t('address.detailed')"></el-input>
      </el-form-item>
      <el-form-item v-if="isShowMap">
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
            <bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen">
              {{$t('admin.stationLocal')}}
            </bm-info-window>
          </bm-marker>
        </baidu-map>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="getChangeAmount()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>

<script>
import { isMobile, validNoEmptySpace } from '@/utils/validate'
export default {
  data () {
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error(this.$i18n.t('sys.mobilePhoneError')))
      } else {
        callback()
      }
    }
    var validateAddr = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('shop.addressCannotBeEmpty')))
      } else {
        callback()
      }
    }
    var validateReceiver = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      // 地址信息列表
      addrInfoList: [],
      provinceList: [],
      cityList: [],
      areaList: [],
      order: null,
      dataForm: {
        addrOrderId: 0,
        addrId: 0,
        addr: '',
        receiver: '',
        mobile: '',
        area: '',
        city: '',
        province: '',
        areaId: null,
        cityId: null,
        provinceId: null
      },
      center: {
        lng: 113.327955,
        lat: 23.136783
      },
      zoom: 18,
      isEditAddr: false,
      show: false,
      dataRule: {
        receiver: [
          { required: true, message: this.$i18n.t('shop.coneeNameCanEmpty'), trigger: 'blur' },
          { validator: validateReceiver, trigger: 'blur' }
        ],
        addr: [{ required: true, message: this.$i18n.t('shop.addressCannotBeEmpty'), trigger: 'blur' },
          { validator: validateAddr, trigger: 'blur' }
        ],
        city: [{ required: true, message: this.$i18n.t('shop.cityCannotBeEmpty'), trigger: 'blur' }],
        province: [
          { required: true, message: this.$i18n.t('shop.provinceCannotBeEmpty'), trigger: 'blur' }
        ],
        area: [{ required: true, message: this.$i18n.t('shop.districtCounEmpty'), trigger: 'blur' }],
        mobile: [
          { required: true, message: this.$i18n.t('sys.mobilePhoneNoNull'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      isTrue: false,
      errorInfo: '',
      dataListLoading: false,
      addOrUpdateVisible: false,
      isShowMap: false,
      oldOrder: '',
      freightAmount: 0,
      orderStatus: 0
    }
  },
  methods: {
    // 获取数据列表
    async init (order) {
      let orderInfo = Object.assign({}, order)
      this.isShowMap = Boolean((orderInfo.dvyType === 4 && (orderInfo.status === 1 || orderInfo.status === 2)))
      let userAddr = orderInfo.userAddrOrder
      this.order = orderInfo
      this.freightAmount = orderInfo.freightAmount
      this.orderStatus = orderInfo.status
      console.log(orderInfo)
      this.oldOrder = JSON.parse(JSON.stringify(orderInfo))
      this.visible = true
      this.dataListLoading = true
      this.dataForm = userAddr
      this.show = false
      // 等待地址信息返回
      this.addrInfoList = await this.getAreaListInfo()
      this.provinceList = this.addrInfoList
      for (const proItem of this.addrInfoList) {
        if (proItem.areaId === this.dataForm.provinceId) {
          this.cityList = proItem.areas
          for (const cityItem of this.cityList) {
            if (cityItem.areaId === this.dataForm.cityId) {
              this.areaList = cityItem.areas
              break
            }
          }
          break
        }
      }
      // this.listAreaByParentId().then(({ data }) => {
      //   console.log('地址列表', data)
      //   this.provinceList = data
      // })
      // if (userAddr.provinceId && userAddr.cityId) {
      //   this.listAreaByParentId(userAddr.provinceId).then(({ data }) => {
      //     this.cityList = data
      //   })
      //   this.listAreaByParentId(userAddr.cityId).then(({ data }) => {
      //     this.areaList = data
      //   })
      // }
      this.dataListLoading = false
    },
    // 获取地址列表
    getAreaListInfo () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/admin/area/areaListInfo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          console.log(data)
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
      // console.log(e)
      this.setCenter()
      const {lng, lat} = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.dataForm.lng = lng
      this.dataForm.lat = lat
      this.zoom = e.target.getZoom()
      this.isEditAddr = false
    },
    // 选择省
    selectProvince (val) {
      this.dataForm.cityId = null
      this.dataForm.city = ''
      this.dataForm.areaId = null
      this.dataForm.area = ''
      // 获取城市的select
      this.cityList = this.getCurrentChild(this.provinceList, val)
      // this.listAreaByParentId(val).then(({ data }) => {
      //   this.cityList = data
      //   // this.dataForm.addr = null
      // })
      if (!this.isShowMap) {
        return
      }
      this.mapLocation(true)
    },
    // 选择市
    selectCity (val) {
      this.dataForm.areaId = null
      this.dataForm.area = ''
      // 获取区的select
      // this.listAreaByParentId(val).then(({ data }) => {
      //   this.areaList = data
      // })
      this.areaList = this.getCurrentChild(this.cityList, val)
      if (!this.isShowMap) {
        return
      }
      this.mapLocation(true)
    },
    getAddr () {
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
    getChangeAmount () {
      // this.oldOrder
      console.log(this.dataForm)
      this.oldOrder.orderId = this.order.orderId
      this.oldOrder.orderNumber = this.order.orderNumber
      this.getAddr()
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // 同城配送仅支持修改收件人信息不需要请求运费接口
          if (this.order.dvyType === 4) {
            this.submitProds()
            return
          }
          this.$http({
            url: this.$http.adornUrl(`/order/order/getChangeAmount`),
            method: 'get',
            params: this.$http.adornParams({
              orderId: this.oldOrder.orderId,
              orderNumber: this.oldOrder.orderNumber,
              areaId: this.order.userAddrOrder.areaId,
              lng: this.center.lng,
              lat: this.center.lat
            })
          }).then(({ data }) => {
            const msg = `${this.$i18n.t('shop.changeAmountTip1')}${data > 0 ? this.$i18n.t('shop.overcharged') : this.$i18n.t('shop.undercharged')}${this.$i18n.t('shop.by')}${data < 0 ? data * -1 : data}${this.$i18n.t('shop.yuan')}${this.$i18n.t('shop.changeAmountTip2')}`
            this.$confirm(msg, this.$i18n.t('text.tips'), {
              confirmButtonText: this.$i18n.t('order.confirm'),
              cancelButtonText: this.$i18n.t('order.cancel'),
              type: 'warning'
            }).then(() => {
              this.submitProds()
            })
          })
        }
      })
    },
    // 确定事件
    submitProds () {
      this.getAddr()
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/order/order/changeUserAddr`),
            method: 'put',
            data: this.$http.adornData({
              orderId: this.order.orderId,
              orderNumber: this.order.orderNumber,
              userAddrOrder: this.dataForm
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshUserAddrOrder')
              }
            })
          })
        }
      })
    },
    // 定位地图
    mapLocation (isTrue) {
      let area = ''
      this.getAddr()
      if (isTrue) {
          // 选择省市区时，定位地图
        if (this.dataForm.provinceId) {
            // 省名称
          area = this.dataForm.province
          this.zoom = 6
          if (this.dataForm.cityId) {
              // 市名称
            area = area + this.dataForm.city
            this.zoom = 10
            if (this.dataForm.areaId) {
                // 区名称
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
          this.dataForm.addr = null
          this.errorMsg(this.$i18n.t('admin.selePCD'))
          return
        }
        area = this.dataForm.province + this.dataForm.city + this.dataForm.area + this.dataForm.addr
        this.zoom = 18
      }
      this.center = area
      this.isEditAddr = true
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
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>
<style scoped>
.prods-select-body {
  height: auto;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
 div >>> .el-form-item{
   margin-top: 20px !important;
 }
 .select {
   width: 220px;
   display: inline-block;
   margin-top:-20px;
 }
 .map {
    width: 100%;
    height: 500px;
  }
</style>