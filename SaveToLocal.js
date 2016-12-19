/**
 * Created by zing on 2016/12/18.
 */

var https = require("https");
var fs = require("fs");

var allJson = require('./all.json');
var First = allJson[8].arts;
var i = 30;
// for (; i < 36; i++) {
//     getHtmlToLocal(First[i].fileLink, First[i].fileName)
// }

function saveHtml(html, address) {
    fs.writeFile("html/" + address, html, (error) => {
        if (error) {
            console.log("写入失败")
        } else {
            console.log("写入成功")
        }
    });
}

function getHtmlToLocal(url, saveAddress) {
    https.get(url, function (res) {
        let html = "";
        res.on("data", function (data) {
            html += data;
        });
        res.on('end', function () {
            saveHtml(html, saveAddress + ".html");
        });
    });
}
