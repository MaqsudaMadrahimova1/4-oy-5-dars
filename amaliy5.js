const http = require("http")
const uuid = require("uuid")

const { read_file, write_file } = require("./api/file-system")
const option = {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}


const app = http.createServer((req,res) => {
    const requID = req.url.split("/").pop(); 
    console.log("Request ID:", requID);
    
})