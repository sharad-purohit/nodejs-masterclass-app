/**
 * Primary file for the API
 */

// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// Server should respond to all the request with a string
const server = http.createServer((req, res) => {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if there is any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", data => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    // Choose the handler this request should go to or the not found handler if route not found
    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFoundHandler;

    // Construct the data object to be sent to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    };

    // Route the request
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by handler or default to 200
      statusCode = typeof statusCode === "number" ? statusCode : 200;

      // Use the payload called back by handler or default to empty object
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      // return the response
      res.writeHead(statusCode);
      // Send the response
      res.end(payloadString);

      console.log("Returning the response: ", payloadString);
    });

    // Log the request path
    console.log(
      "Request recieved on path: ",
      trimmedPath,
      "with this method: ",
      method,
      " and with these query string parameters: ",
      queryStringObject
    );
    console.log("Request came with headers: ", headers);

    console.log("Request is recieved with this payload: ", buffer);
  });
});

// Start the server and have it listen on the port 3000
server.listen(3000, () => {
  console.log("Server is listening on port 3000 now");
});

// Define Handlers

const handlers = {};

// Sample Handler
handlers.sampleHandler = (data, callback) => {
  // Callback a http status code and a payload object
  callback(406, { name: "Sample Handler" });
};

// Not found handler
handlers.notFoundHandler = (data, callback) => {
  callback(404);
};

// Define a Request Router
const router = {
  sample: handlers.sampleHandler
};
