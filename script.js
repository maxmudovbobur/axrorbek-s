document.addEventListener('DOMContentLoaded', function() {
    // Elementlarni tanlab olish
    const currentSlider = document.getElementById('current-slider');
    const currentInput = document.getElementById('current');
    const currentValue = document.getElementById('current-value');
    
    const resistanceSlider = document.getElementById('resistance-slider');
    const resistanceInput = document.getElementById('resistance');
    const resistanceValue = document.getElementById('resistance-value');
    
    const timeSlider = document.getElementById('time-slider');
    const timeInput = document.getElementById('time');
    const timeValue = document.getElementById('time-value');
    
    const massSlider = document.getElementById('mass-slider');
    const massInput = document.getElementById('mass');
    const massValue = document.getElementById('mass-value');
    
    // Natija elementlari
    const heatCalculated = document.getElementById('heat-calculated');
    const tempChange = document.getElementById('temp-change');
    const heatEquivalent = document.getElementById('heat-equivalent');
    const formulaCalc = document.getElementById('formula-calc');
    const formulaTemp = document.getElementById('formula-temp');
    
    // Tajriba elementlari
    const waterLevel = document.getElementById('water-level');
    const currentTemp = document.getElementById('current-temp');
    const ammeterValue = document.getElementById('ammeter-value');
    const circuitResistance = document.getElementById('circuit-resistance');
    
    // Tugmalar
    const startExperimentBtn = document.getElementById('start-experiment');
    const resetExperimentBtn = document.getElementById('reset-experiment');
    const autoCalcBtn = document.getElementById('auto-calc');
    
    // O'zgaruvchilar
    let initialTemp = 25.0;
    let currentTemperature = initialTemp;
    let experimentRunning = false;
    let experimentInterval;
    const specificHeatWater = 4186; // J/kg·°C
    
    // Slayder va inputlarni sinkronlashtirish
    function syncInputs() {
        // Tok kuchi
        currentSlider.value = currentInput.value;
        currentValue.textContent = `${parseFloat(currentInput.value).toFixed(1)} A`;
        ammeterValue.textContent = `${parseFloat(currentInput.value).toFixed(1)} A`;
        
        // Qarshilik
        resistanceSlider.value = resistanceInput.value;
        resistanceValue.textContent = `${resistanceInput.value} Ω`;
        circuitResistance.textContent = `${resistanceInput.value} Ω`;
        
        // Vaqt
        timeSlider.value = timeInput.value;
        timeValue.textContent = `${timeInput.value} s`;
        
        // Massa
        massSlider.value = massInput.value;
        massValue.textContent = `${parseFloat(massInput.value).toFixed(2)} kg`;
        
        // Suv darajasini yangilash
        const mass = parseFloat(massInput.value);
        const waterHeight = 30 + (mass * 35); // 0.1kg dan 2kg gacha
        waterLevel.style.height = `${waterHeight}%`;
        
        // Hisoblashni yangilash
        calculateHeat();
    }
    
    // Issiqlik miqdorini hisoblash
    function calculateHeat() {
        const I = parseFloat(currentInput.value);
        const R = parseFloat(resistanceInput.value);
        const t = parseFloat(timeInput.value);
        const m = parseFloat(massInput.value);
        
        // Joule-Lenz qonuni: Q = I² × R × t
        const Q = I * I * R * t;
        
        // Harorat o'zgarishi: ΔT = Q / (m × c)
        const deltaT = Q / (m * specificHeatWater);
        
        // Natijalarni yangilash
        heatCalculated.textContent = `${Q.toFixed(0)} J`;
        tempChange.textContent = `${deltaT.toFixed(2)} °C`;
        heatEquivalent.textContent = "1.00 J/J";
        
        // Formulalarni yangilash
        formulaCalc.textContent = `Q = I² × R × t = (${I.toFixed(1)})² × ${R} × ${t} = ${Q.toFixed(0)} J`;
        formulaTemp.textContent = `ΔT = Q / (m × c) = ${Q.toFixed(0)} / (${m.toFixed(2)} × 4186) = ${deltaT.toFixed(2)}°C`;
        
        return { Q, deltaT };
    }
    
    // Tajribani boshlash
    function startExperiment() {
        if (experimentRunning) return;
        
        experimentRunning = true;
        startExperimentBtn.disabled = true;
        startExperimentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Tajriba Davom Etmoqda';
        
        const I = parseFloat(currentInput.value);
        const R = parseFloat(resistanceInput.value);
        const t = parseFloat(timeInput.value);
        const m = parseFloat(massInput.value);
        
        const { Q, deltaT } = calculateHeat();
        const finalTemp = initialTemp + deltaT;
        
        // Haroratni asta-sekin oshirish
        let elapsedTime = 0;
        const totalTime = t * 1000; // millisekundga o'tkazish
        const startTemp = currentTemperature;
        
        experimentInterval = setInterval(() => {
            elapsedTime += 100;
            
            if (elapsedTime >= totalTime) {
                clearInterval(experimentInterval);
                experimentRunning = false;
                startExperimentBtn.disabled = false;
                startExperimentBtn.innerHTML = '<i class="fas fa-play"></i> Tajribani Boshlash';
                currentTemperature = finalTemp;
                currentTemp.textContent = `${currentTemperature.toFixed(1)}°C`;
                return;
            }
            
            // Progressni hisoblash
            const progress = elapsedTime / totalTime;
            
            // Haroratni progressga qarab oshirish
            currentTemperature = startTemp + (deltaT * progress);
            currentTemp.textContent = `${currentTemperature.toFixed(1)}°C`;
            
            // Suv darajasida kichik o'zgarishlar (issiqlik kengayishi)
            const expansion = 1 + (progress * 0.05); // 5% gacha kengayish
            const mass = parseFloat(massInput.value);
            const waterHeight = (30 + (mass * 35)) * expansion;
            waterLevel.style.height = `${Math.min(waterHeight, 95)}%`;
            
            // Isitgichni effekti
            const heater = document.querySelector('.heater-coil');
            const intensity = 0.5 + (progress * 0.5);
            heater.style.boxShadow = `0 0 ${10 * intensity}px rgba(255, 107, 107, ${intensity})`;
            
        }, 100);
    }
    
    // Tajribani qayta boshlash
    function resetExperiment() {
        clearInterval(experimentInterval);
        experimentRunning = false;
        currentTemperature = initialTemp;
        currentTemp.textContent = `${currentTemperature.toFixed(1)}°C`;
        
        startExperimentBtn.disabled = false;
        startExperimentBtn.innerHTML = '<i class="fas fa-play"></i> Tajribani Boshlash';
        
        // Suv darajasini qayta tiklash
        const mass = parseFloat(massInput.value);
        const waterHeight = 30 + (mass * 35);
        waterLevel.style.height = `${waterHeight}%`;
        
        // Isitgich effektini olib tashlash
        const heater = document.querySelector('.heater-coil');
        heater.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.5)';
        
        // Dastlabki hisoblash
        calculateHeat();
    }
    
    // Avtomatik hisoblash
    function autoCalculate() {
        // Tasodifiy qiymatlar yaratish
        const randomCurrent = (Math.random() * 9 + 1).toFixed(1); // 1.0 - 10.0 A
        const randomResistance = Math.floor(Math.random() * 90 + 10); // 10 - 100 Ω
        const randomTime = Math.floor(Math.random() * 500 + 100); // 100 - 600 s
        const randomMass = (Math.random() * 1.8 + 0.2).toFixed(1); // 0.2 - 2.0 kg
        
        // Qiymatlarni o'rnatish
        currentInput.value = randomCurrent;
        resistanceInput.value = randomResistance;
        timeInput.value = randomTime;
        massInput.value = randomMass;
        
        // Yangilash
        syncInputs();
        
        // Animatsiya effekti
        heatCalculated.style.animation = 'none';
        tempChange.style.animation = 'none';
        
        setTimeout(() => {
            heatCalculated.style.animation = 'pulse 1s';
            tempChange.style.animation = 'pulse 1s 0.2s';
        }, 10);
    }
    
    // Hodisalarni biriktirish
    
    // Tok kuchi uchun
    currentSlider.addEventListener('input', function() {
        currentInput.value = this.value;
        syncInputs();
    });
    
    currentInput.addEventListener('input', function() {
        syncInputs();
    });
    
    // Qarshilik uchun
    resistanceSlider.addEventListener('input', function() {
        resistanceInput.value = this.value;
        syncInputs();
    });
    
    resistanceInput.addEventListener('input', function() {
        syncInputs();
    });
    
    // Vaqt uchun
    timeSlider.addEventListener('input', function() {
        timeInput.value = this.value;
        syncInputs();
    });
    
    timeInput.addEventListener('input', function() {
        syncInputs();
    });
    
    // Massa uchun
    massSlider.addEventListener('input', function() {
        massInput.value = this.value;
        syncInputs();
    });
    
    massInput.addEventListener('input', function() {
        syncInputs();
    });
    
    // Tugmalar uchun
    startExperimentBtn.addEventListener('click', startExperiment);
    resetExperimentBtn.addEventListener('click', resetExperiment);
    autoCalcBtn.addEventListener('click', autoCalculate);
    
    // CSS animatsiyasini qo'shish
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .result-value {
            transition: all 0.5s ease;
        }
        
        .water-level {
            transition: height 0.5s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Dastlabki hisoblash
    syncInputs();
});