<template>
    <div class="add-lucky-draw-container">
        <el-button size="medium" @click="back">&lt; 返回</el-button>
        <!-- 活动设置 -->
        <div class="activity-setting">
            <div class="title">活动设置</div>
            <el-form
                ref="form1"
                :model="form"
                label-width="180px"
                class="form"
                :rules="formRules"
            >
                <el-form-item
                    label="活动名称："
                    prop="drawName"
                >
                    <el-input
                        v-model="form.drawName"
                        placeholder="请输入活动名称"
                        style="width: 400px"
                    ></el-input>
                </el-form-item>

                <el-form-item label="活动状态：" :required="true">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="0">未开始</el-radio>
                        <el-radio :label="1">开始</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item
                    label="活动开始时间："
                    prop="startTime"
                >
                    <el-date-picker
                        type="datetime"
                        placeholder="选择开始时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="form.startTime"
                        style="width: 250px"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                        label="活动结束时间："
                        prop="endTime"
                >
                    <el-date-picker
                            type="datetime"
                            placeholder="选择结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="form.endTime"
                            style="width: 250px"
                    ></el-date-picker>
                </el-form-item>

                <el-form-item
                    label="活动说明："
                    style="margin-top: 30px"
                    prop="activityDescription"
                >
                    <el-input
                        type="textarea"
                        resize="none"
                        :rows="5"
                        placeholder="请输入活动说明"
                        v-model="form.activityDescription"
                    ></el-input>
                </el-form-item>

                <el-form-item label="参与条件：" prop="joinType">
                    <el-radio-group v-model="form.joinType">
                        <el-radio :label="-1">全部会员</el-radio>
                        <el-radio :label="0">普通会员</el-radio>
                        <el-radio :label="1">付费会员</el-radio>
                    </el-radio-group>

                    <div style="color: #b2b2b2; font-size: 12px">
                        选择参与的会员等级，默认为所有会员都可参与
                    </div>
                </el-form-item>

                <el-form-item label="消耗积分：" prop="points">
                    <el-input-number
                        style="width: 200px"
                        v-model="form.points"
                        controls-position="right"
                        :min="0"
                    ></el-input-number>
                </el-form-item>

                <el-form-item label="参与次数：" prop="joinFrequency">

                    <el-input-number
                        style="width: 200px"
                        v-model="form.joinFrequency"
                        controls-position="right"
                        :min="1"
                    ></el-input-number>
                    次
                </el-form-item>
            </el-form>
        </div>

        <!-- 中奖设置 -->
        <div class="win-setting">
            <div class="title">中奖设置</div>
            <el-form ref="form2" :model="form" :rules="formRules" label-width="200px">
                <el-form-item label="整体中奖概率：" prop="winningRate">
                    <el-input-number
                        style="width: 200px"
                        v-model="form.winningRate"
                        controls-position="right"
                        :min="0"
                    ></el-input-number>
                    %
                    <!-- 注意事项 -->
                    <div
                        style="
                            color: #b2b2b2;
                            font-size: 12px;
                            line-height: 25px;
                            margin-top: 15px;
                        "
                    >
                        <p>注意：若整体中奖概率为100%，需满足以下条件：</p>
                        <p>1、奖品对应的活动不能失效，奖品状态正常。</p>
                        <p>
                            2、保持奖品库存需充足，活动库存充足，当奖项被领取完，此时中奖概率已经非100%。
                        </p>
                    </div>
                </el-form-item>

                <el-form-item label="未中奖提示语：">
                    <el-input
                        v-model="form.noWinningDesc"
                        style="width: 400px"
                    ></el-input>
                </el-form-item>

                <!-- <el-form-item label="未中奖图片：">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img
                            v-if="form.noWinImg"
                            :src="form.noWinImg"
                            class="avatar"
                        />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item> -->

                <el-form-item label="中奖名单：">
                    <el-radio-group v-model="form.isShowWinner">
                        <el-radio :label="0">显示</el-radio>
                        <el-radio :label="1">不显示</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>

        <!-- 奖品设置 -->
        <div class="prize-setting">
            <div class="title">奖品设置</div>

            <el-form ref="form3" :model="form" label-width="200px">
                <el-form-item label="奖品明细：">
                    <div class="main-container">
                        <!-- 表格 -->
                        <div class="table-con sys-user-table">
                            <el-table
                                :data="prizeListHandle"
                                ref="prizeInfo"
                                header-cell-class-name="table-header"
                                row-class-name="table-row-low"
                                style="width: 100%"
                            >
                                <el-table-column
                                    prop="prizeName"
                                    label="名称"
                                    min-width="120"
                                >
                                </el-table-column>

                                <el-table-column
                                    prop="prizeType"
                                    label="奖品"
                                    min-width="110"
                                >
                                    <template slot-scope="scope">
                                        <span
                                                v-if="scope.row.prizeType === 0"
                                                class="tag-text"
                                        >未中奖</span
                                        >
                                        <span
                                            v-if="scope.row.prizeType === 1"
                                            class="tag-text"
                                            >优惠券</span
                                        >
                                        <span
                                            v-else-if="
                                                scope.row.prizeType === 2
                                            "
                                            class="tag-text"
                                            >积分</span
                                        >
                                        <span
                                            v-else-if="
                                                scope.row.prizeType === 3
                                            "
                                            class="tag-text"
                                            >成长值</span
                                        >
                                        <span
                                            v-else-if="
                                                scope.row.prizeType === 4
                                            "
                                            class="tag-text"
                                            >商品</span
                                        >
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    prop="prizeNum"
                                    label="奖品数量"
                                    min-width="100"
                                >
                                </el-table-column>

                                <el-table-column
                                    prop="prizeWeight"
                                    label="奖项权重"
                                    min-width="100"
                                >
                                </el-table-column>

                                <!-- 操作 -->
                                <el-table-column
                                    fixed="right"
                                    align="center"
                                    :label="$t('publics.operating')"
                                    width="150"
                                >
                                    <template slot-scope="scope">
                                        <div class="text-btn-con">
                                            <!-- <div
                                                class="default-btn text-btn"
                                                @click.stop="
                                                    editHandle(scope.row)
                                                "
                                            >
                                                编辑
                                            </div> -->
                                            <div
                                                class="default-btn text-btn"
                                                @click.stop="
                                                    deleteHandle(scope.row)
                                                "
                                            >
                                                删除
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <!-- 注意事项 -->
                        <div
                            style="
                                color: #b2b2b2;
                                font-size: 12px;
                                line-height: 25px;
                            "
                        >
                            <p>注意：</p>
                            <p>1、奖品奖项为8项。</p>
                        </div>

                        <el-button
                            type="primary"
                            size="medium"
                            @click="addPrice()"
                            style="margin-top: 20px"
                            >添加奖品</el-button
                        >
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <!-- 添加商品弹出框 -->
        <el-dialog
            title="添加奖品"
            :visible.sync="dialogVisible"
            width="700px"
            :lock-scroll="false"
        >
            <el-form
                ref="addForm"
                :model="addForm"
                label-width="100px"
                class="addForm"
                :rules="addFormRule"
            >
                <el-form-item
                    label="奖品名称："
                    prop="prizeName"
                >
                    <el-input
                        placeholder="请输入奖品名称"
                        v-model="addForm.prizeName"
                        style="width: 200px"
                    ></el-input>
                </el-form-item>

                <el-form-item label="奖品类型：" prop="prizeType" class="prize">
                    <el-radio-group
                        v-model="addForm.prizeType"
                        style="
                            display: flex;
                            flex-flow: column nowrap;
                            align-items: flex-start;
                            width: 100px;
                        "
                    >
                        <el-radio :label="1" style="margin-top: 15px"
                            >优惠券</el-radio
                        >
                        <el-radio :label="4" style="margin-top: 40px"
                        >商品</el-radio
                        >
                        <el-radio :label="2" style="margin-top: 40px"
                            >积分</el-radio
                        >
                        <el-radio :label="3" style="margin-top: 40px"
                            >成长值</el-radio
                        >
                        <el-radio :label="0" style="margin-top: 40px"
                        >未中奖</el-radio
                        >
                    </el-radio-group>

                    <div class="input">
                        <!-- 优惠券列表 -->
                        <el-select
                            v-model="addForm.couponId"
                            placeholder="请选择"
                            style="width: 250px"
                            clearable
                            filterable
                        >
                            <el-option
                                v-for="item in prizeOptions"
                                :key="item.couponId"
                                :label="item.couponName"
                                :value="item.couponId"
                            >
                            </el-option>
                        </el-select>
                        <!-- 商品列表 -->
                        <el-select
                            v-model="addForm.prodId"
                            placeholder="请选择"
                            style="width: 250px; margin-top: 15px"
                            clearable
                            filterable
                        >
                            <el-option
                                v-for="item in prodOptions"
                                :key="item.prodId"
                                :label="item.prodName"
                                :value="item.prodId"
                            >
                            </el-option>
                        </el-select>

                        <div>
                            <el-input-number
                                style="width: 100px; margin-top: 15px"
                                v-model="addForm.score"
                                controls-position="right"
                                :min="1"
                            ></el-input-number>
                            积分
                        </div>

                        <div>
                            <el-input-number
                                style="width: 100px; margin-top: 15px"
                                v-model="addForm.growth"
                                controls-position="right"
                                :min="1"
                            ></el-input-number>
                            成长值
                        </div>
                    </div>
                </el-form-item>

                <el-form-item
                    v-model="addForm.level"
                    style="margin-top: 35px"
                    label="奖品等级："
                    prop="level"
                >
                    <el-select
                        v-model="addForm.level"
                        placeholder="请选择"
                        style="width: 200px"
                    >
                        <el-option
                            v-for="item in levelOptions"
                            :key="item.label"
                            :label="item.label"
                            :value="item.label"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    label="数量："
                    prop="prizeNum"
                    v-if="addForm.prizeType != 0"
                >
                    <el-input-number
                        style="width: 200px"
                        v-model="addForm.prizeNum"
                        controls-position="right"
                        :min="1"
                    ></el-input-number>
                </el-form-item>

                <el-form-item
                    label="奖品权重："
                    prop="prizeWeight"
                >
                    <el-input-number
                        style="width: 200px"
                        v-model="addForm.prizeWeight"
                        controls-position="right"
                        :min="1"
                    ></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm('addForm')"
                    >确 定</el-button
                >
            </span>
        </el-dialog>

        <!-- 保存 -->
        <div class="footer">
            <el-button type="primary" @click="onSubmit()">保存</el-button>
            <el-button @click="back">返回</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: ["detailInfo"],
    data() {
        return {
            // 三个表单的数据
            form: {
                drawName: "", // 活动名称
                status: 0, // 活动状态
                startTime: "", // 开始时间
                endTime: "", // 结束时间
                activityDescription: "", // 活动描述
                joinType: -1, // 参与条件
                points: 0, // 消耗积分
                joinFrequency: 1, // 参与次数
                winningRate: 1, // 整体中奖概率
                noWinningDesc: "很遗憾,未中奖", // 未中奖提示语
                isShowWinner: 0, // 中奖名单显示
            },
            // 添加奖品表单的数据
            addForm: {
                prizeName: "",
                prizeType: 0, // 奖品类型(0：优惠券，1：积分，2：成长值，3：商品)
                couponId: "", // 选择的优惠券id
                prodId: "", // 选择的商品id
                score: 1, // 积分
                growth: 1, // 成长值
                level: "一般", // 奖品等级
                prizeNum: 1, // 数量
                prizeWeight: 1, // 权重
            },
            addFormRule: {
                prizeName: [
                    {required: true,message: '请输入奖品名称',trigger: 'blur'},
                    {max: 30,message: "长度不能超过6位" }
                ],
                prizeType: [
                    {required: true,message: '请选择奖品类型',trigger: 'blur'}
                ],
                level: [
                    {required: true,message: '请选择奖品等级',trigger: 'blur'}
                ],
                prizeNum: [
                    {required: true,message: '请输入数量',trigger: 'blur'}
                ],
                prizeWeight: [
                    {required: true,message: '请输入奖品权重',trigger: 'blur'}
                ]
            },
            // 手动添加的奖品列表
            prizeListHandle: [],
            dialogVisible: false, // 添加奖品弹出框
            prizeOptions: [], // 所有优惠券选项
            prodOptions: [], // 所有商品选项
            levelOptions: [
                {
                    label: "一般",
                },
                {
                    label: "中级",
                },
                {
                    label: "高级",
                },
            ], // 奖品等级
            currentEditIndex: "", //当前编辑数组所在行数
            formRules: {
                drawName: [
                    {required: true,message: '请输入活动名称',trigger: 'blur'},
                    {max: 15,message: "长度不能超过15位" }
                ],
                activityDescription: [
                    {required: true,message: "请输入活动说明",trigger: "blur"}
                ],
                joinType:[
                    {required: true,message: "请选择参与条件",trigger: "blur"}
                ],
                points: [
                    {required: true,message: "请输入消耗积分",trigger: "blur"}
                ],
                joinFrequency: [
                    {required: true,message: "请输入消参与次数",trigger: "blur"}
                ],
                winningRate: [
                    {required: true,message: "请输入整体中奖概率",trigger: "blur"}
                ],
                startTime: [
                    {required: true,message: "请选择活动开始时间",trigger: "blur"}
                ],
                endTime: [
                    {required: true,message: "请选择活动结束时间",trigger: "blur"}
                ]
            },
        };
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: "instant",
        });

        this.getCouponList();

        this.listProdByIdsAndType();

        // 如果是编辑页面进入的 填充这个活动的数据
        if (this.detailInfo) {
            this.form = this.detailInfo;
            this.prizeListHandle = this.detailInfo.prizes;
        }
    },
    methods: {
        //获取所有优惠券信息
        getCouponList() {
            this.$http({
                url: this.$http.adornUrl("/platform/coupon/getAllCouponList"),
                method: "get",
                params: this.$http.adornParams({
                    putonStatus:1,
                    isGroup:0
                }),
            }).then(({ data }) => {
                this.prizeOptions = data;
            });
        },

        // 查询所有商品
        listProdByIdsAndType() {
            this.$http({
                url: this.$http.adornUrl("/prod/prod/listProdByIdsAndType"),
                method: "get",
                params: this.$http.adornParams({
                    status: 1,
                }),
            }).then(({ data }) => {
                this.prodOptions = data;
            });
        },

        // 提交抽奖信息
        sumitLuckyDraw() {
            const form = this.form;
            const obj = {
                drawType: 1,
                prizes: this.prizeListHandle,
                ...form,
            };
            this.$http({
                url: this.$http.adornUrl("/platform/luckyDraw"),
                method: this.form.drawId ? "put" : "post",
                data: this.$http.adornData(obj),
            }).then(({ data }) => {
                this.$message({
                    message: "保存成功!",
                    type: "success",
                });
                this.$emit("back", false);
            });
        },

        // 回到上一个页面
        back() {
            this.$emit("back", false);
        },

        // 上传图片
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        // 上传前校验
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        // 添加商品
        addPrice() {
            if(this.prizeListHandle.length < 8){
                this.dialogVisible = true;
                this.addForm = {
                    prizeName: "",
                    prizeType: 0, // 奖品类型(0：未中奖，1：优惠券，:2：积分，3：成长值，4：商品)
                    couponId: "", // 选择的优惠券id
                    prodId: "", // 选择的商品id
                    score: 1, // 积分
                    growth: 1, // 成长值
                    level: "一般", // 奖品等级
                    prizeNum: 1, // 数量
                    prizeWeight: 1, // 权重
                }
            }else{
                this.$message.warning("奖品最多有8项！")
            }
        },
        // 确认添加奖品表单校验
        addConfirm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 根据奖品类型 过滤掉多余属性
                    const {
                        prizeName,
                        prizeType,
                        prizeNum,
                        prizeWeight,
                        level,
                    } = this.addForm;

                    let new1 = null;
                    let new2 = null;
                    new1 = {
                        prizeName,
                        prizeType,
                        prizeNum,
                        prizeWeight,
                        level,
                    };

                    if (this.addForm.prizeType == 0) {
                        new2 = { ...new1 };
                    }
                    // 优惠券类型
                    if (this.addForm.prizeType == 1) {
                        if (!this.addForm.couponId) {
                            this.$message({
                                message: "请选择优惠券",
                                type: "warning",
                            });
                            return;
                        }
                        const { couponId } = this.addForm;
                        new2 = { couponId, ...new1 };
                    }
                    // 积分类型
                    else if (this.addForm.prizeType == 2) {
                        const { score } = this.addForm;
                        new2 = { score, ...new1 };
                    }
                    // 成长值类型
                    else if (this.addForm.prizeType == 3) {
                        const { growth } = this.addForm;
                        new2 = { growth, ...new1 };
                    }
                    // 商品类型
                    else if (this.addForm.prizeType == 4) {
                        if (!this.addForm.prodId) {
                            this.$message({
                                message: "请选择商品",
                                type: "warning",
                            });
                            return;
                        }
                        const { prodId } = this.addForm;
                        new2 = { prodId, ...new1 };
                    }

                    this.prizeListHandle.push(new2);
                    this.dialogVisible = false;
                } else {
                    return false;
                }
            });
        },
        // 保存
        onSubmit() {
            let flag = true;
            // 校验表单
            for (let refName in this.$refs) {
                if (this.$refs[refName].validate) {
                    this.$refs[refName].validate((valid) => {
                        // 验证未通过
                        if (!valid) {
                            flag = false;
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth", // 平滑滚动
                            });
                            return false;
                        }
                    });
                }
            }
            // 所有表单验证通过
            if (flag) {
                // 如果奖品数量不对
                if (this.prizeListHandle.length < 8) {
                    this.$alert("奖品奖项不能少于8项", "提示", {
                        confirmButtonText: "确定",
                    });
                    return;
                }
                if (this.prizeListHandle.length > 8) {
                    this.$alert("奖品奖项不能多余8项", "提示", {
                        confirmButtonText: "确定",
                    });
                    return;
                }
                this.sumitLuckyDraw();
            }
        },

        // 编辑奖品信息
        editHandle(row) {
            this.currentEditIndex = this.prizeListHandle.indexOf(row);
            console.log(this.currentEditIndex, "当前编辑所在行数");

            this.addForm = row;
            this.dialogVisible = true;
        },

        // 删除这行数据
        deleteHandle(row) {
            this.$confirm("确定删除这个奖品吗吗", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    const index = this.prizeListHandle.indexOf(row);
                    if (index !== -1) {
                        this.prizeListHandle.splice(index, 1);
                    }
                })
                .then(() => {
                    this.$message({
                        message: "删除成功",
                        type: "success",
                        duration: 1500,
                    });
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.add-lucky-draw-container {
    .title {
        padding: 20px 20px 40px 10px;
        font-weight: bold;
        font-size: 15px;
        display: flex;
        align-items: center;

        &::before {
            content: "";
            display: inline-block;
            width: 1px;
            height: 15px;
            border: 2px solid #1d61f7;
            border-radius: 30px;
            margin-right: 10px;
        }
    }

    .activity-setting {

        .title {
            padding: 30px 20px 20px 10px;
        }

        ::v-deep .el-input__prefix {
            left: 10px;
        }

        ::v-deep .el-input__inner {
            text-align: left;
        }
    }

    .win-setting {
        width: 50%;

        ::v-deep .avatar-uploader-icon {
            width: 100px;
            height: 100px;
            line-height: 105px;
        }

        ::v-deep .el-input__inner {
            text-align: left;
        }
    }

    .prize-setting {
        ::v-deep .el-form-item__content {
            margin-top: -20px;
        }
    }

    .footer {
        text-align: center;
        margin-top: 80px;
        padding: 20px;
    }

    .addForm {
        .prize {
            position: relative;

            .input {
                position: absolute;
                top: 10px;
                left: 100px;
                display: flex;
                flex-direction: column;

                .el-select {
                    margin-top: -5px;
                }
            }
        }

        ::v-deep .el-input__inner {
            text-align: left;
        }
    }
}
</style>
