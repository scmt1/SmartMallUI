<template>
  <div class="distribution-recruit-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('user.growthSetting')}}</div>
    <el-form
      ref="dataForm"
      label-width="180px"
      size="mini"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
    >
      <el-form-item :label="$t('user.growthSwitch')" style="width:440px" prop="shopGrowthSwitch">
        <el-switch v-model="dataForm.shopGrowthSwitch"></el-switch>
      </el-form-item>
      <el-form-item
        :label="$t('user.perPurchase')"
        style="width:440px"
        prop="buyPrice"
        v-if="dataForm.shopGrowthSwitch"
      >
        <el-input v-model="dataForm.buyPrice" @change="setShopGetScore">
          <template slot="append">{{$t('coupon.yuan')}}{{$t('user.getOneGrowth')}}</template>
        </el-input>
        <!-- <span class="tips">元可获取1积分</span> -->
      </el-form-item>
      <el-form-item
        :label="$t('user.completedOrderGet')"
        style="width:440px"
        prop="buyOrder"
        v-if="dataForm.shopGrowthSwitch"
      >
        <el-input v-model="dataForm.buyOrder" @change="setShopComplete">
          <template slot="append">{{$t('user.growth')}}</template>
        </el-input>
        <!-- <span class="tips">元可获取1积分</span> -->
      </el-form-item>
    </el-form>
    <div class="default-btn" @click="dataFormSubmit()">{{$t('sysManagement.save')}}</div>
  </div>
</template>

<script>
export default {
  created () {
    this.getData()
  },
  data () {
    return {
      addOrUpdateVisible: false,
      dataForm: {
        id: 0,
        buyPrice: 0.0,
        shopGrowthSwitch: false,
        buyOrder: 0.0
      },
      dataRule: {
        buyPrice: [
          { required: true, message: this.$i18n.t('user.consumptionGetGrowthCannotEmpty'), trigger: 'blur' }
        ],
        buyOrder: [
          { required: true, message: this.$i18n.t('user.orderAcquisitionCannotEmpty'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取数据
    getData () {
      // if (this.dataForm.id) {
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/user/GrowthConfig/info/' + 'GROWTH_CONFIG'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data.shopGrowthSwitch) {
            this.dataForm = data
          }
        })
        this.$refs['dataForm'].resetFields()
      })
      // }
    },
    // 设置数据
    setDate (data) {
      this.dataForm = data
    },

    setShopGetScore () {
      let num = Math.round(this.dataForm.buyPrice)
      this.dataForm.buyPrice = num < 1 ? 1 : num
      if (num >= 100000000) {
        this.dataForm.buyPrice = 100000000
      }
    },

    setShopComplete () {
      let num = Math.round(this.dataForm.buyOrder)
      this.dataForm.buyOrder = num < 1 ? 1 : num
      if (num >= 100000000) {
        this.dataForm.buyOrder = 100000000
      }
    },
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        console.log(valid, 'valid')
        if (valid) {
          if (!this.dataForm.buyPrice) {
            this.$message.error(this.$i18n.t('user.pleaseEnterCorrectValue'))
            this.dataForm.buyPrice = ''
            return
          } else if (!this.dataForm.buyOrder) {
            this.$message.error(this.$i18n.t('user.pleaseEnterCorrectValue'))
            this.dataForm.buyOrder = ''
            return
          }
          let param = this.dataForm
          this.$http({
            url: this.$http.adornUrl(`/user/GrowthConfig/`),
            method: 'post',
            data: this.$http.adornData(param)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500
            })
          }).catch(() => {

          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.distribution-withdraw-cash-set {
  .input-tips {
    font-size: 12px;
  }
}
</style>
