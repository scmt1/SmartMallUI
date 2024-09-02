<template>
  <el-dialog
    :title="!dataForm.stockChangeReasonId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('crud.updateBtn')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="130px">
      <el-form-item :label="this.$i18n.t('stock.stockType')" prop="type">
        <el-radio v-model="dataForm.type" :label="1" :value="1">{{ this.$i18n.t('stock.sendStock') }}</el-radio>
        <el-radio v-model="dataForm.type" :label="2" :value="2">{{ this.$i18n.t('stock.receiveStock') }}</el-radio>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('stock.stockBillCnReason')" prop="reasonCn">
        <el-input v-model="dataForm.reasonCn" maxlength="10" type="text"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('stock.stockBillEnReason')" prop="reasonEn">
        <el-input v-model="dataForm.reasonEn" maxlength="10" type="text"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('stock.remarkCn')" prop="remarkCn">
        <el-input v-model="dataForm.remarkCn" maxlength="100" type="textarea" :rows="3"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('stock.remarkEn')" prop="remarkEn">
        <el-input v-model="dataForm.remarkEn" maxlength="100" type="textarea" :rows="3"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{ this.$i18n.t('order.cancel') }}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{ this.$i18n.t('order.confirm') }}</div>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      var validateReasonCn = (rule, value, callback) => {
        if (!value || !value.trim()) {
          callback(new Error(this.$i18n.t('stock.stockBillCnReasonNotEmpty')))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          type: 1,
          reasonCn: null,
          reasonEn: null,
          status: null,
          remarkCn: null,
          remarkEn: null
        },
        dataRule: {
          reasonCn: [
            { required: true, message: this.$i18n.t('stock.stockBillCnReasonNotEmpty'), trigger: 'blur' },
            { validator: validateReasonCn, trigger: 'blur' }
          ],
          type: [
            { required: true, message: this.$i18n.t('stock.stockTypeNotEmpty'), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (stockChangeReasonId, type) {
        this.dataForm.stockChangeReasonId = stockChangeReasonId || 0
        this.dataForm.reasonCn = null
        this.dataForm.reasonEn = null
        this.dataForm.status = null
        this.dataForm.remarkCn = null
        this.dataForm.remarkEn = null
        this.visible = true
        if (!stockChangeReasonId) {
          this.dataForm.type = type === 2 ? 2 : 1
          return
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.stockChangeReasonId) {
            this.$http({
              url: this.$http.adornUrl('/shop/stockChangeReason/info/' + this.dataForm.stockChangeReasonId),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.dataForm.type = data.type
              this.dataForm.status = data.status
              data.stockChangeReasonLangList.forEach(item => {
                if (item.lang === 0) {
                  this.dataForm.reasonCn = item.reason
                  this.dataForm.remarkCn = item.remark
                } else if (item.lang === 1) {
                  this.dataForm.reasonEn = item.reason
                  this.dataForm.remarkEn = item.remark
                }
              })
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          this.dataForm.stockChangeReasonLangList = [
            {
              lang: 0,
              reason: this.dataForm.reasonCn,
              remark: this.dataForm.remarkCn
            },
            {
              lang: 1,
              reason: this.dataForm.reasonEn && this.dataForm.reasonEn !== '' ? this.dataForm.reasonEn : this.dataForm.reasonCn,
              remark: this.dataForm.remarkEn
            }
          ]
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/shop/stockChangeReason'),
              method: this.dataForm.stockChangeReasonId ? 'put' : 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
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
