<template>
  <el-dialog
    :title="!dataForm.supplierId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible"  :width="dialogWidth"
    @close="refreshCategoryList()">
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth">
      <el-form-item :label="this.$i18n.t('shop.supplierName')+':'" prop="supplierName">
        <el-input class="input-item" size="small" v-model="dataForm.supplierName" maxlength="50"  show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('shop.tel')+':'" prop="tel">
        <el-input class="input-item" size="small" v-model="dataForm.tel" maxlength="50" ></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('shop.contactName')+':'" prop="contactName">
        <el-input class="input-item" size="small" v-model="dataForm.contactName" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('shop.contactTel')+':'" prop="contactTel">
        <el-input class="input-item" size="small" v-model="dataForm.contactTel" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('shop.qq')+':'" prop="qqNumber">
        <el-input class="input-item" size="small" v-model="dataForm.qqNumber" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('shop.weChatNumber')+':'" prop="wxNumber">
        <el-input class="input-item" size="small" v-model="dataForm.wxNumber" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('shop.mailbox')+':'" prop="mail">
        <el-input class="input-item" size="small" v-model="dataForm.mail" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('shop.fax')+':'" prop="fax">
        <el-input class="input-item" size="small" v-model="dataForm.fax" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('sys.areaName')+':'" prop="province">
        <el-form-item prop="province">
          <el-select size="small" v-model="dataForm.provinceId" :placeholder="this.$i18n.t('tip.select')" @change="selectProvince">
            <el-option
              v-for="province in provinceList"
              :key="province.areaId"
              :label="province.areaName"
              :value="province.areaId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="city">
            <el-select size="small" v-model="dataForm.cityId" :placeholder="this.$i18n.t('tip.select')" @change="selectCity">
              <el-option
                v-for="city in cityList"
                :key="city.areaId"
                :label="city.areaName"
                :value="city.areaId">
              </el-option>
            </el-select>
          </el-form-item>
        <el-form-item prop="area">
            <el-select size="small" v-model="dataForm.areaId" :placeholder="this.$i18n.t('tip.select')">
              <el-option
                v-for="area in areaList"
                :key="area.areaId"
                :label="area.areaName"
                :value="area.areaId">
              </el-option>
            </el-select>
          </el-form-item>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('address.detailed')+':'" prop="addr">
        <el-input class="addr-input" size="small" v-model="dataForm.addr" maxlength="1000"></el-input>
      </el-form-item>
        <el-form-item :label="this.$i18n.t('shop.supplierCategoryName')+':'" prop="name">
          <div style="display: flex">
            <el-form-item prop="name">
              <el-select size="small" v-model="dataForm.supplierCategoryId" clearable :placeholder="this.$i18n.t('tip.select')">
                <el-option
                  v-for="category in categoryList"
                  :key="category.supplierCategoryId"
                  :label="category.name"
                  :value="category.supplierCategoryId"
                  :disabled="category.status === 0">
                </el-option>
              </el-select>
            </el-form-item>
            <!--新建/刷新-->
            <div class="create-refresh-btn">
              <div class="default-btn text-btn" @click.stop="addOrUpdateHandle()">{{$t('admin.newConstruction')}}</div>
              <el-divider direction="vertical"/>
              <div class="default-btn text-btn" @click="listCategory()">{{$t('admin.refresh')}}</div>
            </div>
          </div>
        </el-form-item>
      <div/>
      <el-form-item :label="this.$i18n.t('product.status')+':'" prop="status">
        <template>
          <el-radio v-model="dataForm.status" :label="1">{{$t("groups.startUsing")}}</el-radio>
          <el-radio v-model="dataForm.status" :label="0">{{$t("publics.disable")}}</el-radio>
        </template>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"></add-or-update>
  </el-dialog>
</template>

<script>
  import { setDialogWidth, widthChange } from '@/utils/setDialogWidth'
  import { isMobile, isPhone, isEmail } from '@/utils/validate'
  import AddOrUpdate from './supplierCategory-add-or-update'
  export default {
    components: {AddOrUpdate},
    data () {
      let validateSupplierName = (rule, value, callback) => {
        if (!value.trim()) {
          callback(new Error(this.$i18n.t('shop.supplierName') + this.$i18n.t('publics.noNull')))
        } else {
          callback()
        }
      }

      var validMobile = (rule, value, callback) => {
        if (value == null || value === '') {
          this.$refs.dataForm.clearValidate('contactTel')
          callback()
        } else if (!isMobile(value)) {
          callback(new Error(localStorage.getItem('lang') === 'zh_CN' ? '请输入正确的手机号' : 'Please enter valid mobile'))
        } else {
          callback()
        }
      }

      var validMail = (rule, value, callback) => {
        if (value == null || value === '') {
          this.$refs.dataForm.clearValidate('mail')
          callback()
        } else if (!isEmail(value)) {
          callback(new Error(this.$i18n.t('shopProcess.emailErrorTips')))
        } else {
          callback()
        }
      }

      var validPhone = (rule, value, callback) => {
        if (value == null || value === '') {
          this.$refs.dataForm.clearValidate('tel')
          callback()
        } else if (!isPhone(value)) {
          callback(new Error(localStorage.getItem('lang') === 'zh_CN' ? '请输入正确的座机号' : 'Please enter valid phone number'))
        } else {
          callback()
        }
      }
      var validateQq = (rule, value, callback) => {
        if (value == null || value === '') {
          this.$refs.dataForm.clearValidate('qqNumber')
          callback()
        } else if (!/[1-9][0-9]{4,14}/.test(value)) {
          callback(new Error(localStorage.getItem('lang') === 'zh_CN' ? '请输入正确的QQ号' : 'Please enter valid qq'))
        } else {
          callback()
        }
      }

      var validateWx = (rule, value, callback) => {
        if (value == null || value === '') {
          this.$refs.dataForm.clearValidate('wxNumber')
          callback()
        } else if (!/^[a-zA-Z][a-zA-Z\d_-]{5,19}$/.test(value)) {
          callback(new Error(localStorage.getItem('lang') === 'zh_CN' ? '请输入正确的微信号' : 'Please enter valid wx'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        addOrUpdateVisible: false,
        dataForm: {
          refundAddrId: null,
          supplierId: null,
          shopId: null,
          supplierName: null,
          tel: null,
          provinceId: null,
          province: null,
          cityId: null,
          city: null,
          areaId: null,
          area: null,
          addr: null,
          contactName: null,
          contactTel: null,
          qqNumber: null,
          wxNumber: null,
          mail: null,
          fax: null,
          createTime: null,
          updateTime: null,
          status: 1,
          categoryName: null,
          supplierCategoryId: null
        },
        addrInfoList: [],
        provinceList: [],
        categoryList: [],
        cityList: [],
        areaList: [],
        dataRule: {
          supplierName: [
            { required: true, message: this.$i18n.t('shop.supplierName') + this.$i18n.t('publics.noNull'), trigger: 'blur' },
            {validator: validateSupplierName, trigger: 'blur'}
          ],
          tel: [
            { validator: validPhone, trigger: ['blur'] }
          ],
          contactTel: [
            { validator: validMobile, trigger: ['blur'] }
          ],
          mail: [
            { validator: validMail, trigger: ['blur'] }
          ],
          qqNumber: [
            { validator: validateQq, trigger: ['blur'] }
          ],
          wxNumber: [
            { validator: validateWx, trigger: ['blur'] }
          ]
        },
        dialogWidth: '',
        defWidth: 815,
        labelWidth: localStorage.getItem('lang') === 'en' ? '130px' : '100px'
      }
    },
    created () {
      this.dialogWidth = setDialogWidth(this.defWidth)
    },
    mounted () {
      widthChange(this, this.defWidth)
    },
    methods: {
      async init (supplierId) {
        this.dataForm.supplierId = supplierId || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.cityList = []
          this.areaList = []
          this.dataForm.provinceId = null
          this.dataForm.cityId = null
          this.dataForm.areaId = null
          this.dataForm.supplierCategoryId = null
        })
        // this.listAreaByParentId().then(({data}) => {
        //   this.provinceList = data
        // })
        this.listCategory()
        // 等待地址信息返回
        this.addrInfoList = await this.getAreaListInfo()
        this.provinceList = this.addrInfoList
        if (this.dataForm.supplierId) {
          this.$http({
            url: this.$http.adornUrl('/supplier/supplier/info/' + this.dataForm.supplierId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.dataForm = data
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
            // this.listAreaByParentId(data.provinceId).then(({data}) => {
            //   this.cityList = data
            // })
            // this.listAreaByParentId(data.cityId).then(({data}) => {
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
      // 新增 / 修改
      addOrUpdateHandle () {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.getAreaName()
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/supplier/supplier'),
              method: this.dataForm.supplierId ? 'put' : 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
              this.$message({
                message: this.$i18n.t('publics.operation'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            })
          }
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
        // this.listAreaByParentId(val).then(({data}) => {
        //   this.cityList = data
        // })
      },
      // 选择市
      selectCity (val) {
        this.dataForm.areaId = null
        this.dataForm.area = ''
        // 获取区的select
        this.areaList = this.getCurrentChild(this.cityList, val)
        // this.listAreaByParentId(val).then(({data}) => {
        //   this.areaList = data
        // })
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
      /**
       * 通过省市区id,得到省市区名称
       */
      getAreaName () {
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
      },
      listCategory () {
        this.$http({
          url: this.$http.adornUrl(`/supplier/supplierCategory/list`),
          method: 'get',
          params: {
            isAll: 1
          }
        }).then(({data}) => {
          this.categoryList = data
        })
      },
      refreshCategoryList () {
        this.$emit('refreshCategoryList')
      }
    }
  }
</script>
<style scoped>
.input-item {
  width: 240px;
}
.addr-input {
  width: 600px;
}
</style>
