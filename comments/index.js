const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json())
app.use(cors())
const commentsByPostId = {};
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});
app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commentId, content, status: 'pending' });
    commentsByPostId[req.params.id] = comments;
    await axios.post('http://event-bus-srv:4005/events',
        {
            type: 'commentCreated', data:
                { id: commentId, content, postId: req.params.id, status: 'pending' }
        });

    res.status(201).send(comments)
});
app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    const { id, postId, content, status } = data;

    if (type === 'commentModerated') {
        const comment = commentsByPostId[postId].find(item => {
            return item.id === id;
        });
        comment.status = status;
        await axios.post('http://event-bus-srv:4005/events',
            {
                type: 'commentUpdated', data:
                    { id, content, postId, status }
            });
    }

    console.log('recieved');
    res.send({});
});
app.use(function (req, res, next) {
    res.status(404);
    res.send('404: File Not Found');
});


app.listen(4001, () => {
    console.log('listening to port 4001');
});