<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> --> 
    <div id="operation">
        <div class="title">经纬度查询：</div>
          <el-form ref="queryForm"  :inline="true" label-width="68px">
            <el-form-item label="经度" >
              <el-input
                v-model="jd"
                id="jd"
                placeholder="请输入经度"
                size="small"
                style="width: 240px"
                value=""
              />
            </el-form-item>
            <el-form-item label="纬度">
              <el-input
                v-model="wd"
                id="wd"
                placeholder="请输入纬度"
                size="small"
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item>
              <el-button id="search" type="primary" icon="el-icon-search" size="mini">搜索</el-button>
              <el-button id="reset" icon="el-icon-refresh" size="mini">重置</el-button>
            </el-form-item>
          </el-form>
    </div>
    <div id="container"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "./admin";
import editorDashboard from "./editor";
import { getMapdata } from "@/api/dashboard";
import pointsuc from '@/assets/sbpoint/sbpointsuc.png'
import pointwarn from '@/assets/sbpoint/sbpointwarn.png'
import pointerr from '@/assets/sbpoint/sbpointerr.png'
export default {
  name: "Dashboard",
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: "adminDashboard",
      pointsuc:pointsuc,
      pointwarn:pointwarn,
      pointerr:pointerr,
      jd:'116.397428',
      wd:'39.90923'
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
    var _this = this;
    var map = new AMap.Map("container", {
      zoom: 4.6, //级别
      center: [108.5525, 38.3227], //中心点坐标
      viewMode: "3D" //使用3D视图
    });
    
    getMapdata().then(res => {
      var data = res.data.list;
      console.log(data);
      var markers = [];
      for (let i = 0; i < data.length; i++) {
        if(!data[i].terminalLongitude||!data[i].terminalLatitude){
          continue;
        }
        let img = '';
        if(data[i].onLine==1){
          img = _this.pointsuc;
        }else if(data[i].onLine==2){
          img = _this.pointerr;
        }else{
          img = _this.pointwarn;
        }
        // 创建一个 Icon
        let Icon = new AMap.Icon({
            // 图标尺寸
            size: new AMap.Size(30, 30),
            // 图标的取图地址
            image: img,
            // 图标所用图片大小
            imageSize: new AMap.Size(30, 30),
            // 图标取图偏移量
            imageOffset: new AMap.Pixel(0, 0)
        });
        let marker= {
            icon: Icon,
            position: [parseFloat(data[i].terminalLongitude), parseFloat(data[i].terminalLatitude)],
        }
        markers.push(marker);
      }    
      markers.forEach(function(marker) {
	        new AMap.Marker({
	            map: map,
	            icon: marker.icon,
	            position: [marker.position[0], marker.position[1]],
	            offset: new AMap.Pixel(-15, -15)
	        });
      });
      var newCenter = map.setFitView();
    });


    $('#search').on('click',function(){
      var jd = $('#jd').val();
      var wd = $('#wd').val();
      if(!jd||!wd){
        _this.$message({
          message: '请输入合适的经纬度',
          type: 'error'
        });
      }
      map.setCenter([jd, wd]);
    })
    $('#reset').on('click',function(){
      var newCenter = map.setFitView();
    })

  }
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100%;
  height: calc(100vh - 84px);
}
#operation{
  width: 90%;
  margin: 0 auto;
  padding: 10px 0;
  height: 100px;
  .title{
    font-size: 20px;
    margin-bottom:10px; 
  }
}
#container {
  width: 90%;
  margin: 0 auto;
  height: calc( 100% - 120px);
  border: 2px solid #666;
  border-radius:10px; 
}
</style>