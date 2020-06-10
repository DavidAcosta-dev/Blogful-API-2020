const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const  expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', ()=> {

    const expectedKeys = ['title','content','author','id','publishDate'];

    it('should list blog posts on GET', ()=> {
        
        return chai.request(app)
        .get('/blogful')
        .then(res=> {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.at.least(1);

            res.body.forEach(post=> {
                expect(post).to.be.a('object');
                expect(post).to.include.keys(expectedKeys);
            })
            
        })//---end of .then() handler block
        
    })//-------end of it("GET") *


    it('should add a post on POST', ()=> {

        const newBlog = {title: "Tomt",
                         content: "Tomb Raider series needed a reboot badly. Crystal Dynamics made an amazing franchise that needs our love and support for many years to come!",
                         author: "Lara Croft"};

        return chai.request(app)
        .post('/blogful')
        .send(newBlog)
        .then(res=> {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.include.keys(expectedKeys);
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(Object.assign(newBlog, {id: res.body.id, publishDate: res.body.publishDate}));
        });//----end of .then() handler 

    });//---End of it("POST") **


    it('should update items on PUT', ()=> {
        const updatedBlog = {title: "Jojo Rabbit",
                             content: "pretty amazing movie",
                             };

        return chai.request(app)
        .get('/blogful')
        .then(res=> {
            Object.assign(updatedBlog, {id: res.body[0].id, publishDate: res.body[0].publishDate, author: res.body[0].author});
            return chai.request(app)
            .put(`/blogful/${updatedBlog.id}`)
            .send(updatedBlog)
        })//---end of 1st .then()
        .then(res=> {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.deep.equal(updatedBlog);
        })//---end of 2nd .then()

    })//---End of it("PUT") ***


    it('should delete blog post on DELETE', ()=> {
        
        return chai.request(app)
        .get('/blogful')
        .then(res=> {
            return chai.request(app)
            .delete(`/blogful/${res.body[0].id}`);
        })//---end of 1st .then()
        .then(res=> {
            expect(res).to.have.status(204); //only checking for status, not checking if item is really gone from database since we don't have a real database yet.
        })//---end of 2nd .then()

    })//---End of it("DELETE") ***



})//-----------END of TEST SUITE
