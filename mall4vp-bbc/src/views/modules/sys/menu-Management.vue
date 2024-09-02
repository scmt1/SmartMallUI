<template>
  <div>
    <el-tabs class="tabs" v-model="activeName"> 
      <el-tab-pane :label="this.$i18n.t('sys.platformMenu')" name="platformMenu">                  
        <platformMenu v-if="activeName === 'platformMenu'"></platformMenu>
      </el-tab-pane>
      <el-tab-pane :label="this.$i18n.t('sys.shopMenu')" name="shopMenu">                  
        <shopMenu v-if="activeName === 'shopMenu'"></shopMenu>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import shopMenu from './shopMenu.vue'
import platformMenu from './menu.vue'
export default {
  data () {
    return {
      showTab: true,
      activeName: 'platformMenu'
    }
  },
  components: {
    shopMenu,
    platformMenu
  },
  created () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped>
  div{
    /* margin-bottom: 150px; */
  }
</style>
