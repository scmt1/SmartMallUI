<template>
  <div class="mul-pic-upload">
    <vue-draggable
      v-model="imageList"
      @start="onDragStart"
      @end="onDragEnd"
      class="el-upload-list el-upload-list--picture-card"
    >
      <!--拷贝上传图片组件生成的预览图元素代码，用绑定的model循环生成可拖拽元素-->
      <li
        v-for="(item,index) in imageList"
        :key="index"
        tabindex="0"
        class="el-upload-list__item is-success"
      >
        <img :src="item.url" alt class="el-upload-list__item-thumbnail" />
        <a class="el-upload-list__item-name">
          <i class="el-icon-document"></i>
        </a>
        <!-- <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-check rightTop"></i>
        </label> -->
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview">
            <i class="el-icon-zoom-in" @click="handlePictureCardPreview(item.url)"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(index)" v-if="!disabled">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </li>
      <li
        class="el-upload-list__item"
        @click="elxImgboxHandle"
        v-if="!disabled && this.imageList.length < this.limit"
      >
        <div tabindex="0" class="el-upload el-upload--picture-card">
          <i class="el-icon-plus"></i>
        </div>
        <!-- 弹窗, 新增图片 -->
        <elx-imgbox v-if="elxImgboxVisible" ref="elxImgbox" @refreshPic="refreshPic"></elx-imgbox>
      </li>
    </vue-draggable>
    <div v-if="prompt">{{$t("components.maxiNumPicture")}}:{{limit}}</div>
    <el-dialog  class="dialogImage" :visible.sync="dialogVisible" :modal="modal" :append-to-body="true">
      <img :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import VueDraggable from 'vuedraggable'
import ElxImgbox from '@/components/elx-imgbox'
export default {
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      elxImgboxVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      imageList: []
    }
  },
  components: {
    VueDraggable,
    ElxImgbox
  },
  props: {
    value: {
      default: '',
      type: [String, Array]
    },
    // 最大上传数量
    limit: {
      default: 9,
      type: Number
    },
    // false: 能对图片进行操作  true: 不能对图片进行操作
    disabled: {
      default: false,
      type: Boolean
    },
    modal: {
      default: true,
      type: Boolean
    },
    prompt: {
      default: true,
      type: Boolean
    }
  },
  watch: {
    value: function (newVal, oldVal) {
      this.getImgArr()
      // let res = []
      // if (this.value) {
      //   let imageArray = this.value.split(',')
      //   for (let i = 0; i < imageArray.length; i++) {
      //     res.push({ url: this.resourcesUrl + imageArray[i], response: imageArray[i] })
      //   }
      // }
      // this.imageList = res
    },
    imageList: function (newVal, oldVal) {
      let pics = this.imageList.map(file => {
        return file.response
      }).join(',')
      this.$emit('input', pics)
    }
  },
  mounted () {
    this.getImgArr()
  },
  methods: {
    /**
     * 将图片路径传入数组
     */
    getImgArr () {
      let res = []
      if (this.value && typeof (this.value) === 'string') {
        let imageArray = this.value.split(',')
        for (let i = 0; i < imageArray.length; i++) {
          if (imageArray[i]) {
            res.push({ url: this.getImgSrc(imageArray[i]), response: imageArray[i] })
          }
        }
      }
      this.imageList = res
    },
    /**
     * 获取图片路径
     */
    getImgSrc (img) {
      if (!img) {
        return ''
      }
      if (img.indexOf('http://') === 0 || img.indexOf('https://') === 0) {
        return img
      }
      return this.resourcesUrl + img
    },

    /**
     * 删除图片
     */
    handleRemove (index) {
      this.imageList.splice(index, 1)
      let pics = this.imageList.map(file => {
        return file.response
      }).join(',')
      this.$emit('input', pics)
    },
    /**
     * 放大图片
     */
    handlePictureCardPreview (imgUrl) {
      this.dialogImageUrl = imgUrl
      this.dialogVisible = true
    },
    onDragStart (e) {
      e.target.classList.add('hideShadow')
    },
    onDragEnd (e) {
      e.target.classList.remove('hideShadow')
    },
    /**
     * 打开图片选择窗
     */
    elxImgboxHandle () {
      let num = this.limit - this.imageList.length
      if (num < 1) {
        this.$message.error(this.$i18n.t('components.numHasReaLimit'))
        return
      }
      this.elxImgboxVisible = true
      this.$nextTick(() => {
        this.$refs.elxImgbox.init(2, num)
      })
    },
    /**
     * 接收回调的图片数据
     */
    refreshPic (imagePath) {
      let imageArray = imagePath.split(',')
      let pics = imageArray.map(img => {
        return img
      }).join(',')
      if (this.value) {
        // let picArray = imagePath.split(',')
        // console.log(picArray.length, this.value, !this.value)
        pics = this.value + ',' + pics
      }
      this.$emit('input', pics)
    }
  }
}
</script>

<style lang="scss" scope>
.mul-pic-upload {
  .upload-component {
    display: inline;
  }

  .el-upload--picture-card {
    border: 0;
  }
  .hideShadow {
    .el-upload-list__item-actions {
      display: none;
    }
  }
  .el-upload.el-upload--picture-card,
  .el-upload-list .el-upload-list--picture-card,
  .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
    border-radius: 2px;
  }
  .el-upload--picture-card {
    position: relative;
    background-color: #fff;
    .el-icon-plus {
      color: #dcdfe6;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
  .rightTop {
    position: absolute;
    right: 13px;
    top: -2px;
  }
}
</style>
<style scoped>
.dialogImage >>> .el-dialog__header {
  padding-bottom: 30px !important;
}
.dialogImage >>> .el-dialog__body {
  text-align: center;
}
.dialogImage img {
  display: inline-block;
  width: auto;
  height: auto;
  max-width: 100%;
}
</style>
