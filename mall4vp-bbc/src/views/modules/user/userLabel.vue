<template>
	<div class="mod-member-label">
		<div class="title">
			{{ $t('user.allLabels') }}
		</div>
		<div class="tabs">
			<el-tabs>
				<!-- 条件标签 -->
				<el-tab-pane :label="$t('user.conditionLabel')">
					<div class="default-btn primary-btn" @click="showEditFrame('',1)">{{ $t('user.addLabel') }}</div>
					<!-- 不同标签内容 -->
					<div class="label-container">
						<!-- 系统标签 -->
						<!-- <div class="system-label label-box">
							<div class="label-type-wrapper">
								<span class="label-type">系统标签</span>
								<span class="label-tips">标签每天0点更新</span>
							</div>
							<div class="label-content">
								<div class="label-item">
									<div class="label-name">
										沉默客户
									</div>
									<div class="font-line">
										从未支付的客户
									</div>
									<div class="font-line">
										人数：1
									</div>
									<div class="font-line">
										更新时间：2020/09/12 02:19
									</div>
									<div class="switch">（已开启）</div>
									<div class="op-btn-wrapper">
										<span>更新</span>
										<span>关闭</span>
									</div>
								</div>
							</div>
						</div> -->
						<!-- 自定义标签 -->
						<div class="label-tips">
							<span class="label-type">{{ $t('user.customConditionLabel') }}</span>
							<span class="label-tips">{{ $t('user.customConditionLabelTips') }}</span>
						</div>
						<div class="label-content">
							<div v-for="(item, index) in customLabelList" :key="index" class="label-item">
								<div class="label-name">
									{{item.tagName}}
								</div>
								<div class="font-line">
									{{ $t('user.peopleNum') }}：{{item.userNum}}
								</div>
								<div class="font-line">
									{{ $t('user.creationTime') }}：{{item.createTime}}
								</div>
								<div class="font-line">
									{{ $t('user.updateTime') }}：{{item.statisticUpdateTime}}
								</div>
								<!-- <div class="switch">（已开启）</div> -->
								<div class="op-btn-wrapper">
									<span @click="refreshLabel(item.userTagId)">{{ $t('user.updateBtn') }}</span>
									<span @click="showEditFrame(item.userTagId,1)">{{ $t('user.editBtn') }}</span>
									<span @click="deleteLabel(item.userTagId)">{{ $t('user.deleteBtn') }}</span>
								</div>
							</div>
							<div v-if="customLabelList.length === 0" class="no-data">{{ $t('user.noData') }}</div>
						</div>
					</div>
				</el-tab-pane>
				<!-- 手动标签 -->
				<el-tab-pane :label="$t('user.manualLabel')">
					<div class="default-btn primary-btn" @click="showEditFrame('',0)">{{ $t('user.addLabel') }}</div>
						<!-- <div class="search-wapper">
							<input placeholder="请输入标签名称">
							<button>搜索</button>
						</div> -->
					<!-- 标签内容 -->
					<div class="label-container">
						<!-- 手动标签 -->
						<div class="label-tips">
							<span class="label-type">{{ $t('user.manualLabel') }}</span>
						</div>
						<div class="label-content">
							<div v-for="(item, index) in manualLabelList" :key="index" class="label-item">
								<div class="label-name">
									{{item.tagName}}
								</div>
								<div class="font-line">
									{{ $t('user.peopleNum') }}：{{item.userNum}}
								</div>
								<div class="font-line">
									{{ $t('user.creationTime') }}：{{item.createTime}}
								</div>
								<!-- <div class="font-line">
									更新时间：{{item.updateTime}}
								</div> -->
								<div class="op-btn-wrapper">
									<!-- <span @click="refreshLabel(item.userTagId)">{{ $t('user.update') }}</span> -->
									<span @click="showEditFrame(item.userTagId,0)">{{ $t('user.editBtn') }}</span>
									<span @click="deleteLabel(item.userTagId)">{{ $t('user.deleteBtn') }}</span>
								</div>
							</div>
							<div v-if="manualLabelList.length === 0" class="no-data">{{ $t('user.noData') }}</div>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		<!-- 新增/编辑标签 -->
		<user-label-edit v-if="isShowEditFrame" ref="addOrEdit" @refreshLabelList="addOrEditSucc"></user-label-edit>
	</div>
</template>

<script>
import userLabelEdit from './userLabelEdit'
export default {
  components: {
    userLabelEdit
  },
  data () {
    return {
      isShowEditFrame: false,
      customLabelList: [],
      manualLabelList: []
    }
  },
  mounted () {
    this.getCustomLabelList()
  },
  methods: {
    // 新增弹窗
    showEditFrame (userTagId, tagType) {
      this.isShowEditFrame = true
      this.$nextTick(() => {
        this.$refs.addOrEdit.init(userTagId, tagType)
      })
    },
    // 获取自定义标签列表
    getCustomLabelList () {
      this.$http({
        url: this.$http.adornUrl('/user/userTag/getTagList'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        let customLabelList = []
        let manualLabelList = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].tagType === 1) {
            customLabelList.push(data[i])
          } else if (data[i].tagType === 0) {
            manualLabelList.push(data[i])
          }
        }
        this.customLabelList = customLabelList
        this.manualLabelList = manualLabelList
      })
    },
    refreshLabel (userTagId) {
      this.$http({
        url: this.$http.adornUrl('/user/userTag/refresh/' + userTagId),
        method: 'GET',
        data: this.$http.adornData({})
      }).then(({ data }) => {
        this.getCustomLabelList()
        this.$message.success(this.$i18n.t('user.updateSucceeded'))
      })
    },
    deleteLabel (userTagId) {
      this.$http({
        url: this.$http.adornUrl('/user/userTag/' + userTagId),
        method: 'DELETE',
        data: this.$http.adornData({})
      }).then(({ data }) => {
        this.getCustomLabelList()
        this.$message.success(this.$i18n.t('user.deletionSucceeded'))
      })
    },
    addOrEditSucc (data) {
      this.isShowEditFrame = false
      if (data) {
        this.getCustomLabelList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-member-label {
	.title {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 10px;
	}
	.tabs {
		.label-container {
			background-color:#f2f2f6 ;
			padding: 10px;
			margin-top:10px ;
			border-radius: 10px;
			.label-tips {
				margin: 15px 0 10px 0;
				.label-type{
					font-size: 16px;
    			font-weight: bold;
				}
				.label-tips {
					font-size: 14px;
					color: #999;
					margin-left: 15px;
				}
			}
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
}
.no-data{
	line-height: 24px;
    color: #999;
    text-align: center;
		margin:auto
}
</style>
