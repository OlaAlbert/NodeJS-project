Explanation:

Dependencies: We only import the http module for creating the server.
Database: We define an array called jokesDb to store jokes as objects with properties: title, comedian, year, and id.
Server: We create a server instance using http.createServer.
Request Handling: The callback function handles incoming requests. It extracts relevant information like URL, method, and headers.
CORS: We set CORS headers to allow requests from any origin for development purposes
