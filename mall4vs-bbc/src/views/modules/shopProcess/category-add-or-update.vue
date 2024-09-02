<template>
  <!-- 签约分类弹窗 -->
  <el-dialog
    :visible.sync="visible"
    :show-close="false"
    :append-to-body="true"
    :close-on-click-modal="false"
    top="10vh"
    width="70%"
    class="signing-categiries-pop"
    @close="closePopup"
  >
    <div class="signing-categiries-content">
      <!-- 标题 -->
      <div class="title">
        <div class="text" ><span class="stress">*</span>{{ $t('shopProcess.applySigningCategory') }}</div>
        <!-- <div class="text" v-else><span class="stress">*</span>{{ $t('shopProcess.editSigningCategory') }}</div> -->
        <div class="tips">{{ $t('shopProcess.signingCategoryTips') }}，
          <span v-if="isFirst">
            {{ $t('shopProcess.preSigned') }}
            <span class="bold">{{ signingCount}}</span>
            {{ $t('shopProcess.piece') }}{{ $t('shopProcess.category') }}，
          </span>
          {{$t('shopProcess.chosen')}}
          <span class="bold">{{allSelectedCategories.length }}</span>
          {{ $t('shopProcess.piece') }}{{ $t('shopProcess.category') }}，
          {{ $t('shopProcess.mostAdd') }}
          <span class="bold">200</span>
          {{ $t('shopProcess.piece') }}{{ $t('shopProcess.category') }}
        </div>
        <div class="close-btn" @click="closePopup"><i class="el-icon-close" /></div>
      </div>

      <!-- 内容 -->
      <div class="content">

        <div class="left-box">
          <div class="search-box">
            <input v-model="categoryName" class="search-input" :placeholder="this.$i18n.t('publics.categoryInputTips')">
          </div>
          <el-tree
            ref="categoryTree"
            v-loading="loading"
            :data="categorgTreeData"
            node-key="categoryId"
            :filter-node-method="filterNode"
            :props="categoryListTreeProps"
            class="filter-tree"
            show-checkbox
            :render-after-expand="false"
            highlight-current
            icon-class="el-icon-arrow-right"
            :default-expanded-keys="signCategoryParentIds"
            :default-checked-keys="signCategoryIds"
            @check-change="handleCheckChange"
            @node-click="handleNodeClick"
          >
            <template slot-scope="{ node, data }">
              <el-tooltip
                :content="data.grade === 2 ? data.categoryName + ' ' + data.deductionRate + '%' : data.categoryName"
                placement="right"
                effect="light"
                :open-delay="500"
                class="custom-tree-node"
              >
                <span>
                  <span
                    v-html="$options.filters.filterKey(data, categoryName, node)"
                  ></span>
                  <span v-if="data.grade === 2">{{ ' ' + data.deductionRate + '%' }}</span>
                </span>
              </el-tooltip>
            </template>
            <!-- <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ data.categoryName }} </span>
              <span>{{ data.deductionRate }}%</span>
            </span> -->
          </el-tree>
        </div>

        <!-- 右边表格 -->
        <div ref="tableBox" class="right-boxs table-box prods-select-body">
          <el-table
            :data="signCategories"
            :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
          >
            <el-table-column
              prop="categoryName"
              :label="this.$i18n.t('shopProcess.categoryName')"
            />
            <el-table-column
              prop="parentName"
              :label="this.$i18n.t('shopProcess.parentCategoryName')"
            />
            <el-table-column
              prop="platformRate"
              :label="this.$i18n.t('shopProcess.categoryRate')"
            >
              <template slot-scope="{ row }">
                <span v-if="row.platformRate || row.platformRate === 0">{{ row.platformRate }} %</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="qualifications"
              :label="this.$i18n.t('shopProcess.categoryQualifications')"
              width="250px"
            >
              <template slot-scope="scope">
                <div class="business-qual">
                  <imgs-upload v-model="scope.row.qualifications" :limit="2" :prompt="false" />
                </div>
              </template>
            </el-table-column>
<!--            <el-table-column-->
<!--              prop="categoryStatus"-->
<!--              :label="this.$i18n.t('shopProcess.categoryStatus')"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <div v-if="scope.row.categoryStatus === 1" class="tag-txt">{{ $t('publics.normal') }}</div>-->
<!--                <div v-if="scope.row.categoryStatus === 0" class="tag-txt red-tag-txt">{{ $t('publics.LowerShelf') }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
            <el-table-column
              prop="address"
              :label="this.$i18n.t('sys.operation')"
              align="center"
            >
              <template slot-scope="scope">
                <div class="default-btn text-btn" @click="deleteSelectedCategory(scope)">{{ $t('text.delBtn') }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="btn-row foot-btn">
        <div class="default-btn" @click="closePopup">{{ $t('homes.no') }}</div>
        <div class="default-btn primary-btn" @click="comfirmSubmit">{{ $t('homes.yes') }}</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import imgsUpload from '@/components/imgs-upload'
import { log } from 'video.js'
// 用于指向this
let vueApp = null

export default {
  filters: {
    filterKey (data, key, node) {
      // 获取结点分类名称
      let categoryName = data.categoryName
      if (!vueApp.isInitialize) {
        // 初始化时默认显示已经勾选的结点，下面代码会影响默认展开的值，因为在第一次初始化时直接返回名称
        return `<span>${categoryName}</span>`
      }
      if (!node.markIsExpanded) {
        // 如果当前结点没有被标记为展开
        node.expanded = false
      }
      const ind = categoryName.indexOf(key)
      if (ind !== -1 && key !== '') {
        // 当前结点匹配到关键词
        if (!node.markIsExpanded) {
          if (node.parent && !node.parent.markIsExpanded) {
            node.parent.expanded = true
            node.parent.markIsExpanded = true
            if (node.parent.parent && !node.parent.parent.markIsExpanded) {
              node.parent.parent.expanded = true
              node.parent.parent.markIsExpanded = true
            }
          }
        }
        // 高亮关键词
        return (
          categoryName.split('').slice(0, ind).join('') + "<span style='color: coral'>" + key + '</span>' + categoryName.split('').slice(ind + key.length).join('')
        )
      } else {
        // 当前结点没有匹配到关键词或者用户输入为空时，直接返回名称
        return `<span>${categoryName}</span>`
      }
    }
  },
  components: {
    imgsUpload
  },
  props: {
    // 签约分类列表
    signCategoryList: {
      type: Array,
      default () {
        return []
      }
    },
    /**
     * 是否从店铺信息申请签约
     * applyForSign=true时，请求可以签约的平台分类列表（已经签约的平台分类不会返回）
     */
    applyForSign: {
      type: Boolean,
      default: false
    },
    signingCount: {
      type: Number,
      default: 0
    },
    isCreate: {
      type: Boolean,
      default: false
    },
    isFirst: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      message: false,
      // 图片前缀
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      // 树形是否初始化完成
      isInitialize: false,
      // 搜索参数
      categoryName: '',
      categorgTreeData: [],
      categoryListTreeProps: {
        value: 'categoryId',
        label: 'name'
      },
      visible: false,
      imgUrl: '',

      // table渲染列表(可滚动)
      signCategories: [],
      // 已选分类(可分割)
      newSignCategories: [],

      // 总已选分类列表
      allSelectedCategories: [],

      // 父级分类
      currentParentObj: {},

      // 已选分类id数组
      signCategoryIds: [],
      // 已选分类父分类id数组
      signCategoryParentIds: [],
      // 已选分类父分类的id set集合
      signCategoryParentIdSet: null,

      loading: false,

      // 总分类列表
      allCategories: []
    }
  },

  beforeCreate () {
    vueApp = this
  },

  watch: {
    categoryName (val) {
      this.$refs.categoryTree.filter(val)
    }
  },

  methods: {
    init () {
      this.visible = true
      this.signCategoryParentIdSet = new Set()
      this.getPlatformCategory()
      this.getSignCategoryList()

      this.$nextTick(() => {
        this.$refs['tableBox'].addEventListener('scroll', this.hanldeScroll, true)
      })
    },

    /**
     * 已签约类目列表
     */
    getSignCategoryList () {
      const list = JSON.parse(JSON.stringify(this.signCategoryList))
      const allSelectedCategories = []
      list.forEach(el => {
        allSelectedCategories.push({
          categoryId: el.categoryId,
          categoryName: el.name,
          parentId: el.parentId,
          parentName: el.parentName,
          platformRate: el.platformRate,
          customizeRate: el.customizeRate,
          qualifications: el.qualifications,
          categoryStatus: el.categoryStatus,
          categoryShopId: el.categoryShopId
        })
      })
      this.allSelectedCategories = JSON.parse(JSON.stringify(allSelectedCategories))
      this.newSignCategories = JSON.parse(JSON.stringify(allSelectedCategories))
      this.getIds(this.allSelectedCategories, 0)
      this.signCategories = this.newSignCategories.splice(0, 15)
    },

    /**
     * 搜索结点，该方法只起标记作用，
     */
    filterNode (value, data, node) {
      this.isInitialize = true
      node.markIsExpanded = false
      return true
    },

    /**
     * 监听滚动
     */
    hanldeScroll () {
      // const tableWrapper = document.querySelector(
      //   '.right-box.table-box .el-table .el-table__body-wrapper'
      // )
      // const tableBody = document.querySelector(
      //   '.right-box.table-box .el-table .el-table__body-wrapper .el-table__body'
      // )
      // // 容器高度
      // const boxHeight = tableWrapper.offsetHeight
      // // 距离顶部距离
      // const boxScrollTop = tableWrapper.scrollTop
      // // 表格高度
      // const tableHeight = tableBody.offsetHeight

      // if (boxScrollTop === (tableHeight - boxHeight)) {
      this.signCategories = this.signCategories.concat(this.newSignCategories.splice(0, 15))
      // }
    },

    /**
     * 获取平台分类列表，并转换成树形结构
     */
    getPlatformCategory () {
      this.loading = true
      const url = this.applyForSign ? `/shop/signingAuditing/listApplySigningCategory` : `/prod/category/platformCategory`
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'get',
        params: this.$http.adornParams({
          maxGrade: 2,
          status: 1
        })
      }).then(({ data }) => {
        this.loading = false
        this.allCategories = data
        let categorgTreeData = treeDataTranslate(data, 'categoryId', 'parentId')
        // 过滤没有下级分类的类目
        categorgTreeData = this.removeNotThirdCategoryItem(categorgTreeData)
        console.log(categorgTreeData)
        // categorgTreeData = this.removeNotThirdCategoryItem(categorgTreeData)
          // this.categorgTreeData = this.disabledParentCategory(categorgTreeData)
        this.categorgTreeData = categorgTreeData
      })
    },

    getIds (data, sts) {
      this.signCategoryIds.splice(0, this.signCategoryIds.length)
      this.signCategoryParentIds.splice(0, this.signCategoryParentIds.length)
      data.forEach(el => {
        // 已选分类id
        this.signCategoryIds.push(el.categoryId)
        // 已选分类的父分类id
        this.signCategoryParentIdSet.add(el.parentId)
      })
      this.signCategoryParentIds = Array.from(this.signCategoryParentIdSet)
      if (sts === 1) {
        this.$nextTick(() => {
          this.$refs['categoryTree'].setCheckedKeys(this.signCategoryIds)
        })
      }
    },

    /**
     * 去除没有下级分类的类目
     */

    removeNotThirdCategoryItem (treeData) {
      const firstCategory = treeData
      const length = firstCategory.length
      for (let i = 0, index = 0; i < length; i++) {
        if (firstCategory[index].grade !== 2) {
          if (firstCategory[index].children && firstCategory[index].children.length > 0 && (firstCategory[index].children.some(item => item.children) || firstCategory[index].grade !== 0)) {
            const secondCategory = firstCategory[index].children
            firstCategory[index].children = this.removeNotThirdCategoryItem(secondCategory)
          } else {
            firstCategory.splice(index, 1)
            // 当前位置的元素已经被删除，当前位置索引不用++
            continue
          }
        }
        index++
      }
      return firstCategory
    },

    /**
     * 把categoryListTree第三级分类外，其余全部禁用
     */
    disabledParentCategory (treeData) {
      for (let i = 0; i < treeData.length; i++) {
        if (treeData[i].children) {
          treeData[i].disabled = true
          treeData[i].children = this.disabledParentCategory(treeData[i].children)
        }
      }
      return treeData
    },

    /**
     * 节点选中状态发生变化时的回调
     * @param {Object} nodeObj 该节点所对应的对象
     * @param {Boolean} nodeStatus 节点本身是否被选中、
     */
    handleCheckChange (nodeObj, nodeStatus) {
      if (nodeObj.grade !== 2) {
        return
      }
      if (nodeStatus) {
        if (this.allSelectedCategories.length + this.signingCount === 200) {
          if (!this.message) {
            this.message = true
            this.$message({
              message: this.$i18n.t('shopProcess.categoryAddMaxLimitTips'),
              type: 'error',
              duration: 1000,
              onClose: () => {
                this.message = false
              }
            })
          }
          this.getIds(this.allSelectedCategories, 1)
          return
        }
        const signCategory = {
          categoryId: nodeObj.categoryId,
          categoryName: nodeObj.categoryName,
          parentName: nodeObj.parentName || '',
          platformRate: nodeObj.deductionRate,
          categoryStatus: nodeObj.status,
          qualifications: ''
        }
        if (!nodeObj.parentName) {
          this.allCategories.some(el => {
            if (el.categoryId === nodeObj.parentId) {
              signCategory.parentName = el.categoryName
              return false
            }
          })
        }
        this.allSelectedCategories.push(signCategory)
        this.newSignCategories.push(signCategory)
        this.signCategoryParentIdSet.add(nodeObj.parentId)
        if (!this.signCategories.length) {
          this.signCategories = this.signCategories.concat(this.newSignCategories.splice(0, 1))
        } else {
          this.hanldeScroll()
        }
      } else {
        this.allSelectedCategories = this.deleteById(nodeObj.categoryId, this.allSelectedCategories)
        this.newSignCategories = this.deleteById(nodeObj.categoryId, this.newSignCategories)
        this.signCategories = this.deleteById(nodeObj.categoryId, this.signCategories)
        this.hanldeScroll()
      }
      console.log(this.signCategories, 'signCategories')
    },

    /**
     * 根据id删除数组项
     * @param {Number} id 需要删除的id
     * @param {Array} list 目标数组
     * @return {Array}
     */
    deleteById: function (id, list) {
      for (let index = list.length - 1; index >= 0; index--) {
        if (list[index] && list[index].categoryId === id) {
          list.splice(index, 1)
        }
      }
      return list
    },

    /**
     * 删除已选分类
     */
    deleteSelectedCategory (scope) {
      const index = scope.$index
      this.allSelectedCategories.splice(index, 1)
      this.signCategories.splice(index, 1)
      this.getIds(this.allSelectedCategories, 1)
    },

    /**
     * 确认
     */
    comfirmSubmit () {
      if (this.allSelectedCategories.length > 0) {
        this.allSelectedCategories.forEach((el) => {
          this.signCategories.forEach((item) => {
            if (el.categoryId === item.categoryId) {
              el.qualifications = item.qualifications
            }
          })
        })
        this.signCategory()
      } else {
        this.$message({
          message: this.$i18n.t('shopProcess.categorySigningNotEmpty'),
          type: 'error',
          duration: 1000
        })
      }
    },

    /**
     * 请求签约分类
     */
    signCategory () {
      const params = []
      this.allSelectedCategories.forEach(item => {
        const param = {
          categoryId: item.categoryId,
          rate: item.platformRate,
          qualifications: item.qualifications ? item.qualifications : null
        }
        params.push(param)
      })
      const url = this.applyForSign ? '/shop/signingAuditing/addSigningCategory' : '/prod/category/signing'
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'post',
        data: params
      }).then(({ data }) => {
        this.$message({
          message: this.applyForSign ? this.$i18n.t('shopProcess.categoryAddSuccess') : this.$i18n.t('shopProcess.categorySaveSuccess'),
          type: 'success',
          duration: 1000
        })
        this.closePopup()
      })
    },

    /**
     * 关闭弹窗
     */
    closePopup () {
      this.$emit('closePopup', 'category')
    },
    handleNodeClick (nodeObj, nodeStatus) {
      if (nodeStatus.level !== 3) return
      let keys = this.allSelectedCategories.map(item => item.categoryId)
      if (nodeStatus.checked) {
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] === nodeObj.categoryId) {
            keys.splice(i, 1)
            break
          }
        }
      } else {
        keys = keys.concat(nodeObj.categoryId)
      }
      this.$refs.categoryTree.setCheckedKeys(keys)
    }
  }
}
</script>

<style lang="scss" scoped>
.signing-categiries-pop {
  & >>> .el-dialog__header {
    padding: 0;
  }
  & >>> .el-dialog__body {
    padding-top: 0;
    // padding-bottom: 0;
  }
  & >>> .el-dialog {
    min-width: 950px;
  }
  .signing-categiries-content {
    // 表格上的标题
    .title {
      display: flex;
      align-items: center;
      width: 100%;
      height: 64px;
      border-bottom: 1px solid #EAEAEA;
      .text {
        height: 23px;
        line-height: 21px;
        font-size: 16px;
        .stress {
          color: #FF2120;
          padding-right: 5px;
        }
      }
      .tips {
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        color: #999;
        margin-left: 10px;
        .bold {
          color: #000;
        }
      }
      .close-btn {
        font-size: 20px;
        color: #999;
        margin-left: auto;
        cursor: pointer;
      }
    }

    // 内容
    .content {
      display: flex;
      align-items: top;
      justify-content: space-between;
      margin-top: 20px;
      .left-box {
        width: 20%;
        height: 574px;
        background: #FFFFFF;
        .search-box {
          position: relative;
          // width: 262px;
          width: 100%;
          height: 36px;
          background: #FFFFFF;
          border: 1px solid #E8E9EC;
          box-sizing: border-box;
          .search-input {
            width: 100%;
            height: 100%;
            padding: 0 0 0 7px;
            border: none;
            outline: none;
            box-sizing: border-box;
          }
          input::-webkit-input-placeholder {
            font-size: 14px;
            color: #999;
          }
          .search-btn {
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 55px;
            height: 100%;
            font-size: 20px;
            color: #CBCED4;
            border-left: 1px solid #E8E9EC;
            cursor: pointer;
          }
        }
        & >>> .filter-tree {
          height: 524px;
          margin-top: 14px;
          border: 1px solid #E9EAEC;
          box-sizing: border-box;
          overflow-y: scroll;
          .el-tree-node__content {
            padding-right: 10px;
          }

          .el-checkbox {
            margin-left: 12px;
          }

          .custom-tree-node {
            display: inline-block;
            max-width: 185px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            font-size: 14px;
          }
          /* 谷歌隐藏滚动条 */
          &::-webkit-scrollbar {
            display: none;
          }
          /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
          /* IE隐藏滚动条 */
          -ms-overflow-style: none;
          /* 火狐隐藏滚动条 */
          overflow: -moz-scrollbars-none;
        }
      }

    }

    .foot-btn.btn-row {
      margin-top: 30px;
      text-align: right;
    }

  }
  .prods-select-body {
    height: 574px;
  }
}
</style>
<style lang="scss">

.signing-categiries-pop{
    .el-tree-node__expand-icon {
    position: absolute;
    right: 2%;
  }
  .el-tree-node__expand-icon.expanded {
    transform: rotate(-90deg);
  }
}


    .right-boxs {
      position: relative;
      // width: 946px;
      width: 80%;
      height: 574px;
      border: 1px solid #E9EAEC;
      box-sizing: border-box;
      margin-left: 21px;

      // 上传图片样式
      .business-qual {
          .mul-pic-upload .el-upload-list--picture-card .el-upload-list__item {
          width: 80px;
          height: 80px;
          line-height: 80px;
          margin-bottom: 0;
          img {
            vertical-align: top;
          }
        }
          .mul-pic-upload .el-upload--picture-card {
          width: 80px;
          height: 80px;
          line-height: 80px;
          background: #fff;
        }
      }
        .el-table__body-wrapper {
        max-height: 524px;
        overflow-y: scroll;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
      }
        .el-table__body-wrapper::-webkit-scrollbar {
        // display: none; /* Chrome Safari */
        // width: 30px;
        width: 6px; // 横向滚动条
        height: 6px; // 纵向滚动条 必写
      }
        .el-table__body {
        width: 100%;
      }
        .el-table__body-wrapper::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 3px;
      }
    }

    @media screen and (max-width:1680px){
      .right-boxs {
      position: relative;
      // width: 946px;
      width: 80%;
      height: 574px;
      border: 1px solid #E9EAEC;
      box-sizing: border-box;
      margin-left: 20px;

      .el-table__body-wrapper {
        max-height: 490px;
        overflow-y: scroll;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
      }

    }
    }
</style>
