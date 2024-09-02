<template>
  <div>
    <el-tabs type="card">
      <el-tab-pane :label="this.$i18n.t('sysManagement.chineseInformation')">
        <tiny-mce
          v-model="contentCN.content"
          ref="content"
          style="width: 95%"
        ></tiny-mce>
      </el-tab-pane>
      <el-tab-pane :label="this.$i18n.t('sysManagement.englishInformation')">
        <tiny-mce
          v-model="contentEN.content"
          ref="content"
          style="width: 95%"
        ></tiny-mce>
      </el-tab-pane>
    </el-tabs>
    <el-button style="margin-top: 10px" type="primary" @click="saveSubmit">{{
        $t("crud.saveBtn")
      }}</el-button>
  </div>
</template>

<script>
import TinyMce from '@/components/tiny-mce'

export default {
  components: {
    TinyMce
  },
  props: {
    params: {
      title: '',
      keyCN: '',
      keyEN: '',
      remarkCN: '',
      remarkEN: ''
    }
  },
  data () {
    return {
      // 中文配置信息
      contentCN: {
        content: ''
      },
      // 英文配置信息
      contentEN: {
        content: ''
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      console.log(this.params)
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/pconfig/info/' + this.params.keyCN),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data) {
            this.contentCN = JSON.parse(data)
          }
        })
        this.$http({
          url: this.$http.adornUrl('/sys/pconfig/info/' + this.params.keyEN),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data) {
            this.contentEN = JSON.parse(data)
          }
        })
      })
    },

    saveSubmit () {
      this.$http({
        url: this.$http.adornUrl('/sys/pconfig/save'),
        method: 'post',
        data: this.$http.adornData({
          'paramKey': this.params.keyCN,
          'paramValue': JSON.stringify(this.contentCN),
          'remark': this.params.remarkCN
        })
      })
      this.$http({
        url: this.$http.adornUrl('/sys/pconfig/save'),
        method: 'post',
        data: this.$http.adornData({
          'paramKey': this.params.keyEN,
          'paramValue': JSON.stringify(this.contentEN),
          'remark': this.params.remarkEN
        })
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500
        })
      })
    }
  }
}
</script>
