<template>
  <el-dialog
    :title="
      !dataForm.transportId
        ? this.$i18n.t('crud.addTitle')
        : this.$i18n.t('groups.edit')
    "
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="close"
    width="72%"
    class="transport-pop"
  >
    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="$i18n.t('language') === 'English'?'190px':'130px'"
    >
      <el-form-item
        :label="this.$i18n.t('transport.name')"
        prop="transName"
        :rules="[
          { required: true, message: $t('shop.templateNameCannotBeEmpty') },
          validateName
        ]"
      >
        <el-input
          v-model="dataForm.transName"
          maxlength="36"
          size="small"
          show-word-limit
          :placeholder="this.$i18n.t('transport.name')"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item
        :label="this.$i18n.t('transport.type')"
        prop="isFreeFee"
        required="required"
      >
        <template>
          <el-radio-group v-model="dataForm.isFreeFee" @change="changeFreeFee">
            <el-radio :label="0">{{ $t("transport.buyerPrice") }}</el-radio>
            <el-radio :label="1">{{ $t("transport.shopPrice") }}</el-radio>
          </el-radio-group>
        </template>
      </el-form-item> -->
      <el-form-item
        :label="this.$i18n.t('transport.chargePrice')"
        prop="chargeType"
      >
        <template>
          <el-radio-group
            v-model="dataForm.chargeType"
            :disabled="dataForm.isFreeFee == 1"
          >
            <el-radio :label="0">{{ $t("transport.byCount") }}</el-radio>
            <el-radio :label="1">{{ $t("transport.byWeight") }}</el-radio>
            <el-radio :label="2">{{ $t("transport.byVolume") }}</el-radio>
          </el-radio-group>
        </template>
      </el-form-item>

      <!-- 添加可配送的区域和邮费 START -->
      <div class="area-transfee-table">
        <el-table
          class="transfee-table"
          :data="dataForm.transfees"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%">
          <!-- 区县级地址全部显示 -->
          <!-- <el-table-column header-align="center" align="center" width="450" label="可配送区域">
            <template slot-scope="scope">
              <span v-if="scope.$index == 0">所有地区</span>
              <span
                v-if="(!scope.row.cityList || !scope.row.cityList.length) && scope.$index > 0"
              >请选择可配送区域</span>
              <span v-if="scope.$index > 0">
                <el-tag v-for="city in scope.row.cityList" :key="city.areaId">{{city.areaName}}</el-tag>
              </span>
              <el-button
                type="text"
                size="small"
                @click="addOrUpdateHandle(`${scope.$index}`)"
                v-if="scope.$index > 0"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteHandle(`${scope.$index}`)"
                v-if="scope.$index > 0"
              >{{$t("text.delBtn")}}</el-button>
            </template>
          </el-table-column>-->

          <!-- 显示动态显示省市区 -->
          <el-table-column
            align="center"
            fixed
            :label="this.$i18n.t('transport.distributableArea')"
            width="420"
          >
            <template slot-scope="scope">
              <span v-if="scope.$index == 0 && dataForm.isFreeFee==1">{{
                $t("transport.allRegions")
              }}</span>
              <template v-if="dataForm.isFreeFee==0">
                <span
                  v-if="
                    (!scope.row.addrNameList || !scope.row.addrNameList.length) 
                  "
                  >{{ $t("shop.pleaseSelectADeliveryArea") }}</span
                >
                <span>
                  <!-- {{scope.row.addrNameList.toString()}} -->
                  <span
                    v-for="(city, index) in scope.row.addrNameList"
                    :key="index"
                    class="city-text"
                  >
                    {{ city }}
                  </span>
                </span>
                <span
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(`${scope.$index}`)"
                >
                  {{ $t('crud.editBtn') }}
                </span>
                <span
                  class="default-btn text-btn"
                  @click="deleteHandle(`${scope.$index}`)"
                >
                  {{ $t('crud.delBtn') }}
                </span>
              </template>
            </template>
          </el-table-column>
          <!-- 首件（个） -->
          <el-table-column
            align="center"
            :label="tableTitle[0]"
            width="220"
            :class="[lang === 'en'? 'errorTipsEn':'errorTips']"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="`transfees.${scope.$index}.firstPiece`"
                label-width="0px"
                :class="[lang === 'en'? 'errorTipsEn':'errorTips']"
                :rules="[
                  {
                    required: true,
                    message: `${tableTitle[0]}${$t('publics.noNull')}`,
                  },
                ]"
              >
                <el-input-number
                  v-if="dataForm.chargeType === 1 || dataForm.chargeType === 2"
                  size="small"
                  v-model="scope.row.firstPiece"
                  :disabled="!scope.row.status && scope.$index === 0"
                  :precision="2"
                  :min="0.01"
                  :max="9999999999"
                  controls-position="right"
                  class="controls-right"
                ></el-input-number>
                <el-input-number
                  v-else
                  size="small"
                  :min="0.01"
                  :max="9999999999"
                  v-model="scope.row.firstPiece"
                  :disabled="!scope.row.status && scope.$index === 0"
                  controls-position="right"
                  class="controls-right"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 运费（元） -->
          <el-table-column
            align="center"
            :label="tableTitle[1]"
            width="240"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="`transfees.${scope.$index}.firstFee`"
                label-width="0px"
                :class="[lang === 'en'? 'errorTipsEn':'errorTips']"
                :rules="[
                  {
                    required: true,
                    message: `${tableTitle[1]}${$t('publics.noNull')}`,
                  },
                ]"
              >
                <el-input-number
                  v-model="scope.row.firstFee"
                  size="small"
                  @change="checkNumber(scope.row, 2)"
                  :disabled="!scope.row.status && scope.$index === 0"
                  :precision="2"
                  :min="0"
                  :max="100000000"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 续件（个） -->
          <el-table-column
            align="center"
            :label="tableTitle[2]"
            width="220"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="`transfees.${scope.$index}.continuousPiece`"
                label-width="0px"
                :class="[lang === 'en'? 'errorTipsEn':'errorTips']"
                :rules="[
                  {
                    required: true,
                    message: `${tableTitle[2]}${$t('publics.noNull')}`,
                  },
                ]"
              >
                <el-input-number
                  v-if="dataForm.chargeType === 1 || dataForm.chargeType === 2"
                  size="small"
                  type="number"
                  v-model="scope.row.continuousPiece"
                  :disabled="!scope.row.status && scope.$index === 0"
                  :precision="2"
                  :min="0.01"
                  :max="9999999999"
                  controls-position="right"
                  class="controls-right"
                ></el-input-number>
                <el-input-number
                  v-else
                  size="small"
                  :min="0.01"
                  :max="9999999999"
                  v-model="scope.row.continuousPiece"
                  :disabled="!scope.row.status && scope.$index === 0"
                  controls-position="right"
                  class="controls-right"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 续费（元） -->
          <el-table-column
            align="center"
            :label="tableTitle[3]"
            width="220"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="`transfees.${scope.$index}.continuousFee`"
                label-width="0px"
                :class="[lang === 'en'? 'errorTipsEn':'errorTips']"
                :rules="[
                  {
                    required: true,
                    message: `${tableTitle[3]}${$t('publics.noNull')}`,
                  },
                ]"
              >
                <el-input-number
                  size="small"
                  v-model="scope.row.continuousFee"
                  :precision="2"
                  :min="0"
                  :max="100000000"
                  @change="checkNumber(scope.row, 4)"
                  :disabled="!scope.row.status && scope.$index === 0"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 20px" v-if="dataForm.isFreeFee == 0">
        <div class="default-btn primary-btn" @click="addTransfee()">
          {{$t("shop.addAreaAndShipping")}}
        </div>
      </div>
      <!-- 添加可配送的区域和邮费 END -->

      <!-- 指定条件包邮 START -->
      <el-checkbox
        v-model="dataForm.hasFreeCondition"
        v-if="!dataForm.isFreeFee"
        style="margin-top: 10px; font-size: 50px"
        >{{ $t("shop.freeShippingOnSpecifiedConditions") }}</el-checkbox
      >
      <el-table
        v-if="dataForm.hasFreeCondition && !dataForm.isFreeFee"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        :data="dataForm.transfeeFrees"
        style="width: 100%"
      >
        <!-- 区县级地址全部显示 -->
        <!-- <el-table-column header-align="center" align="center" width="350" label="指定区域">
          <template slot-scope="scope">
            <span v-if="!scope.row.freeCityList || !scope.row.freeCityList.length">请选择指定包邮城市</span>
            <el-tag v-for="city in scope.row.freeCityList" :key="city.areaId">{{city.areaName}}</el-tag>
            <el-button
              type="text"
              size="small"
              @click="addOrUpdateTransfeeFree(`${scope.$index}`)"
            >编辑</el-button>
            <el-button type="text" size="small" @click="deleteTransfeeFree(`${scope.$index}`)">{{$t("text.delBtn")}}</el-button>
          </template>
        </el-table-column>-->

        <!-- 显示动态显示省市区 -->
        <el-table-column
          align="left"
          fixed
          :label="this.$i18n.t('transport.selArea')"
        >
          <template slot-scope="scope">
            <span
              v-if="
                !scope.row.freeAddrNameList ||
                !scope.row.freeAddrNameList.length
              "
              >{{ $t("transport.selCity") }}</span
            >
            <span
              v-for="(city, index) in scope.row.freeAddrNameList"
              :key="index"
              class="city-text"
            >
              {{ city }}
            </span>
            <span
              class="default-btn text-btn"
              @click="addOrUpdateTransfeeFree(`${scope.$index}`)"
            >
              {{ $t('crud.editBtn') }}
            </span>
            <span
              class="default-btn text-btn"
              @click="deleteTransfeeFree(`${scope.$index}`)"
            >
              {{ $t('crud.delBtn') }}
            </span>
          </template>
        </el-table-column>
        <!-- 设置包邮条件 -->
        <el-table-column
          align="left"
          style="min-width: 500px"
          :label="this.$i18n.t('transport.setShopPrice')"
        >
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.freeType">
              <el-radio :label="0"
                >{{[$t("transport.byCount"),$t("transport.byWeight"),$t("transport.byVolume")][dataForm.chargeType]}}</el-radio
              >
              <el-radio :label="1">{{
                $t("product.freeShiullAmount")
              }}</el-radio>
              <el-radio
                :label="2"
              >{{[$t("transport.fullCount"),$t("transport.fullWeight"),$t("transport.fullVolume")][dataForm.chargeType]}}{{$t("transport.fullAmount1")}}{{$t("transport.shippingIncluded")}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <!-- 设置条件 -->
        <el-table-column
          fixed="right"
          width="270"
          align="right">
          <template slot-scope="scope">
            <el-form-item
              :prop="`transfeeFrees.${scope.$index}.amount`"
              v-if="scope.row.freeType == 1 || scope.row.freeType == 2"
              label-width="0px"
              :rules="[{ required: true, message: `${$t('publics.noNull')}` }]"
            >
              <el-input
                size="small"
                type="number"
                width="200"
                @change="checkNumber(scope.row, 5)"
                v-model="scope.row.amount"
                :precision="2"
                :min="0"
              >
                <template slot="prepend">{{ $t("marketing.full") }}</template>
                <template slot="append"
                  >{{ $t("admin.dollar")
                  }}{{ $t("product.freeShipping") }}</template
                >
              </el-input>
            </el-form-item>
            <el-form-item
              :prop="`transfeeFrees.${scope.$index}.piece`"
              v-if="scope.row.freeType == 0"
              label-width="0px"
              :rules="[{ required: true, message: `${$t('publics.noNull')}` }]"
            >
              <el-input
                v-if="dataForm.chargeType === 1 || dataForm.chargeType === 2"
                size="small"
                type="number"
                width="200"
                @change="checkNumber(scope.row, 6)"
                v-model="scope.row.piece"
              >
                <template slot="prepend">{{ $t("marketing.full") }}</template>
                <template slot="append">{{[$t("transport.pieces"),'kg','m³'][dataForm.chargeType]}}{{ $t("product.freeShipping") }}</template>
              </el-input>
              <el-input
                v-else
                size="small"
                type="number"
                width="200"
                @change="checkNumber(scope.row, 6)"
                v-model="scope.row.piece"
              >
                <template slot="prepend">{{ $t("marketing.full") }}</template>
                <template slot="append">{{[$t("transport.pieces"),'kg','m³'][dataForm.chargeType]}}{{ $t("product.freeShipping") }}</template>
              </el-input>
            </el-form-item>
            <el-form-item
              :prop="`transfeeFrees.${scope.$index}.piece`"
              v-if="scope.row.freeType == 2"
              label-width="0px"
              :rules="[{ required: true, message: `${$t('publics.noNull')}` }]"
            >
              <el-input
                v-if="dataForm.chargeType === 1 || dataForm.chargeType === 2"
                size="small"
                type="number"
                width="200"
                @change="checkNumber(scope.row, 6)"
                v-model="scope.row.piece"
              >
                <template slot="prepend">{{ $t("marketing.full") }}</template>
                <template slot="append">{{[$t("transport.pieces"),'kg','m³'][dataForm.chargeType]}}{{ $t("product.freeShipping") }}</template>
              </el-input>
              <el-input
                v-else
                size="small"
                type="number"
                width="200"
                @change="checkNumber(scope.row, 6)"
                v-model="scope.row.piece"
              >
                <template slot="prepend">{{ $t("marketing.full") }}</template>
                <template slot="append">{{[$t("transport.pieces"),'kg','m³'][dataForm.chargeType]}}{{ $t("product.freeShipping") }}</template>
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>

      </el-table>

      <div style="margin-top: 20px" v-if="dataForm.isFreeFee == 0">
        <div
          :class="['default-btn primary-btn icon-btn', !dataForm.hasFreeCondition ? 'disabled-btn': '']"
          @click="addTransfeeFree()"
        >
        {{$t("shop.clickToAddTheSpecifiedShippingConditions")}}</div>
      </div>
      <!-- 指定条件包邮 END -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="close">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
  </el-dialog>
</template>

<script>
import { areaNameList } from '@/utils/addr'
import AddOrUpdate from './transcity-add-or-update'
import { Debounce } from '@/utils/debounce'
export default {
  data () {
    var validateName = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('shop.templateNameCannotBeEmpty')))
      } else if (value.trim() === '包邮' || value.trim() === '固定运费') {
        callback(new Error('模板名称不能为"包邮"或"固定运费"'))
      } else {
        callback()
      }
    }
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
        transfees: [{ cityList: [], addrNameList: [], status: 1 }],
        transfeeFrees: [{ freeCityList: [], freeAddrNameList: [] }]
      },
      transFeesSave: [{ cityList: [], addrNameList: [], status: 1 }], // 暂存区域，防止类型切换时原先选择的数据丢失
      areaList: [],
      validateName: { validator: validateName, trigger: 'blur' },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      editVisible: false,
      transfeesBin: [], // 可配送区域运费，禁止选中列表
      transfeeFreesBin: [], // 指定条件包邮，禁止选中列表

      // 提交中
      isSubmitting: false,
      lang: window.localStorage.getItem('lang')
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
          transfees: [{ cityList: [], addrNameList: [], status: 1 }],
          transfeeFrees: [{ freeCityList: [], freeAddrNameList: [] }]
        }
      })
      // 重置买家承担运费时的数据
      this.transFeesSave = [{ cityList: [], addrNameList: [], status: 1 }]
      this.transfeesBin = []
      this.transfeeFreesBin = []
      this.getTransport()
    },
    /**
     * 校验输入的数字
     */
    checkNumber (row, type) {
      if (type === 1) {
        row.firstPiece = this.getNumber(row.firstPiece)
        row.firstPiece = row.firstPiece === 0 ? 1 : row.firstPiece
      } else if (type === 3) {
        row.continuousPiece = this.getNumber(row.continuousPiece)
        row.continuousPiece = row.continuousPiece === 0 ? 1 : row.continuousPiece
      } else if (type === 5) {
        row.amount = this.checkAmount(row.amount)
      } else if (type === 6) {
        if (this.dataForm.chargeType === 1 || this.dataForm.chargeType === 2) {
          row.piece = Number(row.piece) === 0 ? 0.01 : this.checkAmount(row.piece)
        } else {
          row.piece = Number(row.piece) === 0 ? 1 : row.piece
          row.piece = this.getNumber(row.piece)
        }
      }
    },
    /**
     * 保留整数并小于零的数设为0
     */
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
    // 四舍五入保留2位小数
    constrainNum (num) {
      let result = parseFloat(num)
      result = Math.round(num * 100) / 100
      let temp = result.toString()
      const i = temp.indexOf('.')
      if (i !== -1 && temp.length <= i + 2) {
        temp += '0'
      }
      return temp
    },
    getTransport () {
      if (this.dataForm.transportId) {
        this.$http({
          // 获取运费模板数据
          url: this.$http.adornUrl(`/shop/transport/info/${this.dataForm.transportId}`),
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
    getAreaListInfo () {
      this.$http({
        url: this.$http.adornUrl('/admin/area/areaListInfo'),
        method: 'get'
      }).then(({ data }) => {
        console.log(data)
        this.areaListDB = data
        this.areaListDB = this.removeNotThirdCategoryItem(this.areaListDB)

        if (this.dataForm.transfees.length > 0) {
          this.getAreaListByType(0)
        }
        if (this.dataForm.transfeeFrees.length > 0) {
          this.getAreaListByType(1)
        }
      })
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
        const cityList = this.dataForm.transfees[i].cityList
        allSelectCityList = allSelectCityList.concat(cityList)
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
    /**
     * 验证指定区域是否设置包邮条件
     */
    checkTransfeeFrees () {
      let isTrue = true
      if (this.dataForm.transfeeFrees.length > 0) {
        this.dataForm.transfeeFrees.forEach(element => {
          if (!element.freeType && element.freeType !== 0) {
            isTrue = false
          }
        })
      }
      return isTrue
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
    dataFormSubmit: Debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
          if (this.dataForm.isFreeFee === 0 && this.dataForm.hasFreeCondition && !this.checkTransfeeFrees()) {
            this.$message.error(this.$i18n.t('shop.setRegionalConditions'))
            return
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
          console.log(this.dataForm.transfeeFrees.length, 'this.dataForm.transfeeFrees.lengththis.dataForm.transfeeFrees.length')
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
              console.log(item.hasOwnProperty('freeType'), 'item.hasOwnProperty("freeType")')
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
          if (this.isSubmitting) {
            return
          }
          this.isSubmitting = true
          // this.dataForm.transfees[0].cityList = []
          this.$http({
            url: this.$http.adornUrl(`/shop/transport`),
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
            this.isSubmitting = false
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
          }).catch(() => {
            this.isSubmitting = false
          })
        }
      })
    }, 1000),
    close () {
      this.$emit('close', 'close')
    }
  }
}
</script>

<style lang="scss" scoped>
.transport-pop {
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
    & >>> .el-input__inner {
      padding-right: 32px !important;
    }
  }
  .num-input-con {
    & >>> .el-input__inner {
      padding-right: 0 !important;
    }
  }
  & >>> .el-table.el-table--fit.el-table--enable-row-transition .el-form-item {
    padding-top: 20px;
  }
  & >>> .el-input-number--small .el-input-number__increase {
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
  ::v-deep .el-form-item{
    margin-bottom: 0 !important;
  }
  ::v-deep .is-error{
    height: 60px;
  }

  ::v-deep .el-table .el-form-item {
    padding-top: 0 !important;
  }

}
</style>
<style scoped>
/* 解决第二次弹窗多出来下划线的问题 */
.transfee-table >>> .el-table__fixed::before, .el-table__fixed-right::before{
  height:0 !important
}
.errorTips >>> .el-form-item__error {
  left: 26%
}
.errorTipsEn >>> .el-form-item__error {
  left: 7%;
  top: 82%
}
  </style>
