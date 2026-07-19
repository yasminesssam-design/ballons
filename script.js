let score = 0;
let gameInterval;
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('start-btn');

// مصفوفة الألوان المبهجة للبالونات
const colors = ['#ff7096', '#ff9cee', '#ffcc5c', '#ff6b6b', '#4ade80', '#60a5fa', '#a78bfa'];

// دالة تفاعلية لتوليد صوت فرقعة (Pop) حاد وسريع برمجياً
function playPopSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        // نغمة حادة جداً وسريعة (من 800 تنزل بسرعة) لتعطي إيحاء الفرقعة
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.08);

        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
        console.log("يجب التفاعل مع الصفحة أولاً لتشغيل الصوت");
    }
}

// دالة بدء اللعبة
function startGame() {
    // إعادة تصغير العداد وتنظيف الشاشة
    score = 0;
    scoreDisplay.innerText = score;
    gameBoard.innerHTML = '';
    startBtn.innerText = "إعادة اللعب 🔄";
    
    // إيقاف أي مؤقت قديم لعدم تداخل اللعب
    clearInterval(gameInterval);
    
    // إطلاق بالونة جديدة كل ثانية (1000 مللي ثانية)
    gameInterval = setInterval(createBalloon, 1000);
}

// دالة صناعة بالونة جديدة
function createBalloon() {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');

    // اختيار لون عشوائي من المصفوفة
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.backgroundColor = randomColor;
    
    // حيلة برمجية لجعل ذيل البالونة يأخذ نفس لونها
    balloon.style.setProperty('--balloon-color', randomColor); 
    // تعويض بسيط لستايل ذيل البالونة في CSS
    const style = document.createElement('style');
    style.innerHTML = `.balloon { border-bottom-color: ${randomColor}; } .balloon::after { border-bottom-color: ${randomColor}; }`;
    balloon.appendChild(style);

    // اختيار مكان أفقي عشوائي لظهور البالونة على الشاشة
    const boardWidth = gameBoard.offsetWidth - 60; // طرح عرض البالونة لتظل داخل الشاشة
    const randomX = Math.floor(Math.random() * boardWidth);
    balloon.style.left = randomX + 'px';

    // جعل البالونة تختفي تلقائياً من الـ HTML بعد انتهاء الأنيماشن (خروجها من الشاشة)
    balloon.addEventListener('animationend', () => {
        balloon.remove();
    });

    // حدث الضغط على البالونة لفرقعتها
    balloon.addEventListener('mousedown', () => {
        playPopSound(); // تشغيل صوت الفرقعة المضمون
        score++; // زيادة النقاط
        scoreDisplay.innerText = score; // تحديث الرقم على الشاشة
        
        // تأثير بصري سريع قبل الحذف (اختياري: لجعلها تنكمش)
        balloon.style.transform = 'scale(0)';
        setTimeout(() => balloon.remove(), 50);
    });

    // إضافة البالونة إلى لوحة اللعبة
    gameBoard.appendChild(balloon);
}