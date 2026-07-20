const http = require("http");
const fs = require("fs");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const server = http.createServer(async (req, res) => {

  if (req.url === "/" && req.method === "GET") {

    fs.readFile("index.html", (err, data) => {
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      res.end(data);
    });

  }  else if (req.url === "/chat" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {

      try {

        const message = JSON.parse(body).message;

        const response = await client.responses.create({
          model: "gpt-4.1-mini",
          input: message
        });

        res.writeHead(200, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          reply: response.output_text
        }));

      } catch (error) {

        console.error(error);

        res.writeHead(500, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          reply: "Server Error"
        }));

      }

    });

  } else {

    res.writeHead(404);
    res.end("Not Found");

  }

});

server.listen(3000, () => {
  console.log("Thilak AI running on port 3000");
});

