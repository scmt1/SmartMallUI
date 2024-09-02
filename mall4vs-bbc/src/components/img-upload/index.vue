<template>
  <div class="up-img-box">
    <div class="plugin-images">
      <ul class="el-upload-list el-upload-list--picture-card" v-if="value" @click="elxImgboxHandle">
        <li tabindex="0" class="el-upload-list__item is-success">
          <img :src="value.includes('http') ? value : resourcesUrl + value" class="el-upload-list__item-thumbnail" />
        </li>
      </ul>

      <div tabindex="0" class="el-upload el-upload--picture-card" v-else @click="elxImgboxHandle">
        <i class="el-icon-plus"></i>
      </div>
    </div>
    <!-- 弹窗, 新增图片 -->
    <elx-imgbox
      v-if="elxImgboxVisible"
      ref="elxImgbox"
      @refreshPic="refreshPic"
      :maxSize="maxSize"
      :imgSizeLimit="imgSizeLimit"
    ></elx-imgbox>
  </div>
</template>

<script>
import ElxImgbox from '@/components/elx-imgbox'
export default {
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      elxImgboxVisible: false
    }
  },
  props: {
    value: {
      default: '',
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    },
    maxSize: {
      default: 2,
      type: Number
    },
    imgSizeLimit: {
      default: false,
      type: Boolean
    }
  },
  components: {
    ElxImgbox
  },
  methods: {
    // 打开图片选择窗
    elxImgboxHandle () {
      if (this.disabled) {
        return false
      }
      this.elxImgboxVisible = true
      this.$nextTick(() => {
        this.$refs.elxImgbox.init(1)
      })
    },
    refreshPic (imagePath) {
      // console.log('imagePath', imagePath)
      this.$emit('input', imagePath)
    }
  }
}
</script>

<style lang="scss">
.up-img-box {
  .plugin-images {
    .el-upload.el-upload--picture-card,
    .el-upload-list .el-upload-list--picture-card,
    .el-upload-list--picture-card .el-upload-list__item {
      width: 100px;
      height: 100px;
    }
    .el-upload--picture-card {
      position: relative;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      background-color: #fff;
      .el-icon-plus {
        color: #dcdfe6;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
    }
  }
}
.pic-uploader-component .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .pic-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .pic {
    width: 100px;
    height: 100px;
    display: block;
  }
}
.pic-uploader-component .el-upload:hover {
  border-color: #409eff;
}
</style>
