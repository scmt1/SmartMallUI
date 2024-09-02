<template>
  <!-- 基本信息 -->
  <div class="basicInfo-container">
    <el-form label-width="auto" :model="dataForm" :rules="rules" ref="dataForm">
      <span class="title">{{this.$i18n.t('product.basicInformation')}}</span>
      <el-divider></el-divider>
      <!-- 基本信息 -->
      <el-form-item :label="type === 1 ? this.$i18n.t('stock.deliveryDate') : this.$i18n.t('stock.warehousingDate')" prop="businessTime">
        <el-date-picker
          v-model="dataForm.businessTime"
          type="date"
          :placeholder="this.$i18n.t('admin.seleData')"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="businessTimeOptions"
          class="el-date-picker"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="type === 1 ? this.$i18n.t('stock.deliveryReason') : this.$i18n.t('stock.warehousingReason')" ref="stockChangeReasonId" prop="stockChangeReasonId">
        <el-select @change="selectReason" v-model="dataForm.stockChangeReasonId" :placeholder="this.$i18n.t('tip.select')">
          <el-option
            v-for="node in reasonList"
            :key="node.stockChangeReasonId"
            :label="node.reason"
            :value="node.stockChangeReasonId"
          ></el-option>
        </el-select>
        <!--新建/刷新-->
        <div class="create-refresh-btn">
          <div class="default-btn text-btn"
               @click="getReasonList">{{$t('admin.refresh')}}</div>
          <el-divider direction="vertical"></el-divider>
          <div class="default-btn text-btn"
               @click.stop="createReason()">{{$t('admin.newConstruction')}}</div>
        </div>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('publics.remark')" prop="remark">
        <el-input class="remark" v-model="dataForm.remark" maxlength="50" type="textarea" show-word-limit :row="5"></el-input>
      </el-form-item>
      <!-- 附件 -->
      <span class="title">{{ this.$i18n.t('stock.appendix') }}</span>
      <el-divider></el-divider>
      <el-form-item :label="type === 1 ? this.$i18n.t('stock.deliveryCertificate') : this.$i18n.t('stock.warehousingCertificate')">
        <div class="business-qual">
          <imgs-upload v-model="dataForm.qualifications" :limit="4" :prompt="false" />
        </div>
        <div class="upload-tips">{{ type === 1 ? this.$i18n.t('stock.businessOutQualTips') : this.$i18n.t('stock.businessInQualTips') }}</div>
      </el-form-item>
    </el-form>
    <reason-add-or-update v-if="reasonAddOrUpdateVisible"
                   ref="reasonAddOrUpdate"
                   @refreshDataList="getReasonList"></reason-add-or-update>
  </div>
</template>

<script>
import imgsUpload from '@/components/imgs-upload'
import reasonAddOrUpdate from './customizereason-add-or-update'

export default {
  components: {
    imgsUpload,
    reasonAddOrUpdate
  },
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataForm: {
        stockBillLogId: null,
        businessTime: '', // 出入库时间
        stockChangeReasonId: '', // 出入库原因id
        remark: '', // 出入库备注信息
        qualifications: '', // 出入库凭证
        status: ''
      },
      reasonAddOrUpdateVisible: false,
      reasonList: [], // 出入库原因
      // 出入库日期选择限制
      businessTimeOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      rules: {
        businessTime: [
          { required: true, message: this.type === 1 ? this.$i18n.t('stock.deliveryDateNotEmpty') : this.$i18n.t('stock.warehousingDateNotEmpty'), trigger: 'blur' }
        ],
        stockChangeReasonId: [
          { required: true, message: this.type === 1 ? this.$i18n.t('stock.deliveryReasonNotEmpty') : this.$i18n.t('stock.warehousingReasonNotEmpty'), trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    type: {
      default: 0,
      type: Number // 1 出库 2 入库
    },
    stockBillLogId: {
      default: 0,
      type: Number
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.stockBillLogId) {
        this.getStockBillInfo()
      } else {
        // 初始化出入库原因
        this.getReasonList()
      }
    },
    getStockBillInfo () {
      this.$http({
        url: this.$http.adornUrl('/shop/stockBillLog/info/' + this.stockBillLogId),
        method: 'get',
        params: this.$http.adornParams(
          {
            stockBillLogId: this.stockBillLogId
          }
        )
      }).then(({data}) => {
        this.dataForm = data
        this.getReasonList()
      })
    },
    selectReason (val) {
      console.log(val)
      this.$refs['stockChangeReasonId'].clearValidate()
    },
    createReason () {
      this.reasonAddOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.reasonAddOrUpdate.init(null, this.type)
      })
    },
    /**
     * 获取出入库原因
     */
    getReasonList () {
      this.$http({
        url: this.$http.adornUrl('/shop/stockChangeReason/list'),
        method: 'get',
        params: this.$http.adornParams(
          {
            status: 1,
            type: this.type
          }
        )
      }).then(({data}) => {
        if (data && this.stockBillLogId && this.dataForm) {
          let isExist = false
          for (let i = 0; i < data.length; i++) {
            if (data[i].stockChangeReasonId === this.dataForm.stockChangeReasonId) {
              isExist = true
            }
          }
          if (!isExist) {
            this.dataForm.stockChangeReasonId = null
          }
        }
        this.reasonList = data
      })
    },
    /**
     * 校验表单数据，校验成功返回表单数据，校验失败返回null (父组件调用）
     */
    verifyDataForm () {
      let flag = false
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          flag = true
        }
      })
      if (flag) {
        this.dataForm.type = this.type
        return this.dataForm
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="scss">

.basicInfo-container {
  .title {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
  }
  .el-date-picker {
    width: 200px;
  }
  .el-select {
    width: 200px;
  }
  .remark {
    width: 30%;
  }
  .upload-tips {
    font-size: 12px;
    color: #999;
    height: 16px;
    line-height: 20px;
    margin-top: 13px;
  }
}
// 刷新 | 新建
.create-refresh-btn {
  display: inline-block;
  margin-left: 10px;
  & ::v-deep .el-divider--vertical {
    margin: 0 2px;
  }
}
</style>
