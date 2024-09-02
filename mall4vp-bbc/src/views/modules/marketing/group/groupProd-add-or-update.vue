<template>
  <el-dialog :title="!dataForm.groupProdId ? '新增' : '修改'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="活动商品id"
                    prop="groupProdId">
        <el-input v-model="dataForm.groupProdId"></el-input>
      </el-form-item>
      <el-form-item label="店铺id"
                    prop="shopId">
        <el-input v-model="dataForm.shopId"></el-input>
      </el-form-item>
      <el-form-item label="活动id"
                    prop="groupActivityId">
        <el-input v-model="dataForm.groupActivityId"></el-input>
      </el-form-item>
      <el-form-item label="商品id"
                    prop="prodId">
        <el-input v-model="dataForm.prodId"></el-input>
      </el-form-item>
      <el-form-item label="创建时间"
                    prop="createTime">
        <el-input v-model="dataForm.createTime"></el-input>
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
        groupProdId: null,
        shopId: null,
        groupActivityId: null,
        prodId: null,
        createTime: null
      },
      dataRule: {
      }
    }
  },
  methods: {
    init (groupProdId) {
      this.dataForm.groupProdId = groupProdId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.groupProdId) {
          this.$http({
            url: this.$http.adornUrl('/admin/groupProd/info/' + this.dataForm.groupProdId),
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
            url: this.$http.adornUrl('/admin/groupProd'),
            method: this.dataForm.groupProdId ? 'put' : 'post',
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
