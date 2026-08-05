// Membuat bintang

const stars = document.getElementById("stars");

for(let i=0;i<250;i++){

let star=document.createElement("div");

star.className="star";

star.style.left=Math.random()*100+"vw";

star.style.top=Math.random()*100+"vh";

star.style.animationDelay=Math.random()*2+"s";

stars.appendChild(star);

}

// Typewriter

const text=document.getElementById("typing");

const message="Aku tahu akhir-akhir ini banyak yang lagi kamu pikirin. Aku memang nggak bisa selalu ada di samping kamu, tapi semoga tempat kecil ini bisa nemenin kamu sebentar. 🤍";

let index=0;

function type(){

if(index<message.length){

text.innerHTML+=message.charAt(index);

index++;

setTimeout(type,35);

}

}

setTimeout(type,1000);

// Tombol

document.getElementById("hugBtn").onclick=()=>{

alert("Build 2 ➜ Animasi Peluk 🤍");

}

document.getElementById("kissBtn").onclick=()=>{

alert("Build 3 ➜ Animasi Cium 💋");

}