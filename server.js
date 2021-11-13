const http = require('http');
const db = require('./db');
const app = require('./app');


try {
    db.connect()
        .then(() => {
            app.set('port', process.env.PORT || 3000);
            const server = http.createServer(app);
            server.listen(process.env.PORT || 3000);
        })
} catch ( error ) {
    console.log(error);
}

