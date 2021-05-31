const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json())
app.use(cors())
const posts = {};
app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    if (type === 'commentCreated') {
        const { id, content, postId, } = data;
        const status = content.includes('orange') ? 'rejected' : 'approved';
        await axios.post('http://event-bus-srv:4005/events',
            {
                type: 'commentModerated', data:
                    { id, content, postId, status }
            });
    }

    console.log(posts);
});


app.listen(4003, () => {
    console.log('listening to port 4003');
});