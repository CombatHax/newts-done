const http = require("http");
const fs = require("fs")
const server = http.createServer((req, res) => {
    let url = req.url;
    if(url == '/') url = '/index.html';
    fs.readFile(`client${url}`, (err, data) => {
        if(err) {
            res.end("404: PAGE NOT FOUND");
            return;
        }
        switch(url.slice(url.indexOf('.'))) {
            case '.html':
                res.writeHead(200, {"Content-Type": "text/html"});
                break;
            case '.css':
                res.writeHead(200, {"Content-Type": "text/css"});
                break;
            case '.js':
                res.writeHead(200, {"Content-Type": "text/javascript"});
                break;
        }
        res.write(data);
        res.end();
    })
})
server.listen(8000);