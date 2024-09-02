<template>
  <div class="micro-title-text">
    <div class="design-preview-controller">
      <div class="title-text-content"
           :style="{textAlign:formData.align}">
        <div style="display: flex;" :style="{justifyContent: formData.align}">
          <div class="title-left-line" :style="{background:formData.titleLeftLineColor}" v-if="formData.titleLeftLine == 'true'"></div>
          <div class="title-text-title"
               :style="{fontSize:formData.titleSize+'px',fontWeight:formData.titleWeight,marginRight:formData.subtitle ? '10px' : ''}">
            {{ formData.title }}
          </div>
          <div class="subtitle-line" v-if="formData.subtitle"></div>
          <div class="subTitle-text-title"
               :style="{fontSize:formData.subTitleSize+'px',fontWeight:formData.subTitleWeight}">
            {{ formData.subtitle }}
          </div>
        </div>
        <div class="show-more"
             v-if="formData.isLink">
          <span v-if="formData.linkStyle!==3">{{formData.linkText}} </span>
          <i class="el-icon-arrow-right"
             v-if="formData.linkStyle!==1"></i>
        </div>
        <div class="title-text-desc"
             :style="{fontSize:formData.descSize+'px',fontWeight:formData.descWeight}"
             v-if="formData.desc">
          {{ formData.desc }}
        </div>
      </div>
    </div>
    <div v-show="isShowEdit"
         class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <div class="design-editor-component-title">{{$t('shopFeature.titText.titText')}}</div>
        <div class="design-editor-component-container">
          <el-form ref="formData"
                   class="edit-form"
                   :model="formData"
                   size="small">
            <el-form-item :label="$i18n.t('shopFeature.titText.titContent')"
                          prop="title"
                          :rules="rules.title">
              <el-input v-model="formData.title"
                        :placeholder="$i18n.t('shopFeature.titText.titContent')" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.titText.subtitle')"
                          prop="subtitle">
              <el-input v-model="formData.subtitle"
                        :placeholder="$i18n.t('shopFeature.titText.subtitle')" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.titText.decsContent')">
              <el-input type="textarea"
                        v-model="formData.desc"
                        maxlength="100"
                        :rows="3"
                        :placeholder="$i18n.t('shopFeature.titText.decsContentPlaceholder')"></el-input>
            </el-form-item>
            <el-form-item label="标题左侧竖线是否显示">
              <el-radio-group v-model="formData.titleLeftLine">
                <el-radio label="false">否</el-radio>
                <el-radio label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="竖线颜色" v-if="formData.titleLeftLine == 'true'">
              <el-color-picker v-model="formData.titleLeftLineColor"/>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.titText.showPos')">
              <el-radio-group v-model="formData.align">
                <el-radio label="left">{{$t('shopFeature.titText.left')}}</el-radio>
                <el-radio label="center">{{$t('shopFeature.titText.center')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.titText.titSize')">
              <el-radio-group v-model="formData.titleSize">
                <el-radio label="12">12px</el-radio>
                <el-radio label="14">14px</el-radio>
                <el-radio label="16">16px</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.titText.titWeight')">
              <el-radio-group v-model="formData.titleWeight">
                <el-radio label="500">{{$t('shopFeature.titText.normal')}}</el-radio>
                <el-radio label="600">{{$t('shopFeature.titText.bold')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.titText.subTitSize')">
              <el-radio-group v-model="formData.subTitleSize">
                <el-radio label="12">12px</el-radio>
                <el-radio label="14">14px</el-radio>
                <el-radio label="16">16px</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.titText.subTitWeight')">
              <el-radio-group v-model="formData.subTitleWeight">
                <el-radio label="500">{{$t('shopFeature.titText.normal')}}</el-radio>
                <el-radio label="600">{{$t('shopFeature.titText.bold')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.titText.descWeight')">
              <el-radio-group v-model="formData.descWeight">
                <el-radio label="500">{{$t('shopFeature.titText.normal')}}</el-radio>
                <el-radio label="600">{{$t('shopFeature.titText.bold')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.titText.linkText')">
              <div class="view-more-item">
                <el-checkbox v-model="formData.isLink" />
              </div>
            </el-form-item>
            <div v-if="formData.isLink"
                 class="btn-style">
              <div class="btn-styles-con">
                <el-radio v-for="(item,index) in 3"
                          :key="index"
                          v-model="formData.linkStyle"
                          :label="item">
                  {{$t('shopFeature.titText.style')}}{{ item }}
                </el-radio>
              </div>
              <div class="btn-type-input"
                   v-if="formData.linkStyle!==3">
                <div class="item-label">
                  {{$t('shopFeature.titText.textContent')}}
                </div>
                <el-form-item prop="linkText"
                              style="margin-bottom: 0;"
                              :rules="{
              required: true, message: $i18n.t('shopFeature.titText.pleaseFillTextContent'), trigger: 'blur'}">
                  <el-input v-model="formData.linkText"
                            style="width: 242px"
                            :placeholder="$i18n.t('shopFeature.titText.more')"
                            maxlength="20"></el-input>
                </el-form-item>

              </div>
              <div class="btn-type-input">
                <div class="item-label">
                  {{$t('shopFeature.tabNav.routeLink')}}
                </div>
                <redirect-nav
                  :selectedLink="formData.path.name"
                  :placeholder="$t('pcdecorate.placeholder.link')"
                  style="width:calc(100% - 100px)"
                  @handleNavSelect="handleNavSelect"
                  @handleRemoveSelected="handleRemoveSelected">
                </redirect-nav>
                <!-- <el-select v-model="formData.link.type" placeholder="请选择" @change="handleLinkTypeChange">
                  <el-option
                    v-for="linkItem in linkList"
                    :key="linkItem.title"
                    :label="linkItem.title"
                    :value="linkItem.type">
                    <span style="float: left">{{ linkItem.title }}</span>
                  </el-option>
                </el-select> -->

                <!-- <el-dropdown trigger="click"
                            size="small"
                            @command="command">
                  <div class="cursor">
                    <span class="type-sign">{{ formData.link.type ? linkList[formData.link.type-1].title :  $t('shopFeature.tabNav.choose')}}
                      <i class="el-icon-close" v-if="formData.link.type" @click.stop="resetLink"></i>
                    </span>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(linkItem,linkIndex) in linkList"
                                    :key="linkIndex"
                                    :command="({linkItem,currentEditIndex:linkIndex})">
                      <span style="font-size: 12px;">{{ linkItem.title }}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
              </div>
              <!-- <div class="btn-type-input"
                   style="margin-top: 10px;"
                   v-if="formData.link.type === 4 || formData.link.type === 1">
                <div class="item-label">
                  {{ formData.link.type === 4 ? '路径': '已选商品' }}
                </div>
                <div v-if="formData.link.type===1" class="goods-name" @click.stop="reChooseProd">{{ formData.link.title ||  $t('shopFeature.tabNav.choose') }} </div>
                <div v-if="formData.link.type===4" class="goods-name" @click.stop="showPathInputDialog=true">{{ formData.link.link }} </div>
              </div> -->
            </div>
          </el-form>
        </div>

      </div>
    </div>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialogVisible="dialogVisible"
      :deviceType="'mobile'"
      :currentSelectType="[1, 2, 3, 4, 5, 6, 7]"
      @handleClose="handleDialogClose"
      @handleDialogSubmit="handleDialogSubmit">
    </decorate-dialog-select>
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    <!-- 商品选择弹窗  -->
    <prods-select v-if="dialogChooseGoods"
                  ref="ProdsSelect"
                  :isSingle="true"
                  @refreshSelectProds="chooseGoodsFun"></prods-select>
    <!-- 弹窗: 输入自定义路径 -->
    <el-dialog custom-class="up-dialog" :title="$i18n.t('shopFeature.tabNav.customPath')" width="40%" top="30vh" :visible.sync="showPathInputDialog">
      <div class="custom-path-con">
        <span>{{$t('shopFeature.tabNav.routeLink')}}</span>
        <el-input style="margin-rigth: 10px;" :placeholder="$i18n.t('shopFeature.tabNav.pleaseFillThePath')" size="small" v-model="customPath">

        </el-input>
      </div>
      <div slot="footer" style="text-align: right;">
        <el-button size="mini"
                    type="primary"
                    @click="customPathComfirm">{{$t('shopFeature.tabNav.confirm')}}</el-button>
        <el-button size="mini"
                    @click="customPathCancel">{{$t('shopFeature.tabNav.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {microCreateMinis} from '../../minis'
import ProdsSelect from '@/components/prods-select'
import redirectNav from '../../../../../decorate/create/commonComponent/redirectNav/index.vue';
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue'; // 选择商品
export default {
  name: 'micro-title-text',
  mixins: [microCreateMinis],
  props: {
    current: {
      type: Number
    }
  },
  data () {
    var validateTitle = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('shopFeature.titText.pleaseFillTit')))
      } else {
        callback()
      }
    }
    return {
      formData: {
        title: '', // 标题
        subtitle: '', //副标题
        desc: '', // 描述
        align: 'left', // 显示位置
        titleLeftLine: 'false', //标题左侧竖线
        titleLeftLineColor: '#CACFE0', //标题左侧竖线颜色
        titleSize: '12', // 标题大小
        subTitleSize: '12', // 副标题大小
        descSize: '12',
        titleWeight: '500',
        subTitleWeight: '500', // 副标题粗细
        descWeight: '500',
        // show_divider: 1,
        isLink: 0,
        linkStyle: 1,
        linkText: this.$i18n.t('shopFeature.titText.linkText'),
        // link: {}
        path: {
          name: '',
          link: '',
          type: ''
        }
      },
      commandInfo: {},
      linkList: [
        {
          type: 1,
          title: this.$i18n.t('shopFeature.titText.prodDet'),
          link: ''
        },
        {
          type: 2,
          title: this.$i18n.t('shopFeature.tabNav.cart'),
          link: ''
        },
        {
          type: 3,
          title: this.$i18n.t('shopFeature.tabNav.personalCenter'),
          link: ''
        },
        {
          type: 4,
          title: this.$i18n.t('shopFeature.tabNav.customPath'),
          link: ''
        }
      ],
      rules: {
        title: [
          {required: true, message: this.$i18n.t('shopFeature.titText.pleaseFillTit'), trigger: 'blur'},
          {validator: validateTitle, trigger: 'blur'}
        ]
      },
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      dialogChooseGoods: false, // 商品选择弹窗显隐
      errorTitle: '',   // 错误提示信息
      currentItem: {},
      customPath: '', // 自定义路径
      showPathInputDialog: false, // 自定义路径输入弹窗
      dialogVisible: false, // 商品弹窗是否显示
    }
  },
  watch: {},
  components: {
    ProdsSelect,
    redirectNav,
    decorateDialogSelect
  },
  computed: {},
  mounted () {
  },
  methods: {
    handleLinkTypeChange (linkType) {
      const linkItem = this.linkList.find(el => el.type === linkType)
      this.$set(this.formData.link, linkItem)
      if (linkType === 1) {
        this.currentItem = linkItem
        this.dialogChooseGoods = true
        this.$nextTick(() => {
          this.$refs.ProdsSelect.init()
        })
        return
      }
      if (linkType === 4) {
        this.showPathInputDialog = true
      }
    },
    // 查看更多链接选择
    handleNavSelect() {
      this.dialogVisible = true;
    },
    // 删除查看更多选中
    handleRemoveSelected() {
      this.formData.path.name = '';
      this.formData.path.link = '';
      this.formData.path.type = '';
    },
    // 商品弹窗关闭
    handleDialogClose() {
      this.dialogVisible = false;
    },
    // 弹窗确定
    handleDialogSubmit({ type, value }) {
      if(type === '1') { // 当前选择的是商品
        this.$set(this.formData.path, 'name', value.goodsItem.prodName);
        this.$set(this.formData.path, 'link', value.goodsItem.prodId);
        this.$set(this.formData.path, 'type', '1');
      } else if(type === '2') { // 当前选择的是分类
        this.$set(this.formData.path, 'name', value.categoryItem.label);
        this.$set(this.formData.path, 'link', value.categoryItem.data);
        this.$set(this.formData.path, 'type', '2');
      } else if(type === '3') {
        this.$set(this.formData.path, 'name', value.storeItem.shopName);
        this.$set(this.formData.path, 'link', value.storeItem.shopId);
        this.$set(this.formData.path, 'type', '3');
      } else if(type === '4') { // 当前选择的是页面
        this.$set(this.formData.path, 'name', value.pageItem.title);
        this.$set(this.formData.path, 'link', value.pageItem.link);
        this.$set(this.formData.path, 'type', '4');
      } else if(type === '5') { // 当前选择的是微页面
        this.$set(this.formData.path, 'name', value.smallPageItem.name);
        this.$set(this.formData.path, 'link', value.smallPageItem.renovationId);
        this.$set(this.formData.path, 'type', '5');
      } else if(type === '6') { // 自定义链接
        this.$set(this.formData.path, 'name', value.customLink);
        this.$set(this.formData.path, 'link', value.customLink);
        this.$set(this.formData.path, 'type', '6');
      } else if(type === '7') { // 当前选择的是优惠券
        this.$set(this.formData.path, 'name', value.couponItem.couponName);
        this.$set(this.formData.path, 'link', value.couponItem.couponId);
        this.$set(this.formData.path, 'type', '7');
      }
      this.dialogVisible = false;
    },
    /** 选择跳转路径 */
    command (eve) {
      if (eve.linkItem.type === 1) {
        this.currentItem = eve.linkItem
        this.dialogChooseGoods = true
        this.$nextTick(() => {
          this.$refs.ProdsSelect.init()
        })
        return
      }
      if (eve.linkItem.type === 4) {
        this.showPathInputDialog = true
        return
      }
      this.formData.link = eve.linkItem
    },

    /**
     * 自定义路径弹窗确认
     */
    customPathComfirm () {
      if (!this.customPath.trim()) {
        this.$newMessage.error(this.$i18n.t('shopFeature.tabNav.pleaseFillThePath'))
        return
      }
      this.setLinkInfo({
        link: this.customPath,
        type: 4
      })
      this.showPathInputDialog = false
      this.customPath = ''
    },
    /**
     * 自定义路径弹窗取消
     */
    customPathCancel () {
      this.showPathInputDialog = false
    },
    // 选择商品回调
    chooseGoodsFun ($event) {
      this.formData.link = this.currentItem
      this.setLinkInfo({
        title: $event.prodName,
        link: $event.prodId,
        type: 1
      })
      this.dialogChooseGoods = false
    },
    /**
     * 重新选择商品
     */
    reChooseProd () {
      this.dialogChooseGoods = true
      this.$nextTick(() => {
        this.$refs.ProdsSelect.init()
      })
    },
    /** 设置跳转信息 */
    setLinkInfo (obj) {
      this.formData.link = obj
      if (!obj && this.customPath) this.formData.link.link = this.customPath
      this.$forceUpdate()
    },
    /**
     * 重置跳转信息
     */
    resetLink () {
      this.formData.link = ''
    },
    /**
     * 开始验证
     **/
    checkData () {
      let isPass = true
      let errorMessage = ''
      if (this.formData.title.trim() === '') {
        isPass = false
        errorMessage = this.$i18n.t('shopFeature.titText.titText') + this.current + this.$i18n.t('shopFeature.titText.pleaseFillTit')
      }
      if (this.formData.isLink) {
        if (this.formData.linkStyle !== 3 && !this.formData.linkText.trim()) {
          isPass = false
          errorMessage = this.$i18n.t('shopFeature.titText.titText') + this.current + this.$i18n.t('shopFeature.titText.pleaseFillTextContent')
        } else if(this.formData.path.name === '') {
          isPass = false
          errorMessage = this.$i18n.t('shopFeature.titText.titText') + this.current + this.$i18n.t('shopFeature.tabNav.pleaseChooseRouteLink')
        }
      }
      if (isPass) {
        this.myCheckResult(isPass)
      } else {
        // 弹窗提示错误消息
        this.showCheckForm()
        this.$newMessage.error(errorMessage)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
