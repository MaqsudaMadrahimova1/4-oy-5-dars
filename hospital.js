const http = require("http");
const uuid = require("uuid");
const { read_file, write_file } = require("./api/file-system");

const option = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

const app = http.createServer((req, res) => {
    const requID = req.url.split("/").pop(); // oxirgi qism id bo'lishi mumkin
    console.log("Request ID:", requID);

    // get all
    if (req.url === "/get_all_hospitals" && req.method === "GET") {
        const fileData = read_file("hospital.json");
        res.writeHead(200, option);
        return res.end(JSON.stringify(fileData));
    }

    // get one
    else if (req.url.startsWith("/get_one_hospital/") && req.method === "GET") {
        const fileData = read_file("hospital.json");
        const hospital = fileData.find(item => item.id === requID);
        if (!hospital) {
            res.writeHead(404, option);
            return res.end(JSON.stringify({ message: "Hospital topilmadi" }));
        }
        res.writeHead(200, option);
        return res.end(JSON.stringify(hospital));
    }

    // create
    else if (req.url === "/add_hospital" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const data = JSON.parse(body);
            const { name, address, beds } = data;
            const fileData = read_file("hospital.json");
            const newHospital = {
                id: uuid.v4(),
                name,
                address,
                beds
            };
            fileData.push(newHospital);
            write_file("hospital.json", fileData);
            res.writeHead(201, option);
            return res.end(JSON.stringify({ message: "Yaratildi", hospital: newHospital }));
        });
    }

    // update
    else if (req.url.startsWith("/update_hospital/") && req.method === "PUT") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const data = JSON.parse(body);
            const { name, address, beds } = data;

            const fileData = read_file("hospital.json");
            const hospital = fileData.find(item => item.id === requID);
            if (!hospital) {
                res.writeHead(404, option);
                return res.end(JSON.stringify({ message: "Hospital topilmadi" }));
            }

            hospital.name = name || hospital.name;
            hospital.address = address || hospital.address;
            hospital.beds = beds || hospital.beds;

            write_file("hospital.json", fileData);

            res.writeHead(200, option);
            return res.end(JSON.stringify({ message: "Yangilandi", hospital }));
        });
    }

    // delete
    else if (req.url.startsWith("/delete_hospital/") && req.method === "DELETE") {
        const fileData = read_file("hospital.json");
        const index = fileData.findIndex(item => item.id === requID);
        if (index === -1) {
            res.writeHead(404, option);
            return res.end(JSON.stringify({ message: "Hospital topilmadi" }));
        }
        const deletedHospital = fileData.splice(index, 1)[0];
        write_file("hospital.json", fileData);

        res.writeHead(200, option);
        return res.end(JSON.stringify({ message: "O‘chirildi", hospital: deletedHospital }));
    }

    //
    else {
        res.writeHead(404, option);
        return res.end(JSON.stringify({ message: "Page topilmadi" }));
    }
});

app.listen(4000, () => {
    console.log("Hospital server 4000-portda ishlayapti");
});
