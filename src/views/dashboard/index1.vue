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
import signhas from '@/assets/sign/has.png'
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
      wd:'39.90923',
      signhas:signhas,
      imgUrl:{
        has:require("@/assets/sign/has.png"),
        no:require("@/assets/sign/no.png"),
        sign1:require("@/assets/sign/1.png"),
        sign2:require("@/assets/sign/2.png"),
        sign3:require("@/assets/sign/3.png"),
        sign4:require("@/assets/sign/4.png"),
        sign5:require("@/assets/sign/5.png"),
        sign6:require("@/assets/sign/6.png"),
        sign7:require("@/assets/sign/7.png"),
        sign8:require("@/assets/sign/8.png"),
        sign9:require("@/assets/sign/9.png"),
        sign10:require("@/assets/sign/10.png"),
        sign11:require("@/assets/sign/11.png"),
        sign12:require("@/assets/sign/12.png"),
        sign13:require("@/assets/sign/13.png"),
        sign14:require("@/assets/sign/14.png"),
        sign15:require("@/assets/sign/15.png"),
        sign16:require("@/assets/sign/16.png"),
        sign17:require("@/assets/sign/17.png"),
        sign18:require("@/assets/sign/18.png"),
        sign19:require("@/assets/sign/19.png"),
        sign20:require("@/assets/sign/20.png"),
        sign21:require("@/assets/sign/21.png"),
        sign22:require("@/assets/sign/22.png"),
        sign23:require("@/assets/sign/23.png"),
        sign24:require("@/assets/sign/24.png"),
        sign25:require("@/assets/sign/25.png"),
        sign26:require("@/assets/sign/26.png"),
        sign27:require("@/assets/sign/27.png"),
        sign28:require("@/assets/sign/28.png"),
        sign29:require("@/assets/sign/29.png"),
        sign30:require("@/assets/sign/30.png"),
        sign31:require("@/assets/sign/31.png"),
        sign32:require("@/assets/sign/32.png"),
      }
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
    function tempclick(temp){
      var infoWindow1;
      temp.on('click',function(e){
        console.log(temp)
        console.log(e)
          var id = e.target.Ce.id;
          var jd = e.lnglat.lng;
          var wd = e.lnglat.lat;
          map.setCenter(temp.w.position);
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
              infoWindow1 = new AMap.InfoWindow({
                  content: info.join("<br/>")  //使用默认信息窗体框样式，显示信息内容
              });
              infoWindow1.open(map, temp.w.position);
            })
          }
      })
    }
    getMapdata().then(res => {
      var data = res.data.list;
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
	        let temp=new AMap.Marker({
	            map: map,
	            icon: marker.icon,
	            position: [marker.position[0], marker.position[1]],
              offset: new AMap.Pixel(0, 0),
              id:marker.id
          });
          tempclick(temp);
      })
      var ws = new WebSocket("ws://hoyware.com/api/v1/ws");  
      //连接打开时触发 
      ws.onopen = function(evt) {  
          console.log("Connection open ...");  
          ws.send("Hello WebSockets!");
          ws.send("ping");  
      };  
      //接收到消息时触发  
      ws.onmessage = function(evt) { 
          console.log(evt.data)
          if(evt.data!='Hello WebSockets!'&&evt.data!='ping'){
            var res = JSON.parse(evt.data);
            var id = res.terminalId;
            var gprsRssi = res.gprsRssi;
            console.log(markers)
            console.log(id)
            console.log(gprsRssi)
            var infoWindow = new AMap.InfoWindow({offset: 0});
            markers.forEach(function(marker) {
                if(marker.id==id){            
                  let temp = new AMap.Marker({
                      map: map,
                      icon: marker.icon,
                      position: [marker.position[0], marker.position[1]],
                      offset: new AMap.Pixel(0, 0),
                      id:marker.id
                  });
                  var info = [];
                  if(gprsRssi==0){
                    info.push(
                      '<br/><div><img src="'+_this.imgUrl["sign"+gprsRssi]+'"><img src="'+_this.imgUrl.no+'"></div>'
                    )
                  }else{
                    info.push(
                      '<br/><div><img src="'+_this.imgUrl["sign"+gprsRssi]+'"><img src="'+_this.imgUrl.has+'"></div>'
                    )
                  }
                  infoWindow.setContent(info.join("<br/>"));
                  infoWindow.open(map, marker.position);
                  tempclick(temp)
                }else{
                  let temp1=new AMap.Marker({
                      map: map,
                      icon: marker.icon,
                      position: [marker.position[0], marker.position[1]],
                      offset: new AMap.Pixel(0, 0),
                      id:marker.id
                  });
                  tempclick(temp1)
                }
                
            })
            map.setFitView();
          }
      };  
      //连接关闭时触发  
      ws.onclose = function(evt) {  
          console.log("Connection closed.");  
      }; 


    })




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
      map.setFitView();
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