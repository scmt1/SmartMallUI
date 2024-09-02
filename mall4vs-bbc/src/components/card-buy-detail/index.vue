<template>
    <div>
        <el-dialog
            class="cardBuyDetail"
            title="购买记录"
            :close-on-click-modal="false"
            width="1000px"
            :visible.sync="visible"
        >
            <div>
                <div class="search-bar" style="display: flex;align-items: center;margin-bottom: 10px;padding: 10px 20px 10px;">
                    <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                        <div class="input-row">
                            <el-form-item label="状态" label-width="60px" class="search-form-item">
                                <el-select v-model="searchForm.status" placeholder="请选择状态">
                                    <el-option label="失效" :value="0"></el-option>
                                    <el-option label="有效" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="购买人" label-width="60px" class="search-form-item">
                                <el-input type="text" v-model="searchForm.userMobile"
                                          placeholder="请输入"></el-input>
                            </el-form-item>
                            <div style="margin-left: 10px;" class="default-btn primary-btn" @click="searchCouponUser()">搜索</div>
                            <div class="default-btn" @click="resetCouponUser()">重置
                            </div>
                            <div style="margin-left: 20px;" class="default-btn primary-btn" @click="exportData">导出</div>
                        </div>
                    </el-form>
                </div>
                <el-table
                        v-loading="loading"
                        :data="cardReceiveList"
                        header-cell-class-name="table-header"
                        row-class-name="table-row-low"
                        style="width: 100%"
                >
                    <el-table-column
                            fixed
                            label="名称"
                            prop="cardTitle"
                            width="160"
                            align="left"
                    />
                    <el-table-column
                            fixed
                            label="卡号"
                            prop="cardNumber"
                            align="left"
                            width="120px"
                    />
                    <el-table-column
                        fixed
                        label="购买人手机号"
                        prop="userMobile"
                        align="left"
                        width="120px"
                    />
                    <el-table-column
                            fixed
                            label="购买时间"
                            prop="receiveTime"
                            width="150"
                    />
                    <el-table-column
                            label="状态"
                            prop="status"
                            width="80"
                    >
                        <template slot-scope="scope">
                            <el-tag
                                    v-if="scope.row.status === 0"
                                    size="small"
                                    type="danger"
                            >失效</el-tag>
                            <el-tag v-if="scope.row.status === 1" size="small">有效</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="有效期"
                            prop="userStartTime"
                            width="auto"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.userStartTime && scope.row.userEndTime">{{scope.row.userStartTime}}至{{scope.row.userEndTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            align="center"
                            label="操作"
                            width="90"
                    >
                        <template slot-scope="scope">
                            <div class="text-btn-con">
                                <div
                                        class="default-btn text-btn"
                                        @click="useHandle(scope.row.cardNumber)"
                                >使用明细
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="page.pageSize"
                    :total="page.total"
                    layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
            <span slot="footer" class="dialog-footer">
              <el-button size="small" @click="visible = false">取消</el-button>
            </span>
        </el-dialog>
        <!--  使用记录  -->
        <card-use-list v-show="cardUseVisible" ref="cardUseList"></card-use-list>
    </div>
</template>

<script>
  import CardUseList from '@/views/modules/card/cardUseList'
  export default {
    components:{
      CardUseList
    },
    name: 'cardBuyDetail',
    data () {
      return {
        visible: false,
        cardReceiveList: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        searchForm:{
          couponId:'',
          userMobile:'',
          status: null
        },
        loading:false,
        cardUseVisible: false,
      }
    },
    methods:{
      useHandle (cardCode) {
        this.cardUseVisible = true
        this.$refs.cardUseList.initData(cardCode)
      },
      // 获取数据列表
      init (couponId) {
        this.page = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        this.searchForm.couponId = couponId || 0
        this.searchForm.userMobile = ''
        this.searchForm.status = null
        this.visible = true
        if (this.searchForm.couponId) {
          this.getDataList()
        }
      },
      //搜索
      searchCouponUser(){
        this.page = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        }
        this.getDataList()
      },
      //重置
      resetCouponUser(){
        this.page = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        }
        this.searchForm.userMobile = ''
        this.searchForm.status = null
      },
      // 获取数据列表
      getDataList (page) {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/admin/cardUser/getCardUserPage'),
          method: 'get',
          params: this.$http.adornParams({
            current: page == null ? this.page.currentPage : page.currentPage,
            size: page == null ? this.page.pageSize : page.pageSize,
            couponId: this.searchForm.couponId,
            userMobile: this.searchForm.userMobile,
            status: this.searchForm.status
          })
        }).then(({data}) => {
          this.cardReceiveList = data.records
          this.page.total = data.total
        }).finally(() =>{
          this.loading = false
        })
      },
      handleSizeChange (val) {
        this.page.pageSize = val
        this.getDataList()
      },
      handleCurrentChange (val) {
        this.page.currentPage = val
        this.getDataList()
      },
      //导出
      exportData () {
        const loading = this.$loading({
          lock: true,
          target: '.cardBuyDetail',
          customClass: 'export-load',
          background: 'transparent',
          text: "数据导出中......"
        })
        this.$http({
          url: this.$http.adornUrl('/admin/cardUser/downloadBuyRecord'),
          method: 'GET',
          params: this.$http.adornParams({
            couponId: this.searchForm.couponId,
            userMobile: this.searchForm.userMobile,
            status: this.searchForm.status
          }),
          responseType: 'blob'
        }).then(({data}) => {
          loading.close()
          let fileName = "购买记录数据.xlsx";
          let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
          const elink = document.createElement('a')
          if ('download' in elink) {
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            navigator.msSaveBlob(blob, fileName)
          }
          this.$message({
            message: "导出成功",
            type: 'success',
            duration: 1500,
            onClose: () => {

            }
          })
        }).catch((e) => {
          loading.close()
        })
      },
    }
  }
</script>

<style scoped>

</style>
