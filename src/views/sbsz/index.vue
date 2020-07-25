<template>
  <div class="app-container">
    <el-row :gutter="20">
      <div class="searchbox">
        <div class="diqv"></div>
        <div class="celue"></div>
      </div>

      <!--设备数据-->
      <el-col :span="24" :xs="24">
        <el-table v-loading="loading" :data="sblist" stripe border>
          <el-table-column
            label="终端id"
            width="100"
            align="center"
            prop="Id"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="终端名称"
            align="center"
            prop="terminalName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="设备型号"
            align="center"
            prop="terminalModel"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="设备序列号"
            align="center"
            prop="terminalSn"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="设备手机号"
            align="center"
            prop="terminalPhone"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="所在区域"
            align="center"
            prop="areaCity"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="安装地点"
            align="center"
            width="180"
            prop="terminalAddr"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="安装地经度"
            align="center"
            prop="terminalLongitude"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="安装地纬度"
            align="center"
            prop="terminalLatitude"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="是否在线" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-if="scope.row.onLine == 1">在线</span>
              <span v-else>离线</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >设置</el-button>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1250px">
      <el-tabs type="border-card">
        <el-tab-pane label="手动及键盘锁">
          <div style="margin-bottom:15px;">
            手动
            <el-button style="margin-left:20px;" @click="handlezc" type="success">招测</el-button>
            <el-button type="success" @click="fssdzl">发送手动指令</el-button>
            <el-button type="success" @click="hfzdyx">恢复自动运行</el-button>
          </div>

          <el-table v-loading="loading" :data="jpsdata" :key="reflush" stripe border>
            <el-table-column label="回路" align="center" :show-overflow-tooltip="true">L1</el-table-column>
            <el-table-column
              label="工作模式"
              align="center"
              prop="oneManual"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="接触器" align="center" :show-overflow-tooltip="true">IN1</el-table-column>
            <el-table-column label="状态" align="center" prop="inOne" :show-overflow-tooltip="true" />
            <el-table-column label="A相电流" align="center" prop="i1a" :show-overflow-tooltip="true" />
            <el-table-column label="B相电流" align="center" prop="i1b" :show-overflow-tooltip="true" />
            <el-table-column label="C相电流" align="center" prop="i1c" :show-overflow-tooltip="true" />
            <el-table-column
              label="操作"
              align="center"
              width="100"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-switch v-model="of1"></el-switch>
                <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-loading="loading"
            :data="jpsdata"
            stripe
            :key="reflush"
            :show-header="false"
            border
          >
            <el-table-column label="回路" align="center" :show-overflow-tooltip="true">L2</el-table-column>
            <el-table-column
              label="工作模式"
              align="center"
              prop="twoManual"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="接触器" align="center" :show-overflow-tooltip="true">IN2</el-table-column>
            <el-table-column label="状态" align="center" prop="inTwo" :show-overflow-tooltip="true" />
            <el-table-column label="A相电流" align="center" prop="i2a" :show-overflow-tooltip="true" />
            <el-table-column label="B相电流" align="center" prop="i2b" :show-overflow-tooltip="true" />
            <el-table-column label="C相电流" align="center" prop="i2c" :show-overflow-tooltip="true" />
            <el-table-column
              label="操作"
              align="center"
              width="100"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-switch v-model="of2"></el-switch>
                <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-loading="loading"
            :data="jpsdata"
            stripe
            :key="reflush"
            :show-header="false"
            border
          >
            <el-table-column label="回路" align="center" :show-overflow-tooltip="true">L3</el-table-column>
            <el-table-column
              label="工作模式"
              align="center"
              prop="threeManual"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="接触器" align="center" :show-overflow-tooltip="true">IN3</el-table-column>
            <el-table-column
              label="状态"
              align="center"
              prop="inThree"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="A相电流" align="center" prop="i3a" :show-overflow-tooltip="true" />
            <el-table-column label="B相电流" align="center" prop="i3b" :show-overflow-tooltip="true" />
            <el-table-column label="C相电流" align="center" prop="i3c" :show-overflow-tooltip="true" />
            <el-table-column
              label="操作"
              align="center"
              width="100"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-switch v-model="of3"></el-switch>
                <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-loading="loading"
            :data="jpsdata"
            stripe
            :key="reflush"
            :show-header="false"
            border
          >
            <el-table-column label="回路" align="center" :show-overflow-tooltip="true">L4</el-table-column>
            <el-table-column
              label="工作模式"
              align="center"
              prop="fourManual"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="接触器" align="center" :show-overflow-tooltip="true">IN4</el-table-column>
            <el-table-column label="状态" align="center" prop="inFour" :show-overflow-tooltip="true" />
            <el-table-column label="A相电流" align="center" prop="i4a" :show-overflow-tooltip="true" />
            <el-table-column label="B相电流" align="center" prop="i4b" :show-overflow-tooltip="true" />
            <el-table-column label="C相电流" align="center" prop="i4c" :show-overflow-tooltip="true" />
            <el-table-column
              label="操作"
              align="center"
              width="100"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-switch v-model="of4"></el-switch>
                <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div style="margin:15px 0;">键盘锁</div>
          <div>
            <el-switch v-model="value" active-text="已解锁" inactive-text="已锁定"></el-switch>
          </div>
        </el-tab-pane>

        <el-tab-pane label="校准设备时钟">
          <div style="margin-bottom:15px;">校准设备时钟</div>
          <el-table v-loading="loading" :key="reflush" :data="timedata" stripe border>
            <el-table-column align="center" :show-overflow-tooltip="true">日期时间</el-table-column>
            <el-table-column align="center" label="实时时钟">
              <el-table-column
                label="年"
                align="center"
                prop="year"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="月"
                align="center"
                prop="month"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="日"
                align="center"
                prop="day"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="时"
                align="center"
                prop="hour"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="分"
                align="center"
                prop="minute"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="秒"
                align="center"
                prop="second"
                :show-overflow-tooltip="true"
              />
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="100"
              class-name="small-padding fixed-width"
            >
              <span>
                <el-button size="mini" type="text" icon="el-icon-edit" @click>招测</el-button>
              </span>
              <span>
                <el-button size="mini" type="text" icon="el-icon-edit" @click>校时</el-button>
              </span>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="地理位置及策略设置">地理位置及策略设置</el-tab-pane>
        <el-tab-pane label="开关时间及策略设置">开关时间及策略设置</el-tab-pane>
        <el-tab-pane label="电流电压及策略设置">电流电压及策略设置</el-tab-pane>
        <el-tab-pane label="漏电保护及策略设置">漏电保护及策略设置</el-tab-pane>
        <el-tab-pane label="报警勾选及策略">报警勾选及策略</el-tab-pane>
        <el-tab-pane label="基本信息设置">基本信息设置</el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
        <el-button type="primary" @click="cancel">退出设置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  terminalList,
  queryManautoData,
  sendManautoSet,
  sendManautoRecover,
  queryTimeSet
} from "@/api/sbsz";
import {
  terminalInfo,
  addterminal,
  editterminal,
  heartList,
  sendHeartByTerminalId,
  heartInfo,
  sendHeartAll
} from "@/api/sblist";
export default {
  name: "sblist",
  data() {
    return {
      // test
      value: true,
      reflush: true,
      of1: "",
      of2: "",
      of3: "",
      of4: "",
      jpsdata: [],
      timedata: [],
      sbid: "",
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 用户表格数据
      sblist: null,
      // 弹出层标题
      title: "设备设置",
      // 是否显示弹出层*******
      open: false,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        username: undefined,
        phone: undefined,
        status: undefined,
        deptId: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  computed: {},
  methods: {
    xlhfn(val) {
      return val.replace(/\s/g, "").replace(/(.{2})/g, "$1 ");
    },
    adda(data) {
      return "" + parseFloat(data).toFixed(2) + "A";
    },
    // 点击招测
    handlezc(id) {
      // console.log("点击招测")
      // console.log(id);
      var id = this.sbid;
      sendHeartByTerminalId(id).then(response => {
        // console.log(response)
        this.$message({
          message: response.msg,
          type: "success"
        });
      });
    },
    // 发送手动指令
    fssdzl() {
      var onfdata = {
        relay_one_onf: this.of1 ? 1 : 0,
        relay_two_onf: this.of2 ? 1 : 0,
        relay_three_onf: this.of3 ? 1 : 0,
        relay_four_onf: this.of4 ? 1 : 0
      };
      sendManautoSet(this.sbid, onfdata).then(response => {
        // console.log(response);
        this.$message({
          message: response.msg,
          type: "success"
        });
      });
    },
    // 恢复自动运行
    hfzdyx() {
      sendManautoRecover(this.sbid).then(response => {
        // console.log(response);
        this.$message({
          message: response.msg,
          type: "success"
        });
      });
    },
    /** 查询设备列表 */
    getList() {
      this.loading = true;
      terminalList(this.queryParams).then(response => {
        // console.log(response);
        // this.print(response.data.list)
        this.sblist = response.data.list;
        for (var i = 0; i < this.sblist.length; i++) {
          this.sblist[i].terminalSn = this.xlhfn(this.sblist[i].terminalSn);
          if (this.sblist[i].terminalModel == "RDC4M") {
            this.sblist[i].terminalModel = "RDC-4M";
          }
        }
        this.total = response.data.count;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 手动及键盘锁
    sdjjps() {
      var sbid = this.sbid;
      queryManautoData(sbid).then(response => {
        // console.log(response);
        response.data.i1a = this.adda(response.data.i1a);
        response.data.i1b = this.adda(response.data.i1b);
        response.data.i1c = this.adda(response.data.i1c);
        response.data.i2a = this.adda(response.data.i2a);
        response.data.i2b = this.adda(response.data.i2b);
        response.data.i2c = this.adda(response.data.i2c);
        response.data.i3a = this.adda(response.data.i3a);
        response.data.i3b = this.adda(response.data.i3b);
        response.data.i3c = this.adda(response.data.i3c);
        response.data.i4a = this.adda(response.data.i4a);
        response.data.i4b = this.adda(response.data.i4b);
        response.data.i4c = this.adda(response.data.i4c);
        this.of1 = response.data.oneOnF == "开" ? true : false;
        this.of2 = response.data.twoOnF == "开" ? true : false;
        this.of3 = response.data.threeOnF == "开" ? true : false;
        this.of4 = response.data.fourOnF == "开" ? true : false;
        this.jpsdata[0] = response.data;
        this.reflush = !this.reflush;
        // this.print(this.jpsdata);
      });
    },
    // 校准设备时钟
    jzsbsz() {
      var sbid = this.sbid;
      // console.log(sbid);
      queryTimeSet(sbid).then(response => {
        console.log(response);
        this.timedata[0] = response.data;
        this.reflush = !this.reflush;
      });
    },
    /** 设置按钮操作 */
    handleUpdate(row) {
      this.sbid = row.Id;
      // console.log(row)
      this.open = true;
      this.sdjjps();
      this.jzsbsz();
      
    },
    /** 提交按钮 */
    submitForm: function() {}
  }
};
</script>
