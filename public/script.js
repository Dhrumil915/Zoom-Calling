/*const { text } = require("express");*/

const socket = io('/');
const videoGrid = document.getElementById("video-grid");
const myvideo = document.createElement('video');
myvideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

let myvideostream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {

    myvideostream = stream;
    addVideoStream(myvideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
        connecToNewUser(userId, stream);
    })
    let text = $("input");
// when press enter send message
$('html').keydown(function (e) {
  if (e.which == 13 && text.val().length !== 0) {
      console.log(text.val())
    socket.emit('message', text.val());
    text.val('')
  }
});

socket.on('createMessage', message =>{
    console.log('this comeing from server', message)
    $('.messages').append(`<li class="message"><b>user</b></br>${message}</li>`)
    scrollToBottem();
})


})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)

})



const connecToNewUser = (userId, stream) => {
    console.log(userId);
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}



const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

scrollToBottem = () =>{
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

//Mute video Button
const muteUnmute = () => {
    const enabled = myvideostream .getAudioTracks()[0].enabled;
    if (enabled) {
        myvideostream .getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myvideostream .getAudioTracks()[0].enabled = true;
    }
  }
  
//video top video
  const playStop = () => {
    console.log('object')
    let enabled = myvideostream.getVideoTracks()[0].enabled;
    if (enabled) {
        myvideostream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myvideostream.getVideoTracks()[0].enabled = true;
    }
  }

  const setMuteButton = () => {
    console.log("hiiii")
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
  }

  
  const setUnmuteButton = () => {
    console.log("httt")
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }

  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }