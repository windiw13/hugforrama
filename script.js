{
    // 1. Title Browser Setup
    document.title = "For Rama 🤍";

    // 2. Generate 300 Stars & Shooting Star Loop
    const starfield = document.getElementById("starfield");
    for (let i = 0; i < 300; i++) {
        const star = document.createElement("div");
        star.className = "star";
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDuration = `${3 + Math.random() * 4}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starfield.appendChild(star);
    }

    function createShootingStar() {
        const s = document.createElement("div");
        s.className = "shooting-star";
        s.style.left = `${Math.random() * 100}%`;
        s.style.top = `${Math.random() * 50}%`;
        s.style.width = `${Math.random() * 80 + 50}px`;
        starfield.appendChild(s);
        setTimeout(() => s.remove(), 2000);
    }
    setInterval(createShootingStar, 6000);

    // DOM Elements
    const msgEl = document.getElementById("message");
    const choiceContainer = document.getElementById("choiceContainer");
    const hugBtn = document.getElementById("hugBtn");
    const kissBtn = document.getElementById("kissBtn");
    const timerEl = document.getElementById("timer");
    const teleportBox = document.getElementById("teleportBox");
    const progressFill = document.getElementById("progressFill");
    const teleportPercent = document.getElementById("teleportPercent");
    const teleportStatus = document.getElementById("teleportStatus");
    const finalSection = document.getElementById("finalSection");
    const kissContainer = document.getElementById("kissContainer");

    // Audio Elements
    let audioCtx = null, rainGain = null, heartbeatInterval = null, isRainPlaying = false;
    const audioToggle = document.getElementById("audioToggle");

    function initAudio() {
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
        filter.frequency.value = 650;

        rainGain = audioCtx.createGain();
        rainGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(rainGain);
        rainGain.connect(audioCtx.destination);
        whiteNoise.start();
    }

    window.toggleRain = function() {
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        if (!isRainPlaying) {
            rainGain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 2);
            audioToggle.innerHTML = "🌧️ Suara Hujan: On";
            isRainPlaying = true;
        } else {
            rainGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 2);
            audioToggle.innerHTML = "🌧️ Suara Hujan: Off";
            isRainPlaying = false;
        }
    };

    function playHeartbeatSound() {
        if (!audioCtx) return;
        const playThump = (freq, time, duration) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);
            osc.frequency.exponentialRampToValueAtTime(20, time + duration);
            gain.gain.setValueAtTime(0.09, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(time);
            osc.stop(time + duration);
        };
        const now = audioCtx.currentTime;
        playThump(58, now, 0.18);
        playThump(48, now + 0.22, 0.22);
    }

    function showText(text, duration) {
        return new Promise((resolve) => {
            msgEl.classList.add("fade-out");
            setTimeout(() => {
                msgEl.innerHTML = text;
                msgEl.classList.remove("fade-out");
                setTimeout(resolve, duration);
            }, 1200);
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

    // 3. Opening Sequence
    async function runOpening() {
        // Layar Hitam (Opening Hening 2 Detik)
        await showText("Kalau aja jarak nggak ada...", 2000);
        await showText("...aku pasti udah meluk kamu sekarang.", 2500);

        // Halaman Pertama
        await showText("Hai, Rama.", 2000);
        await showText("Aku tahu akhir-akhir ini banyak yang lagi kamu pikirin.", 3000);
        await showText("Aku nggak bisa selalu ada di samping kamu.", 2500);
        await showText("Tapi aku bikin tempat kecil ini...", 2200);
        await showText("Supaya kalau suatu saat kamu capek...", 2200);
        await showText("Kamu tahu harus pulang ke mana.", 1000);

        choiceContainer.classList.add("show");
    }

    // 4. Peluk Aku Logic
    hugBtn.onclick = async function() {
        choiceContainer.classList.remove("show");
        if (!isRainPlaying) toggleRain(); // Auto enable soft rain sound

        await showText("Mendekat ya...", 1000);

        document.body.classList.add("hugging");
        triggerVibration();

        setTimeout(() => {
            playHeartbeatSound();
            heartbeatInterval = setInterval(playHeartbeatSound, 2800);
        }, 2500);

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
        clearInterval(heartbeatInterval);
        triggerVibration();

        document.body.classList.remove("hugging");
        timerEl.innerHTML = "";

        await showText("Udah agak lega?", 2000);
        await showText("Kalau belum...", 1800);
        await showText("Aku masih di sini.", 1000);

        hugBtn.innerHTML = "🤍 Peluk Lagi";
        choiceContainer.classList.add("show");
        runFinalLetter();
    };

    // 5. Cium Aku Logic
    kissBtn.onclick = async function() {
        choiceContainer.classList.remove("show");
        document.body.classList.add("pink-bg");

        await showText("Tutup mata bentar ya... 💋", 2000);

        spawnKiss(30, 40);
        await new Promise(r => setTimeout(r, 800));
        spawnKiss(70, 40);

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                spawnKiss(Math.random() * 80 + 10, Math.random() * 80 + 10);
            }, i * 180);
        }

        const kissTexts = ["Muah.", "Muah lagi.", "Bonus satu lagi. 😂"];
        for (let kt of kissTexts) {
            await showText(kt, 1800);
        }

        await showText("1000 Virtual Kiss Delivered 💋", 2500);

        // Teleport Loading
        msgEl.innerHTML = "";
        teleportBox.style.display = "block";

        let percent = 0;
        const pInterval = setInterval(() => {
            percent += 20;
            if (percent <= 98) {
                progressFill.style.width = percent + "%";
                teleportPercent.innerHTML = percent + "%";
            } else {
                clearInterval(pInterval);
                teleportPercent.innerHTML = "99%";
                progressFill.style.width = "99%";
                
                setTimeout(() => {
                    teleportStatus.innerHTML = "❌ Teleport gagal.";
                    teleportStatus.style.color = "#ff6666";

                    setTimeout(async () => {
                        teleportStatus.innerHTML = "Untung rasa sayangnya nggak ikut gagal. 🤍";
                        teleportStatus.style.color = "#ffffff";

                        setTimeout(() => {
                            teleportBox.style.display = "none";
                            document.body.classList.remove("pink-bg");
                            runFinalLetter();
                        }, 2800);
                    }, 2000);
                }, 1000);
            }
        }, 500);
    };

    function spawnKiss(x, y) {
        const kiss = document.createElement("div");
        kiss.className = "kiss-mark";
        kiss.innerHTML = "💋";
        kiss.style.left = x + "%";
        kiss.style.top = y + "%";
        kissContainer.appendChild(kiss);
        setTimeout(() => kiss.remove(), 2000);
    }

    // 6. Halaman Terakhir
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

    // 7. Easter Egg Logic Multi-stage
    const easterBtn = document.getElementById("easterBtn");
    const easterOverlay = document.getElementById("easterOverlay");
    const easterTitle = document.getElementById("easterTitle");
    const easterVisual = document.getElementById("easterVisual");
    const easterText = document.getElementById("easterText");
    const easterActionBtn = document.getElementById("easterActionBtn");

    let easterStage = 0;

    easterBtn.onclick = () => {
        easterStage = 1;
        easterTitle.innerHTML = "Kamu bandel ya.";
        easterVisual.innerHTML = "";
        easterText.innerHTML = "";
        easterActionBtn.innerHTML = "🤍 Peluk Lagi!!";
        easterOverlay.classList.add("active");
    };

    easterActionBtn.onclick = () => {
        if (easterStage === 1) {
            easterStage = 2;
            easterTitle.innerHTML = "Peluknya Nggak Ada Batas 🤍";
            easterVisual.innerHTML = "🤍🤍🤍🤍🤍🤍🤍🤍<br>🤍🤍🤍🤍🤍🤍🤍🤍";
            easterText.innerHTML = "Selama kamu butuh, selama itu juga aku ada.";
            easterActionBtn.innerHTML = "Masih Mau Cium? 💋";
        } else if (easterStage === 2) {
            easterStage = 3;
            easterTitle.innerHTML = "Yaudah deh... 💋";
            easterVisual.innerHTML = "💋💋💋💋💋💋💋💋<br>💋💋💋💋💋💋💋💋";
            easterText.innerHTML = "Bonus 1000 cium buat Rama. Jangan protes ya. 😂🤍";
            easterActionBtn.innerHTML = "Tutup 🤍";
        } else {
            easterOverlay.classList.remove("active");
        }
    };

    // 8. Exit Confirmation Prompt (Satu sentuhan terakhir)
    window.addEventListener("beforeunload", (e) => {
        const confirmationMessage = "Yakin mau pergi? Diw masih di sini... 🤍";
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    });

    setTimeout(runOpening, 800);
}