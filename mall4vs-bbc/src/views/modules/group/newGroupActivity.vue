<template>
  <div class="mod-groupActivity">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          !dataForm.groupActivityId
          ? this.$i18n.t('groups.newJoinGroupActivity')
          : this.$i18n.t('groups.editGroupActivities')}}
      </div>
    </div>
    <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        label-width="auto"
        size="small"
        class="form-box"
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
        <!-- <el-form-item label="关联商品"
                      prop="activityName">
          <div>
            <el-col :span="5"
                    v-for="(groupProd, index) in dataForm.groupProds"
                    :key="index">
              <el-card :body-style="{ padding: '0px' }"
                       style="height: 160px;width: 120px">
                <img :src="groupProd.pic"
                     style="height:104px;width:100%">
                <div class="card-prod-bottom">
                  <span class="card-prod-name">{{groupProd.prodName}}</span>
                  <el-button type="text"
                             class="card-edit-sku-button"
                             @click="editSkuhandle(groupProd.prodId)">编辑</el-button>
                  <el-button type="text"
                             class="card-prod-name-button"
                             @click="deleteProd(index)">{{$t("text.delBtn")}}</el-button>
                </div>
              </el-card>
            </el-col>
            <el-col>
              <el-button type="primary"
                         plain
                         size="mini"
                         :style="dataForm.groupProds?'':'margin-top:160px;'"
                         @click="selectProdHandle()">{{$t("product.select")}}</el-button>
            </el-col>

          </div>

        </el-form-item>-->
        <el-form-item
        ref="startTime"
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
            class="date-picker groupActivity-input"
            :placeholder="this.$i18n.t('groups.selectEventStartTime')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
        ref="endTime"
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
            class="date-picker groupActivity-input"
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
                ? dataForm.activityStatus !== 1 && dataForm.activityStatus != 5
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
                ? dataForm.activityStatus !== 1 && dataForm.activityStatus != 5
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
        <el-form-item
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
        </el-form-item>
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
        <el-form-item>
          <div class="default-btn" @click="back()" size="mini">{{
            $t("shopFeature.edit.back")
          }}</div>
          <div v-if="dataForm.status !== 0 && dataForm.status !== 5" class="default-btn primary-btn" type="primary" size="mini" @click="dataFormSubmit()">{{
            $t("groups.submit")
          }}</div>
          <div v-if="dataForm.status !== 0 && dataForm.status !== 5" class="default-btn primary-btn" type="primary" size="mini" @click="submitAndManageProds()">{{
            $t("groups.submitAndProducts")
          }}</div>
        </el-form-item>
      </el-form>

      <!-- 商品选择弹窗  测试完之后添加这个链接  dataUrl='/group/prod/getNotGroupProdPage'-->
      <prods-select
        v-if="groupSelectProdVisible"
        ref="ProdsSelect"
        @refreshSelectProds="selectGroupProds"
      ></prods-select>
  </div>
</template>

<script>
import ProdsSelect from '@/components/prods-select'
import { Debounce } from '@/utils/debounce'
export default {
  name: 'newGroupActivity',
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
        callback(new Error(this.$i18n.t('groups.extendedEndTime')))
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
      showEventPreview: false,
      groupSelectProdVisible: false,
      roleList: [],
      selectTime: [],
      // dialogWidth:'895px',
      dataForm: {
        groupActivityId: null,
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
        hasGroupTip: 0,
        groupOrderCount: null,
        groupNumberCount: null,
        createTime: null,
        updateTime: null,
        groupProds: [],
        validEndTime: []
      },
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
  watch: {
    newStartTime (newVal, oldVal) {
      this.$refs.endTime.clearValidate('endTime')
    },
    newEndTime (newVal, oldVal) {
      this.$refs.startTime.clearValidate('startTime')
    }
  },
  computed: {
    newStartTime: function () {
      return JSON.parse(JSON.stringify(this.dataForm.startTime))
    },
    newEndTime: function () {
      return JSON.parse(JSON.stringify(this.dataForm.endTime))
    }
  },

  components: {
    ProdsSelect
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.dataForm.groupActivityId = this.$route.query.groupActivityId || null
      let navTitles = JSON.parse(JSON.stringify(this.$store.state.common.selectMenu))
      let title = !this.$route.query.groupActivityId ? this.$i18n.t('groups.newJoinGroupActivity') : this.$i18n.t('groups.editGroupActivities')
      navTitles.splice(navTitles.length - 1, 1, title)
      this.$store.commit('common/updateSelectMenu', navTitles)
      this.dataForm.activityStatus = null
      this.isSubmit = false
      this.$refs['dataForm'].resetFields()
      if (this.dataForm.groupActivityId) {
        this.$http({
          url: this.$http.adornUrl('/group/activity/info/' + this.dataForm.groupActivityId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (Date.parse(data.startTime) < Date.parse(new Date())) {
            this.showEventPreview = true
          } else {
            this.showEventPreview = false
          }
          this.dataForm = data
          this.validEndTime = data.endTime
        })
      }
    },
    // 表单提交
    dataFormSubmit: Debounce(function () {
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
            this.selectTime = []
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.back()
                this.isSubmit = false
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
        let prodIds = []
        this.dataForm.groupProds = prods
        for (let index = 0; index < prods.length; index++) {
          prodIds.push(prods[index].prodId)
        }
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
          url: this.$http.adornUrl('/group/activity/getProdAndSkuLists?prodIds=' + prodIds),
          method: 'get',
          params: {}
        }).then(({ data }) => {
          this.groupProdAndSkuLists = data
        })
      }
    },
    // 删除活动商品
    deleteProd (index) {
      this.dataForm.groupProds.splice(index, 1)
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
                this.back()
                if (!this.dataForm.groupActivityId) {
                  this.dataForm.groupActivityId = data
                }
                this.isSubmit = false
                this.$router.push({
                  path: '/group-groupProd',
                  query: { activityId: this.dataForm.groupActivityId }
                })
              }
            })
          }).catch(() => {
            this.isSubmit = false
          })
        }
      })
    }),
    back () {
      this.$router.push({
        name: 'group-groupActivity'
      })
    }
  }
}
</script>
<style lang="scss">
.mod-groupActivity {
  .date-picker {
    width: 60%;
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
  .groupActivity-input {
    width: 524px;
  }
  .form-box {
    margin-left: 30px;
  }
}
</style>
