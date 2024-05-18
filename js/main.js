const album_songs = document.getElementById("album-songs")
const album_section = document.getElementById("album-section")
const songName = document.getElementById("songName").querySelector("marquee")
const playerTimer = document.getElementById("timer")
const playerBar = document.getElementById("slider")
const album_name = document.getElementById("right-side-album-name")
const r_album_songs_count = document.getElementById("r_album-songs-count")
const l_album_songs_count = document.getElementById("l_album-songs-count")
const player_controller = document.getElementById("player-controller")

// variable for next button
let songArray = [];


//Hide the music controller
player_controller.style.display = "none"
//Adjust the music controller height
album_songs.style.height = "60vh"

album_songs.innerHTML = "<span>Select an album...</span>"

let current_song = null;
let duration;
let songCard;
main2()

// CONVERTING SONG DURATION TO IN THIS FORM 00:00 
function formatDuration(seconds) {
    // Calculate minutes and remaining seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // Add leading zeros if necessary
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return formatted duration
    return `${formattedMinutes}:${formattedSeconds}`;
}


//BELOW SCRIPT WILL GET THE SONG FROM THE FOLDER
async function getSongs(folder) {
    try {
        let songs = await fetch(`http://127.0.0.1:5500/albums/${folder}`);
        
        if (!songs.ok) {
            throw new Error('Failed to fetch songs');
        }
        let response = await songs.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");


        // Remove the first three elements (if they are headers or something)
        songArray = Array.from(as).slice(4);
        r_album_songs_count.innerHTML = `Total Song - ${songArray.length}`;

        return songArray;
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}
//BELOW SCRIPT WILL GET THE ALBUM FROM THE FOLDER
async function getAlbums() {
    try {
        let albums = await fetch("http://127.0.0.1:5500/albums");
        if (!albums.ok) {
            throw new Error('Failed to fetch albums');
        }
        let response = await albums.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");

        // Remove the first three elements (if they are headers or something)
        let albumArray = Array.from(as).slice(3);

        return albumArray;
    } catch (error) {
        console.error('Error fetching album:', error);
        return [];
    }
}

//BELOW SCRIPT WILL DISPLAY THA SONG OF A SPECIFIC FOLDER
async function main1(folder) {
    // Clear previous songs
    album_songs.innerHTML = '';

    // Show loading indication
    album_songs.innerText = 'Loading Songs...';

    // Getting songs list
    allSong = await getSongs(folder);


    // Clear loading indication
    album_songs.innerText = '';

    let songCount = 1;

    allSong.forEach(async (song) => {
        let audio = new Audio(song.href);


        // Add event listener to get the duration when the audio metadata is loaded
        audio.addEventListener('loadedmetadata', function () {
            duration = formatDuration(audio.duration);


            songCard = `<div class="album-song" id="${song}" onclick = "play(this.id)">
            <div class="song-details">
            <div id="song-name">${song.title.replace("320 Kbps.mp3", "")}</div>
            <div id="song-duration">${duration}</div>
            <button><img src="icon/play-round-icon.webp" alt=""></button>
            </div>
            </div>`;

            album_songs.innerHTML += songCard;
            songCount++;
        });
        // Start loading the audio
        audio.load();

    });
}
//BELOW SCRIPT WILL DISPLAY THE ALBUM OF A SPECIFIC FOLDER
async function main2() {
    // Clear previous songs
    album_section.innerHTML = '';

    // Show loading indication
    album_section.innerText = 'Loading albums...';

    // Getting songs list
    let allAlbums = await getAlbums();

    // Clear loading indication
    album_section.innerText = '';

    albumCount = 1


    allAlbums.forEach(async (album) => {
        let albumCard = `<div class="album" id="album-${albumCount}" onclick = "folder(this.id)">
        <span><img src="icon/bluray-disc-icon.webp" alt=""></span>
        <div class="album-details">
            <div id="album-name">${album.title}</div>
            <div id="l_album-songs-count" class="l_album-songs-count">Album</div>
        </div>
        <button title="Play"><img src="icon/music-icon.webp" alt=""></button>
    </div>`

        albumCount++;
        album_section.innerHTML += albumCard;

    })
}

//SCRIPT FOR MAKING A FOLDER SYSTEM 
async function folder(albumID) {
    const album = document.getElementById(`${albumID}`)
    album_name.innerHTML = album.childNodes[3].childNodes[1].innerHTML;

    const folder = album.querySelector("#album-name").innerHTML
    await main1(folder)
}

//SCRIPT FOR MAKING A PLAY SYSTEM (ACTIVE THE PLAY BUTTON IN THE SONG CARD)
async function play(songID) {

   
    //Show the music controller
    player_controller.style.display = "flex"

    // adjust the height of the sons section 
    album_songs.style.height = "50vh"

    // Create a new audio element for the selected song
    let song = new Audio(songID);

    // Pause the currently playing song if there is one
    if (current_song) {
        current_song.pause();
    }

    // Assign the new song to current_song
    current_song = song;

    // Change the song name in music controller 
    songName.innerHTML = document.getElementById(`${songID}`).querySelector("#song-name").innerHTML;


    // Update the player timer with the current time and duration
    current_song.addEventListener('timeupdate', () => {
        // Calculate the current time and duration of the song
        let currentTime = formatDuration(current_song.currentTime);
        let totalDuration = formatDuration(current_song.duration);

        // Update the player timer with the current time and duration
        playerTimer.innerHTML = `${currentTime} / ${totalDuration}`;

        // Update the progress bar with the current time and duration
        playerBar.value = current_song.currentTime / current_song.duration * 100;

        //Update the current time with the progress bar and duration
        playerBar.addEventListener('input', () => {
            current_song.currentTime = playerBar.value / 100 * current_song.duration;
        });
    });

    current_song.play();

}

//STYLING FOR PLAYER SECTION TO CONTROL THE MUSIC PLAY
// STYLING FOR PLAYER SECTION TO CONTROL THE MUSIC PLAY
const playBtn = document.querySelector('#playBtn');
const pauseBtn = document.querySelector('#pauseBtn');
const nextBtn = document.querySelector('#nextBtn');
const previousBtn = document.querySelector('#previusBtn');

// Add event listener to play button
playBtn.addEventListener('click', () => {
    playBtn.classList.toggle("display-none")
    pauseBtn.classList.toggle("display-none")
    // Check if there is a currently playing song
    if (current_song) {
        current_song.play();
    }
});

// Add event listener to pause button
pauseBtn.addEventListener('click', () => {
    playBtn.classList.toggle("display-none")
    pauseBtn.classList.toggle("display-none")
    // Check if there is a currently playing song
    if (current_song) {
        current_song.pause();
    }
});

// Add an event listener to the search button and show the song results
const searchBtn = document.getElementById("searchBtn")
const searchBox = document.getElementById("searchBox")

searchBox.value = "" //will reset search box after every refresh

searchBtn.addEventListener('click', async () => {
    album_name.innerHTML = "You search results for " + searchBox.value
    album_songs.innerHTML = " "
    let searchAlbums = await getAlbums()
    searchAlbums.forEach(async (album) => {
        try {
            let response = await fetch(`http://127.0.0.1:5500/albums/${album.title}`);
            let searchAlbum = await response.text();
            let div = document.createElement("div");
            div.innerHTML = searchAlbum;
            let as = div.getElementsByTagName("a");
            let songArray = Array.from(as).slice(4);
            // console.log(songArray);
            let searchValue = searchBox.value.toLowerCase();

            songArray.forEach((song) => {

                if (song.textContent.toLowerCase().includes(searchValue)) {
                    let searchSongCard = `<div class="album-song" id="${song}" onclick = "play(this.id)">
                    <div class="song-details">
                    <div id="song-name">${song.title.replace("320 Kbps.mp3", "")}</div>
                    <button><img src="icon/play-round-icon.webp" alt=""></button>
                    </div>
                    </div>`;

                    album_songs.innerHTML += searchSongCard;

                } else {
                    console.log("Nothings!");
                }
            })

        } catch (error) {
            console.error("Error fetching album:", error);
        }
    });



})

nextBtn.addEventListener('click', function(){
    // Find the index of the current song in the songArray
    let currentIndex = songArray.findIndex(song => song.href === current_song.src);
    console.log(currentIndex);

    // Check if there is a next song in the array
    if (currentIndex < songArray.length - 1) {
        // Pause the current song
        current_song.pause();

        // Play the next song
        play(songArray[currentIndex + 1].href);
    } else {
        // If there is no next song, play the first song in the array
        play(songArray[0].href);
    }
});

// Add an event listener to the previous button
previousBtn.addEventListener('click', function(){
    // Find the index of the current song in the songArray
    let currentIndex = songArray.findIndex(song => song.href === current_song.src);

    // Check if there is a previous song in the array
    if (currentIndex > 0) {
        // Pause the current song
        current_song.pause();

        // Play the previous song
        play(songArray[currentIndex - 1].href);
    } else {
        // If there is no previous song, play the last song in the array
        play(songArray[songArray.length - 1].href);
    }
});

// http://127.0.0.1:5500/albums/Saurav/Gali%20Gali%20Kgf%20Chapter%201%20320%20Kbps.mp3
// /albums/Nora%20Fetehi/Dilbar%20Arabic%20Nora%20Fatehi%20320%20Kbps.mp3"


