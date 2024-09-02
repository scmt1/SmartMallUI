<template>
  <el-dialog :title="!dataForm.userId ? '新增' : '修改'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="100px">
      <el-form-item label="关键字">
        <el-input placeholder="请输入关键字"
                  v-model="dataForm.keyword"></el-input>
      </el-form-item>
      <el-form-item label="匹配模式">
        <el-select v-model="dataForm.pptype"
                   placeholder="请选择匹配模式">
          <el-option label="模糊匹配"
                     :value="1"> </el-option>
          <el-option label="完全匹配"
                     :value="2"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息类型"
                    prop="msgType">
        <el-select v-model="dataForm.msgType"
                   placeholder="请选择消息类型"
                   @change="clearMaterial">
          <el-option v-for="(item,index) in msgTypes"
                     :key="index"
                     :label="msgTypes[index]"
                     :value="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择素材"
                    v-show="dataForm.msgType !== 'text'">
        <el-button @click="selectMaterial()">选择</el-button>
      </el-form-item>
      <el-form-item label="素材名称"
                    v-if="dataForm.msgType === 'voice' || dataForm.msgType === 'video'">
        <el-input placeholder="请选择素材"
                  v-model="dataForm.content"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="查看"
                    v-if="dataForm.msgType === 'image' || dataForm.msgType === 'news'">
           <img v-if="dataForm.msgType === 'image'" :src="dataForm.content"/>
           <a v-else-if="dataForm.msgType === 'news' && dataForm.news.url" :href="dataForm.news.url" target="_blank" rel="noopener noreferrer">查看</a>
      </el-form-item>
      <el-form-item label="回复内容"
                    prop="content"
                    v-if="dataForm.msgType === 'text'">
        <el-input v-model="dataForm.content"
                  type="textarea"
                  placeholder="回复内容"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
    <material-select v-if="materialSelectVisible"
                     ref="materialSelect"
                     @callBack="materialSelectCallBack"></material-select>
  </el-dialog>
</template>

<script>
import MaterialSelect from './material-select'
export default {
  data () {
    return {
      visible: false,
      materialSelectVisible: false,
      dataForm: {
        keyword: '',
        pptype: 1,
        msgType: '',
        content: '',
        mediaId: '',
        news: {}
      },
      material: {
        mediaName: '',
        mediaUrl: ''
      },
      msgTypes: { text: '文本消息', image: '图片消息', voice: '语音消息', video: '视频消息', news: '图文消息' },
      dataRule: {
        nickName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    MaterialSelect
  },
  methods: {
    init (row) {
      this.visible = true
      this.materialSelectVisible = false
      this.clearMaterial()
      this.$nextTick(() => {
        if (row) {
          for (let key in row) {
            this.dataForm[key] = row[key]
          }
        } else {
          this.dataForm = {
            keyword: '',
            pptype: 1,
            msgType: 'text',
            content: '',
            mediaId: '',
            news: {}
          }
        }
      })
    },
    // 选择素材
    selectMaterial () {
      this.materialSelectVisible = true
      this.$nextTick(() => {
        this.$refs.materialSelect.init(this.dataForm.msgType)
      })
    },
    materialSelectCallBack (val) {
      if (val.mediaType === 'voice' || val.mediaType === 'video') {
        this.dataForm.content = val.mediaName
      } else if (val.mediaType === 'news') {
        this.dataForm.news = val.news
        this.dataForm.content = val.content
      } else {
        this.dataForm.content = val.content
      }
      this.dataForm.mediaId = val.mediaId
    },
    clearMaterial () {
      this.material.mediaName = ''
      this.dataForm.content = ''
      this.dataForm.mediaId = ''
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/weixin/keywordresponse`),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData({
              keyword: this.dataForm.keyword,
              pptype: this.dataForm.pptype,
              id: this.dataForm.id,
              msgType: this.dataForm.msgType,
              content: this.dataForm.msgType === 'news' ? JSON.stringify(this.dataForm.news) : this.dataForm.content,
              mediaId: this.dataForm.mediaId
            })
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
