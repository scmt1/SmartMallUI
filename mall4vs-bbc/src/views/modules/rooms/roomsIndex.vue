<template>
    <div class="roomsIndex">
        <div class="main-container">
            <!-- 操作栏 -->
            <div class="operation-bar">
                <el-button type="primary" class="change" size="small" @click.stop="addOrUpdateHandle">新增桌位</el-button>
                <el-button type="primary" class="change" size="small" @click.stop="printQrCode">打印二维码</el-button>
            </div>
            <div class="table-con sys-user-table" v-loading="dataListLoading">
                <el-row :gutter="15" style="margin: 15px;">
                    <el-col :span="3" v-for="(item, index) in dataList" :key="index" style="margin-bottom: 10px;">
                        <el-card :body-style="{ padding: '0px' }" shadow="hover" style="text-align: center" @click.native="addOrUpdateHandle(item.roomsId)">
                            <div style="height: 30px;line-height: 30px;" :style="{background: item.roomsStatus == 0 ? ' #CFCFCF' : item.roomsStatus == 1 ? '#37BCFF' :
                            '#FF6868'}">
                                <img src="../../../assets/img/rooms/rooms.png" width="20" style="margin-bottom: 5px;"/>
                                <span style="font-size: 16px;font-weight: 600;color: #fff;margin-left: 5px;">{{
                                        item.roomsStatus == 0 ? '空闲中' : item.roomsStatus == 1 ?
                                            '用餐中' : '待清理'
                                    }}</span>
                            </div>
                            <div style="height: 35px;line-height: 35px;">
                                <span style="font-size: 20px;font-weight: bold;">{{ item.personCount }}</span>
                                <span>人</span>
                            </div>
                            <!--                            <div style="height: 35px;line-height: 35px;">-->
                            <!--                                <img src="../../../assets/img/rooms/time.png" width="20"/>-->
                            <!--                                <span style="color:#707070;margin-left: 5px;font-weight: bold;">36分钟</span>-->
                            <!--                            </div>-->
                            <div style="height: 30px;background: #EBF9FC;line-height: 30px;">
                                <span style="font-size: 16px;font-weight: bold;color: #000000;">{{ item.roomsName }}</span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-dialog class="roomsEdit" title="桌位码打印" :close-on-click-modal="false" :visible.sync="visible" width="80%">
                    <el-row :gutter="15" id="printDiv">
                        <el-col :span="4" v-for="(item, index) in dataList" :key="index">
                            <el-card :body-style="{ padding: '0px' }" shadow="hover" style="text-align: center;cursor: pointer;">
                                <img :src="item.qrCode" class="image">
                                <div style="padding: 7px;">
                                    <span style="font-size: 16px;font-weight: bold;">{{ item.roomsName }}</span>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                    <div slot="footer" class="dialog-footer">
                        <div class="default-btn" @click="visible = false">取消</div>
                        <div class="default-btn primary-btn" @click="confirmPrint">确定打印</div>
                    </div>
                </el-dialog>
            </div>
        </div>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    </div>
</template>

<script>
import AddOrUpdate from './add-or-update'
import printJS from 'print-js';
export default {
    name: 'roomsIndex',
    components: {AddOrUpdate},
    data () {
        return {
            dataList: [
                {
                    roomsName: 'A101',
                    roomsStatus: 1,
                    personCount: 4,
                },
                {
                    roomsName: 'A102',
                    roomsStatus: 2,
                    personCount: 6,
                },
                {
                    roomsName: 'A103',
                    roomsStatus: 1,
                    personCount: 8,
                },
                {
                    roomsName: 'A104',
                    roomsStatus: 0,
                    personCount: 2,
                }
            ],
            addOrUpdateVisible: false,
            dataListLoading: false,
            visible: false,
        }
    },
    created () {
        this.getDataList()
    },
    methods: {
        addOrUpdateHandle (id) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id)
            })
        },
        refreshChange () {
            this.getDataList()
        },
        getDataList () {
            this.$http({
                url: this.$http.adornUrl('/multishop/rooms/list'),
                method: 'get',
                params: {}
            }).then(({data}) => {
                this.dataList = data
                this.dataListLoading = false
            })
        },
        printQrCode () {
            this.visible = true
        },
        confirmPrint() {
            let dev = document.getElementById('printDiv');
            dev.style.marginLeft = '0px';
            printJS({
                printable: 'printDiv',
                type: 'html',
                ignoreElements: [],
                targetStyles: ['*']
            });
            dev.style.margin = 'auto';
        }
    }
}
</script>

<style scoped lang="scss">
.roomsIndex {

    .operation-bar {
        margin: 15px 0 0 25px;
    }

    .el-button--primary {
        background-color: #8558fa;
        border-color: #8558fa;
    }

}
</style>
