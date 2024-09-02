<template>
  <el-dialog :title="!dataForm.id ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px"
             size="small">
      <el-form-item label=this.$i18n.t('sys.creationTime')
                    prop="createTime">
        <el-date-picker v-model="dataForm.createTime"
                        type="datetime"
                        :placeholder="this.$i18n.t('admin.seleData')"
                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('publics.name')"
                    prop="userName">
        <el-input v-model="dataForm.userName"
                  :placeholder="this.$i18n.t('publics.name')"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('sys.email')"
                    prop="email">
        <el-input v-model="dataForm.email"
                  :placeholder="this.$i18n.t('sys.email')"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('sys.connInfo')"
                    prop="contact">
        <el-input v-model="dataForm.contact"
                  :placeholder="this.$i18n.t('sys.connInfo')"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('admin.msgConten')"
                    prop="content">
        <tiny-mce v-model="dataForm.content"
                  ref="content"></tiny-mce>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('admin.msgReply')"
                    prop="reply">
        <tiny-mce v-model="dataForm.reply"
                  ref="reply"></tiny-mce>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('product.status')"
                    size="mini"
                    prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{$t('productComm.waitPass')}}</el-radio>
          <el-radio :label="1">{{$t('productComm.pass')}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('crud.filter.cancelBtn')}}</div>
      <div class="default-btn primary-btn"
                 @click="dataFormSubmit()">{{$t('crud.filter.submitBtn')}}</div>
    </span>
  </el-dialog>
</template>

<script>
  import {isEmail} from '@/utils/validate'
  import TinyMce from '@/components/tiny-mce'

  export default {
    data () {
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error(this.$i18n.t('sys.emailaError')))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: 0,
          createTime: '',
          userName: '',
          email: '',
          contact: '',
          content: '',
          reply: '',
          status: 0
        },
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        dataRule: {
          userMail: [
            {required: true, message: this.$i18n.t('sys.emailaNoNull'), trigger: 'blur'},
            {validator: validateEmail, trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      TinyMce
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
          this.$refs.content.setContent('')
          this.$refs.reply.setContent('')
        })
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/admin/message/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.dataForm = data
            this.$refs.content.setContent(data.content)
            this.$refs.reply.setContent(data.reply)
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/admin/message`),
              method: this.dataForm.id ? 'put' : 'post',
              data: this.$http.adornData({
                id: this.dataForm.id || undefined,
                createTime: this.dataForm.createTime,
                userName: this.dataForm.userName,
                email: this.dataForm.email,
                contact: this.dataForm.contact,
                content: this.dataForm.content,
                reply: this.dataForm.reply,
                status: this.dataForm.status
              })
            }).then(({data}) => {
              this.$message({
                message: this.$i18n.t('publics.operation'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList', this.page)
                }
              })
            })
          }
        })
      }
    }
  }
</script>
