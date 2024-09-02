<template>
  <el-dialog :title="!dataForm.groupProdId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px"
             size="small">
      <el-form-item :label="this.$i18n.t('group.actProId')"
                    prop="groupProdId">
        <el-input v-model="dataForm.groupProdId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.shopId')"
                    prop="shopId">
        <el-input v-model="dataForm.shopId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('groups.activityId')"
                    prop="groupActivityId">
        <el-input v-model="dataForm.groupActivityId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('groups.proId')"
                    prop="prodId">
        <el-input v-model="dataForm.prodId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('sys.creationTime')"
                    prop="createTime">
        <el-input v-model="dataForm.createTime"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">{{$t("crud.filter.cancelBtn")}}</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</el-button>
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
              message: this.$i18n.t('publics.operation'),
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
