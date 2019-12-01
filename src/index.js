const app = require('./app');
const http = require('http').Server(app);

const port  = process.env.PORT || 3000;

http.listen(port, () => {
    console.log(`Server is running on port ${port}` );
})
