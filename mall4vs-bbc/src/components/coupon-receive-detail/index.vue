<template>
    <el-dialog
            class="couponReceiveDetail"
            title="领取记录"
            :close-on-click-modal="false"
            width="1100px"
            :visible.sync="visible"
    >
        <div>
            <div class="search-bar" style="display: flex;align-items: center;margin-bottom: 10px;padding: 10px 20px 10px;">
                <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                    <div class="input-row">
                        <el-form-item label="状态" label-width="80px" class="search-form-item">
                            <el-select v-model="searchForm.status" placeholder="请选择状态">
                                <el-option label="失效" :value="0"></el-option>
                                <el-option label="有效" :value="1"></el-option>
                                <el-option label="已使用" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="领取人" label-width="80px" class="search-form-item">
                            <el-input type="text" v-model="searchForm.userMobile"
                                      placeholder="请输入"></el-input>
                        </el-form-item>
                        <div style="margin-left: 10px;" class="default-btn primary-btn" @click="searchCouponUser()">{{
                                $t('shopFeature.searchBar.search') }}
                        </div>
                        <div class="default-btn" @click="resetCouponUser()">{{ $t('shop.resetMap') }}
                        </div>
                        <div style="margin-left: 10px;" class="default-btn primary-btn" @click="couponUserDownLoad()">
                            导出
                        </div>
                    </div>
                </el-form>
            </div>
            <el-table
                    v-loading="loading"
                    :data="couponReceiveList"
                    header-cell-class-name="table-header"
                    row-class-name="table-row-low"
                    style="width: 100%"
            >
                <el-table-column
                        fixed
                        label="优惠券名称"
                        prop="couponName"
                        align="left"
                />
                <el-table-column
                        fixed
                        label="领取人"
                        prop="nickName"
                        align="left"
                        width="100px"
                />
                <el-table-column
                    fixed
                    label="领取人手机号"
                    prop="userMobile"
                    align="left"
                    width="120px"
                />
                <el-table-column
                        fixed
                        label="领取时间"
                        prop="receiveTime"
                        width="auto"
                        align="left"
                />
                <el-table-column
                        label="状态"
                        prop="status"
                        width="100px"
                >
                    <template slot-scope="scope">
                        <el-tag
                                v-if="scope.row.status === 0"
                                size="small"
                                type="danger"
                        >失效</el-tag>
                        <el-tag v-if="scope.row.status === 1" size="small">有效</el-tag>
                        <el-tag v-if="scope.row.status === 2" type="success" size="small">已使用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="用券开始时间"
                        prop="userStartTime"
                        width="auto"
                />
                <el-table-column
                        label="用券结束时间"
                        prop="userEndTime"
                        width="auto"
                />
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
</template>

<script>
  export default {
    name: 'couponReceiveDetail',
    data () {
      return {
        visible: false,
        couponReceiveList: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        searchForm:{
          couponId:'',
          status:'',
          userMobile:''
        },
        loading:false
      }
    },
    methods:{
      // 获取数据列表
      init (couponId) {
        this.page = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        this.searchForm.couponId = couponId || 0
        this.searchForm.status = ''
        this.searchForm.userMobile = ''
        this.visible = true
        if (this.searchForm.couponId) {
          this.getDataList()
        }
      },
      //搜索
      searchCouponUser(){
        this.getDataList()
      },
      //重置
      resetCouponUser(){
        this.page = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        }
        this.searchForm.status = ''
        this.searchForm.userMobile = ''
      },
      // 获取数据列表
      getDataList (page) {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/admin/couponUser/getCouponUserPage'),
          method: 'get',
          params: this.$http.adornParams({
            current: page == null ? this.page.currentPage : page.currentPage,
            size: page == null ? this.page.pageSize : page.pageSize,
            couponId: this.searchForm.couponId,
            status: this.searchForm.status,
            userMobile: this.searchForm.userMobile
          })
        }).then(({data}) => {
          this.couponReceiveList = data.records
          this.page.total = data.total
        }).finally(() =>{
          this.loading = false
        })
      },
      couponUserDownLoad(){
        const loading = this.$loading({
          lock: true,
          target: '.couponReceiveDetail',
          customClass: 'export-load',
          background: 'transparent',
          text: "数据导出中......"
        })
        this.$http({
          url: this.$http.adornUrl('/admin/couponUser/downloadCouponUser'),
          method: 'GET',
          params: this.$http.adornParams({
            couponId: this.searchForm.couponId,
            status: this.searchForm.status,
            userMobile: this.searchForm.userMobile
          }),
          responseType: 'blob'
        }).then(({data}) => {
          loading.close()
          let fileName = "优惠券领取记录数据.xlsx";
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
      handleSizeChange (val) {
        this.page.pageSize = val
        this.getDataList()
      },
      handleCurrentChange (val) {
        this.page.currentPage = val
        this.getDataList()
      }
    }
  }
</script>

<style scoped>

</style>
