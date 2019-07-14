$(()=>{
    // 把购物车的数据从本地存储里面读取出来
    let jsonStr = localStorage.getItem('shopCarts');
    // 判断jsonStr是否返回null，如果是就没有数据，如果不是，就是有数据
    // 先声明一个数组
    let arr;
    if(jsonStr !== null){
        // 把取出来的装进数组里
        arr = JSON.parse(jsonStr);
        // 遍历数组，生成结构
        // 先声明一个空结构
        let html = '';
        arr.forEach(e => {
            html += `<div class="item" data-id="${e.pID}">
            <div class="row">
              <div class="cell col-1 row">
                <div class="cell col-1">
                  <input type="checkbox" class="item-ck" checked="">
                </div>
                <div class="cell col-4">
                  <img src="${e.imgSrc}" alt="">
                </div>
              </div>
              <div class="cell col-4 row">
                <div class="item-name">${e.name}</div>
              </div>
              <div class="cell col-1 tc lh70">
                <span>￥</span>
                <em class="price">${e.price}</em>
              </div>
              <div class="cell col-1 tc lh70">
                <div class="item-count">
                  <a href="javascript:void(0);" class="reduce fl">-</a>
                  <input autocomplete="off" type="text" class="number fl" value="${e.number}">
                  <a href="javascript:void(0);" class="add fl">+</a>
                </div>
              </div>
              <div class="cell col-1 tc lh70">
                <span>￥</span>
                <em class="computed">${e.price * e.number}</em>
              </div>
              <div class="cell col-1">
                <a href="javascript:void(0);" class="item-del">从购物车中移除</a>
              </div>
            </div>
          </div>`;
        });
        // 把HTML结构的字符串放到div里面
        $('.item-list').html(html);
        // 把空空如也去掉
        $('.empty-tip').hide();
        // 把表头和下面总结算显示出来
        $('.cart-header').removeClass('hidden');
        $('.total-of').removeClass('hidden');
    }

    // 计算总和和总价
    function ctcam(){
      // 算出总价里面是总数和总价
      // 根据选中的多选框，得到选中的商品的id
      let totalCount = 0;
      let totalMoney = 0;
      $('.item-list input[type=checkbox]:checked').each((i,e)=>{
        let id = parseInt($(e).parents('.item').attr('data-id'));
        arr.forEach(e=>{
          if(id===e.pID){
            // 勾选在本地存储中的数据
            totalCount+=e.number;
            totalMoney+=e.number * e.price;
          }
        })
      })
      // 修改数量和总价
      $('.selected').text(totalCount);
      $('.total-money').text(totalMoney);
    }
    ctcam();
})