import '../img/icon-128.png'
import '../img/icon-32.png'
import '../img/icon-16.png'

var reqs = {};
if(!('__sf_id' in localStorage))
    localStorage.__sf_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    }).toUpperCase();
chrome.tabs.onUpdated.addListener(function(id, change, tab) {
    if(!(id in reqs) || change.status != 'complete')
        return;
    chrome.tabs.executeScript(tab.id, {code: '(function f($){if(!document.readyState)return void(window.onload=f.bind(this,$));$("user_login").value="'+reqs[id][2]+'";$("user_pass").value="'+reqs[id][3]+'";$("rememberme").checked=!0;$("loginform").submit()})(document.getElementById.bind(document));'});
    delete reqs[id];
});
chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
    if(req === 'getSFID')
        return sendResponse(localStorage.__sf_id);
    chrome.tabs.update(req[0], {url: 'http://'+req[1]+'/wp-login.php'});
    reqs[req[0]] = req;
    sendResponse();
});
