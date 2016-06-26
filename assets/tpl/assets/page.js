//加载右侧菜单
//加载右侧菜单
$(function(){
        var curentPath = "";
        var renderer = new marked.Renderer();
        /*
         * 修改渲染head时候的id属性
         */
        renderer.heading = function(text, level) {
            var headHtml = [
                '<h' + level + ' id="' + 'makedown-doc-' + encodeURIComponent(text.toLowerCase()) + '">',
                text,
                '</h' + level + '>\n'
            ].join('');
            return headHtml; 
        };
        /**
        * 增加图片渲染2个功能：
        * 1. 路径设置为文档路径下平级查找
        * 2. 增加图片大小定制功能，语法为：[](./pic/img.png =100x200) 或者 [](./pic/img.png =100x)
        */
        renderer.image = function(href, title, text){
        var imgInfo = /( =(.*)x(.*))/.exec(href);
        var width,height,src,imgHtml;
        if(imgInfo) {
            width = imgInfo[2];
            height = imgInfo[3];
            src = href.replace(/( =(.*)x(.*))/,'');
            imgHtml = '<img src="'+ curentPath + src + '" alt="' + text + '"' + 
                ' width = "'+width+'"' + ' height ="'+height+'" ';
        }else{
            imgHtml = '<img src="'+ curentPath + href + '" alt="' + text + '"';
        }       
        if (title) {
            imgHtml += ' title="' + title + '"';
        }
        imgHtml += ">";
        return imgHtml;
        };
        marked.setOptions({
            highlight: function(code) {
                return hljs.highlightAuto(code).value;
            },
            renderer: renderer
        });



    var menuPath = './docs/sidebar';
    $('#sidebar-container').load(menuPath,function(){
         $('#side-menu').metisMenu();
         defaultLoad();
         //设置默认右侧菜单
         var url = window.location;
        var hash = location.hash;
        var element = $('#sidebar-container a').filter(function() {
            return this.href == url;
        }).addClass('active').parent().parent().addClass('in').parent();
        if (element.is('li')) {
            element.addClass('active');
        }
    });
    function renderDoc(path) {
        // 切换导航hover状态
        var url = path;
        $.ajax({
            url: url,
            dataType: 'text',
            // 不使用缓存可以让每次请求命中最新文件内容
            cache: false,
            success: function (doc) {
                scrollTo(0, 0);
                //设置标题
                var title = "";
                var mdTitleReg = /# +([^\n]+)/;
                var contentList = mdTitleReg.exec(doc);
                if(mdTitleReg){
                    title = contentList[1];
                    document.title = contentList[1];
                }

                $('#con-doc').html(marked(doc)).css({
                    'position': 'relative',
                    'left': '-50px',
                    'opacity': '0.5'
                }).animate({
                    'left': '0',
                    'opacity': '1'
                }, 300, 'swing');
            },
            error: function () {
                scrollTo(0, 0);
                var doc = [];
                doc.push('# 页面未找到');
                $('#con-doc').html(marked(doc.join('\n')));
            }
        });
    }
    //默认加载文档
    function defaultLoad() {
            var hash = window.location.hash.replace('#', '');
            curentPath = hash.replace(/[^/]*.md/,'');
            if (hash.length > 0) {
                renderDoc(hash); 
            } else {
                $.get('./docs/0_standard.md', function(doc) {
                    $('#con-doc').html(marked(doc));
                });
            }
        }


  $(window).on('hashchange', function() {
            var hash = location.hash;
            path = hash.replace('#','');
            curentPath = path.replace(/[^/]*.md/,'');
            renderDoc(path);
        });

})


//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        var topOffset = 50;
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });    
});