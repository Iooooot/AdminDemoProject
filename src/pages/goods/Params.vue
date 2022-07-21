<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
            <el-row style="margin-top:15px">
                <el-col>
                    <span>选择商品分类：<el-cascader style="width: 20%;" v-model="selectedCat" :options="catesList"
                            :props="cateProps" :clearable="true" @change="catHandleChange"></el-cascader></span>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="small" :disabled="isDisabled" @click="addDialogVisible = true">添加参数
                    </el-button>
                    <el-table :data="manyTabData" :border="true" stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" :closable="true">{{item}}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row.id)">编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="removeUserById(scope.row.id)">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="small" :disabled="isDisabled" @click="addDialogVisible = true">添加属性
                    </el-button>
                    <el-table :data="onlyTableData" :border="true" stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" :closable="true">{{item}}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>

                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row.id)">编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="removeUserById(scope.row.id)">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <el-dialog :title="titleTest" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addFroms" :rules="rules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleTest" prop="attr_name">
                    <el-input v-model="addFroms.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            catesList:[],
            selectedCat:[],
            cateProps:{
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            activeName:'many',
            manyTabData:[],
            onlyTableData:[],
            addDialogVisible:false,
            addFroms:{
                attr_name:''
            },
            rules:{
                attr_name:[{required: true, message: '请输入参数/属性名称', trigger: 'blur'},]
            },

        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status !== 200) return this.$message.error("获取分类失败");
            this.catesList = res.data
        },
        handleTabClick(){
            this.getParams()
        },
        async catHandleChange(){
            this.getParams()
        },
        async getParams(){
            if(this.selectedCat.length !== 3){
                this.selectedCat = []
                this.manyTabData = []
                this.onlyTableData = []
                return 
            }

            const {data:res} = await this.$http.get(`categories/${this.selectedCat[2]}/attributes`,{params:{sel:this.activeName}})
            
            if(res.meta.status !== 200) return this.$message.error("获取参数列表失败");

            res.data.forEach(item =>{
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [] 
                item.inputVisible = false
                item.inputValue = ''
                })
            if(this.activeName == 'many'){
                this.manyTabData = res.data
            }else{
                this.onlyTableData = res.data
            }
        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        addParams(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid) return
                const {data:res} = await this.$http.post(`categories/${this.selectedCat[2]}/attributes`,{attr_name:this.addFroms.attr_name,attr_sel:this.activeName})
                if(res.meta.status !== 201) return this.$message.error("添加参数失败")
                this.$message.success("添加参数成功")
                this.addDialogVisible = false
                this.getParams()
            })
        },
        async handleInputConfirm(rowData){
            if(rowData.inputValue.trim().length == 0){
                rowData.inputValue = ''
                rowData.inputVisible = false
                return
            }
            rowData.attr_vals.push(rowData.inputValue.trim())
            rowData.inputValue = ''
            rowData.inputVisible = false
            const {data:res} = await this.$http.put(`categories/${this.selectedCat[2]}/attributes/${rowData.attr_id}`,{attr_name:rowData.attr_name,
            attr_sel:rowData.attr_sel,attr_vals:rowData.attr_vals.join(' ')})
            if(res.meta.status !== 200) return this.$message.error("修改参数失败")
            this.$message.success("修改参数成功")
        },
        showInput(rowData){
            rowData.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });

        }
    },
    computed:{
        isDisabled(){
            return this.selectedCat.length !== 3
        },
        titleTest(){
            return this.activeName == 'many' ? '添加参数' : '添加属性'
        }
    }
}
</script>

<style scoped>
    .el-tag{
        margin: 5px;
    }

    .el-input{
        width: 120px !important;
    }
</style>