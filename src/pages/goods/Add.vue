<template>
    <div>
       <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-alert title="添加商品信息" type="info" center 
              show-icon :closable="false"></el-alert>

              <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex-0" align-center finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab栏 -->
            <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="100px" label-position="top">
             <el-tabs v-model="activeIndex" :tab-position="'left'" 
             :before-leave="beforeLeave" @tab-click="tabClick">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input type="number" v-model="addForm.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item type="number" label="商品重量" prop="goods_weight">
                        <el-input v-model="addForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addForm.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                         <el-cascader
                        v-model="addForm.goods_cat"
                        :options="catelist"
                        expand-trigger="hover"
                        :props="caseProps"
                        @change="handleChange"></el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload :action="uploadURL"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        list-type="picture"
                        :headers="headersObj"
                        :on-success="handleSuccess">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <!-- 富文本编辑框 -->
                     <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                     <!-- 添加商品按钮 -->
                     <el-button type="primary" class="btn" @click="add">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
            </el-form>
        </el-card>
        <el-dialog title="图片预览" :visible.sync="previewdialogVisible"
            width="50%">
            <img :src="previewPath" class="previewimg" alt="">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    data(){
        return{
            activeIndex:'0',
            //添加数据对象
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                //商品所属的分类列表
                goods_cat:[],
                //上传图片的数组
                pics:[],
                //商品详细介绍
                goods_introduce:'',
                //商品动态参数和静态属性
                attrs:[]
            },
            //添加规则
            addFormrules:{
                goods_name:[{ 
                    required: true, message: '请输入商品名称', trigger: 'blur' 
                    }],
                goods_price:[{ 
                    required: true, message: '请输入商品价格', trigger: 'blur' 
                    }],
                goods_weight:[{ 
                    required: true, message: '请输入商品重量', trigger: 'blur' 
                    }],
                goods_numbee:[{ 
                    required: true, message: '请输入商品数量', trigger: 'blur' 
                    }],
                goods_cat:[{ 
                    required: true, message: '请选择商品分类', trigger: 'blur' 
                    }],

            },
            //分类列表
            catelist:[],
            caseProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children'
            },
            //动态参数列表
            manyTableData:[],
            onlyTableData:[],
            //图片上传的请求地址
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
            //上传图片的请求头信息
            headersObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            //图片地址
            previewPath:'',
            previewdialogVisible:false

        }
    },
    created(){
        this.getCateList()
    },
    methods:{
       async getCateList(){
            const{data:res} = await this.$http.get('categories');
            if(res.meta.status!=200) return this.$message.error('获取分类列表失败');
            this.catelist = res.data;
       } ,
       handleChange(){
           //console.log(this.addForm.goods_cat)
           if(this.addForm.goods_cat.length!==3){
               this.addForm.goods_cat = []
           }
       },
       //activeName代表切换到的tanb栏的name属性值
       beforeLeave(activeName,oldactiveName){
           if(oldactiveName=='0'&&this.addForm.goods_cat.length!==3){
               this.$message.error('请选择商品分类');
               return false;
           }
       },
       //tab栏点击时
       async tabClick(){
           //动态参数
           if(this.activeIndex=='1'){
                const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
                {params:{sel:"many"}});
                if(res.meta.status!=200) return this.$message.error('获取参数列表失败');
                res.data.forEach(item=>{
                    item.attr_vals=item.attr_vals.length==0?[]:item.attr_vals.split(' ')
                })
                this.manyTableData = res.data;
               // console.log(this.manyTableData);
               //静态属性
           }else if(this.activeIndex=='2'){
                const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
                {params:{sel:"only"}});
                if(res.meta.status!=200) return this.$message.error('获取商品属性失败');
                // res.data.forEach(item=>{
                //     item.attr_vals=item.attr_vals.length==0?[]:item.attr_vals.split(' ')
                // })
                this.onlyTableData = res.data;
                //console.log(this.onlyTableData)
           }
        
       },
       //处理图片预览效果
       handlePreview(file){
           this.previewPath = file.response.data.url;
           this.previewdialogVisible = true;
       },
       //处理移除图片的操作
       handleRemove(file){
           //1.找到要删除的图片临时路径
           const filepath = file.response.data.tmp_path;
           //找到索引值
           const i = this.addForm.pics.findIndex(item=>
                item.pic==filepath
           )
           //删除该项
           this.addForm.pics.splice(i,1);
       },
       //图片提交触发的事件
       handleSuccess(response){
           //console.log(response);
           const picinfo ={pic:response.data.tmp_path};
           this.addForm.pics.push(picinfo);
           //console.log(this.addForm);
       },
       //添加商品
       add(){
           //console.log(this.addForm)
           this.$refs.addFormRef.validate(async valid=>{
               if(!valid) return this.$message.error('请填写必要的表单项')
                // lodsh cloneDeep(obj) 深拷贝
                const form = _.cloneDeep(this.addForm);
                form.goods_cat = form.goods_cat.join(',');
                //处理动态参数
                this.manyTableData.forEach(item=>{
                   const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(' ')}
                    this.addForm.attrs.push(newInfo);
                })
                //处理静态属性
                this.onlyTableData.forEach(item=>{
                   const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals}
                    this.addForm.attrs.push(newInfo);
                })
                form.attrs = this.addForm.attrs;
                //向服务器端发送请求，添加商品
                 const{data:res} = await this.$http.post('goods',form);
                if(res.meta.status!=201) return this.$message.error('获取参数列表失败');
                this.$router.push('/goods');
           })
       }
    },
    computed:{
            cateId(){
              if(this.addForm.goods_cat.length==3){
                        return this.addForm.goods_cat[2]
                    }else{
                        return null;
                    }
                }
        }
}
</script>

<style lang="less" scoped>
.el-checkbox{
    margin: 0 10px 0 0!important
}
.previewimg{
    width: 100%;
}
.btn{
    margin-top: 15px ;
}
</style>