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
            width="150"
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
                icon="el-icon-delete"
                @click="handleck(scope.row)"
              >查看</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form"  label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备id" prop="terminalId">
              <el-input disabled v-model="form.terminalId"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名" prop="terminalName">
              <el-input disabled v-model="form.terminalName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备地址" prop="terminalAddr">
              <el-input disabled v-model="form.terminalAddr" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
    /** 查询用户列表 */
    getList() {
      var _this = this;
      this.loading = true;
      heartList(this.queryParams).then(response => {
        // console.log(response);
        // var data = response.data.list;
        this.sblist = response.data.list;
        // for(var i=0;i<this.sblist.length;i++){
        //   if(this.sblist[i].onLine==1){
        //     this.sblist[i].onLinetxt="在线";
        //   }else if(this.sblist[i].onLine==2){
        //     this.sblist[i].onLinetxt="离线";
        //   }else{
        //     this.sblist[i].onLinetxt="异常";
        //   }
        // }

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
          // console.log(evt.data)
          if(evt.data!='Hello WebSockets!'&&evt.data!='ping'){
            var aaa = JSON.parse(evt.data);
            // console.log(_this.sblist)
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
      // this.$message({
      //     message: "敬请期待",
      //     type: 'warning'
      //   });
        // return;
      var id = row.id;
      console.log(id)
      heartInfo(id).then(response => {
        console.log(response)
        this.form = response.data
        this.open = true
        this.title = '查看设备信息'
      })
    },
    /** 点击招测操作 */
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
</style>
