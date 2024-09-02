<template>
    <div class="luckyDraw">
        <div v-if="!showAddLuckyDraw && !showDetailLuckyDraw">
            <div class="add">
                <el-button type="primary" size="medium" @click="addHandle()"
                    >添加幸运抽奖</el-button
                >
            </div>
            <!-- 搜索栏 -->
            <div class="search-bar">
                <el-form
                    :inline="true"
                    class="search-form"
                    ref="searchForm"
                    :model="searchForm"
                    size="small"
                >
                    <div class="input-row">
                        <el-form-item label="活动名称" class="search-form-item">
                            <el-input
                                type="text"
                                v-model="searchForm.drawName"
                                placeholder="请输入关键字"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="状态" class="search-form-item">
                            <el-select
                                    v-model="searchForm.status"
                                    clearable
                                    placeholder="请选择"
                                    size="small"
                            >
                                <el-option
                                        label="未开始"
                                        value="0"
                                ></el-option>
                                <el-option
                                        label="进行中"
                                        value="1"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="活动时间" class="search-form-item">
                            <el-date-picker
                                v-model="dateRange"
                                type="datetimerange"
                                :range-separator="$t('date.tip')"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :start-placeholder="$t('date.start')"
                                :end-placeholder="$t('date.end')"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <div
                                class="default-btn primary-btn"
                                @click="searchChange(true)"
                            >
                                {{ $t("crud.searchBtn") }}
                            </div>
                            <div
                                class="default-btn"
                                @click="resetSearchForm('searchForm')"
                            >
                                {{ $t("product.reset") }}
                            </div>
                        </el-form-item>
                    </div>
                </el-form>
            </div>

            <div class="main-container">
                <!-- 表格 -->
                <div class="table-con sys-user-table">
                    <el-table
                        v-loading="tableLoading"
                        ref="luckyDrawTable"
                        :data="dataList"
                        header-cell-class-name="table-header"
                        row-class-name="table-row-low"
                        style="width: 100%"
                    >
                        <el-table-column
                            prop="drawName"
                            label="活动名称"
                            min-width="120"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="winningRate"
                            label="中奖概率"
                            min-width="110"
                            align="center"
                        >
                            <template slot-scope="scope">
                                <span>{{ scope.row.winningRate + "%" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="points"
                            label="每次消耗积分"
                            min-width="100"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="joinFrequency"
                            label="参与次数"
                            min-width="100"
                            align="center"
                        >
                            <template slot-scope="scope">
                                <span>{{
                                    scope.row.joinFrequency + "次"
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            label="状态"
                            min-width="100"
                            align="center"
                        >
                            <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.status"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    :active-value="1"
                                    :inactive-value="0"
                                    @change="isReleaseChange(scope.row)"
                                >
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="startTime"
                            label="活动开始时间"
                            min-width="180"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="endTime"
                            label="活动结束时间"
                            min-width="180"
                            align="center"
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
                                    <div
                                        class="default-btn text-btn"
                                        @click.stop="
                                            detailHandle(scope.row.drawId)
                                        "
                                    >
                                        详情
                                    </div>
                                    <div
                                        class="default-btn text-btn"
                                        @click.stop="
                                            deleteHandle(scope.row.drawId)
                                        "
                                    >
                                        删除
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 分页 -->
                <el-pagination
                    v-if="dataList.length"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total"
                >
                </el-pagination>
            </div>

            <!-- 弹窗, 新增 / 修改 -->
            <add-or-update
                v-if="addOrUpdateVisible"
                ref="addOrUpdate"
                @refreshDataList="refreshChange"
            ></add-or-update>
        </div>
        <!-- 添加幸运抽奖页面 -->
        <add-lucky-draw v-if="showAddLuckyDraw" @back="backFn"></add-lucky-draw>
        <!-- 抽奖活动详情页面 -->
        <detail-lucky-draw
            v-if="showDetailLuckyDraw"
            @back="backFn"
            :detailItemId="detailItemId"
        ></detail-lucky-draw>
    </div>
</template>

<script>
import AddOrUpdate from "./components/add-or-update.vue";
import AddLuckyDraw from "./components/add-lucky-draw.vue";
import DetailLuckyDraw from "./components/detail-lucky-draw.vue";

export default {
    name: "luckyDraw",
    components: {
        AddOrUpdate,
        AddLuckyDraw,
        DetailLuckyDraw,
    },
    data() {
        return {
            dataList: [], // 幸运抽奖列表
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10, // 每页显示多少条
            },
            searchForm: {
                drawName: "",
                startTime: null,
                endTime: null,
            },
            value: true, // 活动状态展示
            detailItemId: null, // 当前选中的抽奖活动id
            dateRange: [],
            addOrUpdateVisible: false,
            tabPosition: "全部",
            showAddLuckyDraw: false, // 展示添加编辑抽奖页面
            showDetailLuckyDraw: false, // 展示抽奖详情页面
            tableLoading:false
        };
    },
    mounted() {
        this.getDataList();
    },
    methods: {
        // 添加幸运抽奖
        addHandle() {
            this.showAddLuckyDraw = true;
        },
        backFn(val) {
            this.showAddLuckyDraw = val;
            this.showDetailLuckyDraw = val;
            // 更新页面数据
            this.getDataList();
        },
        // 编辑表单
        detailHandle(drawId) {
            this.detailItemId = drawId;
            this.showDetailLuckyDraw = true;
        },
        // 删除
        deleteHandle(drawId) {
            console.log(drawId);
            if (!drawId) {
                return;
            }
            this.$confirm(
                `${this.$i18n.t("sysManagement.confirmSure")}${
                    drawId
                        ? this.$i18n.t("coupon.delete")
                        : this.$i18n.t("sys.batchDelete")
                }${this.$i18n.t("sysManagement.operation")}`,
                this.$i18n.t("text.tips"),
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl(
                            `/platform/luckyDraw/${drawId}`
                        ),
                        method: "delete",
                    })
                        .then(({ data }) => {
                            this.$message({
                                message: "删除成功",
                                type: "success",
                                duration: 1500,
                            });
                            this.refreshChange();
                        })
                        .catch(() => {
                            this.refreshChange();
                        });
                })
                .catch(() => {});
        },
        // 获取抽奖数据列表
        getDataList(page, newData = false) {
            this.tableLoading = true;
            // 搜索关键字
            if (newData || !this.theData) {
                this.theData = JSON.parse(JSON.stringify(this.searchForm));
            }
            (this.theData.startTime =
                this.dateRange === null ? null : this.dateRange[0]), // 开始时间
                (this.theData.endTime =
                    this.dateRange === null ? null : this.dateRange[1]), // 结束时间
                this.$http({
                    url: this.$http.adornUrl("/platform/luckyDraw/page"),
                    method: "get",
                    params: this.$http.adornParams(
                        Object.assign(
                            {
                                current:
                                    page == null
                                        ? this.page.currentPage
                                        : page.currentPage,
                                size:
                                    page == null
                                        ? this.page.pageSize
                                        : page.pageSize,
                            },
                            this.theData
                        )
                    ),
                }).then(({ data }) => {
                    this.dataList = data.records;
                    this.page.total = data.total;
                }).finally(()=>{
                    this.tableLoading = false;
                })
        },

        // 活动状态改变
        isReleaseChange(item) {
            console.log(item, "item");
            this.$http({
                url: this.$http.adornUrl("/platform/luckyDraw/updateLuckyDraw"),
                method: "POST",
                data: this.$http.adornData({
                    drawId: item.drawId,
                    status: item.status,
                }),
            }).then(({ data }) => {

            });
        },

        // 分页
        handleSizeChange(val) {
            this.page.pageSize = val;
            this.getDataList(this.page);
        },
        handleCurrentChange(val) {
            this.page.currentPage = val;
            this.getDataList(this.page);
        },
        // 条件查询
        searchChange(newData = false) {
            this.page.currentPage = 1;
            this.getDataList(this.page, newData);
        },
        // 刷新回调用
        refreshChange() {
            this.page.currentPage = 1;
            this.getDataList(this.page);
        },
        /**
         * 重置表单
         * @param {String} formName 表单名称
         */
        resetSearchForm(formName) {
            console.log(this.$refs);
            this.$refs[formName].resetFields();
            this.searchForm = {};
            this.dateRange = [];
        },
    },
};
</script>

<style lang="scss" scoped>
.luckyDraw {
    .add {
    }
    .search-bar {
        margin-top: 20px;
    }
}
</style>
