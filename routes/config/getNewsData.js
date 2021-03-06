const router = require("koa-router")({
    prefix: "/config"
})
import cheerio from "cheerio";
import superagent from "superagent"
import News_ from "../../modules/module_news_list"

//数据整合
const integration = async() => {
    try {
        let title = await getNewsDataTitle()
        let listData = []
        for (const item of title) {

            let content = await getNewsDataContent(item.url)
            listData.push({ title: item.title, content: content.content, imgUrl: content.imgUrl })
        }
        return listData
    } catch (error) {
        throw Error(error)
    }
}


//抓取文章列表标题
const getNewsDataTitle = () => {
        return new Promise((resolve, reject) => {
            // let url = 'https://news.baidu.com/'; //百度新闻地址
            let url = "https://news.sina.com.cn/"; //新浪新闻网址
            superagent('GET', url, 'utf-8')
                .end((err, sres) => { //页面获取到的数据
                    if (sres) {
                        let html = sres.text,
                            arr = [],
                            $ = cheerio.load(html, { //用cheerio解析页面数据
                                decodeEntities: false
                            })

                        //下面类似于jquery的操作
                        $("#ad_entry_b2 ul li a").each((index, element) => {
                            var $text = $(element).text();
                            let url = $(element).attr('href')
                            arr.push({ title: $text, url: url });
                        });
                        resolve(arr)
                    } else {
                        reject(err)
                    }
                });

        })
    }
    //抓取文章内容
const getNewsDataContent = (url) => {
        return new Promise((resolve, reject) => {

            superagent('GET', url, 'utf-8')
                .end((err, sres) => { //页面获取到的数据
                    if (sres) {
                        let html = sres.text,
                            content,
                            imgUrl = [],
                            $ = cheerio.load(html, {
                                decodeEntities: false
                            }) //用cheerio解析页面数据
                            // obj = {};
                        console.log($("#myflashBox").attr('id'))
                        $("#article p").each((index, element) => {
                            var $text = $(element).text();
                            content += $text
                        });
                        $(".img_wrapper img").each((index, element) => {
                            var $text = $(element).attr('src');
                            imgUrl.push($text)
                        });
                        // 
                        resolve({ content: content, imgUrl: imgUrl })
                    } else {
                        reject(err)
                    }
                });


        })

    }
    // #region
    /**
     * @swagger
     * /config/hot/integration:
     *   get:
     *     description: 获取热点新闻
     *     tags: [获取数据]
     *     produces:
     *       - application/x-www-form-urlencoded
     *     responses:
     *       200:
     *         description: 获取成功
     */
    // #endregion
router.get("/hot/integration", async(ctx, next) => {
    try {
        let _ = await integration()
        let _insert = await News_.insert(_)
        ctx.body = { code: 200, msg: _insert }
    } catch (error) {
        throw Error(error)
    }
})

export default router