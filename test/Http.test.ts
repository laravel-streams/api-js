import { params, skip, suite, test } from '@testdeck/mocha';
import { TestCase } from './TestCase';
import { Http, HTTPError } from '../src';

import f from 'faker';

@suite('Http')
export class HttpTest extends TestCase {
    protected get http(): Http {return this.getHttp();}

    @test('resolve HTTP instance')
    async resolveHttpInstance() {
        const http = this.getHttp();
        http.should.be.instanceof(Http);
    }

    @test('getting nonexistant stream should result in HTTPError')
    async gettingNonexistantStreamShouldResultInHttperror() {
        const http = await this.getHttp();
        try {
            const stream = await http.getStream('users2');
        } catch (e) {
            e.should.be.instanceof(HTTPError);
        }
    }

    @skip
    @test('postStream')
    async postStreamTest() {
        this.fs.project.deleteStream('clients');
        const http             = await this.getHttp();
        const { data: stream } = await http.postStream(this.getStreamDefinition('clients'));

        this.fs.project.hasStream('clients').should.eq(true);

        stream.should.have.property('data');
        stream.data.should.have.property('id');
        stream.should.have.property('links');
        stream.should.have.property('meta');
        stream.should.have.property('errors');

        const response = await http.deleteStream(stream.data.id);
        response.data.should.eq('');
        this.fs.project.hasStream('clients').should.eq(false);
    }

    @test('getStream')
    @params({ name: 'clients' }, 'get stream "clients"')
    @params({ name: 'posts' }, 'get stream "posts"')
    async getStreamTest({ name }: { name: string }) {
        this.fs.fixtures.copyStream(name, this.fs.project);
        const stream = await this.http.getStream(name);
        stream.should.have.property('data');
        this.fs.project.deleteStream(name);
    }

    @test('patchStream')
    async patchStreamTest() {
        this.fs.fixtures.copyStream('posts', this.fs.project);
        let res = await this.http.getStream('posts');
        res.should.have.property('data');
        res.data.data.description = 'foobarfoofoo';
        res                       = await this.http.patchStream('posts', res.data.data);
        res.should.have.property('data');
        res.data.data.description.should.equal('foobarfoofoo');
        this.fs.project.getStream('posts').get('description').should.eq('foobarfoofoo');
        this.fs.project.deleteStream('posts');
    }

    @test('putStream')
    async putStreamTest() {
        this.fs.project.deleteStream('foobars');
        await this.http.putStream('foobars', this.getStreamDefinition('foobars'));
        this.fs.project.hasStream('foobars').should.eq(true);
    }

    @test('deleteStream')
    async deleteStreamTest() {
        this.fs.fixtures.copyStream('posts', this.fs.project);
        let response = await this.http.deleteStream('posts');
        this.fs.project.hasStream('posts').should.eq(false);
    }

    @test('getEntries')
    async getEntriesTest() {
        this.fs.fixtures.copyStream('posts', this.fs.project);
        let response = await this.http.getEntries('posts');
        response.ok.should.eq(true);
        response.data.data.length.should.eq(20);
        let entries: Array<{ space: string }>      = response.data.data;
        let localEntries: Array<{ space: string }> = this.fs.project.getStreamEntries('posts');
        let spaces                                 = entries.map(entry => entry.space);
        for ( const entry of localEntries ) {
            spaces.includes(entry.space).should.eq(true);
        }
        this.fs.project.deleteStream('posts');
    }

    @test('postEntry')
    async postEntryTest() {
        this.fs.fixtures.copyStream('clients', this.fs.project);
        const http                                                                   = await this.getHttp();
        const data: any                                                              = {
            id: 5, // @todo ids should be autogenerated
            name : f.name.firstName(),
            email: '',
            age  : 55,
        };
        data.email                                                                   = f.internet.email(data.name);
        const entry                                                                  = await http.postEntry('clients', data);
        let entries: Record<string, { id: number, name: string, email: string, age: number }> = this.fs.project.getStreamEntries('clients');
        let found = Object.values(entries).find(e => e.id===data.id&& e.email === data.email && e.age === data.age && e.name === data.name)
        found.should.not.be.undefined;
        found.email.should.eq(data.email)
        this.fs.project.deleteStream('clients')
    }

    @skip
    @test('postExistingIdEntry')
    async postExistingIdEntryTest() {
        this.fs.fixtures.copyStream('clients', this.fs.project);
        let fstream = this.fs.project.getStream('clients');
        fstream.put('5', {
            id: 5, // @todo ids should be autogenerated
            name : 'richard',
            email: 'richard@gmail.com',
            age  : 55,
        })

        const http                                                                   = await this.getHttp();
        const data: any                                                              = {
            id: 5, // @todo ids should be autogenerated
            name : 'robert',
            email: 'robert@gmail.com',
            age  : 55,
        };
        const entry                                                                  = await http.postEntry('clients', data);
        let entries: Record<string, { id: number, name: string, email: string, age: number }> = this.fs.project.getStreamEntries('clients');
        let found = Object.values(entries).find(e => e.id===data.id&& e.email === data.email && e.age === data.age && e.name === data.name)
        found.should.not.be.undefined;
        found.email.should.eq(data.email)
        this.fs.project.deleteStream('clients')
    }

    @test('postEntryWithoutId')
    async postEntryWithoutId() {
        this.fs.fixtures.copyStream('clients', this.fs.project);
        this.fs.project.deleteStreamData('clients')
        const http                                                                   = await this.getHttp();
        const data: any                                                              = {
            name : 'robert',
            email: 'robert@gmail.com',
            age  : 55,
        };
        const entry                                                                  = await http.postEntry('clients', data);
        let entries: Record<string, { id: number, name: string, email: string, age: number }> = this.fs.project.getStreamEntries('clients');
        let found = Object.values(entries).find(e => e.id===data.id&& e.email === data.email && e.age === data.age && e.name === data.name)
        found.should.not.be.undefined;
        found.email.should.eq(data.email)
        this.fs.project.deleteStream('clients')
    }
    @test('getEntry') @skip(true)
    async getEntryTest() {


    }

    @test('patchEntry') @skip(true)
    async patchEntryTest() {}

    @test('putEntry') @skip(true)
    async putEntryTest() {}

    @test('deleteEntry') @skip(true)
    async deleteEntryTest() {}

}
