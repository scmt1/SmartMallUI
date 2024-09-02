<template>
    <div class="couponGroupList">
        <div class="operation-bar">
            <el-button type="primary" class="change" size="small" @click.stop="addOrUpdateHandle">新增组合券</el-button>
        </div>
        <el-row :gutter="15">
            <el-col :span="4" v-for="(item, index) in 10" :key="index" style="margin-bottom: 10px;">
                <el-card :body-style="{ padding: '0px' }">
                    <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
                    <div style="padding: 10px;">
                        <span>好吃的汉堡</span>
                        <div class="bottom clearfix">
                            <time class="time">4988146545</time>
                            <el-dropdown class="button">
                                <span class="el-dropdown-link">
                                    更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item icon="el-icon-edit" @click="addOrUpdateHandle(item)">修改</el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-delete" @click="deleteItem(item)">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'couponGroup',
    data() {
        return {}

    },
    methods:{
        addOrUpdateHandle(item) {

        },
        deleteItem(item) {

        }
    }
}
</script>

<style lang="scss" scoped>
.couponGroupList {
    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }

    .operation-bar {
        margin-bottom: 10px;
    }
}
</style>
