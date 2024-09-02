<template>
    <div class="cardList">
        <div class="main-container">
            <!-- 操作栏 -->
            <div class="operation-bar">
                <div class="default-btn primary-btn" @click.stop="addOrUpdateHandle()">新增</div>
            </div>

            <!-- 表格 -->
            <div class="table-con sys-user-table">
                <el-row :gutter="6" class="cards">
                    <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="5" v-for="(item,i) in dataList" :key="item.id" style="margin-bottom: 15px;">
                        <div class="card-item">
                            <div class="card-up">
                                <div class="paw">
                                    <p>{{item.cardTitle}}</p>
                                    <img :src="item.cardImg">
                                </div>
                            </div>
                            <div class="card-down">
                                <ul>
                                    <li>
                                        <div @click="addOrUpdateHandle(item.cardId)" class="paw">
                                            <i class="el-icon-edit"></i>
                                            编辑
                                        </div>
                                    </li>
                                    <li></li>
                                    <li>
                                        <div class="paw">
                                            领取数{{item.receiveNum}}
                                        </div>
                                    </li>
                                    <li></li>
                                    <li>
                                        <div @click="deleteHandle(item.cardId)" class="paw">
                                            <i class="el-icon-delete"></i>
                                            删除
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </el-col>
                </el-row>
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
                :total="page.total">
            </el-pagination>
        </div>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    </div>
</template>

<script>
import AddOrUpdate from './add-or-update'
export default {
    name: 'cardList',
    components: {AddOrUpdate},
    data () {
        return {
            dataList: [],
            searchForm: {},
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10 // 每页显示多少条
            },
            addOrUpdateVisible: false
        }
    },
    methods: {
        handleSizeChange (val) {
            this.page.pageSize = val
            this.getDataList(this.page)
        },
        handleCurrentChange (val) {
            this.page.currentPage = val
            this.getDataList(this.page)
        },
        // 刷新回调用
        refreshChange () {
            this.page.currentPage = 1
            this.getDataList(this.page)
        },
        // 获取数据列表
        getDataList (page, newData = false) {
            this.tableLoading = true
            if (newData || !this.theData) {
                this.theData = JSON.parse(JSON.stringify(this.searchForm))
            }
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/platform/card/page'),
                method: 'get',
                params: this.$http.adornParams(
                    Object.assign(
                        {
                            current: page == null ? this.page.currentPage : page.currentPage,
                            size: page == null ? this.page.pageSize : page.pageSize
                        },
                        this.theData
                    )
                )
            }).then(({data}) => {
                this.dataList = data.records

                for (let i = 0; i < this.dataList.length; i++) {
                    if(this.dataList[i].cardImg.indexOf("http") == -1) {
                        this.dataList[i].cardImg = process.env.VUE_APP_RESOURCES_URL + this.dataList[i].cardImg;
                    }
                }

                this.page.total = data.total
                this.dataListLoading = false
            }).finally(() => {
                this.tableLoading = false
            })
        },
        addOrUpdateHandle (id) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id)
            })
        },
        deleteHandle (id) {
            if (!id) {
                return
            }
            this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}${id ? this.$i18n.t('coupon.delete') : this.$i18n.t('sys.batchDelete')}${this.$i18n.t('sysManagement.operation')}`, this.$i18n.t('text.tips'), {
                confirmButtonText: this.$i18n.t('coupon.confirm'),
                cancelButtonText: this.$i18n.t('coupon.cancel'),
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/platform/card'),
                    method: 'delete',
                    data:  this.$http.adornData(id, false)
                }).then(({data}) => {
                    this.$message({
                        message: this.$i18n.t('publics.operation'),
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.refreshChange()
                        }
                    })
                })
            }).catch(() => {
            })
        }
    },
    mounted () {
        this.getDataList()
    }
}
</script>

<style lang="scss">
.cardList {
    .cards {
        margin-top: 15px;
        font-size: 16px;
        flex-wrap: wrap;

        .card-item {
            /*min-width: 300px;*/
            background: #fff;
            border-radius: 4px;
            border: 1px solid #e8e8e8;

            &:hover {
                box-shadow: 1px 1px 6px #e5e5e5;
            }

            .card-up {
                padding: 10px 15px;

                p {
                    margin-bottom: 4px;
                }
            }

            .card-down {
                background: #FAFAFA;
                border-top: 1px solid #E8E8E8;


                ul {
                    display: flex;
                    justify-content: space-around;
                    font-size: 14px;
                    color: #898989;

                    li {
                        list-style: none;
                        margin: 12px 0;

                        &:nth-child(2n+1) {
                            flex: 1;
                            text-align: center;
                        }

                        &:nth-child(2n) {
                            width: 2px;
                            border: 1px solid #E8E8E8;
                        }

                        &:hover {
                            color: #1890FF;
                        }

                        i {
                            margin-right: 4px;
                        }
                    }
                }
            }
        }

        .card-empty {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 244px;
            color: #ccc;
            user-select: none;

            &:active {
                background: #f8f8f8;
            }
        }
    }
}
</style>
