const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json())
app.use(cors())
const posts = {};
app.post('/events', (req, res) => {
    const event = req.body;
    axios.post('http://posts-clusterip-srv:4000/events', event);
    axios.post('http://comments-srv:4001/events', event);
    axios.post('http://query-service-srv:4002/events', event);
    axios.post('http://moderation-srv:4003/events', event);
    res.send({ status: 'OK' });
});


app.listen(4005, () => {
    console.log('listening to port 4005');
});