<template>
    <div class="cardList">
        <el-tabs type="card" v-model="tabType" @tab-click="handleClick">
<!--            <el-tab-pane label="批次管理" name="1">-->
<!--                <card-batch-manage ref="cardBatchManage"></card-batch-manage>-->
<!--            </el-tab-pane>-->
            <el-tab-pane label="卡券管理" name="2">
                <card-manage ref="cardManage"></card-manage>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import cardBatchManage from './cardBatchManage'
import cardManage from './cardManage'
export default {
    name: 'cardList',
    components: {cardBatchManage, cardManage},
    data () {
        return {
            tabType:"2"
        }
    },
    methods: {
        // tab切换
        handleClick(){
            if(this.tabType == 1){
                this.$refs.cardBatchManage.init();
            }else{
                this.$refs.cardManage.init();
            }
        },
    },
    mounted () {
        // this.$refs.cardBatchManage.init();
        this.$refs.cardManage.init();
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
