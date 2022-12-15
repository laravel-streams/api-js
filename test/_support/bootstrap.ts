// import 'chai/register-assert';  // Using Assert style
// import 'chai/register-expect';  // Using Expect style
// import 'chai/register-should';  // Using Should style
//
// export function bootstrap(): void {
//
// }
// import 'chai/register-assert'; // Using Assert style
// import 'chai/register-expect'; // Using Expect style
// import 'chai/register-should'; // Using Should style
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import btoa from 'btoa';
import { JSDOM } from 'jsdom';
import { getEnv } from './utils';
import 'whatwg-fetch';

global.assert = chai.assert;
global.expect = chai.expect;
// @ts-ignore
global.should = chai.should();


const env = getEnv();

const dom             = new JSDOM(``, {
    url                 : env.get('APP_URL', 'http://localhost') + '/' + env.get('STREAMS_API_PREFIX', 'api'),
    contentType         : 'text/html',
    includeNodeLocations: true,
    storageQuota        : 10000000,
});
// Object.assign(dom.window,require('node-fetch/src/index.js'))
// Object.assign(global,require('node-fetch/src/index.js'))
global.XMLHttpRequest = dom.window.XMLHttpRequest;
global.btoa           = btoa;
global.location       = dom.window.location;

global['window'] = dom.window as any

chai.use(sinonChai);

export function bootstrap(): any {
    return { chai, sinon, env };
}

export function instanceBootstrap(): any {
    return { chai, sinon, env };
}

export function getUtils() {
    return { chai, sinon, env, dom };
}

export { chai, sinon, env, dom };
