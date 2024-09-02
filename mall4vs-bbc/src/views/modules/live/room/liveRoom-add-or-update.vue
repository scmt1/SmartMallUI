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
      <el-form-item :label="this.$i18n.t('live.liveRoomType')" prop="type">
        <el-radio v-model="dataForm.type" :label="0">{{$t("live.mobileLiveBroadcast")}}</el-radio>
<!--        <el-radio disabled v-model="dataForm.type" :label="1">{{$t("live.pushStream")}}</el-radio>-->
      </el-form-item>
      <el-form-item :label="this.$i18n.t('live.liveName')" prop="name">
        <el-input
          size="small"
          v-model="dataForm.name "
          :disabled="dataForm.id !== 0 "
          maxlength="17"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('live.anchorName')" prop="anchorName">
        <el-input
          size="small"
          v-model="dataForm.anchorName"
          maxlength="15"
          :disabled="dataForm.id !== 0 "
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('live.anchorWechat')" prop="anchorWechat">
        <el-input
          size="small"
          v-model="dataForm.anchorWechat"
          maxlength="20"
          :disabled="dataForm.id !== 0 "
          show-word-limit
        ></el-input>
        <span>{{$t("live.liveTip1")}}</span>
      </el-form-item>
      <!-- <el-form-item :label="直播的时间：" prop="dateRange">
        <el-date-picker
          v-model="dataForm.dateRange"
          type="datetimerange"
          :range-separator="this.$i18n.t('time.tip')"
          value-format="yyyy-MM-dd HH:mm:ss"
          :start-placeholder="this.$i18n.t('time.start')"
          :end-placeholder="this.$i18n.t('time.end')"
          :disabled="!!dataForm.seckillId"
        ></el-date-picker>
        <br />
        <span>开播时间需要在当前时间的10分钟后 并且开始时间不能在6个月后,开播时间和结束时间间隔不得短于30分钟，不得超过24小时</span>
      </el-form-item>-->
      <el-form-item :label="this.$i18n.t('live.liveTime')" class="liveTime">
        <el-col :span="7">
          <el-form-item prop="startTime" :rules="[{required: true, message: $t('publics.noNull')}]">
            <el-date-picker
              size="small"
              :disabled="dataForm.id !== 0 "
              v-model="dataForm.startTime"
              type="datetime"
              :placeholder="this.$i18n.t('live.chooseStartDate')"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="1">{{$t("time.tip")}}</el-col>
        <el-col :span="7">
          <el-form-item prop="endTime" :rules="[{required: true, message: $t('publics.noNull')}]">
            <el-date-picker
              v-model="dataForm.endTime"
              :disabled="dataForm.id !== 0 "
              type="datetime"
              :placeholder="this.$i18n.t('live.chooseEndDate')"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <br />
      </el-form-item>
      <el-form-item>
        <span>{{$t("live.liveTip2")}}</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('live.liveBackgroundImage')" prop="coverImg">
        <img-upload v-model="dataForm.coverImg" :maxSize="2" :disabled="dataForm.id !== 0 " />
        <span>{{$t("live.recommendedSize")}}：1080{{$t("live.pixel")}} * 1920{{$t("live.pixel")}}，{{$t("live.imageSizeCannot")}}2M</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('live.anchorSharingPicture')" prop="shareImg">
        <img-upload v-model="dataForm.shareImg" :maxSize="1" :disabled="dataForm.id !== 0 " />
        <span>{{$t("live.recommendedSize")}}：800{{$t("live.pixel")}} * 640{{$t("live.pixel")}}，{{$t("live.imageSizeCannot")}}1M。</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('live.liveCoverImage')" prop="feedsImg">
        <img-upload v-model="dataForm.feedsImg" :maxSize="0.1" :disabled="dataForm.id !== 0 " />
        <span>{{$t("live.recommendedSize")}}：{{$t("live.recomImaSizeIs")}} 800{{$t("live.pixel")}} * 800{{$t("live.pixel")}}，{{$t("live.imageSizeCannot")}}100KB。</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('live.isItIncluded')" prop="isFeedsPublic">
        <el-radio
          v-model="dataForm.isFeedsPublic"
          :label="1"
          :disabled="dataForm.id !== 0 "
        >{{$t("groups.turnOn")}}</el-radio>
        <el-radio
          v-model="dataForm.isFeedsPublic"
          :label="0"
          :disabled="dataForm.id !== 0 "
        >{{$t("station.close")}}</el-radio>
        <br />
        <span>{{$t("live.liveTip3")}}</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('live.wayOfDisplay')" prop="screenType">
        <el-radio
          v-model="dataForm.screenType"
          :label="0"
          :disabled="dataForm.id !== 0 "
        >{{$t("live.portrait")}}</el-radio>
        <el-radio v-model="dataForm.screenType" :label="1" disabled>{{$t("live.horizontalScreen")}}</el-radio>
        <!-- :disabled="dataForm.id !== 0 ||" -->
      </el-form-item>
      <el-form-item :label="this.$i18n.t('live.liveRoomFunction')" prop="closeLike">
        <el-checkbox v-model="closeLike" :disabled="dataForm.id !== 0 ">{{$t("live.like")}}</el-checkbox>
        <el-checkbox v-model="closeComment" :disabled="dataForm.id !== 0 ">{{$t("live.comment")}}</el-checkbox>
        <el-checkbox
          v-model="closeGoods"
          :disabled="dataForm.id !== 0 "
        >{{$t("live.merchandiseShelf")}}</el-checkbox>
        <br />
        <el-checkbox v-model="closeReplay" :disabled="dataForm.id !== 0 ">{{$t("live.replay")}}</el-checkbox>
        <el-checkbox v-model="closeShare" :disabled="dataForm.id !== 0 ">{{$t("live.share")}}</el-checkbox>
        <el-checkbox v-model="closeKf" :disabled="dataForm.id !== 0 ">{{$t("live.customerService")}}</el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div
        v-if="!dataForm.id"
        class="default-btn primary-btn"
        @click="dataFormSubmit()"
      >{{$t("crud.filter.submitBtn")}}</div>
      <div
        v-if="dataForm.id"
        class="default-btn primary-btn"
        @click="closeInfo()"
      >{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>

<script>
import ImgUpload from '@/components/img-upload'

export default {
  data () {
    return {
      visible: false,
      isSubmit: false,
      dataForm: {
        id: null,
        roomId: null,
        name: null,
        anchorName: null,
        anchorWechat: null,
        coverImg: null,
        shareImg: null,
        feedsImg: null,
        isFeedsPublic: 1,
        type: 0,
        screenType: 0,
        closeLike: true,
        closeGoods: true,
        closeComment: true,
        closeReplay: true,
        closeShare: false,
        closeKf: false,
        roomToolsVo: {
          closeLike: 0,
          closeGoods: 0,
          closeComment: 0,
          closeReplay: 0,
          closeShare: 0,
          closeKf: 0
        },
        dateRange: [],
        liveStatus: null,
        startTime: null,
        endTime: null,
        applyTime: null
      },
      closeLike: true,
      closeGoods: true,
      closeComment: true,
      closeReplay: true,
      closeShare: false,
      closeKf: false,
      dataRule: {
        name: [
          { required: true, message: this.$i18n.t('live.liveRoomNameCannotBeEmpty'), trigger: 'blur' }
        ],
        anchorName: [
          { required: true, message: this.$i18n.t('live.anchoBeEmp'), trigger: 'blur' }
        ],
        anchorWechat: [
          { required: true, message: this.$i18n.t('live.anchorWeChatBeEmp'), trigger: 'blur' }
        ],
        coverImg: [
          { required: true, message: this.$i18n.t('live.backEmpty'), trigger: 'blur' }
        ],
        shareImg: [
          { required: true, message: this.$i18n.t('live.hostSnPict'), trigger: 'blur' }
        ],
        feedsImg: [
          { required: true, message: this.$i18n.t('live.liveEmpty'), trigger: 'blur' }
        ],
        dateRange: [
          { required: true, message: this.$i18n.t('live.liveBy'), trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    ImgUpload
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.closeLike = true
      this.closeGoods = true
      this.closeComment = true
      this.closeReplay = true
      this.closeShare = false
      this.closeKf = false
      this.visible = true
      this.isSubmit = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        console.log(this.dataForm)
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl('/multishop/live/liveRoom/info/' + this.dataForm.id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
            if (data.roomToolsVo != null) {
              this.closeLike = data.roomToolsVo.closeLike === 0
              this.closeGoods = data.roomToolsVo.closeGoods === 0
              this.closeComment = data.roomToolsVo.closeComment === 0
              this.closeReplay = data.roomToolsVo.closeReplay === 0
              this.closeShare = data.roomToolsVo.closeShare === 0
              this.closeKf = data.roomToolsVo.closeKf === 0
            }
          })
        }
      })
    },
    // 关闭窗口
    closeInfo () {
      this.visible = false
      this.$emit('refreshDataList')
    },
    // 表单提交
    dataFormSubmit () {
      this.dataForm.roomToolsVo.closeLike = this.closeLike ? 0 : 1
      this.dataForm.roomToolsVo.closeGoods = this.closeGoods ? 0 : 1
      this.dataForm.roomToolsVo.closeComment = this.closeComment ? 0 : 1
      this.dataForm.roomToolsVo.closeReplay = this.closeReplay ? 0 : 1
      this.dataForm.roomToolsVo.closeShare = this.closeShare ? 0 : 1
      this.dataForm.roomToolsVo.closeKf = this.closeKf ? 0 : 1
      // this.dataForm.startTime = this.dataForm.dateRange[0]
      // this.dataForm.endTime = this.dataForm.dateRange[1]
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/multishop/live/liveRoom'),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.isSubmit = true
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => {
            console.log('boom')
            this.isSubmit = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.time-tips {
  font: 14px;
  margin-top: 300px;
  margin-left: 120px;
  margin-bottom: 120px;
}
.liveTime ::v-deep .el-form-item__label:before{
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}
</style>
