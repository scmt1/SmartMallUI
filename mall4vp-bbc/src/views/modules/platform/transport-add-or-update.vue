<template>
  <el-dialog
    :title="!dataForm.transportId ? $t('crud.addTitle') : $t('user.editBtn')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="72%"
    @close="close"
    class="transport-pop"
  >
    <el-form
      :model="dataForm"
      ref="dataForm"
      size="small"
      @keyup.enter.native="dataFormSubmit()"
      label-width="130px"
    >
      <el-form-item
        :label="$t('transport.name')"
        prop="transName"
        maxlength="36"
        show-word-limit
        :rules="[{ required: true, message: $t('shop.templateNameCannotBeEmpty')}]"
      >
        <el-input v-model="dataForm.transName" :placeholder="$t('transport.name')" maxlength="36" show-word-limit></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('transport.type')" prop="isFreeFee" required="required">
        <template>
          <el-radio-group v-model="dataForm.isFreeFee" @change="changeFreeFee">
            <el-radio :label="0">{{$t("transport.buyerPrice")}}</el-radio>
            <el-radio :label="1">{{$t("transport.shopPrice")}}</el-radio>
          </el-radio-group>
        </template>
      </el-form-item> -->
      <el-form-item :label="$t('transport.chargePrice')" prop="chargeType">
        <template>
          <el-radio-group v-model="dataForm.chargeType" :disabled="dataForm.isFreeFee == 1">
            <el-radio :label="0">{{$t("transport.byCount")}}</el-radio>
            <el-radio :label="1">{{$t("transport.byWeight")}}</el-radio>
            <el-radio :label="2">{{$t("transport.byVolume")}}</el-radio>
          </el-radio-group>
        </template>
      </el-form-item>
      <!-- 添加可配送的区域和邮费 START -->
      <div class="area-transfee-table">
        <el-table
          :data="dataForm.transfees"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%;">
          <el-table-column
            width="420"
            :label="$t('transport.distributableArea')"
          >
            <template slot-scope="scope">
              <span v-if="scope.$index == 0&& dataForm.isFreeFee==1">{{$t("transport.allRegions")}}</span>
              <template v-if="dataForm.isFreeFee==0">
                <span
                  v-if="(!scope.row.addrNameList || !scope.row.addrNameList.length) "
                >{{$t("shop.pleaseSelectADeliveryArea")}}</span>
                <span>
                  <!-- {{scope.row.addrNameList.toString()}} -->
                  <span  class="city-text" v-for="(city,index) in scope.row.addrNameList" :key="index">{{city}}</span>
                </span>
                <div
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(`${scope.$index}`)"
                >{{$t("groups.edit")}}</div>
                <div
                  class="default-btn text-btn"
                  @click="deleteHandle(`${scope.$index}`)"
                >{{$t("text.delBtn")}}</div>
              </template>
            </template>
          </el-table-column>
          <!-- 首件数量 -->
          <el-table-column
            :label="tableTitle[0]"
            width="220">
            <template slot-scope="scope">
              <el-form-item
                :prop="`transfees.${scope.$index}.firstPiece`"
                label-width="0px"
                :inline-message="true"
                :rules="[{ required: true, message: `${tableTitle[0]}${$t('publics.noNull')}`}]"
              >
                <el-input
                  type="number"
                  oninput="if(value.length>10)value=value.slice(0,10)"
                  v-model="scope.row.firstPiece"
                  @change="checkNumber(scope.row,1)"
                  :disabled="!scope.row.status && scope.$index === 0"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 首件邮费 -->
          <el-table-column
            :label="tableTitle[1]"
            width="240">
            <template slot-scope="scope">
              <el-form-item
                :prop="`transfees.${scope.$index}.firstFee`"
                label-width="0px"
                :inline-message="true"
                :rules="[{ required: true, message: `${tableTitle[1]}${$t('publics.noNull')}`,trigger: 'blur'}]"
              >
                <el-input-number
                  v-model="scope.row.firstFee"
                  @change="checkNumber(scope.row,2)"
                  :disabled="!scope.row.status && scope.$index === 0"
                  :precision="2"
                  :min="0"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 续件数量 -->
          <el-table-column
            :label="tableTitle[2]"
            width="220">
            <template slot-scope="scope">
              <el-form-item
                :prop="`transfees.${scope.$index}.continuousPiece`"
                label-width="0px"
                :inline-message="true"
                :rules="[{ required: true, message: `${tableTitle[2]}${$t('publics.noNull')}`}]"
              >
                <el-input
                  type="number"
                  oninput="if(value.length>10)value=value.slice(0,10)"
                  v-model="scope.row.continuousPiece"
                  @input="scope.row.continuousPiece=scope.row.continuousPiece.replace(/[^\d]/g,'')"

                  @change="checkNumber(scope.row,3)"
                  :disabled="!scope.row.status && scope.$index === 0"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 续件邮费 -->
          <el-table-column
            :label="tableTitle[3]"
            width="220">
            <template slot-scope="scope">
              <el-form-item
                :prop="`transfees.${scope.$index}.continuousFee`"
                label-width="0px"
                :inline-message="true"
                :rules="[{ required: true, message: `${tableTitle[3]}${$t('publics.noNull')}`,trigger: 'blur'}]"
              >
                <el-input-number
                  v-model="scope.row.continuousFee"
                  :precision="2"
                  :min="0"
                  @change="checkNumber(scope.row,4)"
                  :disabled="!scope.row.status && scope.$index === 0"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 20px;" v-if="dataForm.isFreeFee == 0">
        <div class="default-btn primary-btn icon-btn" @click="addTransfee()">
          <i class="el-icon-location-outline"></i>
          {{$t("shop.addAreaAndShipping")}}
        </div>
      </div>
      <!-- 添加可配送的区域和邮费 END -->
      <!-- 指定条件包邮 START -->
      <el-checkbox
        v-model="dataForm.hasFreeCondition"
        v-if="!dataForm.isFreeFee"
        style="margin-top:10px;font-size:50px"
      >{{$t("shop.freeShippingOnSpecifiedConditions")}}</el-checkbox>
      <el-table
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        v-if="dataForm.hasFreeCondition && !dataForm.isFreeFee"
        :data="dataForm.transfeeFrees"
        style="width: 100%;"
      >
        <el-table-column
          align="left"
          fixed
          :label="$t('transport.selArea')"
        >
          <template slot-scope="scope">
            <span
              v-if="!scope.row.freeAddrNameList || !scope.row.freeAddrNameList.length"
            >{{$t("transport.selCity")}}</span>
            <span class="city-text" v-for="(city,index) in scope.row.freeAddrNameList" :key="index">{{city}}</span>
            <div
              class="default-btn text-btn"
              @click="addOrUpdateTransfeeFree(`${scope.$index}`)"
            >{{$t("groups.edit")}}</div>
            <div
              class="default-btn text-btn"
              @click="deleteTransfeeFree(`${scope.$index}`)"
            >{{$t("text.delBtn")}}</div>
          </template>
        </el-table-column>
        <el-table-column
          style="min-width: 500px"
          :label="$t('transport.setShopPrice')"
        >
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.freeType">
              <el-radio :label="0">{{[$t("transport.byCount"),$t("transport.byWeight"),$t("transport.byVolume")][dataForm.chargeType]}}</el-radio>
              <el-radio :label="1">{{$t("product.freeShiullAmount")}}</el-radio>
              <el-radio
                :label="2"
              >{{[$t("transport.fullCount"),$t("transport.fullWeight"),$t("transport.fullVolume")][dataForm.chargeType]}}{{$t("transport.fullAmount1")}}{{$t("transport.shippingIncluded")}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          width="270"
          align="right">
          <template slot-scope="scope">
            <!-- 满xx元包邮 -->
            <el-form-item
              :prop="`transfeeFrees.${scope.$index}.amount`"
              v-if="scope.row.freeType == 1 || scope.row.freeType == 2"
              label-width="0px"
              :rules="[{ required: true, message: `${$t('publics.noNull')}`}]"
            >
              <el-input
                type="number"
                size="small"
                width="200"
                @change="checkNumber(scope.row,5)"
                v-model="scope.row.amount"
                :precision="2"
                :min="0"
              >
                <template slot="prepend">{{$t("marketing.full")}}</template>
                <template slot="append">{{$t("platform.dollar")}}{{$t("product.freeShipping")}}</template>
              </el-input>
            </el-form-item>
            <el-form-item
              :prop="`transfeeFrees.${scope.$index}.piece`"
              v-if="scope.row.freeType == 0"
              label-width="0px"
              :rules="[{ required: true, message: `${$t('publics.noNull')}`}]"
            >
              <el-input
                v-model="scope.row.piece"
                type="number"
                size="small"
                width="200"
                @change="checkNumber(scope.row,6)"
              >
                <template slot="prepend">{{$t("marketing.full")}}</template>
                <template slot="append">{{[$t("transport.pieces"),'kg','m³'][dataForm.chargeType]}}</template>
              </el-input>
            </el-form-item>
            <!-- 满xx件/重量/体积包邮 -->
            <el-form-item
              :prop="`transfeeFrees.${scope.$index}.piece`"
              v-if="scope.row.freeType == 2"
              label-width="0px"
              :rules="[{ required: true, message: `${$t('publics.noNull')}`}]"
            >
              <el-input
                v-model="scope.row.piece"
                type="number"
                size="small"
                width="200"
                @change="checkNumber(scope.row,6)"
              >
                <template slot="prepend">{{$t("marketing.full")}}</template>
                <template slot="append">{{[$t("transport.pieces"),'kg','m³'][dataForm.chargeType]}}</template>
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px" v-if="dataForm.isFreeFee == 0">
        <div
          :class="['default-btn primary-btn icon-btn', !dataForm.hasFreeCondition ? 'disabled-btn': '']"
          @click="addTransfeeFree()"
        ><i class="el-icon-location-outline"></i>
        {{$t("shop.clickToAddTheSpecifiedShippingConditions")}}</div>
      </div>
      <!-- 指定条件包邮 END -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="close">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </el-dialog>
</template>

<script>
import { areaNameList } from '@/utils/addr'
import AddOrUpdate from './transcity-add-or-update'

export default {
  data () {
    return {
      hasFreeCondition: 0,
      visible: false,
      addOrUpdateVisible: false,
      dataForm: {
        hasFreeCondition: false,
        transName: '',
        createTime: '',
        chargeType: 0,
        transportId: 0,
        isFreeFee: 0,
        transfees: [{ cityList: [], status: 1 }],
        transfeeFrees: [{freeCityList: []}]
      },
      transFeesSave: [{ cityList: [], addrNameList: [], status: 1 }], // 暂存区域，防止类型切换时原先选择的数据丢失
      areaList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      isSubmit: false,
      editVisible: false,
      transfeesBin: [], // 可配送区域运费，禁止选中列表
      transfeeFreesBin: [] // 指定条件包邮，禁止选中列表
    }
  },
  components: {
    AddOrUpdate
  },
  watch: {
    // 如果当前对话框不可见，则关闭选择城市的对话框
    visible: function (val) {
      if (!val) {
        this.addOrUpdateVisible = false
      }
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
      if (this.dataForm.chargeType) {
        return titles[this.dataForm.chargeType]
      }
      return titles[0]
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.isSubmit = false
      this.dataForm.transportId = id || 0
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.dataForm = {
          hasFreeCondition: false,
          transName: '',
          createTime: '',
          chargeType: 0,
          transportId: 0,
          isFreeFee: 0,
          transfees: [{ cityList: [], status: 1 }],
          transfeeFrees: [{ freeCityList: [] }]
        }
      })
      // 重置买家承担运费时的数据
      this.transFeesSave = [{ cityList: [], addrNameList: [], status: 1 }]
      this.transfeesBin = []
      this.transfeeFreesBin = []
      this.getTransport()
    },
    getTransport () {
      if (this.dataForm.transportId) {
        this.$http({
          // 获取运费模板数据
          url: this.$http.adornUrl(`/platform/transport/info/${this.dataForm.transportId}`),
          method: 'get'
        }).then(({ data }) => {
          this.getAreaListInfo()
          if (data.isFreeFee) {
            data.transfees[0].status = 0
          } else {
            data.transfees[0].status = 1
          }
          this.dataForm = data
          this.dataForm.hasFreeCondition = !!data.hasFreeCondition
          this.handleBinAreas()
        })
      } else {
        this.getAreaListInfo()
        this.handleBinAreas()
      }
    },
    getDataList (row, cityList, type) {
      console.log(row, cityList, type)
      if (type === 0) {
        this.dataForm.transfees[row].cityList = cityList
        let addrNameList = this.setAddrInfoByAreaList(cityList)
        this.$set(this.dataForm.transfees[row], 'addrNameList', addrNameList)
      }
      if (type === 1) {
        this.dataForm.transfeeFrees[row].freeCityList = cityList
        let addrNameList = this.setAddrInfoByAreaList(cityList)
        this.$set(this.dataForm.transfeeFrees[row], 'freeAddrNameList', addrNameList)
      }
      this.handleBinAreas()
    },
    /**
     * 获取省市区信息
     */
    getAreaListInfo (transportId) {
      this.$http({
        url: this.$http.adornUrl('/admin/area/areaListInfo'),
        method: 'get'
      }).then(({ data }) => {
        this.areaListDB = data
        this.areaListDB = this.removeNotThirdCategoryItem(this.areaListDB)
        this.areaList = JSON.parse(JSON.stringify(data))
        if (this.dataForm.transfees.length > 0) {
          this.getAreaListByType(0)
        }
        if (this.dataForm.transfeeFrees.length > 0) {
          this.getAreaListByType(1)
        }
      })
    },
    getAreaListByType (type) {
      if (type === 0) {
        for (var t = 0; t < this.dataForm.transfees.length; t++) {
          let addrNameList = this.setAddrInfoByAreaList(this.dataForm.transfees[t].cityList)
          this.$set(this.dataForm.transfees[t], 'addrNameList', addrNameList)
        }
      }
      if (type === 1) {
        for (var f = 0; f < this.dataForm.transfeeFrees.length; f++) {
          let addrNameList = this.setAddrInfoByAreaList(this.dataForm.transfeeFrees[f].freeCityList)
          this.$set(this.dataForm.transfeeFrees[f], 'freeAddrNameList', addrNameList)
        }
      }
    },
    /**
     * 去除没有三级分类的类目
     */
    removeNotThirdCategoryItem (treeData) {
      const firstCategory = treeData
      let length = firstCategory.length
      for (let i = 0, index = 0; i < length; i++) {
        if (firstCategory[index].level !== 3) {
          if (firstCategory[index].areas && firstCategory[index].areas.length > 0 && (firstCategory[index].areas.some(item => item.areas) || firstCategory[index].level !== 0)) {
            const secondCategory = firstCategory[index].areas
            firstCategory[index].areas = this.removeNotThirdCategoryItem(secondCategory)
          } else {
            firstCategory.splice(index, 1)
            // 当前位置的元素已经被删除，当前位置索引不用++
            continue
          }
        }
        index++
      }
      return firstCategory
    },
    numInput (e) {
      // console.log(e)
    },
    /**
     * 校验数字
     */
    checkNumber (row, type) {
      if (type === 1) {
        // 首件数量
        row.firstPiece = this.getNumber(row.firstPiece)
        row.firstPiece = row.firstPiece === 0 ? 1 : row.firstPiece
      } else if (type === 3) {
        // 续件数量
        row.continuousPiece = this.getNumber(row.continuousPiece)
        row.continuousPiece = row.continuousPiece === 0 ? 1 : row.continuousPiece
      } else if (type === 5) {
        // 满xx元包邮
        row.amount = this.checkAmount(row.amount)
      } else if (type === 6) {
        // 满xx件/重量/体积包邮
        row.piece = this.getNumber(row.piece)
        row.piece = row.piece === 0 ? 1 : row.piece
      }
    },
    getNumber (num) {
      num = Math.round(num)
      return num < 0 ? 0 : num
    },
    checkAmount (data) {
      let reg = /^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/
      let num = data
      if (!reg.test(data)) {
        num = Math.round(data * 100) / 100
      }
      if (num < 0) {
        num = 1
      }
      return num
    },
    /**
     * 将运费模板中的地址存入地址列表中
     */
    setAddrInfoByAreaList (cityList) {
      var areaList = []
      areaList = JSON.parse(JSON.stringify(this.areaListDB))
      const addrNameList = areaNameList(areaList, cityList)
      return addrNameList
    },
    // 添加运费项
    addTransfee () {
      this.editVisible = true
      this.dataForm.transfees.push({ cityList: [], status: 1 })
    },
    // 删除运费项
    deleteHandle (rowIndex) {
      this.dataForm.transfees.splice(rowIndex, 1)
      this.handleBinAreas()
    },
    // 可配送区域和运费编辑
    addOrUpdateHandle (rowIndex) {
      this.addOrUpdateVisible = true
      let allSelectCityList = []
      for (let i = 1; i < this.dataForm.transfees.length; i++) {
        if (rowIndex !== i) {
          const cityList = this.dataForm.transfees[i].cityList
          allSelectCityList = allSelectCityList.concat(cityList)
        }
      }
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(rowIndex, this.dataForm.transfees[rowIndex].cityList || [], allSelectCityList, 0, this.transfeesBin)
      })
    },
    // 添加指定包邮条件
    addTransfeeFree () {
      if (!this.dataForm.hasFreeCondition) {
        return
      }
      this.dataForm.transfeeFrees.push({ freeCityList: [] })
    },
    // 删除指定包邮条件
    deleteTransfeeFree (rowIndex) {
      this.dataForm.transfeeFrees.splice(rowIndex, 1)
      this.handleBinAreas()
    },
    // 指定包邮条件编辑
    addOrUpdateTransfeeFree (rowIndex) {
      this.addOrUpdateVisible = true
      let allSelectCityList = []
      for (let i = 1; i < this.dataForm.transfeeFrees.length; i++) {
        const freeCityList = this.dataForm.transfeeFrees[i].freeCityList
        allSelectCityList = allSelectCityList.concat(freeCityList)
      }
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(rowIndex, this.dataForm.transfeeFrees[rowIndex].freeCityList || [], allSelectCityList, 1, this.transfeeFreesBin)
      })
    },
    // 改变模板类型， 0 买家承担运费 1 卖家包邮
    changeFreeFee (val) {
      this.dataForm.hasFreeCondition = false
      if (val) {
        // 保存买家承担运费时的数据
        this.transFeesSave = [...this.dataForm.transfees]
        this.dataForm.chargeType = 0
        this.dataForm.transfees = [{ cityList: [], status: 0, firstPiece: 1, firstFee: 0, continuousPiece: 1, continuousFee: 0 }]
      } else {
        this.dataForm.transfees = [...this.transFeesSave]
      }
    },
    // 设置不可选中
    handleBinAreas () {
      this.transfeesBin = []
      this.transfeeFreesBin = []
      var transfees = this.dataForm.transfees
      var transfeeFrees = this.dataForm.transfeeFrees
      if (transfees.length > 0) {
        transfees.forEach(i => {
          if (i.cityList.length > 0) {
            i.cityList.forEach(j => {
              if (!this.judgeArrHaving(this.transfeesBin, j)) {
                this.transfeesBin.push(j.areaId)
              }
            })
          }
        })
      }
      if (transfeeFrees.length > 0) {
        transfeeFrees.forEach(i => {
          if (i.freeCityList.length > 0) {
            i.freeCityList.forEach(j => {
              if (!this.judgeArrHaving(this.transfeeFreesBin, j)) {
                this.transfeeFreesBin.push(j.areaId)
              }
            })
          }
        })
      }
    },
    judgeArrHaving (arr, data) {
      var isExist = false
      if (arr.length < 1) {
        return isExist
      }
      if (arr.includes(data.areaId)) {
        isExist = true
      }
      // arr.forEach(item => {
      //   if (item === data.areaId) {
      //     isExist = true
      //   }
      // })
      return isExist
    },
    emptyCityHint () {
      this.$message({
        message: this.$i18n.t('shop.pleaseSelectADeliveryArea'),
        type: 'error',
        duration: 1500
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.dataForm.transName.trim()) {
            return this.$message.error(this.$t('shop.templateNameCannotBeEmpty'))
          }

          const transFeesLen = this.dataForm.transfees.length || 0
          if (!transFeesLen) {
            this.emptyCityHint()
            return
          }
          for (let i = 0; i < transFeesLen; i++) {
            const transfee = this.dataForm.transfees[i]
            if (transfee.cityList.length === 0 && this.dataForm.isFreeFee === 0) {
              this.emptyCityHint()
              return
            }
          }
          if (this.dataForm.hasFreeCondition && (!this.dataForm.transfeeFrees || this.dataForm.transfeeFrees.length === 0)) {
            this.$message({
              message: this.$i18n.t('shop.setRegionalConditions'),
              type: 'error',
              duration: 1500
            })
            return
          }
          if (this.dataForm.hasFreeCondition) {
            this.hasFreeCondition = 1
          } else {
            this.hasFreeCondition = 0
          }
          // console.log(this.dataForm.transfeeFrees.length, 'this.dataForm.transfeeFrees.lengththis.dataForm.transfeeFrees.length')
          // 指定区域条件判断
          if (this.hasFreeCondition === 1 && this.dataForm.transfeeFrees.length) {
            let flag = null
            this.dataForm.transfeeFrees.some((item) => {
              if (!item.freeCityList[0]) {
                this.$message({
                  message: this.$i18n.t('shop.setRegionalConditions'),
                  type: 'error',
                  duration: 1500
                })
                flag = true
                return true
              }
              // console.log(item.hasOwnProperty('freeType'), 'item.hasOwnProperty("freeType")')
              if (!item.hasOwnProperty('freeType')) {
                this.$message({
                  message: this.$i18n.t('shop.pleaseAddTheSpecifiedShippingConditions'),
                  type: 'error',
                  duration: 1500
                })
                flag = true
                return true
              }
            })
            if (flag) { return }
          }
          // this.dataForm.transfees[0].cityList = []
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl(`/platform/transport`),
            method: this.dataForm.transportId ? 'put' : 'post',
            data: this.$http.adornData({
              'transportId': this.dataForm.transportId || undefined,
              'transName': this.dataForm.transName,
              'chargeType': this.dataForm.chargeType,
              'isFreeFee': this.dataForm.isFreeFee,
              'transfees': this.dataForm.transfees,
              'transfeeFrees': this.dataForm.transfeeFrees,
              'hasFreeCondition': this.hasFreeCondition
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList', this.page)
                this.close()
              }
            })
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    },
    close () {
      this.$emit('close', 'close')
    }
  }
}
</script>

<style lang="scss" scoped>
.transport-pop {
 ::v-deep .el-form-item__error--inline{
    margin-left: 0;
  }
  .text-btn-con {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    .text-btn {
      margin-right: 0;
    }
  }
  .city-text {
    display: inline-block;
    padding: 0 5px;
  }
  .controls-right {
    & ::v-deep .el-input__inner {
      padding-right: 32px !important;
    }
  }
  .num-input-con {
    & ::v-deep .el-input__inner {
      padding-right: 0 !important;
    }
  }
  & ::v-deep .el-table.el-table--fit.el-table--enable-row-transition .el-form-item {
    padding-top: 20px;
  }
  & ::v-deep .el-input-number--small .el-input-number__increase {
    border-left: 1px solid #dcdfe6 !important;
    right: 1px !important;
  }
  .area-transfee-table {
    .el-input.el-input--small {
      width: 150px;
    }
    .el-input-number.el-input-number--small {
      width: 172px;
    }
  }
}

</style>
