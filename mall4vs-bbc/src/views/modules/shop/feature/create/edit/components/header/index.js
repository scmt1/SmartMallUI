import './index.scss'
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import { microCreateMinis } from '../../minis'

/** 头部配置 */
export default {
  name: 'micro-header-box',
  mixins: [microCreateMinis],
  props: {},
  data () {
    return {
      formData: {
        title: '',
        description: '',
        category: '',
        gmtStart: ''
      },
      id: '',
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      errorMessage: '' // 错误提示信息
    }
  },
  watch: {},
  components: {},
  computed: {},
  mounted () {},
  methods: {
    /**
     * 开始验证
     */
    checkData () {
      let isPass = true
      if (!this.formData.title.trim()) {
        isPass = false
        this.errorMessage = this.$i18n.t('shopFeature.header.pageNameCanntEmpty')
      }
      if (isPass) {
        this.myCheckResult(isPass)
      } else {
        this.showCheckForm()
        this.$newMessage.error(this.errorMessage)
      }
    }
  }
}
