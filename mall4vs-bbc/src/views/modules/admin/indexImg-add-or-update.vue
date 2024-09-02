<template>
  <div class="mod-index-img">
    <el-dialog
      :title="!dataForm.imgId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @close="closeDialogHandle"
      :width="dialogWidth"
    >
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="100px">
        <el-form-item :label="this.$i18n.t('admin.carouselImg')" prop="imgUrl" :label-width="labelWidth">
          <img-upload v-model="dataForm.imgUrl"></img-upload>
          <span v-if="dataForm.imgType === 0">{{$t('admin.recommImgSize')}}1126*326</span>
          <span v-if="dataForm.imgType === 1">{{$t('admin.recommImgSize')}}1920*450</span>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('temp.sequence')" prop="seq" :label-width="labelWidth">
          <el-input size="small"  v-model="dataForm.seq" type="number" oninput="if(value.length>3)value=value.slice(0,3)" onKeypress="return(/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></el-input>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('product.status')" prop="status" :label-width="labelWidth">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="0">{{$t('publics.disable')}}</el-radio>
            <el-radio :label="1">{{$t('publics.normal')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('platform.platform')" prop="imgType" :label-width="labelWidth">
          <el-radio-group v-model="dataForm.imgType">
            <el-radio :label="0">{{$t('platform.mobile')}}</el-radio>
            <el-radio :label="1">{{$t('platform.pc')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('publics.type')" prop="type" :label-width="labelWidth">
          <el-radio-group v-model="dataForm.type">
            <el-radio :label="-1">{{$t('productComm.no')}}</el-radio>
            <el-radio :label="0">{{$t('home.product')}}</el-radio>
            <el-radio :label="1">链接</el-radio>
          </el-radio-group>
          <div v-if="dataForm.type ===0 && dataForm.relation!=null">
            <el-card :body-style="{ padding: '0px' }" class="index-image-prod-card" style="height: 160px;width: 120px">
              <prod-pic
                height="104px"
                width="100%"
                :pic="card.pic"
              ></prod-pic>
               <!-- todo: 商品已下架时展示状态 -->
              <div v-if="false" class="card-prod-status-tips">{{$t('publics.hadLowerShelf')}}</div>
              <div class="card-prod-bottom">
                <span class="card-prod-name">{{card.name}}</span>
                <div
                  class="card-prod-name-button default-btn text-btn"
                  @click="dataForm.relation = null"
                >{{$t('text.delBtn')}}
                </div>
              </div>
            </el-card>
          </div>
          <div v-if="dataForm.relation==null">
            <div @click="addProd" v-if=" dataForm.type == 0" class="default-btn">{{$t('product.select')}}</div>
            <!-- <el-button @click="addShop"
                       v-if=" dataForm.type == 1"
                       size="small">选择店铺</el-button>
            <el-button @click="addActivity"
                       v-if="dataForm.type == 2"
            size="small">选择活动</el-button>-->
          </div>
        </el-form-item>
        <el-form-item v-if="dataForm.type ===1" label="链接" prop="link" :label-width="labelWidth">
          <el-input v-model="dataForm.link" placeholder="请输入跳转链接"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <div class="default-btn" @click="close()">{{$t('crud.filter.cancelBtn')}}</div>
          <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('crud.filter.submitBtn')}}</div>
      </div>
    </el-dialog>
    <!-- 商品选择弹窗-->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      :isSingle="true"
      @refreshSelectProds="selectIndexProd"
    ></prods-select>
  </div>
</template>

<script>
  // import PicUpload from '@/components/pic-upload'
  import ImgUpload from '@/components/img-upload'
  import ProdsSelect from '@/components/prods-select'
  import { setDialogWidth, widthChange } from '@/utils/setDialogWidth'
  import ProdPic from '@/components/prod-pic'

  export default {
    data () {
      return {
        dataForm: {
          status: 1,
          des: '',
          imgUrl: '',
          seq: 0,
          imgType: 0,
          imgId: 0,
          link:'',
          type: -1,
          relation: null
        },
        // 关联数据
        card: {
          id: 0,
          pic: '',
          name: '',
          realData: {
            prod: [],
            shop: [],
            activity: []
          }
        },
        isSubmit: true,
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        dataRule: {
          imgUrl: [
            {required: true, message: this.$i18n.t('admin.carouselImgNoNull'), trigger: 'blur'}
          ],
          seq: [
            {required: true, message: this.$i18n.t('admin.sortNONull'), trigger: 'blur'}
          ]
        },
        prodsSelectVisible: false,
        visible: false,
        dialogWidth: '',
        defWidth: localStorage.getItem('lang') === 'en' ? 500 : 500,
        labelWidth: localStorage.getItem('lang') === 'en' ? '140px' : '80px'
      }
    },
    components: {
      ImgUpload,
      ProdsSelect,
      ProdPic
    },
    created () {
      this.dialogWidth = setDialogWidth(this.defWidth)
    },
    mounted () {
      widthChange(this, this.defWidth)
    },
    methods: {
      // 获取分类数据
      init (id) {
        this.visible = true
        this.dataForm.imgId = id || 0
        this.$nextTick(() => {
          this.prodsSelectVisible = false
          this.$refs['dataForm'].resetFields()
        })
        if (this.dataForm.imgId) {
          // 获取产品数据
          this.$http({
            url: this.$http.adornUrl(`/admin/indexImg/info/${this.dataForm.imgId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.dataForm = data
            if (data.relation) {
              this.card.pic = data.pic
              this.card.name = data.prodName
              this.card.id = data.relation
            }
          })
        } else {
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.dataForm.imgUrl = ''
            this.relation = null
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (!this.dataForm.imgUrl) {
            return
          }
          if (!this.isSubmit) {
            return true
          }
          if (!this.dataForm.relation && this.dataForm.type === 0) {
            this.$message.error(this.$i18n.t('marketing.pleaseSelectAProduct'))
            return
          }
          this.isSubmit = false
          let param = this.dataForm
          this.$http({
            url: this.$http.adornUrl(`/admin/indexImg`),
            method: param.imgId ? 'put' : 'post',
            data: this.$http.adornData(param)
          }).then(({data}) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.isSubmit = true
                this.visible = false
                this.$emit('refreshDataList', this.page)
              }
            })
          }).catch(e => {
            this.isSubmit = true
          })
        })
      },
      // 打开选择商品
      addProd () {
        this.prodsSelectVisible = true
        this.$nextTick(() => {
          this.$refs.prodsSelect.init(this.card.realData.prod)
        })
      },
      // 添加指定商品
      selectIndexProd (prods) {
        this.card.realData.prods = [prods]
        if (prods) {
          let selectProd = prods
          this.dataForm.relation = selectProd.prodId
          this.card.pic = selectProd.pic
          this.card.name = selectProd.prodName
          this.card.id = selectProd.prodId
        } else {
          this.card = {}
          this.relation = null
        }
      },
      addShop () {
        alert(this.$i18n.t('publics.chooseStore'))
      },
      addActivity () {
        alert(this.$i18n.t('publics.selectActivity'))
      },
      // 关闭对话框回调
      closeDialogHandle () {
        this.prodsSelectVisible = false
        this.$refs['dataForm'].resetFields()
        this.dataForm.relation = null
        this.card = {
          id: 0,
          pic: '',
          name: '',
          realData: {
            prod: [],
            shop: [],
            activity: []
          }
        }
      },
      /**
       * 关闭弹窗
       */
      close () {
        this.visible = false
      }
    }
  }
</script>
<style lang="scss" scoped>
.mod-index-img {
  .index-image-prod-card {
    position: relative;
    .card-prod-status-tips {
      position: absolute;
      right: 0;
      bottom: 54px;
      color: #fff;
      font-size: 12px;
      line-height: 16px;
      background-color:rgba(0, 0, 0, .3);
      padding: 3px 6px;
      border-top-left-radius: 4px;
    }
  }
}
</style>
