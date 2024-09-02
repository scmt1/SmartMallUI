<template>
  <el-dialog :title="$t('user.updateGrowth')" :visible.sync="visible" width="30%">
    <el-form
      :model="dataForm"
      ref="dataForm"
      :rules="dataRule"
      :label-width="this.$i18n.t('language') === 'language' ? '160px' : '100px'"
    >
      <el-form-item :label="$t('user.growthTip2')" prop="growthValue">
        <el-input v-model="dataForm.growthValue" max="100000000" min= "-100000000" type="number" @change="inputNumber"></el-input>
        <span>{{$t('user.growthTip1')}}</span>
      </el-form-item>
      <el-form-item>
        <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
        <div class="default-btn primary-btn" @click="confirm">{{$t('remindPop.confirm')}}</div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>


<script>
import { Debounce } from '@/utils/debounce'
export default {

  data () {
    var validateNumber = (rule, value, callback) => {
      if (!/^(-)?[1-9]+[0-9]*$/.test(value)) {
        callback(new Error(this.$i18n.t('user.growthTip3')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      confirmLoad: false,
      dataForm: {
        growthValue: null,
        userIds: []
      },
      dataRule: {
        growthValue: [
          { required: true, message: this.$i18n.t('user.growthTip4'), trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (ids) {
      this.visible = true
      this.dataForm.userIds = ids
      this.dataForm.growthValue = null
    },
    inputNumber () {
      if (this.dataForm.growthValue >= 100000000) {
        this.dataForm.growthValue = 100000000
      } else if (this.dataForm.growthValue <= -100000000) {
        this.dataForm.growthValue = -100000000
      }
    },
    confirm: Debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        if (!this.dataForm.userIds) {
          return
        }
        this.confirmLoad = true
        let param = this.dataForm
        this.$http({
          url: this.$http.adornUrl(`/user/userLevel/updateGrowth`),
          method: 'put',
          data: this.$http.adornData(param)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.confirmLoad = false
              this.$emit('refreshDataList', this.page)
              this.dataForm.growthValue = null
            }
          })
        }).catch((e) => {
        })
      })
    }, 1000)
  }
}
</script>
