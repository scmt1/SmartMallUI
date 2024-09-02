<template>
    <el-dialog
        title="会员列表"
        :close-on-click-modal="false"
        :visible.sync="visible"
        @close="handleDialogClose"
        width="900px"
    >
        <div class="member">
            <div class="search-warp">
                <el-input @keyup.enter.native="memberSearch" ref="searchValue" v-model="searchValue"
                          placeholder="可查询会员手机号、会员码(可使用扫码枪)"></el-input>
                <el-button @click="memberSearch()" style="width: 150px;margin-left: 15px;" type="primary" size="mini">
                    查询
                </el-button>
            </div>
            <div class="member-list" v-loading="memberLoading">
                <div style="overflow: hidden auto;">
                    <div class="member-content">
                        <div @click.stop="memberClick(item)" class="member-item" v-for="(item,index) in memberList"
                             :key="index">
                            <img v-if="item.pic" :src="item.pic">
                            <img v-else src="../../../assets/img/cashier/head04.png">
                            <div class="item-content">
                                <div class="name">{{ item.realName ? item.realName : item.nickName }}</div>
                                <div class="phone">手机号：{{ item.userMobile ? item.userMobile : item.userMobile }}</div>
                                <div class="other">
                                    <div>余额：{{ item.sumBalance }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <el-pagination
                v-if="memberList.length"
                @current-change="currentChangeHandle"
                :current-page="param.current"
                :total="param.total"
                :page-size="param.size"
                layout="total, prev, pager, next, jumper"
            ></el-pagination>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'memberList',
    data () {
        return {
            visible: false,
            searchValue: '',
            memberLoading: false,
            memberList: [],
            param: {
                total: 0,
                current: 1,
                size: 12,
                userId: '',
                userMobile: ''
            }
        }
    },
    methods: {
        init () {
            this.visible = true
            this.$nextTick(() => {
                this.$refs.searchValue.focus()
            })
            this.getMemberList()
        },
        // 当前页
        currentChangeHandle (val) {
            this.param.current = val
            this.getMemberList()
        },
        // 会员搜索
        memberSearch () {
            this.param.userMobile = this.searchValue
            this.getMemberList()
        },
        // 会员点击
        memberClick (item) {
            this.visible = false
            this.$emit('memberSelectChange', item)
        },
        getMemberList () {
            this.memberLoading = true
            this.$http({
                url: this.$http.adornUrl('/admin/user/userPage'),
                method: 'get',
                params: this.$http.adornParams(this.param)
            }).then(({data}) => {
                this.memberLoading = false
                this.param.total = data.total
                this.memberList = data.records

                if (data.total == 0) {
                    //不存在，提示注册会员
                    this.$prompt('请输入手机号立即注册成会员', '提示：该会员不存在！', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputPattern: /^1[0-9]{10}$/,
                        inputErrorMessage: '手机号格式不正确'
                    }).then(({value}) => {
                        this.$http({
                            url: this.$http.adornUrl('/multishop/shopUser/registerUser'),
                            method: 'post',
                            params: {mobile: value.trim()}
                        }).then(res => {
                            this.$message({
                                message: '会员注册成功！',
                                type: 'success'
                            });
                            this.getMemberList()
                        })
                    }).catch(() => {

                    })
                }
            })
        },
        handleDialogClose () {
            this.searchValue = ''
            this.param.userMobile = ''
            this.param.userId = ''
            this.param.current = 1
        }
    }
}
</script>

<style lang="scss" scoped>
.member {

    .search-warp {
        display: flex;
        margin-bottom: 10px;
    }

    .member-list {
        .member-content {
            display: flex;
            flex-wrap: wrap;
            align-content: baseline;
            height: 480px;

            .member-item {
                display: flex;
                padding: 13px 15px;
                margin: 10px;
                width: 260px;
                height: 100px;
                background-color: #f5f5f5;
                box-sizing: border-box;
                border-radius: 5px;

                img {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    margin-right: 10px;
                    flex-shrink: 0;
                }

                .item-content {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    flex: 1;

                    .name {
                        font-size: 16px;
                        font-weight: 700;
                    }

                    .phone {
                        font-size: 12px;
                        color: #666;
                    }

                    .other {
                        display: flex;
                        justify-content: space-between;
                        font-size: 12px;
                        color: #666;
                    }
                }
            }

            .active {
                background-color: #8558fa;
            }
        }
    }

    .el-button--primary {
        background-color: #8558fa;
        border-color: #8558fa;
    }
}
</style>
