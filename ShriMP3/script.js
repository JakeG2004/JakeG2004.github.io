// Audio Things
let audioContext;
let analyser;
let track;
let bufferLen;
let dataArr;

// Playback elements
const playButton = document.getElementById("playButton");
const restartButton = document.getElementById("restartButton")
const audioElement = document.getElementById("audio");
const scaler = document.getElementById("scaler");

// Shrimps
const bass_shrimp = document.getElementById("bass_shrimp");
const mids_shrimp = document.getElementById("mids_shrimp");
const highs_shrimp = document.getElementById("highs_shrimp");

const fileUpload = document.getElementById("inputFile");

// The file upload
fileUpload.addEventListener("change", () => {
  const file = fileUpload.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    audioElement.src = url;
    audioElement.currentTime = 0;
    audioElement.load();

    if (audioContext) {
      // Disconnect old track if it exists
      if (track) {
        track.disconnect();
      }

      // Reconnect the new source
      track = audioContext.createMediaElementSource(audioElement);
      track.connect(analyser);
      analyser.connect(audioContext.destination);
    }

    // Optional: reset play button state
    playButton.dataset.playing = "false";
  }
});

restartButton.addEventListener("click", () => {
  audioElement.currentTime = 0;
})

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

function getFrequencyBands() {
  analyser.getByteFrequencyData(dataArr);

  const sampleRate = audioContext.sampleRate;
  const fftSize = analyser.fftSize;
  const binSize = sampleRate / fftSize;

  function getRMS(minFreq, maxFreq) {
    const start = Math.floor(minFreq / binSize);
    const end = Math.ceil(maxFreq / binSize);
    let sumSquares = 0;
    let count = 0;

    for (let i = start; i <= end; i++) {
      const norm = dataArr[i] / 255; // normalize to [0,1]
      sumSquares += norm * norm;
      count++;
    }

    return count > 0 ? Math.sqrt(sumSquares / count): 0;
  }

  return {
    bass: getRMS(0, 100),        // Bass instruments and low male vocals
    vocals: getRMS(1000, 1200),
    drums: getRMS(1500, 20000)

    /*bass: getRMS(0, 100),        // Bass instruments and low male vocals
    vocals: getRMS(500, 10000),
    drums: getRMS(15000, 20000)*/
  };
  
}


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

function updateShrimp() {
  if (audioContext && analyser) {
    const { bass, vocals, drums } = getFrequencyBands();
    const scale = parseFloat(scaler.value);
    const baseHeight = 256;

    bass_shrimp.style.height = `${baseHeight + bass * baseHeight * scale * .75}px`;
    mids_shrimp.style.height = `${baseHeight + vocals * baseHeight * scale * 1.25}px`;
    highs_shrimp.style.height = `${baseHeight + drums * baseHeight * scale * 2.0}px`;
  }

  requestAnimationFrame(updateShrimp);
}



requestAnimationFrame(updateShrimp); // Start the loop
