
import { Middleware, MiddlewareOptions } from './Middleware';
import { ClientResponse } from '../types';
import { Client } from '../Client';


export interface ResponseDataMiddlewareOptions extends MiddlewareOptions {}
export class ResponseDataMiddleware extends Middleware<ResponseDataMiddlewareOptions> {
    static defaultOptions: ResponseDataMiddlewareOptions = {};
    public async response(response: ClientResponse, client: Client): Promise<ClientResponse> {
        const request = response.request;
        if ( request.isResponseType('arraybuffer') ) {
            response.data = await response.arrayBuffer();
        } else if ( request.isResponseType('blob') ) {
            response.data = await response.blob();
        } else if ( request.isResponseType('document') ) {
            response.data = await response.formData();
        } else if ( request.isResponseType('json') ) {
            response.data = await response.json();
        } else if ( request.isResponseType('stream') ) {
            response.data = await response.body;
        } else if ( request.isResponseType('text') ) {
            response.data = await response.text();
        }
        return response;
    }
}