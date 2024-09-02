<template>
  <el-dialog
    :modal="false"
    :title="$t('user.userImport')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="38%"
  >
    <span v-for="(note, i) in (isEn() ? notesEn : notes)" :key="note">{{note}}<br v-if="i < notes.length - 1" /></span>
    <el-button
      style="margin-left: 10px;"
      size="small"
      type="text"
      @click="downloadModel"
    >{{$t('product.downloadTemplate')}}</el-button>
    <el-upload
      class="upload-demo"
      ref="upload"
      :action="$http.adornUrl('/admin/user/importExcel')"
      :headers="{Authorization: $cookie.get('Authorization_vp'),locale:lang}"
      :limit="1"
      name="excelFile"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-error="uploadFalse"
      :on-success="uploadSuccess"
      :file-list="files"
      :auto-upload="false"
      :before-upload="beforeAvatarUpload"
    >
      <el-button slot="trigger" size="small" type="success">{{$t('product.selectFile')}}</el-button>
      <el-button
        style="margin-left: 10px;"
        size="small"
        type="primary"
        @click="submitUpload"
      >{{$t('components.confirmUpload')}}</el-button>
    </el-upload>
  </el-dialog>
</template>
<script>
  export default {
    data () {
      return {
        visible: false,
        lang: localStorage.getItem('lang') || 'zh_CN',
        couponId: 3,
        files: [],
        dataForm: {
        },
        dataRule: {
        },
        notes: [
          '注意：',
          '   1、请勿修改表格中的字段顺序，或随意增加、删除表格字段,上传模板大小不能超过 10MB,超过应该分批导入',
          '   2、会员等级根据配置成长值等级自动设置',
          '   3、导入用户期间，请勿修改会员等级设置',
          '   4、根据手机号(必须是11位)/邮箱作为唯一标识，如果导入的手机号/邮箱已存在，不会更新用户的任何数据.',
          '   5、国家/地区不同，手机号的验证规则也不同，导入时不会验证手机号码/邮箱的真实性，请谨慎填写，导入错误数据请自行负责.',
          '   6、如果是付费会员必须填写vip结束时间.'
        ],
        notesEn: [
          ' Note: ',
          ' 1, Please do not modify the order of the fields in the form, or arbitrarily add or delete form fields, upload the template size can not exceed 10MB, more than should be imported in batches ',
          ' 2、The Member level is set automatically according to the configured growth value level ',
          ' 3、Do not modify the membership level settings during user import ',
          ' 4、According to the cell phone number/Email as a unique identification, if the imported cell phone number/Email already exists, will not update any data of the user.',
          ' 5、The verification rules for cell phone numbers are different for different countries/regions, and the authenticity of cell phone numbers will not be verified when importing, so please fill in the form carefully and be responsible for importing wrong data.',
          ' 6、If it is a paid member must fill in the vip end time'
        ]
      }
    },
    methods: {
      uploadSuccess (response) {
        alert(response.data)
        this.files = []
        this.visible = false
        this.$emit('refreshDataList')

        // if (response) {
        //   alert(response)
        //   this.files = []
        //   this.visible = false
        //   this.$emit('refreshDataList')
        // } else {
        //   alert(this.isEn() ? 'File import failed' : '文件导入失败')
        // }
      },
      uploadFalse (response) {
        alert(this.isEn() ? 'File upload failed!' : '文件上传失败！')
      },
      init (id) {
        this.visible = true
        this.$nextTick(() => {
          // this.$refs['dataForm'].resetFields()
        })
        this.couponId = id
      },
      // 上传前对文件的大小的判断
      beforeAvatarUpload (file) {
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!extension && !extension2) {
          alert(this.isEn() ? 'Upload template can only be in xls, xlsx format!' : '上传模板只能是 xls、xlsx格式!')
        }
        if (!isLt2M) {
          alert(this.isEn() ? 'Upload template size cannot exceed 10MB' : '上传模板大小不能超过 10MB!')
        }
        return extension || (extension2 && isLt2M)
      },
      submitUpload () {
        // if (this.businessType != null) {
        // 触发组件的action
        if (!this.$refs.upload.uploadFiles.length) {
          this.$message.error(this.$i18n.t('order.uploadInvoiceTip'))
        }
        this.$refs.upload.submit()
        // }
        // if (this.businessType == null) {
        //   this.businessType = 'businessType不能为空'
        // }
      },
      handleRemove (file) {
        // console.log(file)
      },
      handlePreview (file) {
        if (file.response.status) {
          alert(this.isEn() ? 'This file import success' : '此文件导入成功')
        } else {
          alert(this.isEn() ? 'This file import failed' : '此文件导入失败')
        }
      },
      // 下载模板
      downloadModel () {
        this.$http({
          url: this.$http.adornUrl('/admin/user/importUserModel'),
          method: 'get',
          responseType: 'blob' // 解决文件下载乱码问题
        }).then(({ data }) => {
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = this.isEn() ? 'UserInfoImportTemplate.xlsx' : '导入用户信息模板.xlsx'
          const elink = document.createElement('a')
          if ('download' in elink) { // 非IE下载
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
      },
      isEn () {
        if (this.$i18n.t('language') === 'language') {
          return true
        } else {
          return false
        }
      }
    }
  }
</script>
