const http = require("http");
const uuid = require("uuid");
const { read_file, write_file } = require("./api/file-system");

const option = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

const app = http.createServer((req, res) => {
    const requID = req.url.split("/").pop(); 
    console.log("Request ID:", requID);

    // get all
    if (req.url === "/get_all_products" && req.method === "GET") {
        const fileData = read_file("product.json");
        res.writeHead(200, option);
        return res.end(JSON.stringify(fileData));
    }

    // get one
    else if (req.url.startsWith("/get_one_products/") && req.method === "GET") {
        const fileData = read_file("product.json");
        const product = fileData.find(item => item.id === requID);
        if (!product) {
            res.writeHead(404, option);
            return res.end(JSON.stringify({ message: "topilmadi" }));
        }
        res.writeHead(200, option);
        return res.end(JSON.stringify(product));
    }

    // create
    else if (req.url === "/add_product" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const data = JSON.parse(body);
            const { title, none, jncsjshd } = data;
            const fileData = read_file("product.json");
            const newProduct = {
                id: uuid.v4(),
                title,
                none,
                jncsjshd
            };
            fileData.push(newProduct);
            write_file("product.json", fileData);
            res.writeHead(201, option);
            return res.end(JSON.stringify({ message: "yaratildi", product: newProduct }));
        });
    }

    // update
    else if (req.url.startsWith("/update_product/") && req.method === "PUT") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const data = JSON.parse(body);
            const { title, none, jncsjshd } = data;

            const fileData = read_file("product.json");
            const product = fileData.find(item => item.id === requID);
            if (!product) {
                res.writeHead(404, option);
                return res.end(JSON.stringify({ message: "topilmadi" }));
            }

            // yangilash
            product.title = title || product.title;
            product.none = none || product.none;
            product.jncsjshd = jncsjshd || product.jncsjshd;

            write_file("product.json", fileData);

            res.writeHead(200, option);
            return res.end(JSON.stringify({ message: "yangilandi", product }));
        });
    }

    // 
    else {
        res.writeHead(404, option);
        return res.end(JSON.stringify({ message: "Page topilmadi" }));
    }
});

app.listen(3000, () => {
    console.log("Server 3000-portda ishlayapti");
});
