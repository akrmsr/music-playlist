document.addEventListener('DOMContentLoaded', () => {
    // --- Sign-Up Page Logic ---
    const signupForm = document.getElementById('signupForm');

    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            // Simple front-end validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (name === '' || email === '' || password === '') {
                alert('Please fill out all fields to sign up.');
                event.preventDefault(); // stop normal submit
            } else {
                // Optional success message, then let the form action navigate
                alert('Sign up successful! Redirecting to your playlist.');
                // No need to manually redirect—form action handles it.
                // If you prefer JS redirect instead of <form action>, uncomment:
                // event.preventDefault();
                // window.location.href = 'playlist.html';
            }
        });
        return; // Stop executing the playlist code when on signup page
    }

    // --- Playlist Page Logic ---
    const playlistEl = document.getElementById('playlist');
    const addSongForm = document.getElementById('addSongForm');
    const songNameInput = document.getElementById('songName');
    const artistNameInput = document.getElementById('artistName');
    const searchInput = document.getElementById('searchInput');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const progressBar = document.getElementById('progressBar');
    const nowPlayingTitle = document.getElementById('nowPlayingTitle');

    // Initial demo songs
    const initialSongs = [
        { name: "Blinding Lights", artist: "The Weeknd" },
        { name: "Levitating", artist: "Dua Lipa" },
        { name: "As It Was", artist: "Harry Styles" },
        { name: "Bad Guy", artist: "Billie Eilish" },
        { name: "Watermelon Sugar", artist: "Harry Styles" }
    ];

    let playlist = [...initialSongs];
    let nowPlayingIndex = -1;
    let progress = 0;
    let intervalId;

    function renderPlaylist() {
        playlistEl.innerHTML = '';
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            if (index === nowPlayingIndex) li.classList.add('playing');
            li.innerHTML = `
                <span>${song.name} - ${song.artist}</span>
                <div>
                    <button class="play-btn" data-index="${index}">▶️</button>
                    <button class="delete-btn" data-index="${index}">❌</button>
                </div>
            `;
            playlistEl.appendChild(li);
        });
    }

    addSongForm.addEventListener('submit', e => {
        e.preventDefault();
        const newSong = {
            name: songNameInput.value.trim(),
            artist: artistNameInput.value.trim()
        };
        if (newSong.name && newSong.artist) {
            playlist.push(newSong);
            songNameInput.value = '';
            artistNameInput.value = '';
            renderPlaylist();
        }
    });

    playlistEl.addEventListener('click', e => {
        const target = e.target;
        if (target.classList.contains('delete-btn')) {
            const index = parseInt(target.getAttribute('data-index'));
            playlist.splice(index, 1);
            if (index === nowPlayingIndex) {
                stopPlayback();
            } else if (index < nowPlayingIndex) {
                nowPlayingIndex--;
            }
            renderPlaylist();
        } else if (target.classList.contains('play-btn')) {
            startPlayback(parseInt(target.getAttribute('data-index')));
        }
    });

    searchInput.addEventListener('keyup', () => {
        const query = searchInput.value.toLowerCase();
        const items = playlistEl.getElementsByClassName('playlist-item');
        Array.from(items).forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? 'flex' : 'none';
        });
    });

    shuffleBtn.addEventListener('click', () => {
        for (let i = playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
        }
        stopPlayback();
        renderPlaylist();
    });

    new Sortable(playlistEl, {
        animation: 150,
        onEnd: evt => {
            const movedItem = playlist.splice(evt.oldIndex, 1)[0];
            playlist.splice(evt.newIndex, 0, movedItem);
            if (nowPlayingIndex !== -1) {
                if (nowPlayingIndex === evt.oldIndex) nowPlayingIndex = evt.newIndex;
                else if (nowPlayingIndex > evt.oldIndex && nowPlayingIndex <= evt.newIndex) nowPlayingIndex--;
                else if (nowPlayingIndex < evt.oldIndex && nowPlayingIndex >= evt.newIndex) nowPlayingIndex++;
            }
            renderPlaylist();
        }
    });

    function startPlayback(index) {
        nowPlayingIndex = index;
        nowPlayingTitle.textContent = `Now Playing: ${playlist[index].name} - ${playlist[index].artist}`;
        renderPlaylist();

        progress = 0;
        progressBar.style.width = '0%';
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            progress += 1;
            progressBar.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(intervalId);
                stopPlayback();
                if (nowPlayingIndex < playlist.length - 1) startPlayback(nowPlayingIndex + 1);
            }
        }, 100);
    }

    function stopPlayback() {
        clearInterval(intervalId);
        nowPlayingIndex = -1;
        nowPlayingTitle.textContent = 'Now Playing:';
        progressBar.style.width = '0%';
        renderPlaylist();
    }

    renderPlaylist();
});
