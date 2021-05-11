const jsmediatags = require('jsmediatags');
const fs = require('fs')
const path = require('path')
const mp3Duration = require('mp3-duration');

// jsmediatags.read('./downMisic/music.mp3', {
//   onSuccess: function(tag) {
//     console.log(tag);
//     // console.log(picture.toString())
//     // fs.writeFileSync('./downMisic/img.png', Buffer.from(picture))
//   },
//   onError: function(error) {
//     console.log(':(', error.type, error.info);
//   }
// });
console.log('./downMisic/data/musci4.mp3')
jsmediatags.read('./downMisic/data/musci4.mp3', {
  onSuccess: function(tag) {
    console.log(tag);
  },
  onError: function(error) {
    console.log(':(', error.type, error.info);
  }
});


mp3Duration('./downMisic/data/musci4.mp3', function (err, duration) {
  if (err) return console.log(err);
  console.log('Your file is ' + duration + ' seconds long');
});
