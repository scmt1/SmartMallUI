/**
 * 网页面的mixins
 * 父组件保存将会通知所有的子组件
 * isStartCheckFieldRules 然后调用 commonCheckFieldRules 这个方法
 * commonCheckFieldRules需要定义值以及跟值一直的fun
 * 例：src\views\shop\micro-create\components\header\index.js
 * 最后需要调用myCheckResult() 传入布尔值 通知父级当前子组件是否已经规则验证完成
 * */
export const microCreateMinis = {
  name: 'micro-create-minis',
  props: {
    isCheckMySelf: { // 是否开始内部验证 比如提示弹窗等。。。
      type: Boolean,
      default: false
    },
    currentComponent: { // 当前组件
      type: Object
    },
    indexKey: { // 当前组件排序索引 type_ + key
      type: String
    },
    current: { // 当前排序索引 key
      type: Number
    },
    isShowEdit: { // 是否为编辑状态
      type: Boolean,
      default: false
    },
    dataField: { // 所有上传到后端的字段
      type: Object,
      default: () => { }
    },
    isStartCheckFieldRules: { // 是否开始校验规则
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      // 是否通过了规格判断
      isPass: false,
      dontshowMessage: false
    }
  },
  watch: {
    dataField (val) {
      if (val) {
        this.setFormData()
      }
    },
    isCheckMySelf () {
      /* console.log(this.currentComponent, '=isCheckMySelf=', val, this.mySelfCheckRules, this); */
      if (this.mySelfCheckRules) {
        this[this.mySelfCheckRules](this.isPass)
      }
    },
    formData: {
      deep: true,
      handler (val) {
        if (val) {
          this.$emit('componentsValueChance', {
            // isPass: this.isPass,
            indexKey: this.indexKey,
            current: this.current,
            dataField: val
          })
        }
      }
    },
    isStartCheckFieldRules () {
      this.startCheckFieldRulesCommonFun()
    }
  },
  mounted () {
    this.setFormData()
  },
  methods: {
    /**
     * 重新保存数据
     */
    handleActivityProdInvalid () {
      // 检测到有活动商品失效，剔除无效商品直接保存
      this.$emit('save', 2, true)
    },

    /** 设置或者重设formData的数据 */
    setFormData () {
      if (this.dataField) {
        for (const el in this.dataField) {
          this.formData[el] = this.dataField[el]
          this.$set(this.formData, `${el}`, this.dataField[el])
        }
      }
    },
    /**
     * 从父级传过来默认开始验证规格的时候
     * 一般为保存时
     * */
    startCheckFieldRulesCommonFun () {
      // console.log('从父级传过来默认开始验证规格的时候', this.commonCheckFieldRules)
      if (this.commonCheckFieldRules) {
        this[this.commonCheckFieldRules]()
      }
    },
    /**
     * 返回校验结果
     * isHeader 是否为顶部 特殊情况
     * 结果：Boolean true false
     * */
    myCheckResult ($isPass) {
      this.$emit('myCheckResult', {
        data: {
          isPass: $isPass,
          dataField: this.dataField,
          isHeader: (this.currentComponent.type.indexOf('config') !== -1),
          current: this.current
        }
      })
    },
    /**
     * 可选
     * 当子组件不符合规则时，是否调用element ui 默认的规则判断
     * 需要默认结构为form
     * */
    showCheckForm (cb) {
      this.$nextTick(() => {
        if (this.$refs.formData) {
          this.$refs.formData.validate((valid) => {
            if (valid) {
              if (cb) cb(valid)
            } else {
              if (cb) cb(valid)
            }
          })
        }
      })
    }
  }
}
