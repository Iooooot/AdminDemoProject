<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
                        <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="userlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="mgName">

                </el-table-column>
                <el-table-column label="邮箱" prop="mgEmail">

                </el-table-column>
                <el-table-column label="电话" prop="mgMobile">

                </el-table-column>
                <el-table-column label="角色" prop="roleName">

                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.state" @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.mgId)">
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeUserById(scope.row.mgId)"></el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                @click="showSetRoleDialog(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">

            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.mgName" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="mgEmail">
                    <el-input v-model="editForm.mgEmail"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mgMobile">
                    <el-input v-model="editForm.mgMobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="selectedRoleId = null">
            <p>当前用户：{{userInfo.mgName}}</p>
            <p>当前角色：{{userInfo.roleName}}</p>
            <el-select v-model="selectedRoleId" placeholder="请选择">
                <el-option v-for="item in rolesList" :key="item.roleId" :label="item.roleName" :value="item.roleId"
                    :disabled="userInfo.roleName == item.roleName">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        var checkEmail = (rule, value, callback) => {
                    const regEmail=/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
                    if(regEmail.test(value)){
                        return callback();
                    }
                    callback(new Error('请输入合法的邮箱'));
                }
        
        var checkMobile = (rule, value, callback) => {
                    const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
                    if (regMobile.test(value)) {
                        return callback();
                    }
                    callback(new Error('请输入合法的手机号'));
                }
        return {
            queryInfo:{
                query:'',
                pagenum: 1,
                pagesize: 2
            },
            userlist:[],
            total:0,
            addDialogVisible:false,
            editDialogVisible:false,
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:'',
            },
            addFormRules:{
                username:[
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    { min: 3, message: '长度不小于3', trigger: 'blur' }
                ],
                password:[
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    { min: 6, message: '长度不小于6', trigger: 'blur' }
                ],
                email:[
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile:[
                    {required: true, message: '请输入手机', trigger: 'blur'},
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            editForm:{},
            editFormRules:{
                mgEmail:[
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mgMobile:[
                    {required: true, message: '请输入手机', trigger: 'blur'},
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            setRoleDialogVisible: false,
            userInfo:{},
            rolesList:[],
            selectedRoleId:null
        }
    },
    created(){
        this.getUsersList();
    },
    methods:{
        async getUsersList(){
            const {data:res} = await this.$http.get('user/Users',{params:this.queryInfo})
            if(res.result != "SUCCESS") this.$message.error('获取用户列表失败！');
            this.userlist = res.data.lists
            this.total = res.data.total
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getUsersList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getUsersList()
        },
        async userStateChange(userinfo){
            console.log(userinfo)
            const {data:res} = await this.$http.put(`user/Users/${userinfo.mgId}/state/${userinfo.mgState}`)
            if(res.result != "SUCCESS"){
                userinfo.state = !userinfo.state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新用户状态成功！')
        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        addUser(){
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                const {data:res} = await this.$http.post('user/Users',this.addForm)
                if(res.result != "SUCCESS") return this.$message.error("添加用户失败")
                this.$message.success("添加用户成功")
                this.addDialogVisible = false
                this.getUsersList()
            })
        },
        async showEditDialog(id){
            const {data:res} = await this.$http.get(`user/Users/${id}`)
            if(res.result != "SUCCESS") return this.$message.error("查询用户失败");
            this.editForm = res.data
            this.editDialogVisible = true;
        },
        editDialogClose(){
            this.$refs.editFormRef.resetFields();
        },
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid =>{
                if(!valid) return
                console.log(this.editForm)
                const {data:res} = await this.$http.put('user/Users/'+this.editForm.mgId,{email:this.editForm.mgEmail,mobile:this.editForm.mgMobile})
                if(res.result != "SUCCESS") return this.$message.error("修改用户失败")
                this.$message.success("修改用户成功")
                this.editDialogVisible = false
                this.getUsersList()
            })
        },
        removeUserById(id){
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async() => {
                const {data:res} = await this.$http.delete('user/Users/'+id)
                if(res.result != "SUCCESS") return this.$message.error("删除用户失败");
                this.$message.success("删除用户成功")
                this.getUsersList()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        async showSetRoleDialog(userInfo){
            this.userInfo = userInfo
            //获取角色列表
            const {data:res} = await this.$http.get('role/Roles')
            if(res.result != "SUCCESS") return this.$message.error("获取角色失败");
            this.rolesList = res.data
            this.setRoleDialogVisible = true
        },
        async saveRoleInfo(){
            if(!this.selectedRoleId){
                return this.$message.error('请选择要分配的角色！')
            }
            const {data:res} = await this.$http.put(`user/Users/${this.userInfo.mgId}/role`,{rid:this.selectedRoleId})
            if(res.result != "SUCCESS") return this.$message.error("更新角色失败");

            this.$message.success("更新角色成功")
            this.selectedRoleId = null
            this.userInfo = {}
            this.getUsersList()
            this.setRoleDialogVisible = false

        }
    }
}
</script>

<style lang="less" scoped>

</style>