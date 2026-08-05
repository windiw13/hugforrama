document.addEventListener("DOMContentLoaded", () => {
    // 1. GENERATE 300 STARS AUTOMATICALLY
    const starsContainer = document.getElementById("stars");
    if (starsContainer) {
        const starCount = 300;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement("div");
            star.className = "star";
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.animationDuration = `${2 + Math.random() * 3}s`;
            starsContainer.appendChild(star);
        }
    }

    // 2. MOUSE GLOW EFFECT (WITH SAFETY CHECK)
    const mouseGlow = document.querySelector(".mouse-glow");
    if (mouseGlow) {
        window.addEventListener("mousemove", (e) => {
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        });
    }

    // 3. TYPEWRITER EFFECT & SAFE FADE-OUT OPENING
    const openingScreen = document.getElementById("opening");
    const openingText = document.getElementById("openingText");
    const fullText = "Diw sedang menyiapkan sesuatu untuk Rama... 🤍";
    let textIndex = 0;

    function finishOpening() {
        if (openingScreen) {
            openingScreen.style.transition = "opacity 1s ease, visibility 1s ease";
            openingScreen.style.opacity = "0";
            openingScreen.style.visibility = "hidden";
            setTimeout(() => {
                openingScreen.style.display = "none";
            }, 1000);
        }
    }

    function typeWriter() {
        if (openingText && textIndex < fullText.length) {
            openingText.innerHTML = fullText.substring(0, textIndex + 1);
            textIndex++;
            setTimeout(typeWriter, 70);
        } else {
            // Setelah selesai mengetik, tunggu 1.5 detik lalu hilangkan overlay
            setTimeout(finishOpening, 1500);
        }
    }

    // Jalankan efek mengetik jika elemennya ada, jika tidak ada langsung hilangkan opening
    if (openingText) {
        setTimeout(typeWriter, 500);
    } else {
        setTimeout(finishOpening, 1000);
    }

    // Fallback Safety: Paksa opening hilang maksimal dalam 8 detik jika ada kendala jaringan
    setTimeout(finishOpening, 8000);

    // 4. BUKA PESAN (SHOW HIDDEN MESSAGE CARD)
    const startButton = document.getElementById("startButton");
    const hiddenCard = document.querySelector(".hidden-message");

    if (hiddenCard) {
        hiddenCard.style.display = "none";
        hiddenCard.style.opacity = "0";
        hiddenCard.style.transform = "translateY(30px)";
        hiddenCard.style.transition = "opacity 1s ease, transform 1s ease";
    }

    if (startButton && hiddenCard) {
        startButton.addEventListener("click", () => {
            hiddenCard.style.display = "block";
            setTimeout(() => {
                hiddenCard.style.opacity = "1";
                hiddenCard.style.transform = "translateY(0)";
            }, 50);

            hiddenCard.scrollIntoView({ behavior: "smooth" });
        });
    }

    // 5. AUDIO RAIN CONTROL (WITH ERROR CATCH)
    const soundButton = document.getElementById("soundButton");
    const rainSound = document.getElementById("rainSound");
    let isPlaying = false;

    if (soundButton && rainSound) {
        soundButton.addEventListener("click", () => {
            if (!isPlaying) {
                rainSound.play().then(() => {
                    soundButton.innerHTML = "🌧️ Hujan ON";
                    soundButton.style.background = "#3b82f6";
                    soundButton.style.color = "#ffffff";
                    isPlaying = true;
                }).catch((err) => {
                    console.log("Audio play prevented or file missing:", err);
                    // Tetap beri feedback ke tombol walau audio lokal terblokir browser
                    soundButton.innerHTML = "🌧️ Audio Terkunci";
                });
            } else {
                rainSound.pause();
                soundButton.innerHTML = "🌧️ Hujan OFF";
                soundButton.style.background = "white";
                soundButton.style.color = "#14213d";
                isPlaying = false;
            }
        });
    }
});