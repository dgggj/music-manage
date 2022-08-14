<template>
  <div class="table">
    <div class="crumbs">
      <i class="el-icon-tickets"> 歌曲信息</i>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="请输入歌手名字" class="handle-input"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible=true">添加歌曲</el-button>
      </div>
    </div>
    <el-table size="mini" border style="width: 100%" height="800px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="歌曲图片" width="110" align="center">
        <template v-slot="scope">
          <div class="song-img">
            <img :src="getUrl(scope.row.pic)" style="width: 100%">
          </div>
          <div class="play" @click="setSongUrl(scope.row.url,scope.row.name)">

            <div v-if="toggle!=scope.row.name">
              <svg class="icon">
                <use xlink:href="#icon-bofanganniu"></use>
              </svg>
            </div>
            <div v-if="toggle==scope.row.name">
              <svg class="icon">
                <use xlink:href="#icon-zanting"></use>
              </svg>
            </div>
          </div>

        </template>
      </el-table-column>
      <el-table-column prop="name" label="歌手-歌名" width="120px" align="center"></el-table-column>
      <el-table-column prop="introduction" label="专辑" width="150px" align="center"></el-table-column>

      <el-table-column label="歌词"  align="center">
        <template v-slot="scope">
          <ul style="height: 100px;overflow: scroll">
            <li v-for="(item,index) in parseLyric(scope.row.lyric)" :key="index">
              {{item}}}
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="资源更新" width="180px"  align="center">
        <template v-slot="scope">
          <el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatorUpload" :on-success="handleAvatorSuccess">
            <el-button size="mini">更新图片</el-button>
         </el-upload>
          <br>
         <el-upload :action="uploadSongUrl(scope.row.id)" :before-upload="beforeSongUpload" :on-success="handleSongSuccess">
            <el-button size="mini">更新歌曲</el-button>
         </el-upload>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template v-slot="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background :current-page="currentPage" :page-size="pageSize" :total="tableData.length" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog title="添加歌曲" :visible="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="tf">
        <div>
          <label>歌名</label>
          <el-input type="text" name="name"></el-input>
        </div>
        <div>
          <label>专辑</label>
          <el-input type="text" name="introduction"></el-input>
        </div>
        <div>
          <label>歌词</label>
          <el-input type="textarea" name="lyric"></el-input>
        </div>
        <div>
          <label>歌曲上传</label>
          <el-input type="file" name="file" ></el-input>
        </div>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible=false">取消</el-button>
        <el-button size="mini" @click="addSong">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改歌曲" :visible.sync="editVisible" width="400px" center>
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item prop="name" label="歌手-歌名" size="mini">
          <el-input v-model="form.name" placeholder="歌手-歌名"></el-input>
        </el-form-item>

        <el-form-item prop="introduction" label="专辑" size="mini">
          <el-input v-model="form.introduction" placeholder="专辑"></el-input>
        </el-form-item>
        <el-form-item prop="lyric" label="歌词" size="mini">
          <el-input v-model="form.lyric" placeholder="歌词" type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button size="mini" @click="editVisible=false">取消</el-button>
        <el-button size="mini" @click="editSave">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="删除歌曲" :visible.sync="deleteVisible" width="400px" center>
      <div align="center">是否确定删除？</div>
      <span slot="footer">
        <el-button size="mini" @click="deleteVisible=false">取消</el-button>
        <el-button size="mini" @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>


import {mapGetters} from "vuex";
import '@/assets/js/iconfont.js'
import {getAllSong,songOfSingerId,updateSong,deleteSong} from "../api/index";
import {mixin} from "../mixins/index";

export default {
  mixins: [mixin],
  data() {
    return {
      singerId: '',
      singerName:'',
      centerDialogVisible: false,//添加歌手弹窗是否出现
      editVisible:false,//编辑歌手弹窗是否出现
      deleteVisible:false,//删除窗口是否出现
      registerForm:{    //添加框
        name:'',
        singerName:'',
        introduction:'',
        lyric:''
      },
      form:{      //编辑窗
        id: '',
        name:'',
        introduction:'',
        lyric: ''
      },
      tableData: [],
      tempData: [],
      select_word: '',
      pageSize: 5,//分页每页大小
      currentPage: 1,//当前页
      idx : -1, //当前选择项
      multipleSelection: [],//
      curPage:1,
      toggle: false //播放器图标状态
    }
  },
  computed:{
    ...mapGetters([
      'isPlay'
    ]),

    //计算当前搜索结果表里的数据
    data(){
      return this.tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
    }
  },
  watch:{
    //搜索框里面的内容发生变化的时候，搜索的table列表也随之发生变化

    select_word: function (){
      if(this.select_word==''){
        this.tableData=this.tempData;
      }else{
        this.tableData=[];
        for(let item of this.tempData){
          if(item.name.includes(this.select_word)){
            this.tableData.push(item);
          }
        }
      }
    }
  },
  created() {
    this.singerId=this.$route.query.id;
    this.singerName=this.$route.query.name;
    this.getData()
  },
  destroyed() {
    this.$store.commit('setIsPlay',false);
  },
  methods:{
    //获取当前页
    handleCurrentChange(val){
      this.currentPage=val;

    },
    //查询所有歌手
    getData(){
      this.tempData=[];
      this.tableData= [];//先清空数据，以防以前查询数据
      if(this.singerId==null) {
        getAllSong().then(res => {
          this.tempData = res;
          this.tableData = res;
          this.currentPage=this.curPage;
        })
      }else {
        songOfSingerId(this.singerId).then(res=>{
          this.tempData=res;
          this.tableData=res;
        })
      }
    },

    //添加歌手
    addSong(){
      let _this=this;
      var form=new FormData(document.getElementById('tf'));
      form.set('singerId',this.singerId);
      form.set('name',this.singerName+'-'+form.get('name'));
      if(!form.get('lyric')){
        form.set('lyric','[00:00:00]暂无歌词');
      }
      var req=new XMLHttpRequest();
      req.open('post',`${_this.$store.state.HOST}/song/add`,true);
      // req.setRequestHeader('Content-Type', 'multipart/form-data');
      req.onreadystatechange=function () {
        if(req.readyState==4&&req.status==200){
          let res=JSON.parse(req.response);
          if(res.code){
            _this.getData();
            _this.registerForm={};
            _this.$notify({title:res.msg,type:'success'});
          }else {
            _this.$notify({title:'保存失败',type:'error'});
          }
        }
      }
      console.log(form);

      req.send(form);
      _this.centerDialogVisible=false

    },
    handleEdit(row){
      this.editVisible=true;
      this.form= {
        id: row.id,
        name: row.name,
        introduction:row.introduction,
        lyric: row.lyric
      };

    },
    editSave(){
      updateSong(this.form)
        .then(res=>{
          if(res.code==1){
            this.getData();
            this.$notify({title:"修改歌曲信息成功",type:"success"});
          }else {
            this.$notify({title:"修改歌曲信息失败",type:"error"});
          }
        })
        .catch(err=>{
          console.log(err);
        })
      this.editVisible=false;

    },
    //删除歌手
    deleteRow(){
      deleteSong(this.idx)
        .then(res=>{
          if(res){
            this.curPage=this.currentPage;
            this.getData();
            this.$notify({title:"删除歌曲成功",type:"success"});
          }else {
            this.$notify({title:"删除歌曲失败",type:"error"});
          }
        })
        .catch(err=>{
          console.log(err)
        });
      this.deleteVisible=false;

    },
    //上传歌曲文件之前的校验
    beforeSongUpload(file){
      var testMsg=file.name.substring(file.name.lastIndexOf('.')+1);
      if(testMsg!='mp3'){
        this.$message.error({
          message:'上传文件格式只能为mp3格式',
          type: 'error'});
        return false;
      }
      const isLt2M=(file.size/1024/1024)<10;
      if(!isLt2M){
        this.$message.error({
          message:'文件大小不能超过10M',
          type:'error'});
        return false;
      }
      return true;

    },
    //歌曲文件上传成功之后要做的工作
    handleSongSuccess(res){
      let _this=this;
      if(res.code==1){
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
    uploadSongUrl(id){
      return `${this.$store.state.HOST}/song/updateSongUrl?id=${id}`;
    },

    //更新图片
    uploadUrl(id){
      return `${this.$store.state.HOST}/song/updateSongPic?id=${id}`
    },

    //解析歌词
    parseLyric(text){
      let lines=text.split("\n");
      let pattern=/\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
      let result=[];
      for(let item of lines){
        let value=item.replace(pattern,'');
        result.push(value);
      }
      return result;
    },
    //切换播放歌曲
    setSongUrl(url,name){
      if(this.toggle===name){
        this.toggle=false;
        this.$store.commit('setIsPlay',false);
        return;
      }
      this.toggle=name;
      this.$store.commit('setUrl',this.$store.state.HOST+url);
      if(this.isPlay){
        this.$store.commit('setIsPlay',false);
      }else {
        this.$store.commit('setIsPlay',true);
      }
    }


  }

}
</script>

<style scoped>
.handle-box{
  margin-bottom: 20px;
}
.song-img{
  width: 100%;
  height: 80px;
  border-radius: 5px;
  margin-bottom: 5px;
  overflow: hidden;
}
.handle-input{
  width: 300px;
  display: inline-block;
}
.pagination{
  display: flex;
  justify-content: center;
}
.play{
  position: absolute;
  z-index: 100;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  top: 18px;
  left: 15px;
}
.icon{
  width: 2em;
  height: 2em;
  color: white;
  fill: currentColor;
  overflow: hidden;
}

</style>
