<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-button type="primary" @click="showAddDialog" style="margin-bottom:20px">添加分类</el-button>
            <tree-table :data="categoryList" :columns="columns" :selection-type="false" :expand-type="false"
                :show-index="true" index-text="#" :border="true" :show-row-hover="false">
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color:green;font-size: 18px;"></i>
                    <i class="el-icon-error" v-if="scope.row.cat_deleted" style="color:red;font-size: 18px;"></i>
                </template>
                <template slot="level" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level == '0'">一级</el-tag>
                    <el-tag v-if="scope.row.cat_level == '1'" type="success">二级</el-tag>
                    <el-tag v-if="scope.row.cat_level == '2'" type="warning">三级</el-tag>
                </template>
                <template slot="opt" slot-scope="">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="closeAddCateDialog">
            <el-form :model="catForm" :rules="rules" ref="catFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="catForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader v-model="seletedKeys" :options="categoryParentsList" :props="cascaderProps"
                    :clearable="true" @change="catHandleChange"></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

    </div>

</template>

<script>
export default {
    data(){
        return {
            categoryList:[],
            categoryParentsList:[],
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            total:0,
            columns:[{
                label:'分类名称',
                prop:'cat_name'
            },{
                label:'是否有效',
                type:'template',
                template:'isok'
            },{
                label:'排序',
                type:'template',
                template:'level'
            },{
                label:'操作',
                type:'template',
                template:'opt'
            }],
            addCateDialogVisible:false,
            catForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0
            },
            rules:{
                cat_name:[
                    {required: true, message: '请输入分类名称', trigger: 'blur'},
                ]
            },
            cascaderProps:{
                checkStrictly:true,
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            seletedKeys:[]
        }
    },
    created(){
        this.getCategoryList()
    },
    methods:{
        async getCategoryList(){
            const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status !== 200) this.$message.error('获取商品分类失败！');
            console.log(res)
            this.categoryList = res.data.result
            
            this.total = res.data.total
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getCategoryList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCategoryList()
        },
        showAddDialog(){
            this.getParentsNodes();
            this.addCateDialogVisible = true;
        },
        async getParentsNodes(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status !== 200) this.$message.error('获取父级商品分类失败！');
            this.categoryParentsList = res.data
        },
        catHandleChange(value){
            if(value.length > 0){
                this.catForm.cat_level = value.length;
                this.catForm.cat_pid = value[value.length-1];
            }else{
                this.catForm.cat_level = 0;
                this.catForm.cat_pid = 0;
            }
        },
        addCate(){
            this.$refs.catFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.post('categories',this.catForm)
                if(res.meta.status !== 201) this.$message.error('添加分类失败');
                this.$message.success('添加分类成功');
                this.getCategoryList();
                this.addCateDialogVisible = false;
            })
        },
        closeAddCateDialog(){
            this.$refs.catFormRef.resetFields();
            this.seletedKeys = null;
            this.catForm.cat_name = '';
            this.catForm.cat_pid = 0;
            this.catForm.cat_level = 0;
        }
    }
}
</script>

<style>

    .el-cascader{
        width: 100%;
    }
    .el-cascader-panel{
        height: 300px;
    }
</style>