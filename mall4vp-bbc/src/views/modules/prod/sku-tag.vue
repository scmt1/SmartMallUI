<template>
  <div class="mod-prod-sku-tag">
    <el-form-item :label="this.$i18n.t('prodSku.prodSku')">
      <div class="default-btn primary-btn" @click="shopTagInput()">{{$t("prodSku.addSku")}}</div>
      <span class="tips">({{$t('shopProcess.mostAdd') + '100' + $t('shopProcess.group')}})</span>
      <div v-for="(tag, tagIndex) in skuTags" :key="tagIndex">
        <span class="mariginR">{{tag.tagName}}</span>
        <div
          class="default-btn text-btn"
          @click="removeTag(tagIndex)"
        >{{$t("remindPop.delete")}}</div>
        <br />
        <el-tag
        class="mariginR"
          v-for="(tagItem, tagItemIndex) in tag.tagItems"
          :key="tagItem"
          closable
          :disable-transitions="false"
          @close="handleTagClose(tagIndex, tagItemIndex)"
        >{{tagItem}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="tagItemInputs[tagIndex] && tagItemInputs[tagIndex].visible"
          v-model="tagItemInputs[tagIndex].value"
          :ref="`saveTagInput${tagIndex}`"
          size="small"
          maxlength="20"
          @keyup.enter.native="handleInputConfirm(tagIndex)"
          @blur="handleInputConfirm(tagIndex)"
        ></el-input>
        <div v-if="(!tagItemInputs[tagIndex] || !tagItemInputs[tagIndex].visible) && tag.maxSku > tag.tagItems.length" class="default-btn" @click="showTagInput(tagIndex)">+ {{$t("prodSku.add")}}</div>
      </div>
    </el-form-item>
    <el-form-item :label="this.$i18n.t('prodSku.skuName')" v-show="isShowTagInput">
      <el-col :span="8" style="margin-left:10px">
        <el-input
          v-model="addTagInput.propName"
          style="width:200px"
          :placeholder="this.$i18n.t('prodSku.inputSkuName')"
          @change="handleTagClick"
          size="small"
        >
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item :label="this.$i18n.t('prodSku.skuValue')" v-show="isShowTagInput">
      <el-col :span="8">
        <el-tooltip
          effect="light"
          :content="$t('prodSku.enterInput')"
          placement="top"
        >
        <i style="margin-left:-8px" class="el-icon-question"></i>
        </el-tooltip>
        <el-select
          v-model="addTagInput.selectValues"
          multiple
          filterable
          allow-create
          :multiple-limit="multipleLimit"
          default-first-option
          :placeholder="this.$i18n.t('prodSku.inputSkuValue')"
          size="small"
          @change="handleTagValClick"
        >
        </el-select>
      </el-col>
    </el-form-item>
    <el-form-item>
      <div class="default-btn primary-btn" @click="addTag()" v-show="isShowTagInput">{{$t("remindPop.confirm")}}</div>
      <div class="default-btn" @click="hideTagInput()" v-show="isShowTagInput">{{$t("remindPop.cancel")}}</div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: [],
      isShowTagInput: false,
      addTagInput: {
        propName: '',
        selectValues: ''
      },
      type: 0,
      tagItemName: '',
      tagName: '',
      tagNameIndex: 0,
      tagItemInputs: [],
      // sku的标记
      // tags: [],
      // 数据库中的规格
      dbTags: [],
      // 根据选定的规格所查询出来的规格值
      dbTagValues: [],
      specs: [], // 使用的规格
      initing: false,

      multipleLimit: 100 //限制规格选择数
    }
  },
  created: function () {
    this.$http({
      url: this.$http.adornUrl(`/prod/spec/list`),
      method: 'get',
      params: this.$http.adornParams()
    }).then(({ data }) => {
      this.dbTags = data
    })
  },
  props: {
    //   tags: { // sku的标记
    //     default: [],
    //     type: Array
    //   }
    skuList: {
      default: []
    }
  },
  computed: {
    // 未使用的规格, 通过计算属性计算
    unUseTags () {
      let res = []
      for (let i = 0; i < this.dbTags.length; i++) {
        const dbTag = this.dbTags[i]
        let specIndex = this.skuTags.findIndex(tag => tag.tagName === dbTag.propName)
        if (specIndex === -1) {
          res.push(dbTag)
        }
      }
      return res
    },
    skuTags: {
      get () { return this.$store.state.prod.skuTags },
      set (val) { this.$store.commit('prod/updateSkuTags', val) }
    },
    defalutSku () {
      return this.$store.state.prod.defalutSku
    }
  },
  watch: {
    skuTags: {
      handler (val, oldVal) {
        if (this.initing) {
          this.initing = false
          return
        }
        let skuList = []
        if (this.type === 4) {
          // 删除规格值
          this.skuList.forEach(sku => {
            let propertiesArray = sku.properties.split(';')
            if (this.tagItemName !== propertiesArray[this.tagNameIndex].split(':')[1]) {
              skuList.push(sku)
            }
          })
        } else if (this.type === 2) {
          // 添加规格值
          var properties = this.tagName + ':' + this.tagItemName
          // 增加或删除规格
          let tempSkuList = []
          val.forEach(tag => {
            if (skuList.length === 0) {
              if (this.tagName === tag.tagName) {
                let sku = Object.assign({}, this.defalutSku)
                sku.properties = properties // 销售属性组合字符串
                skuList.push(sku)
              } else {
                tag.tagItems.forEach(tagItem => {
                  let sku = Object.assign({}, this.defalutSku)
                  sku.properties = `${tag.tagName}:${tagItem}` // 销售属性组合字符串
                  skuList.push(sku)
                })
              }
              if (val.length === 1) {
                skuList = this.skuList.concat(skuList)
              }
            } else {
              tempSkuList = []
              if (this.tagName === tag.tagName) {
                skuList.forEach(sku => {
                  if (sku.properties.indexOf(this.tagName) === -1) {
                    let newSku = Object.assign({}, sku)
                    newSku.properties = `${sku.properties};${properties}`
                    tempSkuList.push(newSku)
                  }
                })
              } else {
                tag.tagItems.forEach(tagItem => {
                  skuList.forEach(sku => {
                    if (sku.properties.indexOf(tag.tagName) === -1) {
                      let newSku = Object.assign({}, sku)
                      newSku.properties = `${sku.properties};${tag.tagName}:${tagItem}`
                      tempSkuList.push(newSku)
                    }
                  })
                })
              }
              skuList = this.skuList.concat(tempSkuList)
            }
          })
        } else {
          // 增加或删除规格
          let tempSkuList = []
          val.forEach(tag => {
            // console.log('tag', tag)
            if (skuList.length === 0) {
              tag.tagItems.forEach(tagItem => {
                let sku = Object.assign({}, this.defalutSku)
                sku.properties = `${tag.tagName}:${tagItem}` // 销售属性组合字符串
                skuList.push(sku)
              })
            } else {
              tempSkuList = []
              tag.tagItems.forEach(tagItem => {
                skuList.forEach(sku => {
                  let newSku = Object.assign({}, sku)
                  newSku.properties = `${sku.properties};${tag.tagName}:${tagItem}`
                  tempSkuList.push(newSku)
                })
              })
              skuList = tempSkuList
            }
          })
        }
        if (!skuList.length) {
          skuList.push(Object.assign({}, this.defalutSku))
        }
        this.changeMaxSku()
        // debugger
        this.$emit('change', skuList)
      },
      deep: true
    }
  },
  methods: {
    init (skuList) {
      this.value = skuList
      if (!skuList || !skuList.length) {
        this.skuTags = []
        this.$emit('change', [Object.assign({}, this.defalutSku)])
        return
      }
      this.initing = true
      let skuTags = []
      for (let i = 0; i < skuList.length; i++) {
        const sku = skuList[i]
        if (!sku.properties) break
        let propertiesArray = sku.properties.split(';')
        for (let j in propertiesArray) {
          let cnProperties = propertiesArray[j].split(':')
          if (!skuTags[j]) {
            skuTags[j] = {
              tagName: cnProperties[0],
              tagItems: []
            }
            this.tagItemInputs.push({ visible: false, value: '' })
          }
          let tagItemNameIndex = skuTags[j].tagItems.findIndex((tagItemName) => tagItemName === cnProperties[1])
          if (tagItemNameIndex === -1) {
            skuTags[j].tagItems.push(cnProperties[1])
          }
        }
      }
      this.skuTags = skuTags
      this.changeMaxSku()
    },


    changeMaxSku() {
      if(this.skuTags.length === 0) return
      let skuList = this.skuTags.map((item) => {return item.tagItems.length > 0 ? item.tagItems.length : 1 })
      let multipleLimit = 100
      let dataList = this.skuTags
      skuList.forEach((item, index) => {
        let y = skuList.length > 1 ? skuList.reduce((x, y) => {return x * y}) : item
        multipleLimit = Math.floor(100 / y)   
        let demoList = JSON.parse(JSON.stringify(skuList))
        demoList.splice(index, 1)
        let x = skuList.length > 1 ? demoList.reduce((x, y) => {return x * y}) : item
        dataList[index]['maxSku'] = Math.floor(100 / x)
      })
      this.multipleLimit = multipleLimit
      this.skuTags = dataList
    },

    // 显示规格名、规格值输入框
    shopTagInput () {
      this.isShowTagInput = true
    },
    // 隐藏规格名、规格值输入框
    hideTagInput () {
      this.isShowTagInput = false
      this.cleanTagInput()
    },
    addTag () {
      let selectValues = this.addTagInput.selectValues
      if (!this.addTagInput.propName) {
        this.$message.error(this.$i18n.t('prodSku.inputSkuName'))
        return
      }
      if (!selectValues.length) {
        this.$message.error(this.$i18n.t('prodSku.inputSkuValue'))
        return
      }
      if (this.checkAddTag()) {
        return
      }
      this.isShowTagInput = false
      let tagItems = []
      for (let i = 0; i < selectValues.length; i++) {
        const element = selectValues[i]
        tagItems.push(element)
      }
      // 向规格中放入规格输入框内的数据
      this.$store.commit('prod/addSkuTag', {
        tagName: this.addTagInput.propName,
        tagItems
      })
      this.type = 1
      this.cleanTagInput()
    },
    // 清除规格值输入框内容
    cleanTagInput () {
      this.addTagInput = {
        propName: '',
        selectValues: ''
      }
    },
    // 规格名输入框，选中规格事件
    handleTagClick () {
      // 判断空格
      if (!this.addTagInput.propName.trim()) {
        this.addTagInput.propName = ''
        return
      }
      // 判断字符长度（规格名不超过10字符）
      if (this.addTagInput.propName.length > 10) {
        this.addTagInput.propName = ''
        this.$message({
          message: this.$i18n.t('prodSku.specNameLengthLimit'),
          type: 'error',
          duration: 1000
        })
        return
      }
      // 规格名不允许包含特殊字符;:
      const reg = /[\\;\\:\\；\\：]/g
      // if (this.addTagInput.propName.indexOf(';') !== -1 || this.addTagInput.propName.indexOf(':') !== -1) {
      if (reg.test(this.addTagInput.propName)) {
        this.addTagInput.propName = ''
        this.$message({
          message: this.$i18n.t('prodSku.specName') + this.$i18n.t('prodSku.specialWordSymbolTips'),
          type: 'error',
          duration: 1500
        })
        return
      }
      // 清空规格值输入框
      this.dbTagValues = []
      this.addTagInput.selectValues = []
      // 判断规格名输入的值是否为数据库中已有的值
      let specsIndex = this.dbTags.findIndex(spec => spec.propName === this.addTagInput.propName)
      // 如果不是，则说明为用户随便输入
      if (specsIndex === -1) return
      // 如果数据库已有该规格名，则获取根据id获取该规格名称含有的规格值
      this.$http({
        url: this.$http.adornUrl(`/prod/spec/listSpecValue/${this.dbTags[specsIndex].propId}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dbTagValues = data
      })
    },
    // 规格值判断空格
    handleTagValClick () {
      const idx = this.addTagInput.selectValues.length - 1
      const curVal = this.addTagInput.selectValues[idx] ? String(this.addTagInput.selectValues[idx]) : ''
      if (!curVal.trim()) {
        this.addTagInput.selectValues.splice(idx, 1)
        return
      }
      // 规格值长度限制（20字符以内）
      if (curVal.length > 20) {
        this.addTagInput.selectValues.splice(idx, 1)
        this.$message({
          message: this.$i18n.t('prodSku.specValueLengthLimit'),
          type: 'error',
          duration: 1000
        })
        return
      }
      // 规格值不允许包含特殊字符;:
      const reg = /[\\;\\:\\；\\：]/g
      // if (curVal.indexOf(';') !== -1 || curVal.indexOf(':') !== -1) {
      if (reg.test(curVal)) {
        this.addTagInput.selectValues.splice(idx, 1)
        this.$message({
          message: this.$i18n.t('prodSku.specValue') + this.$i18n.t('prodSku.specialWordSymbolTips'),
          type: 'error',
          duration: 1500
        })
      }
    },
    // 关闭标签
    handleTagClose (tagIndex, tagItemIndex) {
      this.tagName = this.skuTags[tagIndex]
      this.tagNameIndex = tagIndex
      this.tagItemName = this.skuTags[tagIndex].tagItems[tagItemIndex]
      if (this.skuTags[tagIndex].tagItems.length === 1) {
        return
      }
      this.type = 4
      this.$store.commit('prod/removeSkuTagItem', { tagIndex, tagItemIndex })
    },
    // 标签输入框确定时调用
    handleInputConfirm (tagIndex) {
      if (this.checkTagItem(tagIndex)) {
        return
      }
      this.tagName = this.skuTags[tagIndex].tagName
      this.tagItemName = this.tagItemInputs[tagIndex].value

      let tagItem = this.tagItemInputs[tagIndex].value
      if (tagItem) {
        this.$store.commit('prod/addSkuTagItem', { tagIndex, tagItem })
      }
      this.tagItemInputs[tagIndex].visible = false
      this.tagItemInputs[tagIndex].value = ''
      this.type = 2
    },
    // 显示标签输入框
    showTagInput (tagIndex) {
      this.tagItemInputs.push({ visible: false, value: '' })
      this.tagItemInputs[tagIndex].visible = true
      this.$nextTick(() => {
        this.$refs[`saveTagInput${tagIndex}`][0].$refs.input.focus()
      })
    },
    removeTag (tagIndex) {
      this.type = 3
      this.$store.commit('prod/removeSkuTag', tagIndex)
    },
    /**
     * 新增规格值时，判断是否存在同名的规格值
     */
    checkTagItem (tagIndex) {
      let tagItem = this.tagItemInputs[tagIndex].value
      var isSame = false
      if (this.skuTags[tagIndex].tagItems.indexOf(tagItem) !== -1) {
        isSame = true
        this.$message.error(this.$i18n.t('prodSku.repeatWarning'))
        return true
      }
      // this.skuTags.some(tag => {
      //   if (tag.tagItems.indexOf(tagItem) > -1) {
      //     isSame = true
      //     this.$message.error(this.$i18n.t('prodSku.repeatWarning'))
      //     return true
      //   }
      // })
      return isSame
    },
    /**
     * 新增规格时，判断是否存在同名的规格及规格值值
     */
    checkAddTag () {
      var isSame = false
      this.skuTags.forEach(tag => {
        if (this.addTagInput.propName === tag.tagName && !isSame) {
          isSame = true
          this.$message.error(this.$i18n.t('prodSku.skuName') + `[${this.addTagInput.propName}]` + this.$i18n.t('prodSku.reEnter'))
        }
        this.addTagInput.selectValues.forEach(item => {
          if (tag.tagName === this.addTagInput.propName && tag.tagItems.indexOf(item) > -1 && !isSame) {
            isSame = true
            // this.$message.error('规格值 \'' + item + '\' 已存在，请重新输入')
            this.$message.error(this.$i18n.t('prodSku.skuValue') + `[${item}]` + this.$i18n.t('prodSku.reEnter'))
          }
        })
      })
      this.tagItemInputs.push({ visible: false, value: '' })
      return isSame
    }
  }
}
</script>

<style lang="scss">
.mod-prod-sku-tag {
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .tips {
    font-size: 12px;
    color: #999999;
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .el-upload--picture-card{
    background: #ffffff;
  }
  .mariginR {
    margin-right: 5px;
  }
}
</style>
