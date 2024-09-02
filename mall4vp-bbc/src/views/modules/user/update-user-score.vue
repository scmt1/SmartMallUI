<template>
  <el-dialog :title="$t('user.updateUserScore')" :visible.sync="visible" width="30%">
    <el-form
      :model="dataForm"
      ref="dataForm"
      :rules="dataRule"
      :label-width="this.$i18n.t('language') === 'language' ? '210px' : '120px'"
    >
      <el-form-item :label="$t('user.scoresChange')" prop="scoreValue">
        <el-input v-model="dataForm.scoreValue" type="number" @change="inputNumber"></el-input>
        <span>{{$t('user.scoreTip1')}}</span>
      </el-form-item>
      <!-- <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="number"></el-input>
        <span>正数代表增加，负数代表减少，只能输入整数</span>
      </el-form-item>-->
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
        scoreValue: null,
        userIds: [],
        remark: null
      },
      dataRule: {
        scoreValue: [
          { required: true, message: this.$i18n.t('user.scoreTip2'), trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (ids) {
      this.visible = true
      this.dataForm.userIds = ids
      this.dataForm.scoreValue = null
    },
    inputNumber () {
      if (this.dataForm.scoreValue >= 100000000) {
        this.dataForm.scoreValue = 100000000
      } else if (this.dataForm.scoreValue <= -100000000) {
        this.dataForm.scoreValue = -100000000
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
          url: this.$http.adornUrl(`/user/userLevel/updateScore`),
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
              this.dataForm.scoreValue = null
            }
          })
        }).catch((e) => {
        })
      })
    }, 1000)
  }
}
</script>
