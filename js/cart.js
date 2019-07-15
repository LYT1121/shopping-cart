$(() => {
  // 把购物车的数据从本地存储里面读取出来
  let jsonStr = localStorage.getItem('shopCarts');
  // 判断jsonStr是否返回null，如果是就没有数据，如果不是，就是有数据
  // 先声明一个数组
  let arr;
  if (jsonStr !== null) {
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
  function ctcam() {
    // 算出总价里面是总数和总价
    // 根据选中的多选框，得到选中的商品的id
    let totalCount = 0;
    let totalMoney = 0;
    $('.item-list input[type=checkbox]:checked').each((i, e) => {
      let id = parseInt($(e).parents('.item').attr('data-id'));
      arr.forEach(e => {
        if (id === e.pID) {
          // 勾选在本地存储中的数据
          totalCount += e.number;
          totalMoney += e.number * e.price;
        }
      })
    })
    // 修改数量和总价
    $('.selected').text(totalCount);
    $('.total-money').text(totalMoney);
  }
  ctcam();

  // 实现全选和全不选
  $('.pick-all').on('click', function () {
    // 先看看当前的状态
    let status = $(this).prop('checked');//开关属性
    // 设置每个商品都和当前一样
    $('.item-ck').prop('checked', status);
    // 把上下两个全选一起同步
    $('.pick-all').prop('checked', status);
    ctcam();
  })

  // 动态生成的商品信息应该用委托来实现
  $('.item-ck').on('click', function () {
    // 判断是否全选-选中的个数和所有的个数是一致的
    let isall = $('.item-ck').length === $('.item-ck:checked').length;
    $('.pick-all').prop('checked', isall);
    ctcam();
  })

  // 使用委托的方式实现加减
  $('.item-count').on('click', '.add', function () {
    // 先得到旧的数据
    let oldVal = parseInt($(this).siblings('input').val());
    oldVal++;
    if (oldVal > 1) {
      // 当输入框里面的数量大于1，让减号按钮可以点击
      $(this).siblings('.reduce').removeClass('disabled');
    }
    // 把值设置回去
    $(this).siblings('input').val(oldVal);
    // 然后把本地存储里面的数据更新
    // 判断的依据是：点击的按钮对应的商品的id
    let id = parseInt($(this).parents('.item').attr('data-id'));
    let obj = arr.find(e => {
      return e.pID === id;
    });
    // 更新对应的数据
    obj.number = oldVal;
    // 覆盖本地的数据
    let jsonStr = JSON.stringify(arr);
    localStorage.setItem('shopCarts', jsonStr);
    // 重新计算总数和总价
    ctcam();
    // 还要把对应商品的钱也要计算
    // jq对象.find()方法，是一个获取指定条件的后代元素的方法 - find 在找子元素的时候，没有children效率高
    $(this).parents('.item').find('.computed').text(obj.price * obj.number);
  })

  $(".item-list").on('click', '.reduce', function () {
    let oldVal = parseInt($(this).siblings('input').val());
    // 如果当前值已经是1了，就不能在点击了
    if (oldVal === 1) {
      return;
    }
    oldVal--;
    if (oldVal === 1) {
      // 给按添加一个样式，不能点击的样式
      $(this).addClass('disabled');
    }
    $(this).siblings('input').val(oldVal);
    let id = parseInt($(this).parents('.item').attr('data-id'));
    let obj = arr.find(e => {
      return e.pID === id;
    });
    // 更新对应的数据
    obj.number = oldVal;
    // 还要覆盖回本地数据
    let jsonStr = JSON.stringify(arr);
    localStorage.setItem('shopCarts', jsonStr);
    // 重新计算总数和总价
    ctcam();
    $(this).parents('.item').find('.computed').text(obj.price * obj.number);
  })
  // 实现删除
  $('.item-list').on('click','.item-del',function(){
    // 因为我们的删除的动作是在点击确定之后进行，点击确定是另外一个函数了，该函数里面的this已经不是移除按钮，我们可以在这里先保存一个this
    let _this = this;
    // 弹出一个确认框
    $("#dialog-confirm").dialog({
      resizable: false,
      height: 140,
      modal: true,
      buttons: {
        "确认": function () {
          $(this).dialog("close");
          // 把对应的商品删除
          // 把对应的结构移除
          // console.log(_this);
          $(_this).parents('.item').remove();
          // 把本地数据移除
          // 我们现在需要根据id获取本地存储里面的数据
          let id = parseInt($(_this).parents('.item').attr('data-id'));
          // console.log(id);
          // 把对应id的数据读取出来
          // let obj = arr.find(e => {
          //   return e.pID === id;
          // });
          // // console.log(obj);
          // // 把对应的id的数据从本地存储里面移除
          // // arr.splice(从哪里开始删除,总共删除多少个);
          // let index = arr.indexOf(obj);
          // console.log(index);

          // 在h5里面的，数组新增了一个方法，获取满足条件的元素的索引          
          let index = arr.findIndex((e)=>{
            return e.pID === id
          })
          // console.log(index);

          arr.splice(index, 1);
          // 把数据覆盖回本地
          let jsonStr = JSON.stringify(arr);
          localStorage.setItem('shopCarts', jsonStr);
        },
        "取消": function () {
          $(this).dialog("close");
        }
      }
    });
  })
  // 弹出一个jqueryUI的确认框
  // $( "#dialog-confirm" ).dialog({
  //   resizable: false,
  //   height:140,
  //   modal: true,
  //   buttons: {
  //     "确认": function() {
  //       $( this ).dialog( "close" );
  //       // 把对应的商品删除
  //     },
  //     "取消": function() {
  //       $( this ).dialog( "close" );
  //     }
  //   }
  // });

})