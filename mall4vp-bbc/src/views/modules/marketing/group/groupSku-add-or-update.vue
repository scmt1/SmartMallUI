<template>
  <el-dialog :title="!dataForm.groupSkuId ? '新增' : '修改'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="拼团活动商品规格id"
                    prop="groupSkuId">
        <el-input v-model="dataForm.groupSkuId"></el-input>
      </el-form-item>
      <el-form-item label="拼团活动商品id"
                    prop="groupProdId">
        <el-input v-model="dataForm.groupProdId"></el-input>
      </el-form-item>
      <el-form-item label="商品规格id"
                    prop="skuId">
        <el-input v-model="dataForm.skuId"></el-input>
      </el-form-item>
      <el-form-item label="活动价格"
                    prop="actPrice">
        <el-input v-model="dataForm.actPrice"></el-input>
      </el-form-item>
      <el-form-item label="团长价格"
                    prop="leaderPrice">
        <el-input v-model="dataForm.leaderPrice"></el-input>
      </el-form-item>
      <el-form-item label="已售数量"
                    prop="sellNum">
        <el-input v-model="dataForm.sellNum"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      roleList: [],
      dataForm: {
        groupSkuId: null,
        groupProdId: null,
        skuId: null,
        actPrice: null,
        leaderPrice: null,
        sellNum: null
      },
      dataRule: {
      }
    }
  },
  methods: {
    init (groupSkuId) {
      this.dataForm.groupSkuId = groupSkuId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.groupSkuId) {
          this.$http({
            url: this.$http.adornUrl('/admin/groupSku/info/' + this.dataForm.groupSkuId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/admin/groupSku'),
            method: this.dataForm.groupSkuId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
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
    }
  }
}
</script>
