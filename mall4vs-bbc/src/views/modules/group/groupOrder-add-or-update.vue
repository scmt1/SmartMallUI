<template>
  <el-dialog :title="!dataForm.groupOrderId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item :label="this.$i18n.t('group.groupOrdId')"
                    prop="groupOrderId">
        <el-input v-model="dataForm.groupOrderId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('group.groupId')"
                    prop="groupBuyId">
        <el-input v-model="dataForm.groupBuyId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('group.actProId')"
                    prop="groupGoodsId">
        <el-input v-model="dataForm.groupGoodsId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('product.prodName')"
                    prop="goodsName">
        <el-input v-model="dataForm.goodsName"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('group.groupNum')"
                    prop="joinNum">
        <el-input v-model="dataForm.joinNum"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('group.groupsNum')"
                    prop="groupNum">
        <el-input v-model="dataForm.groupNum"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('groups.groupStatus')"
                    prop="status">
        <el-input v-model="dataForm.status"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('group.groupStratTime')"
                    prop="startTime">
        <el-input v-model="dataForm.startTime"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('group.groupEndTime')"
                    prop="endTime">
        <el-input v-model="dataForm.endTime"></el-input>
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
        groupOrderId: null,
        groupBuyId: null,
        groupGoodsId: null,
        goodsName: null,
        joinNum: null,
        groupNum: null,
        status: null,
        startTime: null,
        endTime: null
      },
      dataRule: {
      }
    }
  },
  methods: {
    init (groupOrderId) {
      this.dataForm.groupOrderId = groupOrderId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.groupOrderId) {
          this.$http({
            url: this.$http.adornUrl('/admin/groupOrder/info/' + this.dataForm.groupOrderId),
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
            url: this.$http.adornUrl('/admin/groupOrder'),
            method: this.dataForm.groupOrderId ? 'put' : 'post',
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
