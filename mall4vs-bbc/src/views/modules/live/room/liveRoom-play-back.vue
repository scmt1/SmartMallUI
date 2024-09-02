<template>
  <el-dialog
    :title="!dataForm.id ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <!-- <el-form-item label="直播间类型：" prop="type">
        <el-radio v-model="dataForm.type" :label="0">手机直播</el-radio>
        <el-radio disabled v-model="dataForm.type" :label="1">推流</el-radio>
        http://1258344707.vod2.myqcloud.com/1b87576bvodcq1258344707/b59719235285890806405400239/playlist_eof.m3u8
      </el-form-item>-->
      <el-form-item :label="this.$i18n.t('live.liveRoomPlayback')" prop="name">
        <!-- <video-upload v-model="dataForm.mediaUrl" /> -->
        <!--  -->
        <video
          id="my-video"
          class="video-js vjs-default-skin"
          controls
          preload="auto"
          width="500px"
        >
          {{$t("live.notSuppPlay")}}
          <source :src="dataForm.mediaUrl" type="application/x-mpegURL" />
        </video>
        <!-- <el-button type="primary" @click="checkVideo()">点击播放</el-button> -->
        <!-- <video class="video-js" controls="controls" muted>
          {{$t("live.notSuppPlay")}}
          <source src="http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8" type="application/x-mpegURL" />
        </video>-->
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import videojs from 'video.js'
import videoContrib from 'videojs-contrib-hls'
import 'video.js/dist/video-js.css'
export default {
  data () {
    return {
      visible: false,
      confirm: false,
      dataForm: {
        mediaUrl: null,
        id: null
      },
      dataRule: {
      }
    }
  },
  components: {
    videojs,
    videoContrib
  },
  mounted () {
    let _that = this
    setTimeout(() => {
      _that.getVideo()
    }, 100)
  },
  methods: {
    init (id) {
      // this.getVideo()
      this.dataForm.mediaUrl = ''
      this.confirm = false
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl('/multishop/live/liveRoom/getPlayBack/' + this.dataForm.id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
          })
        }
      })
    },
    getVideo () {
      videojs('my-video', {
        bigPlayButton: false,
        textTrackDisplay: false,
        posterImage: true,
        errorDisplay: false,
        controlBar: true
      }, function () {
        let _that = this
        setTimeout(() => {
          _that.play()
        }, 10)
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.visible = false
      this.$emit('refreshDataList')
    }
  }
}
</script>
