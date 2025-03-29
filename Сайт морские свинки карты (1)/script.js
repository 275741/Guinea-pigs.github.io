const cardDisplay = document.getElementById('cardDisplay');
const cardHistory = document.getElementById('cardHistory');
const drawCardButton = document.getElementById('drawCard');
const resetButton = document.getElementById('resetHistory');
const pointsValueElement = document.getElementById('pointsValue');

let isAnimationRunning = false;
let rarityCounters = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
let historyItems = [];
let points = 0;
let canBuyUpgrades = true; // Блокировка покупок
let activeUpgrades = []; // Активные улучшения
let remainingRolls = 0; // Оставшиеся прокрутки для улучшения
let lastDrawnCards = []; // Хранит последние выпавшие карты (максимум 3)

// Настройки вероятностей для редкостей
let raritySettings = {
    1: { probability: 61.75 }, // Обычные 
    2: { probability: 23 },   // Необычные
    3: { probability: 9 },  // Редкие
    4: { probability: 4.6 },    // Эпические
    5: { probability: 1.25 },  // Легендарные
    6: { probability: 0.4 }   // Мифические
};

const baseRaritySettings = JSON.parse(JSON.stringify(raritySettings)); // Сохраняем базовые вероятности

drawCardButton.addEventListener('click', drawCard);

// Обработчик сброса истории
resetButton.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
        rarityCounters = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        historyItems = [];
        unlockedCards = [];
        points = 0;
        cardHistory.innerHTML = '';
        renderUnlockedCards();
        document.cookie = 'cardGameData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        saveData();
        updatePointsDisplay();

    }
});

// Функции для работы с куки
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return JSON.parse(decodeURIComponent(cookieValue));
        }
    }
    return null;
}

// Обновляем функцию загрузки данных
function loadSavedData() {
    const savedData = getCookie('cardGameData');
    if (savedData) {
        rarityCounters = savedData.counters || {1:0,2:0,3:0,4:0,5:0,6:0};
        historyItems = savedData.history || [];
        unlockedCards = savedData.unlockedCards || [];
        points = savedData.points || 0;
        activeUpgrades = savedData.activeUpgrades || [];
        raritySettings = savedData.raritySettings || JSON.parse(JSON.stringify(baseRaritySettings));
        renderHistory();
        renderUnlockedCards();
        updatePointsDisplay();
    }
}

// Инициализируем магазин при загрузке
initializeShopItems();

// Сохранение данных
function saveData() {
    setCookie('cardGameData', {
        counters: rarityCounters,
        history: historyItems,
        unlockedCards: unlockedCards,
        points: points,
        activeUpgrades: activeUpgrades,
        raritySettings: raritySettings
    }, 30);
}
updateActiveUpgradesDisplay();

// Отрисовка истории из сохраненных данных
function renderHistory() {
    cardHistory.innerHTML = '';
    historyItems.forEach(item => {
        const historyCard = createHistoryCardElement(item);
        cardHistory.prepend(historyCard);
    });
}

// Создание элемента карты истории
function createHistoryCardElement(cardData) {
    const historyCard = document.createElement('div');
    historyCard.classList.add('history-card', `rarity-${cardData.rarity}`);
    historyCard.style.backgroundImage = `url(${cardData.image})`;
    
    const historyType = document.createElement('div');
    historyType.classList.add('history-card-type', `rarity-${cardData.rarity}`);
    historyType.innerHTML = `
        ${cardData.type}
        <span class="card-number">№${cardData.number}</span>
    `;
    
    const historyTitle = document.createElement('div');
    historyTitle.classList.add('history-card-title');
    historyTitle.textContent = cardData.name;
    
    historyCard.appendChild(historyType);
    historyCard.appendChild(historyTitle);
    return historyCard;
}

// Нормализация вероятностей
function normalizeProbabilities(changedRarity) {
    let total = Object.values(raritySettings).reduce((sum, r) => sum + r.probability, 0);
    const otherRarities = Object.keys(raritySettings).filter(r => r != changedRarity);
    
    while (total > 100) {
        const excess = total - 100;
        const reducePerRarity = excess / otherRarities.length;
        
        otherRarities.forEach(r => {
            raritySettings[r].probability = Math.max(0, raritySettings[r].probability - reducePerRarity);
        });
        
        total = Object.values(raritySettings).reduce((sum, r) => sum + r.probability, 0);
    }
}

// Получение случайной карты
function getRandomCard() {
    const rarityRandom = Math.random() * 100;
    let cumulativeRarity = 0;
    let selectedRarity = null;
    
    for (const [rarity, settings] of Object.entries(raritySettings)) {
        cumulativeRarity += settings.probability;
        if (rarityRandom < cumulativeRarity) {
            selectedRarity = parseInt(rarity);
            break;
        }
    }
    
    if (!selectedRarity) {
        console.error("Ошибка выбора редкости");
        return null;
    }

    const rarityCards = cards.filter(c => c.rarity === selectedRarity);
    if (rarityCards.length === 0) return null;

    // Исключаем последние 2 выпавшие карты этой редкости
    const excludedCards = lastDrawnCards.filter(c => c.rarity === selectedRarity).map(c => c.name);
    let availableCards = rarityCards.filter(c => !excludedCards.includes(c.name));
    
    // Если все карты исключены, разрешаем любой выбор
    if (availableCards.length === 0) {
        availableCards = rarityCards;
    }

    // Выбираем случайную карту из доступных
    const selectedCard = availableCards[Math.floor(Math.random() * availableCards.length)];
    
    // Обновляем историю выпавших карт
    lastDrawnCards.push(selectedCard);
    if (lastDrawnCards.length > 3) {
        lastDrawnCards.shift(); // Сохраняем только последние 2 карты
    }

    return selectedCard;
    
}

// Анимация карты
function animateCard(wrapper, cardFront, cardBack) {
    return new Promise((resolve) => {
        wrapper.style.transform = 'scale(0)';
        wrapper.style.opacity = '0';
        
        setTimeout(() => {
            wrapper.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            wrapper.style.transform = 'scale(1)';
            wrapper.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            cardBack.style.transform = 'rotateY(180deg)';
            cardFront.style.transform = 'rotateY(0deg)';
            
            if (cardFront.classList.contains('rarity-5') || cardFront.classList.contains('rarity-6')) {
                cardFront.classList.add('special-glow');
            }
        }, 700);

        setTimeout(() => {
            wrapper.style.transition = 'all 0.8s ease';
            wrapper.style.transform = 'translateY(-20px) scale(0.95)';
            wrapper.style.opacity = '0';
            resolve();
        }, 2200);
    });
}

const unlockedCardsGrid = document.getElementById('unlockedCardsGrid');
let unlockedCards = []; // Массив для хранения выбитых карт
let currentFilter = 'all'; // По умолчанию показываем все карты

// Отрисовка коллекции карт
function renderUnlockedCards() {
    unlockedCardsGrid.innerHTML = '';
    const filteredCards = cards
        .filter(card => currentFilter === 'all' || card.rarity == currentFilter)
        .sort((a, b) => a.rarity - b.rarity);

    filteredCards.forEach(card => {
        const isUnlocked = unlockedCards.includes(card.name);
        const cardElement = document.createElement('div');
        cardElement.className = `unlocked-card rarity-${card.rarity} ${isUnlocked ? 'unlocked' : ''}`;
        cardElement.style.border = `3px solid ${getRarityColor(card.rarity)}`;
        
        if (isUnlocked) {
            cardElement.innerHTML = `
                <img src="${card.image}" alt="${card.name}">
                <div class="history-card-type rarity-${card.rarity}">
                    ${card.type}
                </div>
                <div class="history-card-title">${card.name}</div>
            `;
        } else {
            cardElement.innerHTML = `
                <div class="card-back rarity-${card.rarity}"></div>
                <div class="question-mark">?</div>
            `;
        }
        
        unlockedCardsGrid.appendChild(cardElement);
    });

    // Проверяем, все ли карты открыты для текущего фильтра
    if (currentFilter !== 'all') {
        const allUnlocked = filteredCards.every(card => unlockedCards.includes(card.name));
        canBuyUpgrades = allUnlocked;
    }
    updateCollectionStats();
}

// Получение цвета по редкости
function getRarityColor(rarity) {
    const colors = {
        1: '#808080',
        2: '#00ff00',
        3: '#0000ff',
        4: '#800080',
        5: '#ffd700',
        6: '#ff0000'
    };
    return colors[rarity];
}

// Добавляем функцию для получения названия редкости
function getRarityName(rarity) {
    const names = {
        1: 'Обычные',
        2: 'Необычные',
        3: 'Редкие',
        4: 'Эпические',
        5: 'Легендарные',
        6: 'Мифические'
    };
    return names[rarity] || 'Неизвестно';
}

// Обработчики фильтров
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.rarity;
        renderUnlockedCards();
    });
});

// Открытие карты
function unlockCard(cardName) {
    if (!unlockedCards.includes(cardName)) {
        unlockedCards.push(cardName);
        saveData();

        setTimeout(() => {
            renderUnlockedCards();
        }, 1000);

        const cardIndex = cards.findIndex(c => c.name === cardName);
        const cardElement = unlockedCardsGrid.children[cardIndex];
        if (cardElement) {
            cardElement.classList.add('unlocked');
            cardElement.style.animation = 'none';
            void cardElement.offsetWidth; // Trigger reflow
            cardElement.style.animation = 'cardReveal 0.5s ease-out';
        }
    }
}

// Обновление отображения баллов
function updatePointsDisplay() {
    if (pointsValueElement) {
        pointsValueElement.textContent = points;
    }
}

// Обновленный обработчик покупки улучшений
document.querySelectorAll('.shop-item button').forEach(button => {
    button.addEventListener('click', () => {
        if (activeUpgrades.length > 0) {
            alert('У вас уже активно улучшение! Дождитесь его окончания.');
            return;
        }

        const shopItem = button.closest('.shop-item');
        const cost = parseInt(shopItem.dataset.cost);
        const rarity = parseInt(shopItem.dataset.rarity);
        const probChange = parseFloat(shopItem.dataset.probChange);
        const duration = parseInt(shopItem.dataset.duration);

        if (rarity === 1) {
            alert("Нельзя улучшать обычные карты!");
            return;
        }

        if (points >= cost) {
            if (raritySettings[1].probability < probChange) {
                alert('Недостаточно вероятности у обычных карт для улучшения!');
                return;
            }

            const originalRarity1 = raritySettings[1].probability;
            const originalRarityX = raritySettings[rarity].probability;

            raritySettings[1].probability -= probChange;
            raritySettings[rarity].probability += probChange;
            normalizeProbabilities(rarity);

            if (raritySettings[1].probability < 0) {
                raritySettings[1].probability = originalRarity1;
                raritySettings[rarity].probability = originalRarityX;
                alert('Недостаточно вероятности после нормализации!');
                return;
            }

            points -= cost;
            activeUpgrades.push({
                rarity: rarity,
                remaining: duration,
                originalRarity1: originalRarity1,
                originalRarityX: originalRarityX,
                probChange: probChange
            });

            updatePointsDisplay();
            updateActiveUpgradesDisplay(); // Добавьте эту строку
            saveData();
            alert(`Шанс увеличен на ${probChange}% на ${duration} попыток!`);
        } else {
            alert('Недостаточно баллов!');
        }
    });
});

// Добавляем функцию для инициализации магазина
function initializeShopItems() {
    document.querySelectorAll('.shop-item').forEach(item => {
        const cost = item.dataset.cost;
        const rarity = item.dataset.rarity;
        const probChange = item.dataset.probChange;
        const duration = item.dataset.duration;
        
        const span = item.querySelector('span');
        const button = item.querySelector('button');
        
        const rarityName = getRarityName(rarity);
        span.textContent = `Увеличить шанс ${rarityName} карт на +${probChange}% на ${duration} попыток`;
        button.textContent = `Купить за ${cost} 🥕 СвинКоинов`;
    });
}

function updateActiveUpgradesDisplay() {
    const container = document.getElementById('activeUpgrades');
    container.innerHTML = '';
    
    if (activeUpgrades.length === 0) {
        container.innerHTML = '<div class="no-upgrades">Нет активных улучшений</div>';
        return;
    }
    
    activeUpgrades.forEach(upgrade => {
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade-item';
        upgradeElement.innerHTML = `
            <span class="upgrade-name rarity-${upgrade.rarity}">
                ${getRarityName(upgrade.rarity)} +${upgrade.probChange}%
            </span>
            <span class="upgrade-remaining">${upgrade.remaining} попыток</span>
        `;
        container.appendChild(upgradeElement);
    });
}

function updateCollectionStats() {
    const totalCards = cards.length;
    const collected = unlockedCards.length;
    const remaining = totalCards - collected;
    
    // Общая статистика
    document.getElementById('collectedCards').textContent = collected;
    document.getElementById('totalCards').textContent = totalCards;
    document.getElementById('remainingCards').textContent = remaining;
    
    // Статистика по редкостям
    const rarityProgress = document.getElementById('rarityProgress');
    rarityProgress.innerHTML = '';
    
    // Считаем карты по редкостям
    const rarityCounts = cards.reduce((acc, card) => {
        acc[card.rarity] = acc[card.rarity] || {total: 0, collected: 0};
        acc[card.rarity].total++;
        if (unlockedCards.includes(card.name)) acc[card.rarity].collected++;
        return acc;
    }, {});
    
    // Создаем элементы прогресса
    for (let rarity = 1; rarity <= 6; rarity++) {
        const data = rarityCounts[rarity] || {total: 0, collected: 0};
        const progress = data.total > 0 ? (data.collected / data.total * 100) : 0;
        
        const item = document.createElement('div');
        item.className = 'rarity-progress-item';
        item.innerHTML = `
            <div>${getRarityName(rarity).toUpperCase()} (${data.collected}/${data.total})</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
        `;
        rarityProgress.appendChild(item);
    }
}


// Функция вытягивания карты
async function drawCard() {
    if (isAnimationRunning) return;
    isAnimationRunning = true;

    try {
        // Обработка активных улучшений
        if (activeUpgrades.length > 0) {
            activeUpgrades.forEach(upgrade => {
                upgrade.remaining--;
                
                if (upgrade.remaining <= 0) {
                    raritySettings[1].probability += upgrade.probChange;
                    raritySettings[upgrade.rarity].probability -= upgrade.probChange;
                    normalizeProbabilities(upgrade.rarity);
                }
            });
            
            activeUpgrades = activeUpgrades.filter(upgrade => upgrade.remaining > 0);
            updateActiveUpgradesDisplay();
        }

        const card = getRandomCard();
        if (!card) return;

        rarityCounters[card.rarity]++;
        const cardNumber = rarityCounters[card.rarity];

        const pointsMap = { 1: 1, 2: 4, 3: 13, 4: 30, 5: 65, 6: 125 };
        points += pointsMap[card.rarity];
        updatePointsDisplay();

        const wrapper = document.createElement('div');
        wrapper.classList.add('card-wrapper');

        const cardBack = document.createElement('div');
        cardBack.classList.add('card', 'card-back', `rarity-${card.rarity}`);

        const cardFront = document.createElement('div');
        cardFront.classList.add('card', 'card-front', `rarity-${card.rarity}`);
        cardFront.style.backgroundImage = `url(${card.image})`;

        const typeElement = document.createElement('div');
        typeElement.classList.add('card-type', `rarity-${card.rarity}`);
        typeElement.innerHTML = `${card.type} <span class="card-number">№${cardNumber}</span>`;

        const titleElement = document.createElement('div');
        titleElement.classList.add('card-title');
        titleElement.textContent = card.name;

        cardFront.append(typeElement, titleElement);
        wrapper.append(cardBack, cardFront);
        cardDisplay.innerHTML = '';
        cardDisplay.append(wrapper);

        await animateCard(wrapper, cardFront, cardBack);

        const historyCard = createHistoryCardElement({ ...card, number: cardNumber });
        cardHistory.prepend(historyCard);

        unlockCard(card.name);
        saveData();

    } catch (error) {
        console.error('Ошибка анимации:', error);
    } finally {
        isAnimationRunning = false;
    }
}

updateActiveUpgradesDisplay();
// Загрузка данных при старте
loadSavedData();