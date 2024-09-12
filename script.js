


let currentSong = new Audio()
let songs;

document.title = 'Spotify - Web Player: Music for everyone'
let currentFolder;

function formatTime(seconds) {
  // If seconds is NaN, return "00:00"
  if (isNaN(seconds)) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatCurrentTimeAndDuration(currentTime, duration) {
  const formattedCurrentTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);
  return `${formattedCurrentTime}/${formattedDuration}`;
}



async function getSongs(folder) {
  currentFolder = folder

  let a = await fetch(`http://192.168.1.2:8080/assets/ashiqui/${folder}/`)

  let response = await a.text()
  let div = document.createElement("div")
  div.innerHTML = response
  let as = div.getElementsByTagName("a")
  songs = []
  

  for (let i = 0; i < as.length; i++) {
    const element = as[i];

    if (element.textContent.endsWith(".mp3")) {

      songs.push(decodeURIComponent(element.href.split(`/${folder}/`)[1].replaceAll("%20", " ")))


    }

  }


  
  let appendGaane = document.querySelector(".gaanoKiList").getElementsByTagName("ul")[0]
appendGaane.innerHTML = "";

  for (const song of songs) {

    appendGaane.innerHTML += `<li><div class="firstforSongIcon"><img src="assets/music.svg" alt="">
            <div class="info">
                <div class="songname">${song}</div>
                <div class="artist"></div>
            </div></div>
            <div class="playNow">

                <span>Play Now</span>
                <img style="filter: brightness(0) invert(1); font-size:0.8em;" class="listPlay" src="assets/playBtn.svg" alt="">
            </div></li>`



    Array.from(document.querySelector(".gaanoKiList").getElementsByTagName("li")).forEach(function (e) {

      e.addEventListener("click", function (f) {

        playTheMusic(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML.trim())

    

      })

    })
  }
  
  return songs

}


function playNextSong() {
  let currentIndex = songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]));
  if (currentIndex + 1 < songs.length) {
      playTheMusic(songs[currentIndex + 1]);
  } else {
      playTheMusic(songs[0]);
  }
}


function playTheMusic(track, pause = false) {

  // let audio = new Audio("/assets/ashiqui/songs/" + track)
  console.log(`Setting audio source to: ${currentSong.src}`);

  currentSong.src = `/assets/ashiqui/${currentFolder}/` + decodeURI(track)

  if (!pause) {

    currentSong.play()
    centerPlay.src = "assets/pause.svg"

  }


  



  document.querySelector(".musicName").innerHTML = track

  currentSong.addEventListener("ended", playNextSong);
  // document.querySelector(".songTime").innerHTML = currentSong.


}


async function albumsNames() {
 
  let a = await fetch(`http://192.168.1.2:8080/assets/ashiqui/songs/`)
  let response = await a.text()
  let div = document.createElement("div")
  div.innerHTML = response

  let anchors = div.getElementsByTagName("a")
  
 let array = Array.from(anchors)
for (let i = 0; i < array.length; i++) {
  const e = array[i];
  

  if(e.href.includes("/songs")){

    let folders = e.href.split("/").splice(-2)[0]
    
    
let albumCards = document.querySelector(".albumsContainer")
    let a = await fetch(`http://192.168.1.2:8080/assets/ashiqui/songs/${folders}/info.json`)
    let response = await a.json()

    albumCards.innerHTML = albumCards.innerHTML + ` <div data-folder="${folders}" class="albumCard">
        <img class="thumb" src="assets/ashiqui/songs/${folders}/cover.jpg" alt="">
        <img class="playBtn" src="/assets/playBtn.svg" alt="">
        <h4>${response.title}</h4>
        <p>${response.metaDes}</p>
    </div>`
    
  }


 }


 
 Array.from(document.getElementsByClassName("albumCard")).forEach(function (e) {
  e.addEventListener("click", async function (f) {

    songs = await getSongs(`songs/${f.currentTarget.dataset.folder}`)

    

  playTheMusic(songs[0])
  })

})

}
albumsNames()




async function main() {

  songs = await getSongs("songs/second")

  playTheMusic(songs[0], true)




  let centerPlay = document.querySelector("#centerPlay")


  centerPlay.addEventListener("click", function (e) {

    if (currentSong.paused) {
      currentSong.play()
      centerPlay.src = "assets/pause.svg"

    

    }
    else {

      currentSong.pause()
      centerPlay.src = "assets/playBtn.svg"


    }


  })







  currentSong.addEventListener("timeupdate", function () {

   

    document.querySelector(".songTime").innerHTML = formatCurrentTimeAndDuration(currentSong.currentTime, currentSong.duration)

    document.querySelector(".circule").style.left = (this.currentTime / this.duration) * 100 + "%"



  })


  document.querySelector(".seekbar").addEventListener("click", function (e) {


    let updateCrtime = (e.offsetX / e.target.getBoundingClientRect().width) * 100

  
    document.querySelector(".circule").style.left = updateCrtime + "%"

    currentSong.currentTime = ((currentSong.duration) * updateCrtime) / 100
  })


  document.querySelectorAll(".playBtn").forEach(function (e) {
    e.addEventListener("click", function (x) {
      playTheMusic(songs[0])

    })

  })



  document.querySelector(".hamburgerDiv").addEventListener("click", function (e) {
   
    document.querySelector(".section1").style.left = "0px"
    document.querySelector(".section1").style.zIndex = "100000"
   
    
    document.querySelector(".plusIco").src = "/assets/close.svg"
    document.querySelector(".hamburgerImg").src = "/assets/close.svg"
    document.querySelector(".hamburgerImg").style.height = "1.5em"
    document.querySelector(".hamburgerImg").style.filter = "brightness(0) invert(1)";
    document.querySelector(".section2").style.opacity = "0.1"
    document.querySelector("nav").style.opacity = "0.1"

  })

  document.querySelector(".plusIco").addEventListener("click", function (f) {



    document.querySelector(".section1").style.left = "-300%"
    document.querySelector(".section2").style.opacity = "2"
    document.querySelector(".hamburgerImg").src = "/assets/humberger.svg"
    document.querySelector("nav").style.opacity = "2"




  })




  previous.addEventListener("click", function (e) {
 


    let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]))
    if (index - 1 >= 0) {
      playTheMusic(songs[index - 1])
    }
    else {

      playTheMusic(songs[songs.length - 1]);
    }

  })

  next.addEventListener("click", function () {

    let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]))


    if (index + 1 < songs.length) {
      playTheMusic(songs[index + 1])

    }
    else {
      playTheMusic(songs[0]);
    }
 

  })

}
main()









