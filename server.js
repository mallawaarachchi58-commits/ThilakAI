const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

  if (req.url === "/" && req.method === "GET") {

    fs.readFile("index.html", (err, data) => {
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      res.end(data);
    });

  } else if (req.url === "/chat" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {

      let message = JSON.parse(body).message;
      let text = message.toLowerCase();

      let reply;

      if (text.includes("hi") || text.includes("hello")) {
        reply = "Hello! How can I help you?";
      }
      else if (text.includes("who are you") || message.includes("ඔයා කවුද")) {
        reply = "මම Thilak AI Assistant.";
      }
      else if (text.includes("how are you") || message.includes("කොහොමද")) {
        reply = "I am fine. Thank you!";
      }
      else {
        reply = "I received: " + message;
      }

      res.writeHead(200, {
        "Content-Type": "application/json"
      });

      res.end(JSON.stringify({
        reply: reply
      }));

    });

  } else {

    res.writeHead(404);
    res.end("Not Found");

  }

});


server.listen(3000, () => {
  console.log("Thilak AI running on port 3000");
});
