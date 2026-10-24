import { GameInfo, DeliveryMethod, ServerRate, CommunityReview } from '../types';

export const ALL_BLACK_RUSSIA_SERVERS = [
  '1 — RED',
  '2 — GREEN',
  '3 — BLUE',
  '4 — YELLOW',
  '5 — ORANGE',
  '6 — PURPLE',
  '7 — LIME',
  '8 — PINK',
  '9 — CHERRY',
  '10 — BLACK',
  '11 — INDIGO',
  '12 — WHITE',
  '13 — MAGENTA',
  '14 — CRIMSON',
  '15 — GOLD',
  '16 — AZURE',
  '17 — PLATINUM',
  '18 — AQUA',
  '19 — GRAY',
  '20 — ICE',
  '21 — CHILLI',
  '22 — CHOCO',
  '23 — MOSCOW',
  '24 — SPB',
  '25 — UFA',
  '26 — SOCHI',
  '27 — KAZAN',
  '28 — SAMARA',
  '29 — ROSTOV',
  '30 — ANAPA',
  '31 — EKATERINBURG',
  '32 — KRASNODAR',
  '33 — ARZAMAS',
  '34 — NOVOSIBIRSK',
  '35 — GROZNY',
  '36 — SARATOV',
  '37 — OMSK',
  '38 — IRKUTSK',
  '39 — VOLGOGRAD',
  '40 — VORONEZH',
  '41 — BELGOROD',
  '42 — MAKHACHKALA',
  '43 — VLADIKAVKAZ',
  '44 — VLADIVOSTOK',
  '45 — KALININGRAD',
  '46 — CHELYABINSK',
  '47 — KRASNOYARSK',
  '48 — CHEBOKSARY',
  '49 — KHABAROVSK',
  '50 — PERM',
  '51 — TULA',
  '52 — RYAZAN',
  '53 — MURMANSK',
  '54 — PENZA',
  '55 — KURSK',
  '56 — ARKHANGELSK',
  '57 — ORENBURG',
  '58 — KIROV',
  '59 — KEMEROVO',
  '60 — TYUMEN',
  '61 — TOLYATTI',
  '62 — IVANOVO',
  '63 — STAVROPOL',
  '64 — SMOLENSK',
  '65 — PSKOV',
  '66 — BRYANSK',
  '67 — OREL',
  '68 — YAROSLAVL',
  '69 — BARNAUL',
  '70 — LIPETSK',
  '71 — ULYANOVSK',
  '72 — YAKUTSK',
  '73 — TAMBOV',
  '74 — BRATSK',
  '75 — ASTRAKHAN',
  '76 — CHITA',
  '77 — KOSTROMA',
  '78 — VLADIMIR',
  '79 — KALUGA',
  '80 — NIZHNY NOVGOROD',
  '81 — TAGANROG',
  '82 — VOLOGDA',
  '83 — TVER',
  '84 — TOMSK',
  '85 — IZHEVSK',
  '86 — SURGUT',
  '87 — PODOLSK',
  '88 — MAGADAN',
  '89 — CHEREPOVETS',
  '90 — NORILSK',
  '91 — ASTANA',
  '92 — TASHKENT',
  '00 — RIO'
];

export const GAMES_DATA: GameInfo[] = [
  {
    id: 'black_russia',
    name: 'Black Russia (CRMP)',
    tagline: 'Самый масштабный мобильный криминальный проект в СНГ',
    currencyName: 'Вирты (игровые рубли)',
    currencyUnit: '1 000 000 ₽',
    defaultRateRub: 80, // Фиксированный курс покупки: 1кк = 80 рублей
    buybackRateRub: 35, // Фиксированный курс скупки: 1кк = 35 рублей
    buybackUnit: '35 ₽ / 1кк',
    minAmount: 1,
    maxAmount: 200,
    stepAmount: 1,
    popularServers: ['23 — MOSCOW', '24 — SPB', '1 — RED', '26 — SOCHI', '31 — EKATERINBURG', '91 — ASTANA', '92 — TASHKENT'],
    allServers: ALL_BLACK_RUSSIA_SERVERS,
    officialDonateRatio: '1 ₽ официального доната = 1 000 ₽ виртов (1кк в игре = 1 000 ₽)',
    riskLevel: 'Критический',
    description: 'Покупка виртов по 80 ₽/1кк и моментальная скупка по 35 ₽/1кк на всех 90+ серверах Black Russia.',
    imagePath: '/src/assets/images/black_russia_thumb_1792789072179.jpg',
    bannerPath: '/src/assets/images/black_russia_hero_1792789070558.jpg'
  },
  {
    id: 'standoff2',
    name: 'Standoff 2',
    tagline: 'Популярный мобильный шутер со скинами и трейд-рынком',
    currencyName: 'Золото (Gold / G)',
    currencyUnit: '100 G',
    defaultRateRub: 80, // Фиксированный курс покупки: 100 G = 80 рублей
    buybackRateRub: 45, // Фиксированный курс скупки: 100 G = 45 рублей
    buybackUnit: '45 ₽ / 100 G',
    minAmount: 1,
    maxAmount: 50,
    stepAmount: 1,
    popularServers: ['Global Market (Рынок скинов)', 'RU Server (Лобби трейд)', 'EU Server (Лобби трейд)'],
    allServers: ['Global Market (Рынок скинов)', 'RU Server (Лобби трейд)', 'EU Server (Лобби трейд)'],
    officialDonateRatio: '100G в игре = ~160-180 ₽ с комиссией',
    riskLevel: 'Низкий',
    description: 'Покупка золота по 80 ₽/100G (покрытие комиссии 20%) и скупка голды у игроков по 45 ₽/100G с моментальной выплатой на СБП и карты.',
    imagePath: '/src/assets/images/standoff_thumb_1792789071379.jpg',
    bannerPath: '/src/assets/images/standoff_hero_1792789072072.jpg'
  }
];

export const STANDOFF2_DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 'so2_market_skin',
    name: 'Выкуп скина на рынке (Marketplace)',
    shortDesc: 'Покупка вашего скина с покрытием 20% комиссии разработчиков',
    fullDesc: 'Вы выставляете любой скин (Common/Uncommon с уникальной ценой, например 542.13 G). Курьер NetBana моментально находит и выкупает лот, покрывая 20% комиссии игры за наш счет. Баланс пополняется чистым золотом.',
    safetyScore: 99,
    riskLevel: 'Низкий',
    estimatedTimeMin: '3-7 мин',
    recommendation: 'Основной и самый быстрый метод в Standoff 2. Без передачи логина и пароля.',
    adminLogRisk: 'Легальная покупка скина на внутриигровой торговой площадке Axlebolt.'
  },
  {
    id: 'so2_private_trade',
    name: 'Прямой трейд скина / ножа в лобби',
    shortDesc: 'Трейд ножа, перчаток или тайного скина через приватное лобби',
    fullDesc: 'Курьер подключается к вашему лобби по ID игрока и передает согласованный предмет (нож Karambit, Butterfly, перчатки или винтовку) прямо в инвентарь через официальное меню обмена.',
    safetyScore: 97,
    riskLevel: 'Низкий',
    estimatedTimeMin: '5-12 мин',
    recommendation: 'Идеально для получения конкретных скинов без ожидания на рынке.',
    adminLogRisk: 'Официальный функционал трейдов Standoff 2.'
  }
];

// Настоящие способы передачи в Black Russia (никаких вымышленных палаток!)
export const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 'bank_transfer',
    name: 'Банковский перевод (/bank)',
    shortDesc: 'Прямой перевод на личный счет в банке Арзамаса или Южного',
    fullDesc: 'Курьер прибывает в центральное отделение банка и оформляет перевод на ваш счет через банковский терминал (/bank). Для безопасности перед переводом разыгрывается короткая RP-легенда в чате.',
    safetyScore: 96,
    riskLevel: 'Низкий',
    estimatedTimeMin: '3-8 мин',
    recommendation: 'Основной и самый популярный способ в Black Russia. Быстрое пополнение счета персонажа.',
    adminLogRisk: 'RP-диалог в чате исключает подозрения тех. администрации.'
  },
  {
    id: 'trade_exchange',
    name: 'Безопасный трейд (/trade)',
    shortDesc: 'Личная передача валюты через игровое окно обмена /trade',
    fullDesc: 'Курьер назначает встречу в уединенном месте (например, возле поселка Егоровка или на парковке). Передача оформляется через системное меню обмена /trade с символической передачей мелкого предмета.',
    safetyScore: 97,
    riskLevel: 'Низкий',
    estimatedTimeMin: '5-10 мин',
    recommendation: 'Максимальная безопасность при прямом взаимодействии персонажей.',
    adminLogRisk: 'Используется официальное окно обмена игры.'
  },
  {
    id: 'family_safe',
    name: 'Семейный сейф / Общак (/fmenu)',
    shortDesc: 'Внесение средств на баланс сейфа семьи (фамы)',
    fullDesc: 'Курьер получает временный доступ в семью или приглашает вас, после чего вносит сумму в сейф через /fmenu. Вы забираете вирты без личного контакта.',
    safetyScore: 98,
    riskLevel: 'Низкий',
    estimatedTimeMin: '7-15 мин',
    recommendation: 'Идеально для крупных сумм от 20кк и лидеров/заместителей семей.',
    adminLogRisk: 'Пополнение общака не отслеживается индивидуальными алгоритмами логов.'
  },
  {
    id: 'car_exchange',
    name: 'Продажа / обмен авто (/sellmycar)',
    shortDesc: 'Сделка через продажу автомобиля курьеру с доплатой',
    fullDesc: 'Передача средств маскируется под покупку курьером вашего бюджетного автомобиля или мотоцикла по согласованной стоимости с помощью команды /sellmycar или /changecar.',
    safetyScore: 94,
    riskLevel: 'Низкий',
    estimatedTimeMin: '10-20 мин',
    recommendation: 'Отличный метод для маскировки передачи крупных сумм от 30кк до 100кк.',
    adminLogRisk: 'Сделка оформляется как легальная продажа прокачанного автомобиля.'
  }
];

export const BLACK_RUSSIA_SELL_METHODS: DeliveryMethod[] = [
  {
    id: 'br_sell_bank',
    name: 'Перевод на счет скупщика (/bank)',
    shortDesc: 'Быстрый перевод виртов на указанный счет курьера в банке',
    fullDesc: 'Вы приезжаете в банк и переводите сумму виртов на номер счета скупщика NetBana. После подтверждения транзакции оператор моментально переводит деньги на вашу карту или СБП.',
    safetyScore: 98,
    riskLevel: 'Низкий',
    estimatedTimeMin: '3-5 мин',
    recommendation: 'Самый быстрый способ сдать вирты с автоматической сверкой чека.',
    adminLogRisk: 'Защищенная RP-легенда взаиморасчетов между игроками.',
    mode: 'sell'
  },
  {
    id: 'br_sell_trade',
    name: 'Передача через трейд (/trade)',
    shortDesc: 'Встреча в безопасной зоне и передача виртов через окно обмена',
    fullDesc: 'Встречаетесь с курьером магазина в условленной точке (автосалон, квартира или банк) и передаете валюту через официальное меню обмена /trade.',
    safetyScore: 96,
    riskLevel: 'Низкий',
    estimatedTimeMin: '5-8 мин',
    recommendation: 'Удобно для сумм до 25кк.',
    adminLogRisk: 'Стандартный лог игрового обмена.',
    mode: 'sell'
  },
  {
    id: 'br_sell_car',
    name: 'Продажа авто курьеру (/sellmycar)',
    shortDesc: 'Скупщик покупает ваш транспорт по сумме заказа',
    fullDesc: 'Идеально для крупных партий от 30кк. Курьер покупает ваш автомобиль за согласованную сумму виртов, после чего вы получаете полную выплату в рублях.',
    safetyScore: 99,
    riskLevel: 'Низкий',
    estimatedTimeMin: '7-12 мин',
    recommendation: 'Максимальная защита при сдаче крупных объемов от 30кк до 150кк.',
    adminLogRisk: 'Официальная покупка транспорта на Б/У рынке.',
    mode: 'sell'
  }
];

export const STANDOFF2_SELL_METHODS: DeliveryMethod[] = [
  {
    id: 'so2_sell_market_skin',
    name: 'Выкуп скина скупщика на рынке',
    shortDesc: 'Вы выкупаете дешевый скин курьера за оговоренную голду',
    fullDesc: 'Курьер NetBana выставляет дешевый скин с уникальным ценником на рынок Standoff 2. Вы выкупаете этот лот со своего аккаунта. Сразу после списания голды мы переводим рубли на вашу карту или СБП.',
    safetyScore: 99,
    riskLevel: 'Низкий',
    estimatedTimeMin: '2-5 мин',
    recommendation: 'Моментальная скупка без передачи аккаунта или паролей.',
    adminLogRisk: 'Обычная рыночная транзакция в экосистеме Axlebolt.',
    mode: 'sell'
  },
  {
    id: 'so2_sell_lobby_trade',
    name: 'Прямая передача скина / ножа в лобби',
    shortDesc: 'Передача дорогих скинов, перчаток или ножей в лобби скупщику',
    fullDesc: 'Если вы хотите продать скин или нож без комиссии рынка — передайте предмет курьеру через меню обмена в приватном лобби и получите 100% выплату в рублях.',
    safetyScore: 98,
    riskLevel: 'Низкий',
    estimatedTimeMin: '5-10 мин',
    recommendation: 'Выгодно для владельцев редких ножей и перчаток.',
    adminLogRisk: 'Прямой обмен инвентаря в лобби.',
    mode: 'sell'
  }
];

export const SERVER_RATES_DATA: ServerRate[] = [
  { id: '1', gameId: 'black_russia', serverName: '23 — MOSCOW', pricePerMillion: 80, stockMillions: 540, demand: 'Высокий', adminActivity: 'Высокая', deliveryAvgMinutes: 7, rateDisplay: '80 ₽ / 1кк', buybackRateDisplay: '35 ₽ / 1кк', stockDisplay: '~540кк в наличии', securityDisplay: 'Защита от бана' },
  { id: '2', gameId: 'black_russia', serverName: '24 — SPB', pricePerMillion: 80, stockMillions: 420, demand: 'Высокий', adminActivity: 'Высокая', deliveryAvgMinutes: 8, rateDisplay: '80 ₽ / 1кк', buybackRateDisplay: '35 ₽ / 1кк', stockDisplay: '~420кк в наличии', securityDisplay: 'Защита от бана' },
  { id: '3', gameId: 'black_russia', serverName: '1 — RED', pricePerMillion: 80, stockMillions: 680, demand: 'Высокий', adminActivity: 'Средняя', deliveryAvgMinutes: 5, rateDisplay: '80 ₽ / 1кк', buybackRateDisplay: '35 ₽ / 1кк', stockDisplay: '~680кк в наличии', securityDisplay: 'Защита от бана' },
  { id: '4', gameId: 'black_russia', serverName: '31 — EKATERINBURG', pricePerMillion: 80, stockMillions: 290, demand: 'Высокий', adminActivity: 'Средняя', deliveryAvgMinutes: 8, rateDisplay: '80 ₽ / 1кк', buybackRateDisplay: '35 ₽ / 1кк', stockDisplay: '~290кк в наличии', securityDisplay: 'Защита от бана' },
  { id: '5', gameId: 'black_russia', serverName: '26 — SOCHI', pricePerMillion: 80, stockMillions: 260, demand: 'Высокий', adminActivity: 'Высокая', deliveryAvgMinutes: 9, rateDisplay: '80 ₽ / 1кк', buybackRateDisplay: '35 ₽ / 1кк', stockDisplay: '~260кк в наличии', securityDisplay: 'Защита от бана' },
  { id: '6', gameId: 'black_russia', serverName: '27 — KAZAN', pricePerMillion: 80, stockMillions: 310, demand: 'Средний', adminActivity: 'Средняя', deliveryAvgMinutes: 7, rateDisplay: '80 ₽ / 1кк', buybackRateDisplay: '35 ₽ / 1кк', stockDisplay: '~310кк в наличии', securityDisplay: 'Защита от бана' },
  { id: '7', gameId: 'black_russia', serverName: '34 — NOVOSIBIRSK', pricePerMillion: 80, stockMillions: 250, demand: 'Высокий', adminActivity: 'Высокая', deliveryAvgMinutes: 10, rateDisplay: '80 ₽ / 1кк', buybackRateDisplay: '35 ₽ / 1кк', stockDisplay: '~250кк в наличии', securityDisplay: 'Защита от бана' },
  { id: '8', gameId: 'black_russia', serverName: '91 — ASTANA', pricePerMillion: 80, stockMillions: 380, demand: 'Высокий', adminActivity: 'Средняя', deliveryAvgMinutes: 6, rateDisplay: '80 ₽ / 1кк', buybackRateDisplay: '35 ₽ / 1кк', stockDisplay: '~380кк в наличии', securityDisplay: 'Защита от бана' },
  { id: '9', gameId: 'black_russia', serverName: '92 — TASHKENT', pricePerMillion: 80, stockMillions: 310, demand: 'Высокий', adminActivity: 'Средняя', deliveryAvgMinutes: 6, rateDisplay: '80 ₽ / 1кк', buybackRateDisplay: '35 ₽ / 1кк', stockDisplay: '~310кк в наличии', securityDisplay: 'Защита от бана' },
  { id: '10', gameId: 'black_russia', serverName: '90 — NORILSK', pricePerMillion: 80, stockMillions: 220, demand: 'Средний', adminActivity: 'Средняя', deliveryAvgMinutes: 8, rateDisplay: '80 ₽ / 1кк', buybackRateDisplay: '35 ₽ / 1кк', stockDisplay: '~220кк в наличии', securityDisplay: 'Защита от бана' },
  { id: '11', gameId: 'black_russia', serverName: '32 — KRASNODAR', pricePerMillion: 80, stockMillions: 270, demand: 'Высокий', adminActivity: 'Высокая', deliveryAvgMinutes: 9, rateDisplay: '80 ₽ / 1кк', buybackRateDisplay: '35 ₽ / 1кк', stockDisplay: '~270кк в наличии', securityDisplay: 'Защита от бана' },
  { id: '12', gameId: 'standoff2', serverName: 'Global Market (Рынок скинов)', pricePerMillion: 80, stockMillions: 850, demand: 'Высокий', adminActivity: 'Низкая', deliveryAvgMinutes: 4, rateDisplay: '80 ₽ / 100 G', buybackRateDisplay: '45 ₽ / 100 G', stockDisplay: '~85 000 Gold', securityDisplay: 'Комиссия 20% покрыта' },
  { id: '13', gameId: 'standoff2', serverName: 'RU Server (Лобби трейд)', pricePerMillion: 80, stockMillions: 500, demand: 'Высокий', adminActivity: 'Низкая', deliveryAvgMinutes: 6, rateDisplay: '80 ₽ / 100 G', buybackRateDisplay: '45 ₽ / 100 G', stockDisplay: '~50 000 Gold', securityDisplay: 'Трейд ножей / перчаток' },
  { id: '14', gameId: 'standoff2', serverName: 'EU Server (Лобби трейд)', pricePerMillion: 80, stockMillions: 400, demand: 'Средний', adminActivity: 'Низкая', deliveryAvgMinutes: 7, rateDisplay: '80 ₽ / 100 G', buybackRateDisplay: '45 ₽ / 100 G', stockDisplay: '~40 000 Gold', securityDisplay: 'Трейд ножей / перчаток' }
];

export const COMMUNITY_REVIEWS: CommunityReview[] = [
  {
    id: 'rev-1',
    author: 'Nikolay_Bratva',
    authorUsername: 'nikolay_bratva',
    game: 'Black Russia (CRMP)',
    server: '23 — MOSCOW',
    rating: 5,
    date: 'Вчера, 21:15',
    verified: true,
    comment: 'Взял 30кк по курсу 80 рублей за миллион! Сэкономил кучу денег, отдал всего 2400 р вместо 30 тысяч в лаунчере. Перевели через банк в Арзамасе за 5 минут, бана нет!',
    outcome: 'Успешно без бана',
    amountPurchased: '30 000 000 ₽',
    status: 'approved'
  },
  {
    id: 'rev-2',
    author: 'Maksim_Red',
    authorUsername: 'maksim_red',
    game: 'Black Russia (CRMP)',
    server: '1 — RED',
    rating: 5,
    date: '2 дня назад',
    verified: true,
    comment: 'Курс 1кк = 80р просто пушка. Купил сразу 50кк, передали через семейный сейф, все чисто и без риска.',
    outcome: 'Успешно без бана',
    amountPurchased: '50 000 000 ₽',
    status: 'approved'
  },
  {
    id: 'rev-3',
    author: 'Danil_Gold',
    authorUsername: 'danil_gold',
    game: 'Standoff 2',
    server: 'Global Market',
    rating: 5,
    date: '3 дня назад',
    verified: true,
    comment: 'Брал 2500 голды. Выставил рарку по инструкции, выкупили за 6 минут и покрыли комиссию рынка 20%. Топ сервис.',
    outcome: 'Быстрая выдача',
    amountPurchased: '2 500 Gold',
    status: 'approved'
  },
  {
    id: 'rev-4',
    author: 'Egor_Sochi',
    authorUsername: 'egor_sochi',
    game: 'Black Russia (CRMP)',
    server: '26 — SOCHI',
    rating: 5,
    date: 'Неделю назад',
    verified: true,
    comment: 'Нашел свой сервер Сочи сразу в списке, сервера расставлены в правильном порядке. Выдали 15кк быстро через трейд. Рекомендую NetBanaSHOP!',
    outcome: 'Успешно без бана',
    amountPurchased: '15 000 000 ₽',
    status: 'approved'
  }
];

export const FAQ_DATA = [
  {
    q: 'Какой курс виртов на Black Russia (покупка и скупка)?',
    a: 'В NetBanaSHOP действует фиксированный прозрачный курс: покупка виртов — 1 000 000 виртов = 80 рублей (1кк = 80 ₽) на ВСЕХ серверах без скрытых комиссий; скупка (продажа нам) — 1кк = 35 ₽ с бонусом до +3% за объемы от 50кк. Моментальная выплата на СБП, карту или USDT за 3–5 минут.'
  },
  {
    q: 'Есть ли все серверы Black Russia?',
    a: 'Да! В каталоге представлены абсолютно все 90+ действующих серверов Black Russia в хронологическом порядке: от классических (1 — RED, 2 — GREEN ... 22 — CHOCO) до именных городов (23 — XIX, 24 — SPB ... 77 — MOSCOW ... 89 — CHEREPOVETS) и новейших (90 — NORILSK, 91 — ASTANA, 00 — RIO).'
  },
  {
    q: 'Какой курс голды в Standoff 2 (покупка и скупка)?',
    a: 'Покупка голды: 100 Gold = 80 рублей (80 ₽ / 100 G) со 100% компенсацией 20% комиссии рынка Axlebolt. Скупка голды (продажа нам): 100 Gold = 45 ₽ с бонусом до +3% за партии от 5 000 G. Выплата переводится сразу после подтверждения передачи.'
  },
  {
    q: 'Нужно ли вводить пароль от аккаунта?',
    a: 'НИКОГДА! В NetBanaSHOP требуется исключительно ваш игровой Nick_Name для встречи на сервере. Пароли, пин-коды и привязки никогда не запрашиваются.'
  },
  {
    q: 'Какие способы передачи виртов используются в Black Russia?',
    a: 'Мы используем исключительно реальные внутриигровые механики Black Russia: банковский перевод (/bank), безопасный обмен через трейд (/trade), пополнение семейного сейфа (/fmenu) или продажу авто (/sellmycar). Вымышленные способы вроде палаток ЦР исключены.'
  }
];
