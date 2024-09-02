<template>
    <div class="dictManage">
        <el-card>
            <el-row type="flex" justify="space-between" :gutter="20">
                <el-col v-show="expand" :span="6">
                    <el-row class="operation">
                        <el-button size="small" @click="addDcit" type="primary" icon="el-icon-plus">添加字典</el-button>
                        <el-dropdown @command="handleDropdown">
                            <el-button size="small">
                                更多操作
                                <i class="el-icon-caret-bottom"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="editDcit">编辑字典</el-dropdown-item>
                                <el-dropdown-item command="delDcit">删除字典</el-dropdown-item>
                                <el-dropdown-item command="refreshDcit">刷新</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-row>
                    <el-alert show-icon type="warning" :closable="false">
                        当前选择：
                        <span class="select-title">{{ editTitle }}</span>
                        <a class="select-clear" v-if="editTitle" @click="cancelEdit">取消选择</a>
                    </el-alert>
                    <el-input v-model="searchKey" suffix="el-icon-search" @change="search" placeholder="输入搜索字典" clearable/>
                    <div style="position: relative">
                        <div class="tree-bar" v-loading="treeLoading" :style="{ maxHeight: maxHeight }">
                            <el-tree
                                    ref="tree"
                                    node-key="id"
                                    :props="dictListTreeProps"
                                    :data="treeData"
                                    @node-click="selectTree"
                            ></el-tree>
                        </div>
                    </div>
                </el-col>
                <div class="expand">
                    <i :class="expandIcon" @click="changeExpand"></i>
                </div>
                <el-col :span="span">
                    <el-row v-show="openSearch" @keydown.enter.native="handleSearch">
                        <el-form ref="searchForm" :model="searchForm" inline label-width="70">
                            <el-form-item label="数据名称" prop="title">
                                <el-input
                                        size="small"
                                        type="text"
                                        v-model="searchForm.title"
                                        placeholder="请输入"
                                        clearable
                                        style="width: 200px"/>
                            </el-form-item>
                            <el-form-item label="状态" prop="status">
                                <el-select
                                        size="small"
                                        v-model="searchForm.status"
                                        placeholder="请选择"
                                        clearable
                                        style="width: 200px">
                                    <el-option value="0" label="正常"></el-option>
                                    <el-option value="-1" label="禁用"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="br">
                                <el-button size="small" @click="handleSearch" type="primary" icon="ios-search">搜索</el-button>
                                <el-button size="small" @click="handleReset">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                    <el-row class="operation">
                        <el-button size="small" @click="getDataList" icon="md-refresh">刷新数据</el-button>
                        <el-button size="small" @click="add" type="primary" icon="md-add">添加数据</el-button>
                        <el-button size="small" type="dashed" @click="openSearch = !openSearch">{{
                            openSearch ? '关闭搜索' : '开启搜索'
                            }}
                        </el-button>
                        <el-button size="small" type="dashed" @click="openTip = !openTip">{{
                            openTip ? '关闭提示' : '开启提示'
                            }}
                        </el-button>
                    </el-row>
<!--                    <el-alert show-icon type="warning" v-show="openTip" :closable="false">-->
<!--                        已选择-->
<!--                        <span class="select-count">{{ selectList.length }}</span> 项-->
<!--                        <a class="select-clear" @click="clearSelectAll">清空</a>-->
<!--                    </el-alert>-->
                    <el-table
                            :loading="loading"
                            border
                            :data="data"
                            sortable="custom"
                            @on-sort-change="changeSort"
                            @on-selection-change="showSelect"
                            ref="table"
                    >
<!--                        <el-table-column-->
<!--                                align="center"-->
<!--                                type="selection"-->
<!--                                width="55px"-->
<!--                        />-->
                        <el-table-column
                                align="center"
                                prop="title"
                                label="名称"
                                width="200px"
                        />
                        <el-table-column
                                align="center"
                                prop="value"
                                label="数据值"
                                width="200px"
                        />
                        <el-table-column
                                align="center"
                                prop="description"
                                label="备注"
                                width="200px"
                        />
                        <el-table-column
                                align="center"
                                prop="sortOrder"
                                label="排序值"
                                width="100px"
                        />
                        <el-table-column
                                align="center"
                                prop="status"
                                label="状态"
                                width="100px"
                        >
                            <!-- 0:商家下架 1:正常 -->
                            <template slot-scope="scope">
                                <span v-if="scope.row.status === 0" class="tag-text">启用</span>
                                <span v-else-if="scope.row.status === -1" class="tag-text">停用</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="createTime"
                                label="创建时间"
                                width="200px"
                        />
                        <el-table-column
                                align="center"
                                label="操作"
                                fixed="right"
                                width="100"
                        >
                            <template slot-scope="scope">
                                <div class="text-btn-con" >
                                    <div class="default-btn text-btn" @click="edit(scope.row)">编辑</div>
                                    <div class="default-btn text-btn" @click="remove(scope.row)">删除</div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            style="margin-top: 20px;"
                            @size-change="changePageSize"
                            @current-change="changePage"
                            :current-page="searchForm.pageNumber"
                            :page-sizes="[10, 20, 50]"
                            :page-size="searchForm.pageSize"
                            :total="total"
                            layout="total, sizes, prev, pager, next, jumper"
                    ></el-pagination>
                </el-col>
            </el-row>
        </el-card>

        <el-dialog
                :title="dictModalTitle"
                :visible.sync="dictModalVisible"
                :close-on-click-modal="false"
                width="500px"
        >
            <el-form
                    ref="dictForm"
                    :model="dictForm"
                    label-width="80"
                    :rules="dictFormValidate"
            >
                <el-form-item label="字典名称" prop="title">
                    <el-input v-model="dictForm.title"/>
                </el-form-item>
                <el-form-item label="字典类型" prop="type" class="block-tool">
                    <el-tooltip
                            placement="right"
                            :max-width="220"
                            transfer
                            content="建议英文名且需唯一 非开发人员谨慎修改"
                    >
                        <el-input v-model="dictForm.type"/>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="备注" prop="description">
                    <el-input v-model="dictForm.description"/>
                </el-form-item>
                <el-form-item label="排序值" prop="sortOrder">
                    <el-tooltip
                            trigger="hover"
                            placement="right"
                            content="值越小越靠前，支持小数"
                    >
                        <el-input-number
                                :max="1000"
                                :min="0"
                                v-model="dictForm.sortOrder"
                        ></el-input-number>
                    </el-tooltip>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" type="text" @click="dictModalVisible = false">取消</el-button>
                <el-button size="small"
                        type="primary"
                        :loading="submitLoading"
                        @click="handelSubmitDict"
                >提交
                </el-button
                >
            </div>
        </el-dialog>

        <el-dialog
                :title="modalTitle"
                :visible.sync="modalVisible"
                :close-on-click-modal="false"
                width="500px"
        >
            <el-form ref="form" :model="form" label-width="80" :rules="formValidate">
                <el-form-item label="名称" prop="title">
                    <el-input v-model="form.title"/>
                </el-form-item>
                <el-form-item label="数据值" prop="value">
                    <el-input v-model="form.value"/>
                </el-form-item>
                <el-form-item label="备注" prop="description">
                    <el-input v-model="form.description"/>
                </el-form-item>
                <el-form-item label="排序值" prop="sortOrder">
                    <el-tooltip
                            trigger="hover"
                            placement="right"
                            content="值越小越靠前，支持小数"
                    >
                        <el-input-number
                                :max="1000"
                                :min="0"
                                v-model="form.sortOrder"
                        ></el-input-number>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-switch
                            size="large"
                            v-model="form.status"
                            :active-value="0"
                            :inactive-value="-1"
                    >
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" type="text" @click="modalVisible = false">取消</el-button>
                <el-button size="small" type="primary" :loading="submitLoading" @click="handelSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'dicManage',
    data () {
      return {
        openSearch: true,
        openTip: true,
        treeLoading: false, // 树加载状态
        maxHeight: '500px',
        loading: false, // 表格加载状态
        editTitle: '', // 编辑节点名称
        searchKey: '', // 搜索树
        expand: true,
        span: 17,
        expandIcon: 'el-icon-arrow-left',
        selectNode: {},
        dictListTreeProps: {
          value: 'id',
          label: 'title'
        },
        treeData: [], // 树数据
        selectList: [], // 多选数据
        searchForm: {
          // 搜索框对应data对象
          name: '',
          status: '',
          pageNumber: 1, // 当前页数
          pageSize: 10, // 页面大小
          sort: 'sortOrder', // 默认排序字段
          order: 'asc' // 默认排序方式
        },
        modalType: 0, // 添加或编辑标识
        modalVisible: false, // 添加或编辑显示
        dictModalVisible: false,
        dictModalTitle: '',
        modalTitle: '', // 添加或编辑标题
        dictForm: {
          title: '',
          type: '',
          description: '',
          sortOrder: 0
        },
        form: {
          // 添加或编辑表单对象初始化数据
          title: '',
          value: '',
          status: 0,
          description: '',
          sortOrder: 0
        },
        dictFormValidate: {
          // 表单验证规则
          title: [{required: true, message: '不能为空', trigger: 'change'}],
          type: [{required: true, message: '不能为空', trigger: 'change'}],
          sortOrder: [
            {
              required: true,
              type: 'number',
              message: '排序值不能为空',
              trigger: 'change'
            }
          ]
        },
        formValidate: {
          // 表单验证规则
          title: [{required: true, message: '不能为空', trigger: 'change'}],
          value: [{required: true, message: '不能为空', trigger: 'change'}],
          sortOrder: [
            {
              required: true,
              type: 'number',
              message: '排序值不能为空',
              trigger: 'change'
            }
          ]
        },
        submitLoading: false, // 添加或编辑提交状态
        data: [], // 表单数据
        total: 0 // 表单数据总数
      }
    },
    methods: {
      init () {
        // 获取树数据
        this.getAllDict()
        // 获取表单数据
        this.getDataList()
      },
      getAllDict () {
        this.treeLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/dict/getAll'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data) {
            this.treeLoading = false
            this.treeData = data
          }
        })
      },
      search () {
        // 搜索树
        if (this.searchKey) {
          this.treeLoading = true
          this.$http({
            url: this.$http.adornUrl('/sys/dict/search'),
            method: 'get',
            params: this.$http.adornParams({key: this.searchKey})
          }).then(({ data }) => {
            if (data) {
              this.treeLoading = false
              this.treeData = data
            }
          })
        } else {
          // 为空重新加载
          this.getAllDict()
        }
      },
      selectTree (v) {
        if (v.id) {
          this.dictForm = {
            title: '',
            type: '',
            description: '',
            sortOrder: 0
          }
          // 转换null为""
          for (let attr in v[0]) {
            if (v[0][attr] == null) {
              v[0][attr] = ''
            }
          }
          let str = JSON.stringify(v)
          let data = JSON.parse(str)
          this.selectNode = data
          this.dictForm = data
          this.editTitle = data.title + '(' + data.type + ')'
          // 重新加载表
          this.searchForm.pageNumber = 1
          this.searchForm.pageSize = 10
          this.getDataList()
        } else {
          this.cancelEdit()
        }
      },
      cancelEdit () {
        let data = this.$refs.tree.getCheckedNodes()[0]
        if (data) {
          data.selected = false
        }
        // 取消选择后获取全部数据
        this.selectNode = {}
        this.editTitle = ''
        this.getDataList()
      },
      changeSelect (v) {
        this.selectList = v
      },
      changeExpand () {
        this.expand = !this.expand
        if (this.expand) {
          this.expandIcon = 'el-icon-arrow-left'
          this.span = 18
        } else {
          this.expandIcon = 'el-icon-arrow-right'
          this.span = 23
        }
      },
      changePage (v) {
        this.searchForm.pageNumber = v
        this.getDataList()
        this.clearSelectAll()
      },
      changePageSize (v) {
        this.searchForm.pageSize = v
        this.getDataList()
      },
      getDataList () {
        this.loading = true
        if (this.selectNode.id) {
          this.searchForm.dictId = this.selectNode.id
        } else {
          delete this.searchForm.dictId
        }
        if (!this.searchForm.status) {
          this.searchForm.status = ''
        }
        this.$http({
          url: this.$http.adornUrl('/sys/dictData/getByCondition'),
          method: 'get',
          params: this.$http.adornParams({
            current: this.searchForm.pageNumber,
            size: this.searchForm.pageSize,
            status: this.searchForm.status,
            dictId: this.searchForm.dictId,
            title: this.searchForm.title
          })
        }).then(({ data }) => {
          if (data) {
            this.loading = false
            this.data = data.records
            this.total = data.total
            if (this.data.length === 0 && this.searchForm.pageNumber > 1) {
              this.searchForm.pageNumber -= 1
              this.getDataList()
            }
          }
        })
      },
      handleSearch () {
        this.searchForm.pageNumber = 1
        this.searchForm.pageSize = 10
        this.getDataList()
      },
      handleReset () {
        this.$refs.searchForm.resetFields()
        this.searchForm.pageNumber = 1
        this.searchForm.pageSize = 10
        // 重新加载数据
        this.getDataList()
      },
      changeSort (e) {
        this.searchForm.sort = e.key
        this.searchForm.order = e.order
        if (e.order === 'normal') {
          this.searchForm.order = ''
        }
        this.getDataList()
      },
      showSelect (e) {
        this.selectList = e
      },
      refreshDict () {
        this.getAllDict()
        this.selectNode = {}
        this.editTitle = ''
        this.getDataList()
      },
      handleDropdown (name) {
        if (name === 'editDcit') {
          if (!this.selectNode.id) {
            this.$message.warning('您还未选择要编辑的字典')
            return
          }
          this.editDcit()
        } else if (name === 'delDcit') {
          this.delDcit()
        } else if (name === 'refreshDcit') {
          this.refreshDict()
        }
      },
      addDcit () {
        this.modalType = 0
        this.dictModalTitle = '添加字典'
        this.dictForm = {
          title: '',
          type: '',
          description: '',
          sortOrder: 0
        }
        this.dictForm.sortOrder = this.treeData.length + 1
        this.cancelEdit()
        this.dictModalVisible = true
      },
      editDcit () {
        this.modalType = 1
        this.dictModalTitle = '编辑字典'
        this.dictModalVisible = true
      },
      delDcit () {
        if (!this.selectNode.id) {
          this.$message.warning('您还未选择要删除的字典')
          return
        }
        this.$confirm('您确认要删除 ' + this.selectNode.title + ' ?', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/dict/delById'),
            method: 'get',
            params: this.$http.adornParams({id: this.selectNode.id})
          }).then(({ data }) => {
            this.$message.success('删除成功')
            this.refreshDict()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      add () {
        if (!this.selectNode.id) {
          this.$message.warning('请先选择一个字典类别')
          return
        }
        this.modalType = 0
        this.modalTitle = '添加字典 ' + this.editTitle + ' 的数据'
        this.form = {
          title: '',
          value: '',
          status: 0,
          description: '',
          sortOrder: 0
        }
        this.form.sortOrder = this.total + 1
        this.modalVisible = true
      },
      edit (v) {
        this.modalType = 1
        if (this.editTitle) {
          this.modalTitle = '编辑字典 ' + this.editTitle + ' 的数据'
        } else {
          this.modalTitle = '编辑字典数据'
        }
        this.form = {
          title: '',
          value: '',
          status: 0,
          description: '',
          sortOrder: 0
        }
        // 转换null为""
        for (let attr in v) {
          if (v[attr] == null) {
            v[attr] = ''
          }
        }
        let str = JSON.stringify(v)
        let data = JSON.parse(str)
        this.form = data
        this.modalVisible = true
      },
      handelSubmitDict () {
        this.$refs.dictForm.validate((valid) => {
          if (valid) {
            this.submitLoading = true
            if (this.modalType === 0) {
              // 添加 避免编辑后传入id等数据 记得删除
              delete this.dictForm.id
              this.$http({
                url: this.$http.adornUrl('/sys/dict/add'),
                method: 'POST',
                data: this.$http.adornData(this.dictForm)
              }).then(({ data }) => {
                this.submitLoading = false
                this.$message.success('操作成功')
                this.getAllDict()
                this.dictModalVisible = false
              }).finally(() => {
                this.submitLoading = false
              })
            } else if (this.modalType === 1) {
              // 编辑
              this.$http({
                url: this.$http.adornUrl('/sys/dict/edit'),
                method: 'POST',
                data: this.$http.adornData(this.dictForm)
              }).then(({ data }) => {
                this.submitLoading = false
                this.$message.success('操作成功')
                this.getAllDict()
                this.dictModalVisible = false
              }).finally(() => {
                this.submitLoading = false
              })
            }
          }
        })
      },
      handelSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submitLoading = true
            if (this.modalType === 0) {
              // 添加 避免编辑后传入id等数据 记得删除
              delete this.form.id
              this.form.dictId = this.selectNode.id
              this.$http({
                url: this.$http.adornUrl('/sys/dictData/add'),
                method: 'POST',
                data: this.$http.adornData(this.form)
              }).then(({ data }) => {
                this.submitLoading = false
                this.$message.success('新增成功')
                this.getDataList()
                this.modalVisible = false
              }).finally(() => {
                this.submitLoading = false
              })
            } else if (this.modalType === 1) {
              // 编辑
              this.$http({
                url: this.$http.adornUrl('/sys/dictData/edit'),
                method: 'POST',
                data: this.$http.adornData(this.form)
              }).then(({ data }) => {
                this.submitLoading = false
                this.$message.success('编辑成功')
                this.getDataList()
                this.modalVisible = false
              }).finally(() => {
                this.submitLoading = false
              })
            }
          }
        })
      },
      remove (v) {
        this.$confirm('您确认要删除 ' + v.title + ' ?', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/dictData/delById'),
            method: 'get',
            params: this.$http.adornParams({id: v.id})
          }).then(({ data }) => {
            this.$message.success('删除成功')
            this.getDataList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    mounted () {
      // 计算高度
      let height = document.documentElement.clientHeight
      this.maxHeight = Number(height - 287) + 'px'
      this.init()
    }
  }
</script>
<style lang="scss">
.dictManage {
    .operation {
        margin-bottom: 10px;
    }
    .operation button {
        margin-right: 8px;
    }
    .el-alert {
        margin-bottom: 10px;
    }
    .expand {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }
    .el-input__inner {
        height: 32px;
    }
    .el-input-number {
        line-height: 30px;
    }
}
</style>
