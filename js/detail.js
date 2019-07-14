// 用一个入口函数包起来
$(function () {
    // 根据浏览器地址栏的数据，获取id
    let pID = parseInt(location.search.substring(4));
    // 储存一个对象，先设置为null无效的
    let obje = null;
    // 根据id获取对应的数据信息 遍历
    phoneData.forEach(function (e, i) {
        if (e.pID === pID) {
            obje = e;
            // 筛选出了对应的数据 -把数据显示在页面对应的位置
            // 修改元素的属性 
            $('.itemInfo-wrap>.sku-name').text(e.name)//头部标题
            $('.preview-img>img').attr('src', e.imgSrc)//修改小图区域图片
            $('.big>img').attr('src', e.imgSrc)//修改大图区域图片
            $('.summary-price').find('em').text('¥' + e.price)// 修改价格
        }
    })


    // 放大镜
    // 获取元素
    // $('.preview-img>img').attr('src', e.imgSrc);//小图区域  动态生成图片
    // $('.mask');//遮罩层
    // $('.big');//大图区域
    //$('.big>img').attr('src', e.imgSrc);//结构中没有大图的图片 动态生成图片
    // 大图的图片大小
    $('.preview-img').on('mouseout', function () {
        // 鼠标移出，让遮罩和大图隐藏
        $('.mask').hide();
        $('.big').hide();
    });
    $('.big>img').css({
        width:'150%',
        position: 'absolute',
    });
    $('.big').css('overflow', 'hidden');
    $('.preview-img').on('mouseover', function () {
        // 鼠标移入，让遮罩和大图显示
        $('.mask').show();
        $('.big').show();
    })
    $('.preview-img').on('mousemove', function (e) {
        // 遮罩具体位置公式：遮罩的位置=鼠标的位置-盒子距离页面的左上距离-遮罩自身宽高的一半
        // 鼠标位置
        let x = e.pageX;
        let y = e.pageY;
        // 盒子距离页面的左上距离
        let pwTop = $('.preview-wrap').position().top;
        let pwLeft = $('.preview-wrap').position().left;
        // 遮罩自身宽高的一半
        let maskWidth = $('.mask').width() / 2;
        let maskHeight = $('.mask').height() / 2;
        // 遮罩的位置
        let maskX = x - pwLeft - maskWidth;
        let maskY = y - pwTop - maskHeight;
        // 左上方最小值
        maskX = maskX < 0 ? 0 : maskX;
        maskY = maskY < 0 ? 0 : maskY;
        // 右下方最大值
        let zdX = $('.preview-img').width() - $('.mask').width();
        let zdY = $('.preview-img').height() - $('.mask').height();
        maskX = maskX > zdX ? zdX : maskX;
        maskY = maskY > zdY ? zdY : maskY;
        // 设置遮罩的top left 位置
        $('.mask').css('top',maskY + 'px');
        $('.mask').css('left',maskX + 'px');
        // 等比例移动的公式：大图的当前位置=遮罩的当前位置*大图的最大位置/遮罩的最大位置
        // 大图的最大位置=大图的宽高-溢出隐藏盒子的宽高
        let bigprctureX = $('.big>img').width() - $('.big').width();
        let bigprctureY = $('.big>img').height() - $('.big').height();
        let bigimgX = maskX * bigprctureX / zdX;
        let bigimgY = maskY * bigprctureY / zdY;
        // 把位置设置给bigimg
        $('.big>img').css('left',-bigimgX + 'px');
        $('.big>img').css('top',-bigimgY + 'px');
    })
    


    // 实现数量的加减
    // 获取加号按钮、获取减号按钮。数字的输入框
    $('.add');//加号按钮
    $('.reduce');//减号按钮
    $('.choose-number');//数字的输入框
    // 加号
    $('.add').on('click',function(){
        // 让件数每次加1  先获取原来的数量
        let oldamount = parseInt($('.choose-number').val());//用parseInt保证是数字
        oldamount++;
        // 给一个判断，如果点击的是+号，当前的数量大于1，就让减号可以被点击
        if(oldamount>1){
            $('.reduce').removeClass('disabled');//把里面禁止点击的类名移除 
        }
        // 重新赋值
        $('.choose-number').val(oldamount);
    })
    // 减号
    $('.reduce').on('click',function(){
        let oldamount = parseInt($('.choose-number').val());
        oldamount--;
        // 给一个判断，如果当前数字是1，就不能继续 然后把禁止点击的类名加回来
        if(oldamount === 1){
            $('.reduce').addClass('disabled');
        }
        // 重新赋值，把新的数值设置回输入框
        $('.choose-number').val(oldamount);
    })

    
    // 读取本地存储数组localStorage的封装  key存储数据使用的键
    // 已引用了kits
    /* function loadDate(key){
        let str = localStorage.getItem(key);
        let arr = JSON.parse(str);//JS格式的字符串转换为js对象(也可能是数组)
        // 判断 返回值是数组，如果不存在就返回一个空数组
        if(!arr){
            arr = [];
        }
        return arr;
    } */


    // 点击加入购物车功能
    /*
    把当前对应的商品的信息加入购物车
    把那些信息存入本地存储 图片/商品名/单价/数量/pID
    */
    $('.addshopcar').on('click',function(){
        // 不知道用户添加的数量是多少，未知，所以需要获取
        let number = parseInt($('.choose-number').val());//用parseInt保证是数字
        // 购物车可以叫入很多商品，所以用数组的方式存到localStorage本地存储里
        // 先从本地存储里面读取旧数据，然后把新旧数据叠加一起展示
        let jsonStr = localStorage.getItem('shopCarts');
        let arr;
        // 需要判断本地存储里是否有数据
        if(jsonStr === null){//如果里面没有数据，就给一个空的数组
            arr = [];
        }else{//反之新旧数据叠加
            arr = JSON.parse(jsonStr);
        }
        // 目前为止，bug：如果点击同一个商品多次，会出现多条数据在购物车并列展示，实际应该是数量的叠加
        // 解决方法：判断当前产品的id，是否出现过在localStorage本地存储里面了
        // find 方法，如果找到元素，就会返回该元素，如果没有找到，就会返回undefined，用此来判断id是否出现过
        let isID = arr.find(function(e){
            return e.pID === IDBCursor;
        });
        // 判断 find的返回值是否是undefined
        if(isID !== undefined){
            // 把数量叠加
            isID.number+=number;
        }else{
            // 如果没有出现过，就新增一个
            let goods = {
                pID : obje.pID,
                name : obje.name,
                price : obje.price,
                imgSrc : obje.imgSrc,
                number : number
            }
            // 添加到结构中
            arr.push(goods);
        }
        // 把数组变成json格式的字符串
        jsonStr = JSON.stringify(arr);
        // 存储到localStorage里面
        localStorage.setItem('shopCarts',jsonStr);
        // 添加点击跳转，跳转到购物车页面，进行结算
        location.href = 'cart.html';
    })

})

