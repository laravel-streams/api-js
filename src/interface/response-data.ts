import { fields } from '../types';

export interface IBaseEntry {
    [ key: string ]: any;
}

export interface IBaseStream<ID=any> {
    id?: ID
    handle?: ID
    created_at?: string
    updated_at?: string
    name: string
    description: string
    source: {
        type: string
        [ key: string ]: any
    },
    fields?: any
    rules?: any
    routes?: Array<any>,
    validators?: Array<any>,
    config?: Record<string, any>
    entries?: IBaseEntry[];

    [ key: string ]: any;
}

export interface IEntries {
    [ key: string ]: any;
}

export interface IStreams {
    [ key: string ]: any;
}

export type StreamID = keyof IStreams | string

export interface IBaseField<T extends fields.Type = fields.Type> {
    handle?: string;
    type: T;
    input?: Record<string, any> & {
        type: T
    };
    rules?: any[];
    config?: Record<string, any>;

    [ key: string ]: any;
}


export interface FieldTypes {
    string: string;
    url: string;
    text: string;
    hash: string;
    slug: string;
    email: string;
    markdown: string;
    template: string;
    number: number;
    integer: number;
    float: number;
    decimal: number;
    boolean: boolean;
    array: Array<any>;
    prototype: object;
    object: object;
    image: any;
    file: any;
    datetime: string;
    date: string;
    time: string;
    select: string;
    multiselect: string[];
    collection: Array<any>;
    entry: any;
    entries: any;
    multiple: any;
    polymorphic: any;
    relationship: any;
    color: any;
    [key:string]:any
}

export type FieldType = keyof FieldTypes
