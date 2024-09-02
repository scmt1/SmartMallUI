<template>
 <div class="tabs-container">
   <el-tabs v-model="activeName" @tab-click="handleClick">
     <el-tab-pane label="PC端装修" name="pc">
      <pc-component v-if="pcShow"></pc-component>
     </el-tab-pane>
     <el-tab-pane label="移动端装修" name="mobile">
       <mobile-component v-if="mobileShow"></mobile-component>
     </el-tab-pane>
   </el-tabs>
 </div>
</template>
<script>
import mobileComponent from './list.vue';
import pcComponent from '../../decorate/list/index.vue'
export default {
  components: {
    mobileComponent,
    pcComponent
  },
  data() {
    return {
      activeName: 'pc',
      pcShow: true, // pc端是否显示
      mobileShow: false, // 移动端是否显示
    }
  },
  mounted() {
    if(this.$route.params.activeName === 'mobile') {
      this.activeName = this.$route.params.activeName
      this.mobileShow = true
    }
  },
  methods: {
    handleClick() {
      switch (this.activeName) {
        case 'pc':
          this.pcShow = true;
          this.mobileShow = false;
          break;
        case 'mobile':
          this.pcShow = false;
          this.mobileShow = true;
          break;
        default:
          break;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tabs-container {
  margin-top: -10px;
}
</style>