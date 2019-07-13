// 用一个入口函数包起来
$(function(){
    // 创建一个空数组
    let waresHtml = '';
    // 遍历数组
    phoneData.forEach(e=>{
        // 拼接一个满足HTML结构的字符串
        // 在a标签的后面用一个固定格式带上商品的id
        waresHtml += `<li class="goods-list-item">
        <a href="detail.html?id=${e.pID}">
          <div class="item-img">
            <img src="${e.imgSrc}" alt="">
          </div>
          <div class="item-title">
            ${e.name}
          </div>
          <div class="item-price">
            <span class="now">¥${e.price}</span>
          </div>
          <div class="sold">
            <span> 已售 <em>${e.percent}% </em></span>
            <div class="scroll">
              <div class="per" style="width:${e.percent}%"></div>
            </div>
            <span>剩余<i>${e.left}</i>件</span>
          </div>
        </a>
        <a href="#" class="buy">
          查看详情
        </a>`;
    })
    // 把拼接好的字符串，放到ul里面
    $('.goods-list>ul').html(waresHtml);
})