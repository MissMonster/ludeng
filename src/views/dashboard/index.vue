<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <div id="container"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import { getMapdata } from '@/api/dashboard'
export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    // ...mapGetters([
    //   'roles'
    // ])
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
    getMapdata().then(res => {
        console.log(res)
    })
    
  },
  mounted(){
    var map = new AMap.Map('container', {
        zoom:4.6,//级别 34°32′27.00″  108°55′25.00″
        center: [108.552500, 38.322700],//中心点坐标
        viewMode:'3D'//使用3D视图
    });
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container{
  width: 100%;
  height: calc(100vh - 84px) ;
}
#container{
  width: 100%;
  height: 100%;
}
</style>