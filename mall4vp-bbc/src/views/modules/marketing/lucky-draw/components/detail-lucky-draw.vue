<template>
    <div class="detail-lucky-draw-container">
        <div v-if="!showAddLuckyDraw">
            <el-button size="medium" @click="back">&lt; 返回</el-button>
            <div class="info">
                <div class="title">基本信息</div>
                <div class="content">
                    <div>
                        活动名称：{{ detailInfo ? detailInfo.drawName : "" }}
                    </div>
                    <div>活动状态：{{ detailInfo ? getActStatus : "" }}</div>
                    <div>
                        开始时间：{{ detailInfo ? detailInfo.startTime : "" }}
                    </div>
                    <div>
                        结束时间：{{ detailInfo ? detailInfo.endTime : "" }}
                    </div>
                    <div>参与条件：{{ detailInfo ? getJoinType : "" }}</div>
                    <div>
                        消耗积分：{{ detailInfo ? detailInfo.points : "" }}
                    </div>
                    <div>
                        参与次数：{{
                            detailInfo ? detailInfo.joinFrequency : ""
                        }}次
                    </div>
                    <div>
                        整体中奖概率：{{
                            detailInfo ? detailInfo.winningRate : ""
                        }}%
                    </div>
                    <div>
                        未中奖提示语：{{
                            detailInfo ? detailInfo.noWinningDesc : ""
                        }}
                    </div>
                    <div>
                        中奖名单是否显示：{{
                            detailInfo ? getIsShowWinner : ""
                        }}
                    </div>
                </div>
            </div>
            <div class="prize-setting">
                <div class="title">奖品设置</div>
                <el-form>
                    <el-form-item>
                        <div class="main-container">
                            <!-- 表格 -->
                            <div class="table-con sys-user-table">
                                <el-table
                                    :data="prizes"
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
                                </el-table>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="draw-record">
                <div class="title">抽奖记录</div>

                <el-radio-group
                    v-model="tabPosition"
                    @change="changeTab"
                    style="margin-top: 20px"
                >
                    <el-radio-button label="全部">全部</el-radio-button>
                    <el-radio-button label="中奖">已中奖</el-radio-button>
                    <!-- <el-radio-button label="未中奖">未中奖</el-radio-button> -->
                </el-radio-group>

                <el-form>
                    <el-form-item>
                        <div class="main-container">
                            <!-- 表格 -->
                            <div class="table-con sys-user-table">
                                <el-table
                                    :data="record"
                                    header-cell-class-name="table-header"
                                    row-class-name="table-row-low"
                                    style="width: 100%"
                                >
                                    <el-table-column
                                        prop="nickName"
                                        label="会员昵称"
                                        min-width="79"
                                    >
                                    </el-table-column>

                                    <el-table-column
                                        prop="prizeType"
                                        label="是否中奖"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.prizeType === 0">未中奖</span>
                                            <span v-else>已中奖</span>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                            prop="prizeName"
                                            label="奖品"
                                            align="center"
                                    >
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.prizeType === 0">无</span>
                                            <span v-else>{{scope.row.prizeName}}</span>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                        prop="createTime"
                                        label="抽奖时间"
                                        align="center"
                                    >
                                    </el-table-column>
                                </el-table>
                            </div>
                            <!-- 分页 -->
                            <el-pagination
                                v-if="record.length"
                                @size-change="handleSizeChange2"
                                @current-change="handleCurrentChange2"
                                :current-page="page2.currentPage"
                                :page-sizes="[5, 10, 20, 30]"
                                :page-size="page2.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="page2.total"
                            >
                            </el-pagination>
                        </div>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 编辑 -->
            <div class="footer">
                <el-button type="primary" @click="edit()">编辑</el-button>
                <el-button @click="back">返回</el-button>
            </div>
        </div>
        <!-- 编辑页面 -->
        <add-lucky-draw
            v-if="showAddLuckyDraw"
            @back="backFn"
            :detailInfo="detailInfo"
        ></add-lucky-draw>
    </div>
</template>

<script>
import AddLuckyDraw from "./add-lucky-draw.vue";

export default {
    props: ["detailItemId"],
    components: {
        AddLuckyDraw,
    },
    data() {
        return {
            detailInfo: null,
            prizes: [], // 奖品列表
            record: [], // 抽奖记录
            actAtatusList: ["未开始", "进行中"],
            joinTypeList: ["普通会员", "付费会员"],
            isShowWinnerList: ["显示", "不显示"],
            tabPosition: "全部",
            page1: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10, // 每页显示多少条
            },
            page2: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 5, // 每页显示多少条
            },
            showAddLuckyDraw: false, // 展示添加编辑抽奖页面
        };
    },
    computed: {
        // 活动状态
        getActStatus() {
            return this.actAtatusList[this.detailInfo.status];
        },
        // 参与条件
        getJoinType() {
            if (this.detailInfo.joinType == -1) {
                return "全部会员";
            } else {
                return this.joinTypeList[this.detailInfo.joinType];
            }
        },
        // 是否显示
        getIsShowWinner() {
            return this.isShowWinnerList[this.detailInfo.isShowWinner];
        },
    },
    mounted() {
        // 查询该抽奖活动基本信息
        this.getDetailInfo();
        // 查询该抽奖活动抽奖记录
        this.getLuckyIndent();
    },
    methods: {
        // 回到上一个页面
        back() {
            this.$emit("back", false);
        },
        // 从编辑页面返回
        backFn(val) {
            window.scrollTo({
                top: 0,
                behavior: "instant",
            });
            this.showAddLuckyDraw = val;
        },
        // 查抽奖活动详情
        getDetailInfo() {
            this.$http({
                url: this.$http.adornUrl(
                    `/platform/luckyDraw/info/${this.detailItemId}`
                ),
                method: "get",
            }).then(({ data }) => {
                this.detailInfo = data;
                this.prizes = this.detailInfo.prizes;
                this.page1.total = data.total;
            });
        },

        // 查询抽奖记录
        getLuckyIndent(page2) {
            this.$http({
                url: this.$http.adornUrl("/platform/luckyIndent/page"),
                method: "get",
                params: this.$http.adornParams({
                    current:
                        page2 == null
                            ? this.page2.currentPage
                            : page2.currentPage,
                    size: page2 == null ? this.page2.pageSize : page2.pageSize,
                    drawId: this.detailItemId,
                }),
            }).then(({ data }) => {
                this.record = data.records;
                this.page2.total = data.total;
            });
        },

        // 查询中奖记录
        getPrizePage(page2) {
            this.$http({
                url: this.$http.adornUrl("/platform/luckyIndent/prizePage"),
                method: "get",
                params: this.$http.adornParams({
                    current:
                        page2 == null
                        ? this.page2.currentPage
                        : page2.currentPage,
                    size: page2 == null ? this.page2.pageSize : page2.pageSize,
                    drawId: this.detailItemId,
                }),
            }).then(({ data }) => {
                this.record = data.records;
                this.page2.total = data.total;
            });
        },

        // 切换tab栏
        changeTab() {
            this.page2.currentPage = 1;
            if (this.tabPosition === "全部") {
                this.getLuckyIndent(this.page2);
            }
            if (this.tabPosition === "中奖") {
                this.getPrizePage(this.page2);
            }
        },
        // 抽奖记录表单
        handleSizeChange2(val) {
            this.page2.pageSize = val;
            this.getLuckyIndent(this.page2);
        },
        handleCurrentChange2(val) {
            this.page2.currentPage = val;
            this.getLuckyIndent(this.page2);
        },
        // 跳转到编辑页面
        edit() {
            this.showAddLuckyDraw = true;
        },
    },
};
</script>

<style lang="scss" scoped>
.detail-lucky-draw-container {
    .title {
        padding: 20px 20px 20px 10px;
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
    .info {
        width: 100%;
        padding-top: 10px;

        .content {
            display: flex;
            flex-wrap: wrap;
            box-sizing: border-box;
            padding: 10px 10px 0 10px;

            div {
                width: 33.3%;
                padding-right: 10px;
                box-sizing: border-box;
                line-height: 30px;
            }
        }
    }

    .prize-setting {
        width: 100%;
        padding-top: 30px;
    }

    .draw-record {
        margin-top: -20px;
        width: 100%;
    }

    .footer {
        text-align: center;
        padding: 20px;
    }
}
</style>
