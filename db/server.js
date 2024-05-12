const http = require('http');

const jokesDb = []; // Our joke database (array of objects)

const server = http.createServer((req, res) => {
  const { url, method, headers } = req;
  const urlParts = url.split('/');

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle different HTTP methods and routes
  if (method === 'GET' && url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(jokesDb));
  } else if (method === 'POST' && url === '/') {
    let jokeData = '';
    req.on('data', (chunk) => {
      jokeData += chunk;
    });
    req.on('end', () => {
      try {
        const newJoke = JSON.parse(jokeData);
        newJoke.id = jokesDb.length ? Math.max(...jokesDb.map((joke) => joke.id)) + 1 : 1;
        jokesDb.push(newJoke);
        res.statusCode = 201; // Created status code for successful POST
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(jokesDb));
      } catch (error) {
        res.statusCode = 400; // Bad request status code for invalid data
        res.end('Invalid joke data');
      }
    });
  } else if (method === 'PATCH' && urlParts.length === 3 && urlParts[1] === 'joke') {
    const jokeId = parseInt(urlParts[2]);
    const jokeIndex = jokesDb.findIndex((joke) => joke.id === jokeId);
    if (jokeIndex !== -1) {
      let updateData = '';
      req.on('data', (chunk) => {
        updateData += chunk;
      });
      req.on('end', () => {
        try {
          const update = JSON.parse(updateData);
          jokesDb[jokeIndex] = { ...jokesDb[jokeIndex], ...update }; // Update specific properties
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(jokesDb[jokeIndex]));
        } catch (error) {
          res.statusCode = 400;
          res.end('Invalid update data');
        }
      });
    } else {
      res.statusCode = 404;
      res.end('Joke not found');
    }
  } else if (method === 'DELETE' && urlParts.length === 3 && urlParts[1] === 'joke') {
    const jokeId = parseInt(urlParts[2]);
    const jokeIndex = jokesDb.findIndex((joke) => joke.id === jokeId);
    if (jokeIndex !== -1) {
      const deletedJoke = jokesDb.splice(jokeIndex, 1)[0];
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(deletedJoke));
    } else {
      res.statusCode = 404;
      res.end('Joke not found');
    }
  } else { // Handle any other unmatched routes
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});