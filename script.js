document.addEventListener("DOMContentLoaded", () => {
    // 1. GENERATE 300 STARS AUTOMATICALLY
    const starsContainer = document.getElementById("stars");
    if (starsContainer) {
        const starCount = 300;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement("div");
            star.className = "star";
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.animationDelay = `${Math.random() * 4}s`;
            star.style.animationDuration = `${2.5 + Math.random() * 3}s`;
            starsContainer.appendChild(star);
        }
    }

    // 2. ELEGANT SHOOTING STAR LOOP (EVERY 12-18 SECONDS)
    function spawnShootingStar() {
        const shootingStar = document.createElement("div");
        shootingStar.className = "shooting-star";
        shootingStar.style.top = `${Math.random() * 40}%`;
        shootingStar.style.left = `${Math.random() * 80 + 20}%`;
        document.body.appendChild(shootingStar);
        setTimeout(() => shootingStar.remove(), 2500);
    }
    setInterval(spawnShootingStar, 14000);

    // 3. MOUSE GLOW EFFECT
    const mouseGlow = document.querySelector(".mouse-glow");
    if (mouseGlow) {
        window.addEventListener("mousemove", (e) => {
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        });
    }

    // 4. TYPEWRITER PER KALIMAT (EMOSIONAL & PERSONAL)
    const openingScreen = document.getElementById("opening");
    const heroCard = document.getElementById("heroCard");
    const typewriterText = document.getElementById("typewriterText");
    const choiceContainer = document.getElementById("choiceContainer");

    const sentences = [
        "Hai, Rama. 🤍",
        "Hari ini mungkin cukup berat ya.",
        "Aku memang nggak bisa selalu ada di samping kamu.",
        "Tapi aku mau nemenin kamu sebentar.",
        "Pilih yang kamu butuhin sekarang. 🤍"
    ];

    function showSentence(text, duration) {
        return new Promise((resolve) => {
            if (!typewriterText) return resolve();
            typewriterText.classList.add("fade-out");
            setTimeout(() => {
                typewriterText.innerHTML = text;
                typewriterText.classList.remove("fade-out");
                setTimeout(resolve, duration);
            }, 800);
        });
    }

    async function startSequence() {
        // Step A: Hide Opening Overlay
        if (openingScreen) {
            openingScreen.style.opacity = "0";
            openingScreen.style.visibility = "hidden";
            setTimeout(() => { openingScreen.style.display = "none"; }, 1200);
        }

        // Step B: Fade In Card
        if (heroCard) {
            heroCard.classList.add("show");
        }

        // Step C: Run Typewriter Sentences One by One
        await new Promise(r => setTimeout(r, 600));
        for (let i = 0; i < sentences.length; i++) {
            const delay = i === sentences.length - 1 ? 1200 : 2500;
            await showSentence(sentences[i], delay);
        }

        // Step D: Show Choice Buttons with Micro Text
        if (choiceContainer) {
            choiceContainer.classList.add("show");
        }
    }

    // Start opening transition after 2 seconds
    setTimeout(startSequence, 2000);

    // 5. AUDIO RAIN CONTROL (WEB AUDIO API + FALLBACK)
    const soundButton = document.getElementById("soundButton");
    const rainSound = document.getElementById("rainSound");
    let audioCtx = null, rainGain = null, isPlaying = false;

    function initWebAudioRain() {
        if (audioCtx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;

        rainGain = audioCtx.createGain();
        rainGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(rainGain);
        rainGain.connect(audioCtx.destination);
        whiteNoise.start();
    }

    if (soundButton) {
        soundButton.addEventListener("click", () => {
            if (!isPlaying) {
                // Try playing MP3 file first if available, else synthesized soft rain
                if (rainSound) {
                    rainSound.play().then(() => {
                        soundButton.innerHTML = "🌧️ Suara Hujan ON";
                        soundButton.style.background = "rgba(59, 130, 246, 0.4)";
                        isPlaying = true;
                    }).catch(() => {
                        // Fallback to Web Audio Synthesizer
                        initWebAudioRain();
                        if (audioCtx.state === 'suspended') audioCtx.resume();
                        rainGain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 2);
                        soundButton.innerHTML = "🌧️ Suara Hujan ON";
                        soundButton.style.background = "rgba(59, 130, 246, 0.4)";
                        isPlaying = true;
                    });
                }
            } else {
                if (rainSound) rainSound.pause();
                if (rainGain && audioCtx) {
                    rainGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
                }
                soundButton.innerHTML = "🌧️ Suara Hujan OFF";
                soundButton.style.background = "rgba(255, 255, 255, 0.08)";
                isPlaying = false;
            }
        });
    }

    // Temporary Alert for Build 2 Transition
    const hugBtn = document.getElementById("hugBtn");
    const kissBtn = document.getElementById("kissBtn");

    if (hugBtn) {
        hugBtn.onclick = () => {
            alert("Siap-siap untuk Build 2: Mode Pelukan Suasana Hangat! 🤍");
        };
    }
    if (kissBtn) {
        kissBtn.onclick = () => {
            alert("Siap-siap untuk Build 2: Mode Ciuman Virtual! 💋");
        };
    }
});