<template>
  <el-dialog :title="!dataForm.addrId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item :label="this.$i18n.t('publics.name')"
                    prop="addrName">
        <el-input v-model="dataForm.addrName"
                  :placeholder="this.$i18n.t('station.stationNames')"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('address.province')">
        <el-col :span="8">
          <el-form-item prop="province">
            <el-select v-model="dataForm.provinceId"
                       :placeholder="this.$i18n.t('tip.select')"
                       @change="selectProvince">
              <el-option v-for="province in provinceList"
                         :key="province.areaId"
                         :label="province.areaName"
                         :value="province.areaId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="city">
            <el-select v-model="dataForm.cityId"
                       :placeholder="this.$i18n.t('tip.select')"
                       @change="selectCity">
              <el-option v-for="city in cityList"
                         :key="city.areaId"
                         :label="city.areaName"
                         :value="city.areaId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="area">
            <el-select v-model="dataForm.areaId"
                       :placeholder="this.$i18n.t('tip.select')">
              <el-option v-for="area in areaList"
                         :key="area.areaId"
                         :label="area.areaName"
                         :value="area.areaId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('address.addr')"
                    prop="addr">
        <el-input v-model="dataForm.addr"
                  :placeholder="this.$i18n.t('address.addr')"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('distribution.phoneNum')"
                    prop="mobile">
        <el-input v-model="dataForm.mobile"
                  :placeholder="this.$i18n.t('distribution.phoneNum')"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">{{$t("crud.filter.cancelBtn")}}</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isMobile } from '@/utils/validate'

export default {
  data () {
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error(this.$i18n.t('sys.mobilePhoneError')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      // 地址信息
      addrInfoList: [],
      provinceList: [],
      cityList: [],
      areaList: [],
      dataForm: {
        addrId: 0,
        addr: '',
        addrName: '',
        mobile: '',
        area: '',
        city: '',
        province: '',
        areaId: null,
        cityId: null,
        provinceId: null
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataRule: {
        addrName: [
          { required: true, message: this.$i18n.t('admin.stationNameNoNull'), trigger: 'blur' }
        ],
        addr: [{ required: true, message: this.$i18n.t('admin.addrNoNull'), trigger: 'blur' }],
        city: [{ required: true, message: this.$i18n.t('shop.cityCannotBeEmpty'), trigger: 'blur' }],
        province: [
          { required: true, message: this.$i18n.t('shop.provinceCannotBeEmpty'), trigger: 'blur' }
        ],
        area: [{ required: true, message: this.$i18n.t('shop.districtCounEmpty'), trigger: 'blur' }],
        mobile: [
          { required: true, message: this.$i18n.t('sys.mobilePhoneNoNull'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async init (id) {
      this.dataForm.addrId = id || 0
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
      if (this.dataForm.addrId) {
        this.$http({
          url: this.$http.adornUrl(
            `/shop/pickAddr/info/${this.dataForm.addrId}`
          ),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm.addr = data.addr
          this.dataForm.mobile = data.mobile
          this.dataForm.addrName = data.addrName
          this.dataForm.areaId = data.areaId
          this.dataForm.cityId = data.cityId
          this.dataForm.provinceId = data.provinceId
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
      // 获取城市的select
      this.cityList = this.getCurrentChild(this.provinceList, val)
      // this.listAreaByParentId(val).then(({ data }) => {
      //   this.cityList = data
      // })
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
    dataFormSubmit () {
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/shop/pickAddr`),
            method: this.dataForm.addrId ? 'put' : 'post',
            data: this.$http.adornData({
              addrId: this.dataForm.addrId || undefined,
              addr: this.dataForm.addr,
              addrName: this.dataForm.addrName,
              mobile: this.dataForm.mobile,
              area: this.dataForm.area,
              city: this.dataForm.city,
              province: this.dataForm.province,
              areaId: this.dataForm.areaId,
              cityId: this.dataForm.cityId,
              provinceId: this.dataForm.provinceId
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
          })
        }
      })
    }
  }
}
</script>
