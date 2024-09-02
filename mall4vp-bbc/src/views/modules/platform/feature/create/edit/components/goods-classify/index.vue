<template>
  <div class="micro-goods-box">
    <div class="design-preview-controller">
      <div class="goods-classify">
        <template v-if="formData.categorys.length">
          <!--文本-->
          <div class="nav-list">
            <div class="nav-item-item"
                 v-for="(item,index) in formData.categorys"
                 :key="index">
              <span class="text_title">{{item.title}}</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="isShowEdit"
         class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <div class="design-editor-component-title">分类</div>
        <div style="padding: 10px;">分类店铺 : {{formData.shopNames}}</div>
        <div class="default-btn" @click="shopsSelectHandle()">店铺选择</div>
        <!--选择分类-->
        <div class="design-editor-component-container">
          <!-- 各个导航分类 -->
          <div class="tab-nav-set-item" :style="{borderColor:errIndex===index ? '#f56c6c': '#eee'}"
               v-for="(item,index) in formData.categorys"
               :key="index">
            <div class="set-box">
              <!-- 标题信息 -->
              <div class="set-info">
                <div class="set-item-title">
                  <span>标题</span>
                  <el-input maxlength="25"
                    size="mini"
                    style="width: 274px"
                    placeholder="请输入标题"
                    v-model="item.title">
                  </el-input>
                </div>
                <div class="set-item-title">
                  <span>链接</span>
                  <div style="width: 274px">
                    <redirect-nav
                      :selectedLink="item.path && item.path.name"
                      placeholder="请选择跳转链接"
                      @handleNavSelect="handleNavSelect(item, index)"
                      @handleRemoveSelected="handleRemoveSelected(item, index)">
                    </redirect-nav>
                  </div>
                </div>
              </div>
            </div>
            <i class="el-icon-close set-close" @click="formData.categorys.splice(index,1)"></i>
          </div>
          <div class="p-add-btn" @click="addNav">{{$t('shopFeature.tabNav.addNav')}}</div>
        </div>
      </div>
    </div>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
        :dialogVisible="dialogVisible"
        :deviceType="'mobile'"
        :currentSelectType="[2]"
        @handleClose="handleDialogClose"
        @handleDialogSubmit="handleDialogSubmit">
    </decorate-dialog-select>
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    <shop-select v-if="shopsSelectVisible" ref="shopsSelect" @refreshSelectShops="selectCouponShops"></shop-select>
  </div>
</template>
<script>
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import { microCreateMinis } from '../../minis'
import redirectNav from '../../../../../decorate/create/commonComponent/redirectNav/index'
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue'; // 选择商品
import ShopSelect from '@/components/shop-selection'
/** 商品组件 */
export default {
  name: 'micro-goods-box',
  mixins: [microCreateMinis],
  data () {
    return {
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      dialogVisible:false,
      formData: {
        shopNames:'',
        shopIds:[],
        categorys: [],
        shopList:[]
      },
      currentNavIndex: 0, // 当前操作导航
      errIndex:'', // 信息不完整的导航项的索引
      shopsSelectVisible:false,
    }
  },
  props: {
    current: {
      type: Number
    }
  },
  watch: {

  },
  components: {
    redirectNav,
    decorateDialogSelect,
    ShopSelect
  },
  computed: {
    theme () {
      return this.$store.getters.theme
    }
  },
  mounted () {
    if (!this.formData.categorys.length) {
      this.formData.categorys = [
        {
          title:'全部',
          path:{
            type:'2',
            link:'',
            name:''
          }
        }
      ]
    }
    if(!this.formData.shopIds.length){
      this.formData.shopIds = []
    }
    if(!this.formData.shopList.length){
      this.formData.shopList = []
    }
    if(!this.formData.shopNames){
      this.formData.shopNames = ""
    }
  },
  methods: {
    // 添加指定店铺
    selectCouponShops (shops) {
      if (shops) {
        let shopNames = shops.map(item => {
          return item.shopName
        })
        this.formData.shopNames = shopNames.join(",")
        let shopIds = shops.map(item => {
          return item.shopId
        })
        this.formData.shopIds = shopIds
        this.formData.shopList = shops
      }
    },
    // 显示添加指定商品弹框
    shopsSelectHandle () {
      this.shopsSelectVisible= true
      this.$nextTick(() => {
        this.$refs.shopsSelect.init(this.formData.shopList)
      })
    },
    /** 添加分类 */
    addNav () {
      this.formData.categorys.push({
        title: '', // nav 标题
        path: {
          type: '',
          name: '',
          link: ''
        }
      })
    },
    // 选择跳转路径
    handleNavSelect(item, index) {
      this.dialogVisible = true;
      this.currentNavIndex = index;
    },
    // 删除跳转路径
    handleRemoveSelected(item, index) {
      this.formData.categorys[index].path.type = '';
      this.formData.categorys[index].path.link = '';
      this.formData.categorys[index].path.name = '';
    },
    // 分类弹窗关闭
    handleDialogClose() {
      this.dialogVisible = false;
    },
    // 商品弹窗确定
    handleDialogSubmit({type, value}) {
      if(type === '2') { // 当前选择的是分类
        this.$set(this.formData.categorys[this.currentNavIndex].path, 'name', value.categoryItem.label);
        this.$set(this.formData.categorys[this.currentNavIndex].path, 'link', value.categoryItem.data);
        this.$set(this.formData.categorys[this.currentNavIndex].path, 'type', '2');
      }
      this.dialogVisible = false;
    },
    /**
     * 开始验证
     * */
    checkData () {
      let isPass = true
      let errorMessage = ''
      if (!this.formData.categorys.length) {
        isPass = false
        errorMessage = '请添加分类'
      } else {
        for (let index = 0; index < this.formData.categorys.length; index++) {
          const navItem = this.formData.categorys[index]
          // 导航标题校验
          if (!navItem.title || !navItem.title.trim()) {
            isPass = false
            errorMessage = '请填写导航标题'
            this.errIndex = index
            break
          }
          // 公共校验
          if (navItem.path.name === '' && navItem.title !== '全部') {
            errorMessage = '请选择跳转类型'
            isPass = false
            this.errIndex = index
            break
          }
        }
      }
      if (isPass) {
        this.myCheckResult(isPass)
        this.errIndex = ''
      } else {
        this.showCheckForm()  // 使用element-ui表单自定义校验规则: 需在form标签内,自定义rules:{required:true}
        this.$newMessage.error(errorMessage)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
