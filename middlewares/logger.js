const geoip = require('geoip-lite');
const requestIp = require('request-ip');
const useragent = require('useragent');
const fs = require('fs');
const path = require('path');

const logger = (req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const currentDate = new Date().toLocaleString();
        const ip = requestIp.getClientIp(req) || req.headers['x-forwarded-for']?.split(',')[0];
        const geo = geoip.lookup(ip);
        const location = geo ? `${geo.city}, ${geo.region}, ${geo.country}` : 'Unknown location';
        const agent = useragent.parse(req.headers['user-agent']);
        const responseTime = Date.now() - startTime;
        const acceptEncoding = req.headers['accept-encoding'];
        const accept = req.headers['accept'];
        const authorization = req.headers['authorization'];
        const requestId = req.headers['x-request-id'] || 'No request ID';
        const remoteAddress = req.connection.remoteAddress || 'No remote address';
        const protocol = req.protocol;
        const port = req.connection.localPort;
        const xRealIp = req.headers['x-real-ip'] || 'No X-Real-IP';

        const logData = {
            date: currentDate,
            method: req.method,
            status: res.statusCode,
            url: req.url,
            ip: ip,
            location: location,
            userAgent: req.headers['user-agent'],
            referrer: req.headers['referer'] || 'No referrer',
            contentType: req.headers['content-type'] || 'Unknown Content-Type',
            browser: agent.toAgent(),
            os: agent.os,
            responseTime: responseTime + ' ms',
            acceptEncoding: acceptEncoding,
            accept: accept,
            authorization: authorization || 'No Authorization Header',
            requestId: requestId,
            remoteAddress: remoteAddress,
            protocol: protocol,
            port: port,
            xRealIp: xRealIp,
            requestBody: (req.method === 'POST' || req.method === 'PUT') ? JSON.stringify(req.body) : 'No Body',
            queryParams: req.query ? JSON.stringify(req.query) : 'No Query Params',
            cookies: req.cookies ? JSON.stringify(req.cookies) : 'No Cookies'
        };

        const logString = `
            [${logData.date}] ${logData.method} ${logData.status}: ${logData.url}
            IP: ${logData.ip}
            Location: ${logData.location}
            User-Agent: ${logData.userAgent}
            Referrer: ${logData.referrer}
            Content-Type: ${logData.contentType}
            Browser: ${logData.browser}, OS: ${logData.os}
            Response Time: ${logData.responseTime}
            Accept-Encoding: ${logData.acceptEncoding}
            Accept: ${logData.accept}
            Authorization: ${logData.authorization}
            Request ID: ${logData.requestId}
            Remote Address: ${logData.remoteAddress}
            Protocol: ${logData.protocol}
            Port: ${logData.port}
            X-Real-IP: ${logData.xRealIp}
            Request Body: ${logData.requestBody}
            Query Params: ${logData.queryParams}
            Cookies: ${logData.cookies}
            `;

        

        const logFilePath = path.join(__dirname, '../logs', `${new Date().toISOString().split('T')[0]}.txt`);
        fs.appendFile(logFilePath, logString, (err) => {
            if (err) {
                console.error('Error writing log to file', err);
            }
        });
        console.log(`\x1b[42m\x1b[42m[${logData.date}] ${logData.method} ${logData.status}: ${logData.url}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mIP: ${logData.ip}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mLocation: ${logData.location}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mUser-Agent: ${logData.userAgent}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mReferrer: ${logData.referrer}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mContent-Type: ${logData.contentType}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mBrowser: ${logData.browser}, OS: ${logData.os}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mResponse Time: ${logData.responseTime}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mAccept-Encoding: ${acceptEncoding}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mAccept: ${accept}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mAuthorization: ${authorization || 'No Authorization Header'}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mRequest ID: ${requestId}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mRemote Address: ${remoteAddress}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mProtocol: ${protocol}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mPort: ${port}\x1b[0m`);
        console.log(`\x1b[42m\x1b[42mX-Real-IP: ${xRealIp}\x1b[0m`);


        if (req.method === 'POST' || req.method === 'PUT') {
            console.log(`Request Body: ${JSON.stringify(req.body)}`);
        }
        const queryParams = req.query;
        if (queryParams) {
            console.log(`\x1b[42m\x1b[42mQuery Params: ${JSON.stringify(queryParams)}\x1b[0m`);
        }
        const cookies = req.cookies || 'No cookies';
        if (cookies) {
            console.log(`\x1b[42m\x1b[42mCookies: ${JSON.stringify(cookies)}`);
        }
    });
    
    next();
};

module.exports = logger;
