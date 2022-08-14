import {get,post} from "./http";
//判断是否登录成功
export const getLoginStatus=(params)=>post(`admin/login/status`,params);
//添加歌手
export const setSinger=(params)=>post(`singer/add`,params);
//查询歌手
export const getAllSinger=()=>get(`singer/allSinger`);
//修改歌手
export const updateSinger=(params)=>post(`singer/update`,params)
//删除歌手
export const deleteSinger=(id)=>get(`singer/delete/${id}`);
//获取所有歌曲
export const getAllSong=()=>get(`song/allSong`);
//添加歌曲文件
export const addSongFile=(params)=>post(`song/add`,params);
//通过歌手id获取该歌手歌曲
export const songOfSingerId=(id)=>get(`song/singer/detail/${id}`);
//修改歌曲
export const updateSong=(params)=>post(`song/update`,params);
//删除歌曲
export const deleteSong=(id)=>get(`song/delete/${id}`);
