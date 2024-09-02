<template>
  <div class="mod-prod-sku-tag">
    <el-form-item  :label="this.$i18n.t('product.productSpecifi')"
    :label-width="this.$i18n.t('language') === 'English'?'150px':'130px'"
    >
      <div class="sku-border">
        <!-- 新增的商品sku tag -->
        <div v-for="(tag, tagIndex) in skuTags" :key="tag.tagName" class="tagTree">
          <div class="tag">
            <!-- 规格名 -->
            <div class="sku-background spec-name-box">
              <div class="spec-name">
                <div class="tag-item-tit">{{ $t('group.skuName') }}</div>
                <!-- <span class="spec-name-item">
                  {{ $t('language') === 'English' ? tag.tagNameEn : tag.tagName}}
                </span> -->
                <div>
                  <div>
                    <el-select
                      :value="$t('language') === 'English' ? tag.tagNameEn : tag.tagName"
                      filterable
                      allow-create
                      @change="changeTagName($event, tagIndex)"
                      :placeholder="$t('tip.select')"
                    >
                      <el-option
                        v-for="item in unUseTags"
                        :key="item.propId"
                        :label="$t('language') === 'English' && item.propNameEn ? item.propNameEn : item.propName"
                        :value="$t('language') === 'English' && item.propNameEn ? item.propNameEn : item.propName"
                      >
                      </el-option>
                    </el-select>
                    <!-- 提示 -->
                    <span class="tips-word">
                      <el-tooltip
                        placement="top"
                        effect="light"
                        :content="$t('product.createNewSpecNameManually')"
                      >
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </span>
                    <!-- 添加图片 -->
                    <span v-if="tagIndex === 0" class="add-img">
                      <el-checkbox v-model="addImgchecked" @change="handleAddImgchecked(tagIndex)">{{ $t('product.addSpecPic') }}</el-checkbox>
                    </span>
                    <div class="del-spec-btn">
                      <i class="el-icon-error" @click="removeTag(tagIndex)" />
                    </div>
                    <!-- <div
                      class="default-btn text-btn"
                      @click="removeTag(tagIndex)"
                    >{{$t("text.delBtn")}}
                    </div> -->
                  </div>

                  <div v-if="tagIndex === 0" class="first-tag-tips">{{ $t('product.postProductTips11') }}</div>
                </div>
              </div>
            </div>
            <!-- 规格值 -->
            <div v-if="tag.tagName" class="spec-val">
              <div class="tag-item-tit">{{ $t('product.specificationValue') }}</div>
              <div class="tag-item-box">
                <div class="item-list" :class="{ 'ft-spec-val': tagIndex === 0 }">
                  <div
                    v-for="(tagItem, tagItemIndex) in tag.tagItems"
                    :key="tagItem.valueId"
                    class="spec-val-item"
                    :class="{ 'ft-spec-val-item': tagIndex === 0 && !tagItem.creating && addImgchecked }"
                  >
                    <div class="item">
                      <div class="prop-value">
                        <!-- multiple -->
                        <!-- <el-select
                          v-if="tagItem.creating"
                          :ref="`updataTagSelInput${tagIndex}`"
                          v-model="propValue"
                          filterable
                          allow-create
                          default-first-option
                          value-key="valueId"
                          :placeholder="$t('tip.select')"
                          @visible-change="changeTagItemName($event, tagIndex, tagItemIndex)"
                        >
                          <el-option
                            v-for="item in getTagValues(tag.tagName, tag.tagItems)"
                            :key="item.valueId"
                            :label="$t('language') === 'English' && item.propValueEn ? item.propValueEn : item.propValue"
                            :value="item"
                          ></el-option>
                        </el-select>
                        <div v-else class="text-hid">{{$t('language') === 'English' ? tagItem.propValueEn : tagItem.propValue}}</div> -->
                        <div class="text-hid">{{$t('language') === 'English' ? tagItem.propValueEn : tagItem.propValue}}</div>
                        <!-- 第一个规格允许上传图片 -->
                        <div v-if="tagIndex === 0 && !tagItem.creating && addImgchecked" class="up-box">
                          <div class="img-upload">
                            <ImgUpload :value="tagItem.pic" @input="changeTagItemPic($event, tagItem, tagIndex, tagItemIndex)" />
                          </div>
                          <div v-if="tagItem.pic" class="default-btn text-btn" @click="delTagItemPic(tagIndex, tagItemIndex)">{{ $t('text.delBtn') }}</div>
                        </div>
                      </div>
                      <div class="del-btn" @click="handleTagClose(tagIndex, tagItemIndex)">
                        <i class="el-icon-close"></i>
                      </div>
                    </div>
                  </div>
                  <!-- <div
                    class="el-icon-circle-plus-outline add-btn"
                    @click="addSkuTagItem(tagIndex)"
                  >
                  </div> -->

                  <!-- 添加规格值 -->
                  <!-- <div class="add-item" v-if="tag.tagItems.length >= 1 && !tag.tagItems[0].creating"> -->
                  <div class="add-item">
                    <!-- <el-input
                      v-if="tagItemInputs[tagIndex] && tagItemInputs[tagIndex].visible"
                      class="input-new-tag"
                      v-model="tagItemInputs[tagIndex].value"
                      :ref="`saveTagInput${tagIndex}`"
                      size="small"
                      maxlength="20"
                      @keyup.enter.native="handleInputConfirm(tag,tagIndex)"
                      @blur="handleInputConfirm(tag,tagIndex)"
                    ></el-input> -->
                    <el-select
                      v-if="tagItemInputs[tagIndex] && tagItemInputs[tagIndex].visible"
                      :ref="`saveTagInput${tagIndex}`"
                      v-model="tagItemInputs[tagIndex].value"
                      filterable
                      allow-create
                      default-first-option
                      value-key="valueId"
                      size="small"
                      :placeholder="$t('tip.select')"
                      class="input-new-tag"
                      @visible-change="addSkuTagItem($event, tagIndex)"
                    >
                      <el-option
                        v-for="item in getTagValues(tag.tagName, tag.tagItems, 'add')"
                        :key="item.valueId"
                        :label="$t('language') === 'English' && item.propValueEn ? item.propValueEn : item.propValue"
                        :value="item"
                      ></el-option>
                    </el-select>
                    <span
                      v-else
                      class="el-icon-circle-plus-outline add-btn"
                      :class="{'disable': !tag.showAddTagBtn}"
                      @click="showTagInput(tagIndex)"
                    ></span>
                  </div>
                  <!-- 添加规格值 / -->
                </div>
                <div v-if="tagIndex === 0" class="img-tips">{{ $t('product.postProductTips12') }}</div>
              </div>
            </div>
            <!-- <el-tag
              v-for="(tagItem, tagItemIndex) in tag.tagItems"
              :key="tagItem.valueId"
              closable
              :disable-transitions="false"
              @close="handleTagClose(tagIndex, tagItemIndex)"
            >{{$t('language') === 'English' ? tagItem.propValueEn : tagItem.propValue}}
            </el-tag> -->
          </div>
        </div>

        <!-- 添加商品规格按钮 -->
        <div class="sku-background">
          <div class="default-btn add-sku-btn" @click="addskuTag()">{{$t("product.addSpecifications")}}</div>
          <span v-if="!skuTags.length" class="tips">{{$t("product.postProductTips13")}}</span>
          <span v-if="skuTags.length" class="tips">({{$t('shopProcess.mostAdd') + maxNumOfCombo + $t('shopProcess.group')}})</span>
        </div>
      </div>
    </el-form-item>

  </div>
</template>

<script>
import { validNoEmptySpace } from '@/utils/validate'
import { getUUID } from '@/utils'
import ImgUpload from '@/components/img-upload'
export default {
  components: {
    ImgUpload
  },
  data () {
    return {
      value: [],
      isShowTagInput: false,
      addTagInput: {
        propName: '',
        propNameEn: '',
        propNameObj: null,
        selectValues: []
      },
      type: 0,
      tagIndex: '',
      tagItemName: '',
      tagName: '',
      tagItemNameEn: '',
      tagNameEn: '',
      tagNameIndex: 0,
      tagItemInputs: [],
      // sku的标记
      // tags: [],
      // 数据库中的规格
      dbTags: [],
      skuTagsStatus: [
        {
          showAddIcon: false
        }
      ],
      // 根据选定的规格所查询出来的规格值
      dbTagValues: [],
      dbTagValuesMap: {},
      specs: [], // 使用的规格
      maxValueId: 0, // 规格值id最大
      maxPropId: 0, // 规格id 最大
      initing: false,

      addImgchecked: true,
      propValue: [],
      tagPic: '',

      changeImg: false,

      // 最大规格组合数量
      maxNumOfCombo: 100
    }
  },
  created: function () {
    this.$http({
      url: this.$http.adornUrl(`/prod/spec/list`),
      method: 'get',
      params: this.$http.adornParams()
    }).then(({ data }) => {
      this.dbTags = data
      if (data) {
        this.maxPropId = Math.max.apply(Math, data.map(item => { return item.propId }))
        /** 兼容旧数据， 添加 tagId */
      } else {
        this.maxPropId = 0
      }
    })
    this.$http({
      url: this.$http.adornUrl(`/prod/spec/listSpecMaxValueId`),
      method: 'get',
      params: this.$http.adornParams()
    }).then(({ data }) => {
      if (data) {
        this.maxValueId = data
      } else {
        this.maxValueId = 0
      }
    })
  },
  props: {
    // tags: { // sku的标记
    //   default: [],
    //   type: Array
    // }
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
        if (this.$i18n.t('language') === 'English') {
          specIndex = this.skuTags.findIndex(tag => tag.tagNameEn === dbTag.propNameEn)
        }
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
    },
    // 计算规格组合数量
    countSkuTagCombo () {
      // 计算当前规格组合数量
      let skuTags = this.skuTags.filter(el => el.tagItems && el.tagItems.length)
      const count = skuTags.length
                    ? skuTags.map(tag => (tag.tagItems && tag.tagItems.length)).reduce((a, b) => a * b)
                    : 0
      console.log('count:', count)
      return count
    }

  },
  watch: {
    skuTags: {
      handler (val, oldVal) {
        this.handlerTagLength(val)
        if (this.initing) {
          this.initing = false
          return
        }
        let skuList = []
        if (this.type === 4) {
          // 删除规格值
          this.skuList.forEach((sku, idx) => {
            let propertiesArray = sku.properties.split(';')
            if (propertiesArray[this.tagNameIndex] && this.tagItemName !== propertiesArray[this.tagNameIndex].split(':')[1]) {
              skuList.push(sku)
            }
          })
        } else if (this.type === 2) {
          // 添加规格值
          var properties = this.tagName + ':' + this.tagItemName
          var propertiesEn = this.tagNameEn + ':' + this.tagItemNameEn
          // 增加或删除规格
          let tempSkuList = []
          val.forEach(tag => {
            if (skuList.length === 0) {
              if (this.tagName === tag.tagName) {
                let sku = Object.assign({}, this.defalutSku)
                sku.properties = properties // 销售属性组合字符串
                sku.propertiesEn = propertiesEn // 销售属性组合字符串
                skuList.push(sku)
              } else {
                tag.tagItems.forEach(tagItem => {
                  let sku = Object.assign({}, this.defalutSku)
                  sku.properties = `${tag.tagName}:${tagItem.propValue}` // 销售属性组合字符串
                  sku.propertiesEn = `${tag.tagNameEn}:${tagItem.propValueEn}` // 销售属性组合字符串
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
                  if (!this.slidingCheckTagName(sku.properties, this.tagName)) {
                    let newSku = Object.assign({}, sku)
                    newSku.properties = `${sku.properties};${properties}`
                    newSku.propertiesEn = `${sku.propertiesEn};${propertiesEn}`
                    tempSkuList.push(newSku)
                  }
                })
              } else {
                tag.tagItems.forEach(tagItem => {
                  skuList.forEach(sku => {
                    if (!this.slidingCheckTagName(sku.properties, tag.tagName)) {
                      let newSku = Object.assign({}, sku)
                      newSku.properties = `${sku.properties};${tag.tagName}:${tagItem.propValue}`
                      newSku.propertiesEn = `${sku.propertiesEn};${tag.tagNameEn}:${tagItem.propValueEn}`
                      tempSkuList.push(newSku)
                    }
                  })
                })
              }
              skuList = this.skuList.concat(tempSkuList)
            }
          })
        } else if (this.type === 5) {
          // 新增/更改/删除图片
          return
        } else {
          // 增加或删除规格
          let tempSkuList = []
          val.forEach(tag => {
            if (skuList.length === 0) {
              tag.tagItems.forEach(tagItem => {
                let sku = Object.assign({}, this.defalutSku)
                sku.properties = `${tag.tagName}:${tagItem.propValue}` // 销售属性组合字符串
                sku.propertiesEn = `${tag.tagNameEn}:${tagItem.propValueEn}` // 销售属性组合字符串
                if (tagItem.pic) {
                  sku.pic = tagItem.pic
                }
                skuList.push(sku)
              })
            } else {
              tempSkuList = []
              skuList.forEach(sku => {
                tag.tagItems.forEach(tagItem => {
                  let newSku = Object.assign({}, sku)
                  newSku.properties = `${sku.properties};${tag.tagName}:${tagItem.propValue}`
                  newSku.propertiesEn = `${sku.propertiesEn};${tag.tagNameEn}:${tagItem.propValueEn}`
                  if (tagItem.pic) {
                    newSku.pic = tagItem.pic
                  }
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
        this.$emit('change', skuList, val, this.type)
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
      let isIncludeImg = false
      for (let i = 0; i < skuList.length; i++) {
        const sku = skuList[i]
        if (!sku.properties || !sku.propertiesEn) break
        let propertiesArray = sku.properties.split(';')
        let propertiesArrayEn = sku.propertiesEn.split(';')
        const imgSrc = sku.pic
        isIncludeImg = (imgSrc && imgSrc !== '') || isIncludeImg
        for (let j in propertiesArray) {
          let cnProperties = propertiesArray[j].split(':')
          let cnPropertiesEn = propertiesArrayEn[j].split(':')
          if (!skuTags[j]) {
            skuTags[j] = {
              tagName: cnProperties[0],
              tagNameEn: cnPropertiesEn[0],
              tagItems: []
            }
            // this.tagItemInputs.push({ visible: false, value: '' })
          }
          let tagItemNameIndex = skuTags[j].tagItems.findIndex((tagItemName) => tagItemName.propValue === cnProperties[1])
          if (tagItemNameIndex === -1) {
            const extarlInfo = +j === 0 ? { pic: imgSrc } : {}
            skuTags[j].tagItems.push({
              propValue: cnProperties[1],
              propValueEn: cnPropertiesEn[1],
              ...extarlInfo
              // pic: imgSrc
            })
          }
        }
      }
      this.addImgchecked = isIncludeImg
      this.tagItemInputs.push({ visible: false, value: '' })
      this.skuTags = skuTags
    },

    /**
     * 计算规格组合数量，判断是否允许新增
     */
    handlerTagLength (val) {
      let skuTags = val.filter(el => el.tagItems && el.tagItems.length)
      val.forEach((tag, idx) => {
        let ln = skuTags.length
                 ? skuTags.map(tag => (tag.tagItems && tag.tagItems.length)) : []
        ln[idx] = ln[idx] ? ln[idx] + 1 : ''
        const count = ln.length ? ln.reduce((a, b) => a * b) : 0
        tag.showAddTagBtn = true
        if (count > this.maxNumOfCombo) {
          tag.showAddTagBtn = false
        }
      })
    },

    /**
     * 从properties属性中查找是否存在名称为参数tagName的规格名
     */
    slidingCheckTagName (properties, tagName) {
      if (tagName === '' && (properties.indexOf(';:') !== -1)) {
        return true
      }
      if (!tagName || tagName === '' || !properties || properties === '') {
        return false
      }
      let leftIndex = 0
      for (let i = 0; i < properties.length; i++) {
        leftIndex = i
        while (i < properties.length && properties.charAt(i) !== ':' && properties.charAt(i) !== ';') {
          ++i
        }
        if (properties.charAt(i) === ';' || (i - leftIndex) !== tagName.length || i >= properties.length) {
          continue
        }
        let j = 0
        while (properties.charAt(leftIndex++) === tagName.charAt(j)) {
          if (j + 1 === tagName.length) {
            return true
          }
          ++j
        }
      }
      return false
    },

    handleAddImgchecked (tagIndex) {
      if (!this.addImgchecked) {
        // 不添加规格图片时把图片属性置空
        if (this.skuTags[tagIndex] && this.skuTags[tagIndex].tagItems) {
          for (let i = 0; i < this.skuTags[tagIndex].tagItems.length; i++) {
            const newSkuTagItem = {
              ...this.skuTags[tagIndex].tagItems[i],
              pic: ''
            }
            this.$store.commit('prod/updateSkuTagItem', {
              tagIndex: tagIndex, tagItemIndex: i, skuTagItem: newSkuTagItem
            })
          }
          for (let i = 0; i < this.skuList.length; i++) {
            this.skuList[i].pic = ''
          }
          this.changeImg = true
          this.$forceUpdate()
          this.type = 5
          this.$emit('change', this.skuList, this.skuTags, this.type)
          this.$emit('clearSkuImg')
        }
      }
    },
    // 隐藏规格名、规格值输入框
    hideTagInput () {
      this.isShowTagInput = false
      this.cleanTagInput()
    },
    /**
     * 添加规格名
     */
    addskuTag () {
      if (this.skuTags.find(tag => !tag.tagName ||
          !tag.tagItems.length ||
            tag.tagItems.find(tagItem => !tagItem.propValue))) {
        this.$message({
          message: this.$i18n.t('product.completeTheAddedSpec'),
          type: 'error',
          duration: 1000
        })
        return
      }
      this.$store.commit('prod/addSkuTag', {
        // tagId: '',
        tagName: '',
        tagNameEn: '',
        tagItems: [
          // { propId: '', propValue: '', propValueEn: '', valueId: '', creating: true }
        ]
      })
      this.type = 1
    },

    /**
     * 修改规格名
     */
    changeTagName (selVal, index) {
      let useTag = this.unUseTags.find(el => selVal === el.propName || selVal === el.propNameEn)
      let is = Object.prototype.toString.call(useTag) === '[object Object]'
      const reg = /[\\;\\:\\；\\：]/g
      if (!is) {
        // 纯空格校验
        if (validNoEmptySpace(selVal)) {
          this.$message.error(this.$i18n.t('shopProcess.inputAllSpace'))
          return
        }
        if (reg.test(selVal)) {
          this.$message.error(this.$i18n.t('product.specName') + this.$i18n.t('product.specialWordSymbolTips'))
          return
        }
        // 替换:;字符
        // selVal = selVal.replace(/[\\;\\:]/g, '')
        // 判断规格名是否超长
        if (selVal.length > 10) {
          this.$message.error(this.$i18n.t('product.postProductTips11'))
          return
        }
        // 判断规格名是否重复
        if (this.skuTags.find(el => el.tagName === selVal)) {
          this.$message.error(this.$i18n.t('group.skuName') + '\'' + selVal + '\' ' + this.$i18n.t('product.isExistsPleaReEn'))
          return
        }
        useTag = {
          propName: selVal,
          propNameEn: selVal
        }
      }
      const oldSkuTag = this.skuTags[index]
      let oldValue = this.$i18n.t('language') === 'English' && oldSkuTag.tagNameEn !== '' ? oldSkuTag.tagNameEn : oldSkuTag.tagName
      if (selVal !== oldValue) {
        // 规格发生变化
        this.type = 3
      }
      if (useTag && oldSkuTag) {
        const newSkuTag = {
          tagId: useTag.propId,
          tagName: useTag.propName,
          tagNameEn: useTag.propNameEn,
          tagItems: [
            // {
            //   propId: '', propValue: '', propValueEn: '', valueId: '', creating: true
            // }
          ]
        }
        this.$store.commit('prod/updateSkuTag', {
          index, skuTag: newSkuTag
        })
        // this.$refs[`updataTagSelInput${index}`][0].$refs.reference.$refs.input.focus()
        if (is) {
          this.getDbTagValues(useTag.propId, useTag.propName)
        }
      }
    },
    /**
     * 修改规格值
     */
    changeTagItemName (value, tagIndex, tagItemIndex) {
      this.tagIndex = tagIndex
      let newSkuTag = {}
      const reg = /[\\;\\:\\；\\：]/g
      let tagItems = []
      this.tagName = this.skuTags[tagIndex].tagName
      this.tagNameEn = this.skuTags[tagIndex].tagNameEn
      this.type = 3
      if (!this.skuTags[tagIndex].tagName) {
        // 请先选择规格
        this.$message.error(this.$i18n.t('product.selectSpecFirst'))
        this.propValue = ''
        return
      }
      // value === false下拉框收起
      if (!value && this.propValue) {
        // for (let i = 0; i < this.propValue.length; i++) {
        let element = this.propValue
        let is = Object.prototype.toString.call(element) === '[object Object]'
        if (is) {
          this.tagItemName = element.propValue
          this.tagItemNameEn = element.propValueEn
          tagItems.push(element)
        } else {
          // 纯空格校验
          if (validNoEmptySpace(element)) {
            this.$message.error(this.$i18n.t('shopProcess.inputAllSpace'))
            this.propValue = ''
            return
          }
          if (reg.test(element)) {
            this.$message.error(this.$i18n.t('product.specValue') + this.$i18n.t('product.specialWordSymbolTips'))
            this.propValue = ''
            return
          }
          // 替换:;字符
          // element = element.replace(/[\\;\\:]/g, '')
          // 规格值是否超长
          if (element.length > 20) {
            this.$message.error(this.$i18n.t('product.specValueCharacterLength'))
            this.propValue = ''
            return
          }
          this.maxPropId = this.maxPropId + 1
          this.maxValueId = this.maxValueId + 1
          tagItems.push({
            propId: this.maxPropId,
            propValue: element,
            propValueEn: element,
            valueId: this.maxValueId
          })
          this.tagItemName = element
          this.tagItemNameEn = element
        }
        // }
        const oldSkuTag = this.skuTags[tagIndex]
        newSkuTag = {
          ...oldSkuTag,
          tagItems: tagItems
        }
        this.$store.commit('prod/updateSkuTag', {
          index: tagIndex, skuTag: newSkuTag
        })
        this.propValue = ''
      }
    },

    // 添加规格值
    addSkuTagItem (event, tagIndex) {
      this.tagIndex = tagIndex
      const reg = /[\\;\\:\\；\\：]/g
      let itemValue = this.tagItemInputs[tagIndex].value
      if (!event && itemValue) {
        let tagItem = {}
        const index = this.skuTags[tagIndex].tagItems.length - 1
        this.tagName = this.skuTags[tagIndex].tagName
        this.tagNameEn = this.skuTags[tagIndex].tagNameEn
        let is = Object.prototype.toString.call(itemValue) === '[object Object]'
        if (is) {
          this.tagItemName = itemValue.propValue
          this.tagItemNameEn = itemValue.propValueEn
          tagItem = {
            propId: index === -1 ? 0 : this.skuTags[tagIndex].tagItems[index].propId,
            propValue: itemValue.propValue,
            propValueEn: itemValue.propValueEn,
            valueId: itemValue.valueId
          }
        } else {
          // 纯空格校验
          if (validNoEmptySpace(itemValue)) {
            this.$message.error(this.$i18n.t('shopProcess.inputAllSpace'))
            this.tagItemInputs[tagIndex].value = ''
            this.tagItemInputs[tagIndex].visible = true
            return
          }
          if (reg.test(itemValue)) {
            this.$message.error(this.$i18n.t('product.specValue') + this.$i18n.t('product.specialWordSymbolTips'))
            this.tagItemInputs[tagIndex].value = ''
            this.tagItemInputs[tagIndex].visible = true
            return
          }
          // 替换:;字符
          // itemValue = itemValue.replace(/[\\;\\:]/g, '')
          // 规格值是否超长
          if (itemValue.length > 20) {
            this.$message.error(this.$i18n.t('product.specValueCharacterLength'))
            this.tagItemInputs[tagIndex].value = ''
            this.tagItemInputs[tagIndex].visible = true
            return
          }
          // 校验规格值是否重复
          if (this.checkTagItem(this.skuTags[tagIndex], tagIndex)) {
            this.tagItemInputs[tagIndex].value = ''
            this.tagItemInputs[tagIndex].visible = true
            return
          }
          this.tagItemName = itemValue
          this.tagItemNameEn = itemValue
          const maxValue = this.getMaxValueId(this.skuTags[tagIndex].tagItems)
          tagItem = {
            propId: index === -1 ? 0 : this.skuTags[tagIndex].tagItems[index].propId,
            propValue: itemValue,
            propValueEn: itemValue,
            valueId: index === -1 ? 0 : maxValue ? (maxValue + 1) : getUUID()
          }
        }
        if (tagItem) {
          this.$store.commit('prod/addSkuTagItem', { tagIndex, tagItem })
          this.tagItemInputs[tagIndex].visible = false
          this.tagItemInputs[tagIndex].value = ''
          this.type = 2
        }
      }
      if (!event && !itemValue && this.tagItemInputs[tagIndex].visible) {
        this.tagItemInputs[tagIndex].visible = false
        this.tagItemInputs[tagIndex].value = ''
        this.$forceUpdate()
      }
    },

    // 修改图片
    changeTagItemPic (value, skuTagItem, tagIndex, tagItemIndex) {
      const skuTag = this.skuTags[tagIndex]
      if (skuTag && skuTagItem) {
        const newSkuTagItem = {
          ...skuTagItem,
          pic: value
        }
        this.$store.commit('prod/updateSkuTagItem', {
          tagIndex: tagIndex, tagItemIndex: tagItemIndex, skuTagItem: newSkuTagItem
        })
        this.changeImg = true
        this.$forceUpdate()
        this.type = 5
        // 把对应的sku图片修改
        for (let i = 0; i < this.skuList.length; i++) {
          if (!this.skuList[i].properties) {
            continue
          }
          let properties = ((this.skuList[i].properties.split(';'))[0].split(':'))[1]
          if (properties === skuTagItem.propValue) {
            this.skuList[i].pic = value
          }
        }
        this.$emit('changeSkuImg', skuTagItem.propValue, value)
      }
    },
    delTagItemPic (tagIndex, tagItemIndex) {
      const skuTagItem = Object.assign({}, this.skuTags[tagIndex].tagItems[tagItemIndex])
      skuTagItem.pic = ''
      this.changeTagItemPic('', skuTagItem, tagIndex, tagItemIndex)
      this.changeImg = true
      this.type = 5
    },
    /**
     * 获取对应规格名下的规格值列表
     */
    getTagValues (key, usedItems, str) {
      const tagValueArr = this.dbTagValuesMap[key]
      const usedNames = usedItems.map(el => el.propValue)
      if (Array.isArray(tagValueArr)) {
        // return tagValueArr.filter(el => !usedIds.includes(el.valueId))
        return tagValueArr.filter(el => !usedNames.includes(el.propValue))
      }
      return []
    },
    // 清除规格值输入框内容
    cleanTagInput () {
      this.addTagInput = {
        propName: '',
        propNameEn: '',
        selectValues: []
      }
      this.dbTagValues = []
    },
    /**
     * 获取listSpecValue并设置到dbTagValuesMap
     */
    getDbTagValues (propId, tagName) {
      if (this.dbTagValuesMap[tagName]) return
      this.$http({
        url: this.$http.adornUrl(`/prod/spec/listSpecValue/${propId}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dbTagValuesMap[tagName] = data
        this.$forceUpdate()
      })
    },
    // 关闭标签 --删除
    handleTagClose (tagIndex, tagItemIndex) {
      this.tagName = this.skuTags[tagIndex].tagName
      this.tagNameEn = this.skuTags[tagIndex].tagNameEn
      this.tagNameIndex = tagIndex
      this.tagItemName = this.skuTags[tagIndex].tagItems[tagItemIndex].propValue
      this.tagItemNameEn = this.skuTags[tagIndex].tagItems[tagItemIndex].propValueEn
      // if (this.skuTags[tagIndex].tagItems.length === 1) {
      //   return
      // }
      this.type = 4
      this.$store.commit('prod/removeSkuTagItem', { tagIndex, tagItemIndex })
    },
    // 显示标签输入框
    showTagInput (tagIndex) {
      // 判断是否允许添加
      if (!this.skuTags[tagIndex].showAddTagBtn) {
        this.$message.error(
          `${this.$t('product.currentlyAdded') +
          this.countSkuTagCombo +
          this.$t('product.productSpecCount')}（${this.$t('shopProcess.mostAdd') +
          this.maxNumOfCombo +
          this.$t('product.groups')}），${this.$t('product.cannotAddUnderThisSpec')}`
        )
        // this.$message.error(`当前已添加${this.countSkuTagCombo}组商品规格（${this.$t('shopProcess.mostAdd')}${this.maxNumOfCombo}组），该规格名下不可添加`)
        return
      }
      this.tagItemInputs.push({ visible: false, value: '' })
      this.tagItemInputs[tagIndex] = { visible: true, value: '' }
      const useTag = this.dbTags.find(el => el.propName === this.skuTags[tagIndex].tagName)
      let is = Object.prototype.toString.call(useTag) === '[object Object]'
      if (is) {
        this.getDbTagValues(useTag.propId, useTag.propName)
      }
      this.$nextTick(() => {
        // this.$refs[`saveTagInput${tagIndex}`][0].$refs.input.focus()
        this.$refs[`saveTagInput${tagIndex}`][0].$refs.reference.$refs.input.focus()
      })
    },
    // 删除 规格
    removeTag (tagIndex) {
      this.type = 3
      this.$store.commit('prod/removeSkuTag', tagIndex)
    },
    // 获取数据集合所有对象中某个属性的最大值
    getMaxValueId (list) {
      let value = Math.max.apply(Math, list.map(item => { return item.valueId }))
      return value
    },
    /**
     * 新增规格值时，判断是否存在同名的规格值
     */
    checkTagItem (tag, tagIndex) {
      let tagItem = this.tagItemInputs[tagIndex].value
      if (!tagItem) {
        this.tagItemInputs[tagIndex].visible = false
        this.tagItemInputs[tagIndex].value = ''
        return true
      }
      var isSame = false
      // this.skuTags.forEach(tag => {
      let arr = tag.tagItems.map((item, index) => {
        return this.$i18n.t('language') === 'English' ? item.propValueEn : item.propValue
      })
      if (arr.indexOf(tagItem) !== -1) {
        isSame = true
        this.$message.error(this.$i18n.t('product.specificationValue') + '\'' + tagItem + '\' ' + this.$i18n.t('product.isExistsPleaReEn'))
        // return false
      }
      // })
      return isSame
    },

    /**
     * 校验规格列表
     */
    vaildSkuTag () {
      let isValid = true
      if (this.countSkuTagCombo > this.maxNumOfCombo) {
        this.$message.error(
          `${this.$t('shopProcess.currentlyAdded') +
          this.countSkuTagCombo +
          this.$t('shopProcess.productSpecCount')}，${this.$t('shopProcess.mostAdd') +
          this.maxNumOfCombo +
          this.$t('shopProcess.groups')}`
        )
        // this.$message.error(`当前已添加【${this.countSkuTagCombo}组】商品规格，最多可添加${this.maxNumOfCombo}组`)
        return false
      }
      if (this.skuTags && this.skuTags.length) {
        this.skuTags.some(sku => {
          if (!sku.tagName) {
          // 规格名不能为空
            this.$message({
              message: this.$t('product.specNameNotNull'),
              type: 'error',
              duration: 1000
            })
            isValid = false
            // 终止遍历
            return true
          }
          if (sku.tagName && (!sku.tagItems.length || (sku.tagItems.length && sku.tagItems.find(item => !item.propValue)))) {
            // 规格值不能为空
            this.$message({
              message: this.$i18n.t('product.specValueCannotBeEmpty'),
              type: 'error',
              duration: 1000
            })
            isValid = false
            // 终止遍历
            return true
          }
        })
      }
      return isValid
    }
  },
  deactivated () {
    this.tinymceShow = false
    // 离开发布商品页清理tag标签
    this.$store.commit('prod/removeSkuTag', -1)
  }
}
</script>

<style lang="scss" scoped>
  .mod-prod-sku-tag {
  .el-tag + .el-tag {
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
    width: 150px;
    margin-bottom: 10px;
    // margin-left: 10px;
    // vertical-align: bottom;
  }
  .text-btn {
    display: inline-block;
    margin-left: 5px;
  }
}

.mod-prod-sku-tag {
  & ::v-deep img {
    vertical-align: top;
  }
  // 新增规格外部边框
  .sku-border{
    border: 1px solid #DCDCDC;
    // padding-bottom: 10px;
    // width:70%
  }
  & ::v-deep .sku-background{
    background-color: #f8f8f8;
    margin: 10px;
    padding: 7px 10px;
    .el-button{
      margin-left: 10px;
      span{
        color:#000 !important;
      }
    }
    .el-form-item__label{
      padding:0 24px 0 0
    }
    .add-sku-btn {
      height: 28px;
      line-height: 28px;
      // margin-left: 10px;
    }
    .tips {
      font-size: 12px;
      color: #999999;
      margin-left: 10px;
    }
  }
  .tag-item-tit {
    min-width: 45px;
    margin-right: 10px;
  }
  // 规格名
  .sku-background.spec-name-box {
    .spec-name {
      display: flex;
      position: relative;
      .first-tag-tips {
        color: #999;
        font-size: 12px;
        height: 1em;
        line-height: 1em;
        margin: 5px 0;
      }
    }
    // 提示
    .tips-word {
      margin-left: 10px;
      margin-right: 10px;
      & ::v-deep .el-icon-question::before {
        color: #999;
      }
    }
    & ::v-deep .el-input__inner {
      width: 150px;
    }
    .del-spec-btn {
      display: inline-block;
      font-size: 20px;
      // line-height: 47px;
      position: absolute;
      right: 10px;
      top: 0;
      bottom: 0;
      vertical-align: middle;
      color: #BFBFBF;
      cursor: pointer;
      & ::v-deep .el-icon-error {
        vertical-align: middle;
      }
    }
    .spec-name-item {
      position: relative;
      display: inline-block;
      width: 150px;
      line-height: 1.5em;
      margin-right: 5px;
      padding: 5px 10px;
      padding-right: 15px;
      box-sizing: border-box;
      border: 1px solid #DCDCDC;
      background: #fff;
    }
    .add-img {
      margin-left: 10px;
    }
  }
  // 规格值
  .spec-val {
    display: flex;
    margin: 0 10px;
    padding: 0 10px;
    .tag-item-tit {
      margin-right: 12px;
    }
    .spec-val-item {
      margin-bottom: 10px;
      & ::v-deep .el-input__inner {
        width: 100%;
        padding-left: 0!important;
        padding-right: 5px;
        border: 0;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      & ::v-deep .el-input__suffix {
        display: none;
      }
      position: relative;
      display: inline-block;
      width: 150px;
      line-height: 1.5em;
      padding: 0 10px;
      box-sizing: border-box;
      border: 1px solid #DCDCDC;
      .item {
        display: flex;
        justify-content: space-between;
        .prop-value {
          width: 90%;
          .text-hid {
            display: block;
            width: 100%;
            height: 32px;
            line-height: 32px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .up-box {
            display: flex;
            align-items: flex-end;
            .img-upload {
              & ::v-deep .plugin-images,
              & ::v-deep .plugin-images .el-upload--picture-card,
              & ::v-deep .el-upload-list,
              & ::v-deep .el-upload-list__item.is-success {
                width: 80px;
                height: 80px;
                line-height: 80px;
                border-radius: 0;
              }
              & ::v-deep .plugin-images .el-upload--picture-card {
                border: 1px dashed #155BD4;
                background: transparent;
                & i {
                  font-size: 18px;
                  font-weight: bold;
                  color: #155BD4;
                }
              }
            }
            .text-btn {
              height: 20px;
              line-height: 20px;
            }
          }
        }
        .del-btn {
          font-size: 12px;
          line-height: 32px;
          color: #999;
          cursor: pointer;
        }
      }
      // &:not(:last-child) {
      //   margin-right: 5px;
      // }
    }
    .spec-val-item:not(:last-child) {
      margin-right: 10px;
    }
    .add-btn {
      font-size: 20px;
      line-height: 32px;
      vertical-align: middle;
      color: #155bd4;
      cursor: pointer;
    }
    .add-btn.disable {
      color: #DCDCDC;
    }

    // 第一个规格值
    .spec-val-item.ft-spec-val-item {
      padding: 0px 10px 10px 10px;
      & ::v-deep .el-input__inner {
        padding-left: 5px;
        padding-right: 5px;
        border: 0;
        height: 24px;
        line-height: 24px;
        margin-bottom: 5px;
      }
      .item {
        .del-btn {
          display: block;
          font-size: 12px;
          line-height: 28px;
          color: #999;
          cursor: pointer;
        }
      }
    }
    .tag-item-box {
      .item-list {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
      }
      .img-tips {
        height: 1em;
        line-height: 1em;
        margin-bottom: 10px;
        color: #999999;
        font-size: 12px;
      }
    }
  }

  .ft-spec-val {
    .add-btn {
      vertical-align: top;
    }
  }

  .sku-tag{
    margin: 12px 12px;
  }
  // .tagTree{
  //   margin-left: 18px;
  //   margin-bottom: 8px;
  // }
}
</style>
