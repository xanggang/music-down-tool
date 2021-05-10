const jsmediatags = require('jsmediatags');
const fs = require('fs')
const path = require('path')

jsmediatags.read('./downMisic/music.mp3', {
  onSuccess: function(tag) {
    console.log(tag);
    const picture = tag.tags.picture.data
    // console.log(picture.toString())
    fs.writeFileSync('./downMisic/img.png', Buffer.from(picture))
  },
  onError: function(error) {
    console.log(':(', error.type, error.info);
  }
});

