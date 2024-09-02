<template>
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog title="图片剪裁" :visible.sync="cropperDialogVisible" :close-on-press-escape="false">
        <div style="height: 400px;width: auto;text-align: center;">
            <VueCropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.size"
                :outputType="option.outputType"
                :info="true"
                :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight"
                :full="option.full"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :original="option.original"
                :autoCrop="option.autoCrop"
                :fixed="option.fixed"
                :fixedNumber="option.fixedNumber"
                :centerBox="option.centerBox"
                :infoTrue="option.infoTrue"
                :fixedBox="option.fixedBox"
            ></VueCropper>
        </div>
        <div slot="footer">
            <el-button type="primary" @click="finish">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {VueCropper} from 'vue-cropper'
export default {
    name: 'imgCropper',
    components: {VueCropper},
    data () {
        return {
            cropperDialogVisible: false,
            // 裁剪组件的基础配置option
            option: {
                img: '', // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 0.8, // 裁剪生成图片的质量
                outputType: 'png', // 裁剪生成图片的格式
                canScale: false, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: 220, // 默认生成截图框宽度
                autoCropHeight: 148, // 默认生成截图框高度
                canMove: true,
                fixedBox: false, // 固定截图框大小 不允许改变
                fixed: false, // 是否开启截图框宽高固定比例
                fixedNumber: [4, 3], // 截图框的宽高比例
                full: true, // 是否输出原图比例的截图
                canMoveBox: false, // 截图框能否拖动
                original: false, // 上传图片按照原始比例渲染
                centerBox: false, // 截图框是否被限制在图片里面
                infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            },
        }
    },
    methods: {
        init() {
            this.cropperDialogVisible = true;
        },
        finish() {
            this.$refs.cropper.getCropBlob((data) => {
                if (data) {
                    // 上传图片，成功后把图片信息添加进imageList
                    var reader = new FileReader()
                    reader.readAsDataURL(data)
                    reader.onload = () => {
                        var data = JSON.stringify({
                            imgUrl: reader.result
                        })
                        console.log(data);
                        this.cropperDialogVisible = false
                    }
                } else {
                    this.$message.error('图片错误！')
                }
            })
        }
    }
}
</script>

<style scoped>

</style>
