<template>
  <div class="mod-prod-info same-city">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{ $t("shop.sameCityDelFun") }}
      </div>
    </div>
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      label-width="120px"
      size="small"
    >
      <el-form-item :label="this.$i18n.t('shop.enableStatus') + '：'">
        <div>
          <el-switch v-model="dataForm.status"></el-switch>
          <span class="status-tips">{{ $t("shop.deliSerProByYou") }}</span>
        </div>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('shop.shopAdress') + '：'">
        <span
          >{{ shopInfo.province }} {{ shopInfo.city }} {{ shopInfo.area }}
          {{ shopInfo.shopAddress }}（{{ $t("shop.phone") }}：{{
            shopInfo.tel
          }}）</span
        >
      </el-form-item>
       <el-form-item :label="this.$i18n.t('shop.charges') + '：'">
        <div>
          <el-radio v-model="dataForm.chargeType" :label="1">{{
            $t("shop.chaDelFeeByReg")
          }}</el-radio>
          <el-radio v-model="dataForm.chargeType" :label="2">{{
            $t("shop.delFeeChaDis")
          }}</el-radio>
        </div>
        <span v-if="dataForm.chargeType === 1" style="color: gray">{{
          $t("shop.chaFixDelFeeByRe")
        }}</span>
        <span v-if="dataForm.chargeType === 2" style="color: gray">{{
          $t("shop.byWalkDis")
        }}</span>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('shop.startingFeeY') + '：'"
        prop="startingFee"
      >
        <!-- <el-col :span="5" style="margin-left: 15px"> -->
        <el-col :span="6">
          <el-input-number
            :max="100000"
            :placeholder="this.$i18n.t('shop.startingFee')"
            size="small"
            v-model="dataForm.startingFee"
            :precision="2"
            :step="0.01"
            :min="0.0"
          ></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('shop.deliveryFeeY') + '：'"
        prop="deliveryFee"
        v-if="dataForm.chargeType === 1"
      >
        <el-col :span="6">
          <el-input-number
            :max="100000"
            :placeholder="this.$i18n.t('shop.deliveryFee')"
            size="small"
            v-model="dataForm.deliveryFee"
            :min="0.00"
            :precision="2"
            :step="0.01"
          ></el-input-number>
        </el-col>
      </el-form-item>
      <!--  -->
      <el-form-item
        :label="this.$i18n.t('shop.costAllocation') + '：'"
        style="color: gray"
        prop="headDistance"
        v-if="dataForm.chargeType === 2"
      >
        <!-- <el-col :span="2"> -->
        <el-input-number
          :max="100000"
          v-model="dataForm.headDistance"
          size="small"
          :precision="1"
          :min="0.1"
          :step="0.1"
        ></el-input-number>
        <!-- </el-col> -->
        <!-- <el-col :span="1" style="margin-left: 15px"> -->
        <span style="fontsize: 15px">{{ $t("shop.withinKm") }}</span>
        <!-- </el-col>
        <el-col :span="2"> -->
        <el-input-number
          :max="100000"
          v-model="dataForm.deliveryFee"
          size="small"
          :min="0.00"
          :precision="2"
          :step="0.01"
        ></el-input-number>
        <!-- </el-col> -->
        <!-- <el-col :span="3" style="margin-left: 15px"> -->
        <span style="fontsize: 15px">{{ $t("shop.yuanToChaDelFee") }}</span>
        <!-- </el-col> -->
        <!-- <el-col :span="2"> -->
        <el-input-number
          :max="100000"
          v-model="dataForm.overDistance"
          size="small"
          :precision="1"
          :step="0.1"
          :min="0.1"
        ></el-input-number>
        <!-- </el-col> -->
        <!-- <el-col :span="2" style="margin-left: 15px"> -->
        <span style="fontsize: 15px">km，{{ $t("shop.incInDelFees") }}</span>
        <!-- </el-col> -->
        <!-- <el-col :span="2"> -->
        <el-input-number
          :max="100000"
          v-model="dataForm.overDistanceFee"
          size="small"
          :precision="2"
          :step="0.01"
          :min="0.01"
        ></el-input-number>
        <!-- </el-col> -->
        <!-- <el-col :span="1" style="margin-left: 15px"> -->
        <span style="fontsize: 15px">{{ $t("admin.dollar") }}。</span>
        <!-- </el-col> -->
      </el-form-item>
      <el-form-item
        prop="brief"
        :label="this.$i18n.t('product.deliveryArea') + '：'"
      >
        <!-- <template> -->
        <!-- <el-col :span="20"> -->
        <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler">
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          <bm-polygon
            :path="polygonPath"
            stroke-color="blue"
            :stroke-opacity="0.5"
            :scroll-wheel-zoom="false"
            :stroke-weight="2"
            :editing="true"
            @lineupdate="updatePolygonPath"
          />
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
        <!-- </el-col> -->
        <!-- </template> -->
      </el-form-item>
      <el-form-item>
        <div
          class="default-btn text-btn"
          @click="resetMapPoint()"
          >{{ $t("shop.resetMap") }}</div
        >
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('shop.renewalCharge') + '：'"
        prop="prodName"
      >
        <!-- <el-col :span="1" style="margin-right: 5px"> -->
        <span style="fontsize: 15px">{{ $t("shop.commodityWeight") }}</span>
        <!-- </el-col> -->
        <!-- <el-col :span="2"> -->
        <el-input-number
          :max="100000"
          v-model="dataForm.freeWeight"
          :precision="2"
          :step="0.01"
          :min="0.01"
          :placeholder="this.$i18n.t('shop.pleaseEnterTheWeight')"
          size="small"
        ></el-input-number>
        <!-- </el-col> -->

        <!-- <el-col :span="3" style="margin-left: 15px"> -->
        <span style="fontsize: 15px">{{ $t("shop.noExtraCharge") }}</span>
        <!-- </el-col>
        <el-col :span="2"> -->
        <el-input-number
          :max="100000"
          v-model="dataForm.overWeight"
          :precision="2"
          :step="0.01"
          :min="0.01"
          :placeholder="this.$i18n.t('shop.pleaseEnterTheWeight')"
          size="small"
        ></el-input-number>
        <!-- </el-col> -->
        <!-- <el-col :span="2" style="margin-left: 15px"> -->
        <span style="fontsize: 15px"
          >kg，{{ $t("shop.renewalFeeIncrease") }}</span
        >
        <!-- </el-col>
        <el-col :span="2"> -->
        <el-input-number
          :max="100000"
          v-model="dataForm.overWeightFee"
          :precision="2"
          :step="0.01"
          :min="0.01"
          size="small"
        ></el-input-number>
        <!-- </el-col>
        <el-col :span="2" style="margin-left: 15px"> -->
        <span style="fontsize: 15px">{{ $t("admin.dollar") }}。</span>
        <!-- </el-col> -->
      </el-form-item>
      <el-form-item>
        <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
          $t("order.save")
        }}</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Big from 'big.js'
export default {
  data () {
    return {
      polygonPath: [
      ],
      center: {
        lng: 113.327955,
        lat: 23.136783
      },
      zoom: 13,
      isDataTrue: false,
      show: false,
      shopInfo: {
        tel: '',
        city: '',
        shopLat: '',
        shopLng: '',
        area: '',
        shopAddress: ''
      },
      dataForm: {
        chargeType: 1,
        samecityId: 0,
        shopId: 0,
        status: 0,
        polygonPath: [],
        startingFee: 0.00,
        deliveryFee: 0.00,
        headDistance: 0.0,
        overDistance: 0.0,
        overDistanceFee: 0.00,
        freeWeight: 0.0,
        overWeight: 0.0,
        overWeightFee: 0.00
      },
      dataRule: {
        startingFee: [
          { required: true, message: this.$i18n.t('shop.stargFeeCannoEmp'), trigger: 'blur' }
        ],
        deliveryFee: [
          { required: true, message: this.$i18n.t('shop.delFeeCannoEmp'), trigger: 'blur' }
        ]
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  components: {
    Big
  },
  created: function () {
  },
  computed: {
  },
  activated () {
  },
  methods: {
    handler ({ BMap, map }) {
      this.getDataInfo()
    },
    // 获取店铺详情数据
    getDataInfo () {
      this.setCenter()
      this.getSameCityDetail()
      this.polygonPath = []
      this.$http({
        url: this.$http.adornUrl('/shop/shopDetail/info'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.shopInfo.tel = data.tel
        this.shopInfo.province = data.province
        this.shopInfo.area = data.area
        this.shopInfo.city = data.city
        this.shopInfo.shopLng = data.shopLng
        this.shopInfo.shopLat = data.shopLat
        this.center = {
          lng: this.shopInfo.shopLng,
          lat: this.shopInfo.shopLat
        }
        if (!this.dataForm.samecityId || !this.polygonPath || this.polygonPath.length <= 0) {
          let lng = new Big(Number.parseFloat(this.shopInfo.shopLng))
          let lat = new Big(Number.parseFloat(this.shopInfo.shopLat))
          let point1 = {
            lng: Number.parseFloat(this.shopInfo.shopLng),
            lat: Number.parseFloat(this.shopInfo.shopLat)
          }
          let point2 = {
            lng: lng.plus(0.01),
            lat: lat.plus(0.01)
          }
          let point3 = {
            lng: lng.plus(0.02),
            lat: lat.plus(0.02)
          }
          this.polygonPath.push(point1)
          this.polygonPath.push(point2)
          this.polygonPath.push(point3)
        }
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
      this.zoom = 13
    },
    /**
     * 获取店铺同城配送的配置
     */
    getSameCityDetail () {
      this.$http({
        url: this.$http.adornUrl(`/delivery/sameCity/getSameCityInfo`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data) {
          this.dataForm = data
          this.dataForm.status = this.dataForm.status === 1
          this.polygonPath = this.dataForm.polygonPath
          // this.center = {
          //   lng: this.polygonPath[0].lng,
          //   lat: this.polygonPath[0].lat
          // }
        }
      })
    },
    updatePolygonPath (e) {
      this.polygonPath = e.target.getPath()
    },
    // 表单提交
    resetMapPoint () {
      this.dataForm.status = this.dataForm.status ? 1 : 0
      this.dataForm.polygonPath = null
      this.polygonPath = null
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/delivery/sameCity`),
            method: this.dataForm.samecityId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.polygonPath = []
            let lng = new Big(Number.parseFloat(this.shopInfo.shopLng))
            let lat = new Big(Number.parseFloat(this.shopInfo.shopLat))
            let point1 = {
              lng: Number.parseFloat(this.shopInfo.shopLng),
              lat: Number.parseFloat(this.shopInfo.shopLat)
            }
            let point2 = {
              lng: lng.plus(0.01),
              lat: lat.plus(0.01)
            }
            let point3 = {
              lng: lng.plus(0.02),
              lat: lat.plus(0.02)
            }
            console.log(point1)
            this.polygonPath.push(point1)
            this.polygonPath.push(point2)
            this.polygonPath.push(point3)
            // this.getDataInfo()
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500
            })
          })
        }
      })
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
    // 表单提交
    dataFormSubmit () {
      this.checkData()
      if (!this.isDataTrue) {
        return
      }
      this.dataForm.polygonPath = this.polygonPath
      this.dataForm.status = this.dataForm.status ? 1 : 0
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/delivery/sameCity`),
            method: this.dataForm.samecityId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.getDataInfo()
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500
            })
          })
        }
      })
    },
    checkData () {
      if (this.dataForm.overWeightFee == null) {
        this.errorMsg(this.$i18n.t('shop.costCannotBeEmpty'))
        this.isDataTrue = false
        return
      }
      if (this.dataForm.chargeType === 2 && this.dataForm.overDistanceFee == null) {
        this.errorMsg(this.$i18n.t('shop.excDisFeeCanBeEm'))
        this.isDataTrue = false
        return
      }
      if (this.dataForm.chargeType === 2 && (this.dataForm.headDistance == null || this.dataForm.overDistance == null)) {
        this.errorMsg(this.$i18n.t('shop.distanceCannotBeEmpty'))
        this.isDataTrue = false
        return
      }
      if (!this.dataForm.freeWeight == null || !this.dataForm.overWeight == null) {
        this.errorMsg(this.$i18n.t('shop.weightCannotBeEmpty'))
        this.isDataTrue = false
        return
      }
      if (this.polygonPath != null && this.polygonPath.length > 12) {
        this.errorMsg(this.$i18n.t('shop.polygonPathOverNum'))
        this.isDataTrue = false
        return
      }
      this.isDataTrue = true
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
<style lang="scss" scoped>
.same-city {
  .el-form-item--small.el-form-item {
    margin-bottom: 20px;
  }
  .status-tips {
    color: #999999;
    margin-left: 20px;
  }
  .map {
    width: 50%;
    height: 500px;
  }
  .el-input-number--small {
    width: 172px;
  }
}
</style>
