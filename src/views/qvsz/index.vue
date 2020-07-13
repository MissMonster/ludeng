<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--区域数据-->
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
          <el-table-column label="区域id" align="center" prop="Id" :show-overflow-tooltip="true" />          
          <el-table-column label="国家" align="center" prop="country" :show-overflow-tooltip="true" />
          <el-table-column label="省" align="center" prop="province" :show-overflow-tooltip="true" />          
          <el-table-column label="市" align="center" prop="city" :show-overflow-tooltip="true"/>
          <el-table-column label="区" align="center" prop="area" :show-overflow-tooltip="true"/>
          <el-table-column label="镇" align="center" prop="town" :show-overflow-tooltip="true"/>
          <el-table-column label="区域名称" align="center" prop="name" :show-overflow-tooltip="true" />
          <el-table-column
            label="操作"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="国家：" prop="name">
              <el-select v-model="value" filterable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="省：" prop="name">
              <el-select v-model="value" filterable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="市：" prop="name">
              <el-select v-model="value" filterable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区：" prop="name">
              <el-select v-model="value" filterable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="镇：" prop="name">
              <el-select v-model="value" filterable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址：" prop="name">
              <el-input v-model="form.terminalName" placeholder="请输入地址" />
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

import { areaSetInfo , areaSetList ,addAreaSet , editAreaSet , delAreaSet} from "@/api/qysz";
export default {
  name: 'cllist',
  data() {
    return {
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
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value:'',
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
    /** 查询区域列表 */
    getList() {
      this.loading = true;
      areaSetList(this.queryParams).then(response => {
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
        this.title = '添加区域';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const sbid = row.Id || this.ids;
      console.log(sbid)
      areaSetInfo(sbid).then(response => {
        console.log(response)
        this.form = response.data
        this.open = true
        this.title = '修改区域信息'
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
        return delAreaSet(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    }
  }
}
</script>
