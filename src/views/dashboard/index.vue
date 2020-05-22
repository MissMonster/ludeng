<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <div id="container"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "./admin";
import editorDashboard from "./editor";
import { getMapdata } from "@/api/dashboard";
export default {
  name: "Dashboard",
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: "adminDashboard"
    };
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
  },
  mounted() {
    var map = new AMap.Map("container", {
      zoom: 4.6, //级别
      center: [108.5525, 38.3227], //中心点坐标
      viewMode: "3D" //使用3D视图
    });
    getMapdata().then(res => {
      // console.log(res);
      var data = res.data.list;
      console.log(data);
      var markers = [];
      for (var i = 0; i < data.length; i++) {
        var marker;
        marker = new AMap.Marker({
          position: [parseFloat(data[i].terminalLongitude), parseFloat(data[i].terminalLatitude)],
          title: data.terminalAddr,
          map: map
        });
        markers.push(marker);
      }
      map.setFitView();

      // 信息窗体的内容
      var content = [
          "电话 : 010-84107000   邮编 : 100102",
          "地址 : 北京市望京阜通东大街方恒国际中心A座16层</div></div>"
      ];

      // 创建 infoWindow 实例	
      var infoWindow = new AMap.InfoWindow({
        content: content.join("<br>")  //传入 dom 对象，或者 html 字符串
      });
        
      // 打开信息窗体
      infoWindow.open(map);



    });
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100%;
  height: calc(100vh - 84px);
}
#container {
  width: 100%;
  height: 100%;
}
</style>