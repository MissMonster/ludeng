<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--策略数据-->
      <el-col :span="24" :xs="24">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="showidlist"
            >查看</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改</el-button>
          </el-col>
         
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="cllist"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column width="100" label="策略id" align="center" prop="Id" :show-overflow-tooltip="true" />
          <el-table-column label="策略名称" align="center" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="属性" align="center" :formatter="sx" width="180" prop="attribute" :show-overflow-tooltip="true" />          
          <el-table-column label="策略描述" align="center" prop="explains" width="240" />
          <el-table-column
            label="使用策略的设备id"
            align="center"
            width="420"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="showidlist(scope.row)"
              >查看</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >编辑</el-button>
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


    <el-dialog :title="title" :visible.sync="open1" width="600px">
        <el-table
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            border :data="sbdata">
            <el-table-column property="one_on_f" label="设备id"></el-table-column>
            <el-table-column property="one_manual" label="设备名称"></el-table-column>
          </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="showflag" label="策略id" prop="Id">
              <el-input disabled v-model="form.Id" placeholder="请输入策略id" />
            </el-form-item>
          </el-col>
          <el-col el-col :span="12">
              <el-form-item v-if="showflag" label="策略名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入策略名称" />
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="属性修改">
              <el-radio-group v-model="form.attribute">
                <el-radio
                  v-for="dict in registerOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col el-col :span="12">
              <el-form-item label="策略描述" prop="explains">
                <el-input v-model="form.explains" placeholder="请输入策略描述" />
              </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { terminalList, terminalInfo , addterminal , editterminal , delterminal} from "@/api/sblist";
import { strategySetList ,strategySetInfo , addStrategySet , editStrategySet , delStrategySet} from "@/api/clsz";
export default {
  name: 'cllist',
  data() {
    return {
      showflag:false,
      // 属性修改
      registerOptions:[
        {
          dictValue:0,
          dictLabel:'允许'
        },
        {
          dictValue:1,
          dictLabel:'禁止'
        }
      ],
      sbdata:[],
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
      cllist: null,
      // 弹出层标题
      title: '',
      // 是否显示弹出层*******
      open: false,
      open1:false,
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
    }
  },
  created() {
    this.getList()
  },
  methods: {
    reset(){
      this.form  = {
        Id:undefined,
        attribute:undefined,
        explains:undefined,
        name:undefined
      }
    },
    sx(data){
      // console.log(data)
      if(data.attribute == 0){
        return '允许';
      }else if(data.attribute == 1){
        return '禁止'
      }else{
        return '默认属性'
      }
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      strategySetList().then(response => {
        console.log(response);
        // var data = response.data.list;
        this.cllist = response.data.list
        this.total = response.data.count
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.open1 = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.Id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
        this.reset();
        this.open = true;
        this.showflag = false;
        this.title = '添加策略';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const sbid = row.Id || this.ids;
      this.showflag = true;
      strategySetInfo(sbid).then(response => {
        console.log(response)
        this.form = response.data
        this.open = true
        this.title = '修改策略信息'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
            // console.log(this.form.Id)
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.Id !== undefined) {
            editStrategySet(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addStrategySet(this.form).then(response => {
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
        return delStrategySet(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    // 查看该策略下所有设备
    showidlist(row){
        var id = row.Id || this.ids;
        id = [].concat(id) 
        console.log(id)
        this.open1 = true;
        this.title = '该策略下所有设备信息';
        strategySetInfo(id).then(response => {
            console.log(response)
            this.sbdata = response.data.TerminalInfo;
            // this.form = response.data
            // this.open = true
            // this.title = '修改设备信息'
        })
    }
  }
}
</script>
