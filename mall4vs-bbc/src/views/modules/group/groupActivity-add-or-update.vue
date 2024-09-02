<template>
  <div class="mod-groupActivity">
    <el-dialog
    :modal-append-to-body="false"
      :title="
        !dataForm.groupActivityId
          ? this.$i18n.t('groups.newJoinGroupActivity')
          : this.$i18n.t('groups.editGroupActivities')
      "
      :close-on-click-modal="false"
      :visible.sync="visible"
      :before-close="cancelBtn"
      width="50%"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        label-width="140px"
        size="small"
      >
        <el-form-item
          :label="this.$i18n.t('groups.eventName')"
          prop="activityName"
        >
          <el-input
            :placeholder="this.$i18n.t('groups.enterEventName')"
            maxlength="30"
            show-word-limit
            :disabled="
              dataForm.activityStatus > 2 && dataForm.activityStatus != 5
            "
            v-model="dataForm.activityName"
            class="groupActivity-input"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('group.actStartTime')"
          prop="startTime"
        >
          <el-date-picker
            v-model="dataForm.startTime"
            :disabled="
              dataForm.activityStatus
                ? dataForm.activityStatus !== 1 && dataForm.activityStatus != 5
                : false
            "
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            class="date-picker"
            :placeholder="this.$i18n.t('groups.selectEventStartTime')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('groups.eventEndTime')"
          prop="endTime"
        >
          <el-date-picker
            v-model="dataForm.endTime"
            :disabled="
              dataForm.activityStatus
                ? dataForm.activityStatus > 2 && dataForm.activityStatus != 5
                : false
            "
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            class="date-picker"
            :placeholder="this.$i18n.t('groups.selectEventEndTime')"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="活动开始时间"
                      prop="selectTime">
          <el-date-picker v-model="selectTime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          type="datetimerange"
                          :range-separator="this.$i18n.t('time.tip')"
                          :start-placeholder="this.$i18n.t('time.start')"
                          :onPick="checkTimeHandle()"
                          :end-placeholder="this.$i18n.t('time.end')">
          </el-date-picker>
        </el-form-item>-->

        <el-form-item
          :label="this.$i18n.t('group.groupNum')"
          prop="groupNumber"
        >
          <el-input
            type="number"
            @change="groupNumCheck"
            min="2"
            max="1000000000"
            v-model="dataForm.groupNumber"
            :disabled="
              dataForm.activityStatus
                ? dataForm.activityStatus !== 1 && dataForm.activityStatus != 5
                : false
            "
            class="groupActivity-input"
          >
            <template slot="append">{{ $t("groups.people") }}</template>
          </el-input>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('groups.groupValidityPeriod')"
          prop="groupValidTime"
        >
          <el-input
            type="number"
            :disabled="
              dataForm.activityStatus
                ? dataForm.activityStatus !== 1 && dataForm.activityStatus != 5
                : false
            "
            v-model="dataForm.groupValidTime"
            class="groupActivity-input"
            onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
          >
            <template slot="append">{{ $t("groups.minute") }}</template>
          </el-input>

          <el-tooltip
            class="item"
            effect="dark"
            :content="this.$i18n.t('groups.tip4')"
            placement="right"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('groups.limitPurchase')"
          prop="hasMaxNum"
        >
          <el-radio-group
            :disabled="
              dataForm.activityStatus
                ? dataForm.activityStatus > 2 && dataForm.activityStatus != 5
                : false
            "
            v-model="dataForm.hasMaxNum"
          >
            <el-radio :label="0">{{ $t("station.close") }}</el-radio>
            <el-radio :label="1">{{ $t("groups.turnOn") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dataForm.hasMaxNum"
          :label="this.$i18n.t('product.maxNum')"
          prop="maxNum"
        >
          <el-input
            type="number"
            v-model="dataForm.maxNum"
            @change="maxNumCheck"
            :disabled="
              dataForm.activityStatus
                ? dataForm.activityStatus > 2 && dataForm.activityStatus != 5
                : false
            "
            min="1"
            max="100000000"
            class="groupActivity-input"
          >
            <template slot="append">{{ $t("groups.memberPeople") }}</template>
          </el-input>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('groups.simulation')"
          prop="hasRobot"
        >
          <div>
            <el-radio-group
              :disabled="
                dataForm.activityStatus
                  ? dataForm.activityStatus > 2 && dataForm.activityStatus != 5
                  : false
              "
              v-model="dataForm.hasRobot"
            >
              <el-radio :label="0">{{ $t("station.close") }}</el-radio>
              <el-radio :label="1">{{ $t("groups.turnOn") }}</el-radio>
            </el-radio-group>
            <div class="auxiliary-font">
              <span>{{ $t("groups.tip5") }} </span>
            </div>
          </div>
        </el-form-item>
        <!-- 团长优惠 已废弃 -->
        <!-- <el-form-item
          :label="this.$i18n.t('groups.groupLeaderOffer')"
          prop="hasLeaderPrice"
        >
          <el-radio-group
            :disabled="
              dataForm.activityStatus
                ? dataForm.activityStatus !== 1 && dataForm.activityStatus != 5
                : false
            "
            v-model="dataForm.hasLeaderPrice"
          >
            <el-radio :label="0">{{ $t("station.close") }}</el-radio>
            <el-radio :label="1">{{ $t("groups.turnOn") }}</el-radio>
          </el-radio-group>
          <div class="auxiliary-font">{{ $t("groups.tip6") }}</div>
          <div class="auxiliary-font font-color-red">
            {{ $t("groups.tip7") }}
          </div>
        </el-form-item> -->
        <el-form-item
          :label="this.$i18n.t('groups.groupMode')"
          prop="hasGroupTip"
        >
          <el-radio-group
            :disabled="
              dataForm.activityStatus
                ? dataForm.activityStatus > 2 && dataForm.activityStatus != 5
                : false
            "
            v-model="dataForm.hasGroupTip"
          >
            <el-radio :label="0">{{ $t("station.close") }}</el-radio>
            <el-radio :label="1">{{ $t("groups.turnOn") }}</el-radio>
          </el-radio-group>
          <div class="auxiliary-font">{{ $t("groups.tip8") }}</div>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('groups.activityWarmUp')"
          prop="isPreheat"
        >
          <el-radio-group
            :disabled="(dataForm.activityStatus
                ? dataForm.activityStatus !== 1 && dataForm.activityStatus != 5
                : false) || showEventPreview"
            v-model="dataForm.isPreheat"
          >
            <el-radio :label="0">{{ $t("station.close") }}</el-radio>
            <el-radio :label="1">{{ $t("groups.turnOn") }}</el-radio>
          </el-radio-group>
          <div class="auxiliary-font">{{ $t("groups.tip9") }}</div>
        </el-form-item>
        <!-- 商品选择框 -->
        <el-form-item :label="$t('groups.selectProd')" prop="prodId">
          <el-button
            v-if="!dataForm.prodId"
            class="tips-button"
            @click="selectProdHandle"
            :disabled="dataForm.status == 5 && dataForm.groupActivityId != null"
          >{{ $t('groups.selectProd') }}
            <el-tooltip
              :content="$t('groups.tip10')"
              placement="top"
              class="tips"
              style="position:absolute;marginLeft:3px"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </el-button>
          <!-- 商品 -->
          <div v-if="dataForm.prodId" style="display:flex;marginBottom:20px">
            <el-card v-for="item in spus" :key="item.skuId" :body-style="{ padding: '0px' }" style="height: 160px;width: 120px;margin-right:5px">
              <img v-if="item.pic" :src="item.pic && (item.pic).indexOf('http')===-1 && (item.pic).indexOf('https')===-1 ? resourcesUrl + item.pic : item.pic" style="height:104px;width:100%">
              <img v-else class="prod-img" src="~@/assets/img/def.png" style="height: 104px; width: 100%">
              <div class="card-prod-bottom card-prod-d">
                <span class="card-prod-name">{{ item.skuName }}</span>
                <el-button
                  v-if="!dataForm.groupActivityId"
                  type="text"
                  class="card-prod-name-buttons"
                  @click="deleteCurrentProd()"
                >删除</el-button>
              </div>
            </el-card>
          </div>
        </el-form-item>
        <!-- 商品sku列表 -->
        <div v-if="dataForm.groupSkuList && dataForm.groupSkuList.length > 0">
          <el-table
            :data="dataForm.groupSkuList"
            border
            header-cell-class-name="table-header"
            row-class-name="table-row"
          >
            <el-table-column :label="dataForm.groupSkuList.length>1?'sku名称':'商品名称'">
              <template slot-scope="scope">
                <span>{{ dataForm.groupSkuList.length>1?scope.row.skuName:spus[0].skuName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="活动价格">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.actPrice"
                  :disabled="!(dataForm.groupActivityId == null || dataForm.status == 2) || scope.row.status !== 1"
                  :min="0.01"
                  :step="1"
                  :max="scope.row.price"
                  @change="actPriceChange(scope.$index,$event)"
                  @blur="actPriceBlur"
                  class="groupActivity-input"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="cancelBtn()" size="mini">{{
          $t("crud.filter.cancelBtn")
        }}</div>
        <div v-if="dataForm.status !== 0 && dataForm.status !== 5 || dataForm.groupActivityId == null" class="default-btn primary-btn" type="primary" size="mini" @click="dataFormSubmit()">{{
          $t("groups.submit")
        }}</div>
        <!-- <div v-if="dataForm.status !== 0" class="default-btn primary-btn" type="primary" size="mini" @click="submitAndManageProds()">{{
          $t("groups.submitAndProducts")
        }}</div> -->
      </span>
    </el-dialog>
    <!-- 商品选择弹窗  测试完之后添加这个链接  dataUrl='/group/prod/getNotGroupProdPage'-->
    <prods-select
      v-if="groupSelectProdVisible"
      ref="ProdsSelect"
      :is-single="true"
      :prodType="0"
      @refreshSelectProds="selectGroupProds"/>
  </div>
</template>

<script>
import ProdsSelect from '@/components/prods-select'
import { Debounce } from '@/utils/debounce'
export default {
  data () {
    var validateTime = (rule, value, callback) => {
      if (Date.parse(this.dataForm.startTime) < Date.parse(new Date())) {
        this.showEventPreview = true
      } else {
        this.showEventPreview = false
      }
      // if (!this.dataForm.groupActivityId && rule.field === 'startTime' && new Date() > Date.parse(value)) {
      //   callback(new Error(this.$i18n.t('groups.activityTimeTime')))
      // }
      if (this.dataForm.status !== 5 && rule.field === 'endTime' && new Date() > Date.parse(value)) {
        callback(new Error(this.$i18n.t('groups.endTime')))
      }
      if (Date.parse(this.dataForm.startTime) >= Date.parse(this.dataForm.endTime)) {
        callback(new Error(this.$i18n.t('groups.endTimeIsTooSmall')))
      } else if (this.dataForm.status === 1 && this.dataForm.groupActivityId && Date.parse(this.validEndTime) > Date.parse(this.dataForm.endTime)) {
        if (rule.field === 'endTime') callback(new Error(this.$i18n.t('groups.extendedEndTime')))
      } else {
        callback()
      }
    }
    var validateGroupNumber = (rule, value, callback) => {
      if (this.dataForm.groupNumber < 2) {
        callback(new Error(this.$i18n.t('groups.tip1')))
      } else {
        callback()
      }
    }
    var validateactivityName = (rule, value, callback) => {
      if (!this.dataForm.activityName.trim()) {
        callback(new Error(this.$i18n.t('groups.pleaseEnterEventName')))
      } else {
        callback()
      }
    }
    var validateGroupValidTime = (rule, value, callback) => {
      if (this.dataForm.groupValidTime < 15) {
        callback(new Error(this.$i18n.t('groups.tip2')))
      } else if (this.dataForm.groupValidTime > 24 * 60) {
        callback(new Error(this.$i18n.t('groups.tip3')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      showEventPreview: false,
      groupSelectProdVisible: false,
      roleList: [],
      selectTime: [],
      // dialogWidth:'895px',
      dataForm: {
        groupActivityId: null,
        prodId: null,
        shopId: null,
        activityName: null,
        status: null,
        startTime: null,
        endTime: null,
        groupValidTime: null,
        groupNumber: null,
        hasMaxNum: 0,
        maxNum: null,
        hasRobot: 0,
        hasLeaderPrice: 0,
        isPreheat: 0,
        hasGroupTip: 1,
        groupOrderCount: null,
        groupNumberCount: null,
        createTime: null,
        updateTime: null,
        groupProds: [],
        validEndTime: [],
        groupSkuList: []
      },
      spus: [],
      isSubmit: false,
      groupProdAndSkuLists: [],
      dataRule: {
        activityName: [
          { required: true, message: this.$i18n.t('groups.pleaseEnterEventName'), trigger: 'blur' },
          { validator: validateactivityName, trigger: 'blur' }
        ],
        maxNum: [
          { required: true, message: this.$i18n.t('groups.pleaseEnterEventNum'), trigger: 'blur' }
        ],
        groupNumber: [
          { required: true, message: this.$i18n.t('groups.pleaseEnteNumGrp'), trigger: 'blur' },
          { validator: validateGroupNumber, trigger: 'blur' }
        ],
        groupValidTime: [
          { required: true, message: this.$i18n.t('groups.pleaseEnterTimeGroup'), trigger: 'blur' },
          { validator: validateGroupValidTime, trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: this.$i18n.t('groups.startTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: this.$i18n.t('groups.endTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    ProdsSelect
  },
  methods: {
    init (groupActivityId) {
      this.dataForm.groupSkuList = []
      this.dataForm.groupActivityId = groupActivityId || null
      this.dataForm.activityStatus = null
      this.visible = true
      this.isSubmit = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.groupActivityId) {
          this.$http({
            url: this.$http.adornUrl('/group/activity/info/' + this.dataForm.groupActivityId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.spus = [{
              skuName: data.prodName,
              pic: process.env.VUE_APP_RESOURCES_URL + data.prodPic
            }]
            if (Date.parse(data.startTime) < Date.parse(new Date())) {
              this.showEventPreview = true
            } else {
              this.showEventPreview = false
            }
            this.dataForm = data
            this.validEndTime = data.endTime
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit: Debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return false
          }
          if (!this.dataForm.prodId) {
            return this.$message.error('请选择商品')
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/group/activity'),
            method: this.dataForm.groupActivityId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.selectTime = []
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.isSubmit = false
                this.$emit('refreshDataList')
              }
            })
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    }),
    // 选择商品操作
    selectProdHandle () {
      this.groupSelectProdVisible = true
      this.$nextTick(() => {
        this.$refs.ProdsSelect.init(this.dataForm.groupProds)
      })
    },
    // 选商品回调
    selectGroupProds (prods) {
      if (prods) {
        this.dataForm.prodId = prods.prodId
        let prodIds = []
        this.dataForm.groupProds = prods
        // for (let index = 0; index < prods.length; index++) {
        //   prodIds.push(prods[index].prodId)
        // }
        this.spus = [{
          skuName: prods.prodName,
          pic: prods.pic
        }]
        prodIds.push(prods.prodId)
        this.getProdAndSkuListsByProdIds(prodIds)
        prodIds = []
      }
    },
    groupNumCheck () {
      var maxNum = Math.round(this.dataForm.groupNumber)
      if (!maxNum) {
        maxNum = 2
      } else if (maxNum < 2) {
        maxNum = 2
      } else if (maxNum > 500) {
        maxNum = 500
      }
      this.dataForm.groupNumber = maxNum
    },
    maxNumCheck () {
      var maxNum = Math.round(this.dataForm.maxNum)
      if (!maxNum) {
        maxNum = 1
      } else if (maxNum < 1) {
        maxNum = 1
      } else if (maxNum > 1000000000) {
        maxNum = 1000000000
      }
      this.dataForm.maxNum = maxNum
    },
    // 通过商品id列表，查询所有的对应的sku列表
    getProdAndSkuListsByProdIds (prodIds) {
      if (prodIds) {
        this.$http({
          url: this.$http.adornUrl('/sku/getAllSkuList'),
          method: 'get',
          params: {
            prodId: prodIds
          }
        }).then(({ data }) => {
          // this.groupProdAndSkuLists = data
          this.dataForm.groupSkuList = this.dataForm.groupSkuList || []
          for (let index = 0; index < data.length; index++) {
            let obj = {
              actPrice: data[index].price,
              // groupSkuId: item.,
              pic: data[index].pic,
              price: data[index].price,
              properties: data[index].properties,
              sellNum: data[index].actualStock - data[index].stocks,
              skuId: data[index].skuId,
              skuName: data[index].skuName,
              status: data[index].status
            }
            this.dataForm.groupSkuList.push(obj)
          }
          this.$forceUpdate()
        })
      }
    },
    /**
     * 删除商品
     */
    deleteCurrentProd () {
      this.spus = []
      this.dataForm.groupSkuList = []
      this.dataForm.prodId = null
    },
    // 删除活动商品
    deleteProd (index) {
      this.dataForm.groupProds.splice(index, 1)
    },
    // 关闭对话框
    cancelBtn () {
      this.deleteCurrentProd()
      this.$emit('closeAddOrUpdate')
      this.visible = false
    },
    actPriceBlur (e) {
      this.dataForm.groupSkuList.forEach(item => {
        if (!item.actPrice) item.actPrice = 0.01
      })
    },
    // 保留两位小数
    actPriceChange (index, value) {
      this.dataForm.groupSkuList[index].actPrice = value.toFixed(2)
    },
    // 提交并管理活动商品
    submitAndManageProds: Debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/group/activity'),
            method: this.dataForm.groupActivityId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                if (!this.dataForm.groupActivityId) {
                  this.dataForm.groupActivityId = data
                }
                this.isSubmit = false
                this.$emit('refreshDataList', 1, this.dataForm.groupActivityId)
              }
            })
          }).catch(() => {
            this.isSubmit = false
          })
        }
      })
    })
  }
}
</script>
<style lang="scss">
.mod-groupActivity {
  .date-picker {
    width: 60%;
  }

  .card-prod-bottom {
    position: relative;
    text-align: left;

    .card-prod-name {
      margin: auto;
      padding: 0 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 118px;
      display: inline-block;
    }

    .card-prod-name-button {
      position: absolute;
      top: 24px;
      right: 10px;
    }

    .card-edit-sku-button {
      position: absolute;
      top: 24px;
      left: 10px;
    }
  }

  .groupActivity-input {
    width: 60%;
  }

  .auxiliary-font {
    font-size: 12px;
    color: #cbc0cb;
    line-height: 20px;
  }

  .font-color-red {
    color: crimson;
  }
}
.card-prod-bottom {
  display: flex;
  justify-content: space-around;
}
.card-prod-name {
    margin: auto;
    padding: 0 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 118px;
    display: inline-block;
    line-height: 50px;
}
.card-prod-name-buttons {
  padding-right: 5px;
}
.tips-button {
  padding-right: 26px;
}
</style>
