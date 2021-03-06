const router = require("koa-router")({
    prefix: '/home'
})
import news from "../../modules/module_news_list"
router.get("/", async(ctx, next) => {
    ctx.body = "this is listPage"
})
import moment from "moment"

/**
 * @swagger
 * /home/hot/newsTitle:
 *   get:
 *     description: 获取文章标题
 *     tags: [文章获取模块]
 *     produces:
 *       - application/x-www-form-urlencoded
 *     responses:
 *       200:
 *         description: code:200,<br/> data:[{<br/>id:id,<br/> title： 文章标题,<br/>createdAt：创建时间,<br/> updatedAt：修改时间}]
 */
//查询文章标题
router.get("/hot/newsTitle", async(ctx, next) => {
        try {
            let _ = await news.queryTitle()
            let d = _.map((item, index) => {
                return {
                    id: item.id,
                    title: item.title,
                    time: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                }
            })

            function compare(p) { //这是比较函数
                return function(m, n) {
                    var a = m[p];
                    var b = n[p];
                    return b - a; //降序
                }
            }
            ctx.body = { code: 200, data: d.sort(compare("id")) }
        } catch (error) {
            throw Error(error)
        }
    })
    // [<br/>id:1,<br/> title: 文章标题,<br/> createdAt:创建时间,<br/> updatedAt:修改时间]
    /**
     * @swagger
     * /home/hot/newsContent/byId:
     *   get:
     *     description: 文章内容
     *     tags: [文章获取模块]
     *     produces:
     *       - application/x-www-form-urlencoded
     *     parameters:
     *       - name: id
     *         description: 文章标题ID
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: code:200<br/><br/>title：文章标题 <br/><br/>content：文章内容<br/><br/>imgUrls：文章图片
     */
    //查询文章内容
router.get("/hot/newsContent/byId", async(ctx, next) => {
    try {
        if (ctx.query.id) {
            let _ = await news.queryContent(ctx.query.id)
            return ctx.body = {
                code: 200,
                data: _.length > 0 ? {
                    title: _[0].title,
                    content: _[0].content,
                    imgUrls: _[0].imgUrl ? _[0].imgUrl.split(",") : [],
                    time: moment(_[0].createdAt).format("YYYY-MM-DD HH:mm:ss")
                } : []
            }
        }
        return ctx.body = { code: 400, msg: "查询参数不能为空" }

    } catch (error) {
        throw Error(error)
    }
})





export default router