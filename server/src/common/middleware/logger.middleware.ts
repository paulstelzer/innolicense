import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    resolve(...args: any[]): MiddlewareFunction {
        return (req, res, next) => {
            console.log(`[${args}] Middleware...`); // [ApplicationModule] Request...
            console.log('Path', req.route.path);
            console.log('Path', req.route.path);
            next();
        };
    }
}



export function logger(req, res, next) {
    console.log(`Request`, req.url);
    //console.log('body', req.body);
    next();
};