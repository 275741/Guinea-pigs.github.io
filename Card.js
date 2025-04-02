const drawCardButton = document.getElementById('drawCard');
const cardContainer = document.getElementById('cardContainer');
const cardElement = document.querySelector('.card');
const rarityBar = document.getElementById('rarityBar');
const rarityName = document.getElementById('rarityName');
const cardImage = document.getElementById('cardImage');
const cardName = document.getElementById('cardName');
const musicToggle = document.getElementById('musicToggle');
const volumeSlider = document.getElementById('volumeSlider');

// Фоновая музыка
const bgMusic = new Audio('Guinea Pig Groove.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;

// Звуки для каждой редкости карты
const raritySounds = {
    common: new Audio('audio-editor-output.mp3'),
    uncommon: new Audio('audio-editor-output.mp3'),
    rare: new Audio('audio-editor-output.mp3'),
    epic: new Audio('audio-editor-output (1).mp3'),
    legendary: new Audio('Звук восстановления энергетического запаса.mp3'),
    mythical: new Audio('Звук восстановления энергетического запаса.mp3')
};

// Устанавливаем громкость для звуков редкости
Object.values(raritySounds).forEach(sound => {
    sound.volume = 0.7;
});

musicToggle.addEventListener('click', function() {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.textContent = '♪ Выключить музыку';
    } else {
        bgMusic.pause();
        musicToggle.textContent = '♪ Включить музыку';
    }
});

volumeSlider.addEventListener('input', (e) => {
    bgMusic.volume = e.target.value;
});

// Попытка автоматического запуска музыки
bgMusic.play().catch(error => {
    musicToggle.style.display = 'block';
});

document.addEventListener('click', function firstInteraction() {
    bgMusic.play().then(() => {
        musicToggle.textContent = '♪ Выключить музыку';
    }).catch(error => {});
    document.removeEventListener('click', firstInteraction);
}, { once: true });

// Обработчик для иконки настроек
document.addEventListener('DOMContentLoaded', function() {
    const settingsIcon = document.querySelector('.settings-icon');
    const settingsPanel = document.querySelector('.settings-panel');
    
    settingsIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        settingsPanel.classList.toggle('hidden');
    });
    
    document.addEventListener('click', function(e) {
        if (!settingsPanel.contains(e.target) && e.target !== settingsIcon) {
            settingsPanel.classList.add('hidden');
        }
    });
    
    settingsPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

const RARITY_PROBABILITIES = [
    { rarity: "common", probability: 61.75 },
    { rarity: "uncommon", probability: 23 },
    { rarity: "rare", probability: 9 },
    { rarity: "epic", probability: 4.6 },
    { rarity: "legendary", probability: 1.25 },
    { rarity: "mythical", probability: 0.4 }
];

// История последних карт
const rarityHistory = {
    common: [],
    uncommon: [],
    rare: [],
    epic: [],
    legendary: [],
    mythical: []
};

// Группировка карт по редкостям
const cardsByRarity = cards.reduce((acc, card) => {
    if (!acc[card.rarity]) acc[card.rarity] = [];
    acc[card.rarity].push(card);
    return acc;
}, {});

// Функция выбора редкости
function selectRarity() {
    let random = Math.random() * 100;
    for (const { rarity, probability } of RARITY_PROBABILITIES) {
        if (random < probability) return rarity;
        random -= probability;
    }
    return "common";
}

function selectCard(rarity) {
    const availableCards = cardsByRarity[rarity];
    const history = rarityHistory[rarity];
    
    if (availableCards.length < 3) {
        return availableCards[Math.floor(Math.random() * availableCards.length)];
    }
    
    let filteredCards = availableCards.filter(card => 
        !history.some(h => h.name === card.name)
    );
    
    if (filteredCards.length === 0) {
        filteredCards = availableCards;
    }
    
    const selectedCard = filteredCards[Math.floor(Math.random() * filteredCards.length)];
    history.push(selectedCard);
    if (history.length > 2) history.shift();
    
    return selectedCard;
}

// Обработчик клика по кнопке выпадения карты
drawCardButton.addEventListener('click', function() {
    drawCardButton.disabled = true;
    animateButtonPress(drawCardButton);
    playButtonClickSound();
    showCardContainer(cardContainer);

    const randomCard = getRandomCard();
    updateCardInterface(randomCard);

    // Воспроизводим звук редкости
    if (raritySounds[randomCard.rarity]) {
        raritySounds[randomCard.rarity].currentTime = 0;
        raritySounds[randomCard.rarity].play();
    }

    const isLegendary = randomCard.rarity === 'legendary';
    const flipDuration = isLegendary ? 900 : 800;
    const showDuration = isLegendary ? 2000 : 1800;

    animateCard(cardElement, cardContainer, isLegendary, flipDuration, showDuration, drawCardButton);
});

// Остальные функции остаются без изменений
function playButtonClickSound() {
    const audio = new Audio();
    audio.src = 'zvuk11.mp3';
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Автовоспроизведение звука заблокировано:", e));
}

function animateButtonPress(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

function showCardContainer(container) {
    container.classList.remove('hidden');
    container.style.opacity = '0';
    container.style.transform = 'translateY(50px) scale(0.8)';

    setTimeout(() => {
        container.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0) scale(1)';
    }, 10);
}

function getRandomCard() {
    const rarity = selectRarity();
    return selectCard(rarity);
}

function updateCardInterface(randomCard) {
    rarityBar.className = `rarity-bar ${randomCard.rarity}`;
    rarityName.textContent = randomCard.rarityText;
    rarityName.className = `rarity-name ${randomCard.rarity}`;
    cardElement.className = `card ${randomCard.rarity}`;
    cardImage.src = randomCard.image;
    cardName.textContent = randomCard.name;
}

function animateCard(cardElement, cardContainer, isLegendary, flipDuration, showDuration, drawCardButton) {
    cardElement.style.transform = 'rotateY(0deg) scale(1.1)';
    cardElement.style.transition = 'transform 0.5s ease-out';

    const questionMark = document.querySelector('.question');

    setTimeout(() => {
        cardElement.style.transform = 'rotateY(0deg) scale(1.15)';

        setTimeout(() => {
            if (isLegendary) {
                if (questionMark) {
                    questionMark.classList.add('active');
                }

                cardElement.style.boxShadow = '0 0 30px 10px rgba(255, 215, 0, 0.7)';
                createLegendaryEffect(cardContainer, () => {
                    if (questionMark) {
                        questionMark.classList.remove('active');
                    }
                    flipCard(cardElement, cardContainer, flipDuration, showDuration, drawCardButton, true);
                });
            } else {
                flipCard(cardElement, cardContainer, flipDuration, showDuration, drawCardButton, false);
            }
        }, isLegendary ? 700 : 500);
    }, isLegendary ? 300 : 200);
}

function flipCard(cardElement, cardContainer, flipDuration, showDuration, drawCardButton, isLegendary) {
    cardElement.style.transform = 'rotateY(180deg) scale(1)';
    cardElement.style.transition = `transform ${flipDuration / 1000}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`;

    if (isLegendary) {
        setTimeout(() => {
            cardElement.style.boxShadow = '0 0 50px 15px rgba(255, 215, 0, 0.9)';
            setTimeout(() => {
                cardElement.style.boxShadow = '0 0 18px 2px #ffe600, 0 0 22px 4px #ff7b00';
            }, 300);
        }, flipDuration / 2);
    }

    setTimeout(() => {
        hideCardContainer(cardContainer, drawCardButton, cardElement);
    }, showDuration);
}

function hideCardContainer(cardContainer, drawCardButton, cardElement) {
    cardContainer.style.transition = 'all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)';
    cardContainer.style.opacity = '0';
    cardContainer.style.transform = 'translateY(-50px) scale(0.9)';

    setTimeout(() => {
        cardContainer.classList.add('hidden');
        cardContainer.style.transition = 'none';
        cardContainer.style.opacity = '1';
        cardContainer.style.transform = 'translateY(0) scale(1)';
        drawCardButton.disabled = false;
        cardElement.style.boxShadow = '';
    }, 600);
}

function createLegendaryEffect(container, callback) {
    const glow = document.createElement('div');
    glow.className = 'legendary-glow';
    container.appendChild(glow);

    for (let i = 0; i < 22; i++) {
        const flash = document.createElement('div');
        flash.className = 'legendary-flash';
        const angle = (i * 45) + Math.random() * 15;
        const distance = 300 + Math.random() * 80;
        flash.style.setProperty('--angle', `${angle}deg`);
        flash.style.setProperty('--distance', distance);
        flash.style.animationDelay = `${(i % 3) * 0.2}s`;
        container.appendChild(flash);
    }

    setTimeout(() => {
        glow.style.opacity = '0';
        const flashes = document.querySelectorAll('.legendary-flash');
        flashes.forEach(flash => flash.style.opacity = '0');

        setTimeout(() => {
            container.removeChild(glow);
            flashes.forEach(flash => {
                if (flash.parentNode === container) {
                    container.removeChild(flash);
                }
            });
            callback();
        }, 500);
    }, 2000);
}