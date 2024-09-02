<template>
  <div class="micro-video-box">
    <!--预览区-->
    <div class="design-preview-controller">
      <div v-if="formData.imageList.length" class="ad-view-box">
        <div>
          <video controls autoplay style="width: 100%; height: 160px">
            <source
              v-for="(item, index) in formData.imageList"
              :key="index"
              :src="item.link"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
      <div v-else class="image-ad-view">
        <div class="image-ad-title">
          {{ $t("shopFeature.video.widthSuggest") }}
        </div>
      </div>
    </div>
    <!--编辑区-->
    <div v-show="isShowEdit" class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          {{ $t("shopFeature.video.video") }}
        </div>
        <div class="design-editor-component-container">
          <!-- 视频链接 -->
          <div class="image-ad-edit">
            <div style="width: 90px">
              {{ $t("shopFeature.video.videoSrc") }}
            </div>
            <el-input
              v-model="customPath"
              :placeholder="$i18n.t('shopFeature.video.titContent')"
              @blur="customPathCheck"
            >
            </el-input>
          </div>

          <!-- 视频属性设置 -->
          <div class="editVideo">
            <el-form ref="formData" label-width="100px" label-position="left">
              <el-form-item label="自动播放">
                <el-radio
                  v-for="(autoplayItem, autoplayIndex) in autoplay"
                  :key="autoplayIndex"
                  v-model="formData.autoplay"
                  :label="autoplayItem.label"
                  >{{ autoplayItem.title }}
                </el-radio>
              </el-form-item>
              <el-form-item label="显示控件">
                <el-radio
                  v-for="(showToolsItem, showToolsIndex) in showTools"
                  :key="showToolsIndex"
                  v-model="formData.showTools"
                  :label="showToolsItem.label"
                  >{{ showToolsItem.title }}
                </el-radio>
              </el-form-item>
              <el-form-item label="是否静音">
                <el-radio
                  v-for="(muteItem, muteIndex) in mute"
                  :key="muteIndex"
                  v-model="formData.mute"
                  :label="muteItem.label"
                  >{{ muteItem.title }}
                </el-radio>
              </el-form-item>
            </el-form>
          </div>

          <div class="chooseVideo">
            <!--选择已上传视频-->
            <div class="ad-add-image p-add-btn" @click="videoChoose">
              <i class="el-icon-plus" /> 选择已上传视频
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 视频弹窗 -->
    <video-box ref="videoBox" @refreshPic="refreshPic" />
  </div>
</template>
<script>
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import "../../directive/index";
import { microCreateMinis } from "../../minis";
import { SlickList, SlickItem, HandleDirective } from "vue-slicksort";
import draggable from "vuedraggable";
import ChooseFeature from "@/components/choose-feature/index.vue";
import videoBox from "@/components/VideoBox";

/** 图片广告 */
export default {
  name: "micro-image-ad-box",
  mixins: [microCreateMinis],
  directives: { handle: HandleDirective },
  data() {
    return {
      commonCheckFieldRules: "checkData", // 当前组件默认的规则判断函数
      customPath: "", // 视频地址
      formData: {
        imageList: [], // 视频列表
        autoplay: 1, // 自动播放
        showTools: 1, // 展示工具栏
        mute: 1,  // 静音
      },
      that: this,
      errorMessage: "", // 报错信息
      autoplay: [
        { label: 1, title: "是" },
        { label: 2, title: "否" },
      ],
      showTools: [
        { label: 1, title: "是" },
        { label: 2, title: "否" },
      ],
      mute: [
        { label: 1, title: "是" },
        { label: 2, title: "否" },
      ],
    };
  },
  watch: {},
  components: {
    draggable,
    SlickList,
    SlickItem,
    ChooseFeature,
    videoBox,
  },
  computed: {},
  mounted() {
    if (this.formData.imageList.length) {
      this.customPath = this.formData.imageList[0].link;
    }
  },
  methods: {
    // 选择已上传的视频
    videoChoose() {
      this.$nextTick(() => {
        this.$refs.videoBox.init(1, 10);
      });
    },
    // 选择视频地址回调
    refreshPic(videoPath) {
      this.customPath = process.env.VUE_APP_RESOURCES_URL + videoPath;
      // console.log(this.customPath,"视频地址")
      this.customPathCheck();
    },
    /**
     * 视频地址校验
     */
    customPathCheck() {
      if (!this.customPath.trim()) {
        this.$newMessage.error(
          this.$i18n.t("shopFeature.tabNav.pleaseFillThePath")
        );
        return;
      }
      this.formData.imageList.push({ link: this.customPath });
      // this.customPath = ''
    },
    checkData() {
      let isPass = true;
      let errorMessage = "";
      if (!this.formData.imageList.length) {
        isPass = false;
        errorMessage = this.$i18n.t("shopFeature.video.pleaseFillTit");
      }
      if (isPass) {
        this.myCheckResult(isPass);
      } else {
        // 弹窗提示错误消息
        this.showCheckForm();
        this.$newMessage.error(errorMessage);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
