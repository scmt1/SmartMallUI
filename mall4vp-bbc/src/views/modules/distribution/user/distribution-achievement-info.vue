<template>
  <div class="mod-user-info">
    <el-dialog :title="'分销员信息'" :close-on-click-modal="false" :visible.sync="visible">
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="100px"
      >
        <el-form-item label="绑定客户数" prop="boundCustomers">
          <el-input :readonly="true" v-model="dataForm.boundCustomers"></el-input>
        </el-form-item>

        <el-form-item label="邀请分销员数数" prop="invitedVeeker">
          <el-input :readonly="true" v-model="dataForm.invitedVeeker"></el-input>
        </el-form-item>

        <el-form-item label="支付单数" prop="payNumber">
          <el-input :readonly="true" v-model="dataForm.payNumber"></el-input>
        </el-form-item>

        <el-form-item label="积累成交单数" prop="payNumber">
          <el-input :readonly="true" v-model="dataForm.successOrderNumber"></el-input>
        </el-form-item>

        <el-form-item label="积累成交金额" prop="successTradingVolume">
          <el-input :readonly="true" v-model="dataForm.successTradingVolume"></el-input>
        </el-form-item>

        <el-form-item label="消费笔数" prop="expenseNumber">
          <el-input :readonly="true" v-model="dataForm.userShoppingDataDto.expenseNumber"></el-input>
        </el-form-item>

        <el-form-item label="用户消费金额" prop="sumOfConsumption">
          <el-input :readonly="true" v-model="dataForm.userShoppingDataDto.sumOfConsumption"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        id: null,
        userShoppingDataDto: {}
      },
      addProdVisible: false,
      visible: false,
      dataRule: {
      }
    }
  },
  components: {
  },
  methods: {
    init (id) {
      this.dataForm.id = id
      this.visible = true
      this.getData()
    },
    // 获取当前用户业绩信息
    getData () {
      this.$http({
        url: this.$http.adornUrl(`/distribution/distributionUser/info/achievementData/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
      })
    }
  }

}
</script>
 