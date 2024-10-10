//The idea behind this code is to seperate the
//server code from the express middlewares
const http = require('http');

const app = require('./app');

const connectDB = require('./Database/connect');
const router = require('./routes/auth');

const PORT = process.env.PORT || 8009;

const server = http.createServer(app);
app.use('/', router);

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI)
     //server
      app.listen(PORT,() => { 
      console.log(`Server is listening on port ${PORT}`);
    })
    } catch (error) {
      console.log(error);
    }
  };

  start();
// async function startServer(){
//   server.listen(PORT, () => {
//   conso.log(`listening on port ${PORT}...`);
// });
// }

// startServer();

