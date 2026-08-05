document.addEventListener("DOMContentLoaded", () => {
    document.title = "For Rama 🤍";

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

    // 2. SHOOTING STARS LOOP
    function spawnShootingStar() {
        const shootingStar = document.createElement("div");
        shootingStar.className = "shooting-star";
        shootingStar.style.top = `${Math.random() * 40}%`;
        shootingStar.style.left = `${Math.random() * 80 + 20}%`;
        document.body.appendChild(shootingStar);
        setTimeout(() => shootingStar.remove(), 2500);
    }
    setInterval(spawnShootingStar, 12000);

    // 3. MOUSE GLOW
    const mouseGlow = document.querySelector(".mouse-glow");
    if (mouseGlow) {
        window.addEventListener("mousemove", (e) => {
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        });
    }

    // DOM Elements
    const msgEl = document.getElementById("typewriterText");
    const choiceContainer = document.getElementById("choiceContainer");
    const hugBtn = document.getElementById("hugBtn");
    const kissBtn = document.getElementById("kissBtn");
    const timerEl = document.getElementById("timer");
    const finalSection = document.getElementById("finalSection");
    const kissContainer = document.getElementById("kissContainer");

    // Audio Context Setup (Rain, Heartbeat & Kiss SFX)
    let audioCtx = null, rainGain = null, heartbeatInterval = null, isPlaying = false;
    const soundButton = document.getElementById("soundButton");
    const rainSound = document.getElementById("rainSound");

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // --- SFX 1: SUARA DETAK JANTUNG (DEG-DEGAN) ---
    function playHeartbeatSound() {
        initAudio();
        if (!audioCtx) return;

        const playThump = (freq, time, duration, volume) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);
            osc.frequency.exponentialRampToValueAtTime(15, time + duration);
            
            gain.gain.setValueAtTime(volume, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(time);
            osc.stop(time + duration);
        };

        const now = audioCtx.currentTime;
        // Detak 1 (Lub)
        playThump(65, now, 0.15, 0.18);
        // Detak 2 (Dub)
        playThump(50, now + 0.18, 0.22, 0.14);
    }

    // --- SFX 2: SUARA KISS / KECUPAN ---
    function playKissSound() {
        initAudio();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const now = audioCtx.currentTime;

        osc.type = 'sine';
        // Pitch sweep dari frekuensi rendah naik cepat ke tinggi (efek pop kecupan)
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Rain Sound Synthesizer
    function initWebAudioRain() {
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

    function toggleRain() {
        initAudio();
        if (!isPlaying) {
            if (rainSound) {
                rainSound.play().then(() => {
                    soundButton.innerHTML = "🌧️ Suara Hujan ON";
                    soundButton.style.background = "rgba(59, 130, 246, 0.4)";
                    isPlaying = true;
                }).catch(() => {
                    initWebAudioRain();
                    rainGain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 2);
                    soundButton.innerHTML = "🌧️ Suara Hujan ON";
                    soundButton.style.background = "rgba(59, 130, 246, 0.4)";
                    isPlaying = true;
                });
            }
        } else {
            if (rainSound) rainSound.pause();
            if (rainGain && audioCtx) rainGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
            soundButton.innerHTML = "🌧️ Suara Hujan OFF";
            soundButton.style.background = "rgba(255, 255, 255, 0.08)";
            isPlaying = false;
        }
    }

    if (soundButton) soundButton.onclick = toggleRain;

    function showText(text, duration) {
        return new Promise((resolve) => {
            if (!msgEl) return resolve();
            msgEl.classList.add("fade-out");
            setTimeout(() => {
                msgEl.innerHTML = text;
                msgEl.classList.remove("fade-out");
                setTimeout(resolve, duration);
            }, 800);
        });
    }

    function triggerVibration() {
        if (navigator.vibrate) navigator.vibrate([180]);
    }

    function spawnFloatingHeart() {
        const h = document.createElement("div");
        h.className = "floating-heart";
        h.innerHTML = "🤍";
        h.style.left = `${Math.random() * 80 + 10}%`;
        h.style.bottom = "20%";
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 4000);
    }

    function spawnKiss(x, y) {
        playKissSound(); // Mainkan SFX kecupan saat ikon muncul
        const kiss = document.createElement("div");
        kiss.className = "kiss-mark";
        kiss.innerHTML = "💋";
        kiss.style.left = x + "%";
        kiss.style.top = y + "%";
        kissContainer.appendChild(kiss);
        setTimeout(() => kiss.remove(), 2000);
    }

    // 4. OPENING TYPEWRITER SEQUENCE
    const openingScreen = document.getElementById("opening");
    const heroCard = document.getElementById("heroCard");
    const introSentences = [
        "Hai, Rama. 🤍",
        "Hari ini mungkin cukup berat ya.",
        "Aku memang nggak bisa selalu ada di samping kamu.",
        "Tapi aku mau nemenin kamu sebentar.",
        "Pilih yang kamu butuhin sekarang. 🤍"
    ];

    async function startIntroSequence() {
        if (openingScreen) {
            openingScreen.style.opacity = "0";
            openingScreen.style.visibility = "hidden";
            setTimeout(() => { openingScreen.style.display = "none"; }, 1200);
        }

        if (heroCard) heroCard.classList.add("show");
        await new Promise(r => setTimeout(r, 600));

        for (let i = 0; i < introSentences.length; i++) {
            const delay = i === introSentences.length - 1 ? 1200 : 2500;
            await showText(introSentences[i], delay);
        }

        if (choiceContainer) choiceContainer.classList.add("show");
    }

    setTimeout(startIntroSequence, 2000);

    // 5. HUG SCENE (DENGAN SUARA DEG-DEGAN BERULANG)
    if (hugBtn) {
        hugBtn.onclick = async function() {
            initAudio();
            choiceContainer.classList.remove("show");
            if (!isPlaying) toggleRain();

            await showText("Mendekat ya...", 1000);

            document.body.classList.add("hugging");
            triggerVibration();

            // Mulai detak jantung setiap 1.4 detik (ritme tenang & hangat)
            playHeartbeatSound();
            heartbeatInterval = setInterval(playHeartbeatSound, 1400);

            const hugTexts = [
                "Sini...",
                "Gapapa.",
                "Hari ini kamu udah hebat.",
                "Istirahat dulu ya.",
                "Aku peluk yang erat. 🤍"
            ];

            let count = 20;
            timerEl.innerHTML = `Pelukan... ${count} detik`;
            const heartSpawner = setInterval(spawnFloatingHeart, 1500);

            const cd = setInterval(() => {
                count--;
                if (count >= 0) timerEl.innerHTML = `Pelukan... ${count} detik`;
            }, 1000);

            for (let t of hugTexts) {
                await showText(t, 3500);
            }

            await new Promise(r => setTimeout(r, (count + 1) * 1000));

            clearInterval(cd);
            clearInterval(heartSpawner);
            clearInterval(heartbeatInterval); // Hentikan detak jantung saat pelukan selesai
            triggerVibration();

            document.body.classList.remove("hugging");
            timerEl.innerHTML = "";

            await showText("Udah agak mendingan?", 2000);
            await showText("Kalau belum...", 1800);
            await showText("Aku masih di sini. 🤍", 1000);

            hugBtn.innerHTML = "🤍 Peluk Lagi";
            choiceContainer.classList.add("show");
            runFinalLetter();
        };
    }

    // 6. KISS SCENE (DENGAN EFEK KECUPAN POP)
    if (kissBtn) {
        kissBtn.onclick = async function() {
            initAudio();
            choiceContainer.classList.remove("show");
            document.body.classList.add("pink-bg");

            await showText("Tutup mata bentar ya... 💋", 2000);

            spawnKiss(30, 40);
            await new Promise(r => setTimeout(r, 800));
            spawnKiss(70, 40);

            for (let i = 0; i < 12; i++) {
                setTimeout(() => {
                    spawnKiss(Math.random() * 80 + 10, Math.random() * 80 + 10);
                }, i * 220);
            }

            const kissTexts = [
                "Muah.",
                "Muah lagi.",
                "Bonus satu lagi buat hari ini. 🤍",
                "Semoga hangatnya nyampe ke kamu ya. 💋"
            ];
            for (let kt of kissTexts) {
                await showText(kt, 2200);
            }

            document.body.classList.remove("pink-bg");
            kissBtn.innerHTML = "💋 Cium Lagi";
            choiceContainer.classList.add("show");
            runFinalLetter();
        };
    }

    // 7. FINAL LETTER
    async function runFinalLetter() {
        const letterTexts = [
            "Rama...",
            "Makasih ya...",
            "Udah bertahan sejauh ini.",
            "Aku bangga sama kamu.",
            "Kamu nggak harus kuat setiap saat.",
            "Kalau capek...",
            "Pulang aja ke sini.",
            "Aku selalu ada. ❤️"
        ];

        for (let lt of letterTexts) {
            await showText(lt, 2600);
        }

        msgEl.innerHTML = "";
        finalSection.classList.add("show");
    }

    // 8. EASTER EGG MULTI-STAGE
    const easterBtn = document.getElementById("easterBtn");
    const easterOverlay = document.getElementById("easterOverlay");
    const easterTitle = document.getElementById("easterTitle");
    const easterVisual = document.getElementById("easterVisual");
    const easterText = document.getElementById("easterText");
    const easterActionBtn = document.getElementById("easterActionBtn");

    let easterStage = 0;

    if (easterBtn) {
        easterBtn.onclick = () => {
            initAudio();
            easterStage = 1;
            easterTitle.innerHTML = "Kamu bandel ya.";
            easterVisual.innerHTML = "";
            easterText.innerHTML = "";
            easterActionBtn.innerHTML = "🤍 Peluk Lagi!!";
            easterOverlay.classList.add("active");
        };
    }

    if (easterActionBtn) {
        easterActionBtn.onclick = () => {
            if (easterStage === 1) {
                easterStage = 2;
                easterTitle.innerHTML = "Peluknya Nggak Ada Batas 🤍";
                easterVisual.innerHTML = "🤍🤍🤍🤍🤍🤍🤍🤍<br>🤍🤍🤍🤍🤍🤍🤍🤍";
                easterText.innerHTML = "Selama kamu butuh, selama itu juga aku ada.";
                easterActionBtn.innerHTML = "Masih Mau Cium? 💋";
            } else if (easterStage === 2) {
                easterStage = 3;
                playKissSound();
                easterTitle.innerHTML = "Yaudah deh... 💋";
                easterVisual.innerHTML = "💋💋💋💋💋💋💋💋<br>💋💋💋💋💋💋💋💋";
                easterText.innerHTML = "Bonus 1000 cium buat Rama. Jangan protes ya. 😂🤍";
                easterActionBtn.innerHTML = "Tutup 🤍";
            } else {
                easterOverlay.classList.remove("active");
            }
        };
    }
});