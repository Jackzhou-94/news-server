const router = require("koa-router")({
    prefix: '/home'
})
import news from "../../modules/module_news_list"
router.get("/", async(ctx, next) => {
    ctx.body = "this is listPage"
})

/**
 * @swagger
 * /hot/home/newsTitle:
 *   get:
 *     description: 获取文章标题
 *     tags: [文章获取模块]
 *     produces:
 *       - application/x-www-form-urlencoded
 *     responses:
 *       200:
 *         description: code:200, data:[]
 */
//查询文章标题
router.get("/hot/newsTitle", async(ctx, next) => {
    try {
        let _ = await news.queryTitle()
        ctx.body = { code: 200, data: _ }
    } catch (error) {
        ctx.error(error)
    }
})

/**
 * @swagger
 * /hot/newsContent/byId:
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
 *         description: code:200,data:[]
 */
//查询文章内容
router.get("/hot/newsContent/byId", async(ctx, next) => {
    try {
        if (ctx.query.id) {
            let _ = await news.queryContent(ctx.query.id)
            return ctx.body = {
                code: 200,
                data: _.length > 0 ? _[0] : []
            }
        }
        return ctx.body = { code: 400, msg: "查询参数不能为空" }

    } catch (error) {
        ctx.error(error)
    }
})





export default router