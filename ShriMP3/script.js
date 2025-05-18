// Audio Things
let audioContext;
let analyser;
let track;
let bufferLen;
let dataArr;

// Playback elements
const playButton = document.querySelector("button");
const audioElement = document.getElementById("audio");
const scaler = document.getElementById("scaler");
const shrimp = document.getElementById("shrimp");

playButton.addEventListener("click", () => {
  if (!audioContext) {
    // Initialize audio context after user gesture
    audioContext = new AudioContext();

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    bufferLen = analyser.frequencyBinCount;
    dataArr = new Uint8Array(bufferLen);

    track = audioContext.createMediaElementSource(audioElement);
    track.connect(analyser);
    analyser.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  if (playButton.dataset.playing === "false") {
    audioElement.play();
    playButton.dataset.playing = "true";
  } else if (playButton.dataset.playing === "true") {
    audioElement.pause();
    playButton.dataset.playing = "false";
  }
});

audioElement.addEventListener(
    "ended",
    () => {
        playButton.dataset.playing = "false";
    },
    false,
)

function getAmplitude() {
    analyser.getByteTimeDomainData(dataArr);

    let sumSquares = 0;
    for(let i = 0; i < bufferLen; i++) {
        const norm = (dataArr[i] - 128) / 128;
        sumSquares += norm * norm;
    }

    const rms = Math.sqrt(sumSquares / bufferLen);
    return rms;
}

const amplitudeDisplay = document.getElementById("amplitude");

function updateShrimp() {
  if (audioContext && analyser) {
    const amplitude = getAmplitude();
    const baseHeight = 512; // px
    const scaledAmplitude = Math.abs(amplitude) * scaler.value;
    const height = baseHeight + (baseHeight * scaledAmplitude);
    shrimp.style.height = `${height}px`;
  }
  requestAnimationFrame(updateShrimp);
}

requestAnimationFrame(updateShrimp); // Start the loop
