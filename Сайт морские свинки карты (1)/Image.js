const cards = [
    // Обычные карты (общая вероятность 61%)
    { 
        type: 'Обычная карта', 
        image: '5267knzNOqvAGRK0Ler-TzpJ12MzbeiFnNpSd1cQmc2XQMKQgsns7dDfriF6SH3DkiYt3MIR3FQ6nLtivovLfYgY.jpg', 
        name: 'Обычная свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: 'p7BdS30KoRP75k8uHdoOfyQqGQ4-200.jpg', 
        name: 'Радостная свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: 'EMaifjvtYh4.jpg', 
        name: 'Белая свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: 'd92c070f48d46b2f419d6bd2254b32e9.jpg', 
        name: 'Задумчивая свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: 'e93141d1d319442f60e500833ed4ffb5.jpg', 
        name: 'Постельная свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: '50009bdf1c63a9f14038d9614c21aab3.jpg', 
        name: 'Упитанная свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: 'www.jigsawplanet.com-2b45e69575be.jpg', 
        name: 'Счастливая свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: 'u8V2VBeBRn0.jpg', 
        name: 'Чиловая свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: 'e7b80486ab8d42e58ff8b5c7d36df332.jpg', 
        name: 'Прожорливая свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: 'morskaia_svinka_gryzun_tsvety_103748_540x960.jpg', 
        name: 'Ненасытная свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: '2c35c11989b35903c8181fa03fe702c8.jpg', 
        name: 'Любопытная свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: 'quarantine.jpg', 
        name: 'Грустная свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: '8gCaGxd8pop_mLt3EILqubQk0Tiw1yXqLCl2AkdWlM2AgLtauX3hoysahaqqYXiWUrjntE46Gxt93VCXnfKbDAiz.jpg', 
        name: 'Умная свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: '114697418_f316415cf2_h.jpg', 
        name: 'Подозрительная свинка', 
        rarity: 1
    },
    { 
        type: 'Обычная карта', 
        image: 'screen-5.jpg', 
        name: 'Удивленные свинки', 
        rarity: 1
    },
    


    // Необычные карты (20%)
    { 
        type: 'Необычная карта', 
        image: 'b166aef39cecfb52c00c43e8ad68498e.jpg', 
        name: 'Мини свинка', 
        rarity: 2
    },
    { 
        type: 'Необычная карта', 
        image: 'unnamed.png', 
        name: 'Пиксельная свинка', 
        rarity: 2
    },
    { 
        type: 'Необычная карта', 
        image: '2rLbTBVQeZ3kkgiHudJqZD-480-80.jpg', 
        name: 'Хищная свинка', 
        rarity: 2
    },
    { 
        type: 'Необычная карта', 
        image: '2794c724959f1eb3fb23bee49162f147.jpeg', 
        name: 'Джентльмен свинка', 
        rarity: 2
    },
    { 
        type: 'Необычная карта', 
        image: 'e9da256d4bd47db5360ade099f1a468b.jpg', 
        name: 'Стильная свинка', 
        rarity: 2
    },
    { 
        type: 'Необычная карта', 
        image: '35e589b9691afdd68c1a5c4720ecca72.jpg', 
        name: 'Лего свинка', 
        rarity: 2
    },
    { 
        type: 'Необычная карта', 
        image: '3b77062b8c9811ee812792669a1675b3_upscaled.jpg', 
        name: 'Аниме свинка', 
        rarity: 2
    },
    { 
        type: 'Необычная карта', 
        image: '150719_9-1536x1024.jpg', 
        name: 'Стайные свинки', 
        rarity: 2
    },
    { 
        type: 'Необычная карта', 
        image: 'f249f9330a1711f09619f600b5cb441c_1.jpg', 
        name: 'Свинка на капибаре', 
        rarity: 2
    },
    { 
        type: 'Необычная карта', 
        image: 'bec9780d8886500171175a06846fb6d4.jpg', 
        name: 'Свинка с уточкой', 
        rarity: 2
    },
    { 
        type: 'Необычная карта', 
        image: 'b65afc17afa845985d29979e1b864146.jpg', 
        name: 'Спящая свинка', 
        rarity: 2
    },


    // Редкие карты (10%)
    { 
        type: 'Редкая карта', 
        image: 'RmqepBjiYDiwGEMHl72Sf-2N-TusFOnZcjpRVEGvtvZQonb8yAUu-oKozUJslexiiDEFQBjXWrYgbmwcN1WPXGid.jpg', 
        name: 'Санта свинка', 
        rarity: 3
    },
    { 
        type: 'Редкая карта', 
        image: '9e3d002d914731fa1fe998c93cd0682e.jpg', 
        name: 'Рыцарь свинка', 
        rarity: 3
    },
    { 
        type: 'Редкая карта', 
        image: '958e14da0a28bbc8ba44d3d06c1d11f3.jpg', 
        name: 'Хэллоуинская свинка', 
        rarity: 3
    },
    { 
        type: 'Редкая карта', 
        image: 'QWuucJbVik4.jpg', 
        name: 'Пасхальная свинка', 
        rarity: 3
    },
    { 
        type: 'Редкая карта', 
        image: 'svinok-morskih-kospley-kartinki-koshki-sobaki-smeshnye-zhivotnye-kote_5333246055.jpg', 
        name: 'Индустриальная свинка', 
        rarity: 3
    },
    { 
        type: 'Редкая карта', 
        image: 'frrwLxood8c.jpg', 
        name: 'Масленичная свинка', 
        rarity: 3
    },
    { 
        type: 'Редкая карта', 
        image: '5fcd0afb4ea7511_upscaled.jpg', 
        name: 'Космическая свинка', 
        rarity: 3
    },
    { 
        type: 'Редкая карта', 
        image: '3198e1010a0711f084ec16beb6212b65_1.jpg', 
        name: 'Свинка святого валентина', 
        rarity: 3
    },
    { 
        type: 'Редкая карта', 
        image: '18192733_1082860858514563_1967571560850590046_o.jpg', 
        name: 'Полицейская свинка', 
        rarity: 3
    },
    { 
        type: 'Редкая карта', 
        image: 'EVfRbEGUwAIbWMg.jpeg', 
        name: 'Мона свинка', 
        rarity: 3
    },


    // Эпические карты (6%)
    { 
        type: 'Эпическая карта', 
        image: 'meEvXTqfrJ8.jpg', 
        name: 'Галактическая свинка', 
        rarity: 4
    },
    { 
        type: 'Эпическая карта', 
        image: '1671567718_7-poknok-art-p-golubaya-morskaya-svinka-8.jpg', 
        name: 'Рентгеновская свинка', 
        rarity: 4
    },
    { 
        type: 'Эпическая карта', 
        image: '5e0d9546457b32e6613329909a1cedce--witch-costumes-pet-halloween-costumes.jpg', 
        name: 'Чародей свинка', 
        rarity: 4
    },
    { 
        type: 'Эпическая карта', 
        image: 'b230fb59091961.5a14c8dc117a2.jpg', 
        name: 'Небесная свинка', 
        rarity: 4
    },
    { 
        type: 'Эпическая карта', 
        image: '1618132829_42-p-morskaya-svinka-pushistaya-zhivotnie-krasi-44.jpg-angorskaya-morskaya-svinka.jpg', 
        name: 'Старейшина свинок', 
        rarity: 4
    },
    { 
        type: 'Эпическая карта', 
        image: '6ddf65950a0211f0bfe492b8f41e43a3_1.jpg', 
        name: 'Радужная свинка', 
        rarity: 4
    },
    { 
        type: 'Эпическая карта', 
        image: '1743054848828-73.jpg', 
        name: 'Предсказатель свинка', 
        rarity: 4
    },
    { 
        type: 'Эпическая карта', 
        image: '1743054521888-478.jpg', 
        name: 'Кощей свинка', 
        rarity: 4
    },
    { 
        type: 'Эпическая карта', 
        image: 'ава2в.png', 
        name: 'Ангел свинка', 
        rarity: 4
    },
    { 
        type: 'Эпическая карта', 
        image: '356.png', 
        name: 'Радиоактивная свинка', 
        rarity: 4
    },

    // Легендарные карты (3%)
    { 
        type: 'Легендарная карта', 
        image: '1eb3611f161fd0347dc7e50ab7eb764f.jpg', 
        name: 'Король Пиратов', 
        rarity: 5
    },
    { 
        type: 'Легендарная карта', 
        image: 'channels4_profile.jpg', 
        name: 'Королевская свинка', 
        rarity: 5
    },
    { 
        type: 'Легендарная карта', 
        image: 'vu-gD7X4cD4.jpg', 
        name: 'Золотая свинка', 
        rarity: 5
    },
    { 
        type: 'Легендарная карта', 
        image: '45b5094b0a0411f098c282e5ad6ac9f8_1.jpg', 
        name: 'Тёмный лорд свинок', 
        rarity: 5
    },
    { 
        type: 'Легендарная карта', 
        image: 'flow-1743056785357.png', 
        name: 'Высший белый маг', 
        rarity: 5
    },
    { 
        type: 'Легендарная карта', 
        image: 'flow-1743056975597.png', 
        name: 'Высший темный маг', 
        rarity: 5
    },


    // Мифические карты (0.4%)
    { 
        type: 'Мифическая карта', 
        image: 'gjfghg.png', 
        name: 'Прародитель свинок', 
        rarity: 6
    },
    { 
        type: 'Мифическая карта', 
        image: 'gfdgbd.png', 
        name: 'Древняя свинка', 
        rarity: 6
    },
    { 
        type: 'Мифическая карта', 
        image: 'fabula-ai (1).png', 
        name: 'Вестник смерти', 
        rarity: 6
    }
];