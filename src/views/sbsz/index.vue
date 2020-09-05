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
    <el-dialog :title="title" :visible.sync="open" width="1300px">
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
            <!-- <el-table-column
              label="工作模式"
              align="center"
              prop="oneManual"
              :show-overflow-tooltip="true"
            /> -->
            <el-table-column
                label="工作模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="jps_data.oneManual" placeholder="请选择">
                    <el-option
                      v-for="item in gzop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="输出"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="jps_data.oneOnF" placeholder="请选择">
                    <el-option
                      v-for="item in kgop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            <el-table-column label="接触器" align="center" :show-overflow-tooltip="true">IN1</el-table-column>
            <el-table-column label="状态" align="center" prop="inOne" :show-overflow-tooltip="true" />
            <el-table-column label="A相电流" align="center" prop="i1a" :show-overflow-tooltip="true" />
            <el-table-column label="B相电流" align="center" prop="i1b" :show-overflow-tooltip="true" />
            <el-table-column label="C相电流" align="center" prop="i1c" :show-overflow-tooltip="true" />            
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
            <!-- <el-table-column
              label="工作模式"
              align="center"
              prop="twoManual"
              :show-overflow-tooltip="true"
            /> -->
            <el-table-column
                label="工作模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="jps_data.twoManual" placeholder="请选择">
                    <el-option
                      v-for="item in gzop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="输出"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="jps_data.twoOnF" placeholder="请选择">
                    <el-option
                      v-for="item in kgop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            <el-table-column label="接触器" align="center" :show-overflow-tooltip="true">IN2</el-table-column>
            <el-table-column label="状态" align="center" prop="inTwo" :show-overflow-tooltip="true" />
            <el-table-column label="A相电流" align="center" prop="i2a" :show-overflow-tooltip="true" />
            <el-table-column label="B相电流" align="center" prop="i2b" :show-overflow-tooltip="true" />
            <el-table-column label="C相电流" align="center" prop="i2c" :show-overflow-tooltip="true" />
            <!-- <el-table-column
              label="操作"
              align="center"
              width="100"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-switch v-model="of2"></el-switch>
                <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
              </template>
            </el-table-column> -->
            
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
            <!-- <el-table-column
              label="工作模式"
              align="center"
              prop="threeManual"
              :show-overflow-tooltip="true"
            /> -->
            <el-table-column
                label="工作模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="jps_data.threeManual" placeholder="请选择">
                    <el-option
                      v-for="item in gzop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="输出"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="jps_data.threeOnF" placeholder="请选择">
                    <el-option
                      v-for="item in kgop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
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
            <!-- <el-table-column
              label="操作"
              align="center"
              width="100"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-switch v-model="of3"></el-switch>
                <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
              </template>
            </el-table-column> -->
            
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
            <!-- <el-table-column
              label="工作模式"
              align="center"
              prop="fourManual"
              :show-overflow-tooltip="true"
            /> -->
            <el-table-column
                label="工作模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="jps_data.fourManual" placeholder="请选择">
                    <el-option
                      v-for="item in gzop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="输出"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="jps_data.fourOnF" placeholder="请选择">
                    <el-option
                      v-for="item in kgop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            <el-table-column label="接触器" align="center" :show-overflow-tooltip="true">IN4</el-table-column>
            <el-table-column label="状态" align="center" prop="inFour" :show-overflow-tooltip="true" />
            <el-table-column label="A相电流" align="center" prop="i4a" :show-overflow-tooltip="true" />
            <el-table-column label="B相电流" align="center" prop="i4b" :show-overflow-tooltip="true" />
            <el-table-column label="C相电流" align="center" prop="i4c" :show-overflow-tooltip="true" />
            <!-- <el-table-column
              label="操作"
              align="center"
              width="100"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-switch v-model="of4"></el-switch>
                <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
              </template>
            </el-table-column> -->
            
          </el-table>

          <div style="margin:15px 0;">键盘锁</div>
          <div>
            <el-switch v-model="lockshow" @change="jpsfn" active-text="键盘锁定" inactive-text="键盘解锁"></el-switch>
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
                <el-button size="mini" @click="handlezc" type="text" icon="el-icon-edit" >招测</el-button>
              </span>
              <span>
                <el-button size="mini" @click="jsfn" type="text" icon="el-icon-edit" >校时</el-button>
              </span>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="地理位置及策略设置">
          <div style="margin-bottom:15px;">
            地理位置及策略设置
            <div style="margin-top:15px;">
              已选择的策略:  <el-select @change="dlslch" style="margin-right:15px;" size="mini" v-model="dldata.strategy_id" placeholder="请选择">
                            <el-option
                              v-for="item in options"
                              :key="item.Id"
                              :label="item.name"
                              :value="item.Id"
                              >
                            </el-option>
                          </el-select>
              策略描述: <input disabled style="width:500px;" type="text" v-model="dlclms" name="" id="">
              
            </div>

          </div>
          <el-table v-loading="loading" :key="reflush" :data="dlwzdata" stripe border>
              <el-table-column
                label="时区"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="dldata.gmt_sign" placeholder="请选择">
                    <el-option
                      v-for="item in sqop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <input style="height: 26px;width: 50px;margin-left: 10px;" type="text" v-model="dldata.gmt_hour">
                  :<input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="dldata.gmt_minute">
                </template>
              </el-table-column>
              <el-table-column
                label="经度"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="dldata.longit_sign" placeholder="请选择">
                    <el-option
                      v-for="item in jdop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <input style="height: 26px;width: 100px;margin-left: 20px;" type="text" v-model="dldata.longit">.
                  <input style="height: 26px;width: 100px;" type="text" v-model="dldata.longit_f">
                </template>
              </el-table-column>
              <el-table-column
                label="纬度"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="dldata.latit_sign" placeholder="请选择">
                    <el-option
                      v-for="item in wdop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <input style="height: 26px;width: 100px;margin-left: 20px;" type="text" v-model="dldata.latit">.
                  <input style="height: 26px;width: 100px;" type="text" v-model="dldata.latit_f">
                </template>
              </el-table-column>           
            <el-table-column
              label="操作"
              align="center"
              width="100"
              class-name="small-padding fixed-width"
            >
              <span>
                <el-button size="mini" @click="handlezc" type="text" icon="el-icon-edit" >招测</el-button>
              </span>
              <span>
                <el-button size="mini" @click="dlsz" type="text" icon="el-icon-edit" >设置</el-button>
              </span>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <el-tab-pane label="开关时间及策略设置">
          <div style="margin-bottom:15px;">
            开关时间及策略设置
            <div style="margin-top:15px;">
              已选择的策略:  <el-select @change="kgslch" style="margin-right:15px;" size="mini" v-model="kgsjdata.strategy_id" placeholder="请选择">
                            <el-option
                              v-for="item in options"
                              :key="item.Id"
                              :label="item.name"
                              :value="item.Id">
                            </el-option>
                          </el-select>
              策略描述: <input disabled style="width:500px;" type="text" v-model="kgclms" name="" id="">
              
              <el-button style="margin-left:20px;" @click="hfccsz" type="success">恢复出厂设置</el-button>
              <el-button type="success" @click="handlezc">招测</el-button>
              <el-button type="success" @click="kgsz">设置</el-button>
            </div>
          </div>
          <el-table v-loading="loading" :key="reflush" :data="kgsjarrdata" stripe border>
              <!-- <el-table-column
                label="L1"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.one_on_f" placeholder="请选择">
                    <el-option
                      v-for="item in kgop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="工作模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.one_manual" placeholder="请选择">
                    <el-option
                      v-for="item in gzop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column> -->
              <el-table-column
                align="center"
                label="回路"
                :show-overflow-tooltip="true"
              >L1</el-table-column>
              <el-table-column
                label="开灯模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.one_open_mode" placeholder="请选择">
                    <el-option
                      v-for="item in kdop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="开时"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.one_open_hour">
                </template>
              </el-table-column>
              <el-table-column
                label="开分"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.one_open_minute">
                </template>
              </el-table-column>
              <el-table-column
                label="关灯模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.one_close_mode" placeholder="请选择">
                    <el-option
                      v-for="item in kdop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="关时"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.one_close_hour">
                </template>
              </el-table-column>
              <el-table-column
                label="关分"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.one_close_minute">
                </template>
              </el-table-column>
          </el-table>
          <el-table  :show-header="false" v-loading="loading" :key="reflush" :data="kgsjarrdata" stripe border>
              <!-- <el-table-column
                label="L2"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.two_on_f" placeholder="请选择">
                    <el-option
                      v-for="item in kgop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="工作模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.two_manual" placeholder="请选择">
                    <el-option
                      v-for="item in gzop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column> -->
              <el-table-column
                align="center"
                label="回路"
                :show-overflow-tooltip="true"
              >L2</el-table-column>
              <el-table-column
                label="开灯模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.two_open_mode" placeholder="请选择">
                    <el-option
                      v-for="item in kdop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="开时"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.two_open_hour">
                </template>
              </el-table-column>
              <el-table-column
                label="开分"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.two_open_minute">
                </template>
              </el-table-column>
              <el-table-column
                label="关灯模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.two_close_mode" placeholder="请选择">
                    <el-option
                      v-for="item in kdop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="关时"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.two_close_hour">
                </template>
              </el-table-column>
              <el-table-column
                label="关分"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.two_close_minute">
                </template>
              </el-table-column>
          </el-table>
          <el-table  :show-header="false" v-loading="loading" :key="reflush" :data="kgsjarrdata" stripe border>
              <!-- <el-table-column
                label="L3"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.three_on_f" placeholder="请选择">
                    <el-option
                      v-for="item in kgop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="工作模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.three_manual" placeholder="请选择">
                    <el-option
                      v-for="item in gzop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column> -->
              <el-table-column
                align="center"
                label="回路"
                :show-overflow-tooltip="true"
              >L3</el-table-column>
              <el-table-column
                label="开灯模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.three_open_mode" placeholder="请选择">
                    <el-option
                      v-for="item in kdop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="开时"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.three_open_hour">
                </template>
              </el-table-column>
              <el-table-column
                label="开分"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.three_open_minute">
                </template>
              </el-table-column>
              <el-table-column
                label="关灯模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.three_close_mode" placeholder="请选择">
                    <el-option
                      v-for="item in kdop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="关时"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.three_close_hour">
                </template>
              </el-table-column>
              <el-table-column
                label="关分"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.three_close_minute">
                </template>
              </el-table-column>
          </el-table>
          <el-table  :show-header="false" v-loading="loading" :key="reflush" :data="kgsjarrdata" stripe border>
              <!-- <el-table-column
                label="L4"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.four_on_f" placeholder="请选择">
                    <el-option
                      v-for="item in kgop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="工作模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.four_manual" placeholder="请选择">
                    <el-option
                      v-for="item in gzop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column> -->
              <el-table-column
                align="center"
                label="回路"
                :show-overflow-tooltip="true"
              >L4</el-table-column>
              <el-table-column
                label="开灯模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.four_open_mode" placeholder="请选择">
                    <el-option
                      v-for="item in kdop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="开时"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.four_open_hour">
                </template>
              </el-table-column>
              <el-table-column
                label="开分"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.four_open_minute">
                </template>
              </el-table-column>
              <el-table-column
                label="关灯模式"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="kgsjdata.four_close_mode" placeholder="请选择">
                    <el-option
                      v-for="item in kdop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="关时"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.four_close_hour">
                </template>
              </el-table-column>
              <el-table-column
                label="关分"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="kgsjdata.four_close_minute">
                </template>
              </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="电流电压及策略设置">
          <div style="margin-bottom:15px;">
            电流采样参数
            <div style="margin-top:15px;">
              已选择的策略:  <el-select @change="dldyslch" style="margin-right:15px;" size="mini" v-model="dldy_data.strategy_id" placeholder="请选择">
                            <el-option
                              v-for="item in options"
                              :key="item.Id"
                              :label="item.name"
                              :value="item.Id"
                              >
                            </el-option>
                          </el-select>
              策略描述: <input disabled style="width:500px;" type="text" v-model="dldyclms" name="" id="">  
              <el-button type="success" style="margin-left:15px;" @click="dldyszfn">设置</el-button>
            </div>
          </div>
          <el-table style="margin-top:15px;" v-loading="loading" :key="reflush" :data="dldydata" stripe border>
              <el-table-column
                align="center"
                label="回路"
                :show-overflow-tooltip="true"
              >L1</el-table-column>
              <!-- <el-table-column
                align="center"
                label="互感器"
                :show-overflow-tooltip="true"
              >CT1</el-table-column> -->
              <el-table-column
                label="互感器变比"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  CT1:<input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.scale_1">
                </template>
              </el-table-column>
              <el-table-column
                label="A相额定电流(A)"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="number" v-model="dldy_data.iaS1">
                </template>
              </el-table-column>
              <el-table-column
                label="B相额定电流(A)"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.ibS1">
                </template>
              </el-table-column>
              <el-table-column
                label="C相额定电流(A)"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.icS1">
                </template>
              </el-table-column>
          </el-table>
          <el-table :show-header="false" v-loading="loading" :key="reflush" :data="ldbharrdata" stripe border>
              <el-table-column
                align="center"
                label="回路"
                :show-overflow-tooltip="true"
              >L2</el-table-column>
              <!-- <el-table-column
                align="center"
                label="互感器"
                :show-overflow-tooltip="true"
              >CT2</el-table-column> -->
              <el-table-column
                label="变比"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  CT2:<input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.scale_2">
                </template>
              </el-table-column>
              <el-table-column
                label="A相标准电流"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.iaS2">
                </template>
              </el-table-column>
              <el-table-column
                label="B相标准电流"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.ibS2">
                </template>
              </el-table-column>
              <el-table-column
                label="C相标准电流"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.icS2">
                </template>
              </el-table-column>
          </el-table>
          <el-table :show-header="false" v-loading="loading" :key="reflush" :data="ldbharrdata" stripe border>
              <el-table-column
                align="center"
                label="回路"
                :show-overflow-tooltip="true"
              >L3</el-table-column>
              <!-- <el-table-column
                align="center"
                label="互感器"
                :show-overflow-tooltip="true"
              >CT3</el-table-column> -->
              <el-table-column
                label="变比"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  CT3:<input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.scale_3">
                </template>
              </el-table-column>
              <el-table-column
                label="A相标准电流"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.iaS3">
                </template>
              </el-table-column>
              <el-table-column
                label="B相标准电流"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.ibS3">
                </template>
              </el-table-column>
              <el-table-column
                label="C相标准电流"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.icS3">
                </template>
              </el-table-column>
          </el-table>
          <el-table :show-header="false" v-loading="loading" :key="reflush" :data="ldbharrdata" stripe border>
              <el-table-column
                align="center"
                label="回路"
                :show-overflow-tooltip="true"
              >L4</el-table-column>
              <!-- <el-table-column
                align="center"
                label="互感器"
                :show-overflow-tooltip="true"
              >CT4</el-table-column> -->
              <el-table-column
                label="变比"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  CT4:<input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.scale_4">
                </template>
              </el-table-column>
              <el-table-column
                label="A相标准电流"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.iaS4">
                </template>
              </el-table-column>
              <el-table-column
                label="B相标准电流"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.ibS4">
                </template>
              </el-table-column>
              <el-table-column
                label="C相标准电流"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.icS4">
                </template>
              </el-table-column>
          </el-table>
          <el-table style="margin-top:15px;" v-loading="loading" :key="reflush" :data="dldydata" stripe border>
              <el-table-column
                align="center"
                label="设备只采用一组互感器"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  CT1采样总电流：<el-select size="mini" style="display:inline-block;width: 100px;" v-model="dldy_data.ct1All" placeholder="请选择">
                    <el-option
                      v-for="item in tfop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="电流偏差门限(%)"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.iErr">
                </template>
              </el-table-column>
              <el-table-column
                label="过流保护功能"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="dldy_data.iErrOff" placeholder="请选择">
                    <el-option
                      v-for="item in tfop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="亮灯率限值(%)"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.rolSet">
                </template>
              </el-table-column>
          </el-table>
          <el-table style="margin-top:15px;" v-loading="loading" :key="reflush" :data="dldydata" stripe border>
              <el-table-column
                align="center"
                label="电压"
                :show-overflow-tooltip="true"
              >额定电压</el-table-column>
              <el-table-column
                align="center"
                label="Ua(V)"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.ua_s">
                </template>
              </el-table-column>
              <el-table-column
                label="Ub(V)"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.ub_s">
                </template>
              </el-table-column>
              <el-table-column
                label="Uc(V)"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.uc_s">
                </template>
              </el-table-column>
              <el-table-column
                label="电压偏差门限(%)"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="dldy_data.uth">
                </template>
              </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="漏电保护及策略设置">
          <div style="margin-bottom;15px;">
            漏电保护及策略设置
            <div style="margin-top:15px;">
                已选择的策略:  <el-select @change="ldslch" style="margin-right:15px;" size="mini" v-model="ldbhdata.strategy_id" placeholder="请选择">
                              <el-option
                              v-for="item in options"
                              :key="item.Id"
                              :label="item.name"
                              :value="item.Id"
                              >
                            </el-option>
                            </el-select>
                策略描述: <input disabled style="width:500px;" v-model="ldclms" type="text" name="" id="">
            </div>  
          </div>

           <el-table style="margin-top:15px;" v-loading="loading" :key="reflush" :data="ldbharrdata" stripe border>
              <el-table-column
                label="漏保功能"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="ldbhdata.i_lock" placeholder="请选择">
                    <el-option
                      v-for="item in kgop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="分闸电流(mA)"
                align="center"
                class-name="small-padding fixed-width"
              >
                  <template slot-scope="scope">
                    <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="ldbhdata.is">
                </template>
              </el-table-column>
              <el-table-column
                label="手柄状态"
                align="center"
                class-name="small-padding fixed-width"
                 prop="iof"
                 :formatter="iofFormatter"
              >
                <!-- <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select size="mini" style="display:inline-block;width: 100px;" v-model="ldbhdata.iof" placeholder="请选择">
                    <el-option
                      v-for="item in jbztop"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template> -->
              </el-table-column>
              <el-table-column
                label="漏电流(mA)"
                align="center"
                class-name="small-padding fixed-width"
                prop="il"
              >
                <!-- <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 50px;margin-left: 5px;" type="text" v-model="ldbhdata.il">
                </template> -->
              </el-table-column>
              <el-table-column
              label="操作"
              align="center"
              width="100"
              class-name="small-padding fixed-width"
            >
              <span>
                <el-button size="mini" type="text" @click="handlezc" icon="el-icon-edit" >招测</el-button>
              </span>
              <span>
                <el-button size="mini" type="text" @click="ldsz" icon="el-icon-edit" >设置</el-button>
              </span>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="报警勾选及策略">         
          <div style="margin-bottom;15px;">
            报警勾选及策略
            <div style="margin-top:15px;">
              已选择的策略:  <el-select @change="bjslch" style="margin-right:15px;" size="mini" v-model="bj_data.strategy_id" placeholder="请选择">
                            <el-option
                              v-for="item in options"
                              :key="item.Id"
                              :label="item.name"
                              :value="item.Id"
                              >
                            </el-option>
                          </el-select>
              策略描述: <input disabled style="width:500px;" type="text" v-model="bjclms" name="" id="">
               <el-button style="margin-left:15px;" @click="bjsz" type="success">设置</el-button>
            </div>
          </div>
          <el-table style="margin-top:15px;" v-loading="loading" :key="reflush" :data="dlwzdata" stripe border>
              <el-table-column label="亮灯率低报警" align="center">
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-checkbox v-model="bj_data.rol_set"></el-checkbox>
                </template>
              </el-table-column>
             <el-table-column label="白天亮灯报警" align="center">
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-checkbox v-model="bj_data.day_light"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="电压异常报警" align="center">
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-checkbox v-model="bj_data.strategy_ua">Ua</el-checkbox>
                  <el-checkbox v-model="bj_data.strategy_ub">Ub</el-checkbox>
                  <el-checkbox v-model="bj_data.strategy_uc">Uc</el-checkbox>
                  <el-checkbox style="display:none;" v-model="value">L4</el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="电流异常报警" align="center">
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-checkbox v-model="bj_data.electricity_one">L1</el-checkbox>
                  <el-checkbox v-model="bj_data.electricity_two">L2</el-checkbox>
                  <el-checkbox v-model="bj_data.electricity_three">L3</el-checkbox>
                  <el-checkbox v-model="bj_data.electricity_four">L4</el-checkbox>
                  <el-checkbox style="display:none;" v-model="value">L4</el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="意外亮灯报警" align="center">
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-checkbox v-model="bj_data.light_up_one">L1</el-checkbox>
                  <el-checkbox v-model="bj_data.light_up_two">L2</el-checkbox>
                  <el-checkbox v-model="bj_data.light_up_three">L3</el-checkbox>
                  <el-checkbox v-model="bj_data.light_up_four">L4</el-checkbox>
                  <el-checkbox style="display:none;" v-model="value">L4</el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="意外灭灯报警" align="center">
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-checkbox v-model="bj_data.light_out_one">L1</el-checkbox>
                  <el-checkbox v-model="bj_data.light_out_two">L2</el-checkbox>
                  <el-checkbox v-model="bj_data.light_out_three">L3</el-checkbox>
                  <el-checkbox v-model="bj_data.light_out_four">L4</el-checkbox>
                  <el-checkbox style="display:none;" v-model="value">L4</el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="柜门打开报警" align="center">
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-checkbox v-model="bj_data.door_open"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="键盘解锁报警" align="center">
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-checkbox v-model="bj_data.unlock"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="温度过高报警" align="center">
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-checkbox v-model="bj_data.temprate"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="电池供电报警" align="center">
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-checkbox v-model="bj_data.battery"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="设备离线报警" align="center">
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-checkbox v-model="bj_data.offline"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="漏电报警报警" align="center">
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-checkbox v-model="bj_data.leakage"></el-checkbox>
                </template>
              </el-table-column>
          </el-table>
          

        </el-tab-pane>
        <el-tab-pane label="基本信息设置">
          基本信息设置
          <el-button type="success" style="margin-left:15px;" @click="jbxxsz">设置</el-button>
          
          <el-table style="margin-top:15px;" v-loading="loading" :key="reflush" :data="jbxxdata" stripe border>
              <el-table-column
                align="center"
                label="省"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select @focus="getsheng" @change="c(2)" v-model="jbxx_data.province" filterable placeholder="请选择">
                      <el-option
                        v-for="item in optionsheng"
                        :key="item.province"
                        :label="item.name"
                        :value="item.province">
                      </el-option>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="市"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select @focus="getshi" @change="c(3)" v-model="jbxx_data.city" filterable placeholder="请选择">
                      <el-option
                        v-for="item in optionshi"
                        :key="item.city"
                        :label="item.name"
                        :value="item.city">
                      </el-option>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="区"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select @focus="getqv" @change="c(4)" v-model="jbxx_data.area" filterable placeholder="请选择">
                      <el-option
                        v-for="item in optionqv"
                        :key="item.area"
                        :label="item.name"
                        :value="item.area">
                      </el-option>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="镇"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <el-select @focus="getzhen" v-model="jbxx_data.town" filterable placeholder="请选择">
                      <el-option
                        v-for="item in optionzhen"
                        :key="item.town"
                        :label="item.name"
                        :value="item.town">
                      </el-option>
                    </el-select>
                </template>
              </el-table-column>             
          </el-table>





          <el-table style="margin-top:15px;" v-loading="loading" :key="reflush" :data="jbxxdata" stripe border>
              <el-table-column
                align="center"
                label="设备id"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input disabled style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="jbxx_data.Id">
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="设备型号"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input disabled style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="jbxx_data.terminalModel">
                </template>
              </el-table-column>
              <el-table-column
                label="设备序列号"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input disabled style="height: 26px;width: 150px;margin-left: 5px;" type="text" v-model="jbxx_data.terminalSn">
                </template>
              </el-table-column>
              <el-table-column
                label="设备IP及PORT"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input disabled style="height: 26px;width: 150px;margin-left: 5px;" type="text" v-model="jbxx_data.terminalIp">
                </template>
              </el-table-column>
              <el-table-column
                label="设备名称"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 150px;margin-left: 5px;" type="text" v-model="jbxx_data.terminalName">
                </template>
              </el-table-column>
              <!-- <el-table-column
                label="区域设置"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="jbxx_data.Id">
                </template>
              </el-table-column> -->
              
          </el-table>
          <el-table style="margin-top:20px;" v-loading="loading" :key="reflush" :data="jbxxdata" stripe border>
            <el-table-column
                label="安装地点"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 200px;margin-left: 5px;" type="text" v-model="jbxx_data.terminalAddr">
                </template>
              </el-table-column>
              <el-table-column
                label="安装地经度"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 200px;margin-left: 5px;" type="text" v-model="jbxx_data.terminalLongitude">
                </template>
              </el-table-column>
              <el-table-column
                label="安装地纬度"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 200px;margin-left: 5px;" type="text" v-model="jbxx_data.terminalLatitude">
                </template>
              </el-table-column>
              <el-table-column
                label="设备手机号"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 100px;margin-left: 5px;" type="text" v-model="jbxx_data.terminalPhone">
                </template>
              </el-table-column>
              <el-table-column
                label="IMSI码"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button style="display:none;" @click="a(scope.row)">设置</el-button>
                  <input style="height: 26px;width: 150px;margin-left: 5px;" type="text" v-model="jbxx_data.terminalImsi">
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
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
  queryTimeSet,
  queryGmtSet,
  queryRelaySet,
  queryLeakageInfo,
  sendLock,
  sendTimeSet,
  sendGmtSet,
  sendInitSet,
  sendRelaySet,
  sendLeakageInfo,
  queryAlarmSetInfo,
  editAlarmSet,
  queryElectricitySetInfo,
  editElectricitySet

} from "@/api/sbsz";
import { areaSetInfo , areaSetList ,addAreaSet , editAreaSet , delAreaSet ,
queryCountry , queryProvince , queryCity , queryCounty , queryTown
} from "@/api/qysz";
import {
  terminalInfo,
  addterminal,
  editterminal,
  heartList,
  sendHeartByTerminalId,
  heartInfo,
  sendHeartAll
} from "@/api/sblist";
import { strategySetList ,strategySetInfo , addStrategySet , editStrategySet , delStrategySet} from "@/api/clsz";
export default {
  name: "sblist",
  data() {
    return {
      // test
      value: true,
      reflush: true,
      jpsdata: [],
      timedata: [],
      dlwzdata: [],
      
      bjdata:[],
      bj_data:{},
      kgsjarrdata:[],
      ldbharrdata:[],
      jbxxdata:[],
      sbid: "",

      // 区域
      optionguo:[],
      optionsheng:[],
      optionshi:[],
      optionqv:[],
      dldydata:[],
      optionzhen:[],
      form: {
        country:'CHN',
        province:undefined,
        city:undefined,
        area:undefined,
        town:undefined
      },
      // switch
      lockshow:'',
      //策略描述
      dlclms:'',
      kgclms:'',
      ldclms:'',
      bjclms:'',
      dldyclms:'',
      // select
      tfop:[{
          value: false,
          label: '关'
      },{
          value: true,
          label: '开'
      }],
      kgop: [{
          value: 0,
          label: '关'
      },{
          value: 1,
          label: '开'
      }],
      jbztop: [{
          value: 0,
          label: '合闸'
      },{
          value: 1,
          label: '分闸'
      }],
      kdop: [{
          value: 0,
          label: '今天'
      },{
          value: 1,
          label: '每天'
      }],
      gzop: [{
          value: 0,
          label: '自动'
      },{
          value: 1,
          label: '手动'
      }],
      sqop: [{
          value: 0,
          label: '+'
      },{
          value: 1,
          label: '-'
      }],
      wdop: [{
          value: 0,
          label: '北纬'
      },{
          value: 1,
          label: '南纬'
      }], 
      jdop: [{
          value: 0,
          label: '东经'
      },{
          value: 1,
          label: '西经'
      }], 
      options:[],

      dldata:{},
      kgsjdata:{},
      ldbhdata:{},
      jps_data:{},
      dldy_data:{},
      jbxx_data:{},
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
    this.getcl();
  },
  computed: {},
  methods: {
    xlhfn(val) {
      return val.replace(/\s/g, "").replace(/(.{2})/g, "$1 ");
    },
    adda(data) {
      return "" + parseFloat(data).toFixed(2) + "A";
    },
    iofFormatter(row, column){
      let iof = row.iof;
        if(iof === 0){
          return '合闸'
        } else {
          return '分闸'
        }
    },
    //策略描述
    dlslch(data){
      // console.log(data)
      this.dlclms = '';
      for(var i=0;i<this.options.length;i++){
        if(this.options[i].Id==data){
          this.dlclms = this.options[i].explains;
        }
      }      
    },
    kgslch(data){
      // console.log(data)
      this.kgclms = '';
      for(var i=0;i<this.options.length;i++){
        if(this.options[i].Id==data){
          this.kgclms = this.options[i].explains;
        }
      } 
    },
    ldslch(data){
      // console.log(data)
      this.ldclms = '';
      for(var i=0;i<this.options.length;i++){
        if(this.options[i].Id==data){
          this.ldclms = this.options[i].explains;
        }
      } 
    },
    bjslch(data){
      this.bjclms = '';
      for(var i=0;i<this.options.length;i++){
        if(this.options[i].Id==data){
          this.bjclms = this.options[i].explains;
        }
      } 
    },
    dldyslch(data){
      this.dldyclms = '';
      for(var i=0;i<this.options.length;i++){
        if(this.options[i].Id==data){
          this.dldyclms = this.options[i].explains;
        }
      } 
    },
    //获取策略
    getcl(){
      strategySetList().then(response => {
        // console.log(response);
        this.options = response.data.list;
        // var data = response.data.list;
      });
    },
    // 点击招测
    handlezc(id) {
      var id = this.sbid;
      sendHeartByTerminalId(id).then(response => {
        this.reset();
        this.$message({
          message: response.msg,
          type: "success"
        });
      });
    },
    // 发送手动指令
    fssdzl() {
      sendManautoSet(this.sbid, this.jps_data).then(response => {
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
    //设备锁
    jpsfn(data){
      // console.log(data)
      // this.print(this.jps_data)
      var lock = data?1:0;
      var jpsdata = {
        "lock":lock, //
        "terminal_id":this.sbid
      };
      sendLock(jpsdata).then(response => {
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
        this.title = '设备设置：'+ response.data.terminal_name;
        this.open = true;
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

        this.jpsdata[0] = response.data;
        this.jps_data = response.data;
        this.lockshow = this.jps_data.lock?true:false;
        this.jps_data.oneOnF = this.jps_data.oneOnF=="开"?1:0;
        this.jps_data.twoOnF = this.jps_data.twoOnF=="开"?1:0;
        this.jps_data.threeOnF = this.jps_data.threeOnF=="开"?1:0;
        this.jps_data.fourOnF = this.jps_data.fourOnF=="开"?1:0;

        this.jps_data.oneManual = this.jps_data.oneManual=="自动"?0:1;
        this.jps_data.twoManual = this.jps_data.twoManual=="自动"?0:1;
        this.jps_data.threeManual = this.jps_data.threeManual=="自动"?0:1;
        this.jps_data.fourManual = this.jps_data.fourManual=="自动"?0:1;
        // this.print(this.jps_data)
        this.reflush = !this.reflush;
        // this.print(this.jpsdata);
      });
    },
    // 校准设备时钟
    jzsbsz() {
      var sbid = this.sbid;
      // console.log(sbid);
      queryTimeSet(sbid).then(response => {
        // console.log(response);
        this.timedata[0] = response.data;
        this.reflush = !this.reflush;
      });
    },
    jsfn(){
      sendTimeSet(this.sbid).then(response => {
        // console.log(response);
        this.$message({
          message: response.data,
          type: "success"
        });
      });
    },
    // 获取地址位置
    hqdlwz() {
      var sbid = this.sbid;
      // console.log(sbid);
      queryGmtSet(sbid).then(response => {
        // console.log(response);
        this.print(response);
        this.dlwzdata[0] = response.data;
        this.dldata = response.data;
        this.reflush = !this.reflush;
        this.dlslch(response.data.strategy_id)
      });
    },
    dlsz(){
      // if(!this.dldata.hasOwnProperty('strategy_set_id')){
      //   this.dldata.strategy_set_id = 0;
      // }
      this.dldata.terminal_id = this.sbid;
      for(let key  in this.dldata){
        this.dldata[key] = Number(this.dldata[key]);
        // console.log(key + '---' + obj[key])
      }
      sendGmtSet(this.dldata).then(response => {
        // console.log(response);
        this.$message({
          message: response.data,
          type: "success"
        });
      });
    },
    // 开关时间设置
    kgsjsz() {
      var sbid = this.sbid;
      // console.log(sbid);
      queryRelaySet(sbid).then(response => {
        // console.log(response);
        // this.print(response);
        this.kgsjarrdata[0] = response.data;
        this.kgsjdata = response.data;
        this.reflush = !this.reflush;
        this.kgslch(response.data.strategy_id)
      });
    },
    kgsz(){
      // if(!this.kgsjdata.hasOwnProperty('strategy_set_id')){
      //   this.kgsjdata.strategy_set_id = 0;
      // }
      this.kgsjdata.terminal_id = this.sbid;
      for(let key  in this.kgsjdata){
        this.kgsjdata[key] = Number(this.kgsjdata[key]);
      }
      sendRelaySet(this.kgsjdata).then(response => {
        // console.log(response);
        this.$message({
          message: response.data,
          type: "success"
        });
      });
    },
    hfccsz(){
      // console.log(this.kgsjdata)
      // console.log(this.kgsjdata.strategy_set_id);
      if(!this.kgsjdata.hasOwnProperty('strategy_id')){
        this.kgsjdata.strategy_id = 0;
      }
      // return
      var ccszdata = {
        "strategy_id":this.kgsjdata.strategy_id, // 策略id
        "terminal_id": this.sbid // 设备id
      };
      sendInitSet(ccszdata).then(response => {
        // console.log(response);
        this.$message({
          message: response.data,
          type: "success"
        });
      });
    },
    // 电流电压及策略设置
    dldysz(){
      queryElectricitySetInfo(this.sbid).then(response => {
        
        // console.log(response);
        this.dldy_data = response.data;
        this.dldydata[0] = response.data;
        // this.print(response)
        this.reflush = !this.reflush;
        this.dldyslch(response.data.strategy_id)
      });
    },
    dldyszfn(){
      for(let key  in this.dldy_data){
        if(key!='loop_1'&&key!='loop_2'&&key!='loop_3'&&key!='loop_4'&&key!='ct1All'&&key!='iErrOff'&&key!='ct_1'&&key!='ct_2'&&key!='ct_3'&&key!='ct_4'){
          this.dldy_data[key] = Number(this.dldy_data[key]);
        }
        // console.log(key + '---' + obj[key])
      }
      editElectricitySet(this.dldy_data).then(response => {
        // this.print(response);

        this.$message({
          message: response.data,
          type: "success"
        });
      });
    },
    // 漏电保护设置
    ldbhsz() {
      var sbid = this.sbid;
      // console.log(sbid);
      queryLeakageInfo(sbid).then(response => {
        // console.log(response);
        // this.print(response);
        this.ldbharrdata[0] = response.data;
        this.ldbhdata = response.data;
        this.reflush = !this.reflush;
        this.ldslch(response.data.strategy_id)
      });
    },
    ldsz(){
      // if(!this.ldbhdata.hasOwnProperty('strategy_set_id')){
      //   this.ldbhdata.strategy_set_id = 0;
      // }
      this.ldbhdata.terminal_id = this.sbid;
      for(let key  in this.ldbhdata){
        this.ldbhdata[key] = Number(this.ldbhdata[key]);
      }
      sendLeakageInfo(this.ldbhdata).then(response => {
        // console.log(response);
        this.$message({
          message: response.data,
          type: "success"
        });
      });
    },
    // 告警配置
    gjpz(){
      queryAlarmSetInfo(this.sbid).then(response => {
        // console.log(response);
        this.bj_data = response.data;
        // this.print(this.bj_data)
        this.reflush = !this.reflush;
        this.bjslch(response.data.strategy_id)
        // this.options = response.data.list;
        // var data = response.data.list;
      });
    },
    bjsz(){
      // this.print(this.bj_data)
      editAlarmSet(this.bj_data).then(response => {
        console.log(response);
        this.$message({
          message: response.msg,
          type: "success"
        });
      });
    },
    // 基本信息设置
    jbxx(){
      terminalInfo(this.sbid).then(response => {
        // this.print(response);
        this.jbxx_data = response.data;
        this.jbxx_data.country = 'CHN';
        if(this.jbxx_data.terminalModel=='RDC4M'){
          this.jbxx_data.terminalModel = 'RDC-4M';
        }
        // this.jbxx_data
        this.jbxxdata[0] = response.data;
        this.reflush = !this.reflush;
      });
    },
    jbxxsz(){
      editterminal(this.jbxx_data).then(response => {
        console.log(response);
        this.$message({
          message: response.msg,
          type: "success"
        });
      });
    },
    // 区域
    getsheng(){
      console.log(this.jbxx_data)
      queryProvince(this.jbxx_data).then(response =>{
        console.log(response)
        this.optionsheng = response.data;
      })
    },
    getshi(){
      console.log(this.jbxx_data)
      queryCity(this.jbxx_data).then(response =>{
        console.log(response)
        this.optionshi = response.data;
      })
    },
    getqv(){
      console.log(this.jbxx_data)
      queryCounty(this.jbxx_data).then(response =>{
        console.log(response)
        this.optionqv = response.data;
      })
    },
    getzhen(){
      console.log(this.jbxx_data)
      queryTown(this.jbxx_data).then(response =>{
        console.log(response)
        this.optionzhen = response.data;
      })
    },
    /** 设置按钮操作 */
    handleUpdate(row) {
      this.sbid = row.Id;
      // console.log(row)
      
      this.reset();
    },
    // 刷新弹窗数据
    reset(){
      this.sdjjps();
      this.jzsbsz();
      this.hqdlwz();
      this.kgsjsz();
      this.ldbhsz();   
      this.gjpz();
      this.dldysz();
      this.jbxx();
    }
  }
};
</script>
