<template>
  <el-dialog :title="$t('seckill.view')" :close-on-click-modal="false" :visible.sync="visible" width="764px">
    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      size="small"
      :label-width="this.$i18n.t('language') === 'language' ? '180px' : '100px'"
    >
      <el-form-item :label="$t('shop.pickupLocationName')" prop="stationName" style="width:530px;">
        <el-input disabled :value="dataForm.stationName"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.pic" :label="$t('platform.stationImg')" prop="pic">
        <img-upload v-model="dataForm.pic" :disabled="true"></img-upload>
      </el-form-item>
      <el-form-item :label="$t('shop.telNumber')">
        <el-input disabled :value="(dataForm.phonePrefix ? dataForm.phonePrefix + ' - ' : '') + dataForm.phone"></el-input>
      </el-form-item>
      <el-form-item :label="$t('brand.status')" prop="status">
        <el-radio-group v-model="dataForm.status" disabled>
          <el-radio :label="1">{{$t('shop.business')}}</el-radio>
          <el-radio :label="0">{{$t('seckill.close')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('platform.pcd')" prop="status">
        <el-input disabled type="textarea" rows="3" :value="dataForm.province + dataForm.city + dataForm.area + dataForm.addr"></el-input>
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
            <bm-info-window
              :show="show"
              @close="infoWindowClose"
              @open="infoWindowOpen"
            >{{$t('platform.stationLocal')}}</bm-info-window>
          </bm-marker>
        </baidu-map>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('shop.return')}}</div>
      <!-- <el-button type="primary" @click="dataFormSubmit()">确定</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import ImgUpload from '@/components/img-upload'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        stationId: null,
        stationName: null,
        pic: null,
        phonePrefix: null,
        phone: null,
        status: 0,
        provinceId: null,
        province: null,
        cityId: null,
        city: null,
        areaId: null,
        area: null,
        addr: null,
        lng: null,
        lat: null
      },
      addrInfoList: [],
      provinceList: [],
      cityList: [],
      areaList: [],
      show: false,
      center: {
        lng: 113.327955,
        lat: 23.136783
      },
      zoom: 18
    }
  },
  components: {
    ImgUpload
  },
  methods: {
    init (stationId) {
      this.dataForm.stationId = stationId || 0
      this.visible = true
      this.show = false
      this.setCenter()

      this.$nextTick(async () => {
        this.$refs['dataForm'].resetFields()
        this.$refs.dataForm.resetFields()
        this.cityList = []
        this.areaList = []
        this.dataForm.provinceId = null
        this.dataForm.cityId = null
        this.dataForm.areaId = null
        // 等待地址信息返回
        this.addrInfoList = await this.getAreaListInfo()
        this.provinceList = this.addrInfoList
        if (this.dataForm.stationId) {
          this.getDataInfo()
        }
        // this.listAreaByParentId().then(({ data }) => {
        //   this.provinceList = data
        //   if (this.dataForm.stationId) {
        //     this.getDataInfo()
        //   }
        // })
      })
    },
    // 获取店铺详情数据
    getDataInfo () {
      this.$http({
        url: this.$http.adornUrl('/platform/station/info/' + this.dataForm.stationId),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
        this.center = {
          lng: this.dataForm.lng,
          lat: this.dataForm.lat
        }
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
        // this.listAreaByParentId(data.provinceId).then(({ data }) => {
        //   this.cityList = data
        // })
        // this.listAreaByParentId(data.cityId).then(({ data }) => {
        //   this.areaList = data
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
    // // 选择省
    // selectProvince (val) {
    //   this.dataForm.cityId = null
    //   this.dataForm.city = ''
    //   // 获取城市的select
    //   this.listAreaByParentId(val).then(({ data }) => {
    //     this.cityList = data
    //   })
    //   this.mapLocation(true)
    // },
    // // 选择市
    // selectCity (val) {
    //   this.dataForm.areaId = null
    //   this.dataForm.area = ''
    //   // 获取区的select
    //   this.listAreaByParentId(val).then(({ data }) => {
    //     this.areaList = data
    //   })
    //   this.mapLocation(true)
    // },
    // 重置表单
    resetForm () {
      this.$refs.dataForm.resetFields()
    },
    // checkPhonePrefix () {
    //   if (this.dataForm.phonePrefix) {
    //     var reg = /^[0-9]*$/
    //     if (!reg.test(this.dataForm.phonePrefix)) {
    //       this.message('自能输入数字')
    //       this.dataForm.phonePrefix = null
    //       return false
    //     }
    //   }
    // },
    // checkPhone () {
    //   if (this.dataForm.phone) {
    //     var reg = /^[0-9]*$/
    //     if (!reg.test(this.dataForm.phone)) {
    //       this.message('自能输入数字')
    //       this.dataForm.phone = null
    //       return false
    //     }
    //   }
    // },
    // // 表单提交
    // dataFormSubmit () {
    //   this.getAreaName()
    //   this.dataForm.lng = this.center.lng
    //   this.dataForm.lat = this.center.lat
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       this.$http({
    //         url: this.$http.adornUrl('/platform/station'),
    //         method: this.dataForm.stationId ? 'put' : 'post',
    //         data: this.$http.adornData(this.dataForm)
    //       }).then(({ data }) => {
    //         this.$message({
    //           message: '操作成功',
    //           type: 'success',
    //           duration: 1500,
    //           onClose: () => {
    //             this.visible = false
    //             this.$emit('refreshDataList')
    //           }
    //         })
    //       })
    //     }
    //   })
    // },
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
          this.errorMsg(this.$i18n.t('platform.selePCD'))
          return
        }
        area = this.dataForm.province + this.dataForm.city + this.dataForm.area + this.dataForm.addr
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
<style lang="scss" >
.map {
  width: 100%;
  height: 220px;
}
</style>
