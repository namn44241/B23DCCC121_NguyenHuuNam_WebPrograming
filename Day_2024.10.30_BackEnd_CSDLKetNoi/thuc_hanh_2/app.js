const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// Middleware để parse request bodies
app.use(express.json());

// GET: Trả về danh sách các video
app.get('/videos', (req, res) => {
  const videoData = fs.readFileSync(path.join(__dirname, 'video.txt'), 'utf8');
  res.json(JSON.parse(videoData));
});

// POST: Tạo mới một video
app.post('/videos', (req, res) => {
  const newVideo = req.body;
  const videoData = fs.readFileSync(path.join(__dirname, 'video.txt'), 'utf8');
  const videos = JSON.parse(videoData);
  videos.push(newVideo);
  fs.writeFileSync(path.join(__dirname, 'video.txt'), JSON.stringify(videos));
  res.status(201).json(newVideo);
});

// PUT: Cập nhật thông tin của một video
app.put('/videos/:id', (req, res) => {
  const id = req.params.id;
  const updatedVideo = req.body;
  const videoData = fs.readFileSync(path.join(__dirname, 'video.txt'), 'utf8');
  const videos = JSON.parse(videoData);
  const videoIndex = videos.findIndex(v => v.id == id);
  if (videoIndex !== -1) {
    videos[videoIndex] = updatedVideo;
    fs.writeFileSync(path.join(__dirname, 'video.txt'), JSON.stringify(videos));
    res.json(updatedVideo);
  } else {
    res.status(404).json({ error: 'Video not found' });
  }
});

// DELETE: Xóa một video
app.delete('/videos/:id', (req, res) => {
  const id = req.params.id;
  const videoData = fs.readFileSync(path.join(__dirname, 'video.txt'), 'utf8');
  const videos = JSON.parse(videoData);
  const videoIndex = videos.findIndex(v => v.id == id);
  if (videoIndex !== -1) {
    const deletedVideo = videos.splice(videoIndex, 1)[0];
    fs.writeFileSync(path.join(__dirname, 'video.txt'), JSON.stringify(videos));
    res.json(deletedVideo);
  } else {
    res.status(404).json({ error: 'Video not found' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});