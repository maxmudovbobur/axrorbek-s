document.addEventListener('DOMContentLoaded', function() {
    // Elementlarni tanlab olish
    const r1Slider = document.getElementById('r1-slider');
    const r2Slider = document.getElementById('r2-slider');
    const r3Slider = document.getElementById('r3-slider');
    
    const r1Value = document.getElementById('r1-value');
    const r2Value = document.getElementById('r2-value');
    const r3Value = document.getElementById('r3-value');
    
    const rxResult = document.getElementById('rx-result');
    const calculationText = document.getElementById('calculation-text');
    const needle = document.getElementById('needle');
    
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const autoBalanceBtn = document.getElementById('auto-balance-btn');
    
    // Dastlabki qiymatlarni o'rnatish
    let r1 = parseInt(r1Slider.value);
    let r2 = parseInt(r2Slider.value);
    let r3 = parseInt(r3Slider.value);
    
    // Slayder qiymatlarini yangilash
    function updateResistorValues() {
        r1 = parseInt(r1Slider.value);
        r2 = parseInt(r2Slider.value);
        r3 = parseInt(r3Slider.value);
        
        r1Value.textContent = `${r1} Ω`;
        r2Value.textContent = `${r2} Ω`;
        r3Value.textContent = `${r3} Ω`;
    }
    
    // Qarshilikni hisoblash
    function calculateResistance() {
        // Uinston ko'prigi formulasi: Rx = (R2 * R3) / R1
        const rx = (r2 * r3) / r1;
        
        // Natijani ko'rsatish
        rxResult.textContent = `${rx.toFixed(2)} Ω`;
        
        // Hisoblash formulasi matnini yangilash
        calculationText.textContent = `Rₓ = (R₂ × R₃) / R₁ = (${r2}Ω × ${r3}Ω) / ${r1}Ω = ${rx.toFixed(2)}Ω`;
        
        // Galvanometr ignasini muvozanat holatiga o'girish
        updateGalvanometer(rx);
        
        return rx;
    }
    
    // Galvanometr ignasini yangilash
    function updateGalvanometer(rx) {
        // Haqiqiy qiymat
        const actualRx = (r2 * r3) / r1;
        
        // Farqni hisoblash
        const difference = Math.abs(rx - actualRx);
        
        // Maksimal farqni aniqlash (1000Ω ga asoslangan)
        const maxDifference = 1000;
        
        // Igna burchagini hisoblash (0 dan 60 gradusgacha)
        // Farq kichik bo'lsa, igna vertikal holatda bo'ladi (0 gradus)
        // Farq katta bo'lsa, igna 60 gradusgacha og'adi
        let angle = Math.min(60, (difference / maxDifference) * 60);
        
        // Tasodifiy tebranish effekti
        angle += (Math.random() - 0.5) * 10;
        
        // Igna holatini o'zgartirish
        needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        
        // Igna rangi
        if (difference < 10) {
            needle.style.backgroundColor = '#06D6A0'; // Yashil - muvozanat
        } else if (difference < 50) {
            needle.style.backgroundColor = '#FFD166'; // Sariq - deyarli muvozanat
        } else {
            needle.style.backgroundColor = '#FF6B6B'; // Qizil - muvozanat yo'q
        }
    }
    
    // Avtomatik muvozanatlashtirish
    function autoBalance() {
        // Tasodifiy muvozanat qiymatini yaratish
        const balancedRx = Math.floor(Math.random() * 500) + 100;
        
        // R2 ni tasodifiy tanlash
        const randomR2 = Math.floor(Math.random() * 500) + 100;
        
        // R3 ni tasodifiy tanlash
        const randomR3 = Math.floor(Math.random() * 500) + 100;
        
        // R1 ni hisoblash: R1 = (R2 * R3) / Rx
        const calculatedR1 = (randomR2 * randomR3) / balancedRx;
        
        // Qiymatlarni o'rnatish
        r1Slider.value = Math.round(calculatedR1);
        r2Slider.value = randomR2;
        r3Slider.value = randomR3;
        
        // Yangilash
        updateResistorValues();
        calculateResistance();
        
        // Xabarni ko'rsatish
        calculationText.textContent = `Avtomatik muvozanatlashtirildi! Rₓ = ${balancedRx.toFixed(2)}Ω`;
        
        // Animatsiya
        rxResult.style.animation = 'none';
        setTimeout(() => {
            rxResult.style.animation = 'pulse 1s';
        }, 10);
    }
    
    // Barcha qiymatlarni qayta o'rnatish
    function resetValues() {
        r1Slider.value = 100;
        r2Slider.value = 200;
        r3Slider.value = 300;
        
        updateResistorValues();
        calculateResistance();
        
        // Xabarni ko'rsatish
        calculationText.textContent = `Barcha qiymatlar qayta o'rnatildi. Rₓ = (R₂ × R₃) / R₁ = (200Ω × 300Ω) / 100Ω = 600Ω`;
    }
    
    // Hodisalarni biriktirish
    r1Slider.addEventListener('input', function() {
        updateResistorValues();
        calculateResistance();
    });
    
    r2Slider.addEventListener('input', function() {
        updateResistorValues();
        calculateResistance();
    });
    
    r3Slider.addEventListener('input', function() {
        updateResistorValues();
        calculateResistance();
    });
    
    calculateBtn.addEventListener('click', calculateResistance);
    resetBtn.addEventListener('click', resetValues);
    autoBalanceBtn.addEventListener('click', autoBalance);
    
    // CSS animatsiyasini qo'shish
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .result {
            transition: all 0.5s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Dastlabki hisoblash
    updateResistorValues();
    calculateResistance();
});