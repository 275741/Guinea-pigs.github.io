const drawCardButton = document.getElementById('drawCard');
const cardContainer = document.getElementById('cardContainer');
const cardElement = document.querySelector('.card');
const rarityBar = document.getElementById('rarityBar');
const rarityName = document.getElementById('rarityName');
const cardImage = document.getElementById('cardImage');
const cardName = document.getElementById('cardName');
const musicToggle = document.getElementById('musicToggle');
const volumeSlider = document.getElementById('volumeSlider');
const shopIcon = document.querySelector('.shop-icon');
const shopPanel = document.querySelector('.shop-panel');
const coinDisplay = document.getElementById('piggyCoins');
const carrotIcon = document.querySelector('.carrot-icon');


let piggyCoins = 0;

let unlockedCards = [];
let allCards = cards.map((card, index) => {
    return {
        ...card,
        id: index + 1 // Добавляем уникальный ID к каждой карте
    };
});

const toggleCollectionBtn = document.getElementById('toggleCollectionBtn');
const unlockedCardsPanel = document.getElementById('unlockedCardsPanel');

let collectionHidden = false;


// Переключение видимости коллекции
toggleCollectionBtn.addEventListener('click', () => {
    collectionHidden = !collectionHidden;
    
    if (collectionHidden) {
        unlockedCardsPanel.classList.add('hidden');
        toggleCollectionBtn.classList.add('collapsed');
        toggleCollectionBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Коллекция';
    } else {
        unlockedCardsPanel.classList.remove('hidden');
        toggleCollectionBtn.classList.remove('collapsed');
        toggleCollectionBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Коллекция';
    }
});

// Переключение свертывания/развертывания панели
unlockedCardsPanel.querySelector('h2').addEventListener('click', () => {
    unlockedCardsPanel.classList.toggle('collapsed');
});

// Инициализация коллекции карт
function initCollection() {
    // Загружаем сохраненные карты из localStorage
    const savedCards = localStorage.getItem('unlockedCards');
    if (savedCards) {
        unlockedCards = JSON.parse(savedCards);
    }
    
    updateCollectionStats();
    updateUnlockedCardsGrid();
    setupFilters();
}

// Обновление статистики коллекции
function updateCollectionStats() {
    const totalCards = allCards.length;
    const collectedCards = unlockedCards.length;
    const remainingCards = totalCards - collectedCards;
    
    document.getElementById('collectedCards').textContent = collectedCards;
    document.getElementById('totalCards').textContent = totalCards;
    document.getElementById('remainingCards').textContent = remainingCards;
    
    updateRarityProgress();
}

// Обновление прогресса по редкостям
function updateRarityProgress() {
    const rarityProgress = document.getElementById('rarityProgress');
    rarityProgress.innerHTML = '';
    
    // Группируем карты по редкостям
    const rarityCounts = {
        common: { total: 0, collected: 0 },
        uncommon: { total: 0, collected: 0 },
        rare: { total: 0, collected: 0 },
        epic: { total: 0, collected: 0 },
        legendary: { total: 0, collected: 0 },
        mythical: { total: 0, collected: 0 }
    };
    
    // Считаем общее количество карт каждой редкости
    allCards.forEach(card => {
        rarityCounts[card.rarity].total++;
    });
    
    // Считаем собранные карты каждой редкости
    unlockedCards.forEach(cardId => {
        const card = allCards.find(c => c.id === cardId);
        if (card) {
            rarityCounts[card.rarity].collected++;
        }
    });
    
    // Создаем элементы прогресса для каждой редкости
    for (const rarity in rarityCounts) {
        const { total, collected } = rarityCounts[rarity];
        const progressItem = document.createElement('div');
        progressItem.className = 'rarity-progress-item';
        
        const progressPercent = total > 0 ? Math.round((collected / total) * 100) : 0;
        
        progressItem.innerHTML = `
            <div class="progress-info">
                <span class="rarity-name ${rarity}">${getRarityName(rarity)}</span>
                <span>${collected}/${total} (${progressPercent}%)</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill ${rarity}" style="width: ${progressPercent}%"></div>
            </div>
        `;
        
        rarityProgress.appendChild(progressItem);
    }
}

// Фоновая музыка
const bgMusic = new Audio('Guinea Pig Groove.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.2;

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


// Исправленный обработчик для магазина и настроек
document.addEventListener('DOMContentLoaded', function() {
    const settingsIcon = document.querySelector('.settings-icon');
    const settingsPanel = document.querySelector('.settings-panel');
    
    // Обработчик для настроек
    settingsIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        settingsPanel.classList.toggle('hidden');
        shopPanel.classList.add('hidden');
    });
    
    // Обработчик для магазина
    shopIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        shopPanel.classList.toggle('hidden');
        settingsPanel.classList.add('hidden');
    });
    
    // Закрытие при клике вне панелей
    document.addEventListener('click', function(e) {
        if (!settingsPanel.contains(e.target) && e.target !== settingsIcon) {
            settingsPanel.classList.add('hidden');
        }
        if (!shopPanel.contains(e.target) && e.target !== shopIcon) {
            shopPanel.classList.add('hidden');
        }
    });
    
    loadGameState();
    initCollection();
    updateActiveBoostsDisplay(); // Добавьте эту строку
    
    // Проверяем активные улучшения и обновляем их
    let anyActive = false;
    for (const rarity in activeBoosts) {
        if (activeBoosts[rarity].active) {
            anyActive = true;
            break;
        }
    }
    
    // Предотвращаем закрытие при клике внутри панелей
    settingsPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    shopPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});



// Переключение видимости коллекции
toggleCollectionBtn.addEventListener('click', () => {
    unlockedCardsPanel.classList.toggle('visible');
    toggleCollectionBtn.classList.toggle('collapsed');
    
    if (unlockedCardsPanel.classList.contains('visible')) {
        toggleCollectionBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Коллекция';
    } else {
        toggleCollectionBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Коллекция';
    }
});

// Убираем обработчик клика по заголовку, так как теперь используется только кнопка
unlockedCardsPanel.querySelector('h2').onclick = null;

// Активные улучшения
let activeBoosts = {
    duplicator: { active: false, turnsLeft: 0, timestamp: 0 },
    rare: { active: false, boost: 0, turnsLeft: 0, timestamp: 0 },
    epic: { active: false, boost: 0, turnsLeft: 0, timestamp: 0 },
    legendary: { active: false, boost: 0, turnsLeft: 0, timestamp: 0 },
    mythical: { active: false, boost: 0, turnsLeft: 0, timestamp: 0 }
};

// Исходные вероятности
const BASE_RARITY_PROBABILITIES = [
    { rarity: "common", probability: 61.75 },
    { rarity: "uncommon", probability: 23 },
    { rarity: "rare", probability: 9 },
    { rarity: "epic", probability: 4.6 },
    { rarity: "legendary", probability: 1.25 },
    { rarity: "mythical", probability: 0.4 }
];

let currentProbabilities = [...BASE_RARITY_PROBABILITIES];

function updateProbabilities() {
    // Полностью сбрасываем к базовым вероятностям
    currentProbabilities = JSON.parse(JSON.stringify(BASE_RARITY_PROBABILITIES));
    
    // Применяем активные улучшения
    for (const rarity in activeBoosts) {
        if (activeBoosts[rarity].active) {
            // Находим индекс улучшаемой редкости
            const boostIndex = currentProbabilities.findIndex(item => item.rarity === rarity);
            if (boostIndex !== -1) {
                // Увеличиваем вероятность для этой редкости
                currentProbabilities[boostIndex].probability += activeBoosts[rarity].boost;
                
                // Уменьшаем вероятность для common (можно изменить на другую редкость)
                const commonIndex = currentProbabilities.findIndex(item => item.rarity === "common");
                if (commonIndex !== -1) {
                    currentProbabilities[commonIndex].probability -= activeBoosts[rarity].boost;
                }
            }
        }
    }
}


// Обработчики кнопок покупки
document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', function() {
        const upgradeItem = this.closest('.upgrade-item');
        const rarity = upgradeItem.dataset.rarity;
        const price = parseInt(upgradeItem.querySelector('.price-control .static-value').textContent);
        const boost = parseFloat(upgradeItem.querySelector('.boost-control .static-value').textContent);
        const duration = parseInt(upgradeItem.querySelector('.duration-control .static-value').textContent);
        
        
        if (piggyCoins < price) {
            showMessage("Недостаточно монет!");
            return;
        }
        
        // Проверяем, не активно ли уже улучшение
        if (activeBoosts[rarity].active) {
            showMessage(`Улучшение ${rarity} уже активно!`);
            return;
        }
        
        // Покупка улучшения
        piggyCoins -= price;
        coinDisplay.textContent = piggyCoins;
        
        // Активируем улучшение
        activeBoosts[rarity] = {
            active: true,
            boost: boost,
            turnsLeft: duration,
            timestamp: Date.now() // Добавляем текущее время
        };
        
        // Обновляем вероятности
        updateProbabilities();
        
        // Обновляем список активных улучшений
        updateActiveBoostsDisplay();
        
        // Показываем сообщение об успешной покупке
        showMessage(`Улучшение ${rarity} активировано на ${duration} ходов!`);
        
        // Анимация покупки
        const coinAnimation = document.createElement('div');
        coinAnimation.className = 'coin-animation';
        coinAnimation.innerHTML = `<i class="fas fa-coins"></i> -${price}`;
        document.body.appendChild(coinAnimation);
        
        setTimeout(() => {
            coinAnimation.remove();
        }, 1500);
    });
});

// Функция обновления отображения активных улучшений
function updateActiveBoostsDisplay() {
    const activeBoostsList = document.getElementById('activeBoostsList');
    activeBoostsList.innerHTML = '';
    
    let hasActiveBoosts = false;
    
    for (const rarity in activeBoosts) {
        if (activeBoosts[rarity].active) {
            hasActiveBoosts = true;
            const boostItem = document.createElement('div');
            boostItem.className = `boost-item ${rarity}`;
            boostItem.innerHTML = `
                <div class="boost-info">
                    <div class="rarity-indicator ${rarity}"></div>
                    <span>${rarity.charAt(0).toUpperCase() + rarity.slice(1)} +${activeBoosts[rarity].boost}%</span>
                </div>
                <div class="boost-turns">Осталось ходов: ${activeBoosts[rarity].turnsLeft}</div>
            `;
            activeBoostsList.appendChild(boostItem);
        }
    }
    
    if (!hasActiveBoosts) {
        activeBoostsList.innerHTML = '<div class="no-boosts">Нет активных улучшений</div>';
    }
}


// Функция уменьшения счетчика ходов для активных улучшений
function decreaseBoostTurns() {
    let needsUpdate = false;
    
    for (const rarity in activeBoosts) {
        if (activeBoosts[rarity].active) {
            activeBoosts[rarity].turnsLeft--;
            activeBoosts[rarity].timestamp = Date.now();
            
            if (activeBoosts[rarity].turnsLeft <= 0) {
                activeBoosts[rarity].active = false;
                showMessage(`Улучшение ${rarity} закончилось!`);
                needsUpdate = true;
            }
        }
    }
    
    if (needsUpdate) {
        updateProbabilities();
        updateActiveBoostsDisplay();
        saveGameState();
    } else {
        // Обновляем отображение даже если улучшения еще активны
        updateActiveBoostsDisplay();
        saveGameState();
    }
}

// Значения монет по редкостям
const RARITY_VALUES = {
    common: 1,
    uncommon: 4,
    rare: 15,
    epic: 55,
    legendary: 100,
    mythical: 150
};

// Анимация морковки при наведении
carrotIcon.addEventListener('mouseover', () => {
    carrotIcon.style.animation = 'bounce 0.5s infinite alternate';
});

carrotIcon.addEventListener('mouseout', () => {
    carrotIcon.style.animation = 'bounce 0.8s infinite alternate';
});

function addCoins(amount) {
    piggyCoins += amount;
    coinDisplay.textContent = piggyCoins;
    saveGameState(); // Сохраняем состояние при изменении монет
    
    // Эффект получения монет
    const gainElement = document.createElement('div');
    gainElement.className = 'coin-gain';
    gainElement.textContent = `+${amount}`;
    document.querySelector('.carrot-coin').appendChild(gainElement);
    
    // Удаляем элемент после анимации
    setTimeout(() => {
        gainElement.remove();
    }, 1500);
    
    // Усиленная анимация морковки
    const carrot = document.querySelector('.carrot-icon');
    carrot.style.transform = 'scale(1.5) rotate(15deg)';
    
    // Анимация баланса
    const balance = document.querySelector('.balance-container');
    balance.style.transform = 'scale(1.1)';
    balance.style.boxShadow = '0 0 20px rgba(8, 25, 182, 0.7)';
    
    setTimeout(() => {
        carrot.style.transform = 'scale(1) rotate(0)';
        balance.style.transform = 'scale(1)';
        balance.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
    }, 500);
}

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

function getRarityName(rarity) {
    const names = {
        common: 'Обычные',
        uncommon: 'Необычные',
        rare: 'Редкие',
        epic: 'Эпические',
        legendary: 'Легендарные',
        mythical: 'Мифические'
    };
    return names[rarity] || rarity;
}


// Обновление сетки собранных карт
function updateUnlockedCardsGrid(filterRarity = 'all') {
    const grid = document.getElementById('unlockedCardsGrid');
    if (!grid) return; // Добавляем проверку на существование элемента
    
    grid.innerHTML = '';
    
    // Фильтрация карт по редкости
    let filteredCards = allCards;
    if (filterRarity !== 'all') {
        filteredCards = allCards.filter(card => card.rarity === filterRarity);
    }
    
    // Сортировка карт: сначала собранные, затем несобранные
    filteredCards.sort((a, b) => {
        const aUnlocked = unlockedCards.includes(a.id);
        const bUnlocked = unlockedCards.includes(b.id);
        
        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return 0;
    });
    
    // Создание карточек
    filteredCards.forEach(card => {
        const isUnlocked = unlockedCards.includes(card.id);
        const cardElement = document.createElement('div');
        cardElement.className = `unlocked-card ${card.rarity} ${isUnlocked ? 'unlocked' : 'locked'}`;
        cardElement.dataset.id = card.id;
        cardElement.dataset.rarity = card.rarity;
        
        if (isUnlocked) {
            cardElement.innerHTML = `
                <img src="${card.image}" alt="${card.name}">
                <div class="card-name">${card.name}</div>
            `;
        } else {
            cardElement.innerHTML = `
                <div class="question-mark">?</div>
                <div class="card-name">Неизвестно</div>
            `;
        }
        
        // Добавляем информацию о редкости
        const rarityBadge = document.createElement('div');
        rarityBadge.className = `rarity-badge ${card.rarity}`;
        rarityBadge.textContent = getRarityName(card.rarity).charAt(0);
        cardElement.appendChild(rarityBadge);
        
        // Добавляем подсказку при наведении
        cardElement.title = isUnlocked ? card.name : 'Карта еще не разблокирована';
        
        grid.appendChild(cardElement);
    });
}

// Настройка фильтров
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            button.classList.add('active');
            
            // Обновляем сетку с выбранным фильтром
            const rarity = button.dataset.rarity;
            updateUnlockedCardsGrid(rarity);
        });
    });
}

// Добавление новой карты в коллекцию
function addCardToCollection(card) {
    if (!unlockedCards.includes(card.id)) {
        unlockedCards.push(card.id);
        localStorage.setItem('unlockedCards', JSON.stringify(unlockedCards));
        updateCollectionStats();
        updateUnlockedCardsGrid();
        
        // Показываем анимацию для новой карты
        highlightNewCard(card.id);
    }
}

// Подсветка новой карты
function highlightNewCard(cardId) {
    const cardElement = document.querySelector(`.unlocked-card[data-id="${cardId}"]`);
    if (cardElement) {
        cardElement.classList.add('new-card');
        
        setTimeout(() => {
            cardElement.classList.remove('new-card');
        }, 3000);
    }
}


// Обновите группировку карт по редкостям
const cardsByRarity = allCards.reduce((acc, card) => {
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

    const rarity = selectRarity();
    const firstCard = selectCard(rarity);
    
    if (activeBoosts.duplicator.active) {
        // Если дубликатор активен, выбираем вторую карту той же редкости, но не такую же
        let secondCard;
        do {
            secondCard = selectCard(rarity);
        } while (secondCard.name === firstCard.name);
        
        // Показываем обе карты
        showTwoCards(firstCard, secondCard, rarity);
    } else {
        // Обычный режим - одна карта
        showSingleCard(firstCard, rarity);
    }
});

function showSingleCard(card, rarity) {
    // Удаляем класс дубликатора, если был
    cardContainer.classList.remove('duplicator-active');
    
    // Удаляем вторую карту, если она есть
    const secondCard = document.querySelector('.card:not(:first-child)');
    if (secondCard) secondCard.remove();
    
    // Обновляем интерфейс карты
    updateCardInterface(card, cardElement);
    
    // Позиционируем карту по центру
    cardElement.style.transform = 'rotateY(0deg) scale(1.1)';
    cardElement.style.left = '';
    cardElement.style.right = '';
    
    // Воспроизводим звук редкости
    playRaritySound(rarity);
    
    const isLegendary = rarity === 'legendary';
    const flipDuration = isLegendary ? 900 : 800;
    const showDuration = isLegendary ? 2000 : 1800;
    
    // Анимация карты
    setTimeout(() => {
        cardElement.style.transform = 'rotateY(0deg) scale(1.15)';
        
        setTimeout(() => {
            if (isLegendary) {
                const questionMark = document.querySelector('.question');
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
    
    setTimeout(() => {
        const coinsToAdd = RARITY_VALUES[rarity] || 1;
        addCoins(coinsToAdd);
        addCardToCollection(card);
        decreaseBoostTurns(); // Здесь обновляются счетчики
    }, showDuration + 500);
    
}


function showTwoCards(card1, card2, rarity) {
    // Добавляем класс для дубликатора
    cardContainer.classList.add('duplicator-active');
    
    // Создаем клон карты
    const cardClone = cardElement.cloneNode(true);
    cardContainer.appendChild(cardClone);
    
    // Настраиваем оригинальную карту (левая)
    updateCardInterface(card1, cardElement);
    cardElement.style.left = '';
    cardElement.style.right = '';
    cardElement.style.margin = '0 5px';
    
    // Настраиваем клонированную карту (правая)
    updateCardInterface(card2, cardClone);
    cardClone.style.left = '';
    cardClone.style.right = '';
    cardClone.style.margin = '0 5px';
    
    // Позиционируем карты
    cardElement.style.transform = 'rotateY(0deg) scale(1.1)';
    cardClone.style.transform = 'rotateY(0deg) scale(1.1)';
    
    playRaritySound(rarity);
    
    const isLegendary = rarity === 'legendary';
    const flipDuration = isLegendary ? 900 : 800;
    const showDuration = isLegendary ? 2000 : 1800;
    
    // Анимация обеих карт
    setTimeout(() => {
        cardElement.style.transform = 'rotateY(0deg) scale(1.15)';
        cardClone.style.transform = 'rotateY(0deg) scale(1.15)';
        
        setTimeout(() => {
            if (isLegendary) {
                const questionMarks = document.querySelectorAll('.question');
                questionMarks.forEach(q => q.classList.add('active'));
                
                cardElement.style.boxShadow = '0 0 30px 10px rgba(255, 215, 0, 0.7)';
                cardClone.style.boxShadow = '0 0 30px 10px rgba(255, 215, 0, 0.7)';
                
                createLegendaryEffect(cardContainer, () => {
                    questionMarks.forEach(q => q.classList.remove('active'));
                    flipTwoCards(cardElement, cardClone, cardContainer, flipDuration, showDuration, drawCardButton, true);
                });
            } else {
                flipTwoCards(cardElement, cardClone, cardContainer, flipDuration, showDuration, drawCardButton, false);
            }
        }, isLegendary ? 700 : 500);
    }, isLegendary ? 300 : 200);
    
    setTimeout(() => {
        const coinsToAdd = RARITY_VALUES[rarity] * 2 || 2;
        addCoins(coinsToAdd);
        addCardToCollection(card1); // Добавляем эту строку
        addCardToCollection(card2); // Добавляем эту строку
        decreaseBoostTurns();
    }, showDuration + 500);
}

function flipTwoCards(card1, card2, container, flipDuration, showDuration, button, isLegendary) {
    card1.style.transform = 'rotateY(180deg) scale(1)';
    card2.style.transform = 'rotateY(180deg) scale(1)';
    card1.style.transition = card2.style.transition = `transform ${flipDuration/1000}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    
    if (isLegendary) {
        setTimeout(() => {
            card1.style.boxShadow = card2.style.boxShadow = '0 0 50px 15px rgba(255, 215, 0, 0.9)';
            setTimeout(() => {
                card1.style.boxShadow = card2.style.boxShadow = '0 0 18px 2px #ffe600, 0 0 22px 4px #ff7b00';
            }, 300);
        }, flipDuration / 2);
    }
    
    setTimeout(() => {
        hideTwoCards(container, button, card1, card2);
    }, showDuration);
}

function hideTwoCards(container, button, card1, card2) {
    container.style.transition = 'all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)';
    container.style.opacity = '0';
    container.style.transform = 'translateY(-50px) scale(0.9)';
    
    setTimeout(() => {
        container.classList.add('hidden');
        container.classList.remove('duplicator-active');
        container.style.transition = 'none';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0) scale(1)';
        button.disabled = false;
        card1.style.boxShadow = card2.style.boxShadow = '';
        card1.style.transform = 'rotateY(0deg) scale(1)';
        card2.remove(); // Удаляем клонированную карту
    }, 600);
}

// Инициализация баланса
coinDisplay.textContent = piggyCoins;

// Функция показа сообщений
function showMessage(text) {
    const message = document.createElement('div');
    message.className = 'shop-message';
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => {
            message.remove();
        }, 500);
    }, 3000);
}

function flipCard(cardElement, cardContainer, flipDuration, showDuration, button, isLegendary) {
    cardElement.style.transform = 'translateX(-50%) rotateY(180deg) scale(1)';
    cardElement.style.transition = `transform ${flipDuration/1000}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    
    if (isLegendary) {
        setTimeout(() => {
            cardElement.style.boxShadow = '0 0 50px 15px rgba(255, 215, 0, 0.9)';
            setTimeout(() => {
                cardElement.style.boxShadow = '0 0 18px 2px #ffe600, 0 0 22px 4px #ff7b00';
            }, 300);
        }, flipDuration / 2);
    }
    
    setTimeout(() => {
        hideCardContainer(cardContainer, button, cardElement);
    }, showDuration);
}

// Добавляем стили для сообщений и анимации монет
const style = document.createElement('style');
style.textContent = `
    .shop-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 2000;
        animation: fadeIn 0.3s;
        box-shadow: 0 0 20px rgba(255, 165, 0, 0.5);
        border: 1px solid #ffa500;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -40%); }
        to { opacity: 1; transform: translate(-50%, -50%); }
    }
    
    .coin-animation {
        position: fixed;
        top: 100px;
        right: 100px;
        font-size: 24px;
        color: gold;
        animation: coinFly 1.5s forwards;
        z-index: 2000;
    }
    
    @keyframes coinFly {
        0% { transform: translate(0, 0); opacity: 1; }
        100% { transform: translate(0, -100px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Модифицируем функцию выбора редкости для использования текущих вероятностей
function selectRarity() {
    let random = Math.random() * 100;
    for (const { rarity, probability } of currentProbabilities) {
        if (random < probability) return rarity;
        random -= probability;
    }
    return "common";
}

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

function updateCardInterface(card, element = cardElement) {
    const rarityBar = element.querySelector('.rarity-bar') || document.getElementById('rarityBar');
    const rarityName = element.querySelector('.rarity-name') || document.getElementById('rarityName');
    const cardImage = element.querySelector('.card-image') || document.getElementById('cardImage');
    const cardName = element.querySelector('.card-name') || document.getElementById('cardName');
    
    rarityBar.className = `rarity-bar ${card.rarity}`;
    rarityName.textContent = card.rarityText;
    rarityName.className = `rarity-name ${card.rarity}`;
    element.className = `card ${card.rarity}`;
    cardImage.src = card.image;
    cardName.textContent = card.name;
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

function hideCardContainer(container, button, cardElement) {
    container.style.transition = 'all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)';
    container.style.opacity = '0';
    container.style.transform = 'translateY(-50px) scale(0.9)';
    
    setTimeout(() => {
        container.classList.add('hidden');
        container.style.transition = 'none';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0) scale(1)';
        button.disabled = false;
        cardElement.style.boxShadow = '';
        cardElement.style.transform = 'translateX(-50%) rotateY(0deg) scale(1)'; // Сброс позиции
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

function playRaritySound(rarity) {
    if (raritySounds[rarity]) {
        raritySounds[rarity].currentTime = 0;
        raritySounds[rarity].play();
    }
}

function saveGameState() {
    const gameState = {
        piggyCoins: piggyCoins,
        unlockedCards: unlockedCards,
        activeBoosts: activeBoosts
    };
    localStorage.setItem('piggyGameState', JSON.stringify(gameState));
}


// Модифицируйте функцию loadGameState:
function loadGameState() {
    const savedState = localStorage.getItem('piggyGameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        
        piggyCoins = gameState.piggyCoins || 0;
        coinDisplay.textContent = piggyCoins;
        
        unlockedCards = gameState.unlockedCards || [];
        
        if (gameState.activeBoosts) {
            // Просто восстанавливаем состояние без учета прошедшего времени
            for (const rarity in gameState.activeBoosts) {
                if (gameState.activeBoosts[rarity].active) {
                    activeBoosts[rarity] = {
                        ...gameState.activeBoosts[rarity],
                        timestamp: Date.now() // Обновляем метку времени
                    };
                }
            }
            
            updateActiveBoostsDisplay();
            updateProbabilities();
        }
    }
}
