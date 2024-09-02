<template>
  <div class="custom-page-container">
    <div class="config-items">
      <div class="title">{{$t('pcdecorate.commonModal.customLink')}}</div>
      <el-input v-model="link" :placeholder="$t('pcdecorate.commonModal.customLinkTips')" style="width: 50%" ></el-input>
      <img src="@/assets/img/pc-micro-page/selected_link.png" alt="">
    </div>
  </div>
</template>
<script>
export default {
  props: {
    activeName: { // 激活tab名
      type: String,
      default: () => ''
    },
    customLinkArr: { // 自定义链接回显数据
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      link: ''
    }
  },
  methods: {
    // 回显
    setDatas () {
      if (this.customLinkArr && this.customLinkArr.type != '' && this.customLinkArr.type === '6') {
        this.link = this.customLinkArr.link
        this.$emit('handleGoodsSelect', { type: 'customLink', value: this.link })
      }
    }
  },
  watch: {
    link (val) {
      this.$emit('handleGoodsSelect', { type: 'customLink', value: val })
    },
    activeName (val) {
      if (val === '6') {
        this.link = ''
        this.setDatas()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-page-container {
  min-height: 450px;
  max-height: 450px;
  height: 450px;
  overflow-y: auto;
  padding: 20px;
  .config-items {
    display: flex;
    align-items: center;
    position: relative;
    .title {
      width: 90px;
    }
    img {
      position: absolute;
      top: 6px;
      width: 20px;
      height: 20px;
      left: 57.5%;
    }
  }
}
</style>
<style lang="scss">
.custom-page-container {
  .el-input__inner {
    height: 32px;
  }
}
</style>