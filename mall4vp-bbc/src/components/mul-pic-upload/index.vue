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
        v-for="item in imageList"
        :key="item.uid"
        tabindex="0"
        class="el-upload-list__item is-success"
      >
        <img :src="item.url" alt class="el-upload-list__item-thumbnail" />
        <a class="el-upload-list__item-name">
          <i class="el-icon-document"></i>
        </a>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-check"></i>
        </label>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview">
            <i class="el-icon-zoom-in" @click="handlePictureCardPreview(item.url)"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(item.url)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </li>
      <li class="el-upload-list__item">
        <el-upload
          :action="$http.adornUrl('/admin/file/upload/img')"
          :headers="{Authorization: $cookie.get('Authorization_vp'),locale:lang}"
          list-type="picture-card"
          :limit="limit"
          :file-list="imageList"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </li>
    </vue-draggable>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import VueDraggable from 'vuedraggable'
import imageCompression from 'browser-image-compression'
export default {
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      lang: localStorage.getItem('lang') || 'zh_CN',
      imageList: []
    }
  },
  components: {
    VueDraggable
  },
  props: {
    value: {
      default: '',
      type: String
    },
    // 最大上传数量
    limit: {
      default: 6,
      type: Number
    }
  },
  watch: {
    value: function (newVal, oldVal) {
      let res = []
      if (this.value) {
        let imageArray = this.value.split(',')
        for (let i = 0; i < imageArray.length; i++) {
          res.push({ url: this.resourcesUrl + imageArray[i], response: imageArray[i] })
        }
      }
      this.imageList = res
    },
    imageList: function (newVal, oldVal) {
      let pics = this.imageList.map(file => {
        return file.response
      }).join(',')
      this.$emit('input', pics)
    }
  },
  methods: {
    // 图片上传
    handleUploadSuccess (response, file, fileList) {
      let pics = fileList.map(file => {
        return file.response
      }).join(',')
      this.$emit('input', pics)
    },
    // 限制图片上传大小
    async beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        try {
          const resultBlob = await imageCompression(file, {
            maxSizeMB: 2 // 压缩大小
          })
          const fs = new File([resultBlob], file.name, {
            type: file.type
          })
          return fs
        } catch (error) {
          return Promise().reject()
        }
        // this.$message.error('上传图片大小不能超过 2MB!')
      }
      return true
    },
    handleRemove (imgUrl) {
      this.imageList.splice(this.imageList.indexOf(imgUrl), 1)

      let pics = this.imageList.map(file => {
        return file.response
      }).join(',')
      this.$emit('input', pics)
    },
    handlePictureCardPreview (imgUrl) {
      this.dialogImageUrl = imgUrl
      this.dialogVisible = true
    },
    onDragStart (e) {
      e.target.classList.add('hideShadow')
    },
    onDragEnd (e) {
      e.target.classList.remove('hideShadow')
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
}
</style>
