/**
 * Created by zing on 2016/12/19.
 */

var fs = require("fs");
var cheerio = require("cheerio");
var $

var allJson = require('./all.json');
var First = allJson[10].arts;
var i = 0;
for (; i < First.length; i++) {
    // readFromLocal(First[i].fileName);
    appendFoot(First[i].fileName,First[i].fileLink);
    // feedImage(First[i].fileName,First[i].fileLink);
}
function appendFoot(name, link) {
    let data = "> 原文来自:" + link + "。转载请注明原出处，商用请联系原作者授权。";
    console.log(data)
    fs.appendFile('../11x/' + name, data, (error) => {
        if (error) {
            console.log("写入失败");
        } else {
            console.log("写入成功");
        }
    });
}

function feedImage(name, link) {
    fs.readFile("./temp/" + name, (error, data) => {
        if (error) {
            console.log("读取" + name + "失败");
            console.error(error);
        } else {
            let ch = '';
            ch = data.toString().replace("(full/", "(../full/")
            fs.writeFile('../' + name, ch, (error) => {
                if (error) {
                    console.log("写入失败");
                } else {
                    console.log("写入成功");
                }
            });
        }
    });
}


function readFromLocal(address) {
    fs.readFile("./html/" + address + ".html", (error, data) => {
        if (error) {
            console.log("读取" + address + "失败");
            console.error(error);
        } else {
            afterRead(data, address);
        }
    });
}


function afterRead(data, address) {
    // data = data.toString().replace(/\s/g," ");
    data = data.toString().replace(/<script /g, "\n <script ");
    data = data.toString().replace(/<\/script>/g, "<\/script>\n ");
    data = data.toString().replace(/<script (.+)<\/script>/g, "");
    // console.log(data);

    $ = cheerio.load(data);
    let end = filterEntry($(".entry-content"));
    end = end.replace(/\n+/g, "\n")
    end = end.replace("[", "\n\n[")
    // console.log(end);
    saveToMd(end, address);

}

function saveToMd(data, address) {
    fs.writeFile('./temp/' + address, data, (error) => {
        if (error) {
            console.log("写入失败");
        } else {
            console.log("写入成功");
        }
    });
}


function filterEntry(all) {
    var content = '';
    let child = all.children();
    child.each(function (item) {
        var con = $(this);
        if (con.is("script")) {
        } else {
            content += getItemText(con);
        }
    });
    sec = 1;
    return content;
}

function getItemText(DomItem) {
    let dom = $(DomItem);
    let temp = transfomDom(dom) + "\n";
    let child = dom.children();
    if (child && child.length > 0) {
        child.each(function (item) {
            let me = $(this);
            let atext = me.text();
            temp = temp.replace(atext, getItemText(me));
        });
    }
    return temp;
}

var sec = 1;
function transfomDom(Dom) {
    let con = Dom;
    let text;
    if (con.is('h2')) {
        text = "# " + con.text() + "\n";
    } else if (con.is('h3')) {
        if (sec < 10) {
            text = "## 0x0" + sec + " " + con.text() + "\n";
        } else {
            text = "## 0x" + sec + " " + con.text() + "\n";
        }
        sec++;
    } else if (con.is('a')) {
        if (con.parent().is('code')) {
            text = ''
        } else {
            text = "[" + con.text() + "](" + con.attr("href") + ")";
        }
    } else if (con.is('code')) {
        text = "```bash\n" + con.text() + "\n```\n";
    } else if (con.is('img')) {
        text = "![" + con.attr("alt") + "](" + con.attr("src") + ")\n";
    } else if (con.is("li")) {
        text = "+ " + con.text() + "\n";
    } else if (con.is("i")) {
        text = " *" + con.text().trim() + "* ";
    } else if (con.is("strong") || con.is("big")) {
        text = " **" + con.text().trim() + "** ";
    } else if (con.is("script")) {
        console.log("script");
    } else {
        text = con.text() + "\n";
    }
    // console.log(text);
    return text;
}

