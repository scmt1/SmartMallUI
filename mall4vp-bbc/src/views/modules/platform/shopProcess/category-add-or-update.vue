<template>
  <div class="category-components">
    <div class="content">

      <!-- 左边-全部分类列表 -->
      <div class="left-box">
        <div class="search-box">
          <input
            v-model="categoryName" class="search-input"
            :placeholder="this.$i18n.t('publics.categoryInputTips')"
            size="small"
          >
        </div>
        <div class="categoryTree-box">
          <el-tree
            ref="categoryTree"
            v-loading="loading"
            :data="categorgTreeData"
            node-key="categoryId"
            :filter-node-method="filterNode"
            :props="categoryListTreeProps"
            class="filter-tree"
            show-checkbox
            highlight-current
            :render-after-expand="false"
            icon-class="el-icon-arrow-right"
            :default-expanded-keys="signCategoryParentIds"
            :default-checked-keys="signCategoryIds"
            @check-change="handleCheckChange"
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
          </el-tree>
        </div>
      </div>

      <!-- 右边-选中类目表格 -->
      <div ref="tableBox" class="right-box table-box">
        <el-table
          :data="signCategories"
          header-cell-class-name="table-header"
          style="width: 100%"
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
            prop="customizeRate"
            :label="this.$i18n.t('shopProcess.customRate')"
          >
            <template slot-scope="scope">
              <div class="custom-rate">
                <el-input
                  v-model="scope.row.customizeRate"
                  type="number"
                  :min="0"
                  :max="99.9999"
                  :precision="4"
                  placeholder="0~99.9999"
                  size="small"
                  style="width: 80%;"
                  @blur="checkCustomizeRateInt(scope)"
                />%
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="qualifications"
            :label="this.$i18n.t('shopProcess.categoryQualifications')"
            width="200px"
          >
            <template slot-scope="scope">
              <div class="business-qual">
                <imgs-upload v-model="scope.row.qualifications" :limit="2" :prompt="false" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            :label="this.$i18n.t('remindPop.operation')"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="deleteSelectedCategory(scope)">{{ $t('remindPop.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- /右边-选中类目表格 -->

    </div>
  </div>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import imgsUpload from '@/components/imgs-upload'
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
    signCategoryList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      message: false,
      // 全部分类
      categorgTreeData: [],
      // 树形是否初始化完成
      isInitialize: false,
      // 搜索参数
      categoryName: '',
      loading: false,
      categoryListTreeProps: {
        value: 'categoryId',
        label: 'name'
      },

      // 已选分类
      signCategories: this.signCategoryList,

      // 已选分类id数组
      signCategoryIds: [],
      // 已选分类父分类id数组
      signCategoryParentIds: [],
      // 已选分类父分类的id set集合
      signCategoryParentIdSet: null,

      // 平台分类
      patformCategories: []
    }
  },

  beforeCreate () {
    vueApp = this
  },

  watch: {
    // 已选分类列表
    signCategories () {
      this.$emit('getSignCategoryList', this.signCategories)
    },
    categoryName (val) {
      this.$refs.categoryTree.filter(val)
    }
  },

  mounted () {
    this.signCategoryParentIdSet = new Set()
    this.getPlatformCategory()
    this.getIds(this.signCategories, 0)
  },

  methods: {
    /**
     * 获取平台分类列表，并转换成树形结构
     */
    getPlatformCategory () {
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams({
          maxGrade: 2
        })
      }).then(({ data }) => {
        // 过滤下线分类
        data = data.filter(el => el.status !== 0)

        this.loading = false
        this.patformCategories = data
        let categorgTreeData = treeDataTranslate(data, 'categoryId', 'parentId')
        // 过滤没有下级分类的类目
        categorgTreeData = this.removeNotThirdCategoryItem(categorgTreeData)
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
     * 搜索结点，该方法只起标记作用，
     */
    filterNode (value, data, node) {
      this.isInitialize = true
      node.markIsExpanded = false
      return true
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
     * 去除没有三级分类的类目
     */
    removeNotThirdCategoryItem (treeData) {
      const firstCategory = treeData
      let length = firstCategory.length
      for (let i = 0, index = 0; i < length; i++) {
        if (firstCategory[index].grade !== 2) {
          if (firstCategory[index].children && firstCategory[index].children !== undefined && (firstCategory[index].children.some(item => item.children) || firstCategory[index].grade !== 0)) {
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
     * 节点选中状态发生变化时的回调
     * @param {Object} nodeObj 该节点所对应的对象
     * @param {Boolean} nodeStatus 节点本身是否被选中
     */
    handleCheckChange (nodeObj, nodeStatus) {
      if (nodeObj.grade !== 2) {
        return
      }
      if (nodeStatus) {
        if (this.signCategories.length === 200) {
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
          this.getIds(this.signCategories, 1)
          return
        }
        const signCategory = {
          categoryId: nodeObj.categoryId,
          categoryName: nodeObj.categoryName,
          parentName: nodeObj.parentName || '',
          platformRate: nodeObj.deductionRate,
          categoryStatus: nodeObj.status,
          parentId: nodeObj.parentId,
          qualifications: ''
        }
        if (!nodeObj.parentName) {
          this.patformCategories.some(el => {
            if (el.categoryId === nodeObj.parentId) {
              signCategory.parentName = el.categoryName
              return false
            }
          })
        }
        this.signCategories.push(signCategory)
        this.signCategoryParentIdSet.add(nodeObj.parentId)
      } else {
        this.signCategories = this.deleteById(nodeObj.categoryId, this.signCategories)
      }
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
      this.signCategories.splice(index, 1)
      this.getIds(this.signCategories, 1)
    },

    /**
     * 自定义扣率输入框判断
     */
    checkCustomizeRateInt (scope) {
      const { row, $index } = scope
      const customizeRate = parseFloat(row.customizeRate)
      if (customizeRate || customizeRate === 0) {
        const reg = /^(([1-9]{0,1}?\d{1}?)|(0{1}))(\.\d{0,4})?$/
        if (!reg.test(customizeRate)) {
          this.$set(this.signCategories[$index], 'customizeRate', '')
          this.messageClosed = false
          this.$message({
            message: this.$i18n.t('shopProcess.customizeRateErrorTips'),
            type: 'error',
            duration: 2000,
            onClose: () => {
              this.messageClosed = true
            }
          })
        }
        if (customizeRate === 0) {
          this.$set(this.signCategories[$index], 'customizeRate', 0)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.category-components {
  .content {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    color: #606266;
    // 左边-全部分类列表
    .left-box {
      display: block;
      width: 20%;
      min-width: 200px;
      margin-right: 10px;
      .search-box {
        position: relative;
        // width: 262px;
        width: 100%;
        height: 36px;
        background: #FFFFFF;
        border: 1px solid #E8E9EC;
        box-sizing: border-box;
        margin-bottom: 10px;
        .search-input {
          width: 100%;
          height: 100%;
          padding: 0 67px 0 12px;
          border: none;
          outline: none;
          box-sizing: border-box;
        }
        input::-webkit-input-placeholder {
          font-size: 14px;
          color: #999;
        }
      }
      .categoryTree-box {
        height: 450px;
        font-size: 14px;
        border: 1px solid #E9EAEC;
        background: #FFFFFF;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        overflow-y: scroll;
        padding: 10px 0;
        /* 谷歌隐藏滚动条 */
        &::-webkit-scrollbar {
          display: none;
        }
        /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
        /* IE隐藏滚动条 */
        -ms-overflow-style: none;
        /* 火狐隐藏滚动条 */
        overflow: -moz-scrollbars-none;

        & >>> .filter-tree {
          padding-right: 10px;
          .el-tree-node__expand-icon {
            position: absolute;
            right: 2%;
          }
          .el-checkbox {
            margin-left: 12px;
          }
          .el-tree-node__expand-icon.expanded {
            transform: rotate(-90deg);
          }
          .custom-tree-node {
            display: inline-block;
            max-width: 230px;
            padding-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            box-sizing: border-box;
          }
        }
      }
    }

    // 右边-选中分类表格
    .right-box.table-box {
      position: relative;
      display: block;
      width: 80%;
      max-height: 495px;
      border: 1px solid #E9EAEC;
      border-bottom: 0;
      box-sizing: border-box;

      // 上传图片样式
      .business-qual {
        & >>> .mul-pic-upload .el-upload-list--picture-card .el-upload-list__item {
          width: 80px;
          height: 80px;
          line-height: 80px;
          margin-bottom: 0;
        }
        & >>> .mul-pic-upload .el-upload--picture-card {
          width: 80px;
          height: 80px;
          line-height: 80px;
        }
      }

      // 表格
      & >>> .el-table__body-wrapper {
        max-height: 445px;
        overflow-y: scroll;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
      }
      & >>> .el-table__body-wrapper::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
      & >>> .el-table__body {
        width: 100%;
      }
      // 自定义扣率
      .custom-rate {
        & >>> .el-input {
          .el-input__inner {
            padding: 0 5px;
            padding-right: 0;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">

.category-components {
  .filter-tree {
    // margin-top: 14px;
    // border: 1px solid #E9EAEC;
    box-sizing: border-box;
    overflow-y: scroll;
    .el-tree-node__content {
      padding-right: 10px;
    }
    .el-tree-node__expand-icon {
      position: absolute;
      right: 2%;
    }
    .el-checkbox {
      margin-left: 12px;
    }
    .el-tree-node__expand-icon.expanded {
      transform: rotate(-90deg);
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
</style>