<template>
  <div class="mod-prod-prod-transport">
    <!-- 运费模板 -->
    <el-form-item

      :label="this.$i18n.t('freight.shippinngs')"
    >
      <el-radio v-model="dataForm.tableRate" :label="0">{{$t('freight.freeShipping')}}</el-radio>
      <el-radio @change="tableRateChanne" v-model="dataForm.tableRate" :label="-1">{{$t('freight.fixedFreight')}}</el-radio>
      <el-radio v-model="dataForm.tableRate" :label="1">{{$t('freight.freTempl')}}</el-radio>
    </el-form-item>
    <el-form-item
      v-show="dataForm.tableRate===1"
      :label="this.$i18n.t('freight.freTempl')"
      :rules="[{ required: true, message: this.$i18n.t('freight.shippingtBeEmpty')}]"
    >
      <el-select
        v-model="transportId"
        :placeholder="this.$i18n.t('tip.select')"
        @change="changeTransport"
      >
        <el-option
          v-for="transport in transportList"
          :key="transport.transportId"
          :label="transport.transName"
          :value="transport.transportId"
        ></el-option>
      </el-select>
      <!--      新建/刷新-->
      <div class="default-btn text-btn"
                 @click="refreshChange">{{$t('transport.refresh')}}</div>
      <el-divider direction="vertical"></el-divider>
      <div class="default-btn text-btn"
                 @click.stop="addOrUpdateHandle()">{{$t('transport.newConstruction')}}</div>
    </el-form-item>
    <el-form-item
      v-if="dataForm.tableRate===-1"
      :label-width="this.$i18n.t('language')=='English'?'180px':''"
      :label="this.$i18n.t('freight.fixedFreight')"
      prop="deliveryAmount"
      :rules="[{ required: true, message: this.$i18n.t('transport.pleaseEnterTheAmount'), trigger: 'blur' }]"
    >
      <div class="freight">
          <el-input type="number" :min="0.01" v-model="dataForm.deliveryAmount" @blur="handleInputValue(dataForm.deliveryAmount,'deliveryAmount',0.01,9999)" maxlength="10" :placeholder="this.$i18n.t('transport.pleaseEnterTheAmount')"></el-input>
      </div>
    </el-form-item>
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @close="addOrUpdateClose"
                   @refreshDataList="refreshChange"></add-or-update>
    <el-form-item>
      <el-table :data="transportInfo.transfees" style="width: 100%" v-if="transportInfo.transfees"
          header-cell-class-name="table-header"
          row-class-name="table-row">
        <el-table-column :label="this.$i18n.t('transport.distributableArea')" width="350">
          <template slot-scope="scope">
            <span v-if="!scope.row.cityList.length">{{$t('transport.distributableArea')}}</span>
            <span v-for="city in scope.row.cityList" :key="city.areaId" v-else>{{city.areaName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="firstPiece" :label="tableTitle[0]"></el-table-column>
        <el-table-column prop="firstFee" :label="tableTitle[1]"></el-table-column>
        <el-table-column prop="continuousPiece" :label="tableTitle[2]"></el-table-column>
        <el-table-column prop="continuousFee" :label="tableTitle[3]"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item v-if="transportInfo.hasFreeCondition === 1">
      <el-table :data="transportInfo.transfeeFrees" style="width: 100%"
          header-cell-class-name="table-header"
          row-class-name="table-row">
        <el-table-column :label="this.$i18n.t('transport.selArea')" width="350">
          <template slot-scope="scope">
            <span v-for="city in scope.row.freeCityList" :key="city.areaId">{{city.areaName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="freeType" :label="this.$i18n.t('transport.setShopPrice')">
          <template slot-scope="scope">
            <span
              v-if="scope.row.freeType === 0"
            >{{[$t("transport.fullCount"),$t("transport.fullWeight"),$t("transport.fullVolume")][transportInfo.chargeType]}}{{$t("transport.shippingIncluded")}}</span>
            <span
              v-if="scope.row.freeType === 1"
            >{{$t('transport.fullAmount') + $t("transport.shippingIncluded")}}</span>
            <span
              v-if="scope.row.freeType === 2"
            >{{[$t("transport.fullCount"),$t("transport.fullWeight"),$t("transport.fullVolume")][transportInfo.chargeType]}}{{$t("transport.fullAmount1")}}{{$t("transport.shippingIncluded")}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount">
          <template slot-scope="scope">
            <span
              v-if="scope.row.freeType === 1"
            >{{$t("marketing.full")}}{{scope.row.amount}}{{$t("transport.yuan")}}{{$t("transport.shippingIncluded")}}</span>
            <span
              v-if="scope.row.freeType === 0"
            >{{$t("marketing.full")}}{{scope.row.piece}}{{[$t("transport.pieces"),'kg','m³'][transportInfo.chargeType]}}{{$t("transport.shippingIncluded")}}</span>
            <span
              v-if="scope.row.freeType === 2"
            >{{$t("marketing.full")}}{{scope.row.piece}}{{$t("transport.yuan")}}{{$t("product.further")}}{{$t("marketing.full")}}{{scope.row.amount}}{{[$t("transport.pieces"),'kg','m³'][transportInfo.chargeType]}}{{$t("transport.shippingIncluded")}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>

<script>
import { areaNameList } from '@/utils/addr'
import AddOrUpdate from '../platform/transport-add-or-update'

export default {
  data () {
    return {
      transportId: null,
      addOrUpdateVisible: false,
      transportList: [{
        transportId: null,
        transName: ''
      }],
      transportInfo: {
        hasFreeCondition: false,
        transfeeFrees: [{ freeCityList: [] }]
      }

    }
  },
  props: {
    value: {
      default: null,
      type: Number
    },
    dataForm: {
      default: {},
      type: Object
    }
  },
  computed: {

    tableTitle () {
      var titles = [
        [
          this.$i18n.t('transport.firstPiece'),
          this.$i18n.t('transport.transportationCost'),
          this.$i18n.t('transport.continuationPiece'),
          this.$i18n.t('transport.continuationCost')
        ],
        [
          this.$i18n.t('transport.firstWeight'),
          this.$i18n.t('transport.transportationCost'),
          this.$i18n.t('transport.continuedWeight'),
          this.$i18n.t('transport.continuationCost')
        ],
        [
          this.$i18n.t('transport.firstVolume'),
          this.$i18n.t('transport.transportationCost'),
          this.$i18n.t('transport.continuedVolume'),
          this.$i18n.t('transport.continuationCost')
        ]
      ]
      if (this.transportInfo.chargeType) {
        return titles[this.transportInfo.chargeType]
      }
      return titles[0]
    }
  },
  created () {
    this.getTransportList()
  },
  watch: {
    value: function (transportId) {
      this.transportId = transportId
    },
    // transportId发生改变，就改变表格
    transportId: function (transportId) {
      this.changeTransport(transportId)
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    addOrUpdateClose () {
      this.addOrUpdateVisible = false
    },
    tableRateChanne (val) {
      this.dataForm.deliveryAmount = 0.01
      this.$set(this.dataForm, 'deliveryAmount', 0.01)
    },
    /**
     * 处理输入框数据
     * @param data
     * @param dataFields
     * @param min 最小值
     * @param max 最大值
     */
    handleInputValue (data, dataFields, min, max) {
      this.$set(this.dataForm, dataFields, this.checkInput(data))
      if (data || data === 0) {
        // 保留两位小数
        if (data > max) {
          this.$set(this.dataForm, dataFields, max)
        }
        if (data < min) {
          this.$set(this.dataForm, dataFields, min)
        }
      }
    },

    /**
     * 只允许输入正数和小数(保留小数点后两位)
     */
    checkInput (num) {
      if (num) {
        var tmpVal = String(num).replace(/[^\d^\\.]/g, '')
        var reg = /^(0|([1-9]\d*))(\.\d{1,2})?$/ // 最多允许后输入两位小数
        if (!reg.test(tmpVal)) {
          tmpVal = tmpVal + ''
          tmpVal = tmpVal.substring(0, tmpVal.indexOf('.') + 3)
          var n = (tmpVal.split('.')).length - 1
          if (n > 1) {
            tmpVal = tmpVal.substring(0, tmpVal.indexOf('.'))
          }
        }
        return tmpVal
      } else {
        return ''
      }
    },
    getTransportList () {
      this.$http({
        url: this.$http.adornUrl('/platform/transport/list'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        this.transportList = data
      })
    },
    // 新增
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    refreshChange () {
      this.getTransportList()
    },
    changeTransport (transportId) {
      this.$emit('input', transportId)
      if (this.transportId !== 0 || this.transportId !== -1) {
        return
      }
      if (!transportId) {
        return
      }
      this.$http({
        url: this.$http.adornUrl(`/platform/transport/info/${transportId}`),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        this.transportInfo = data
        this.getAreaListInfo()
      })
    },
    getAreaListInfo () {
      this.$http({
        url: this.$http.adornUrl('/admin/area/areaListInfo'),
        method: 'get'
      }).then(({ data }) => {
        for (var t = 0; t < this.transportInfo.transfees.length; t++) {
          let areaList = JSON.parse(JSON.stringify(data))
          const addrNameList = areaNameList(areaList, this.transportInfo.transfees[t].cityList)
          this.$set(this.transportInfo.transfees[t], 'addrNameList', addrNameList)
        }
        for (var f = 0; f < this.transportInfo.transfeeFrees.length; f++) {
          let areaList = JSON.parse(JSON.stringify(data))
          const addrNameList = areaNameList(areaList, this.transportInfo.transfeeFrees[f].freeCityList)
          this.$set(this.transportInfo.transfeeFrees[f], 'freeAddrNameList', addrNameList)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .mod-prod-prod-transport{
   margin: 50px 0 50px;
 }
 .freight{
    width: 175px;
  }
</style>
