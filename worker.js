const html404 = `<!DOCTYPE html>
<body>
  <h1>404 Not Found.</h1>
  <p>The url you visit is not found.</p>
</body>`

const statichtml="";


async function randomString (len) {
    len = len || 6
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length
    let result = ''
    for (i = 0; i < len; i++) {
        result += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return result
}
async function checkURL (URL) {
    let str = URL
    let Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
    let objExp = new RegExp(Expression)
    return objExp.test(str) && str[0] === 'h'
}
async function save_url (URL, short_url) {
    let random_key
    if (!short_url) {
        random_key = await randomString()
    } else {
        random_key = short_url
    }
    let is_exist = await LINKS.get(random_key)
    console.log(is_exist)
    if (is_exist == null)
        // 正常，直接放入
        return await LINKS.put(random_key, URL), random_key
    else
        if (!short_url) {
            // 生成的random_key重复了，递归调用
            save_url(URL, null)
        }
        else
            // 自定义的路径已经存在了
            return -1

}
async function handleRequest (request) {
    console.log(request)
    if (request.method === "POST") {
        let req = await request.json()
        console.log(req["url"])
        if (!await checkURL(req["url"]))
            return new Response(`{"msg":"非法URL"}`, { status: 400, headers: { "Content-Type": "application/json" } })
        let stat, random_key = await save_url(req["url"], req["shortUrl"])
        console.log(stat)
        // 放成功了，stat(put返回)为undefined
        if (typeof (stat) == "undefined")
            return new Response(`{"data":{"shortUrl":${random_key}}}`,{status:200,headers:{ "Content-Type": "application/json" } })
        else if (stat === -1)
            return new Response(`{"msg":"自定义路径已重复"}`, { status: 400, headers: { "Content-Type": "application/json" } })
        else return new Response(`{"msg":"k-v限额已满，求放过别刷啦"}`, { status: 500, headers: { "Content-Type": "application/json" } })
    }
    const requestURL = new URL(request.url)
    const path = requestURL.pathname.split("/")[1]
    console.log(path)
    if (!path) {

        const html = await fetch(statichtml)

        return new Response(await html.text(), {
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        })
    }
    const value = await LINKS.get(path)
    console.log(value)


    const location = value
    if (location) {
        return Response.redirect(location, 302)

    }
    // If request not in kv, return 404
    return new Response(html404, {
        headers: {
            "content-type": "text/html;charset=UTF-8",
        },
        status: 404
    })
}



addEventListener("fetch", async event => {
    event.respondWith(handleRequest(event.request))
})