<template>
  <el-dialog
    :title="!dataForm.id ? this.$i18n.t('brand.add') : this.$i18n.t('brand.revise')"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <!-- <el-form-item label="直播间信息" prop="id">
        <el-input v-model="dataForm.id"></el-input>
      </el-form-item>
      <el-form-item label="微信直播间id" prop="roomId">
        <el-input v-model="dataForm.roomId"></el-input>
      </el-form-item>-->
      <el-form-item
        :label="this.$i18n.t('liveAddOrUpdate.liveRoomType') + ' 1.' + this.$i18n.t('liveAddOrUpdate.pushStream') + ' 2.' + this.$i18n.t('liveAddOrUpdate.mobileLiveBroadcast')"
        prop="type"
      >
        <!-- <el-input v-model="dataForm.type"></el-input> -->
        <el-radio
          disabled
          v-model="dataForm.type"
          :label="this.$i18n.t('brand.disable')"
        >{{$t('liveAddOrUpdate.pushStream')}}</el-radio>
        <el-radio
          disabled
          v-model="dataForm.type"
          :label="this.$i18n.t('liveAddOrUpdate.checkedAndDisabled')"
        >{{$t('liveAddOrUpdate.mobileLiveBroadcast')}}</el-radio>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('liveRoom.roomName')" prop="name">
        <el-input v-model="dataForm.name"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('liveRoom.anchorNickname')" prop="anchorname">
        <el-input v-model="dataForm.anchorname"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('liveRoom.anchorWechat')" prop="anchorWechar">
        <el-input v-model="dataForm.anchorWechar"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('liveAddOrUpdate.liveBackgroundImage')" prop="coverImg">
        <el-input v-model="dataForm.coverImg"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('liveAddOrUpdate.anchorSharingPicture')" prop="shareImg">
        <el-input v-model="dataForm.shareImg"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('liveAddOrUpdate.OfficialBackgroundImg')" prop="feedsImg">
        <el-input v-model="dataForm.feedsImg"></el-input>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('liveAddOrUpdate.whetherOpenOfficialCollection')"
        prop="isFeedsPublic"
      >
        <el-input v-model="dataForm.isFeedsPublic"></el-input>
      </el-form-item>
      <el-form-item
        :label="'1.' + this.$i18n.t('liveAddOrUpdate.portrait') + '2.' + this.$i18n.t('liveAddOrUpdate.horizontalScreen')"
        prop="screenType"
      >
        <el-input v-model="dataForm.screenType"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('liveAddOrUpdate.closeLikes')" prop="closeLike">
        <el-input v-model="dataForm.closeLike"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('liveAddOrUpdate.whetherCloseShelf')" prop="closeGoods">
        <el-input v-model="dataForm.closeGoods"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('liveAddOrUpdate.WhetherCloseCom')" prop="closeComment">
        <el-input v-model="dataForm.closeComment"></el-input>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('liveAddOrUpdate.WhetherClosePlayback')"
        prop="closeReplay"
      >
        <el-input v-model="dataForm.closeReplay"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('liveAddOrUpdate.WhetherCloseShare')" prop="closeShare">
        <el-input v-model="dataForm.closeShare"></el-input>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('liveRoom.liveRoomStatus') + '101：'+this.$i18n.t('liveAddOrUpdate.live') + '102：' + this.$i18n.t('groups.hasNotStarted') + '103：' + this.$i18n.t('groups.over') + '104：' + this.$i18n.t('liveRoom.prohibitPlay') + '105：' + this.$i18n.t('liveRoom.suspend') + '106：' + this.$i18n.t('liveRoom.abnormal') + '107：' +  + this.$i18n.t('liveRoom.expired')"
        prop="liveStatus"
      >
        <!-- label="直播间状态。101：直播中，102：未开始，103已结束，104禁播，105：暂停，106：异常，107：已过期" -->
        <el-input v-model="dataForm.liveStatus"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('liveRoom.LiveStartTime')" prop="startTime">
        <el-input v-model="dataForm.startTime"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('liveRoom.LiveOverTime')" prop="endTime">
        <el-input v-model="dataForm.endTime"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.applicationTime')" prop="applyTime">
        <el-input v-model="dataForm.applyTime"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('remindPop.confirm')}}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: null,
        roomId: null,
        name: null,
        anchorname: null,
        anchorWechar: null,
        coverImg: null,
        shareImg: null,
        feedsImg: null,
        isFeedsPublic: null,
        type: null,
        screenType: null,
        closeLike: null,
        closeGoods: null,
        closeComment: null,
        closeReplay: null,
        closeShare: null,
        liveStatus: null,
        startTime: null,
        endTime: null,
        applyTime: null
      },
      dataRule: {
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl('/live/liveRoom/info/' + this.dataForm.id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/live/liveRoom'),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('remindPop.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    }
  }
}
</script>
