<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-table
        stripe
          v-loading="loading"
          :data="sblist"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="45" align="center" /> -->
          <el-table-column label="设备id" width="100" align="center" prop="Id" :show-overflow-tooltip="true" />
          <el-table-column label="设备型号"  align="center" prop="terminalModel" :show-overflow-tooltip="true" />
          <el-table-column label="设备序列号" align="center" prop="terminalSn" :show-overflow-tooltip="true" />
          <el-table-column label="设备IP及PORT" align="center" prop="terminalIp" width="240" />
          <el-table-column label="是否在线" width="150" align="center" :show-overflow-tooltip="true" >
            <template slot-scope="scope">
              <span v-if="scope.row.onLine == 1">在线</span> 
              <span v-else>离线</span>
            </template>
          </el-table-column>
          <el-table-column label="是否注册" width="150" align="center" :show-overflow-tooltip="true" >
            <template slot-scope="scope">
              <span v-if="scope.row.registered == 1">是</span> 
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="220"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >注册</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
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



    <!-- 添加或注册参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="550px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="设备型号:" prop="Id">
              <el-input v-model="form.terminalModel" disabled type="text" placeholder="请输入设备型号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备序列号:" prop="Id">
              <el-input v-model="form.terminalSn" disabled type="text" placeholder="请输入设备序列号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备IP及PORT:" prop="Id">
              <el-input v-model="form.terminalIp" disabled type="text" placeholder="请输入设备IP及PORT" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="editflag">
            <el-form-item label="是否在线" prop="onLine">
              <el-input v-if="form.onLine==1" value="在线" disabled placeholder="请输入是否在线" />
              <el-input v-if="form.onLine==2" value="离线" disabled placeholder="请输入是否在线" />
              <el-input v-if="form.onLine==3" value="异常" disabled placeholder="请输入是否在线" />
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="是否注册">
              <el-radio-group v-model="form.registered">
                <el-radio
                  v-for="dict in registerOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { treeselect } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { terminalList, terminalInfo , addterminal , editterminal , delterminal} from "@/api/sblist";
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
          dictLabel:'不注册'
        }
      ],

      // 注册时显示
      editflag:false,
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
        deptId: undefined,
        registered:2
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
    this.getList()
  },
  computed:{
    onlinecom(){
      if(this.from.online==1){
        return '在线'
      }else if(this.from.online==2){
        return '离线'
      }else{
        return '异常'
      }
    }
  },
  methods: {
    xlhfn(val){
      return val.replace(/\s/g,'').replace(/(.{2})/g,"$1 ");      
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      terminalList(this.queryParams).then(response => {
        console.log(response);
        // var data = response.data.list;
        this.sblist = response.data.list;
        for(var i=0;i<this.sblist.length;i++){
          this.sblist[i].mname = this.sblist[i].terminalModel+' '+this.sblist[i].terminalName;
          this.sblist[i].terminalSn = this.xlhfn(this.sblist[i].terminalSn);
          if(this.sblist[i].terminalModel=='RDC4M'){
            this.sblist[i].terminalModel = 'RDC-4M';
          }

        }
        this.total = response.data.count
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
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
      this.editflag = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.Id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
        this.open = true;
        this.title = '添加设备';
    },
    /** 注册按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.editflag = true;
      const sbid = row.Id || this.ids;

      terminalInfo(sbid).then(response => {
        console.log(response)
        this.form = response.data;
        if(this.form.terminalModel=='RDC4M'){
          this.form.terminalModel = 'RDC-4M';
        }
        this.form.mname = this.form.terminalModel+' '+this.form.terminalName;
        this.form.terminalSn = this.xlhfn(this.form.terminalSn);
        this.open = true
        this.title = '注册设备信息'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
            console.log(this.form.Id)
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.Id !== undefined) {
            console.log(this.form)
            editterminal(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('注册成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addterminal(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var id = row.Id || this.ids;
      id = [].concat(id) 
      // console.log(id)
      // return
      this.$confirm('是否确认删除id为"' + id + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delterminal(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    }
  }
}
</script>
