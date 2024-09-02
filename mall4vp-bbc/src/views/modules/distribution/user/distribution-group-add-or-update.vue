<template>
  <div class="mod-hotSearch-add-or-update">
    <el-dialog :title="!dataForm.groupId ? '新增分组' : '修改分组'"
               :close-on-click-modal="false"
               :visible.sync="visible">
      <el-form :model="dataForm"
               :rules="dataRule"
               ref="dataForm"
               @keyup.enter.native="dataFormSubmit ()"
               label-width="80px">
        <el-form-item label="分组名称"
                      prop="groupName">
          <el-input v-model="dataForm.groupName"
                    controls-position="right"
                    :min="0"
                    label="分组名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary"
                   @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        'groupId': 0,
        'groupName': ''
      },
      addProdVisible: false,
      visible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataRule: {
        groupName: [
          { required: true, message: '请输入组名', trigger: 'brue' },
          { max: 255, message: '长度在 255 个字符内', trigger: 'brue' }
        ]
      }
    }
  },
  components: {
  },
  methods: {
    init (data) {
      this.visible = true
      if (data) {
        this.dataForm = Object.assign(this.dataForm, data)
      } else {
        this.$nextTick(() => {
          this.dataForm.pointsId = null
          this.$refs['dataForm'].resetFields()
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let param = this.dataForm
          this.$http({
            url: this.$http.adornUrl(`/distribution/distributionUserGroup`),
            method: param.groupId ? 'put' : 'post',
            data: this.$http.adornData(param)
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
