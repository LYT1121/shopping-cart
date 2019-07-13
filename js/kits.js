/**
 * 用于把很多重复使用的代码，进行封装，到时候直接使用
 * 
 */

 /**
  * @description 读取存储在localStorage里面的数组的
  * @param {string} key 存储数据使用的键
  * @return {Array} 返回一个数组，如果不存在，返回空数组
  */
function loadData(key){
  var str = localStorage.getItem(key);
  var arr = JSON.parse(str);
  if(!arr){
    arr = [];
  }
  return arr;
}

/**
 * @description 用于将数组存储到localStorage里面的方法
 * @param {string} key 存储使用的键
 * @param {Array} arr 要存储的数组数据
 * @return {undefined}
 */
function saveData(key,arr){
  var json = JSON.stringify(arr);
  localStorage.setItem(key, json);
}


// 封装计算购物车里面的商品总量的代码
function total(){
  // 加载所有的数据
  var arr = loadData('shopCart');
  // 计算总件数
  var total = 0;
  arr.forEach(function(e){
    total += e.number;
  });
  return total;
}