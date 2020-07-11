<template>
  <div class="app-container">
    <div class="obox">
      <el-button @click="zcqb" type="success">招测全部设备</el-button>
    </div>
    <el-row :gutter="20">
      <!--数据-->
      <el-col :span="24" :xs="24">
        <el-table
        stripe
        border
          v-loading="loading"
          :data="sblist"
        >
          <el-table-column label="设备id" align="center" prop="terminalId" :show-overflow-tooltip="true" />
          <el-table-column label="设备名称" align="center" prop="terminalName" :show-overflow-tooltip="true" />
          <el-table-column width="50" label="总亮灯率" align="center" prop="rol" :show-overflow-tooltip="true" />
          <el-table-column label="Ua" align="center" prop="ua" :show-overflow-tooltip="true" />
          <el-table-column label="Ub" align="center" prop="ub" :show-overflow-tooltip="true" />
          <el-table-column label="Uc" align="center" prop="uc" :show-overflow-tooltip="true" />
          <el-table-column width="50" label="L1" align="center" prop="relay_one_onf" :show-overflow-tooltip="true" />
          <el-table-column width="50" label="L2" align="center" prop="relay_two_onf" :show-overflow-tooltip="true" />
          <el-table-column width="50" label="L3" align="center" prop="relay_three_onf" :show-overflow-tooltip="true" />
          <el-table-column width="50" label="L4" align="center" prop="relay_four_onf" :show-overflow-tooltip="true" />
          <el-table-column width="50" label="IN1" align="center" prop="inOne" :show-overflow-tooltip="true" />
          <el-table-column width="50" label="IN2" align="center" prop="inTwo" :show-overflow-tooltip="true" />
          <el-table-column width="50" label="IN3" align="center" prop="inThree" :show-overflow-tooltip="true" />
          <el-table-column width="50" label="IN4" align="center" prop="inFour" :show-overflow-tooltip="true" />
          <el-table-column width="50" label="柜门" align="center" prop="door" :show-overflow-tooltip="true" />
          <el-table-column width="80" label="温度" align="center" prop="temperature" :show-overflow-tooltip="true" />
          <el-table-column width="50" label="终端供电" align="center" prop="acIn" :show-overflow-tooltip="true" />
          <el-table-column width="60" label="在线/离线" align="center" prop="onLine" :show-overflow-tooltip="true" />
          <el-table-column label="所在区域" align="center" prop="areaProvince" :show-overflow-tooltip="true" />
          <el-table-column width="200" label="安装地点" align="center" prop="terminalAddr" :show-overflow-tooltip="true" />
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="160"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handlezc(scope.row)"
              >招测</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleck(scope.row)"
              >详情</el-button>
              <div v-html="scope.row.updated_at"></div>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或查看参数配置对话框 -->
    <el-dialog title="当前设备详情：" :visible.sync="open" width="1300px">
      <!-- <el-button @click="ckzc" style="margin-bottom:10px;" type="success">招测</el-button> -->
      <div class="cktit" style="margin-bottom:10px;">设备基本信息</div>
      <el-table
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        border :data="ckdate" style="margin-bottom:20px;">
        <el-table-column property="terminal_id" label="设备id"></el-table-column>
        <el-table-column property="terminal_name" label="设备名称"></el-table-column>
        <el-table-column property="terminalModel" label="设备型号"></el-table-column>
        <el-table-column property="terminalSn" label="设备序列号"></el-table-column>
        <el-table-column property="terminalPhone" label="设备手机号"></el-table-column>
        <el-table-column property="area_city" label="所在区域"></el-table-column>
        <el-table-column property="terminal_addr" label="安装地点"></el-table-column>
        <el-table-column property="terminalLongitude" label="安装地经度"></el-table-column>
        <el-table-column property="terminalLatitude" label="安装地纬度"></el-table-column>
        <el-table-column property="terminalIp" label="设备IP及PORT"></el-table-column>
      </el-table>

      <div style="overflow:hidden;">       
        <div style="width:585px;float:left;margin-right:20px;height:100%;">
            <div class="cktit" style="margin-bottom:10px;">地理位置</div>
            <el-table 
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              border :data="ckdate" style="margin-bottom:20px;">
              <el-table-column width="105" property="gmt_qv" label="时区"></el-table-column>
              <el-table-column property="longit_sign" label="东经/西经"></el-table-column>
              <el-table-column property="longit_val" label="经度"></el-table-column>
              <el-table-column property="latit_sign" label="北纬/南纬"></el-table-column>
              <el-table-column property="latit_val" label="纬度"></el-table-column>
              <el-table-column width="75" property="sun_rise" label="日升时间"></el-table-column>
              <el-table-column width="75" property="sun_set" label="日落时间"></el-table-column>
            </el-table>
        </div>
        <div style="width:390px;float:left;height:100%;margin-right:20px;">
          <div class="cktit" style="margin-bottom:10px;">设备时间</div>
          <el-table
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              border :data="ckdate" style="margin-bottom:20px;">
            <el-table-column width="50" property="terminal_time1" label="年"></el-table-column>
            <el-table-column width="50" property="terminal_time2" label="月"></el-table-column>
            <el-table-column width="50" property="terminal_time3" label="日"></el-table-column>
            <el-table-column property="terminal_time4" label="星期"></el-table-column>
            <el-table-column width="50" property="terminal_time5" label="时"></el-table-column>
            <el-table-column width="50" property="terminal_time6" label="分"></el-table-column>
            <el-table-column width="50" property="terminal_time7" label="秒"></el-table-column>
          </el-table>
        </div>
        <div style="width:245px;float:left;height:100%;">
          <div class="cktit" style="margin-bottom:10px;">电压参数</div>
          <el-table
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            border :data="ckdate" style="margin-bottom:20px;">
            <el-table-column property="ua" label="Ua"></el-table-column>
            <el-table-column property="ub" label="Ub"></el-table-column>
            <el-table-column property="uc" label="Uc"></el-table-column>
          </el-table>
        </div>
      </div>

      
      <div style="overflow:hidden;">
        <div style="width:660px;float:left;margin-right:20px;height:100%;">
          <div class="cktit" style="margin-bottom:10px;">开关灯模式及时间</div>
          <el-table
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            border :data="ckdate">
            <el-table-column property="one_on_f" label="L1"></el-table-column>
            <el-table-column property="one_manual" label="工作模式"></el-table-column>
            <el-table-column property="one_open_mode" label="开灯模式"></el-table-column>
            <el-table-column property="one_open_hour" label="开时"></el-table-column>
            <el-table-column property="one_open_minute" label="开分"></el-table-column>
            <el-table-column property="one_close_mode" label="关灯模式"></el-table-column>
            <el-table-column property="one_close_hour" label="关时"></el-table-column>
            <el-table-column property="one_close_minute" label="关分"></el-table-column>
          </el-table>
          <el-table
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}" border :data="ckdate">
            <el-table-column property="two_on_f" label="L2"></el-table-column>
            <el-table-column property="two_manual" label="工作模式"></el-table-column>
            <el-table-column property="two_open_mode" label="开灯模式"></el-table-column>
            <el-table-column property="two_open_hour" label="开时"></el-table-column>
            <el-table-column property="two_open_minute" label="开分"></el-table-column>
            <el-table-column property="two_close_mode" label="关灯模式"></el-table-column>
            <el-table-column property="two_close_hour" label="关时"></el-table-column>
            <el-table-column property="two_close_minute" label="关分"></el-table-column>
          </el-table>
          <el-table 
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            border :data="ckdate">
            <el-table-column property="three_on_f" label="L3"></el-table-column>
            <el-table-column property="three_manual" label="工作模式"></el-table-column>
            <el-table-column property="three_open_mode" label="开灯模式"></el-table-column>
            <el-table-column property="three_open_hour" label="开时"></el-table-column>
            <el-table-column property="three_open_minute" label="开分"></el-table-column>
            <el-table-column property="three_close_mode" label="关灯模式"></el-table-column>
            <el-table-column property="three_close_hour" label="关时"></el-table-column>
            <el-table-column property="three_close_minute" label="关分"></el-table-column>
          </el-table>
          <el-table
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            border :data="ckdate" style="margin-bottom:20px;">
            <el-table-column property="four_on_f" label="L4"></el-table-column>
            <el-table-column property="four_manual" label="工作模式"></el-table-column>
            <el-table-column property="four_open_mode" label="开灯模式"></el-table-column>
            <el-table-column property="four_open_hour" label="开时"></el-table-column>
            <el-table-column property="four_open_minute" label="开分"></el-table-column>
            <el-table-column property="four_close_mode" label="关灯模式"></el-table-column>
            <el-table-column property="four_close_hour" label="关时"></el-table-column>
            <el-table-column property="four_close_minute" label="关分"></el-table-column>
          </el-table>
        </div>
        <div style="width:580px;float:left;height:100%;">
          <div class="cktit" style="margin-bottom:10px;">电参数监测</div>
          <el-table
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            border :data="ckdate">
            <el-table-column property="inOne" label="IN1"></el-table-column>
            <el-table-column property="ia" label="Ia"></el-table-column>
            <el-table-column property="ib" label="Ib"></el-table-column>
            <el-table-column property="ic" label="Ic"></el-table-column>
            <el-table-column property="ct1" label="CT1"></el-table-column>
          </el-table>
          <el-table
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            border :data="ckdate">
            <el-table-column property="inTwo" label="IN2"></el-table-column>
            <el-table-column property="i2a" label="I2a"></el-table-column>
            <el-table-column property="i2b" label="I2b"></el-table-column>
            <el-table-column property="i2c" label="I2c"></el-table-column>
            <el-table-column property="ct2" label="CT2"></el-table-column>
          </el-table>
          <el-table
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            border :data="ckdate">
            <el-table-column property="inThree" label="IN3"></el-table-column>
            <el-table-column property="i3a" label="I3a"></el-table-column>
            <el-table-column property="i3b" label="I3b"></el-table-column>
            <el-table-column property="i3c" label="I3c"></el-table-column>
            <el-table-column property="ct3" label="CT3"></el-table-column>
          </el-table>
         <el-table
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            border :data="ckdate">
            <el-table-column property="inFour" label="IN4"></el-table-column>
            <el-table-column property="i4a" label="I4a"></el-table-column>
            <el-table-column property="i4b" label="I4b"></el-table-column>
            <el-table-column property="i4c" label="I4c"></el-table-column>
            <el-table-column property="ct4" label="CT4"></el-table-column>
          </el-table>
        </div>
      </div>
      


      
      
      <div style="overflow:hidden;">
        <div style="width:750px;float:left;margin-right:20px;height:100%;">
          <div class="cktit" style="margin-bottom:10px;">状态监测</div>
          <el-table
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}" border :data="ckdate" style="margin-bottom:20px;">
            <el-table-column property="on_line" label="在线/离线"></el-table-column>
            <el-table-column property="gprs_rssi" label="信号强度"></el-table-column>
            <el-table-column property="gprs_ber" label="误码率"></el-table-column>
            <el-table-column property="temperature" label="温度"></el-table-column>
            <el-table-column property="lock" label="键盘"></el-table-column>    
            <el-table-column property="ie_card" label="采集卡"></el-table-column>        
            <el-table-column property="door" label="柜门"></el-table-column>
            <el-table-column property="ac_in" label="供电"></el-table-column>
            <el-table-column property="rol" label="总亮灯率"></el-table-column>
          </el-table>
        </div>
        
        <div style="width:490px;float:left;height:100%;">
          <div class="cktit" style="margin-bottom:10px;">漏电保护</div>
          <el-table
          :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}" border :data="ckdate" style="margin-bottom:20px;">
            <el-table-column property="i_lock" label="脱扣功能"></el-table-column>
            <el-table-column property="is" label="跳闸电流"></el-table-column>
            <el-table-column property="iof" label="漏保开关"></el-table-column>
            <el-table-column property="il" label="漏电流"></el-table-column>
          </el-table>
        </div>
      </div>      
    </el-dialog>

  </div>
</template>

<script>
import { treeselect } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getMapdata , heartData } from "@/api/dashboard"
import { terminalList, terminalInfo , addterminal , editterminal , heartList , sendHeartByTerminalId ,heartInfo ,sendHeartAll} from "@/api/sblist"
export default {
  name: 'sblist',
  components: { Treeselect },
  data() {
    return {
      // 是否注册
      registerOptions:[
        {
          dictValue:1,
          dictLabel:'注册'
        },
        {
          dictValue:2,
          dictLabel:'未注册'
        }
      ],
      //是否显示弹窗的id
      hideid:false,
      // 遮罩层
      loading: true,
      // 查看id
      ckid:'',
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      sblist: null,
      // 弹出层标题
      title: '',
      // 是否显示弹出层*******
      open: false,
      // 表单参数
      form: {},
      //查看数据
      ckdate:[],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        username: undefined,
        phone: undefined,
        status: undefined,
        deptId: undefined
      },
      // 表单校验
      rules: {
        terminalName: [
          { required: true, message: '设备名不能为空', trigger: 'blur' }
        ],
        terminalAddr: [
          { required: true, message: '设备地址不能为空', trigger: 'blur' }
        ],
        registered: [
          { required: true, message: '请输入是否注册,1注册,2未注册', trigger: 'blur' }
        ],
        terminalIp: [
          { required: true, message: '设备ip不能为空', trigger: 'blur' }
        ],
        terminalLongitude: [
          { required: true, message: '经度不能为空', trigger: 'blur' }
        ],
        terminalLatitude: [
          { required: true, message: '纬度不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList();

    


  },
  computed:{
  },
  methods: {
    xlhfn(val){
      return val.replace(/\s/g,'').replace(/(.{2})/g,"$1 ");      
    },
    toDouble(i){
      return i=i<10?'0'+i:i;
    },
    /** 查询用户列表 */
    getList() {
      var _this = this;
      this.loading = true;
      heartList(this.queryParams).then(response => {
        // console.log(response);

        this.sblist = response.data.list;
        console.log(this.sblist);
        this.total = response.data.count;
        this.loading = false;

        var ws = new WebSocket("ws://hoyware.com/api/v1/ws");  
        //连接打开时触发 
        ws.onopen = function(evt) {  
            // console.log("Connection open ...");  
            ws.send("Hello WebSockets!");
            ws.send("ping");  
        };  
        //接收到消息时触发  
        ws.onmessage = function(evt) { 
          // var evt={};
          // evt.data={"gprsRssi":20,"gprsBer":99,"alarm":0,"terminalId":28,"onLine":1,"rol":0,"ua":0,"ub":0,"uc":0,"relay_one_onf":1,"relay_two_onf":1,"relay_three_onf":1,"relay_four_onf":1,"temperature":"32","inOne":1,"inTwo":1,"inThree":1,"inFour":1,"inFive":0,"inSix":0,"inSeven":0,"door":1,"acIn":0,"il":0};
            console.log(evt.data)
            if(evt.data!='Hello WebSockets!'&&evt.data!='ping'){
              var aaa = JSON.parse(evt.data);
              console.log(_this.sblist)
              for(var i=0;i<_this.sblist.length;i++){
                if(_this.sblist[i].terminalId==aaa.terminalId){
                  
                  _this.$set(_this.sblist[i],Object.assign(_this.sblist[i], aaa))
                }
              }      
            }
        };
        //连接关闭时触发  
        ws.onclose = function(evt) {  
            // console.log("Connection closed.");  
        };



      });
    },
    // 表单重置
    reset() {
      this.form = {
        Id: undefined,
        terminalName: undefined,
        terminalAddr: undefined,
        registered: undefined,
        terminalIp: undefined,
        terminalLongitude: undefined,
        terminalLatitude: undefined,
      }
    },
    /** 查看按钮操作 */
    handleck(row) {
      this.open = true;
      var id = row.id;
      this.ckdate = [];
      // console.log(id)
      heartInfo(id).then(response => {
        this.ckid = response.data.terminal_id;
        // 招测设备基本信息
        response.data.terminalSn = this.xlhfn(response.data.terminalSn);
        if(response.data.terminalModel=='RDC4M'){
            response.data.terminalModel = 'RDC-4M';
          }
        // 路灯控制参数地理位置
        response.data.sun_rise = this.toDouble(response.data.sun_rise_hour)+':'+this.toDouble(response.data.sun_rise_minute);
        response.data.sun_set = this.toDouble(response.data.sun_set_hour)+':'+this.toDouble(response.data.sun_set_minute);
        if(response.data.gmt_sign){
          response.data.gmt_qv =  'GMT-' + this.toDouble(response.data.gmt_hour) + ":" + this.toDouble(response.data.gmt_minute);
        }else{
          response.data.gmt_qv =  'GMT+' + this.toDouble(response.data.gmt_hour) + ":" + this.toDouble(response.data.gmt_minute);
        }
        if(response.data.longit_sign){
          response.data.longit_sign = '西经'
        }else{
          response.data.longit_sign = '东经'
        }
        if(response.data.latit_sign){
          response.data.latit_sign = '南纬'
        }else{
          response.data.latit_sign = '北纬'
        }

        // 设备时间
        response.data.terminal_time1 = (new Date(response.data.terminal_time).getFullYear()+'').substring(2,4);
        response.data.terminal_time2 = this.toDouble(new Date(response.data.terminal_time).getMonth()+1);
        response.data.terminal_time3 = this.toDouble(new Date(response.data.terminal_time).getDate());
        if(new Date(response.data.terminal_time).getDay()==0){
          response.data.terminal_time4="周日";
        }
        if(new Date(response.data.terminal_time).getDay()==1){
          response.data.terminal_time4="周一";
        }
        if(new Date(response.data.terminal_time).getDay()==2){
          response.data.terminal_time4="周二";
        }
        if(new Date(response.data.terminal_time).getDay()==3){
          response.data.terminal_time4="周三";
        }
        if(new Date(response.data.terminal_time).getDay()==4){
          response.data.terminal_time4="周四";
        }
        if(new Date(response.data.terminal_time).getDay()==5){
          response.data.terminal_time4="周五";
        }
        if(new Date(response.data.terminal_time).getDay()==6){
          response.data.terminal_time4="周六";
        }
        // response.data.terminal_time4 = new Date(response.data.terminal_time).getMonth()+1;
        response.data.terminal_time5 = new Date(response.data.terminal_time).getHours();
        response.data.terminal_time6 = new Date(response.data.terminal_time).getMinutes();
        response.data.terminal_time7 = new Date(response.data.terminal_time).getSeconds();



        // 开关灯模式及时间
        if(response.data.one_on_f){
          response.data.one_on_f = '开'
        }else{
          response.data.one_on_f = '关'
        }
        if(response.data.one_manual){
          response.data.one_manual = '手动'
        }else{
          response.data.one_manual = '自动'
        }
        if(response.data.one_open_mode){
          response.data.one_open_mode = '每天'
        }else{
          response.data.one_open_mode = '今天'
        }
        response.data.one_open_hour = this.toDouble(response.data.one_open_hour);
        response.data.one_open_minute = this.toDouble(response.data.one_open_minute);
        response.data.one_close_hour = this.toDouble(response.data.one_close_hour);
        response.data.one_close_minute = this.toDouble(response.data.one_close_minute);
        if(response.data.one_close_mode){
          response.data.one_close_mode = '每天'
        }else{
          response.data.one_close_mode = '今天'
        }
        
        if(response.data.two_on_f){
          response.data.two_on_f = '开'
        }else{
          response.data.two_on_f = '关'
        }
        if(response.data.two_manual){
          response.data.two_manual = '手动'
        }else{
          response.data.two_manual = '自动'
        }
        response.data.two_open_hour = this.toDouble(response.data.two_open_hour);
        response.data.two_open_minute = this.toDouble(response.data.two_open_minute);
        response.data.two_close_hour = this.toDouble(response.data.two_close_hour);
        response.data.two_close_minute = this.toDouble(response.data.two_close_minute);
        if(response.data.two_open_mode){
          response.data.two_open_mode = '每天'
        }else{
          response.data.two_open_mode = '今天'
        }
        if(response.data.two_close_mode){
          response.data.two_close_mode = '每天'
        }else{
          response.data.two_close_mode = '今天'
        }

        if(response.data.three_on_f){
          response.data.three_on_f = '开'
        }else{
          response.data.three_on_f = '关'
        }
        if(response.data.three_manual){
          response.data.three_manual = '手动'
        }else{
          response.data.three_manual = '自动'
        }
        response.data.three_open_hour = this.toDouble(response.data.three_open_hour);
        response.data.three_open_minute = this.toDouble(response.data.three_open_minute);
        response.data.three_close_hour = this.toDouble(response.data.three_close_hour);
        response.data.three_close_minute = this.toDouble(response.data.three_close_minute);
        if(response.data.three_open_mode){
          response.data.three_open_mode = '每天'
        }else{
          response.data.three_open_mode = '今天'
        }
        if(response.data.three_close_mode){
          response.data.three_close_mode = '每天'
        }else{
          response.data.three_close_mode = '今天'
        }

        if(response.data.four_on_f){
          response.data.four_on_f = '开'
        }else{
          response.data.four_on_f = '关'
        }
        if(response.data.four_manual){
          response.data.four_manual = '手动'
        }else{
          response.data.four_manual = '自动'
        }
        response.data.four_open_hour = this.toDouble(response.data.four_open_hour);
        response.data.four_open_minute = this.toDouble(response.data.four_open_minute);
        response.data.four_close_hour = this.toDouble(response.data.four_close_hour);
        response.data.four_close_minute = this.toDouble(response.data.four_close_minute);
        if(response.data.four_open_mode){
          response.data.four_open_mode = '每天'
        }else{
          response.data.four_open_mode = '今天'
        }
        if(response.data.four_close_mode){
          response.data.four_close_mode = '每天'
        }else{
          response.data.four_close_mode = '今天'
        }


        // 状态监测
        if(response.data.on_line){
          response.data.on_line = '在线'
        }else{
          response.data.on_line = '离线'
        }
        response.data.temperature = response.data.temperature + '℃';
        if(response.data.lock){
          response.data.lock = '锁定'
        }else{
          response.data.lock = '未锁定'
        }
        if(response.data.ac_in){
          response.data.ac_in = '市电'
        }else{
          response.data.ac_in = '电池'
        }

        // 电参数监测
        response.data.ua = response.data.ua + 'V';
        response.data.ub = response.data.ub + 'V';
        response.data.uc = response.data.uc + 'V';

        response.data.ia = parseFloat(response.data.ia*response.data.ct1).toFixed(3) + 'A';
        response.data.ib = parseFloat(response.data.ib*response.data.ct1).toFixed(3) + 'A';
        response.data.ic = parseFloat(response.data.ic*response.data.ct1).toFixed(3) + 'A';

        if(response.data.ie_card){
          response.data.ie_card = '有'
        }else{
          response.data.ie_card = '无'
        }

        response.data.i2a = parseFloat(response.data.i2a*response.data.ct2).toFixed(3) + 'A';
        response.data.i2b = parseFloat(response.data.i2b*response.data.ct2).toFixed(3) + 'A';
        response.data.i2c = parseFloat(response.data.i2c*response.data.ct2).toFixed(3) + 'A';

        response.data.i3a = parseFloat(response.data.i3a*response.data.ct3).toFixed(3) + 'A';
        response.data.i3b = parseFloat(response.data.i3b*response.data.ct3).toFixed(3) + 'A';
        response.data.i3c = parseFloat(response.data.i3c*response.data.ct3).toFixed(3) + 'A';

        response.data.i4a = parseFloat(response.data.i4a*response.data.ct4).toFixed(3) + 'A';
        response.data.i4b = parseFloat(response.data.i4b*response.data.ct4).toFixed(3) + 'A';
        response.data.i4c = parseFloat(response.data.i4c*response.data.ct4).toFixed(3) + 'A';
        // 漏电保护
        if(response.data.i_lock){
          response.data.i_lock = '开启'
        }else{
          response.data.i_lock = '关闭'
        }
        response.data.is = response.data.is + 'mA';
        if(response.data.iof){
          response.data.iof = '接通'
        }else{
          response.data.iof = '断开'
        }
        response.data.il = response.data.il + 'mA';
        this.ckdate.push(response.data);
        this.print(response.data)

      })
    },
    /** 点击招测操作 */
    ckzc(){
      var id = this.ckid;
      sendHeartByTerminalId(id).then(response => {
        // console.log(response)
        this.$message({
          message: response.msg,
          type: 'success'
        });
      })
    },
    handlezc(row) {
      var id = row.terminalId;
      // console.log("点击招测")
      // console.log(id);
      sendHeartByTerminalId(id).then(response => {
        // console.log(response)
        this.$message({
          message: response.msg,
          type: 'success'
        });
      })
    },
    // 招测全部
    zcqb(){
      sendHeartAll().then(response =>{
        this.$message({
          message: response.msg,
          type: 'success'
        });
      })
    }
  }
}
</script>
<style scoped>
.obox{
  margin-bottom: 20px;
}
.el-dialog .el-dialog__body{
  padding-top: 10px !important;
}
</style>
