<template>
  <div class="mod-index-img">
    <el-dialog
      :title="!dataForm.formId ? this.$i18n.t('brand.add') : this.$i18n.t('brand.revise')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @close="closeDialogHandle"
      style="min-width:1400px;"
    >
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="110px">
        <el-form-item :label="this.$i18n.t('formData.formName')" prop="formName">
          <el-input
            :placeholder="this.$i18n.t('formData.pleaseEnterTheReportName')"
            v-model="dataForm.formName"
            maxlength="50"
            show-word-limit
            size="small"
            clearable
          ></el-input>
        </el-form-item>
        <!-- <el-form-item :label="this.$i18n.t('formData.typeOfData')" prop="fromType">
          <el-radio-group v-model="dataForm.fromType">
            <el-radio :label="1">{{$t('formData.shop')}}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item :label="this.$i18n.t('formData.timePeriod')" prop="timeType">
          <el-radio-group v-model="dataForm.timeType">
            <el-radio :label="1">{{$t('formData.natureDay')}}</el-radio>
            <el-radio :label="2">{{$t('formData.natureWeek')}}</el-radio>
            <el-radio :label="3">{{$t('formData.naturalMoon')}}</el-radio>
          </el-radio-group>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-tooltip
            class="item"
            effect="light"
            :content="this.$i18n.t('formData.accordingToTheSelectedType')"
            placement="top"
          >
            <span>
              <i class="el-icon-question"></i>
            </span>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('formData.timeFormat')" prop="timeFormat">
          <el-radio-group v-model="dataForm.timeFormat">
            <el-radio :label="1">{{$t('formData.customTime')}}</el-radio>
            <el-radio :label="2">{{$t('formData.specifyTimeRange')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('formData.customTime')"
          prop="time"
          v-if="dataForm.timeFormat === 1"
        >
          <el-date-picker
            v-if="dataForm.timeType === 1"
            v-model="dataForm.time"
            type="daterange"
            align="right"
            size="small"
            key="daterange"
            unlink-panels
            range-separator="-"
            :start-placeholder="this.$i18n.t('date.start')"
            :end-placeholder="this.$i18n.t('date.end')"
            :picker-options="pickerOptions"
            :clearable="false"
            @input="daterangeChange"
          ></el-date-picker>
          <el-date-picker
            v-else-if="dataForm.timeType === 3"
            v-model="dataForm.time"
            type="monthrange"
            align="right"
            unlink-panels
            key="monthrange"
            size="small"
            range-separator="-"
            :start-placeholder="this.$i18n.t('date.start')"
            :end-placeholder="this.$i18n.t('date.end')"
            :picker-options="pickerOptions"
            :clearable="false"
            @input="daterangeChange"
          ></el-date-picker>
          <el-date-picker
            v-else="dataForm.timeType === 2"
            v-model="dateWeek"
            @change="Week"
            :picker-options="{'firstDayOfWeek': 1}"
            type="week"
            key="dateWeek"
            align="right"
            size="small"
            format="yyyy 第 WW 周"
            :clearable="false"
            :placeholder="this.$i18n.t('formData.selectWeek')">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('formData.timeLimit')"
          prop="timeRamge"
          v-if="dataForm.timeFormat === 2"
          style="width:500px;"
        >
          <el-input
            :placeholder="this.$i18n.t('formData.pleaseEnterTheTime')"
            v-model="dataForm.timeRamge"
            @change="setTimeRamge"
            size="small"
          >
            <template slot="prepend">{{$t('formData.near')}}</template>
            <template slot="append">
              {{this.dataForm.timeType === 1? this.$i18n.t('formData.day') : this.dataForm.timeType === 2?this.$i18n.t('formData.week'):this.$i18n.t('formData.month')}}
              <el-tooltip
                class="item"
                effect="light"
                :content="this.$i18n.t('formData.timeTip')"
                placement="top"
              >
                <span>
                  <i class="el-icon-question"></i>
                </span>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('brand.serialNumber')" prop="seq">
          <el-input-number
            v-model="dataForm.seq"
            controls-position="right"
            @change="seqChange"
            :min="1"
            size="small"
            :max="100000000"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('formData.selectIndicator')"
          prop="formItem"
          label-width="110px"
        >
          <el-card class="box-card">
            <el-row style="width:100%">
              <el-col v-for="item in formItemList" :key="item.id" :span="$t('language') === 'language' ? 8 : 4">
                <el-link
                  :underline="false"
                  class="buttonClick"
                  @click="selectItem(item.id,true)"
                  v-if="!item.select"
                >{{item.value}}</el-link>
                <el-link
                  :underline="false"
                  type="success"
                  class="buttonClick"
                  @click="selectItem(item.id,false)"
                  v-else
                >{{item.value}}</el-link>
              </el-col>
            </el-row>
          </el-card>
        </el-form-item>
        <el-form-item>
          <el-tag
            v-for="item in formItemListSelect"
            :key="item.id"
            closable
            class="tag"
            type="info"
            @close="selectItem(item.id,false)"
          >{{item.value}}</el-tag>&nbsp;&nbsp;
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="close()">{{$t('remindPop.cancel')}}</div>
        <div class="primary-btn default-btn" @click="dataFormSubmit()">{{$t('remindPop.confirm')}}</div>
      </span>
    </el-dialog>
    <!-- 商品选择弹窗-->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      :isSingle="true"
      @refreshSelectProds="selectIndexProd"
    ></prods-select>
  </div>
</template>

<script>
// import PicUpload from '@/components/pic-upload'
import ImgUpload from '@/components/img-upload'
import ProdsSelect from '@/components/prods-select'
import moment from 'moment'
export default {
  data () {
    var validateNumber = (rule, value, callback) => {
      var reg = /[^\d]/
      if (reg.test(value)) {
        callback(new Error(this.$i18n.t('formData.pleaseThan0')))
      } else {
        callback()
      }
    }
    var validateFormName = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('formData.theReportNameCannotBeEmpty')))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        formId: 0,
        formName: '',
        timeType: 1,
        timeFormat: 1,
        formItemIds: '',
        startTime: '',
        endTime: '',
        timeRamge: 1,
        time: '',
        seq: 1
      },
      dateWeek: '',
      pickerOptions: {
        shortcuts: [{
          text: this.$i18n.t('formData.lastWeek'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$i18n.t('formData.lastMonth'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$i18n.t('formData.lastThreeMonths'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      formItemList: [],
      formItemListSelect: [],
      isSubmit: true,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataRule: {
        formName: [
          { required: true, message: this.$i18n.t('formData.theReportNameCannotBeEmpty'), trigger: 'blur' },
          { validator: validateFormName, trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: this.$i18n.t('formData.startTimeCannotBeEmpty'), trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: this.$i18n.t('formData.endTimeCannotBeEmpty'), trigger: 'blur' }
        ],
        timeRamge: [
          { required: true, message: this.$i18n.t('formData.endTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ],
        time: [
          { required: true, message: this.$i18n.t('formData.timeCannotBeEmpty'), trigger: 'blur' }
        ]
      },
      prodsSelectVisible: false,
      visible: false
    }
  },
  components: {
    ImgUpload,
    ProdsSelect
  },
  methods: {
    // 获取分类数据 formType true:推荐报表
    init (id, fromType) {
      this.visible = true
      this.dataForm.formId = id || 0
      this.$nextTick(() => {
        this.prodsSelectVisible = false
        this.dataForm.formName = ''
        this.dataForm.content = ''
        this.dataForm.fromType = 1
        this.dataForm.timeType = 1
        this.dataForm.timeFormat = 1
        this.dataForm.formItemIds = ''
        this.dataForm.timeRamge = 1
        this.dataForm.seq = 1
        this.dataForm.time = ''
        this.dataForm.startTime = ''
        this.dataForm.endTime = ''
        this.formItemListSelect = []
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.formId) {
        // 获取产品数据
        this.$http({
          url: this.$http.adornUrl(`/platform/form/info/${this.dataForm.formId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          if (fromType) {
            this.dataForm.recommendForm = fromType
            this.dataForm.formId = 0
          }
          if (this.dataForm.timeType === 2) {
            this.dateWeek = this.dataForm.startTime
          } else {
            this.dataForm.time = this.dataForm.startTime && this.dataForm.endTime ? [moment(this.dataForm.startTime, 'YYYY-MM-DD'), moment(this.dataForm.endTime, 'YYYY-MM-DD')] : []
          }
          this.getFormItem()
        })
      } else {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.recommendForm = fromType
          this.dataForm.imgUrl = ''
          this.relation = null
        })
        this.getFormItem()
      }
    },
    Week () {
      let date = new Date(this.dateWeek)
      // console.log('startTime:', moment(date).add(-1, 'd').format('YYYY-MM-DD hh:mm:ss'))
      // console.log('endTime:', moment(date).add(5, 'd').format('YYYY-MM-DD hh:mm:ss'))
      this.dataForm.startTime = moment(date).add(-1, 'd').format('YYYY-MM-DD hh:mm:ss')
      this.dataForm.endTime = moment(date).add(5, 'd').format('YYYY-MM-DD hh:mm:ss')
    },
    seqChange () {
      if (!this.dataForm.seq) {
        this.dataForm.seq = 1
      }
    },
    /**
     * 获取报表项数据
     */
    getFormItem () {
      this.$http({
        url: this.$http.adornUrl('/platform/form/getFormItem'),
        method: 'get',
        params: this.$http.adornParams({
          type: 1
        })
      }).then(({ data }) => {
        this.formItemList = data
        if (this.dataForm.formItemIds) {
          let ids = this.dataForm.formItemIds.split(',')
          this.formItemList.forEach(element => {
            if (ids.indexOf(element.id.toString()) > -1) {
              element.select = true
              this.formItemListSelect.push(element)
            }
          })
        }
      })
    },
    /**
     * 指定时间范围输入框验证
     */
    setTimeRamge () {
      let num = Math.round(this.dataForm.timeRamge)
      this.dataForm.timeRamge = num < 1 ? 1 : num
      if (num >= 100000000) {
        this.dataForm.timeRamge = 100000000
      }
    },
    /**
     * 选择开始时间/结束时间触发事件
     */
    daterangeChange (e) {
      if (e) {
        this.$set(this.dataForm, 'time', [e[0], e[1]])
      } else {
        this.$set(this.dataForm, 'time', [])
      }
      this.$forceUpdate()
    },
    /**
     * 选择报表项
     */
    selectItem (id, isTrue) {
      this.formItemListSelect = []
      this.formItemList.forEach(element => {
        if (element.id === id) {
          element.select = !element.select
        }
        if (element.select) {
          this.formItemListSelect.push(element)
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.dataForm.recommendForm = false
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // if (this.dataForm.timeFormat === 1 && (!this.dataForm.time || !this.dateWeek)) {
          //   this.$message.error(this.$i18n.t('formData.timeCannotBeEmpty'))
          //   return
          // }
          if (this.formItemListSelect.length < 1) {
            this.$message.error(this.$i18n.t('formData.pleaseSelectAnIndicator'))
            return
          }
          if (!this.isSubmit) {
            return true
          }
          if (this.dataForm.timeFormat === 1) {
            if (this.dataForm.timeType === 1 || this.dataForm.timeType === 3) {
              this.dataForm.startTime = moment(this.dataForm.time[0]).format('YYYY-MM-DD hh:mm:ss')
              this.dataForm.endTime = moment(this.dataForm.time[1]).format('YYYY-MM-DD hh:mm:ss')
            }
          }
          this.isSubmit = false
          this.dataForm.formItemIds = this.getFormItemIds()
          let param = this.dataForm
          this.$http({
            url: this.$http.adornUrl('/platform/form'),
            method: param.formId ? 'put' : 'post',
            data: this.$http.adornData(param)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('remindPop.succeeded'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.isSubmit = true
                this.visible = false
                this.$emit('refreshDataList', this.page)
              }
            })
          }).catch(() => {
            this.isSubmit = true
          })
        }
      })
    },
    /**
     * 获取已选择的报表项id
     */
    getFormItemIds () {
      var ids = ''
      this.formItemListSelect.forEach(item => {
        ids = ids + item.id + ','
      })
      ids = ids.substring(0, ids.length - 1)
      return ids
    },
    // 关闭对话框回调
    closeDialogHandle () {
      this.$refs['dataForm'].resetFields()
    },
    /**
    * 关闭弹窗
    */
    close () {
      this.visible = false
    }
  }
}
</script>
<style lang="scss">
.tag {
  margin: 0px 10px;
}
</style>
