const express = require('express');
const axios = require('../moderation/node_modules/axios');
const cors = require('cors');
const app = express();
app.use(express.json())
app.use(cors())
const posts = {};
app.get('/posts', (req, res) => {

    res.send(posts);
});
app.post('/events', (req, res) => {
    const { type, data } = req.body;
    if (type === 'postCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }
    if (type === 'commentCreated') {
        const { id, content, postId, status } = data;
        posts[postId].comments.push({ id, content, status });
    }
    if (type === 'commentUpdated') {
        const { id, content, postId, status } = data;
        const comment = posts[postId].comments.find(item => {
            return item.id === id;
        });
        comment.status = status;
    }
    console.log(posts);
    res.send({ status: 'OK' });
});


app.listen(4002, () => {
    console.log('listening to port 4002');
});