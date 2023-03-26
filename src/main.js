const downloadVideo = require('./download');
const convertVideoToAudio = require('./convert');
const transcribeAudioAndSaveToFile = require('./transcribe');
const fs = require('fs');
require('dotenv').config();

const videoUrl = 'https://www.youtube.com/watch?v=RmEUBS5wT10';

async function main() {
  try {
    console.log('Starting video download...')
    const videoFileName = 'test.mp4';
    const tempVideoPath = await downloadVideo(videoUrl, videoFileName);
    console.log('Video downloaded...')

    console.log('Starting audio conversion...')
    const tempAudioPath = await convertVideoToAudio(tempVideoPath);
    console.log('Audio conversion complete!')
    
    console.log('Starting transcription...')
    await transcribeAudioAndSaveToFile(tempAudioPath, videoFileName);
    fs.unlinkSync(tempAudioPath); // remove the temporary audio file
    console.log('Transcription complete!');
  } catch (error) {
    console.error(error);
  }
}

main();