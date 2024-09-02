<template>
  <el-dialog
    :title="!this.dataList[0].propId ? $t('crud.addTitle') : $t('temp.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    
    <el-form ref="form" label-width="80px">

    <el-form-item :label="$t('tip.chooseLanguage')">
        <el-select v-model="value1" multiple :placeholder="$t('tip.select')" :change='selectChange()' style="width: 450px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <p style="font-size:12px;color:#999999;line-height:20px;">{{$t('product.defaultChinese')}}</p>
    </el-form-item>

    <el-form-item :label="$t('product.attributeName')">
        <el-table :data="dataList" border style="width: 450px;" size="medium" :show-header='false'>
      <el-table-column
        prop="propName"
        header-align="center"
        align="center"
        :label="$t('product.attributeName')"
      >
        <template slot-scope="scope">
          <el-input :placeholder="$t('product.attributeName')" v-model="scope.row.propName" maxlength="20"
                    size="small"
                    show-word-limit
                    clearable
                    :disabled="!(value1[0]=='Cn'||value1[1]=='Cn')"
                    @blur="scope.row.propName = handleInputSpaces(scope.row.propName)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="propNameEn"
                       header-align="center"
                       align="center"
                       :label="$t('product.attributeNameEn')">
        <template slot-scope="scope">
          <el-input placeholder="Attribute"
                    size="small"
                    v-model="scope.row.propNameEn"
                    clearable
                    maxlength="20"
                    show-word-limit
                    :disabled="!(value1[0]=='En'||value1[1]=='En')"
                    @blur="scope.row.propNameEn = handleInputSpaces(scope.row.propNameEn) 
                    "
          ></el-input>
        </template>
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="prodPropValues"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--:label="$t('product.attributeValue')"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--<el-col :span="12" v-for="item in scope.row.prodPropValues" :key="item.valueId">-->
            <!--<el-input-->
              <!--:placeholder="$t('product.content')"-->
              <!--v-model="item.propValue"-->
              <!--@clear="clearProdPropValues"-->
              <!--maxlength="20"-->
              <!--show-word-limit-->
              <!--clearable-->
            <!--&gt;</el-input>-->
          <!--</el-col>-->
          <!--<el-col :span="4">-->
            <!--<el-button type="primary" icon="el-icon-circle-plus" @click="addInput()"></el-button>-->
          <!--</el-col>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <p style="font-size:12px;color:#999999;line-height:20px;">{{$t('product.theAttribute')}}</p>
  </el-form-item>

  <el-form-item :label="$t('product.attributeValue')">
    <div class="default-btn primary-btn" @click="add">{{$t('product.additive')}}</div>
    <p style="font-size:12px;color:#999999;line-height:20px;">{{$t('product.theValue')}}</p>
  </el-form-item>


  <el-form-item >
    <el-table :data="prodPropValuesData" max-height="225px"  :show-header='false' :border="false">
      <el-table-column
        prop="propValue"
        :label="$t('product.attributeValueEn')"
        align="left"
        min-width="40%"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-input
            size="small"
            maxlength="20"
            clearable
            :placeholder="$t('product.attributeValue')"
            :disabled="!(value1[0]=='Cn'||value1[1]=='Cn')"
            v-model="prodPropValuesData[scope.$index].propValue"
            @blur="prodPropValuesData[scope.$index].propValue = handleInputSpaces(prodPropValuesData[scope.$index].propValue)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        min-width="40%"
        show-overflow-tooltip
        prop="propValueEn"
        :label="$t('product.attributeValue')"
      >
        <template slot-scope="scope">
          <el-input
            clearable
            size="small"
            maxlength="20"
            placeholder="Value"
            :disabled="!(value1[0]=='En'||value1[1]=='En')"
            v-model="prodPropValuesData[scope.$index].propValueEn"
            @blur="prodPropValuesData[scope.$index].propValueEn = handleInputSpaces(prodPropValuesData[scope.$index].propValueEn)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="change"
        :label="$t('publics.operating')"
        align="left"
        min-width="20%"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <a href="javascript:;" @click="deleteRow(scope.$index)">{{$t('resource.Delete')}}</a>
        </template>
      </el-table-column>
    </el-table>
  </el-form-item>
    
  </el-form>
    
    
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      dataList: [{ propId: 0, propName: '', prodPropValues: [{ valueId: 0 }] }],
      dataRule: {
        propName: [
          { required: true, message: this.$i18n.t('product.attributeNameNoNull'), trigger: 'blur' }
        ]
      },
      prodPropValuesData: [{valueId: 0, propValue: '', propValueEn: ''}],
      isSubmit: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      options: [{
        value: 'Cn',
        label: '简体中文'
      }, {
        value: 'En',
        label: 'En'
      }],
      value1: ['Cn']
    }
  },
  methods: {
    init (val) {
      this.isSubmit = false
      if (val) {
        this.dataList = [JSON.parse(JSON.stringify(val))]
        this.prodPropValuesData = this.dataList[0].prodPropValues
      } else {
        this.dataList = [
          { propId: 0, propName: '', prodPropValues: [{ valueId: 0 }] }
        ]
        this.prodPropValuesData = [{valueId: 0, propValue: '', propValueEn: ''}]
      }
      this.visible = true
    },

    /**
     * 输入框纯空格处理
     */
    handleInputSpaces (value) {
      if (!value) { return }
      return value.trim()
    },

    // 多选框默认选择中文
    selectChange () {
      if (this.value1.length === 1 && this.value1[0] !== 'Cn') {
        this.value1.unshift('Cn')
      }
      if (this.value1.length < 1) {
        this.value1.push('Cn')
      }
    },

    // 表单提交
    dataFormSubmit () {
      let temp = []
      if (this.prodPropValuesData) {
        for (const key in this.prodPropValuesData) {
          if (this.prodPropValuesData.hasOwnProperty(key)) {
            const element = this.prodPropValuesData[key]
            if (element.propValue && element.propValue.trim()) {
              temp.push(this.prodPropValuesData[key])
            } else {
              this.$message.error(this.$i18n.t('product.specificationy'))
              return
            }
          }
        }
      }
      // if (this.dataList[0].prodPropValues) {
      //   for (const key in this.dataList[0].prodPropValues) {
      //     if (this.dataList[0].prodPropValues.hasOwnProperty(key)) {
      //       const element = this.dataList[0].prodPropValues[key]
      //       if (element.propValue) {
      //         temp.push(this.dataList[0].prodPropValues[key])
      //       }
      //     }
      //   }
      // }
      // 判断是否有相同的属性值
      let prodPropValues = this.prodPropValuesData
      // let prodPropValues = this.dataList[0].prodPropValues
      if (prodPropValues) {
        for (let i = 0; i < prodPropValues.length - 1; i++) {
          if (!prodPropValues[i].propValue) {
            this.$message.error(this.$i18n.t('product.specTip').replace('N', i + 1))
            return
          }
          // if (prodPropValues[i].propValueEn === '' || prodPropValues[i].propValueEn === null || prodPropValues[i].propValueEn === undefined) {
          //   this.$message.error(this.$i18n.t('product.specTip').replace('N', i + 1))
          //   return
          // }
          for (let j = i + 1; j < prodPropValues.length; j++) {
            if (prodPropValues[i].propValue === prodPropValues[j].propValue) {
              this.$message.error(this.$i18n.t('product.same'))
              return
            }
            // if (prodPropValues[i].propValueEn === prodPropValues[j].propValueEn) {
            //   this.$message.error(this.$i18n.t('product.same'))
            //   return
            // }
          }
        }
      }
      if (!this.dataList[0].propName) {
        this.$message.error(this.$i18n.t('product.attributeNameNoNull'))
        return
      }
      if (temp.length < 1) {
        this.$message.error(this.$i18n.t('product.specificationy'))
        return
      }
      if (this.isSubmit) {
        return false
      }
      this.isSubmit = true
      this.$http({
        url: this.$http.adornUrl(`/prod/spec`),
        method: this.dataList[0].propId ? 'put' : 'post',
        data: this.$http.adornData({
          propId: this.dataList[0].propId || undefined,
          propName: this.dataList[0].propName,
          propNameEn: this.dataList[0].propNameEn,
          prodPropValues: this.prodPropValuesData
        })
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshDataList', this.page)
          }
        })
      }).catch((e) => {
        this.isSubmit = false
      })
    },
    clearProdPropValues () {
      if (this.dataList[0].prodPropValues.length === 1) {
        return
      }
      for (let i = 0; i < this.dataList[0].prodPropValues.length; i++) {
        const element = this.dataList[0].prodPropValues[i]
        if (!element.propValue) {
          this.dataList[0].prodPropValues.splice(i, 1)
        }
      }
    },
    addInput () {
      let temp = this.dataList[0].prodPropValues
      if (temp[temp.length - 1].propValue) {
        temp.push({})
      } else {
        this.$message.error(this.$i18n.t('product.attributeValueNoNull'))
      }
    },
    /**
     * 添加一行规格
     */
    add () {
      let temp = this.prodPropValuesData[0]
      if (temp.propValue) {
        this.prodPropValuesData.unshift({ propValue: '', propValueEn: '' })
      } else {
        this.$message.error(this.$i18n.t('product.specificationy'))
      }
    },
    /**
     * 删除一行规格
     */
    deleteRow (index) {
      if (this.prodPropValuesData.length <= 1) {
        this.$message.error(this.$i18n.t('product.specificationy'))
        return
      }
      this.prodPropValuesData.splice(index, 1)
    }
  }
}
</script>