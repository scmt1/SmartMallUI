<template>
    <el-dialog
            :title="title"
            width="45%"
            @close="onCloseClr()"
            class="el-dialog-box"
            :visible.sync="dialogVisible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" size="small" label-width="80px" class="demo-form-inline">
            <el-form-item label="店铺" prop="shopId">
                <el-select v-model="dataForm.shopId" :disabled="disable" clearable filterable placeholder="请选择店铺" style="width: 200px;">
                    <el-option
                        v-for="item in shopList"
                        :key="item.shopId"
                        :label="item.shopName"
                        :value="item.shopId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <div class="default-btn" @click="prodsSelectHandle()">选择商品</div>
            </el-form-item>
            <el-form-item style="width:100%">
                <el-row>
                    <div></div>
                    <el-col v-for="(prod, index) in dataForm.productList" :key="index">
                        <el-card :body-style="{ padding: '0px' }" style="height: 160px;width: 120px">
                            <prod-pic
                                    height="104px"
                                    width="100%"
                                    :pic="prod.pic"
                            ></prod-pic>
                            <div class="card-prod-bottom prod-line-height">
                                <el-tooltip class="item" effect="dark" :content="prod.prodName" placement="top-start">
                                    <span class="card-prod-name" style="width: 80px;">{{ prod.prodName }}</span>
                                </el-tooltip>
                                <div
                                        class="default-btn text-btn prod-text-left"
                                        @click="deleteProd(index)"
                                >删除
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <!-- 按键 -->
        <span slot="footer" class="dialog-footer">
			<div class="default-btn" @click="dialogVisible = false">取消</div>
			<div class="default-btn primary-btn" @click="submit">确定</div>
		</span>
        <!-- 商品选择弹窗-->
        <prods-select
            v-if="prodsSelectVisible"
            ref="prodsSelect"
            @refreshSelectProds="selectCouponProds"
        ></prods-select>
    </el-dialog>
</template>

<script>
  import ProdsSelect from '@/components/prods-reserve-selection'
  import ProdPic from '@/components/prod-pic'
  export default {
    components:{
      ProdsSelect,
      ProdPic
    },
    name: 'clothingProd-add-or-update',
    data(){
      return {
        title:'',
        disable: false,
        dialogVisible: false,
        prodsSelectVisible: false,
        shopList: [],
        shopId: null,
        dataForm:{
          shopId:null,
          productList:[]
        },
        dataRule: {
          shopId: [
            {required: true, message: "请选择店铺", trigger: 'blur'}
          ]
        },
        isSubmit:false
      }
    },
    methods: {
      init (shopId,type) {
        this.dialogVisible = true
        this.clear()
        this.isSubmit = false
        this.shopId = null
        this.getShopList()
        if (type === 0) {
          this.title = "新增"
          this.disable = false
        } else if (type === 1) {
          this.title = "修改"
          this.disable = true
          this.shopId = shopId
          this.getClothingProd()
        }
      },
      submit(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.dataForm.productList.length > 0){
              if (this.isSubmit) {
                return false
              }
              this.isSubmit = true
              this.$http({
                url: this.$http.adornUrl(`/clothingProdReduction`),
                method: this.shopId ? 'put' : 'post',
                data: this.$http.adornData(this.dataForm)
              }).then(({data}) => {
                this.$message({
                  message: this.$i18n.t('publics.operation'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.dataForm.shopId = null
                    this.dataForm.productList = []
                    this.$emit('refreshDataList')
                    this.dialogVisible = false
                  }
                })
              }).catch((e) => {
                this.isSubmit = false
              })
            }else{
              this.$message({
                message: "请选择商品",
                type: 'error',
                duration: 1500,
              })
            }
          }
        })
      },
      getClothingProd(){
        this.$http({
          url: this.$http.adornUrl('/clothingProdReduction/getInfo'),
          method: 'get',
          params: this.$http.adornParams({
            shopId:this.shopId
          })
        }).then(({data}) => {
          this.dataForm = data
        })
      },
      // 添加指定商品
      selectCouponProds (prods) {
        let b = prods.every(item=>item.shopId === prods[0].shopId)
        if(!b){
          this.$message.warning("勾选商品存在不同店铺商品");
          return
        }
        if (prods) {
          this.dataForm.productList = prods
        }
      },
      // 删除指定商品
      deleteProd (index) {
        this.dataForm.productList.splice(index, 1)
      },
      // 获取所有营业店铺
      getShopList () {
        this.$http({
          url: this.$http.adornUrl('/platform/shopDetail/getAllShop'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.shopList = data
        })
      },
      clear(){
        this.dataForm = {
          shopId:null,
          productList:[]
        }
      },
      // 显示添加指定商品弹框
      prodsSelectHandle () {
        this.prodsSelectVisible = true
        this.$nextTick(() => {
          this.$refs.prodsSelect.init(this.dataForm.productList)
        })
      },
      onCloseClr () {
        this.$emit('refreshLabelList', false)
      }
    }
  }
</script>

<style scoped>
    .el-col {
        width: 130px;
    }
</style>
