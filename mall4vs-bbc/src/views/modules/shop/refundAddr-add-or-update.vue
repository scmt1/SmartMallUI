<template>
  <el-dialog
    :title="
      !dataForm.refundAddrId
        ? this.$i18n.t('shop.newShipAdd')
        : this.$i18n.t('shop.modifyShipAdd')
    "
    :close-on-click-modal="false"
    :visible.sync="visible"
    :width="dialogWidth"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      :inline="true"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item
        class="addressee"
        :label="this.$i18n.t('publics.addressee')"
        prop="receiverName"
        :label-width="labelWidth"
      >
        <el-input
          v-model="dataForm.receiverName"
          :placeholder="this.$i18n.t('shop.consigneeName')"
          maxlength="30"
          size="small"
          style="width: 250px"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item
        :label="this.$i18n.t('publics.mobilePhone')"
        prop="receiverMobile"
        :label-width="labelWidth"
      >
        <el-input
          v-model="dataForm.receiverMobile"
          maxlength="11"
          style="width: 250px"
          size="small"
          :placeholder="this.$i18n.t('publics.mobilePhone')"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="mobilePhone"
        :label="this.$i18n.t('shop.companyLandline')"
        prop="receiverTelephone"
        :label-width="labelWidth"
      >
        <el-input
          v-model="dataForm.receiverTelephone"
          maxlength="36"
          size="small"
          style="width: 250px"
          show-word-limit
          :placeholder="this.$i18n.t('shop.companyLandline')"
        ></el-input>
      </el-form-item>
      <el-form-item :label-width="labelWidth" :label="this.$i18n.t('address.postalCode')" prop="postCode">
        <el-input
          v-model="dataForm.postCode"
          size="small"
          style="width: 250px"
          :placeholder="this.$i18n.t('address.postalCode')"
          maxlength="9"
        ></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('address.province')" prop="province" :label-width="labelWidth">
        <el-col :span="8">
          <el-form-item prop="province">
            <el-select
              v-model="dataForm.provinceId"
              size="small"
              :placeholder="this.$i18n.t('tip.select')"
              @change="selectProvince"
              style="width: 150px"
            >
              <el-option
                v-for="province in provinceList"
                :key="province.areaId"
                :label="province.areaName"
                :value="province.areaId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="city">
            <el-select
              v-model="dataForm.cityId"
              size="small"
              :placeholder="this.$i18n.t('tip.select')"
              @change="selectCity"
              style="width: 150px"
            >
              <el-option
                v-for="city in cityList"
                :key="city.areaId"
                :label="city.areaName"
                :value="city.areaId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="area">
            <el-select
              v-model="dataForm.areaId"
              size="small"
              :placeholder="this.$i18n.t('tip.select')"
              style="width: 150px"
            >
              <el-option
                v-for="area in areaList"
                :key="area.areaId"
                :label="area.areaName"
                :value="area.areaId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label-width="labelWidth" :label="this.$i18n.t('address.detailed')" prop="addr">
        <el-input
          v-model="dataForm.addr"
          size="small"
          :placeholder="this.$i18n.t('address.detailed')"
          maxlength="50"
          style="width: 600px"
        ></el-input>
      </el-form-item>
      <el-form-item :label-width="labelWidth" :label="this.$i18n.t('address.defaultAddr')" prop="">
        <el-checkbox v-model="defaultAddr">{{ this.$i18n.t('address.defaultAddr') }}</el-checkbox>
      </el-form-item>

      <!-- <el-form-item :label="this.$i18n.t('publics.default')" prop="postCode">
        <el-radio-group v-model="dataForm.defaultAddr">
          <el-radio :label="1">{{ $t("publics.yes") }}</el-radio>
          <el-radio :label="0">{{ $t("publics.no") }}</el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{ $t("crud.filter.cancelBtn") }}</div>
      <div @click="dataFormSubmit()" class="default-btn primary-btn">{{ $t("crud.filter.submitBtn") }}</div>
    </span>
  </el-dialog>
</template>

<script>
import { setDialogWidth, widthChange } from '@/utils/setDialogWidth'
import { Debounce } from '@/utils/debounce'
export default {
  data () {
    var validateReceiverName = (rule, value, callback) => {
      if (!value.trim()) {
        this.dataForm.receiverName = ''
        callback(new Error(this.$i18n.t('shop.coneeNameCanEmpty')))
      } else {
        callback()
      }
    }
    var validatePhone = (rule, value, callback) => {
      if (!this.checkPhonePrefix()) {
        callback(new Error(this.$i18n.t('shop.pleeNormaeNumF')))
      } else {
        callback()
      }
    }
    var validateAddr = (rule, value, callback) => {
      if (!value.trim()) {
        this.dataForm.addr = ''
        callback(new Error(this.$i18n.t('shop.addressCannotBeEmpty')))
      } else {
        callback()
      }
    }
    var validateNumber = (rule, value, callback) => {
      if (value && !/^[1-9]\d*$/.test(value)) {
        callback(new Error(this.$i18n.t('shop.pleaseInputNumber')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      defaultAddr: false,
      addrInfoList: [],
      provinceList: [],
      cityList: [],
      areaList: [],
      dataForm: {
        refundAddrId: null,
        addrId: 0,
        addr: '',
        receiverName: '',
        receiverMobile: '',
        receiverTelephone: '',
        postCode: '',
        area: '',
        city: '',
        province: '',
        areaId: null,
        cityId: null,
        provinceId: null,
        defaultAddr: 0
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataRule: {
        receiverName: [
          { required: true, message: this.$i18n.t('shop.coneeNameCanEmpty'), trigger: 'blur' },
          {validator: validateReceiverName, trigger: 'blur'}
        ],
        addr: [{ required: true, message: this.$i18n.t('shop.addressCannotBeEmpty'), trigger: 'blur' },
        {validator: validateAddr, trigger: 'blur'}
        ],
        city: [{ required: true, message: this.$i18n.t('shop.cityCannotBeEmpty'), trigger: 'blur' }],
        province: [
          { required: true, message: this.$i18n.t('shop.provinceCannotBeEmpty'), trigger: 'blur' }
        ],
        area: [{ required: true, message: this.$i18n.t('shop.districtCounEmpty'), trigger: 'blur' }],
        receiverMobile: [
          { required: true, message: this.$i18n.t('sys.mobilePhoneNoNull'), trigger: 'blur' },
          {validator: validatePhone, trigger: 'blur'}
        ],
        receiverTelephone: [ {validator: validateNumber, trigger: 'blur'} ],
        postCode: [ {validator: validateNumber, trigger: 'blur'} ]
      },
      dialogWidth: '',
      defWidth: localStorage.getItem('lang') === 'en' ? 850 : 750,
      labelWidth: localStorage.getItem('lang') === 'en' ? '130px' : '80px',

      // 正在提交
      isSubmitting: false
    }
  },
  created () {
    this.dialogWidth = setDialogWidth(this.defWidth)
  },
  mounted () {
    widthChange(this, this.defWidth)
  },
  methods: {
    async init (id) {
      this.defaultAddr = false
      this.dataForm.refundAddrId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.cityList = []
        this.areaList = []
        this.dataForm.provinceId = null
        this.dataForm.cityId = null
        this.dataForm.areaId = null
      })
      // 等待地址信息返回
      this.addrInfoList = await this.getAreaListInfo()
      this.provinceList = this.addrInfoList
      // this.listAreaByParentId().then(({ data }) => {
      //   this.provinceList = data
      // })
      if (this.dataForm.refundAddrId) {
        this.$http({
          url: this.$http.adornUrl(
            `/shop/refundAddr/info/${this.dataForm.refundAddrId}`
          ),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm.addr = data.addr
          this.dataForm.receiverMobile = data.receiverMobile
          this.dataForm.receiverTelephone = data.receiverTelephone
          this.dataForm.areaId = data.areaId
          this.dataForm.cityId = data.cityId
          this.dataForm.provinceId = data.provinceId
          this.dataForm.receiverName = data.receiverName
          this.dataForm.postCode = data.postCode
          this.dataForm.defaultAddr = data.defaultAddr
          this.defaultAddr = data.defaultAddr === 1
          // 筛选出当前的市和区列表
          for (const proItem of this.addrInfoList) {
            if (proItem.areaId === this.dataForm.provinceId) {
              this.cityList = proItem.areas
              for (const cityItem of this.cityList) {
                if (cityItem.areaId === this.dataForm.cityId) {
                  this.areaList = cityItem.areas
                  break
                }
              }
              break
            }
          }
          // this.listAreaByParentId(data.provinceId).then(({ data }) => {
          //   this.cityList = data
          // })
          // this.listAreaByParentId(data.cityId).then(({ data }) => {
          //   this.areaList = data
          // })
        })
      }
    },
    // 获取地址列表
    getAreaListInfo () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/admin/area/areaListInfo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          console.log(data)
          resolve(data)
        })
      })
    },
    listAreaByParentId (pid) {
      let paramData = {}
      if (!pid) {
        paramData = {level: 1}
      } else {
        paramData = {pid}
      }
      return this.$http({
        url: this.$http.adornUrl(`/admin/area/listByPid`),
        method: 'get',
        params: this.$http.adornParams(paramData)
      })
    },
    getCurrentChild (curList, curId) {
      for (const item of curList) {
        if (item.areaId === curId) {
          return item.areas
        }
      }
    },
    // 选择省
    selectProvince (val) {
      this.dataForm.cityId = null
      this.dataForm.city = ''
      this.dataForm.areaId = null
      this.areaList = []
      // 获取城市的select
      this.cityList = this.getCurrentChild(this.provinceList, val)
      // this.listAreaByParentId(val).then(({ data }) => {
      //   this.cityList = data
      // })
    },
    checkPhonePrefix () {
      if (this.dataForm.receiverMobile) {
        // var reg = /^[0-9]*$/
        var reg = /^1[3456789]\d{9}$/
        if (!reg.test(this.dataForm.receiverMobile)) {
          return false
        }
      }
      return true
    },
    // 选择市
    selectCity (val) {
      this.dataForm.areaId = null
      this.dataForm.area = ''
      // 获取区的select
      this.areaList = this.getCurrentChild(this.cityList, val)
      // this.listAreaByParentId(val).then(({ data }) => {
      //   this.areaList = data
      // })
    },
    // 表单提交
    dataFormSubmit: Debounce(function () {
      for (let i = 0; i < this.provinceList.length; i++) {
        if (this.provinceList[i].areaId === this.dataForm.provinceId) {
          // 将省名字保存起来
          this.dataForm.province = this.provinceList[i].areaName
        }
      }
      for (let i = 0; i < this.cityList.length; i++) {
        if (this.cityList[i].areaId === this.dataForm.cityId) {
          // 将市名字保存起来
          this.dataForm.city = this.cityList[i].areaName
        }
      }
      for (let i = 0; i < this.areaList.length; i++) {
        if (this.areaList[i].areaId === this.dataForm.areaId) {
          // 将市名字保存起来
          this.dataForm.area = this.areaList[i].areaName
        }
      }
      // 将是否设为默认地址保存起来
      this.dataForm.defaultAddr = this.defaultAddr ? 1 : 0
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.isSubmitting) {
            return
          }
          this.isSubmitting = true
          this.$http({
            url: this.$http.adornUrl(`/shop/refundAddr`),
            method: this.dataForm.refundAddrId ? 'put' : 'post',
            data: this.$http.adornData({
              refundAddrId: this.dataForm.refundAddrId || undefined,
              addr: this.dataForm.addr,
              receiverName: this.dataForm.receiverName,
              receiverMobile: this.dataForm.receiverMobile,
              receiverTelephone: this.dataForm.receiverTelephone,
              area: this.dataForm.area,
              city: this.dataForm.city,
              province: this.dataForm.province,
              areaId: this.dataForm.areaId,
              cityId: this.dataForm.cityId,
              provinceId: this.dataForm.provinceId,
              postCode: this.dataForm.postCode,
              defaultAddr: this.dataForm.defaultAddr
            })
          }).then(({ data }) => {
            this.isSubmitting = false
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList', this.page)
              }
            })
          }).catch((error) => {
            console.log('err', error)
            this.isSubmitting = false
          })
        }
      })
    }, 1500)
  }
}
</script>
<style scoped>
.addressee >>> .el-input__inner {
  padding-right: 45px !important;
}
.mobilePhone >>> .el-input__inner {
  padding-right: 45px !important;
}
.v-modal {
  z-index: 2001 !important;
}
</style>
