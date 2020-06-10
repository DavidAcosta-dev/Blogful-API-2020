const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

//adding some default data to work with 

BlogPosts.create("Ice Climbing", "ice climbing is pretty fun, you really should give it a try", "Lara Croft");
BlogPosts.create("How to make Horchata", ["step1: boil rice","step2: strain milk", "step3: add cinnamon, ice and dates for sweetness"], "Nathaniel Acosta");

router.get('/', (req,res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req,res) => {
    if(!req.body.title && !req.body.content && !req.body.author){
        return res.status(400).send("Must include, title, content, and author");
    }
    const {title, content, author} = req.body;
    const blogPost = BlogPosts.create(title, content, author);
    res.status(201).json(blogPost);
})

router.put('/:id', jsonParser, (req,res) => {
    if(req.params.id !== req.body.id){
        res.status(400).send("ERROR: either your id doesn't exist or id doesn't match with the one in the url");
    }
    BlogPosts.update(req.body);
    res.status(200).send(req.body);
})

router.delete('/:id', (req,res) => {
    if(!BlogPosts.posts.find(post=> post.id === req.params.id ) ){
        return res.status(400).send("ERROR: id provided in url does not match id of any post in BlogPosts.posts");
    }
    console.log("deleting: ", BlogPosts.posts.find(post=> post.id === req.params.id));
    BlogPosts.delete(req.params.id);
    res.status(204).end();
})

module.exports = router;

