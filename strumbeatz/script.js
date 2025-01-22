// DOM Elements
const crowdSections = document.querySelectorAll('.crowd-section');
const colorButtons = document.querySelectorAll('.color-btn');
const effectButtons = document.querySelectorAll('.effect-btn');
const statusIndicator = document.getElementById('active-effect');

// Sound effect for interactions
const clickSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodHRjFAnL3TK/PR8NAo0g9T//pNQBhhn0///0X0KBkzM//+lZA0Lcs///7txCweR////zHsICnr///+/fgcEX////7OBBwV2////v4IDBlT///+jgwgHZ////7KCBgVu////toQFAj3///+XgQwMgv///8uEBAFV////o4YFDYT///+/gwYCYv///6iEBgNt////s4YGBW////+8hAQBSP///5yDCguB////zIMDAVr///+nhQQCdP///7OCBQQ4////k4IIC4P////PhAMBT////6GEBgV3////toMFAz3///+ZgQgLhP///8yEAwFY////poUDBXH///+ugwYDOv///5iCBwuC////0IQDAVC///+hhQUFef///7iEBQM3////lYIHDIT////KhQMBVf///6SFBARz////roQGAzz///+agQYKgf///86EBAJb////poUDBW////+tgwYEPP///5yBBguB////zIQEAVj///+jhgQGc////7GEBgM3////mIIGDIT////LhQQBVP///6OFBAVy////rYQGBDv///+ZgQYLgv///8qFBAFX////poYDBXL///+whAYDN////5mCBQuE////y4UEAlX///+khQQFcv///66DBgQ7////moEGCoz////bhQMBU////6GFBAZz////roQGAzn///+YggULhf///8yFBAFV////o4YEBnT///+whAUDOP///5cBBguF////zIUDAVb///+jhgMGdP///7GEBQM5////mIIFCoT////NhQMBVv///6OGAwZ0////sIQFAzn///+YgQYLhP///8yFAwFX////pIYDBXP///+vhAUEOf///5iBBguE////zYUDAVf///+khgMFc////6+EBQQ5////mIEGC4T////MhQMBV////6SGA');

// State variables
let activeEffect = null;
let effectInterval = null;

// Utility function to get random number within range
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Color control with active state
colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        clickSound.play();
        colorButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const color = button.dataset.color;
        const activeSections = document.querySelectorAll('.crowd-section.active');
        activeSections.forEach(section => {
            section.style.background = color;
        });
    });
});

// Section selection
crowdSections.forEach(section => {
    section.addEventListener('click', () => {
        clickSound.play();
        section.classList.toggle('active');
    });
});

// Stop any active effect
function stopEffect() {
    if (effectInterval) {
        clearInterval(effectInterval);
        effectInterval = null;
    }
    activeEffect = null;
    effectButtons.forEach(btn => btn.classList.remove('active'));
    statusIndicator.textContent = 'No active effect';
}

// Effect implementations
const effects = {
    strobe: () => {
        let isOn = true;
        return setInterval(() => {
            document.querySelectorAll('.crowd-section.active').forEach(section => {
                section.style.background = isOn ? '#fff' : '#000';
            });
            isOn = !isOn;
        }, 100);
    },

    pulse: () => {
        let hue = 0;
        return setInterval(() => {
            document.querySelectorAll('.crowd-section.active').forEach(section => {
                section.style.background = `hsl(${hue}, 100%, 50%)`;
            });
            hue = (hue + 2) % 360;
        }, 50);
    },

    wave: () => {
        let phase = 0;
        return setInterval(() => {
            document.querySelectorAll('.crowd-section.active').forEach((section, index) => {
                const offset = index * (Math.PI / 6);
                const brightness = Math.sin(phase + offset) * 50 + 50;
                section.style.background = `hsl(200, 100%, ${brightness}%)`;
            });
            phase += 0.1;
        }, 50);
    },

    sparkle: () => {
        return setInterval(() => {
            document.querySelectorAll('.crowd-section.active').forEach(section => {
                if (Math.random() > 0.5) {
                    section.style.background = `hsl(${random(0, 360)}, 100%, 50%)`;
                } else {
                    section.style.background = 'rgba(0, 0, 0, 0.1)';
                }
            });
        }, 100);
    },

    all: () => {
        crowdSections.forEach(section => {
            section.classList.add('active');
        });
        return null;
    },

    reset: () => {
        stopEffect();
        crowdSections.forEach(section => {
            section.classList.remove('active');
            section.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        return null;
    }
};

// Effect button handling
effectButtons.forEach(button => {
    button.addEventListener('click', () => {
        clickSound.play();
        const effect = button.dataset.effect;

        if (effect === activeEffect) {
            stopEffect();
            return;
        }

        // Handle non-looping effects
        if (effect === 'all' || effect === 'reset') {
            effects[effect]();
            return;
        }

        // Handle looping effects
        stopEffect();
        activeEffect = effect;
        button.classList.add('active');
        effectInterval = effects[effect]();
        statusIndicator.textContent = `Active: ${effect.charAt(0).toUpperCase() + effect.slice(1)}`;
    });
});