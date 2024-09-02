<template>
  <div class="mod-groupActivity">
    <el-dialog
      :title="$t('groups.viewActivityDetails')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="50%"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        :disabled="true"
        :label-width="this.$i18n.t('language') === 'language' ? '200px' : '140px'"
        size="small"
      >
        <el-form-item :label="$t('seckill.activityName')" prop="activityName">
          <el-input
            :placeholder="$t('groups.enterEventName')"
            :disabled="dataForm.activityStatus > 2"
            v-model="dataForm.activityName"
            class="groupActivity-input"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('groups.activityStartTime')" prop="startTime">
          <el-date-picker
            v-model="dataForm.startTime"
            :disabled="dataForm.activityStatus ? dataForm.activityStatus !== 1 : false"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            class="date-picker"
            :placeholder="$t('groups.selectEventStartTime')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('groups.eventEndTime')" prop="endTime">
          <el-date-picker
            v-model="dataForm.endTime"
            :disabled="dataForm.activityStatus ? dataForm.activityStatus > 2 : false "
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            class="date-picker"
            :placeholder="$t('groups.selectEventEndTime')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('groups.numberOfParticipants')" prop="groupNumber">
          <el-input
            type="number"
            v-model="dataForm.groupNumber"
            :disabled="dataForm.activityStatus ? dataForm.activityStatus !== 1: false"
            class="groupActivity-input"
          >
            <template slot="append">{{$t('groups.people')}}</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('groups.groupValidityPeriod')" prop="groupValidTime">
          <el-input
            type="number"
            :disabled="dataForm.activityStatus ? dataForm.activityStatus !== 1: false"
            v-model="dataForm.groupValidTime"
            class="groupActivity-input"
          >
            <template slot="append">{{$t('groups.minute')}}</template>
          </el-input>

          <el-tooltip class="item" effect="dark" :content="$t('groups.tip4')" placement="right">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="$t('groups.limitPurchase')" prop="hasMaxNum">
          <el-radio-group
            :disabled="dataForm.activityStatus ? dataForm.activityStatus !== 1: false"
            v-model="dataForm.hasMaxNum"
          >
            <el-radio :label="0">{{$t('seckill.close')}}</el-radio>
            <el-radio :label="1">{{$t('groups.turnOn')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dataForm.hasMaxNum" :label="$t('seckill.purchaseLimit')" prop="maxNum">
          <el-input
            v-model="dataForm.maxNum"
            :disabled="dataForm.activityStatus ? dataForm.activityStatus !== 1: false"
            class="groupActivity-input"
          >
            <template slot="append">{{$t('groups.memberPeople')}}</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('groups.simulation')" prop="hasRobot">
          <div>
            <el-radio-group
              :disabled="dataForm.activityStatus ? dataForm.activityStatus > 2: false"
              v-model="dataForm.hasRobot"
            >
              <el-radio :label="0">{{$t('seckill.close')}}</el-radio>
              <el-radio :label="1">{{$t('groups.turnOn')}}</el-radio>
            </el-radio-group>
            <div class="auxiliary-font">
              <span>{{$t('groups.tip5')}}</span>
            </div>
          </div>
        </el-form-item>
        <!-- 团长优惠 已废弃 -->
        <!-- <el-form-item :label="$t('groups.groupLeaderOffer')" prop="hasLeaderPrice">
          <el-radio-group
            :disabled="dataForm.activityStatus ? dataForm.activityStatus !== 1: false"
            v-model="dataForm.hasLeaderPrice"
          >
            <el-radio :label="0">{{$t('seckill.close')}}</el-radio>
            <el-radio :label="1">{{$t('groups.turnOn')}}</el-radio>
          </el-radio-group>
          <div class="auxiliary-font">{{$t('groups.tip6')}}</div>
          <div class="auxiliary-font font-color-red">{{$t('groups.tip7')}}</div>
        </el-form-item> -->
        <el-form-item :label="$t('groups.groupMode')" prop="hasGroupTip">
          <el-radio-group
            :disabled="dataForm.activityStatus ? dataForm.activityStatus > 2: false"
            v-model="dataForm.hasGroupTip"
          >
            <el-radio :label="0">{{$t('seckill.close')}}</el-radio>
            <el-radio :label="1">{{$t('groups.turnOn')}}</el-radio>
          </el-radio-group>
          <div class="auxiliary-font">{{$t('groups.tip8')}}</div>
        </el-form-item>
        <el-form-item :label="$t('groups.activityWarmUp')" prop="isPreheat">
          <el-radio-group
            :disabled="dataForm.activityStatus ? dataForm.activityStatus !== 1: false"
            v-model="dataForm.isPreheat"
          >
            <el-radio :label="0">{{$t('seckill.close')}}</el-radio>
            <el-radio :label="1">{{$t('groups.turnOn')}}</el-radio>
          </el-radio-group>
          <div class="auxiliary-font">{{$t('groups.cannotrOpen')}}</div>
        </el-form-item>
        <!-- 商品选择框 -->
      <el-form-item :label="$t('groups.selectProd')" prop="spuId">
        <!-- 商品 -->
        <div style="margin-bottom:14px">
          <el-card :body-style="{ padding: '0px' }" style="height: 160px;width: 120px">
            <img v-if="dataForm.prodPic" :src="dataForm.prodPic && (dataForm.prodPic).indexOf('http')===-1 && (dataForm.prodPic).indexOf('https')===-1 ? resourcesUrl + dataForm.prodPic : dataForm.prodPic" style="height:104px;width:100%">
            <img v-else class="prod-img" src="~@/assets/img/def.png" style="height:104px;width:100%">
            <div class="card-prod-bottom">
              <span class="card-prod-name">{{ dataForm.prodName }}</span>
            </div>
          </el-card>
        </div>
        <!-- 商品sku列表 -->
        <div v-if="dataForm.groupSkuList && dataForm.groupSkuList.length > 0">
          <el-table
            :data="dataForm.groupSkuList"
            header-cell-class-name="table-header"
            style="width: 100%"
          >
            <el-table-column :label="dataForm.groupSkuList.length > 1?'sku名称':'商品名称'">
              <template slot-scope="scope">
                <span>{{dataForm.groupSkuList.length > 1? scope.row.skuName:dataForm.prodName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="活动价格">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.actPrice"
                  :min="0.01"
                  :max="100000000"
                  :disabled="true"
                  class="groupActivity-input"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false" size="mini">{{$t('coupon.confirm')}}</el-button>
        <!-- <el-button type="primary"
                   size="mini"
        @click="submitAndManageProds()">提交并管理活动商品</el-button>-->
      </span>

      <!-- 商品选择弹窗  测试完之后添加这个链接  dataUrl='/group/prod/getNotGroupProdPage'-->
      <prods-select
        v-if="groupSelectProdVisible"
        ref="ProdsSelect"
        @refreshSelectProds="selectGroupProds"
      ></prods-select>
    </el-dialog>
  </div>
</template>

<script>
import ProdsSelect from '@/components/prods-select'
export default {
  data () {
    var validateTime = (rule, value, callback) => {
      if (rule.field === '"endTime"' && new Date() > Date.parse(value)) {
        callback(new Error(this.$i18n.t('groups.activityTimeTime')))
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
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      visible: false,
      groupSelectProdVisible: false,
      roleList: [],
      selectTime: [],
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
      groupProdAndSkuLists: [],
      dataRule: {
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        groupNumber: [
          { required: true, message: '请输入成团人数', trigger: 'blur' },
          { validator: validateGroupNumber, trigger: 'blur' }
        ],
        groupValidTime: [
          { required: true, message: '请输入成团有效时间', trigger: 'blur' },
          { validator: validateGroupValidTime, trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' },
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
      this.dataForm.groupActivityId = groupActivityId || null
      this.dataForm.activityStatus = null
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.groupActivityId) {
          this.$http({
            url: this.$http.adornUrl('/platform/group/activity/info/' + this.dataForm.groupActivityId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            console.log('liebli列表数据', data)
            this.dataForm = data
            this.validEndTime = data.endTime
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/group/activity'),
            method: this.dataForm.groupActivityId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.selectTime = []
            this.$message({
              message: this.$i18n.t('remindPop.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    },
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
    submitAndManageProds () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/group/activity'),
            method: this.dataForm.groupActivityId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('remindPop.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                if (!this.dataForm.groupActivityId) {
                  this.dataForm.groupActivityId = data
                }
                this.$emit('refreshDataList', 1, this.dataForm.groupActivityId)
              }
            })
          })
        }
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
