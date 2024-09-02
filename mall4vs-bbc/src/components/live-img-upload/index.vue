<template>
  <div class="up-img-box">
    <div class="plugin-images">
      <ul class="el-upload-list el-upload-list--picture-card" v-if="value" @click="elxImgboxHandle">
        <li tabindex="0" class="el-upload-list__item is-success">
          <img :src="resourcesUrl + value" class="el-upload-list__item-thumbnail" />
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
      console.log('bobobobo', this.imgSizeLimit)
      if (this.disabled) {
        return false
      }
      this.elxImgboxVisible = true
      this.$nextTick(() => {
        this.$refs.elxImgbox.init(1)
      })
    },
    refreshPic (imagePath) {
      var img = new Image()
      img.src = this.resourcesUrl + imagePath
      let isCheck = false
      img.onload = function () {
        var width = img.width
        var height = img.height
        // 图片宽度、高度不能超过300px
        if (width > 300 || height > 300) {
          isCheck = true
        }
      }
      if (isCheck) {
        this.$message.error(this.$i18n.t('components.imageExc300Px'))
        return
      }
      this.$emit('input', imagePath)
    },
    submitPic (width, height, imagePath) {
      if (width > 300) {
        return this.$message.error(this.$i18n.t('components.widthNoExc300Px'))
      }
      if (height > 300) {
        return this.$message.error(this.$i18n.t('components.heightNoExc300Px'))
      }
      this.$emit('input', imagePath)
    }
  }
}
</script>

<style lang="scss" scoped>
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .pic {
    width: 178px;
    height: 178px;
    display: block;
  }
}
.pic-uploader-component .el-upload:hover {
  border-color: #409eff;
}
</style>
