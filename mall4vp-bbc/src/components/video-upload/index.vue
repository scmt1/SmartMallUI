<template>
  <div>
    <div class="plugin-video">
      <div tabindex="0" class="el-upload el-upload--text" @click.prevent.stop="videoboxHandle">
        <video v-if="value" ref="myVideo" class="video" :src="getImgSrc()" controls="controls"></video>
        <i v-else class="el-icon-plus pic-uploader-icon"></i>
      </div>
    </div>
    <!-- 弹窗, 新增视频 -->
    <div v-if="value" class="default-btn" @click="deleteImg">删除</div>
    
    <video-box v-if="videoboxVisible" ref="videobox" @refreshPic="refreshPic"></video-box>
    <el-dialog :visible.sync="visible" :append-to-body="visible">
      <!-- <img width="100%" :src="getImgSrc()" alt /> -->
    </el-dialog>
  </div>
</template>

<script>
import VideoBox from '@/components/VideoBox'
export default {
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      videoboxVisible: false,
      visible: false
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
    }
  },
  components: {
    VideoBox
  },
  methods: {
    // 打开视频选择窗
    videoboxHandle () {
      if (this.disabled) {
        this.openImg()
        return false
      }
      this.videoboxVisible = true
      this.$nextTick(() => {
        this.$refs.videobox.init(1)
      })
    },

    /**
     * 获取视频路径
     */
    getImgSrc () {
      if (!this.value) {
        return ''
      }
      if (this.value.indexOf('http://') === 0 || this.value.indexOf('https://') === 0) {
        return this.value
      }
      return this.resourcesUrl + this.value
    },
    openImg () {
      this.visible = true
    },
    refreshPic (imagePath) {
      this.$emit('input', imagePath)
    },
    deleteImg () {
      this.$emit('input', '')
    }
  }
}
</script>

<style lang="scss">
.plugin-video {
  display: inline-block;
  width: auto;
  vertical-align: bottom;
  .el-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    min-width: 120px;
    max-width: 300px;
    height: auto;
    min-height: 120px;
    max-height: 250px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .pic-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: auto;
      height: auto;
      // width: 120px;
      // height: 120px;
      // line-height: 120px;
      text-align: center;
    }
    .video {
      width: auto;
      max-width: 300px;
      // height: 120px;
      height: auto;
      max-height: 250px;
      display: block;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
  }
}
</style>
