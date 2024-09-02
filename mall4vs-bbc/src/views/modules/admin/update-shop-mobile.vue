<template>
  <el-dialog :title="this.$i18n.t('admin.modifySmsReceNum')" :visible.sync="visible" :append-to-body="true" :width="dialogWidth">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="labelWidth"
    >
      <el-form-item :label="this.$i18n.t('admin.oldReceNum') + '：'" prop="password">
        <!-- <el-input type="password" v-model="dataForm.receiveMobile"></el-input> -->
        <span>{{dataForm.receiveMobile == null || dataForm.receiveMobile === '' ?this.$i18n.t('admin.noSet'):dataForm.receiveMobile}}</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('admin.newReceNum') +'：'" prop="receiveMobile">
        <el-input size="small" type="text" v-model="receiveMobile" maxlength="11"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('crud.filter.cancelBtn')}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('crud.filter.submitBtn')}}</div>
    </span>
  </el-dialog>
</template>

<script>
  import {isMobile} from '@/utils/validate'
  import { setDialogWidth, widthChange } from '@/utils/setDialogWidth'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          receiveMobile: ''
        },
        shopWallet: {},
        receiveMobile: '',
        dataRule: {
          newPassword: [
            {required: true, message: this.$i18n.t('admin.newReceNumNoNull'), trigger: 'blur'}
          ]
        },
        dialogWidth: '',
        defWidth: 500,
        labelWidth: localStorage.getItem('lang') === 'en' ? '190px' : '120px'
      }
    },
    computed: {},
    created () {
      this.dialogWidth = setDialogWidth(this.defWidth)
    },
    mounted () {
      widthChange(this, this.defWidth)
    },
    methods: {
      // 初始化
      init () {
        this.visible = true
        this.receiveMobile = ''
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.$http({
          url: this.$http.adornUrl('/shop/shopDetail/info'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm = data
        })
      },
      // 表单提交
      dataFormSubmit () {
        if (!isMobile(this.receiveMobile)) {
          this.$message({
            message: this.$i18n.t('admin.phoNumFormaErr'),
            type: 'error',
            duration: 1500
          })
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/shop/shopDetail/updateMobile'),
              method: 'put',
              data: this.$http.adornData({
                'receiveMobile': this.receiveMobile
              })
            }).then(({data}) => {
              this.$message({
                message: this.$i18n.t('publics.operation'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                }
              })
            })
          }
        })
      }
    }
  }
</script>

