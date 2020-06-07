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
import { getMapdata , heartData } from "@/api/dashboard";
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
    var markers = [];
    var infoWindow;
    getMapdata().then(res => {
      var data = res.data.list;
      // console.log(data);
      
      
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
            id:data[i].Id
        }
        markers.push(marker);
      }    
      markers.forEach(function(marker) {
	        let temp = new AMap.Marker({
	            map: map,
	            icon: marker.icon,
	            position: [marker.position[0], marker.position[1]],
              offset: new AMap.Pixel(0, 0),
              id:marker.id
          });
          
          temp.on('click',function(e){
            console.log(e)
              var id = e.target.Ce.id;
              var jd = e.lnglat.lng;
              var wd = e.lnglat.lat;
              map.setCenter([jd, wd]);
              map.setZoom(10);
              setTimeout(getdata,500)
              function getdata(){
                heartData(id).then(response => {
                  var data = response.data;
                  //构建信息窗体中显示的内容
                  var info = [];
                  info.push(
                    `<div style="width:350px;">
                      <div>
                        经度 : ${data.latit}<br/>
                        纬度 : ${data.longit}<br/>
                        温度 : ${data.temperature}<br/>
                        IN1 : ${data.inOne}<br/>
                        IN2 : ${data.inTwo}<br/>
                        IN3 : ${data.inThree}<br/>
                        IN4 : ${data.inFour}<br/>
                        IN5 : ${data.inFive}<br/>
                        IN6 : ${data.inSix}<br/>
                        IN7 : ${data.inSeven}<br/>
                        DOOR : ${data.door}<br/>
                        ACIN : ${data.acIn}<br/>
                        手动使能 : ${data.fourManual}<br/>
                        今天:0x00开灯经纬度;每天:0x01开灯固定 : ${data.fourOpenMode}<br/>
                        今天:0x00关灯经纬度;每天:0x01关灯固定 : ${data.fourCloseMode}<br/>
                        开 时分 : ${data.fourOpenTime}<br/>
                        关 时分 : ${data.fourCloseTime}<br/>
                        继电器是否打开 : ${data.fourOnF}<br/>
                        漏保状态 : ${data.iof}<br/>
                        脱扣状态 : ${data.iLock}<br/>
                      </div>
                    </div>`
                  );
                  infoWindow = new AMap.InfoWindow({
                      content: info.join("<br/>")  //使用默认信息窗体框样式，显示信息内容
                  });
                  infoWindow.open(map, map.getCenter());
                })
              }
          })
      });
      
      var newCenter = map.setFitView();
      
    });

    var ws = new WebSocket("ws://hoyware.com/api/v1/ws");  
    //连接打开时触发 
    ws.onopen = function(evt) {  
        console.log("Connection open ...");  
        ws.send("Hello WebSockets!");
        ws.send("ping");  
    };  
    //接收到消息时触发  
    ws.onmessage = function(evt) { 
        // var markers = []; 
        // console.log(markers);
        // console.log(evt)
        var res;
        if(evt.data!='Hello WebSockets!'&&evt.data!='ping'){
          res = JSON.parse(evt.data);
        }
        console.log(res);
        var id = res.terminalId;
        var gprsRssi = res.gprsRssi;
        var layer = new AMap.LabelsLayer({
            zooms: [3, 20],
            zIndex: 1000,
            // 开启标注避让，默认为开启，v1.4.15 新增属性
            collision: true,
            // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
            animation: true,
        });
        map.add(layer);
        var markers2 = [];
        var curData;
        for(var i=0;i<markers.length;i++){
          (function(i){
            if(markers[i].id==id){
              curData = markers[i];
            }
          })(i)         
        }
        console.log(curData)
        var info2=[];
        if(gprsRssi==0){
          info2.push(
            `<div><img src="../../assets/sign/${gprsRssi}.png"><img src="../../assets/sign/no.png"></div>`
          )
        }else{
          info2.push(
            `<div><img src="../../assets/sign/${gprsRssi}.png"><img src="../../assets/sign/has.png"></div>`
          )
        }
        
        curData.text = {
          content:info2.join("<br/>")
        }
        var labelMarker = new AMap.LabelMarker(curData);
        markers.push(labelMarker);

        layer.add(labelMarker);

        map.setFitView();
          
    };  
    //连接关闭时触发  
    ws.onclose = function(evt) {  
        console.log("Connection closed.");  
    };  





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
      infoWindow.close();
    })
    $('#reset').on('click',function(){
      var newCenter = map.setFitView();
      infoWindow.close();
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