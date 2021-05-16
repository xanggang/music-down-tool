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
console.log('./downMisic/data/60054701958132127.mp3')
jsmediatags.read('./downMisic/data/60054701958132127.mp3', {
  onSuccess: function(tag) {
    console.log(tag);
  },
  onError: function(error) {
    console.log(':(', error.type, error.info);
  }
});
