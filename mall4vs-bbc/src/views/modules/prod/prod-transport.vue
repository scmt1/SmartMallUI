<template>
  <div class="mod-prod-prod-transport">
    <el-form-item
      :label="this.$i18n.t('product.shippinngs')"
      :label-width="this.$i18n.t('language') === 'English'?'145px':'100px'"
      :rules="[{ required: true, message: $t('product.shippingtBeEmpty')}]"
    >
      <el-select
        v-model="transportId"
        :placeholder="this.$i18n.t('tip.select')"
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
                 @click="refreshChange">{{$t('admin.refresh')}}</div>
      <el-divider direction="vertical"></el-divider>
      <div class="default-btn text-btn"
                 @click.stop="addOrUpdateHandle()">{{$t('admin.newConstruction')}}</div>
    </el-form-item>
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @close="addOrUpdateClose"
                   @refreshDataList="refreshChange"></add-or-update>
    <el-form-item v-if="transportInfo.transfees">
      <el-table :data="transportInfo.transfees" style="width: 100%">
        <el-table-column :label="this.$i18n.t('product.deliveryArea')" width="350">
          <template slot-scope="scope">
            <span v-if="!scope.row.cityList.length">{{$t("transport.allRegions")}}</span>
            <!-- <el-tag v-for="city in scope.row.cityList" :key="city.areaId" v-else>{{city.areaName}}</el-tag> -->
            <el-tag v-for="(city,index) in scope.row.addrNameList" :key="index">{{city}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="firstPiece" :label="tableTitle[0]"></el-table-column>
        <el-table-column prop="firstFee" :label="tableTitle[1]"></el-table-column>
        <el-table-column prop="continuousPiece" :label="tableTitle[2]"></el-table-column>
        <el-table-column prop="continuousFee" :label="tableTitle[3]"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item v-if="transportInfo.hasFreeCondition === 1">
      <el-table :data="transportInfo.transfeeFrees" style="width: 100%">
        <el-table-column :label="this.$i18n.t('transport.selArea')" width="350">
          <template slot-scope="scope">
            <!-- <el-tag v-for="city in scope.row.freeCityList"
            :key="city.areaId">{{city.areaName}}</el-tag>-->
            <el-tag v-for="(city,index) in scope.row.freeAddrNameList" :key="index">{{city}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="freeType" :label="this.$i18n.t('transport.freeShippCondi')">
          <template slot-scope="scope">
            <span
              v-if="scope.row.freeType === 0"
            >{{[$t("transport.fullCount"),$t("transport.fullWeight"),$t("transport.fullVolume")][transportInfo.chargeType]}}{{$t("transport.shippingIncluded")}}</span>
            <span
              v-if="scope.row.freeType === 1"
            >{{$t('transport.fullAmount') + $t("transport.shippingIncluded")}}</span>
            <span
              v-if="scope.row.freeType === 2"
            >{{[$t("transport.fullCount"),$t("transport.fullWeight"),$t("transport.fullVolume")][transportInfo.chargeType]}}{{$t("transport.shippingIncluded")}}</span>
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
            >{{$t("marketing.full")}}{{scope.row.piece}}{{$t("transport.yuan")}}{{$t("transport.andFull")}} {{scope.row.amount}} {{[$t("transport.pieces"),'kg','m³'][transportInfo.chargeType]}}{{$t("transport.shippingIncluded")}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>

<script>
import { areaNameList } from '@/utils/addr'
import AddOrUpdate from '../shop/transport-add-or-update'

export default {
  data () {
    return {
      transportId: null,
      transportList: [{
        transportId: null,
        transName: ''
      }],
      addOrUpdateVisible: false,
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
    }
  },
  computed: {
    tableTitle () {
      var titles = [
        [
          this.$i18n.t('transport.firstPiece'),
          this.$i18n.t('transport.transportationCost'),
          this.$i18n.t('transport.continuationPiece'),
          this.$i18n.t('transport.continuationCost')],
        [
          this.$i18n.t('transport.firstWeight'),
          this.$i18n.t('transport.transportationCost'),
          this.$i18n.t('transport.continuedWeight'),
          this.$i18n.t('transport.continuationCost')],
        [
          this.$i18n.t('transport.firstVolume'),
          this.$i18n.t('transport.transportationCost'),
          this.$i18n.t('transport.continuedVolume'),
          this.$i18n.t('transport.continuationCost')]
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
    // 获取数据列表
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/shop/transport/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.searchForm
          )
        )
      }).then(({data}) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    getTransportList () {
      this.$http({
        url: this.$http.adornUrl('/shop/transport/list'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        this.transportList = data
      })
    },
    changeTransport (transportId) {
      this.$emit('input', transportId)
      if (!transportId) {
        return
      }
      this.$http({
        url: this.$http.adornUrl(`/shop/transport/info/${transportId}`),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        this.transportInfo = data
        this.getAreaListInfo()
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

<style lang="scss">
</style>
