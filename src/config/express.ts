import express from "express"
import bodyParser from "body-parser"
import allowCrossOriginRequestsMiddleware from "../app/middleware/cors.middleware"
import Logger from "./logger"
import {rootUrl} from "../app/routes/base.routes";

export default () => {
    const app = express();

    // Middleware
    app.use(allowCrossOriginRequestsMiddleware);
    app.use(bodyParser.json());
    app.use(bodyParser.raw({type: 'text/plain'}));
    app.use(bodyParser.raw({type: ['image/*'], limit: '5mb'}));

    // Debug
    app.use((req, res, next) => {
        if(req.path !== '/'){
            Logger.http(`##### ${req.method} ${req.path} #####`);
        }
        next();
    });

    app.get('/heartbeat', (req, res) => {
        res.send({'message': 'I\'m alive!'});
    });

    app.get(rootUrl + '/heartbeat', (req, res) => {
        res.send({'message': 'I\'m alive!'});
    });

    // ROUTES
    require('../app/routes/backdoor.routes')(app);
    require('../app/routes/user.routes')(app);
    require('../app/routes/petition.routes')(app);

    return app;
}