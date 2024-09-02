<template>
	<div class="clothingProdReduction">
		<div class="default-btn primary-btn" @click="showEditFrame(null,0)">新增店铺商品立减</div>
		<div class="label-container">
			<div class="label-content">
				<div v-for="(item, index) in clothingProdList" :key="index" class="label-item">
					<div class="label-name">
						{{item.shopName}}
					</div>
					<div class="font-line">
						立减商品数：{{item.prodNum}}
					</div>
					<div class="font-line">
						创建时间：{{item.createTime}}
					</div>
					<div class="font-line">
						更新时间：{{item.updateTime}}
					</div>
					<div class="op-btn-wrapper">
						<span @click="showEditFrame(item.shopId,1)">编辑</span>
						<span @click="deleteLabel(item.shopId)">删除</span>
					</div>
				</div>
				<div v-if="clothingProdList.length === 0" class="no-data">{{ $t('user.noData') }}</div>
			</div>
			<!-- 分页 -->
			<el-pagination
					v-if="clothingProdList.length"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="page.currentPage"
					:page-sizes="[10, 20, 50, 100]"
					:page-size="page.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="page.total">
			</el-pagination>
		</div>
		<!-- 新增/编辑标签 -->
		<clothing-prod-add-or-update v-if="isShowEditFrame" ref="addOrEdit" @refreshDataList="addOrEditSucc"></clothing-prod-add-or-update>
	</div>
</template>

<script>
import clothingProdAddOrUpdate from './clothingProd-add-or-update'
export default {
  components: {
	  clothingProdAddOrUpdate
  },
  data () {
    return {
      isShowEditFrame: false,
	  clothingProdList: [],
	  page: {
		total: 0, // 总页数
		currentPage: 1, // 当前页数
		pageSize: 10 // 每页显示多少条
	  },
    }
  },
  mounted () {
    this.getClothingProdList()
  },
  methods: {
    // 新增弹窗
    showEditFrame (shopId,type) {
      this.isShowEditFrame = true
      this.$nextTick(() => {
        this.$refs.addOrEdit.init(shopId,type)
      })
    },
    // 获取服饰店铺立减商品列表
    getClothingProdList () {
      this.$http({
        url: this.$http.adornUrl('/clothingProdReduction/page'),
        method: 'get',
        params: this.$http.adornParams({
			current: this.page.currentPage,
			size: this.page.pageSize
		})
      }).then(({ data }) => {
        this.clothingProdList = data.records
	    this.page.total = data.total
      })
    },
    deleteLabel (shopId) {
		// 删除
		if (!shopId) {
			return
		}
		this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}${this.$i18n.t('coupon.delete')}${this.$i18n.t('sysManagement.operation')}`, this.$i18n.t('text.tips'), {
			confirmButtonText: this.$i18n.t('coupon.confirm'),
			cancelButtonText: this.$i18n.t('coupon.cancel'),
			type: 'warning'
		}).then(() => {
			this.$http({
				url: this.$http.adornUrl('/clothingProdReduction'),
				method: 'delete',
				data: this.$http.adornData(shopId, false)
			}).then(({ data }) => {
				this.$message({
					message: this.$i18n.t('publics.operation'),
					type: 'success',
					duration: 1500,
					onClose: () => {
						this.refreshChange()
					}
				})
			})
		}).catch(() => { })
    },
    handleSizeChange (val) {
	  this.page.pageSize = val
	  this.getClothingProdList(this.page)
    },
    handleCurrentChange (val) {
	  this.page.currentPage = val
	  this.getClothingProdList(this.page)
    },
    refreshChange(){
	  this.page.currentPage = 1
	  this.getClothingProdList()
    },
    addOrEditSucc () {
      this.isShowEditFrame = false
	  this.page.currentPage = 1
	  this.getClothingProdList()
    }
  }
}
</script>

<style lang="scss" scoped>
	.clothingProdReduction{
		.label-container {
			background-color:#f2f2f6 ;
			padding: 10px;
			margin-top:10px ;
			border-radius: 10px;
			.label-content {
				display: flex;
				flex-wrap: wrap;
				.label-item {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					width: 215px;
					height: 150px;
					padding: 12px;
					font-size: 12px;
					color: #666;
					background: white;
					border: 1px solid #E8E9EC;
					border-radius: 4px;
					margin: 0 12px 12px 0;
					.label-name {
						font-size: 14px;
						color: #000;
					}
					.op-btn-wrapper {
						text-align: right;
						& span {
							color: #155bd4;
							cursor: pointer;
							margin-left: 8px;
						}
					}
				}
			}
		}
	}
	.no-data{
		line-height: 24px;
		color: #999;
		text-align: center;
			margin:auto
	}
</style>
