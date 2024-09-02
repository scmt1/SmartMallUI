<template>
  <el-dialog
    :title="!dataForm.stationId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="760px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      label-width="100px"
      style="min-width:630px;"
      size="small"
    >
      <el-form-item class="stationName" :label="this.$i18n.t('station.stationNames')" prop="stationName" style="width:624px;">
        <el-input v-model="dataForm.stationName" @change="checkStationNames" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('admin.stationImg')" prop="pic">
        <img-upload v-model="dataForm.pic"></img-upload>
        <div v-if="dataForm.pic" @click="dataForm.pic = ''" class="default-btn">删除</div>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('admin.phoNumber')" prop="phone">
        <el-col :span="16">
          <el-col :span="6">
              <el-input
                v-model="dataForm.phonePrefix"
                :placeholder="this.$i18n.t('admin.areaCode')"
                maxlength="10"
                @change="checkPhonePrefix"
              ></el-input>
          </el-col>
          <el-col :span="1">
            <span>——</span>
          </el-col>
          <el-col :span="14">
              <el-input
                v-model="dataForm.phone"
                :placeholder="this.$i18n.t('admin.number')"
                maxlength="11"
                @change="checkPhone"
              ></el-input>
          </el-col>
        </el-col>
        <el-col :span="8"></el-col>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('admin.businTime')" prop="shopTime">
        <el-time-picker
          :clearable="false"
          v-model="timeDateModeVO.shopTime[0]"
          format='HH:mm'
          @change="startChange"
          :placeholder="this.$i18n.t('admin.businStartTime')"
        ></el-time-picker>
        <span style="margin: 0 10px;">{{$t('time.tip')}}</span>
        <el-time-picker
          :clearable="false"
          v-model="timeDateModeVO.shopTime[1]"
          format='HH:mm'
          @change="endChange"
          :placeholder="this.$i18n.t('admin.businEndTime')"
        ></el-time-picker>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('admin.timeInter')" prop="status">
        <el-radio-group v-model="timeDateModeVO.interval">
          <el-radio label="1">{{$t('form.day')}}</el-radio>
          <el-radio label="2">
            {{$t('admin.morAndEve')}}
            <el-tooltip class="item" effect="light" :content="this.$i18n.t('admin.dempoint')" placement="top">
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </el-radio>
          <el-radio label="3">{{$t('admin.hour')}}</el-radio>
          <el-radio label="4">{{$t('admin.halfHour')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('station.businessStatus')">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">{{$t('station.business')}}</el-radio>
          <el-radio :label="0">{{$t('station.close')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('admin.pickupTime')" prop="stationTime">
        <el-input
          :placeholder="this.$i18n.t('admin.inputDayNum')"
          v-model="timeDateModeVO.stationStartTime"
          style="width: 200px;margin-right:12px;"
        >
          <template slot="append">{{$t('admin.startPickup')}}</template>
        </el-input>
        <el-input
          :placeholder="this.$i18n.t('admin.inPickupEndTime')"
          v-model="timeDateModeVO.stationEndTime"
          style="width: 200px;"
        >
          <template slot="append">{{$t('admin.endPickup')}}</template>
        </el-input>
      </el-form-item>
      <el-form-item style="margin-bottom:0" :label="this.$i18n.t('shopProcess.addr')" prop="areaInfo">
        <div class="area-select">
            <el-form-item prop="province">
              <el-select v-model="dataForm.provinceId" :placeholder="this.$i18n.t('tip.select')" @change="selectProvince">
                <el-option
                  v-for="province in provinceList"
                  :key="province.areaId"
                  :label="province.areaName"
                  :value="province.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="this.$i18n.t('address.city')" label-width="50px" prop="city">
              <el-select v-model="dataForm.cityId" :placeholder="this.$i18n.t('address.city')" @change="selectCity">
                <el-option
                  v-for="city in cityList"
                  :key="city.areaId"
                  :label="city.areaName"
                  :value="city.areaId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="this.$i18n.t('address.area')" label-width="50px" prop="area">
              <el-select v-model="dataForm.areaId" :placeholder="this.$i18n.t('address.area')" @change="mapLocation(true)">
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

      <el-form-item  class="addr" :label="this.$i18n.t('shopProcess.detailAddr')" prop="addr">
        <el-input v-model="dataForm.addr" @change="mapLocation" maxlength="100" show-word-limit>
          <!-- <el-button slot="append" icon="el-icon-location" @click="mapLocation">{{$t('admin.location')}}</el-button> -->
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
            <bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen">
              {{$t('admin.stationLocal')}}
            </bm-info-window>
          </bm-marker>
        </baidu-map>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <div class="default-btn"  @click="visible = false">{{$t('crud.filter.cancelBtn')}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('crud.filter.submitBtn')}}</div>
    </span>
  </el-dialog>
</template>

<script>
  import ImgUpload from '@/components/img-upload'

  export default {
    data () {
      var validateProvince = (rule, value, callback) => {
        if (!this.dataForm.province) {
          callback(new Error(this.$i18n.t('admin.seleProv')))
        } else if (!this.dataForm.city) {
          callback(new Error(this.$i18n.t('admin.seleCity')))
        } else if (!this.dataForm.area) {
          callback(new Error(this.$i18n.t('admin.seleDC')))
        } else {
          callback()
        }
      }
      var validateShopTime = (rule, value, callback) => {
        console.log(this.timeDateModeVO.shopTime)
        if (!this.timeDateModeVO.shopTime) {
          callback(new Error(this.$i18n.t('admin.seleBusTime')))
        } else {
          callback()
        }
      }
      var validateStationName = (rule, value, callback) => {
        if (!value.trim()) {
          callback(new Error(this.$i18n.t('admin.stationNameNoNull')))
        } else {
          callback()
        }
      }
      var validateShopTimeStatus = (rule, value, callback) => {
        if (!this.timeDateModeVO.interval) {
          callback(new Error(this.$i18n.t('admin.pleaseChoiceTimeInter')))
        } else {
          callback()
        }
      }
      var validateStationTime = (rule, value, callback) => {
        var reg = /^[0-9]*$/
        if (!reg.test(this.timeDateModeVO.stationStartTime) || !reg.test(this.timeDateModeVO.stationEndTime)) {
          callback(new Error(this.$i18n.t('admin.stationA')))
          return
        }

        this.timeDateModeVO.stationStartTime = parseInt(this.timeDateModeVO.stationStartTime)
        this.timeDateModeVO.stationEndTime = parseInt(this.timeDateModeVO.stationEndTime) || 1
        if (!this.timeDateModeVO.stationStartTime && this.timeDateModeVO.stationStartTime !== 0) {
          callback(new Error(this.$i18n.t('admin.inStatrPupTime')))
        } else if (!this.timeDateModeVO.stationEndTime && this.timeDateModeVO.stationEndTime !== 0) {
          callback(new Error(this.$i18n.t('admin.inPickupEndTime')))
        } else if (this.timeDateModeVO.stationStartTime < 0 || this.timeDateModeVO.stationStartTime > 7) {
          callback(new Error(this.$i18n.t('admin.startTimeis') + ' 0-7'))
        } else if (this.timeDateModeVO.stationEndTime < 0 || this.timeDateModeVO.stationEndTime > 7) {
          callback(new Error(this.$i18n.t('admin.endTimeis') + ' 1-7'))
        } else {
          callback()
        }
      }
      var validateAddr = (rule, value, callback) => {
        if (!value.trim()) {
          callback(new Error(this.$i18n.t('admin.addrNoNull')))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          stationId: null,
          stationName: null,
          pic: null,
          phonePrefix: null,
          phone: null,
          startTime: '',
          endTime: '',
          status: 1,
          provinceId: null,
          province: null,
          cityId: null,
          city: null,
          areaId: null,
          area: null,
          addr: null,
          lng: null,
          lat: null,
          timeDateModeVO: {}
        },
        timeDateModeVO: {
          shopTime: [new Date(2020, 1, 1, 8, 0, 0), new Date(2020, 1, 1, 20, 0, 0)],
          stationStartTime: 0,
          stationEndTime: 7,
          interval: 3
        },
        isSubmit: false,
        isEditAddr: false,
        // 地址信息列表
        addrInfoList: [],
        provinceList: [],
        cityList: [],
        areaList: [],
        show: false,
        center: {
          lng: 113.327955,
          lat: 23.136783
        },
        zoom: 18,
        dataRule: {
          stationName: [
            {required: true, message: this.$i18n.t('admin.stationNameNoNull'), trigger: 'blur'},
            {validator: validateStationName, trigger: 'blur'}
          ],
          status: [
            {required: true, validator: validateShopTimeStatus, trigger: 'blur'}
          ],
          areaInfo: [
            {required: true, validator: validateProvince, trigger: 'blur'}
          ],
          shopTime: [
            {validator: validateShopTime, trigger: 'blur'}
          ],
          stationTime: [
            {validator: validateStationTime, trigger: 'blur'}
          ],
          addr: [
            {required: true, message: this.$i18n.t('admin.addrNoNull'), trigger: 'blur'},
            {validator: validateAddr, trigger: 'blur'}
          ],
          phone: [
            {required: true, message: this.$i18n.t('admin.numberNoNull'), trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      ImgUpload
    },
    methods: {
      startChange (val) {
        if (!val) {
          this.timeDateModeVO.shopTime[0] = new Date(2020, 1, 1, 8, 0, 0)
        }
      },
      endChange (val) {
        if (!val) {
          this.timeDateModeVO.shopTime[1] = new Date(2020, 1, 1, 20, 0, 0)
        }
      },
      async init (stationId) {
        this.dataForm.stationId = stationId || 0
        this.visible = true
        this.show = false
        this.isSubmit = false
        this.setCenter()
        // 等待地址信息返回
        this.addrInfoList = await this.getAreaListInfo()
        this.provinceList = this.addrInfoList
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs.dataForm.resetFields()
          this.cityList = []
          this.areaList = []
          this.dataForm.provinceId = null
          this.dataForm.cityId = null
          this.dataForm.areaId = null
          this.dataForm.phonePrefix = null
          this.$set(this.timeDateModeVO, 'interval', 3)
          this.timeDateModeVO = {
            shopTime: [new Date(2020, 1, 1, 8, 0, 0), new Date(2020, 1, 1, 20, 0, 0)],
            stationStartTime: 0,
            stationEndTime: 7,
            interval: '1'
          }
          if (this.dataForm.stationId) {
            this.getDataInfo()
          }
          // this.listAreaByParentId().then(({data}) => {
          //   this.provinceList = data
          //   if (this.dataForm.stationId) {
          //     this.getDataInfo()
          //   }
          // })
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
            console.log(data)
            resolve(data)
          })
        })
      },
      // 获取店铺详情数据
      getDataInfo () {
        this.$http({
          url: this.$http.adornUrl('/admin/station/info/' + this.dataForm.stationId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm = data
          // let timeDate = JSON.parse(data.timeDate)
          this.timeDateModeVO = JSON.parse(data.timeDate)

          for (const proItem of this.addrInfoList) {
            if (proItem.areaId === this.dataForm.provinceId) {
              this.cityList = proItem.areas
              for (const cityItem of this.cityList) {
                if (cityItem.areaId === this.dataForm.cityId) {
                  this.areaList = cityItem.areas
                  this.center = {
                    lng: this.dataForm.lng,
                    lat: this.dataForm.lat
                  }
                  break
                }
              }
              break
            }
          }
          // this.listAreaByParentId(data.provinceId).then(({data}) => {
          //   this.cityList = data
          // })
          // this.listAreaByParentId(data.cityId).then(({data}) => {
          //   this.areaList = data
          //   this.center = {
          //     lng: this.dataForm.lng,
          //     lat: this.dataForm.lat
          //   }
          // })
        })
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
        // this.listAreaByParentId(val).then(({data}) => {
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
        // this.listAreaByParentId(val).then(({data}) => {
        //   this.areaList = data
        // })
        this.mapLocation(true)
      },
      // 重置表单
      resetForm () {
        this.$refs.dataForm.resetFields()
      },
      checkStationNames () {
        this.dataForm.stationName = this.dataForm.stationName.trim()
      },
      checkPhonePrefix () {
        if (this.dataForm.phonePrefix) {
          var reg = /^[0-9]*$/
          if (!reg.test(this.dataForm.phonePrefix)) {
            this.message(this.$i18n.t('admin.onlyInNum'))
            this.dataForm.phonePrefix = null
            return false
          }
        }
      },
      checkPhone () {
        if (this.dataForm.phone) {
          var reg = /^[0-9]*$/
          if (!reg.test(this.dataForm.phone)) {
            this.message(this.$i18n.t('admin.onlyInNum'))
            this.dataForm.phone = null
            return false
          }
        }
      },
      // 表单提交
      dataFormSubmit () {
      // if (!this.timeDateModeVO.interval) {
      //   this.$message.error(this.$i18n.t('admin.pleaseChoiceTimeInter'))
      //   return
      // }
        if (this.isEditAddr) {
          this.$message.info(this.$i18n.t('admin.mapPosi'))
          return
        }
        this.getAreaName()
        this.dataForm.lng = this.center.lng
        this.dataForm.lat = this.center.lat
        var timeDateMode = this.timeDateModeVO
        if (timeDateMode.shopTime) {
          if (timeDateMode.shopTime[0] instanceof Date) {
            timeDateMode.shopTime[0] = timeDateMode.shopTime[0].getTime()
          }
          if (timeDateMode.shopTime[1] instanceof Date) {
            timeDateMode.shopTime[1] = timeDateMode.shopTime[1].getTime()
          }
          if (timeDateMode.shopTime[0] >= timeDateMode.shopTime[1]) {
            this.$message.error(this.$i18n.t('admin.busiTimeErr'))
            return
          }
          this.dataForm.timeDate = JSON.stringify(timeDateMode)
        }
        if (!this.dataForm.areaId) {
          this.$message.error(this.$i18n.t('shopProcess.addrInputTips'))
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.isSubmit) {
              return false
            }
            this.isSubmit = true
            this.$http({
              url: this.$http.adornUrl('/admin/station'),
              method: this.dataForm.stationId ? 'put' : 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
              this.$message({
                message: this.$i18n.t('publics.operation'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            }).catch((e) => {
              this.isSubmit = false
            })
          }
        })
      },
      message (msg) {
        this.$message({
          message: msg,
          type: 'error',
          duration: 1500
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
        this.setCenter()
        const {lng, lat} = e.target.getCenter()
        this.center.lng = lng
        this.center.lat = lat
        this.zoom = e.target.getZoom()
        this.isEditAddr = false
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  .map {
    width: 100%;
    height: 500px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 240px;
  }
  .area-select {
    display: flex;
    .el-select.el-select--smalll {
      width: 172px;
    }
  }
</style>
<style scoped>
  .stationName >>> .el-input__inner {
    padding-right: 45px !important;
  }
  .addr >>> .el-input__inner {
    padding-right: 55px;
  }
</style>
