// //当浏览器安装插件时
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: 'OFF'
    })
})
let scriptExecuted = false
let menuItem
// //当用户点击插件时
chrome.action.onClicked.addListener(async (tab) => {
    let text = await chrome.action.getBadgeText({ tabId: tab.id })
    let newText = text == 'OFF' ? 'ON' : 'OFF'
    if(newText == 'OFF'){
        scriptExecuted = false
        chrome.contextMenus.remove('translates')
    }
    chrome.action.setBadgeText({
        tabId: tab.id,
        text: newText
    })
    if (!scriptExecuted&&newText == 'ON') {
        //我们在当前标签嵌入一个js文件 可在这做一些页面上的操作
        // chrome.scripting.executeScript({
        //     target: {
        //         tabId: tab.id
        //     },
        //     files: ['scripts/translate.js']
        // })
        scriptExecuted = true
        menuItem = {
            "id":"translates",
            "title":"使用谷歌翻译",
            "contexts":["selection"]
        }
        chrome.contextMenus.create(menuItem)
        chrome.contextMenus.onClicked.addListener(function(clickData){
            if (clickData.menuItemId == 'translates'&&clickData.selectionText) {
                let createData = {
                    url:"https://translate.google.com.hk/?sl=zh-CN&tl=en&text="+clickData.selectionText+"&op=translate",
                    type:"popup",
                    top:20,
                    left:20,
                    width:900,
                    height:500,
                }
                chrome.windows.create(createData)
            }
        })
    }
})