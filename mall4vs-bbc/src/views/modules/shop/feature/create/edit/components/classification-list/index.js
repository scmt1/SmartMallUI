import './index.scss'
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import {microCreateMinis} from '../../minis'
import {SlickList, SlickItem, HandleDirective} from 'vue-slicksort'
import ProdsSelect from '@/components/prods-select'
import ElxImgbox from '@/components/elx-imgbox'

/** 图片广告 */
export default {
  name: 'micro-classification-list-box',
  mixins: [microCreateMinis],
  directives: {handle: HandleDirective},
  props: {
    parentDom: {
      type: Object
    }
  },
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,

      collapseActive: [],
      dialogChooseGoods: false, // 商品弹窗
      isGetChooseData: false, // 是否该是获取选择的数据
      currentBox: {},
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      mySelfCheckRules: 'mySelfCheckFun', // 我自己的验证规则函数  比如弹窗之类的
      isShowChooseImgBtn: false, // 是否显示出选择图片的按钮
      /** 选择图片的弹窗 */
      dialogChooseImgVisible: false,
      isGetChooseImages: false,
      currentIndex: 0, // 当前编辑的categoryList index
      subCategoryListIndex: 0, // 当前编辑的subCategoryList index
      currentChangeType: 1, // 当前切换的模式，1是分类2是头图

      currentLinkArrayIndex: 0,

      canChooseImagesNum: 1, // 可以添加的图片数量
      formData: {
        categoryList: []
      },
      categoryListPar: {
        isSw: true, // 是否展开
        title: '',
        subCategoryList: [],
        banner: {
          title: '',
          type: '',
          link: '',
          image_url: ''
        }
      },
      linkArray: [
        {type: 1, title: '商品详情页', link: ''},
        {type: 2, title: '微页面', link: ''}
      ],
      uploadtip: '建议宽度 150*150 像素',
      headerImg: '建议宽度 765*282 像素'
    }
  },
  watch: {},
  components: {
    SlickList,
    SlickItem,
    ProdsSelect,
    ElxImgbox
    // chooseGoods: () => import('@/components/choose-goods/index.vue'),
    // chooseImages: () => import('@/components/choose-images/index.vue')
  },
  filters: {
    typeNameFilter (val) {
      let str = ''
      switch (val) {
        case 1:
          str = '商品详情页'
          break
      }
      return str
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    inputFocus (index) {
      console.log('this.collapseActive===', this.collapseActive)
      setTimeout(() => {
        if (!this.collapseActive.find(x => x === index)) {
          this.collapseActive.push(index)
        }
      }, 100)
    },
    /** 添加主分类 */
    addNewItem () {
      console.log('添加新的主分类')
      this.formData.categoryList.push(JSON.parse(JSON.stringify(this.categoryListPar)))
    },
    /** 添加头图 */
    addHeaderImg (item, index) {
      this.canChooseImagesNum = 1
      this.currentChangeType = 2// 头图模式
      this.currentIndex = index
      // this.dialogChooseImgVisible = true
      this.elxImgboxHandle(1)
    },

    /** 子分类修改图片 */
    addItemImg (subIndex, index) {
      this.canChooseImagesNum = 1// 编辑模式只能选中一张图片
      this.currentChangeType = 1// 分类模式
      this.currentIndex = index
      this.subCategoryListIndex = subIndex // 当前编辑的subCategoryList index
      this.elxImgboxHandle(1)
    },
    /** 添加新的子分类 */
    addNewChildren (index) {
      this.canChooseImagesNum = 1000// 新增模式只能选中1000张图片
      this.currentChangeType = 1// 分类模式
      this.currentIndex = index
      // this.dialogChooseImgVisible = true
      this.elxImgboxHandle(2)
    },

    /** 选择图片的回调 */
    chooseImagesEnd ($item) {
      this.dialogChooseImgVisible = false
      const $imgData = $item.data
      if ($imgData.length) {
        const chooseImages = {key: 'image_url', val: $imgData[0].img}
        if (this.currentChangeType === 2) { // 头图模式 img
          this.setBanner(chooseImages)
        } else { // 分类模式
          if (this.canChooseImagesNum > 1) { // 通过可以添加图片的数量来判断是否为新增模式
            $imgData.map(res => {
              this.formData.categoryList[this.currentIndex].subCategoryList.push({
                title: '',
                type: '',
                link: '',
                image_url: res.img
              })
            })
          }
          this.setSubCategoryList(chooseImages)
        }
      }
    },

    /** 确定 */
    upVideoSubmitBtn () {
      this.$emit('uploadSuccess', {
        type: 'ok',
        data: ''
      })
    },

    // 点击修改目标
    chooseItem (index, type = 1, subIndex) {
      this.currentIndex = index
      this.currentChangeType = type // 默认分类模式
      if (subIndex >= 0) {
        this.subCategoryListIndex = subIndex
      }
    },
    /** 选择目标地址回调 */
    handleCommandOne (obj) {
      this.currentLinkArrayIndex = obj.v.type
      const no = [1, 2, 6]// 非商品，微页面，优惠券
      if (!no.find(x => x === obj.v.type)) {
        if (this.currentChangeType === 2) { // 头图模式
          for (const ol in obj.v) {
            this.setBanner({key: ol, val: obj.v[ol]})
          }
        } else { // 分类模式
          for (const ol in obj.v) {
            this.setSubCategoryList({key: ol, val: obj.v[ol]})
          }
        }
      } else {
        switch (obj.v.type) {
          case 1: // 商品弹窗
            this.dialogChooseGoods = true
            break
        }
      }
      this.$forceUpdate()
    },
    /**
     * 设置banner
     * attr 如果不为空 ， {key,val}
     * key, val, attr = []
     * */
    setBanner (obj) {
      if (obj.attr && obj.attr.length) {
        obj.attr.map(res => {
          this.formData.categoryList[this.currentIndex].banner[res.key] = res.val
        })
        return
      }
      this.formData.categoryList[this.currentIndex].banner[obj.key] = obj.val
    },
    /**
     * 设置subCategoryList
     * attr 如果不为空 ， {key,val}
     * */
    setSubCategoryList (obj) {
      if (obj.attr && obj.attr.length) {
        obj.attr.map(res => {
          this.formData.categoryList[this.currentIndex].subCategoryList[this.subCategoryListIndex][res.key] = res.val
        })
        return
      }
      this.formData.categoryList[this.currentIndex].subCategoryList[this.subCategoryListIndex][obj.key] = obj.val
    },
    /**
     * 设置商品、微页面、优惠券的值
     * */
    setCallbackVal (title, link) {
      const par = [
        {
          key: 'title',
          val: title
        },
        {
          key: 'link',
          val: link
        },
        {
          key: 'type',
          val: this.currentLinkArrayIndex
        }
      ]

      if (this.currentChangeType === 2) { // 头图模式
        this.setBanner({
          attr: par
        })
      } else { // 分类模式
        this.setSubCategoryList({
          attr: par
        })
      }
      this.$forceUpdate()
    },
    // 选择商品回调
    chooseGoodsFun ($event) {
      this.dialogChooseGoods = false
      console.log('选择商品回调', $event)
      const $goodsData = $event.data
      if ($goodsData.length) {
        this.setCallbackVal($goodsData[0].productName, $goodsData[0].id)
      }
    },
    /* 校验 */
    checkData () {
      let isPass = true
      this.formData.categoryList.map(res => {
        if (!res.title) {
          isPass = false
        }
      })
      this.myCheckResult((this.formData.categoryList.length > 0 && isPass))
    },
    // 弹出哪个没有填写的
    mySelfCheckFun () {
      this.$newMessage.error('分类或分类标题不能为空')
    },

    /**
     * 选择图片
     * @param {String} type
     * type 1 单选; 2 多选
     */
    elxImgboxHandle (type) {
      this.$nextTick(() => {
        this.$refs.elxImgbox.init(type)
      })
    },
    /**
     * 选择图片回调
     * @param {String} imagePath 无前缀的图片地址字符串(多图时用,分割)
     */
    refreshPic (imagePath) {
      let imgsList = imagePath.split(',')
      if (imgsList.length) {
        const chooseImages = {key: 'image_url', val: this.resourcesUrl + imgsList[0]}
        if (this.currentChangeType === 2) { // 头图模式
          this.setBanner(chooseImages)
        } else {
          if (this.canChooseImagesNum > 1) { // 通过可以添加图片的数量来判断是否为新增模式
            imgsList.map(res => {
              this.formData.categoryList[this.currentIndex].subCategoryList.push({
                title: '',
                type: '',
                link: '',
                image_url: this.resourcesUrl + res
              })
            })
            return
          }
          this.setSubCategoryList(chooseImages)
        }
      }
    }
  }
}
