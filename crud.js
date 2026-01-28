const http = require("http")
const uuid = require("uuid")

const { read_file, write_file } = require("./api/file-system")
const option = {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}
const app = http.createServer((req,res) => {

    const requID = req.url.split("/")[req.url.split("/").length - 1];
    console.log(requID);
    

    //get
if(req.url === "/get_all_products" && req.method === "GET"){
    const fileData = read_file("product.json")
    res.writeHead(200, option)
    res.end(JSON.stringify(fileData))
    
}
/// get one
if(req.url === "/get_one_products/" && req.method === "GET"){
    if(req.url.startsWith("/get_one_products/") && req.method === "GET") {
        const fileData = read_file("product.json");
        const product = fileData.find(item => item.id === requID);
        if(!product){
            res.writeHead(404, option);
            return res.end(JSON.stringify({ message: "topilmadi" }));
        }
        res.writeHead(200, option);
        res.end(JSON.stringify(product));
    }
    
}
if(req.url === "/add_product" && req.method === "POST"){
    req.on("data",(userData) => {
        const data = JSON.parse(userData)
        const { title,none,jncsjshd} = data ;
        const fileData = read_file("product.json")
        fileData.push({
        id: uuid.v4(),
        title,
        none,
        jncsjshd
    });
      write_file("product.json", fileData)
      res.writeHead(201,option)
      res.end(JSON.stringify({
        message: " yaratildi"
      }))
    })
}

if(req.url === "/update_product/" + requID && req.method === "PUT"){
    req.on("data",(chunk) => {
        const { title,none,jncsjshd} = data ;
        const data = JSON.parse(chunk)
        const fileData = read_file("product.json")
        const foundedProduct = fileData.find((item) => item.id === requID)
        if(!foundedProduct){
            res.writeHead(404,option)
            return res.eventNames(JSON.stringify({
                message: " topilmadi"
            }))
        }
        fileData.forEach((item) => {
            if(item.id === requID){
                 item.title = title || item.title;
                 item.none = none || item.none;
                 item.jncsjshd = jncsjshd || item.jncsjshd;
            } 
         })
         write_file("product.json", fileData);
         
        res.writeHead(200,option)
        res.end(JSON.stringify({
        message: " yaratildi"
      }))
    })
}

});
app.listen(3000, () => {
    console.log("server ishladi");
    
})