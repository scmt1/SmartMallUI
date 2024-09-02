<template>
  <div>
    <tiny-mce
      v-model="contentCN.content"
      ref="content"
      style="width: 95%"
    ></tiny-mce>
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
      remarkCN: '',
    }
  },
  data () {
    return {
      // 中文配置信息
      contentCN: {
        content: ''
      },
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
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
