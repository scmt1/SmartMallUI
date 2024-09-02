<template>
    <el-dialog class="luckyDrawAdd" :title="!dataForm.id ? this.$i18n.t('sysManagement.add') : this.$i18n.t('sysManagement.modify')" :close-on-click-modal="false"
               :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
            <el-form-item label="活动名称" prop="drawName">
                <el-input v-model="dataForm.drawName" size="small" placeholder="请输入活动标题"></el-input>
            </el-form-item>
            <el-form-item label="活动开始时间" prop="startTime">
                <el-date-picker
                        v-model="dataForm.startTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="请选择开始时间"
                ></el-date-picker>
                <el-input v-model="dataForm.address" size="small" placeholder="请输入活动地址"></el-input>
            </el-form-item>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="活动logo" prop="logo">
                        <div class="license-content">
                            <img-upload v-model="dataForm.logo" @input="imgChange(dataForm.logo, 'logo', 'dataForm')"/>
                        </div>
                        <div class="upload-tips">{{ $t('shopProcess.logoTips') }}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="活动人数" prop="personCount">
                        <el-input-number v-model="dataForm.personCount" size="small" style="width: 100%" placeholder="请输入活动人数"></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="是否店铺活动" prop="isShop">
                        <el-select v-model="dataForm.isShop" placeholder="请选择是否店铺活动" style="width: 100%;">
                            <el-option label="否" value="0"></el-option>
                            <el-option label="是" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="dataForm.isShop == 1">
                    <el-form-item label="店铺" prop="shopId">
                        <el-select v-model="dataForm.shopId" placeholder="请选择店铺" style="width: 100%;">
                            <el-option
                                v-for="item in shopList"
                                :key="item.shopId"
                                :label="item.shopName"
                                :value="item.shopId"
                                :disabled="item.isShopActivity">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="主办方" prop="sponsor">
                        <el-input v-model="dataForm.sponsor" size="small" placeholder="请输入主办方"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="活动类别" prop="type">
                        <el-select v-model="dataForm.type" placeholder="请选择活动类别" style="width: 100%;">
                            <el-option
                                v-for="(item,index) in typeList"
                                :key="index"
                                :label="item.title"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="活动开始时间" prop="startTime">
                        <el-date-picker v-model="dataForm.startTime" type="datetime" placeholder="选择日期时间" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="活动结束时间" prop="endTime">
                        <el-date-picker v-model="dataForm.endTime" type="datetime" placeholder="选择日期时间" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="活动类别" prop="activityType">
                        <el-select v-model="dataForm.activityType" placeholder="请选择活动类别" style="width: 100%;">
                            <el-option
                                    v-for="(item,index) in activityTypeList"
                                    :key="index"
                                    :label="item.title"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否发布" prop="isRelease">
                        <el-select v-model="dataForm.isRelease" placeholder="请选择是否发布" style="width: 100%;">
                            <el-option label="否" value="0"></el-option>
                            <el-option label="是" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="活动内容" prop="content">
                <tiny-mce v-model="dataForm.content" ref="content" style="width: 100%" v-if="contentShow"></tiny-mce>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false, contentShow=false">{{ $t('coupon.cancel') }}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{ $t('coupon.confirm') }}</div>
    </span>
    </el-dialog>
</template>

<script>

export default {
    components: {},
    data () {
        return {
            contentShow: false,
            visible: false,
            isSubmit: false,
            roleList: [],
            dataForm: {
                title: '',
                address: '',
                sponsor: '',
                type: '',
                startTime: '',
                endTime: '',
                content: '',
                logo: '',
                personCount: '',
                isShop: '',
                shopId: '',
                isRelease: '',
                activityType: ''
            },
            dataRule: {
                personCount: [
                    {required: true, message: '活动人数不能为空', trigger: 'blur'}
                ],
                title: [
                    {required: true, message: '活动名称不能为空', trigger: 'blur'}
                ],
                address: [
                    {required: true, message: '活动地址不能为空', trigger: 'blur'}
                ],
                type: [
                    {required: true, message: '活动类别不能为空', trigger: 'change'}
                ],
                sponsor: [
                    {required: true, message: '主办方不能为空', trigger: 'blur'}
                ],
                startTime: [
                    {required: true, message: '活动开始时间不能为空', trigger: 'blur'}
                ],
                endTime: [
                    {required: true, message: '活动结束时间不能为空', trigger: 'blur'}
                ],
                content: [
                    {required: true, message: '活动内容不能为空', trigger: 'blur'}
                ],
                logo: [
                    {required: true, message: '请上传logo', trigger: ['blur', 'change']}
                ],
                isShop: [
                    {required: true, message: '请选择是否店铺活动', trigger: 'change'}
                ],
                shopId: [
                    {required: true, message: '请选择店铺', trigger: 'change'}
                ],
                isRelease: [
                    {required: true, message: '请选择是否发布', trigger: 'change'}
                ],
                activityType: [
                    {required: true, message: '请选择活动类型', trigger: 'change'}
                ]
            },
            typeList: [],
            activityTypeList: [],
            shopList: []
        }
    },
    methods: {
        // 获取活动类别
        getActivityCategoryList () {
            let type = 'activity_category'
            this.$http({
                url: this.$http.adornUrl(`/sys/dictData/getByType/${type}`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.typeList = data
            })
        },
        // 获取店铺类型
        getActivityTypeList () {
            let type = 'activity_type'
            this.$http({
                url: this.$http.adornUrl(`/sys/dictData/getByType/${type}`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.activityTypeList = data
            })
        },
        // 获取所有营业店铺
        getShopList () {
            this.$http({
                url: this.$http.adornUrl('/platform/shopDetail/getAllShop'),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.shopList = data
            })
        },
        imgChange (value, prop, formName) {
            if (value) {
                this.$refs[formName].validateField(prop)
            }
            this.$nextTick(() => {
                this.$forceUpdate()
            })
        },
        init (id) {
            this.dataForm.id = id || 0
            this.isSubmit = false
            this.visible = true
            this.getActivityCategoryList()
            this.getActivityTypeList()
            this.getShopList()
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/admin/activity/info/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({data}) => {
                        this.dataForm = data
                        this.dataForm.activityType = this.dataForm.activityType.toString()
                        this.dataForm.isRelease = this.dataForm.isRelease.toString()
                        this.dataForm.isShop = this.dataForm.isShop.toString()
                        this.contentShow = true
                    })
                } else {
                    this.dataForm.shopId = ''
                    this.contentShow = true
                }
            })
        },
        // 表单提交
        dataFormSubmit () {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    if (this.isSubmit) {
                        return false
                    }
                    this.isSubmit = true
                    this.$http({
                        url: this.$http.adornUrl(`/admin/activity`),
                        method: this.dataForm.id ? 'put' : 'post',
                        data: this.$http.adornData(this.dataForm)
                    }).then(({data}) => {
                        this.$message({
                            message: this.$i18n.t('publics.operation'),
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.visible = false
                                this.contentShow = false
                                this.$emit('refreshDataList')
                            }
                        })
                    }).catch((e) => {
                        this.isSubmit = false
                        this.contentShow = false
                    })
                }
            })
        },

    }
}
</script>
<style lang="scss">
.luckyDrawAdd {
    .el-dialog {
        min-width: 740px;
    }

    .mce-branding .mce-widget .mce-label .mce-flow-layout-item .mce-last {
        display: none !important;
    }

    .plugin-images .el-upload--picture-card {
        width: 200px !important;
        height: 130px !important;
        margin: 0 !important;
        line-height: 130px !important;
    }

    .license-content {
        display: flex;

        & .single-image-upload {
            height: 130px;

            & > > > .el-upload-list--picture-card .el-upload-list__item {
                width: 200px;
                height: 130px;
                margin: 0;
            }
        }
    }
}
</style>
