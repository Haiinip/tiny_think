const popup = document.getElementById('hurufPopup');
const popupImg = document.getElementById('popupImg');
const popupName = document.getElementById('popupName');
const popupCheck = document.getElementById('popupCheck');
const audio = document.getElementById('huruf-audio');
const mode = document.body.dataset.mode || 'hijaiyah';
const abjadData = [
  { text: 'A', audio: 'assets/audio/abjad/A.mp3' },
  { text: 'B', audio: 'assets/audio/abjad/B.mp3' },
  { text: 'C', audio: 'assets/audio/abjad/C.mp3' },
  { text: 'D', audio: 'assets/audio/abjad/D.mp3' },
  { text: 'E', audio: 'assets/audio/abjad/E.mp3' },
  { text: 'F', audio: 'assets/audio/abjad/F.mp3' },
  { text: 'G', audio: 'assets/audio/abjad/G.mp3' },
  { text: 'H', audio: 'assets/audio/abjad/H.mp3' },
  { text: 'I', audio: 'assets/audio/abjad/I.mp3' },
  { text: 'J', audio: 'assets/audio/abjad/J.mp3' },
  { text: 'K', audio: 'assets/audio/abjad/K.mp3' },
  { text: 'L', audio: 'assets/audio/abjad/L.mp3' },
  { text: 'M', audio: 'assets/audio/abjad/M.mp3' },
  { text: 'N', audio: 'assets/audio/abjad/N.mp3' },
  { text: 'O', audio: 'assets/audio/abjad/O.mp3' },
  { text: 'P', audio: 'assets/audio/abjad/P.mp3' },
  { text: 'Q', audio: 'assets/audio/abjad/Q.mp3' },
  { text: 'R', audio: 'assets/audio/abjad/R.mp3' },
  { text: 'S', audio: 'assets/audio/abjad/S.mp3' },
  { text: 'T', audio: 'assets/audio/abjad/T.mp3' },
  { text: 'U', audio: 'assets/audio/abjad/U.mp3' },
  { text: 'V', audio: 'assets/audio/abjad/V.mp3' },
  { text: 'W', audio: 'assets/audio/abjad/W.mp3' },
  { text: 'X', audio: 'assets/audio/abjad/X.mp3' },
  { text: 'Y', audio: 'assets/audio/abjad/Y.mp3' },
  { text: 'Z', audio: 'assets/audio/abjad/Z.mp3' }
];

const btnPlay = document.getElementById('btnPlayAudio');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnClose = document.getElementById('popupClose');

const items = Array.from(document.querySelectorAll('.huruf-item'));
let currentIndex = 0;

/* OPEN POPUP */
items.forEach((item, index) => {
  item.addEventListener('click', () => {
    currentIndex = index;
    openPopup();
  });
});

function openPopup() {

    /* ===== MODE ABJAD ===== */
    if (mode === 'abjad') {
        const item = abjadData[currentIndex];

        // Samakan UI popup dengan hijaiyah
        popupImg.style.display = 'none';
        popupName.textContent = item.text;
        popupCheck.classList.remove('active');
        btnNext.classList.remove('disabled');

        // === AUDIO PRIORITAS MP3, FALLBACK TTS ===
        if (item.audio) {
            audio.src = item.audio;
            audio.onerror = () => playTTS(item.text);
            audio.play().catch(() => playTTS(item.text));
        } else {
            playTTS(item.text);
        }

        updateProgress();
        popup.classList.add('active');
        return;
    }

    /* ===== DEFAULT: HIJAIYAH (TIDAK DIUBAH) ===== */
    const item = items[currentIndex];

    popupImg.style.display = 'block';
    popupImg.src = item.dataset.img;
    popupName.textContent = item.querySelector('img')?.alt || '';
    audio.src = item.dataset.audio;

    const isDone = item.classList.contains('done');
    popupCheck.classList.toggle('active', isDone);
    btnNext.classList.toggle('disabled', isDone);

    updateProgress();
    popup.classList.add('active');
}


/* AUDIO */
btnPlay.addEventListener('click', () => {
  audio.currentTime = 0;
  audio.play();

  items[currentIndex].classList.add('done');
  popupCheck.classList.add('active');
  btnNext.classList.remove('disabled');

  updateProgress();
});

/* NEXT */
btnNext.addEventListener('click', () => {
  if (btnNext.classList.contains('disabled')) return;

  animateFlip('next');
  currentIndex = (currentIndex + 1) % items.length;
  setTimeout(openPopup, 260);
});

/* PREV */
btnPrev.addEventListener('click', () => {
  animateFlip('prev');
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  setTimeout(openPopup, 260);
});

/* CLOSE */
btnClose.addEventListener('click', closePopup);
popup.addEventListener('click', e => {
  if (e.target === popup) closePopup();
});

function closePopup() {
  popup.classList.remove('active');
  audio.pause();
}


const popupBook = document.querySelector('.popup-book');

function animateFlip(direction) {
  popupBook.classList.remove('flip-next', 'flip-prev');

  void popupBook.offsetWidth;

  popupBook.classList.add(direction === 'next' ? 'flip-next' : 'flip-prev');
}


const progressBar = document.getElementById('progressBar');

function updateProgress() {
  const doneCount = items.filter(item =>
    item.classList.contains('done')
  ).length;

  const percent = Math.round((doneCount / items.length) * 100);
  progressBar.style.width = percent + '%';
}

function playTTS(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
}


