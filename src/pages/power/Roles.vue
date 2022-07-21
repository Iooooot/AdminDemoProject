<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>

            <el-table :data="rolesList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']"
                            v-for="(item1 , i1) in scope.row.permissions" :key="item1.psId">
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.psId)">{{item1.psName}}
                                </el-tag><i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[i2 === item1.children.length-1 ? '' : 'bdbottom','vcenter']"
                                    v-for="(item2 , i2) in item1.children" :key="item2.psId">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.psId)">
                                            {{item2.psName}}</el-tag><i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning"
                                            :class="[i3 === item2.children.length-1 ? '' : 'bdbottom']"
                                            v-for="(item3 , i3) in item2.children" :key="item3.psId" closable
                                            @close="removeRightById(scope.row,item3.psId)">{{item3.psName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">
                            编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeRoleById(scope.row.roleId)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini"
                            @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>


        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
            <el-tree :data="rightsList" :props="treeProps" @node-click="handleNodeClick" show-checkbox node-key="psId"
                default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="角色名" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            rolesList:[],
            setRightDialogVisible: false,
            addDialogVisible:false,
            rightsList:[],
            treeProps:{
                label:'psName',
                children:'children'
            },
            //默认选择权限数组
            defKeys:[105,116],
            roleId:null,
            addForm:{
                roleName:'',
                roleDesc:'',
            },
            addFormRules:{
                roleName:[
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                ],
                roleDesc:[
                    {required: true, message: '请输入角色描述', trigger: 'blur'},
                ],
            },
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        async getRolesList(){
            const {data:res} = await this.$http.get('role/Roles')
            if(res.result != "SUCCESS") this.$message.error('获取角色列表失败！');
            this.rolesList = res.data
        },
        removeRightById(role,rightId){
            this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const {data:res} = await this.$http.delete(`role/Roles/${role.roleId}/rights/${rightId}`)
                if(res.result != "SUCCESS") return this.$message.error("删除权限失败");
                this.$message.success("删除权限成功")
                role.permissions = res.data
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        async showSetRightDialog(role){
            this.roleId = role.roleId
            const {data:res} = await this.$http.get('role/tree')
            if(res.result != "SUCCESS") return this.$message.error("获取权限失败");
            this.rightsList = res.data
            if(role.permissions == null){
                this.defKeys = [];
            }else{
                role.permissions.forEach(item => {
                    this.getLeafKeys(item,this.defKeys)
                })
            }
            this.setRightDialogVisible = true
        },
        getLeafKeys(node,arr){
            if(!node.children){
                return arr.push(node.psId);
            }
            node.children.forEach(item => {
                this.getLeafKeys(item,arr)
            });
        },
        setRightDialogClosed(){
            this.defKeys = []
        },
        async allotRights(){
            const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
            const idStr = keys.join(',')
            const {data:res} = await this.$http.post(`role/Roles/${this.roleId}/rights/`,{rids:idStr})
            if(res.result != "SUCCESS") return this.$message.error("分配权限失败");
            this.$message.success("分配权限成功")
            this.getRolesList()
            this.setRightDialogVisible = false
        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        addRole(){
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                const {data:res} = await this.$http.post('role/Roles',this.addForm)
                if(res.result != "SUCCESS") return this.$message.error("添加角色失败")
                this.$message.success("添加角色成功")
                this.addDialogVisible = false
                this.getRolesList()
            })
        },
        removeRoleById(id){
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const {data:res} = await this.$http.delete(`role/Roles/${id}`)
                if(res.result != "SUCCESS") return this.$message.error("删除角色失败")
                this.$message.success("删除角色成功")
                this.getRolesList()
            })
        }
    }
}
</script>

<style scoped>
    .el-tag{
        margin: 10px;
    }

    .bdtop{
        border-top: 1px solid #eee;
    }

    .bdbottom{
        border-bottom: 1px solid #eee;
    }

    .vcenter{
        display: flex;
        align-items: center;
    }
</style>