<template>
  <div class="login_container">
    <div class="login_box">
        <!-- 登录页面图标 -->
        <div class="avatar_box">
            <img src="@/assets/logo.png" alt="图标">
        </div>
        <el-form ref="loginFormRef" label-width="0" :rules="rules" class="login_form" :model="loginForm">
            <!-- 用户名 -->
            <el-form-item prop="username">
                <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password"> 
                <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            loginForm:{
                username:'',
                password:''
            },
            rules:{
                username:[
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    { min: 3, message: '长度不小于3', trigger: 'blur' }
                ],
                password:[
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ]
            }
        }
    },
    methods:{
        resetLoginForm(){
            this.$refs['loginFormRef'].resetFields();
        },
        login(){
            //获取表单验证的结果
            this.$refs.loginFormRef.validate(async valid =>{
                if(!valid) return;
                const {data:res} = await this.$http.post('user/login',this.loginForm);
                
                if(res.result != "SUCCESS"){
                    this.$message.error('登录失败，请重新登录');
                    return;
                } 
                this.$message.success( '登录成功');
                window.localStorage.setItem("token",res.data.token);
                this.$router.push('/home');
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        position: relative;
        border-radius: 3px;

        .avatar_box{
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            background-color: #fff;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
        .btns{
            display: flex;
            justify-content: end;
        }

        .login_form{
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
        }
    }

    
</style>