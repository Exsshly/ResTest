const baseUrl = 'https://www.99csw.com'

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
    let $ = HTML.parse(GET(`https://m.99csw.com/book/search.list.php?keyword=${encodeURI(key)}&stat=true&page=1`))
    let searchBooks = $('root > book').map(o => ({
        name: o.attr('name'),
        author: o.attr('author'),
        cover: `${baseUrl}/book/cover.pic/cover_${o.attr('id')}.jpg`,
        detail: `${baseUrl}/book/${o.attr('id')}/`
    }))
    return JSON.stringify(searchBooks)
}


/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
    let $ = HTML.parse(GET(url))
    let Book = {
        summary: $('.intro > p').text(),
        status: '完结',
        category: $('.title > a:eq(1)').text(),
        lastChapter: $('#dir > dd:last-of-type > a').text(),
        catalog: url
    }
    return JSON.stringify(Book)
}


/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
    let $ = HTML.parse(GET(url))
    let Chapters = $('#dir > dd > a').map(o => ({
        name: o.text(),
        url: `${baseUrl}${o.attr('href')}`
    }))
    return JSON.stringify(Chapters)
}


/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {
    let $ = HTML.parse(GET(url))
    let list = []
    let n = 0
    let o = DECODE($('meta[name=client]').attr('content'),'base64').split(/[A-Z]+%/)
    let dom = $('#content > div')
    for(i = 0; i < o.length; i++){
        if(o[i] < 3){
		        list[o[i]] = dom[i]
		        n++
	      }else{
			     list[o[i] - n] = dom[i]
			     n = n+2
        }
    }
    return list.join('\n')
}


var bookSource = JSON.stringify({
    name: "九九藏书",
    url: "99csw.com",
    version: 100
})
