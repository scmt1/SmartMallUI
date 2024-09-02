<template>
  <div>
    <div v-if="height && width">
      <img v-if="picNotNull(pic)" :src="getPic(pic)" :height="height" :width="width" @error="handlePicError"/>
      <img v-else src="~@/assets/img/def.png"  :height="height" :width="width"  />
    </div>
    <div v-else-if="width">
      <img v-if="picNotNull(pic)" :src="getPic(pic)" :width="width" @error="handlePicError"/>
      <img v-else src="~@/assets/img/def.png" :width="width" />
    </div>
    <div v-else-if="height">
      <img v-if="picNotNull(pic)" :src="getPic(pic)" :height="height" @error="handlePicError"/>
      <img v-else src="~@/assets/img/def.png"  :height="height" />
    </div>
    <div v-else="height">
      <img v-if="picNotNull(pic)" :src="getPic(pic)" @error="handlePicError" />
      <img v-else src="~@/assets/img/def.png" />
    </div>
  </div>
</template>

<script>
import spec from '@/views/modules/prod/spec.vue'
export default {
  components: { spec },
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  props: {
    pic: {
      default: null,
      type: String
    },
    height: {
      default: null,
      type: String
    },
    width: {
      default: null,
      type: String
    }
  },
  methods: {
    picNotNull (pic) {
      var picUrl = pic.replace(this.resourcesUrl, '')
      if (!pic || !picUrl) {
        return false
      }
      return true
    },
    getPic (pic) {
      if (pic.indexOf('http') !== -1) {
        return pic
      }
      return this.resourcesUrl + pic
    },
    handlePicError (e) {
      e.target.src = require('@/assets/img/def.png')
    }
  }
}
</script>
<style lang="scss" scoped>
/* .prods-select-body {
  height: 600px;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
} */
.brand-select-pop {
  & ::v-deep .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .main-container {
    margin: 0;
    .pagination {
      text-align: right;
    }
  }
}
</style>
