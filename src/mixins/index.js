export const mixin={
  methods:{
    getUrl(url){
      return `${this.$store.state.HOST}/${url}`
    },
    //获取中文名
    changeSex(value){
      if(value==0){
        return '女';
      }
      if(value==1){
        return '男';
      }
      if(value==2){
        return '组合';
      }
      if(value==3){
        return '未知';
      }
      return value;
    },
    //上传文件之前的校验
    beforeAvatorUpload(file){
      const  isJPG=(file.type==='image/jpeg')||(file.type==='image/jpg');
      if(!isJPG){
        this.$message.error('上传文件格式只能为jpg或者png格式');
        return false;
      }
      const isLt2M=(file.size/1024/1024)<2;
      if(!isLt2M){
        this.$message.error('文件大小不能超过2M');
        return false;
      }
      return true;

    },
    //文件上传成功之后要做的工作
    handleAvatorSuccess(res){
      let _this=this;
      if(res.code==1){
        this.curPage=this.currentPage;
        _this.getData();
        _this.$notify({
          title:"更新成功",
          type:"success"
        })
      }else {
        _this.$notify({
          title:"上传失败",
          type:"error"
        });
      }
    },
    //弹出删除窗口
    handleDelete(id){
      this.idx=id;
      this.deleteVisible=true;
    },
    handleSelectionChange(val){
      this.multipleSelection=val;
    },
    //批量删除已经选择的
    delAll(){
      for(let item of this.multipleSelection){
        this.handleDelete(item.id);
        this.deleteRow();
      }
      this.multipleSelection=[]
    }
  }
}
