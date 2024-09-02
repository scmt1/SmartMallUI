<template>
    <el-dialog
        class="activityEdit"
        :title="
            !dataForm.id
                ? this.$i18n.t('sysManagement.add')
                : this.$i18n.t('sysManagement.modify')
        "
        :close-on-click-modal="false"
        :visible.sync="visible"
    >
        <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            label-width="110px"
        >
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="活动名称" prop="title">
                        <el-input
                            v-model="dataForm.title"
                            size="small"
                            placeholder="请输入活动标题"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="活动地址" prop="address">
                        <el-input
                            v-model="dataForm.address"
                            size="small"
                            placeholder="请输入活动地址"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="活动logo" prop="logo">
                        <div class="license-content">
                            <img-upload
                                v-model="dataForm.logo"
                                @input="
                                    imgChange(dataForm.logo, 'logo', 'dataForm')
                                "
                            />
                        </div>
                        <div class="upload-tips">
                            {{ $t("shopProcess.logoTips") }}
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="活动人数" prop="personCount">
                        <el-input-number
                            v-model="dataForm.personCount"
                            size="small"
                            style="width: 100%"
                            placeholder="请输入活动人数"
                        ></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="是否店铺活动" prop="isShop">
                        <el-select
                            v-model="dataForm.isShop"
                            placeholder="请选择是否店铺活动"
                            style="width: 100%"
                        >
                            <el-option label="否" value="0"></el-option>
                            <el-option label="是" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="dataForm.isShop == 1">
                    <el-form-item label="店铺" prop="shopId">
                        <el-select
                            v-model="dataForm.shopId"
                            placeholder="请选择店铺"
                            style="width: 100%"
                        >
                            <el-option
                                v-for="item in shopList"
                                :key="item.shopId"
                                :label="item.shopName"
                                :value="item.shopId"
                                :disabled="item.isShopActivity"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="主办方" prop="sponsor">
                        <el-input
                            v-model="dataForm.sponsor"
                            size="small"
                            placeholder="请输入主办方"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="活动类别" prop="type">
                        <el-select
                            v-model="dataForm.type"
                            placeholder="请选择活动类别"
                            style="width: 100%"
                        >
                            <el-option
                                v-for="(item, index) in typeList"
                                :key="index"
                                :label="item.title"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="活动开始时间" prop="startTime">
                        <el-date-picker
                            v-model="dataForm.startTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            style="width: 100%"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="活动结束时间" prop="endTime">
                        <el-date-picker
                            v-model="dataForm.endTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            style="width: 100%"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="活动时间分段" prop="isTimeSign">
                        <el-select
                            v-model="dataForm.isTimeSign"
                            style="width: 100%"
                        >
                            <el-option label="否" value="0"></el-option>
                            <el-option label="是" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 添加时间段列表 -->
            <div v-if="showSectionTime">
                <el-row
                    :gutter="20"
                    v-for="(item, index) in sectionTimeNum"
                    :key="index"
                >
                    <el-col :span="12">
                        <el-form-item :label="`分段时间${index + 1}`" required>
                            <el-date-picker
                                v-model="sectionTimeList[index]"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" style="margin-left: 75px">
                        <el-form-item label="活动人数" required>
                            <el-input-number
                                size="small"
                                style="width: 100%"
                                :min="1"
                                v-model="sectionPeopleList[index]"
                            ></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-button type="primary" class="addButton" @click="addMoreTime"
                    >添加更多时间段</el-button
                >
                <el-button class="delButton" @click="delTime">删除</el-button>
            </div>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="活动类别" prop="activityType">
                        <el-select
                            v-model="dataForm.activityType"
                            placeholder="请选择活动类别"
                            style="width: 100%"
                        >
                            <el-option
                                v-for="(item, index) in activityTypeList"
                                :key="index"
                                :label="item.title"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否发布" prop="isRelease">
                        <el-select
                            v-model="dataForm.isRelease"
                            placeholder="请选择是否发布"
                            style="width: 100%"
                        >
                            <el-option label="否" value="0"></el-option>
                            <el-option label="是" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="活动内容" prop="content">
                <tiny-mce
                    v-model="dataForm.content"
                    ref="content"
                    style="width: 100%"
                    v-if="contentShow"
                ></tiny-mce>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <div
                class="default-btn"
                @click="(visible = false), (contentShow = false)"
            >
                {{ $t("coupon.cancel") }}
            </div>
            <div class="default-btn primary-btn" @click="dataFormSubmit()">
                {{ $t("coupon.confirm") }}
            </div>
        </span>
    </el-dialog>
</template>

<script>
import TinyMce from "@/components/tiny-mce";
import imgUpload from "@/components/img-upload";

export default {
    components: { TinyMce, imgUpload },
    data() {
        return {
            contentShow: false,
            visible: false,
            isSubmit: false,
            roleList: [],
            dataForm: {
                title: "",
                address: "",
                sponsor: "",
                type: "",
                startTime: "",
                endTime: "",
                isTimeSign: "0", // 是否进行活动分段
                content: "",
                logo: "",
                personCount: "",
                isShop: "",
                shopId: "",
                isRelease: "",
                activityType: "",
                activitySigns: [], // 分段时间段
            },
            sectionTimeNum: 1, // 当前分段个数
            showSectionTime: false, // 是否展示分段时间列表
            sectionTimeList: [], // 分段时间列表
            sectionPeopleList: [], // 分段人数列表
            dataRule: {
                personCount: [
                    {
                        required: true,
                        message: "活动人数不能为空",
                        trigger: "blur",
                    },
                ],
                title: [
                    {
                        required: true,
                        message: "活动名称不能为空",
                        trigger: "blur",
                    },
                ],
                address: [
                    {
                        required: true,
                        message: "活动地址不能为空",
                        trigger: "blur",
                    },
                ],
                type: [
                    {
                        required: true,
                        message: "活动类别不能为空",
                        trigger: "change",
                    },
                ],
                sponsor: [
                    {
                        required: true,
                        message: "主办方不能为空",
                        trigger: "blur",
                    },
                ],
                startTime: [
                    {
                        required: true,
                        message: "活动开始时间不能为空",
                        trigger: "blur",
                    },
                ],
                endTime: [
                    {
                        required: true,
                        message: "活动结束时间不能为空",
                        trigger: "blur",
                    },
                ],
                content: [
                    {
                        required: true,
                        message: "活动内容不能为空",
                        trigger: "blur",
                    },
                ],
                logo: [
                    {
                        required: true,
                        message: "请上传logo",
                        trigger: ["blur", "change"],
                    },
                ],
                isShop: [
                    {
                        required: true,
                        message: "请选择是否店铺活动",
                        trigger: "change",
                    },
                ],
                shopId: [
                    {
                        required: true,
                        message: "请选择店铺",
                        trigger: "change",
                    },
                ],
                isRelease: [
                    {
                        required: true,
                        message: "请选择是否发布",
                        trigger: "change",
                    },
                ],
                activityType: [
                    {
                        required: true,
                        message: "请选择活动类型",
                        trigger: "change",
                    },
                ],
                isTimeSign: [
                    {
                        required: true,
                        message: "请选择是否分段",
                        trigger: "blur",
                    },
                ],
            },
            typeList: [],
            activityTypeList: [],
            shopList: [],
        };
    },
    methods: {
        // 获取活动类别
        getActivityCategoryList() {
            let type = "activity_category";
            this.$http({
                url: this.$http.adornUrl(`/sys/dictData/getByType/${type}`),
                method: "get",
                params: this.$http.adornParams(),
            }).then(({ data }) => {
                this.typeList = data;
            });
        },
        // 获取店铺类型
        getActivityTypeList() {
            let type = "activity_type";
            this.$http({
                url: this.$http.adornUrl(`/sys/dictData/getByType/${type}`),
                method: "get",
                params: this.$http.adornParams(),
            }).then(({ data }) => {
                this.activityTypeList = data;
            });
        },
        // 获取所有营业店铺
        getShopList() {
            this.$http({
                url: this.$http.adornUrl("/platform/shopDetail/getAllShop"),
                method: "get",
                params: this.$http.adornParams(),
            }).then(({ data }) => {
                this.shopList = data;
            });
        },
        imgChange(value, prop, formName) {
            if (value) {
                this.$refs[formName].validateField(prop);
            }
            this.$nextTick(() => {
                this.$forceUpdate();
            });
        },
        init(id) {
            this.dataForm.id = id || 0;
            this.isSubmit = false;
            this.visible = true;

            this.sectionTimeNum = 1;
            this.sectionTimeList = [];
            this.sectionPeopleList = [];

            this.getActivityCategoryList();
            this.getActivityTypeList();
            this.getShopList();
            this.$nextTick(() => {
                this.$refs["dataForm"].resetFields();
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(
                            `/admin/activity/info/${this.dataForm.id}`
                        ),
                        method: "get",
                        params: this.$http.adornParams(),
                    }).then(({ data }) => {
                        this.dataForm = data;
                        this.dataForm.activityType =
                            this.dataForm.activityType.toString();
                        this.dataForm.isRelease =
                            this.dataForm.isRelease.toString();
                        this.dataForm.isShop = this.dataForm.isShop.toString();
                        if(this.dataForm.isTimeSign){
                          this.dataForm.isTimeSign =
                            this.dataForm.isTimeSign.toString();
                        }
                        this.contentShow = true;

                        // 活动列表的长度
                        if (this.dataForm.activitySigns.length) {
                            this.sectionTimeNum =
                                this.dataForm.activitySigns.length;
                        }

                        // 转换活动人数列表
                        for (let i = 0; i < this.sectionTimeNum; i++) {
                            this.sectionPeopleList[i] =
                                this.dataForm.activitySigns[i].signTotal;
                        }

                        // 转换分段时间列表
                        this.sectionTimeList = this.dataForm.activitySigns.map(
                            function (activity) {
                                return [activity.endTime, activity.startTime];
                            }
                        );
                    });
                } else {
                    this.dataForm.shopId = "";
                    this.contentShow = true;
                }
            });
        },
        // 表单提交
        dataFormSubmit() {
            let newArray = [];
            let count = 0
            for (let i = 0; i < this.sectionTimeList.length; i++) {
                const obj = {
                    startTime: this.sectionTimeList[i][0],
                    endTime: this.sectionTimeList[i][1],
                    signTotal: this.sectionPeopleList[i],
                    signResidueNum: this.sectionPeopleList[i],
                };
                newArray.push(obj);
                count += this.sectionPeopleList[i];
            }
            this.dataForm.activitySigns = newArray;

            // 提交时检验活动时间分段是否填写完全
            if (this.dataForm.isTimeSign == "1") {
                this.dataForm.personCount = count;
                if (
                    this.sectionTimeList[this.sectionTimeNum - 1] ===
                        undefined ||
                    this.sectionPeopleList[this.sectionTimeNum - 1] ===
                        undefined
                ) {
                    this.$message({
                        showClose: true,
                        message: "请先完善当前分段时间和活动人数",
                        type: "warning",
                    });
                    return;
                }
            }

            this.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    if (this.isSubmit) {
                        return false;
                    }
                    this.isSubmit = true;
                    this.$http({
                        url: this.$http.adornUrl(`/admin/activity`),
                        method: this.dataForm.id ? "put" : "post",
                        data: this.$http.adornData(this.dataForm),
                    })
                        .then(({ data }) => {
                            this.$message({
                                message: this.$i18n.t("publics.operation"),
                                type: "success",
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false;
                                    this.contentShow = false;
                                    this.$emit("refreshDataList");
                                },
                            });
                        })
                        .catch((e) => {
                            this.isSubmit = false;
                            this.contentShow = false;
                        });
                }
            });
        },
        // 添加更多时间段
        addMoreTime() {
            // 有一个没有填就不能添加
            if (
                this.sectionTimeList[this.sectionTimeNum - 1] === undefined ||
                this.sectionPeopleList[this.sectionTimeNum - 1] === undefined
            ) {
                this.$message({
                    showClose: true,
                    message: "请先完善当前分段时间和活动人数",
                    type: "warning",
                });
                return;
            }
            this.sectionTimeNum++;
        },
        // 删除时间段
        delTime() {
            if (this.sectionTimeNum <= 1) return;

            this.sectionTimeNum--;

            this.sectionTimeList.splice(this.sectionTimeNum, 1);
            this.sectionPeopleList.splice(this.sectionTimeNum, 1);
        },
    },
    watch: {
        dataForm: {
            handler(newobj, oldobj) {
                if (newobj.isTimeSign == "1") {
                    this.showSectionTime = true;
                } else {
                    this.showSectionTime = false;
                }
            },
            deep: true,
        },
    },
};
</script>
<style lang="scss">
.activityEdit {
    .el-dialog {
        min-width: 740px;
    }

    .el-date-editor .el-range-separator {
        width: 7%;
    }

    .el-icon-time:before {
        margin-left: 10px;
    }

    .addButton {
        margin-left: 110px;
        margin-bottom: 20px;
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

            & > .el-upload-list--picture-card .el-upload-list__item {
                width: 200px;
                height: 130px;
                margin: 0;
            }
        }
    }
}
</style>
