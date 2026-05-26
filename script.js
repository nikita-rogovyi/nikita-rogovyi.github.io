// ============ HUNTR/X: Тренажер євро / Тренажёр евро ============

// Номінали (у центах) -> id SVG-символу
const COINS = [
  { cents: 1,   id: 'c1',  type: 'coin' },
  { cents: 2,   id: 'c2',  type: 'coin' },
  { cents: 5,   id: 'c5',  type: 'coin' },
  { cents: 10,  id: 'c10', type: 'coin' },
  { cents: 20,  id: 'c20', type: 'coin' },
  { cents: 50,  id: 'c50', type: 'coin' },
  { cents: 100, id: 'e1',  type: 'coin' },
  { cents: 200, id: 'e2',  type: 'coin' },
];
const NOTES = [
  { cents: 500,   id: 'n5',   type: 'note' },
  { cents: 1000,  id: 'n10',  type: 'note' },
  { cents: 2000,  id: 'n20',  type: 'note' },
  { cents: 5000,  id: 'n50',  type: 'note' },
  { cents: 10000, id: 'n100', type: 'note' },
];

// ============ Рівні складності ============
// hard — оригінальний режим (як було до введення рівнів).
const DIFFICULTY = {
  easy: {
    maxDup: 1,                  // максимум однакових номіналів у завданні "скільки тут?"
    maxItemsCount: 5,           // максимум монет/банкнот на сцені
    buyMaxCents: 2000,          // ціна до 20 €
    buyCentsStep: 10,           // ціни кратні 10 центам (наприклад 5.30, 12.40)
    optionsSpread: 'wide',      // далекі варіанти відповіді
    enableInputType: false,     // без режиму "введи число" — лише варіанти й покупка
    countMinCents: 50,
    countMaxCents: 2000,
  },
  medium: {
    maxDup: 2,
    maxItemsCount: 8,
    buyMaxCents: 5000,
    buyCentsStep: 5,
    optionsSpread: 'medium',
    enableInputType: true,
    countMinCents: 50,
    countMaxCents: 5000,
  },
  hard: {
    maxDup: 3,
    maxItemsCount: 10,
    buyMaxCents: 29999,
    buyCentsStep: 1,
    optionsSpread: 'tight',
    enableInputType: true,
    countMinCents: 5,
    countMaxCents: 29999,
  },
};

// ============ Локалізація ============
const I18N = {
  uk: {
    title: '🎤 HUNTR/X: Тренажер євро 🗡️',
    welcomeTitle: '🎤 Привіт, майбутня мисливице! 🗡️',
    welcomeSub: 'Перш ніж почати, розкажи трохи про себе.',
    welcomeLangLabel: '🌐 Мова:',
    welcomeNameLabel: '📛 Як тебе звати?',
    namePlaceholder: 'Твоє ім\'я...',
    welcomeGenderLabel: '🦸 Хто ти?',
    genderF: 'Дівчинка',
    genderM: 'Хлопчик',
    genderN: 'Не обираю',
    welcomeStart: '🗡️ Почати тренування!',
    welcomeSave: '💾 Зберегти',
    welcomeCancel: '✖️ Скасувати',
    welcomeDiffLabel: '🎚️ Складність:',
    welcomeGameLabel: '🎮 Гра:',
    gameMoney:   'Гроші',
    gameWeights: 'Ваги',
    parentsLabel: '👨‍👩‍👧 Цілі від батьків',
    parentsHint: 'Скільки раундів треба виграти у кожній грі та складності. 0 = немає цілі.',
    settingsTitle: '⚙️ Налаштування',
    challengeTitle: '🏆 Режим челенджу',
    challengeSub: 'Обери один рівень складності та скільки раундів треба пройти у кожній грі.',
    challengeDiffLabel: '🎚️ Складність (одна для всіх):',
    challengeGoalsLabel: '🎯 Ціль по іграх:',
    challengeStart: '🚀 Почати челендж',
    challengeCancel: '✖️ Скасувати',
    challengeBegin: (gameName) => `🚀 Старт челенджу! Спочатку: ${gameName}`,
    challengeNext: (gameName) => `➡️ Переходимо до: ${gameName}`,
    challengeDone: 'Челендж завершено!',
    summaryTotal: '🎯 Загалом:',
    summaryFirstTry: 'з першої спроби',
    taskTypeNames: {
      'buy': '🛒 Купи за суму',
      'countOptions': '📊 Підрахунок (варіанти)',
      'countInput': '⌨️ Підрахунок (введи)',
      'weightCount': '⚖️ Скільки важить?',
      'weightBuild': '🏋️ Збери вагу',
      'volumeCount': '🥤 Скільки літрів?',
      'volumeBuild': '🍶 Налий обʼєм',
    },
    greetBack: (name) => `🎤 З поверненням, ${name}!`,
    titles: {
      f: ['мисливиця', 'героїня', 'зірка',  'принцеса хонмуну', 'воїтелька'],
      m: ['мисливець', 'герой',   'зірка',  'принц хонмуну',    'воїн'],
      n: ['мисливець', 'герой',   'зірка',  'захисник хонмуну', 'чемпіон'],
    },
    // Гендерно-узгоджені прикметники для звертання
    adj: {
      f: { great: 'чудова', amazing: 'неймовірна', best: 'найкраща', real: 'справжня', ready: 'готова', proud: 'горда' },
      m: { great: 'чудовий', amazing: 'неймовірний', best: 'найкращий', real: 'справжній', ready: 'готовий', proud: 'гордий' },
      n: { great: 'чудовий', amazing: 'неймовірний', best: 'найкращий', real: 'справжній', ready: 'готовий', proud: 'гордий' },
    },
    // Персоналізовані фрази (з {name} та {title}) — переплітаються із загальними
    personalizedHero: [
      '{name}, ти {adj.real} {title}! 💜',
      '{name}, демона знищено! 🗡️',
      'Браво, {title} {name}! ✨',
      '{name}, ти {adj.amazing}! 🌟',
      'Хонмун у безпеці завдяки тобі, {name}! 🛡️',
      '{name} — {title} HUNTR/X! 🎤',
      'Та сама {name}! Демони тікають! 😈💨',
      'Точно в ціль, {name}! 🎯',
      'Румі пишається тобою, {name}! 💜',
      'Зої передає привіт, {name}! 🎶',
      'Міра у захваті, {name}! 🔥',
    ],
    personalizedLose: [
      '{name}, не здавайся — ти {adj.ready}! 💜',
      'Спробуй ще раз, {title} {name}! 🌟',
      '{name}, демон сильний, але ти сильніша духом! ✨',
      'Хонмун чекає на тебе, {name}!',
      '{name}, кожна помилка — крок до перемоги! 🎤',
      'Зосередься, {title} {name}! 🔮',
      '{name}, Румі вірить — і я вірю!',
    ],
    diffLabel:  '🎚️ Складність:',
    diffEasy:   'Стажерка хонмуну',
    diffMedium: 'Мисливиця HUNTR/X',
    diffHard:   'Володарка золотого меча',
    pageTitle: 'HUNTR/X: Тренажер євро 💜🗡️',
    score: '💜 Демонів знищено:',
    streak: '🔥 Серія:',
    round: '🎯 Раунд:',
    buyPrompt: (emoji, name, price) =>
      `Купи <span class="item">${emoji} ${name}</span> за <span class="price">${price}</span>.<br>
       <small style="opacity:0.8; font-size: 0.85em;">Клацай монети та банкноти, щоб набрати точну суму!</small>`,
    countScenarios: [
      '🎒 Героїні HUNTR/X знайшли загублений гаманець на сцені!',
      '🎤 Гурту HUNTR/X заплатили за концерт у Сеулі!',
      '🗡️ Дівчата відібрали у переможеного демона мішечок з монетами!',
      '💝 Фанати подарували Румі скарбничку з грошима!',
      '💿 Це гроші від продажу нового альбому «Golden»!',
      '🧋 Зої заробила в кав\'ярні, продаючи бабл-ті!',
      '🏆 HUNTR/X виграли приз на K-pop змаганні!',
      '🎟️ Міра порахувала виручку з квитків на концерт!',
      '🎶 Чайові від виступу на вулиці у Гонконзі!',
      '🐯 Деркі та Сассі знайшли скарб у храмі!',
      '✨ Випало з хонмун-сумочки під час бою!',
      '😈 Saja Boys загубили гроші, тікаючи від HUNTR/X!',
      '🎂 Подарунок від мами Зої на день народження!',
      '🎤 Гонорар за дует «What It Sounds Like»!',
      '🪄 Винагорода від мисливського ордену за знищеного демона!',
      '🛍️ Виручка від продажу мерчу HUNTR/X на фан-міті!',
    ],
    countOptionsHint: `Скільки тут грошей? Обери правильну відповідь.`,
    countInputHint: `Скільки тут всього євро та центів?`,
    eurLabel: 'євро',
    centLabel: 'центів',
    currentSum: 'Набрано:',
    walletLabel: '👛 Твій гаманець — клацай, щоб додати:',
    trayLabel: '🧾 Каса — твоя оплата (клацни, щоб прибрати):',
    trayEmpty: 'Поки порожньо... додай монети або банкноти зверху!',
    pay: '💳 Сплатити',
    clear: '🔄 Очистити',
    check: '✅ Перевірити',
    nextRound: '⏭️ Наступний раунд',
    bought: (emoji, name) => `Куплено: ${emoji} ${name}!`,
    tooMuch: (amount) => `Забагато на ${amount}`,
    notEnough: (amount) => `Не вистачає ${amount}`,
    correctIs: (amount) => `Правильно: ${amount}`,
    enterNumber: 'Введи окремо євро та центи',
    exactHit: 'Точна відповідь!',
    bullseye: 'Точно в ціль!',
    tryAgain: '— спробуй ще!',
    items: [
      { name: 'Бабл-ті Румі',           emoji: '🧋', min: 250,  max: 550  },
      { name: 'Рамен Джину',            emoji: '🍜', min: 380,  max: 720  },
      { name: 'Мікрофон Зої',           emoji: '🎤', min: 990,  max: 1999 },
      { name: 'Меч-гокком',             emoji: '🗡️', min: 1500, max: 4999 },
      { name: 'Плакат HUNTR/X',         emoji: '🖼️', min: 350,  max: 999  },
      { name: 'Альбом «Golden»',        emoji: '💿', min: 1200, max: 2500 },
      { name: 'Браслет-хонмун',         emoji: '✨', min: 450,  max: 1499 },
      { name: 'Тигр-дух (плюшевий)',    emoji: '🐯', min: 800,  max: 1899 },
      { name: 'Кепка Міри',             emoji: '🧢', min: 650,  max: 1499 },
      { name: 'Стікери Saja Boys',      emoji: '🔥', min: 99,   max: 399  },
      { name: 'Світловий меч хонмун',   emoji: '⚔️', min: 3000, max: 6999 },
      { name: 'Фігурка Деркі',          emoji: '🐅', min: 599,  max: 1599 },
      { name: 'Окуляри Saja Boy',       emoji: '🕶️', min: 450,  max: 1299 },
      { name: 'Сорочка з тигром',       emoji: '👕', min: 1200, max: 2999 },
      { name: 'Браслет з кристалом',    emoji: '💎', min: 750,  max: 1999 },
      { name: 'Морозиво на сцені',      emoji: '🍦', min: 150,  max: 450  },
      { name: 'Корейські тток',         emoji: '🍡', min: 199,  max: 599  },
      { name: 'Книга про мисливців',    emoji: '📖', min: 550,  max: 1499 },
      { name: 'Зачіска HUNTR/X (салон)',emoji: '💇', min: 2500, max: 4999 },
      { name: 'Сяюча палиця фанатки',   emoji: '🪄', min: 999,  max: 2499 },
    ],
    heroPhrases: [
      'Демона знищено! 🗡️',
      'Хонмун засяяв! ✨',
      'HUNTR/X перемагає! 💜',
      'Дух тигра пишається! 🐯',
      'Дивовижна Румі! 🎤',
      'Демон зник у золоті! 💛',
      'Сила K-pop! 🎶',
      'Міра у вогні! 🔥',
      'Зої — на максимумі! ⭐',
      '«Golden» лунає скрізь! 🌟',
      'Хонмун ціліший за всіх! 🛡️',
      'Саінгом сяє золотом! ⚔️',
      'Це і є справжня нота! 🎵',
      'Деркі та Сассі танцюють! 🐯🐦',
      'Джину сховався у тінь! 🌑',
      'Saja Boys тікають! 🏃‍♂️💨',
      'Демонів менше — фанатів більше! 💖',
      'Концерт врятовано! 🎊',
      'Ґві-Ма в люті! 😤',
      'Сцена твоя, мисливице! 🌟',
      '«Soda Pop» — і демон в нокаут! 🥤💥',
      'Три голоси — одна перемога! 🎤🎤🎤',
      'Сеул у безпеці! 🏙️',
      'Бабл-ті за рахунок Румі! 🧋',
      'Хонмун ще ніколи не був таким золотим! 👑',
      'Демон розчинився в музиці! 🎶✨',
      'Маклі-Зої запалює! 🔥🎤',
      'Гокгом-удар точнісінько в ціль! 🗡️',
      'Фанати в захваті! 💜💗💙',
    ],
    losePhrases: [
      '😈 Джину сміється: «Хі-хі! Спробуй ще!»',
      '👻 Демон вислизнув... Не здавайся!',
      '🔮 Хонмун ще не готовий — підрахуй ще раз!',
      '😼 Деркі радить: уважно подивись!',
      '🌙 Демон чекає — давай ще раз!',
      '🎭 Saja Boys підкрадаються — пильнуй!',
      '👑 Ґві-Ма посміхається: «Ще не сьогодні!»',
      '🪞 Міра каже: «Зосередься, ще раз!»',
      '🎵 Зої: «Спробуй ще раз — у тебе вийде!»',
      '💜 Румі вірить у тебе — не здавайся!',
      '😼 Сассі-сорока стрибає поруч: рахуй уважно!',
      '🌑 Демон шепоче: «Помилка моя — твій урок!»',
      '🎤 Поки що нечисто — твій вокал ще зростатиме!',
      '🗡️ Гокгом промахнувся... наступний раз — точно!',
      '⚡ Не та нота — спробуй ще!',
      '🌟 Хонмун тьмяніє... повернемо разом сяйво!',
      '😈 Ебі-демон тікає... поки що!',
    ],
  },
  ru: {
    title: '🎤 HUNTR/X: Тренажёр евро 🗡️',
    welcomeTitle: '🎤 Привет, будущая охотница! 🗡️',
    welcomeSub: 'Прежде чем начать, расскажи немного о себе.',
    welcomeLangLabel: '🌐 Язык:',
    welcomeNameLabel: '📛 Как тебя зовут?',
    namePlaceholder: 'Твоё имя...',
    welcomeGenderLabel: '🦸 Кто ты?',
    genderF: 'Девочка',
    genderM: 'Мальчик',
    genderN: 'Не выбираю',
    welcomeStart: '🗡️ Начать тренировку!',
    welcomeSave: '💾 Сохранить',
    welcomeCancel: '✖️ Отмена',
    welcomeDiffLabel: '🎚️ Сложность:',
    welcomeGameLabel: '🎮 Игра:',
    gameMoney:   'Деньги',
    gameWeights: 'Веса',
    parentsLabel: '👨‍👩‍👧 Цели от родителей',
    parentsHint: 'Сколько раундов нужно выиграть в каждой игре и сложности. 0 = нет цели.',
    settingsTitle: '⚙️ Настройки',
    challengeTitle: '🏆 Режим челленджа',
    challengeSub: 'Выбери один уровень сложности и сколько раундов нужно пройти в каждой игре.',
    challengeDiffLabel: '🎚️ Сложность (одна на всех):',
    challengeGoalsLabel: '🎯 Цель по играм:',
    challengeStart: '🚀 Начать челлендж',
    challengeCancel: '✖️ Отмена',
    challengeBegin: (gameName) => `🚀 Старт челленджа! Сначала: ${gameName}`,
    challengeNext: (gameName) => `➡️ Переходим к: ${gameName}`,
    challengeDone: 'Челлендж завершён!',
    summaryTotal: '🎯 Итого:',
    summaryFirstTry: 'с первой попытки',
    taskTypeNames: {
      'buy': '🛒 Купи за сумму',
      'countOptions': '📊 Подсчёт (варианты)',
      'countInput': '⌨️ Подсчёт (ввод)',
      'weightCount': '⚖️ Сколько весит?',
      'weightBuild': '🏋️ Собери вес',
      'volumeCount': '🥤 Сколько литров?',
      'volumeBuild': '🍶 Налей объём',
    },
    greetBack: (name) => `🎤 С возвращением, ${name}!`,
    titles: {
      f: ['охотница', 'героиня', 'звезда', 'принцесса хонмуна', 'воительница'],
      m: ['охотник',  'герой',   'звезда', 'принц хонмуна',     'воин'],
      n: ['охотник',  'герой',   'звезда', 'защитник хонмуна',  'чемпион'],
    },
    adj: {
      f: { great: 'отличная', amazing: 'невероятная', best: 'лучшая', real: 'настоящая', ready: 'готова', proud: 'горда' },
      m: { great: 'отличный', amazing: 'невероятный', best: 'лучший', real: 'настоящий', ready: 'готов', proud: 'горд' },
      n: { great: 'отличный', amazing: 'невероятный', best: 'лучший', real: 'настоящий', ready: 'готов', proud: 'горд' },
    },
    personalizedHero: [
      '{name}, ты {adj.real} {title}! 💜',
      '{name}, демон уничтожен! 🗡️',
      'Браво, {title} {name}! ✨',
      '{name}, ты {adj.amazing}! 🌟',
      'Хонмун в безопасности благодаря тебе, {name}! 🛡️',
      '{name} — {title} HUNTR/X! 🎤',
      'Та самая {name}! Демоны убегают! 😈💨',
      'Точно в цель, {name}! 🎯',
      'Руми гордится тобой, {name}! 💜',
      'Зои передаёт привет, {name}! 🎶',
      'Мира в восторге, {name}! 🔥',
    ],
    personalizedLose: [
      '{name}, не сдавайся — ты {adj.ready}! 💜',
      'Попробуй ещё раз, {title} {name}! 🌟',
      '{name}, демон силён, но ты сильнее духом! ✨',
      'Хонмун ждёт тебя, {name}!',
      '{name}, каждая ошибка — шаг к победе! 🎤',
      'Соберись, {title} {name}! 🔮',
      '{name}, Руми верит — и я верю!',
    ],
    diffLabel:  '🎚️ Сложность:',
    diffEasy:   'Стажёрка хонмуна',
    diffMedium: 'Охотница HUNTR/X',
    diffHard:   'Владычица золотого меча',
    pageTitle: 'HUNTR/X: Тренажёр евро 💜🗡️',
    score: '💜 Демонов уничтожено:',
    streak: '🔥 Серия:',
    round: '🎯 Раунд:',
    buyPrompt: (emoji, name, price) =>
      `Купи <span class="item">${emoji} ${name}</span> за <span class="price">${price}</span>.<br>
       <small style="opacity:0.8; font-size: 0.85em;">Кликай монеты и банкноты, чтобы набрать точную сумму!</small>`,
    countScenarios: [
      '🎒 Героини HUNTR/X нашли потерянный кошелёк на сцене!',
      '🎤 Группе HUNTR/X заплатили за концерт в Сеуле!',
      '🗡️ Девушки отобрали у побеждённого демона мешочек с монетами!',
      '💝 Фанаты подарили Руми копилку с деньгами!',
      '💿 Это деньги от продажи нового альбома «Golden»!',
      '🧋 Зои заработала в кафе, продавая бабл-ти!',
      '🏆 HUNTR/X выиграли приз на K-pop состязании!',
      '🎟️ Мира посчитала выручку с билетов на концерт!',
      '🎶 Чаевые от выступления на улице в Гонконге!',
      '🐯 Дерки и Сасси нашли клад в храме!',
      '✨ Выпало из хонмун-сумочки во время боя!',
      '😈 Saja Boys обронили деньги, убегая от HUNTR/X!',
      '🎂 Подарок от мамы Зои на день рождения!',
      '🎤 Гонорар за дуэт «What It Sounds Like»!',
      '🪄 Награда от охотничьего ордена за уничтоженного демона!',
      '🛍️ Выручка от продажи мерча HUNTR/X на фан-встрече!',
    ],
    countOptionsHint: `Сколько здесь денег? Выбери правильный ответ.`,
    countInputHint: `Сколько здесь всего евро и центов?`,
    eurLabel: 'евро',
    centLabel: 'центов',
    currentSum: 'Набрано:',
    walletLabel: '👛 Твой кошелёк — кликай, чтобы добавить:',
    trayLabel: '🧾 Касса — твоя оплата (кликни, чтобы убрать):',
    trayEmpty: 'Пока пусто... добавь монеты или банкноты сверху!',
    pay: '💳 Оплатить',
    clear: '🔄 Очистить',
    check: '✅ Проверить',
    nextRound: '⏭️ Следующий раунд',
    bought: (emoji, name) => `Куплено: ${emoji} ${name}!`,
    tooMuch: (amount) => `Слишком много на ${amount}`,
    notEnough: (amount) => `Не хватает ${amount}`,
    correctIs: (amount) => `Правильно: ${amount}`,
    enterNumber: 'Введи отдельно евро и центы',
    exactHit: 'Точный ответ!',
    bullseye: 'Точно в цель!',
    tryAgain: '— попробуй ещё!',
    items: [
      { name: 'Бабл-ти Руми',            emoji: '🧋', min: 250,  max: 550  },
      { name: 'Рамен Джину',             emoji: '🍜', min: 380,  max: 720  },
      { name: 'Микрофон Зои',            emoji: '🎤', min: 990,  max: 1999 },
      { name: 'Меч-гокком',              emoji: '🗡️', min: 1500, max: 4999 },
      { name: 'Плакат HUNTR/X',          emoji: '🖼️', min: 350,  max: 999  },
      { name: 'Альбом «Golden»',         emoji: '💿', min: 1200, max: 2500 },
      { name: 'Браслет-хонмун',          emoji: '✨', min: 450,  max: 1499 },
      { name: 'Тигр-дух (плюшевый)',     emoji: '🐯', min: 800,  max: 1899 },
      { name: 'Кепка Миры',              emoji: '🧢', min: 650,  max: 1499 },
      { name: 'Стикеры Saja Boys',       emoji: '🔥', min: 99,   max: 399  },
      { name: 'Световой меч хонмун',     emoji: '⚔️', min: 3000, max: 6999 },
      { name: 'Фигурка Дерки',           emoji: '🐅', min: 599,  max: 1599 },
      { name: 'Очки Saja Boy',           emoji: '🕶️', min: 450,  max: 1299 },
      { name: 'Рубашка с тигром',        emoji: '👕', min: 1200, max: 2999 },
      { name: 'Браслет с кристаллом',    emoji: '💎', min: 750,  max: 1999 },
      { name: 'Мороженое на сцене',      emoji: '🍦', min: 150,  max: 450  },
      { name: 'Корейские тток',          emoji: '🍡', min: 199,  max: 599  },
      { name: 'Книга об охотниках',      emoji: '📖', min: 550,  max: 1499 },
      { name: 'Причёска HUNTR/X (салон)',emoji: '💇', min: 2500, max: 4999 },
      { name: 'Светящаяся палочка фанатки', emoji: '🪄', min: 999, max: 2499 },
    ],
    heroPhrases: [
      'Демон уничтожен! 🗡️',
      'Хонмун засиял! ✨',
      'HUNTR/X побеждает! 💜',
      'Дух тигра гордится! 🐯',
      'Удивительная Руми! 🎤',
      'Демон исчез в золоте! 💛',
      'Сила K-pop! 🎶',
      'Мира в огне! 🔥',
      'Зои — на максимуме! ⭐',
      '«Golden» звучит повсюду! 🌟',
      'Хонмун целее, чем когда-либо! 🛡️',
      'Саингом сияет золотом! ⚔️',
      'Это и есть настоящая нота! 🎵',
      'Дерки и Сасси танцуют! 🐯🐦',
      'Джину спрятался в тень! 🌑',
      'Saja Boys убегают! 🏃‍♂️💨',
      'Демонов меньше — фанатов больше! 💖',
      'Концерт спасён! 🎊',
      'Гви-Ма в ярости! 😤',
      'Сцена твоя, охотница! 🌟',
      '«Soda Pop» — и демон в нокаут! 🥤💥',
      'Три голоса — одна победа! 🎤🎤🎤',
      'Сеул в безопасности! 🏙️',
      'Бабл-ти за счёт Руми! 🧋',
      'Хонмун ещё никогда не был таким золотым! 👑',
      'Демон растворился в музыке! 🎶✨',
      'Макне-Зои зажигает! 🔥🎤',
      'Гокком-удар точно в цель! 🗡️',
      'Фанаты в восторге! 💜💗💙',
    ],
    losePhrases: [
      '😈 Джину смеётся: «Хи-хи! Попробуй ещё!»',
      '👻 Демон ускользнул... Не сдавайся!',
      '🔮 Хонмун ещё не готов — пересчитай!',
      '😼 Дерки советует: посмотри внимательно!',
      '🌙 Демон ждёт — давай ещё раз!',
      '🎭 Saja Boys подкрадываются — будь начеку!',
      '👑 Гви-Ма улыбается: «Ещё не сегодня!»',
      '🪞 Мира говорит: «Сосредоточься, ещё раз!»',
      '🎵 Зои: «Попробуй ещё — у тебя получится!»',
      '💜 Руми верит в тебя — не сдавайся!',
      '😼 Сасси-сорока скачет рядом: считай внимательно!',
      '🌑 Демон шепчет: «Ошибка моя — твой урок!»',
      '🎤 Пока нечисто — твой вокал ещё вырастет!',
      '🗡️ Гокком промахнулся... в следующий раз — точно!',
      '⚡ Не та нота — попробуй ещё!',
      '🌟 Хонмун тускнеет... вернём сияние вместе!',
      '😈 Эби-демон убегает... пока что!',
    ],
  },
  es: {
    title: '🎤 HUNTR/X: Entrenador de euros 🗡️',
    welcomeTitle: '🎤 ¡Hola, futura caza-demonios! 🗡️',
    welcomeSub: 'Antes de empezar, cuéntanos un poco sobre ti.',
    welcomeLangLabel: '🌐 Idioma:',
    welcomeNameLabel: '📛 ¿Cómo te llamas?',
    namePlaceholder: 'Tu nombre...',
    welcomeGenderLabel: '🦸 ¿Quién eres?',
    genderF: 'Niña',
    genderM: 'Niño',
    genderN: 'Prefiero no decir',
    welcomeStart: '🗡️ ¡Empezar entrenamiento!',
    welcomeSave: '💾 Guardar',
    welcomeCancel: '✖️ Cancelar',
    welcomeDiffLabel: '🎚️ Dificultad:',
    welcomeGameLabel: '🎮 Juego:',
    gameMoney:   'Dinero',
    gameWeights: 'Pesas',
    parentsLabel: '👨‍👩‍👧 Objetivos de los padres',
    parentsHint: 'Cuántas rondas debe ganar el niño en cada juego/dificultad. 0 = sin objetivo.',
    settingsTitle: '⚙️ Ajustes',
    challengeTitle: '🏆 Modo desafío',
    challengeSub: 'Elige una dificultad y cuántas rondas hay que ganar en cada juego.',
    challengeDiffLabel: '🎚️ Dificultad (única para todos):',
    challengeGoalsLabel: '🎯 Objetivo por juego:',
    challengeStart: '🚀 Empezar desafío',
    challengeCancel: '✖️ Cancelar',
    challengeBegin: (gameName) => `🚀 ¡Comienza el desafío! Primero: ${gameName}`,
    challengeNext: (gameName) => `➡️ Pasamos a: ${gameName}`,
    challengeDone: '¡Desafío completado!',
    summaryTotal: '🎯 Total:',
    summaryFirstTry: 'al primer intento',
    taskTypeNames: {
      'buy': '🛒 Compra por la cantidad',
      'countOptions': '📊 Contar (opciones)',
      'countInput': '⌨️ Contar (escribir)',
      'weightCount': '⚖️ ¿Cuánto pesa?',
      'weightBuild': '🏋️ Reúne el peso',
      'volumeCount': '🥤 ¿Cuántos litros?',
      'volumeBuild': '🍶 Sirve el volumen',
    },
    greetBack: (name) => {
      const g = state.profile?.gender || 'n';
      const word = g === 'f' ? 'Bienvenida' : g === 'm' ? 'Bienvenido' : 'Bienvenide';
      return `🎤 ¡${word} de nuevo, ${name}!`;
    },
    titles: {
      f: ['cazadora', 'heroína', 'estrella', 'princesa del honmoon', 'guerrera'],
      m: ['cazador',  'héroe',   'estrella', 'príncipe del honmoon', 'guerrero'],
      n: ['caza-demonios', 'leyenda', 'estrella', 'alma del honmoon', 'campeón'],
    },
    adj: {
      f: { great: 'genial', amazing: 'increíble', best: 'la mejor',  real: 'una verdadera', ready: 'lista',  proud: 'orgullosa' },
      m: { great: 'genial', amazing: 'increíble', best: 'el mejor',  real: 'un verdadero',  ready: 'listo',  proud: 'orgulloso' },
      n: { great: 'genial', amazing: 'increíble', best: 'le mejor',  real: 'un verdadero',  ready: 'listo',  proud: 'orgulloso' },
    },
    personalizedHero: [
      '{name}, ¡eres {adj.real} {title}! 💜',
      '¡{name}, demonio derrotado! 🗡️',
      '¡Bravo, {title} {name}! ✨',
      '¡{name}, eres {adj.amazing}! 🌟',
      '¡El honmoon está a salvo gracias a ti, {name}! 🛡️',
      '¡{name} es {title} de HUNTR/X! 🎤',
      '¡La mismísima {name}! ¡Los demonios huyen! 😈💨',
      '¡Justo en el blanco, {name}! 🎯',
      '¡Rumi está {adj.proud} de ti, {name}! 💜',
      '¡Zoey te manda saludos, {name}! 🎶',
      '¡Mira está encantada, {name}! 🔥',
    ],
    personalizedLose: [
      '¡{name}, no te rindas — estás {adj.ready}! 💜',
      '¡Inténtalo de nuevo, {title} {name}! 🌟',
      '¡{name}, el demonio es fuerte, pero tu espíritu lo es más! ✨',
      '¡El honmoon te espera, {name}!',
      '¡{name}, cada error es un paso hacia la victoria! 🎤',
      '¡Concéntrate, {title} {name}! 🔮',
      '¡{name}, Rumi cree en ti — y yo también!',
    ],
    pageTitle: 'HUNTR/X: Entrenador de euros 💜🗡️',
    diffLabel:  '🎚️ Dificultad:',
    diffEasy:   'Aprendiz del honmoon',
    diffMedium: 'Caza-demonios HUNTR/X',
    diffHard:   'Leyenda de la espada dorada',
    score: '💜 Demonios derrotados:',
    streak: '🔥 Racha:',
    round: '🎯 Ronda:',
    buyPrompt: (emoji, name, price) =>
      `Compra <span class="item">${emoji} ${name}</span> por <span class="price">${price}</span>.<br>
       <small style="opacity:0.8; font-size: 0.85em;">¡Haz clic en monedas y billetes para juntar la cantidad exacta!</small>`,
    countScenarios: [
      '🎒 ¡Las heroínas de HUNTR/X encontraron un monedero perdido en el escenario!',
      '🎤 ¡Le pagaron a HUNTR/X por un concierto en Seúl!',
      '🗡️ ¡Las chicas le quitaron una bolsa de monedas a un demonio derrotado!',
      '💝 ¡Los fans le regalaron a Rumi una hucha con dinero!',
      '💿 ¡Es el dinero de las ventas del nuevo álbum «Golden»!',
      '🧋 ¡Zoey ganó esto vendiendo bubble tea en la cafetería!',
      '🏆 ¡HUNTR/X ganaron el premio en un concurso de K-pop!',
      '🎟️ ¡Mira contó la recaudación de las entradas del concierto!',
      '🎶 ¡Propinas de una actuación callejera en Hong Kong!',
      '🐯 ¡Derpy y Sussie encontraron un tesoro en el templo!',
      '✨ ¡Cayó del bolsito-honmoon durante la batalla!',
      '😈 ¡Los Saja Boys perdieron el dinero al huir de HUNTR/X!',
      '🎂 ¡Un regalo de la mamá de Zoey por su cumpleaños!',
      '🎤 ¡Honorarios por el dueto «What It Sounds Like»!',
      '🪄 ¡Recompensa de la orden de cazadores por un demonio derrotado!',
      '🛍️ ¡Recaudación de la venta de merchandising en el fan meeting!',
    ],
    countOptionsHint: `¿Cuánto dinero hay aquí? Elige la respuesta correcta.`,
    countInputHint: `¿Cuántos euros y céntimos hay en total?`,
    eurLabel: 'euros',
    centLabel: 'céntimos',
    currentSum: 'Reunido:',
    walletLabel: '👛 Tu monedero — ¡haz clic para añadir!',
    trayLabel: '🧾 Caja — tu pago (¡clic para quitar!):',
    trayEmpty: 'Vacío todavía... ¡añade monedas o billetes de arriba!',
    pay: '💳 Pagar',
    clear: '🔄 Limpiar',
    check: '✅ Comprobar',
    nextRound: '⏭️ Siguiente ronda',
    bought: (emoji, name) => `¡Comprado: ${emoji} ${name}!`,
    tooMuch: (amount) => `Te has pasado por ${amount}`,
    notEnough: (amount) => `Te faltan ${amount}`,
    correctIs: (amount) => `Correcto: ${amount}`,
    enterNumber: 'Introduce los euros y los céntimos por separado',
    exactHit: '¡Respuesta exacta!',
    bullseye: '¡En el blanco!',
    tryAgain: '— ¡inténtalo de nuevo!',
    items: [
      { name: 'Bubble tea de Rumi',          emoji: '🧋', min: 250,  max: 550  },
      { name: 'Ramen de Jinu',               emoji: '🍜', min: 380,  max: 720  },
      { name: 'Micrófono de Zoey',           emoji: '🎤', min: 990,  max: 1999 },
      { name: 'Espada-gokgeom',              emoji: '🗡️', min: 1500, max: 4999 },
      { name: 'Póster de HUNTR/X',           emoji: '🖼️', min: 350,  max: 999  },
      { name: 'Álbum «Golden»',              emoji: '💿', min: 1200, max: 2500 },
      { name: 'Pulsera del honmoon',         emoji: '✨', min: 450,  max: 1499 },
      { name: 'Tigre espíritu (peluche)',    emoji: '🐯', min: 800,  max: 1899 },
      { name: 'Gorra de Mira',               emoji: '🧢', min: 650,  max: 1499 },
      { name: 'Pegatinas Saja Boys',         emoji: '🔥', min: 99,   max: 399  },
      { name: 'Espada de luz honmoon',       emoji: '⚔️', min: 3000, max: 6999 },
      { name: 'Figura de Derpy',             emoji: '🐅', min: 599,  max: 1599 },
      { name: 'Gafas de Saja Boy',           emoji: '🕶️', min: 450,  max: 1299 },
      { name: 'Camiseta con tigre',          emoji: '👕', min: 1200, max: 2999 },
      { name: 'Brazalete con cristal',       emoji: '💎', min: 750,  max: 1999 },
      { name: 'Helado en el escenario',      emoji: '🍦', min: 150,  max: 450  },
      { name: 'Tteok coreano',               emoji: '🍡', min: 199,  max: 599  },
      { name: 'Libro sobre caza-demonios',   emoji: '📖', min: 550,  max: 1499 },
      { name: 'Peinado HUNTR/X (salón)',     emoji: '💇', min: 2500, max: 4999 },
      { name: 'Lightstick de fan',           emoji: '🪄', min: 999,  max: 2499 },
    ],
    heroPhrases: [
      '¡Demonio derrotado! 🗡️',
      '¡El honmoon brilla! ✨',
      '¡HUNTR/X gana! 💜',
      '¡El espíritu tigre se siente orgulloso! 🐯',
      '¡Increíble Rumi! 🎤',
      '¡El demonio se desvaneció en oro! 💛',
      '¡El poder del K-pop! 🎶',
      '¡Mira está que arde! 🔥',
      '¡Zoey al máximo! ⭐',
      '¡«Golden» suena en todas partes! 🌟',
      '¡El honmoon más entero que nunca! 🛡️',
      '¡La saingeom brilla con oro! ⚔️',
      '¡Esa sí es la nota correcta! 🎵',
      '¡Derpy y Sussie bailan! 🐯🐦',
      '¡Jinu se escondió en las sombras! 🌑',
      '¡Los Saja Boys huyen! 🏃‍♂️💨',
      '¡Menos demonios, más fans! 💖',
      '¡Concierto salvado! 🎊',
      '¡Gwi-Ma está furioso! 😤',
      '¡El escenario es tuyo! 🌟',
      '¡«Soda Pop» y demonio fuera! 🥤💥',
      '¡Tres voces, una victoria! 🎤🎤🎤',
      '¡Seúl está a salvo! 🏙️',
      '¡Bubble tea cortesía de Rumi! 🧋',
      '¡El honmoon nunca brilló tanto! 👑',
      '¡El demonio se disolvió en música! 🎶✨',
      '¡La maknae Zoey lo da todo! 🔥🎤',
      '¡Golpe de gokgeom justo en el blanco! 🗡️',
      '¡Los fans están en éxtasis! 💜💗💙',
    ],
    losePhrases: [
      '😈 Jinu se ríe: «¡Ji-ji! ¡Inténtalo otra vez!»',
      '👻 El demonio se escapó... ¡No te rindas!',
      '🔮 El honmoon aún no está listo — ¡cuenta de nuevo!',
      '😼 Derpy aconseja: ¡mira con atención!',
      '🌙 El demonio espera — ¡vamos otra vez!',
      '🎭 ¡Los Saja Boys se acercan, cuidado!',
      '👑 Gwi-Ma sonríe: «¡Hoy no!»',
      '🪞 Mira dice: «¡Concéntrate, otra vez!»',
      '🎵 Zoey: «¡Inténtalo, tú puedes!»',
      '💜 Rumi confía en ti — ¡no te rindas!',
      '😼 Sussie la urraca salta cerca: ¡cuenta con cuidado!',
      '🌑 El demonio susurra: «Mi error, tu lección.»',
      '🎤 Aún no afinas — ¡tu voz crecerá!',
      '🗡️ La gokgeom falló... ¡la próxima seguro!',
      '⚡ No es la nota — ¡prueba otra vez!',
      '🌟 El honmoon se apaga... ¡recuperemos su brillo!',
      '😈 ¡El demonio Abby huye... por ahora!',
    ],
  },
};

// ============ Стан гри ============
const state = {
  lang: 'es',
  difficulty: 'medium',
  gameMode: 'money',     // id з window.Games
  difficultyChosen: false,
  profile: null,         // { name, gender: 'f'|'m'|'n' }
  score: 0,
  streak: 0,
  round: 1,
  currentTask: null,
  selected: [],
  // Лічильники проходжень: progress[gameId][difficulty] = к-сть успіхів
  progress: {},
  // Цілі від батьків: goals[gameId][difficulty] = бажана к-сть (0 = немає цілі)
  goals: {},
  // Челендж від батьків
  challenge: {
    active: false,
    difficulty: 'medium',
    plan: [],         // [{ gameId, goal, done }]
    current: 0,       // індекс у plan
    attempts: 0,      // к-сть спроб поточного раунду (для firstTry метрики)
    stats: {},        // { taskType: { firstTry, total } }
  },
};

function getProgress(gameId, diff) {
  return (state.progress[gameId] && state.progress[gameId][diff]) || 0;
}
function incProgress(gameId, diff) {
  state.progress[gameId] = state.progress[gameId] || {};
  state.progress[gameId][diff] = (state.progress[gameId][diff] || 0) + 1;
  try { localStorage.setItem('progress', JSON.stringify(state.progress)); } catch (e) {}
}
function getGoal(gameId, diff) {
  return (state.goals[gameId] && state.goals[gameId][diff]) || 0;
}
function setGoal(gameId, diff, n) {
  state.goals[gameId] = state.goals[gameId] || {};
  state.goals[gameId][diff] = Math.max(0, parseInt(n, 10) || 0);
  try { localStorage.setItem('goals', JSON.stringify(state.goals)); } catch (e) {}
}
function loadProgress() {
  try { return JSON.parse(localStorage.getItem('progress') || '{}'); } catch (e) { return {}; }
}
function loadGoals() {
  try { return JSON.parse(localStorage.getItem('goals') || '{}'); } catch (e) { return {}; }
}
function allGoalsMet() {
  // true якщо хоч одна ціль встановлена і ВСІ встановлені цілі досягнуто
  let anyGoal = false;
  for (const gid in state.goals) {
    for (const d in state.goals[gid]) {
      const g = state.goals[gid][d];
      if (g > 0) {
        anyGoal = true;
        if (getProgress(gid, d) < g) return false;
      }
    }
  }
  return anyGoal;
}

// ============ Реєстр ігор (маркетплейс) ============
// Кожна гра реєструє метадані. Інші модулі додають себе тут.
// Контракт гри:
//   {
//     id:        'money',
//     icon:      '💶',
//     getName:   (lang) => 'Гроші',         // локалізована назва
//     newRound:  () => { ... },              // ставить наступне завдання
//     // win() автоматично інкрементує state.progress[id][difficulty]
//   }
window.Games = window.Games || {};

function registerGame(meta) {
  window.Games[meta.id] = meta;
}
function listGames() {
  return Object.values(window.Games);
}

// Пам'ять нещодавніх завдань — щоб уникати ідентичних умов підряд.
// Використання:
//   if (taskMemory.accept('key', value, 5)) { /* value не зустрічалось у останніх 5 */ }
// Або у циклі:
//   for (let i = 0; i < 30; i++) { v = gen(); if (taskMemory.accept('key', v, 5)) break; }
window.taskMemory = {
  _recent: {},
  accept(key, value, max) {
    const arr = this._recent[key] || (this._recent[key] = []);
    if (arr.includes(value)) return false;
    arr.push(value);
    while (arr.length > Math.max(1, max)) arr.shift();
    return true;
  },
  // Викликати після прийняття значення без перевірки (примусово запам'ятати)
  remember(key, value, max) {
    const arr = this._recent[key] || (this._recent[key] = []);
    arr.push(value);
    while (arr.length > Math.max(1, max)) arr.shift();
  },
  reset(key) { if (key) this._recent[key] = []; else this._recent = {}; },
};

const T = () => I18N[state.lang];
const D = () => DIFFICULTY[state.difficulty];

// Експорт у window для модулів-розширень (weights-game.js тощо)
window.state    = state;
window.I18N     = I18N;
window.DIFFICULTY = DIFFICULTY;

// ============ Утиліти ============
const $ = (sel) => document.querySelector(sel);
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Форматує суму як "X € Y ¢" з підписами, ніколи з комою. Локалізує "євро/центів".
const formatEuro = (cents) => {
  const t = T();
  const e = Math.floor(cents / 100);
  const c = cents % 100;
  if (e === 0) return `${c} ¢`;
  if (c === 0) return `${e} €`;
  return `${e} € ${c} ¢`;
};

function svgUse(id, className) {
  return `<svg class="${className}"><use href="#${id}"/></svg>`;
}

// ============ Аудіо: тематичний синтез у дусі K-pop Demon Hunters ============
// Натхнення:
//  - корейські традиційні інструменти (gayageum-пощипування, janggu-перкусія,
//    bell/jing — гонг-хонмун);
//  - K-pop поп-хук у пентатонічній шкалі ("Golden", "Soda Pop");
//  - демонічний регіт Saja Boys + важкий розпад на поразці;
//  - металевий "shing" меча-саінгом при критичному ударі.

let audioCtx = null;
let masterGain = null;
let reverbBus = null;

function getCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return null; }
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(audioCtx.destination);
    // Простий "хонмун-реверб" — короткий згенерований IR
    reverbBus = audioCtx.createConvolver();
    reverbBus.buffer = makeImpulse(audioCtx, 1.4, 2.5);
    const wet = audioCtx.createGain();
    wet.gain.value = 0.35;
    reverbBus.connect(wet).connect(masterGain);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function makeImpulse(ctx, dur, decay) {
  const rate = ctx.sampleRate;
  const len = rate * dur;
  const buf = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}

function makeNoise(ctx, dur) {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * dur);
  const buf = ctx.createBuffer(1, len, rate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

// Тон з ADSR-обгорткою та опційним підмішуванням реверберу
function tone(freq, dur, opts = {}) {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime + (opts.delay || 0);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = opts.type || 'sine';
  osc.frequency.setValueAtTime(freq, t0);
  if (opts.toFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(opts.toFreq, 1), t0 + dur);
  if (opts.detune) osc.detune.value = opts.detune;
  const vol = opts.vol ?? 0.18;
  const atk = opts.atk ?? 0.005;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + atk);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain).connect(masterGain);
  if (opts.reverb && reverbBus) gain.connect(reverbBus);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
  return { osc, gain };
}

// Karplus-Strong-style "пощипана струна" — для гаягиму (корейська цитра)
function pluck(freq, dur, opts = {}) {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime + (opts.delay || 0);
  const src = ctx.createBufferSource();
  src.buffer = makeNoise(ctx, 0.02);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = freq;
  bp.Q.value = opts.q ?? 18;
  const gain = ctx.createGain();
  const vol = opts.vol ?? 0.22;
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  src.connect(bp).connect(gain).connect(masterGain);
  if (opts.reverb && reverbBus) gain.connect(reverbBus);
  src.start(t0);
  src.stop(t0 + dur + 0.05);
}

// Дзвіночок-хонмун: основний тон + 2 непарні гармоніки (як справжній дзвін/jing)
function chime(freq, dur, opts = {}) {
  const v = opts.vol ?? 0.16;
  tone(freq,        dur,        { type: 'sine',     vol: v,        delay: opts.delay, reverb: true });
  tone(freq * 2.76, dur * 0.7,  { type: 'sine',     vol: v * 0.45, delay: opts.delay, reverb: true });
  tone(freq * 5.4,  dur * 0.45, { type: 'sine',     vol: v * 0.22, delay: opts.delay, reverb: true });
}

// "Шиммер" — швидкий висхідний шепіт хонмуну
function shimmer(delay = 0) {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const src = ctx.createBufferSource();
  src.buffer = makeNoise(ctx, 0.7);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.setValueAtTime(2000, t0);
  hp.frequency.exponentialRampToValueAtTime(8000, t0 + 0.6);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(0.12, t0 + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.7);
  src.connect(hp).connect(gain).connect(masterGain);
  if (reverbBus) gain.connect(reverbBus);
  src.start(t0);
  src.stop(t0 + 0.75);
}

// Удар меча-саінгом: різкий метал з фільтрованим шумом + різонансом
function swordSlice(delay = 0) {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const src = ctx.createBufferSource();
  src.buffer = makeNoise(ctx, 0.35);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(900, t0);
  bp.frequency.exponentialRampToValueAtTime(4500, t0 + 0.25);
  bp.Q.value = 6;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0, t0);
  gain.gain.linearRampToValueAtTime(0.28, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.35);
  src.connect(bp).connect(gain).connect(masterGain);
  if (reverbBus) gain.connect(reverbBus);
  src.start(t0);
  src.stop(t0 + 0.4);
  // Металевий "ping" поверх — обертон леза
  tone(3200, 0.28, { type: 'triangle', vol: 0.1, delay });
  tone(1600, 0.18, { type: 'sine',     vol: 0.08, delay: delay + 0.01 });
}

// Корейський janggu/buk — короткий низький удар з шумовим хвостом
function drum(delay = 0, low = true) {
  const ctx = getCtx();
  if (!ctx) return;
  tone(low ? 80 : 180, 0.12, { type: 'sine', toFreq: low ? 35 : 90, vol: 0.32, delay });
  // шумовий "тіло барабана"
  const t0 = ctx.currentTime + delay;
  const src = ctx.createBufferSource();
  src.buffer = makeNoise(ctx, 0.08);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = low ? 400 : 900;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.12, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.08);
  src.connect(lp).connect(g).connect(masterGain);
  src.start(t0);
  src.stop(t0 + 0.1);
}

// Голосовий "Ah-ha!" — формантна імітація вокалу (гласний "ah")
function vocalAh(freq = 440, dur = 0.3, delay = 0) {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc2.type = 'sawtooth';
  osc1.frequency.setValueAtTime(freq, t0);
  osc2.frequency.setValueAtTime(freq, t0);
  osc2.detune.value = 8;
  // Формантні фільтри для гласної "ah": ~700 Hz та ~1220 Hz
  const f1 = ctx.createBiquadFilter();
  f1.type = 'bandpass'; f1.frequency.value = 700; f1.Q.value = 8;
  const f2 = ctx.createBiquadFilter();
  f2.type = 'bandpass'; f2.frequency.value = 1220; f2.Q.value = 9;
  const sum = ctx.createGain(); sum.gain.value = 0.5;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, t0);
  env.gain.linearRampToValueAtTime(0.22, t0 + 0.05);
  env.gain.linearRampToValueAtTime(0.18, t0 + dur * 0.6);
  env.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc1.connect(f1); osc2.connect(f2);
  f1.connect(sum); f2.connect(sum);
  sum.connect(env).connect(masterGain);
  if (reverbBus) env.connect(reverbBus);
  osc1.start(t0); osc2.start(t0);
  osc1.stop(t0 + dur + 0.05); osc2.stop(t0 + dur + 0.05);
}

// ===== Реальні події гри =====

function playClickSound(cents) {
  // Монети — корейська цитра gayageum (короткий pluck) з висотою за номіналом
  if (cents >= 500) {
    // Банкнота: м'який "шурх" + низький pluck
    pluck(140, 0.25, { vol: 0.18 });
    tone(60, 0.18, { type: 'sine', vol: 0.08 });
  } else {
    // Пентатонічна нота за номіналом (мінджо ладу): більше = вище
    const scale = [261.63, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99]; // C-минор пентатоніка
    const idx = Math.min(Math.floor(Math.log2(cents) ), scale.length - 1);
    pluck(scale[idx] * 2, 0.35, { vol: 0.22 });
  }
}

function playRemoveSound() {
  // М'який низхідний pluck — наче струна послаблюється
  pluck(330, 0.18, { vol: 0.16, q: 10 });
  tone(330, 0.12, { type: 'sine', toFreq: 165, vol: 0.06 });
}

function playWinSound() {
  // Перемога у дусі K-pop: barbeau-удар → пентатонічний хук → саінгом-удар → хонмун-дзвін → шиммер → вокал "ah!"
  // 1. Барабани janggu (затакт)
  drum(0,    true);
  drum(0.09, false);

  // 2. Швидкий висхідний пентатонічний хук — "ось він, золотий момент"
  // Пентатоніка від C (D♭ minor для драйву): C5, E♭5, F5, G5, B♭5, C6
  const hook = [523.25, 622.25, 698.46, 783.99, 932.33, 1046.50];
  hook.forEach((f, i) => {
    pluck(f, 0.28, { vol: 0.18, delay: 0.18 + i * 0.07 });
  });

  // 3. "Шинг!" саінгом-меча на кульмінації
  swordSlice(0.55);

  // 4. Хонмун-дзвін (chime) на тоніку — золотий бар'єр відновлено
  chime(523.25, 1.8, { vol: 0.20, delay: 0.65 });
  chime(783.99, 1.6, { vol: 0.14, delay: 0.78 });

  // 5. Шиммер — золоті іскри
  shimmer(0.7);
  shimmer(1.1);

  // 6. Вокальний акорд HUNTR/X — три голоси (Румі/Міра/Зої)
  vocalAh(523.25, 0.45, 1.1);  // Румі — C5
  vocalAh(659.25, 0.45, 1.15); // Міра — E5
  vocalAh(783.99, 0.45, 1.20); // Зої — G5

  // 7. Фінальний саб-удар "перемога"
  tone(80, 0.4, { type: 'sine', toFreq: 40, vol: 0.28, delay: 1.5 });
}

function playLoseSound() {
  // Демонічний регіт Saja Boys: дисонансний інтервал + хихикання + темний саб
  // 1. Низький демонічний "huh" — два розладжених сирени
  tone(180, 0.35, { type: 'sawtooth', toFreq: 110, vol: 0.18, detune: -15 });
  tone(190, 0.35, { type: 'sawtooth', toFreq: 115, vol: 0.16, detune: 20 });

  // 2. "Хі-хі-хі" — три коротких різких підйоми
  for (let i = 0; i < 3; i++) {
    const base = 260 - i * 30;
    tone(base, 0.09, { type: 'square', toFreq: base * 1.4, vol: 0.13, delay: 0.25 + i * 0.11 });
  }

  // 3. Тьмяніє хонмун — реверс-дзвін (низхідний chime)
  tone(440, 0.55, { type: 'sine',     toFreq: 220, vol: 0.1,  delay: 0.5, reverb: true });
  tone(659, 0.45, { type: 'triangle', toFreq: 330, vol: 0.06, delay: 0.55, reverb: true });

  // 4. Фінальний демонічний саб — Ґві-Ма гарчить
  tone(60, 0.6, { type: 'sawtooth', toFreq: 28, vol: 0.18, delay: 0.7 });
  tone(70, 0.6, { type: 'sawtooth', toFreq: 32, vol: 0.14, delay: 0.72, detune: 30 });
}

// Збирає мікс монет/банкнот для суми totalCents з урахуванням рівня складності.
// maxDup — обмеження кількості однакових номіналів.
// allowCentsCarry — true: дозволено генерувати ситуації, коли дрібні монети
// перевищують 100¢ і "переносять" 1+ євро (для складного рівня).
function makeMoneyMix(totalCents, opts = {}) {
  const d = D();
  const maxDup = opts.maxDup ?? d.maxDup;
  const maxCount = opts.maxCount ?? d.maxItemsCount;
  const allowCarry = opts.allowCarry ?? (state.difficulty === 'hard');

  const eurPart = Math.floor(totalCents / 100);
  const centPart = totalCents % 100;

  // Скільки "євро" буде представлено через дрібні монети (carry).
  // На складному — інколи переносимо 1 або 2 євро в дрібну сторону.
  let carryEur = 0;
  if (allowCarry && eurPart >= 1 && Math.random() < 0.5) {
    carryEur = eurPart >= 2 && Math.random() < 0.4 ? 2 : 1;
  }
  const eurPool = (eurPart - carryEur) * 100;
  const centPool = centPart + carryEur * 100;

  const items = [];

  // 1) Євро-частина: банкноти + монети €2/€1
  const eurDenoms = [10000, 5000, 2000, 1000, 500, 200, 100];
  buildSubset(eurPool, eurDenoms, maxDup, items);

  // 2) Цент-частина: дрібні монети (включно з €1/€2 якщо carry створив >200¢)
  const centDenoms = centPool > 200 ? [200, 100, 50, 20, 10, 5, 2, 1] : [50, 20, 10, 5, 2, 1];
  buildSubset(centPool, centDenoms, maxDup, items);

  // Якщо ліміт maxCount перевищено — обрізаємо найдрібніші (на крайній випадок)
  if (items.length > maxCount) {
    items.sort((a, b) => b.cents - a.cents);
    items.length = maxCount;
  }

  // Перемішати
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

// Жадібно заповнює суму target монетами з denoms (відсортовано за спаданням),
// поважаючи maxDup на кожен номінал. Якщо не сходиться — добиває найменшою.
function buildSubset(target, denoms, maxDup, out) {
  if (target <= 0) return;
  const used = {};
  let remaining = target;
  // Перший прохід — жадібно з обмеженням maxDup
  for (const v of denoms) {
    used[v] = used[v] || 0;
    while (remaining >= v && used[v] < maxDup) {
      const denom = (NOTES.find(n => n.cents === v) || COINS.find(c => c.cents === v));
      out.push(denom);
      used[v]++;
      remaining -= v;
    }
  }
  // Якщо лишилося — добиваємо без ліміту найменшими (рідкісний випадок)
  const smallest = denoms[denoms.length - 1];
  while (remaining > 0) {
    const v = denoms.find(x => x <= remaining) || smallest;
    const denom = (NOTES.find(n => n.cents === v) || COINS.find(c => c.cents === v));
    out.push(denom);
    remaining -= v;
  }
}

// ============ Локалізація UI ============
function applyStaticLabels() {
  const t = T();
  document.documentElement.lang = state.lang;
  document.title = t.pageTitle;
  $('#appTitle').textContent = t.title;
  $('#lblScore').textContent = t.score;
  $('#lblStreak').textContent = t.streak;
  $('#lblRound').textContent = t.round;
  const nb = $('#nextRoundBtn');
  if (nb) nb.textContent = t.nextRound;
  updatePlayerChip();
  renderGoalsBar();
}

function renderGoalsBar() {
  const bar = $('#goalsBar');
  if (!bar) return;
  // Збираємо всі (gameId, difficulty) де goal>0
  const cells = [];
  for (const gid of Object.keys(window.Games)) {
    for (const d of ['easy', 'medium', 'hard']) {
      const g = getGoal(gid, d);
      if (g > 0) cells.push({ gid, d, g, p: getProgress(gid, d) });
    }
  }
  if (cells.length === 0) { bar.hidden = true; bar.innerHTML = ''; return; }
  bar.hidden = false;
  const lang = state.lang;
  bar.innerHTML = cells.map(c => {
    const game = window.Games[c.gid];
    const done = c.p >= c.g;
    const pct = Math.min(100, Math.round((c.p / c.g) * 100));
    const stars = c.d === 'easy' ? '★' : c.d === 'medium' ? '★★' : '★★★';
    return `<div class="goal-chip ${done ? 'done' : ''}">
      <span class="goal-icon">${game.icon || '🎮'}</span>
      <span class="goal-label">${game.getName(lang)} ${stars}</span>
      <span class="goal-count">${c.p}/${c.g}</span>
      <span class="goal-bar"><span class="goal-fill" style="width:${pct}%"></span></span>
      ${done ? '<span class="goal-check">✅</span>' : ''}
    </div>`;
  }).join('') + (allGoalsMet() ? '<div class="goals-celebrate">🎁 ¡Misión completa! 🎉</div>' : '');
}

function updatePlayerChip() {
  const chip = $('#playerChip');
  if (!chip) return;
  if (!state.profile) { chip.hidden = true; return; }
  chip.hidden = false;
  const t = T();
  const avatars = { f: '👧', m: '👦', n: '⭐' };
  $('#playerAvatar').textContent = avatars[state.profile.gender] || '⭐';
  $('#playerName').textContent = state.profile.name;
  const diffNames = { easy: t.diffEasy, medium: t.diffMedium, hard: t.diffHard };
  const starsByDiff = { easy: 1, medium: 2, hard: 3 };
  const filled = starsByDiff[state.difficulty] || 0;
  const stars = `<span class="diff-stars">` +
    [0,1,2].map(i => `<span class="s${i < filled ? ' on' : ''}">★</span>`).join('') +
    `</span>`;
  const gameIcon = state.gameMode === 'weights' ? '⚖️' : '💶';
  $('#playerDiff').innerHTML = gameIcon + ' ' + (diffNames[state.difficulty] || '') + stars;
}

function skipToNextRound() {
  state.round++;
  newRound();
}

function setLang(lang) {
  if (!I18N[lang] || state.lang === lang) return;
  state.lang = lang;
  try { localStorage.setItem('lang', lang); } catch (e) {}
  applyStaticLabels();
  newRound();
}

function setDifficulty(diff) {
  if (!DIFFICULTY[diff] || state.difficulty === diff) return;
  state.difficulty = diff;
  try { localStorage.setItem('difficulty', diff); } catch (e) {}
  applyStaticLabels();
  newRound();
}

// ============ Раунди ============
function pickTaskType() {
  const types = ['buy', 'countOptions'];
  if (D().enableInputType) types.push('countInput');
  return choice(types);
}

function moneyNewRound() {
  const type = pickTaskType();
  if (type === 'buy') renderBuyTask();
  else if (type === 'countOptions') renderCountTask(true);
  else renderCountTask(false);
}

// Реєструємо гру грошей у маркетплейсі
registerGame({
  id: 'money',
  icon: '💶',
  getName: (lang) => (window.I18N && window.I18N[lang] && window.I18N[lang].gameMoney) || 'Money',
  newRound: moneyNewRound,
});

function newRound() {
  state.selected = [];
  state.currentTask = null;
  state.challenge.attempts = 0;
  $('#feedback').textContent = '';
  $('#feedback').className = 'feedback';
  $('#round').textContent = state.round;

  const game = window.Games[state.gameMode] || window.Games.money;
  if (game && game.newRound) game.newRound();
}

function renderBuyTask() {
  const t = T();
  const d = D();
  // Генеруємо унікальну комбінацію (товар + ціна), уникаючи 6 останніх
  let item, price;
  for (let attempt = 0; attempt < 30; attempt++) {
    item = choice(t.items);
    price = rand(item.min, item.max);
    price = Math.min(price, d.buyMaxCents);
    if (d.buyCentsStep > 1) price = Math.round(price / d.buyCentsStep) * d.buyCentsStep;
    if (price < 5) price = 5;
    if (taskMemory.accept('money-buy', item.name + ':' + price, 6)) break;
  }
  const clampedPrice = price;

  state.currentTask = { type: 'buy', target: clampedPrice, item };

  $('#taskText').innerHTML = t.buyPrompt(item.emoji, item.name, formatEuro(clampedPrice));

  const area = $('#taskArea');
  area.innerHTML = `
    <div class="pay-zone">
      <div class="zone-label">${t.walletLabel}</div>
      <div class="wallet" id="wallet"></div>
    </div>
    <div class="pay-zone tray-zone">
      <div class="zone-label">${t.trayLabel}</div>
      <div class="tray" id="tray"><div class="tray-empty">${t.trayEmpty}</div></div>
    </div>
  `;

  const wallet = $('#wallet');
  // По одному екземпляру кожного номіналу — можна клацати багато разів
  const denominations = [...NOTES.slice().reverse(), ...COINS.slice().reverse()];
  denominations.forEach(d => {
    const tmp = document.createElement('div');
    tmp.innerHTML = svgUse(d.id, d.type + ' wallet-item');
    const svg = tmp.firstChild;
    svg.dataset.cents = d.cents;
    svg.dataset.denomId = d.id;
    svg.dataset.type = d.type;
    svg.setAttribute('tabindex', '0');
    svg.addEventListener('click', () => addToTray(d));
    wallet.appendChild(svg);
  });

  const controls = $('#controls');
  const showSum = state.difficulty !== 'hard';
  controls.innerHTML = `
    ${showSum ? `<div class="current-sum">${t.currentSum} <span class="val" id="currentSum">0 ¢</span></div>` : ''}
    <button class="btn" id="payBtn">${t.pay}</button>
    <button class="btn secondary" id="clearBtn">${t.clear}</button>
  `;
  $('#payBtn').onclick = checkBuy;
  $('#clearBtn').onclick = clearSelection;
  renderTray();
}

function addToTray(denom) {
  state.selected.push({ cents: denom.cents, id: denom.id, type: denom.type });
  playClickSound(denom.cents);
  renderTray(true);
  updateSum();
}

function removeFromTray(index) {
  state.selected.splice(index, 1);
  playRemoveSound();
  renderTray();
  updateSum();
}

function renderTray(animateLast) {
  const t = T();
  const tray = $('#tray');
  if (!tray) return;
  if (state.selected.length === 0) {
    tray.innerHTML = `<div class="tray-empty">${t.trayEmpty}</div>`;
    return;
  }
  // Сортуємо за спаданням номіналу для красивого вигляду — банкноти зліва, монети справа
  const sorted = state.selected
    .map((s, i) => ({ ...s, origIdx: i }))
    .sort((a, b) => b.cents - a.cents);

  tray.innerHTML = '';
  sorted.forEach((s, i) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = svgUse(s.id, s.type + ' tray-item');
    const svg = tmp.firstChild;
    svg.setAttribute('tabindex', '0');
    svg.addEventListener('click', () => removeFromTray(s.origIdx));
    if (animateLast && s.origIdx === state.selected.length - 1) {
      svg.classList.add('drop-in');
    }
    tray.appendChild(svg);
  });
}

function clearSelection() {
  state.selected = [];
  playRemoveSound();
  renderTray();
  updateSum();
}

function updateSum() {
  const total = state.selected.reduce((a, b) => a + b.cents, 0);
  const el = $('#currentSum');
  if (el) el.textContent = formatEuro(total);
}

function checkBuy() {
  const t = T();
  const total = state.selected.reduce((a, b) => a + b.cents, 0);
  if (total === state.currentTask.target) {
    win(t.bought(state.currentTask.item.emoji, state.currentTask.item.name));
  } else {
    const diff = total - state.currentTask.target;
    const hint = diff > 0
      ? t.tooMuch(formatEuro(diff))
      : t.notEnough(formatEuro(-diff));
    lose(hint);
  }
}

function renderCountTask(withOptions) {
  const t = T();
  const d = D();
  // Гаманець має містити мінімум 2 предмети (інакше "знайшли 1 монету" — нецікаво).
  // Повторюємо генерацію до 20 разів. На крайній випадок додаємо ще одну дрібну монету.
  let total, mix, realTotal;
  for (let attempt = 0; attempt < 30; attempt++) {
    total = rand(d.countMinCents, d.countMaxCents);
    mix = makeMoneyMix(total, { maxCount: d.maxItemsCount });
    if (mix.length < 2) continue;
    realTotal = mix.reduce((a, b) => a + b.cents, 0);
    // Унікальність по сумі та типу завдання
    if (taskMemory.accept('money-count-' + (withOptions ? 'O' : 'I'), realTotal, 6)) break;
  }
  if (!mix || mix.length < 2) {
    mix = mix || [];
    mix.push(COINS[0]);
    realTotal = mix.reduce((a, b) => a + b.cents, 0);
  }

  state.currentTask = { type: withOptions ? 'countOptions' : 'countInput', target: realTotal };

  // Сценарій — уникаємо повтору 4 останніх
  let scenario;
  for (let i = 0; i < 20; i++) {
    scenario = choice(t.countScenarios);
    if (taskMemory.accept('money-scenario', scenario, 4)) break;
  }
  const hint = withOptions ? t.countOptionsHint : t.countInputHint;
  $('#taskText').innerHTML =
    `${scenario}<br>${hint}`;

  const area = $('#taskArea');
  area.innerHTML = '';
  // Рендеримо кожну монету/банкноту окремо. Сортуємо за спаданням номіналу:
  // банкноти зліва (більше місця), монети справа.
  const sorted = mix.slice().sort((a, b) => b.cents - a.cents);
  sorted.forEach(d => {
    const wrap = document.createElement('div');
    wrap.innerHTML = svgUse(d.id, d.type);
    area.appendChild(wrap.firstChild);
  });

  const controls = $('#controls');
  if (withOptions) {
    const options = generateOptions(realTotal);
    controls.innerHTML = options.map(v =>
      `<button class="btn option" data-val="${v}">${formatEuro(v)}</button>`
    ).join('');
    controls.querySelectorAll('button').forEach(b => {
      b.onclick = () => {
        const v = parseInt(b.dataset.val, 10);
        if (v === realTotal) win(t.exactHit);
        else lose(t.correctIs(formatEuro(realTotal)));
      };
    });
  } else {
    controls.innerHTML = `
      <div class="dual-input">
        <input class="answer eur" id="eurInput" placeholder="0" inputmode="numeric" autocomplete="off" min="0" max="99" type="number"/>
        <span class="unit">${t.eurLabel} €</span>
        <input class="answer cent" id="centInput" placeholder="0" inputmode="numeric" autocomplete="off" min="0" max="99" type="number"/>
        <span class="unit">${t.centLabel} ¢</span>
      </div>
      <button class="btn" id="checkBtn">${t.check}</button>
    `;
    const eurI = $('#eurInput');
    const centI = $('#centInput');
    eurI.focus();
    [eurI, centI].forEach(i => {
      i.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkInput(); });
    });
    $('#checkBtn').onclick = checkInput;
  }
}

function checkInput() {
  const t = T();
  const eurRaw = ($('#eurInput').value || '').trim();
  const centRaw = ($('#centInput').value || '').trim();
  if (eurRaw === '' && centRaw === '') return;
  const eur = parseInt(eurRaw || '0', 10);
  const cent = parseInt(centRaw || '0', 10);
  if (isNaN(eur) || isNaN(cent) || eur < 0 || cent < 0 || cent > 99) {
    lose(t.enterNumber);
    return;
  }
  const cents = eur * 100 + cent;
  if (cents === state.currentTask.target) win(t.bullseye);
  else lose(t.correctIs(formatEuro(state.currentTask.target)));
}

function generateOptions(correct) {
  const d = D();
  // Поляризація варіантів за рівнем
  const pools = {
    wide:   [-500, -300, -200, -100, 100, 200, 300, 500, 700, -700],
    medium: [-200, -100, -50, 50, 100, 200, 11, -11, 99, -99],
    tight:  [-50, -10, -5, 5, 10, 50, 11, -11, 1, -1],
  };
  const deltas = pools[d.optionsSpread] || pools.medium;
  const set = new Set([correct]);
  let guard = 0;
  while (set.size < 4 && guard++ < 50) {
    const delta = choice(deltas);
    let candidate = correct + delta;
    if (candidate < 0) candidate = correct + Math.abs(delta) * 2;
    if (candidate > 0 && candidate !== correct) set.add(candidate);
  }
  return [...set].sort(() => Math.random() - 0.5);
}

// ============ Перемога / поразка ============
function win(extraText) {
  state.score++;
  state.streak++;
  incProgress(state.gameMode, state.difficulty);
  renderGoalsBar();
  $('#score').textContent = state.score;
  $('#streak').textContent = state.streak;
  $('#feedback').textContent = '✨ ' + extraText;
  $('#feedback').className = 'feedback ok';
  playWinSound();
  playWinAnimation();

  // Челендж: оновлюємо статистику першої спроби та просування
  if (state.challenge.active) {
    const taskType = (state.currentTask && state.currentTask.type) || 'unknown';
    const firstTry = state.challenge.attempts === 0;
    const st = state.challenge.stats[taskType] || (state.challenge.stats[taskType] = { firstTry: 0, total: 0 });
    st.total++;
    if (firstTry) st.firstTry++;
    const cur = state.challenge.plan[state.challenge.current];
    if (cur) cur.done++;

    if (cur && cur.done >= cur.goal) {
      // Гра завершена — переходимо до наступної
      setTimeout(() => advanceChallenge(), 3900);
      return;
    }
  }

  setTimeout(() => {
    state.round++;
    state.challenge.attempts = 0;
    newRound();
  }, 3900);
}

function lose(hint) {
  const t = T();
  state.streak = 0;
  $('#streak').textContent = '0';
  $('#feedback').textContent = '❌ ' + hint + ' ' + t.tryAgain;
  $('#feedback').className = 'feedback bad';
  playLoseSound();
  playLoseAnimation();
  if (state.challenge.active) state.challenge.attempts++;
}

// ============ Анімації ============
// Підставляє {name}, {title}, {adj.X} під поточний профіль гравця.
function fillPlaceholders(text) {
  if (!state.profile) return text;
  const t = T();
  const g = state.profile.gender || 'n';
  text = text.replace(/\{name\}/g, state.profile.name);
  text = text.replace(/\{title\}/g, () => choice((t.titles && t.titles[g]) || t.titles?.n || ['']));
  text = text.replace(/\{adj\.([a-z]+)\}/g, (_, key) => (t.adj && t.adj[g] && t.adj[g][key]) || '');
  return text;
}

// 70% — вибираємо персоналізовану фразу (з {name}/{title}), 30% — загальну
function pickHeroPhrase() {
  const t = T();
  const personalized = t.personalizedHero || [];
  if (state.profile && personalized.length && Math.random() < 0.7) {
    return fillPlaceholders(choice(personalized));
  }
  return fillPlaceholders(choice(t.heroPhrases));
}

function pickLosePhrase() {
  const t = T();
  const personalized = t.personalizedLose || [];
  if (state.profile && personalized.length && Math.random() < 0.7) {
    return fillPlaceholders(choice(personalized));
  }
  return fillPlaceholders(choice(t.losePhrases));
}

function playWinAnimation() {
  const t = T();
  const stage = $('#animStage');
  const overlay = $('#animOverlay');
  stage.innerHTML = '';
  overlay.classList.add('active');

  const phrase = pickHeroPhrase();

  const demon = document.createElement('div');
  demon.className = 'demon-anim';
  demon.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 100 120"><use href="#demon"/></svg>`;
  demon.style.cssText += 'top: 30%; left: 50%; margin-left: -100px;';
  stage.appendChild(demon);

  const hero = document.createElement('div');
  hero.className = 'hero-anim';
  hero.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 100 120"><use href="#hero"/></svg>`;
  hero.style.cssText += 'top: 28%;';
  stage.appendChild(hero);

  setTimeout(() => {
    const slash = document.createElement('div');
    slash.className = 'sword-slash';
    stage.appendChild(slash);

    const honmoon = document.createElement('div');
    honmoon.className = 'honmoon-circle';
    stage.appendChild(honmoon);

    demon.classList.add('killed');

    for (let i = 0; i < 30; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      const colors = ['#ffd700', '#ff6ad4', '#9a4ad4', '#fff', '#6affd4'];
      c.style.background = choice(colors);
      const angle = Math.random() * Math.PI * 2;
      const dist = 200 + Math.random() * 250;
      c.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      c.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      c.style.animationDelay = (Math.random() * 0.2) + 's';
      stage.appendChild(c);
    }

    const txt = document.createElement('div');
    txt.className = 'win-text';
    txt.textContent = phrase;
    stage.appendChild(txt);
  }, 400);

  setTimeout(() => {
    overlay.classList.remove('active');
    stage.innerHTML = '';
  }, 3800);
}

function playLoseAnimation() {
  const t = T();
  const stage = $('#animStage');
  const overlay = $('#animOverlay');
  overlay.classList.add('active');

  const txt = document.createElement('div');
  txt.className = 'lose-anim';
  txt.textContent = pickLosePhrase();
  // Дозволити дитині закрити повідомлення тапом, якщо хоче швидше
  txt.addEventListener('click', () => {
    overlay.classList.remove('active');
    setTimeout(() => { stage.innerHTML = ''; }, 200);
  });
  stage.appendChild(txt);

  setTimeout(() => {
    overlay.classList.remove('active');
    setTimeout(() => { stage.innerHTML = ''; }, 200);
  }, 3600);
}

// ============ Ініціалізація ============
// ============ Профіль гравця та вітальна модалка ============
function loadProfile() {
  try {
    const raw = localStorage.getItem('profile');
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p && typeof p.name === 'string' && ['f','m','n'].includes(p.gender)) return p;
  } catch (e) {}
  return null;
}

function saveProfile(p) {
  try { localStorage.setItem('profile', JSON.stringify(p)); } catch (e) {}
}

// Стан модалки (заповнюється при показі)
const welcome = {
  mode: 'first',   // 'first' | 'settings'
  selGender: null,
  selDiff: null,
  selLang: null,
  selGame: null,
};

function renderWelcomeGameCards() {
  const grid = $('#welcomeGameGrid');
  if (!grid) return;
  const games = listGames();
  // Підлаштовуємо к-сть колонок під число ігор
  grid.classList.remove('two-col', 'three-col');
  grid.classList.add(games.length <= 2 ? 'two-col' : 'three-col');
  grid.innerHTML = games.map(g => `
    <button class="gender-btn game-card" data-w-game="${g.id}">
      <span class="gender-emoji">${g.icon}</span>
      <span class="gender-text">${g.getName(state.lang)}</span>
    </button>
  `).join('');
  grid.querySelectorAll('.gender-btn[data-w-game]').forEach(b => {
    b.classList.toggle('active', b.dataset.wGame === welcome.selGame);
    b.addEventListener('click', () => {
      welcome.selGame = b.dataset.wGame;
      grid.querySelectorAll('.gender-btn[data-w-game]').forEach(x =>
        x.classList.toggle('active', x === b));
      refreshStartEnabled();
    });
  });
}

function applyWelcomeLabels() {
  const t = T();
  $('#welcomeTitle').textContent = welcome.mode === 'settings' ? t.settingsTitle : t.welcomeTitle;
  $('#welcomeSub').textContent = welcome.mode === 'settings' ? '' : t.welcomeSub;
  $('#welcomeSub').style.display = welcome.mode === 'settings' ? 'none' : '';
  $('#welcomeLangLabel').textContent = t.welcomeLangLabel;
  $('#welcomeNameLabel').textContent = t.welcomeNameLabel;
  $('#welcomeGenderLabel').textContent = t.welcomeGenderLabel;
  $('#welcomeDiffLabel').textContent = t.welcomeDiffLabel;
  const gl = $('#welcomeGameLabel');
  if (gl) gl.textContent = t.welcomeGameLabel;
  renderWelcomeGameCards();
  $('#welcomeStart').textContent = welcome.mode === 'settings' ? t.welcomeSave : t.welcomeStart;
  $('#welcomeCancel').textContent = t.welcomeCancel;
  $('#welcomeName').placeholder = t.namePlaceholder;
  document.querySelector('[data-g-text="f"]').textContent = t.genderF;
  document.querySelector('[data-g-text="m"]').textContent = t.genderM;
  document.querySelector('[data-g-text="n"]').textContent = t.genderN;
  document.querySelector('[data-w-diff-text="easy"]').textContent   = t.diffEasy;
  document.querySelector('[data-w-diff-text="medium"]').textContent = t.diffMedium;
  document.querySelector('[data-w-diff-text="hard"]').textContent   = t.diffHard;
  document.querySelectorAll('#welcomeFlags .flag').forEach(f =>
    f.classList.toggle('active', f.dataset.lang === welcome.selLang));
}

let welcomeWired = false;

function wireWelcomeOnce() {
  if (welcomeWired) return;
  welcomeWired = true;

  document.querySelectorAll('#welcomeFlags .flag').forEach(f => {
    f.addEventListener('click', () => {
      welcome.selLang = f.dataset.lang;
      state.lang = welcome.selLang;
      applyWelcomeLabels();
    });
  });

  document.querySelectorAll('.gender-btn[data-gender]').forEach(b => {
    b.addEventListener('click', () => {
      welcome.selGender = b.dataset.gender;
      document.querySelectorAll('.gender-btn[data-gender]').forEach(x =>
        x.classList.toggle('active', x === b));
      refreshStartEnabled();
    });
  });

  document.querySelectorAll('.gender-btn[data-w-diff]').forEach(b => {
    b.addEventListener('click', () => {
      welcome.selDiff = b.dataset.wDiff;
      document.querySelectorAll('.gender-btn[data-w-diff]').forEach(x =>
        x.classList.toggle('active', x === b));
      refreshStartEnabled();
    });
  });

  // Картки ігор виставляються динамічно через renderWelcomeGameCards()

  $('#welcomeName').addEventListener('input', refreshStartEnabled);
  $('#welcomeName').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !$('#welcomeStart').disabled) $('#welcomeStart').click();
  });

  $('#welcomeStart').addEventListener('click', confirmWelcome);
  $('#welcomeCancel').addEventListener('click', cancelWelcome);
}

function refreshStartEnabled() {
  const nameOk = $('#welcomeName').value.trim().length > 0;
  $('#welcomeStart').disabled = !(nameOk && welcome.selGender && welcome.selDiff && welcome.selLang && welcome.selGame);
}

function confirmWelcome() {
  const name = $('#welcomeName').value.trim();
  if (!name || !welcome.selGender || !welcome.selDiff || !welcome.selLang || !welcome.selGame) return;
  state.lang = welcome.selLang;
  state.difficulty = welcome.selDiff;
  state.gameMode = welcome.selGame;
  state.profile = { name, gender: welcome.selGender };
  try {
    localStorage.setItem('lang', state.lang);
    localStorage.setItem('difficulty', state.difficulty);
    localStorage.setItem('gameMode', state.gameMode);
  } catch (e) {}
  saveProfile(state.profile);
  $('#welcomeOverlay').hidden = true;
  applyStaticLabels();
  const fb = $('#feedback');
  fb.textContent = T().greetBack(name);
  fb.className = 'feedback ok';
  setTimeout(() => { fb.textContent = ''; fb.className = 'feedback'; }, 3500);
  newRound();
}

function cancelWelcome() {
  // Відкочуємо тимчасову зміну мови, якщо була
  if (welcome.savedLang && state.lang !== welcome.savedLang) {
    state.lang = welcome.savedLang;
    applyStaticLabels();
  }
  $('#welcomeOverlay').hidden = true;
}

function openWelcome(mode) {
  welcome.mode = mode;
  welcome.selLang = state.lang;
  welcome.savedLang = state.lang;
  // У режимі налаштувань — поточні значення; у режимі першого запуску — розумні дефолти
  welcome.selGender = state.profile ? state.profile.gender : (mode === 'first' ? 'n' : null);
  welcome.selDiff   = state.difficulty || (mode === 'first' ? 'medium' : null);
  welcome.selGame   = state.gameMode   || (mode === 'first' ? 'money'  : null);

  $('#welcomeName').value = state.profile ? state.profile.name : '';
  document.querySelectorAll('.gender-btn[data-gender]').forEach(b =>
    b.classList.toggle('active', b.dataset.gender === welcome.selGender));
  document.querySelectorAll('.gender-btn[data-w-diff]').forEach(b =>
    b.classList.toggle('active', b.dataset.wDiff === welcome.selDiff));
  // Картки ігор отримують active через renderWelcomeGameCards (всередині applyWelcomeLabels)
  $('#welcomeCancel').hidden = (mode !== 'settings');

  applyWelcomeLabels();
  refreshStartEnabled();
  $('#welcomeOverlay').hidden = false;
  wireWelcomeOnce();
  if (mode === 'first') $('#welcomeName').focus();
}

// ============ Челендж ============
const challengeDraft = {
  difficulty: 'medium',
  goals: {}, // { gameId: { enabled, goal } }
};

function openChallenge() {
  // Початкові значення — поточна складність + усі ігри активні з ціллю 5
  challengeDraft.difficulty = state.difficulty || 'medium';
  challengeDraft.goals = {};
  listGames().forEach(g => {
    challengeDraft.goals[g.id] = { enabled: true, goal: 5 };
  });
  renderChallengeUI();
  $('#challengeOverlay').hidden = false;
}

function closeChallenge() {
  $('#challengeOverlay').hidden = true;
}

function renderChallengeUI() {
  const t = T();
  $('#challengeTitle').textContent = t.challengeTitle;
  $('#challengeSub').textContent = t.challengeSub;
  $('#challengeDiffLabel').textContent = t.challengeDiffLabel;
  $('#challengeGoalsLabel').textContent = t.challengeGoalsLabel;
  $('#challengeStart').textContent = t.challengeStart;
  $('#challengeCancel').textContent = t.challengeCancel;

  // Локалізація рівнів
  document.querySelector('[data-c-diff-text="easy"]').textContent   = t.diffEasy;
  document.querySelector('[data-c-diff-text="medium"]').textContent = t.diffMedium;
  document.querySelector('[data-c-diff-text="hard"]').textContent   = t.diffHard;

  // Активний рівень
  document.querySelectorAll('#challengeDiffGrid .gender-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.cDiff === challengeDraft.difficulty));

  // Рядки ігор з чекбоксом + ціллю
  const wrap = $('#challengeGoals');
  wrap.innerHTML = listGames().map(g => {
    const gd = challengeDraft.goals[g.id];
    return `<label class="challenge-goal-row ${gd.enabled ? 'on' : 'off'}" data-c-game="${g.id}">
      <input type="checkbox" class="row-toggle" ${gd.enabled ? 'checked' : ''}/>
      <span class="row-label">
        <span class="game-icon">${g.icon}</span>
        <span>${g.getName(state.lang)}</span>
      </span>
      <input type="number" class="row-goal" min="1" max="99" value="${gd.goal}"/>
    </label>`;
  }).join('');

  // Wire-up
  wrap.querySelectorAll('.challenge-goal-row').forEach(row => {
    const gid = row.dataset.cGame;
    const cb = row.querySelector('.row-toggle');
    const goalInp = row.querySelector('.row-goal');
    cb.addEventListener('change', () => {
      challengeDraft.goals[gid].enabled = cb.checked;
      row.classList.toggle('on', cb.checked);
      row.classList.toggle('off', !cb.checked);
      refreshChallengeStart();
    });
    goalInp.addEventListener('input', () => {
      challengeDraft.goals[gid].goal = Math.max(1, Math.min(99, parseInt(goalInp.value || '0', 10) || 0));
    });
  });

  document.querySelectorAll('#challengeDiffGrid .gender-btn').forEach(b => {
    b.addEventListener('click', () => {
      challengeDraft.difficulty = b.dataset.cDiff;
      document.querySelectorAll('#challengeDiffGrid .gender-btn').forEach(x =>
        x.classList.toggle('active', x === b));
    });
  });

  refreshChallengeStart();
}

function refreshChallengeStart() {
  const anyEnabled = Object.values(challengeDraft.goals).some(g => g.enabled && g.goal > 0);
  $('#challengeStart').disabled = !anyEnabled;
}

function startChallenge() {
  const plan = [];
  for (const g of listGames()) {
    const gd = challengeDraft.goals[g.id];
    if (gd && gd.enabled && gd.goal > 0) {
      plan.push({ gameId: g.id, goal: gd.goal, done: 0 });
    }
  }
  if (plan.length === 0) return;
  state.challenge.active = true;
  state.challenge.difficulty = challengeDraft.difficulty;
  state.challenge.plan = plan;
  state.challenge.current = 0;
  state.challenge.attempts = 0;
  state.challenge.stats = {};
  state.difficulty = challengeDraft.difficulty;
  state.gameMode = plan[0].gameId;
  try {
    localStorage.setItem('difficulty', state.difficulty);
    localStorage.setItem('gameMode', state.gameMode);
  } catch (e) {}
  document.body.classList.add('challenge-active');
  closeChallenge();
  applyStaticLabels();

  // Анімація-привітання та запуск
  const game = window.Games[state.gameMode];
  showChallengeTransition(T().challengeBegin(game.getName(state.lang)));
  setTimeout(() => {
    state.round = 1;
    newRound();
  }, 1700);
}

function advanceChallenge() {
  state.challenge.current++;
  if (state.challenge.current >= state.challenge.plan.length) {
    finishChallenge();
    return;
  }
  const cur = state.challenge.plan[state.challenge.current];
  state.gameMode = cur.gameId;
  try { localStorage.setItem('gameMode', state.gameMode); } catch (e) {}
  applyStaticLabels();
  const game = window.Games[state.gameMode];
  showChallengeTransition(T().challengeNext(game.getName(state.lang)));
  setTimeout(() => {
    state.round++;
    state.challenge.attempts = 0;
    newRound();
  }, 1700);
}

function showChallengeTransition(text) {
  const div = document.createElement('div');
  div.className = 'challenge-transition';
  div.innerHTML = `<div class="ct-content">${text}</div>`;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1600);
}

function finishChallenge() {
  state.challenge.active = false;
  document.body.classList.remove('challenge-active');
  renderChallengeSummary();
  $('#summaryOverlay').hidden = false;
}

function renderChallengeSummary() {
  const t = T();
  const body = $('#summaryBody');
  $('#summaryTitleText').textContent = t.challengeDone;
  $('#summaryClose').textContent = '✅ ОК';

  let allTotal = 0, allFirst = 0;
  const planByGame = {};
  state.challenge.plan.forEach(p => { planByGame[p.gameId] = p; });

  // Збираємо задачі по іграх
  const gameToTasks = {};
  for (const taskType in state.challenge.stats) {
    const gameId = guessGameFromTaskType(taskType);
    (gameToTasks[gameId] = gameToTasks[gameId] || []).push({ taskType, ...state.challenge.stats[taskType] });
  }

  let html = '';
  for (const gid of Object.keys(gameToTasks)) {
    const game = window.Games[gid];
    if (!game) continue;
    const plan = planByGame[gid];
    const tasks = gameToTasks[gid];
    const gameTotal = tasks.reduce((s, x) => s + x.total, 0);
    const gameFirst = tasks.reduce((s, x) => s + x.firstTry, 0);
    allTotal += gameTotal; allFirst += gameFirst;
    html += `<div class="summary-game">
      <div class="summary-game-head">
        <span class="game-title">${game.icon} ${game.getName(state.lang)}</span>
        <span class="game-total">${plan ? plan.done : gameTotal}/${plan ? plan.goal : gameTotal} ✅</span>
      </div>
      ${tasks.map(x => {
        const pct = x.total > 0 ? Math.round(x.firstTry / x.total * 100) : 0;
        const cls = pct >= 80 ? '' : (pct >= 50 ? 'ok' : 'poor');
        const name = (t.taskTypeNames && t.taskTypeNames[x.taskType]) || x.taskType;
        return `<div class="summary-task ${cls}">
          <span>⭐ ${name}</span>
          <span>${x.firstTry}/${x.total}</span>
          <span class="task-pct">${pct}%</span>
        </div>`;
      }).join('')}
    </div>`;
  }
  const overallPct = allTotal > 0 ? Math.round(allFirst / allTotal * 100) : 0;
  html += `<div class="summary-overall">
    ${t.summaryTotal} ${allTotal} | ${allFirst} ${t.summaryFirstTry} (${overallPct}%)
  </div>`;
  body.innerHTML = html;
}

function guessGameFromTaskType(taskType) {
  if (taskType.startsWith('weight')) return 'weights';
  if (taskType.startsWith('volume')) return 'volumes';
  return 'money';
}

function init() {
  try {
    const savedLang = localStorage.getItem('lang');
    if (savedLang && I18N[savedLang]) state.lang = savedLang;
    const savedDiff = localStorage.getItem('difficulty');
    if (savedDiff && DIFFICULTY[savedDiff]) state.difficulty = savedDiff;
    // Не перевіряємо проти Games (модулі ще не встигли зареєструватися);
    // диспетчер у newRound() сам відкотиться до money, якщо назва невідома.
    const savedGame = localStorage.getItem('gameMode');
    if (typeof savedGame === 'string' && savedGame) state.gameMode = savedGame;
    state.profile = loadProfile();
    state.progress = loadProgress();
    state.goals    = loadGoals();
  } catch (e) {}

  const nb = $('#nextRoundBtn');
  if (nb) nb.addEventListener('click', skipToNextRound);

  const sb = $('#settingsBtn');
  if (sb) sb.addEventListener('click', () => openWelcome('settings'));

  const cb = $('#challengeBtn');
  if (cb) cb.addEventListener('click', openChallenge);
  const cStart = $('#challengeStart');
  if (cStart) cStart.addEventListener('click', startChallenge);
  const cCancel = $('#challengeCancel');
  if (cCancel) cCancel.addEventListener('click', closeChallenge);
  const sumClose = $('#summaryClose');
  if (sumClose) sumClose.addEventListener('click', () => { $('#summaryOverlay').hidden = true; });

  // ESC закриває модалки (крім першого запуску, де профіль обов'язковий)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('#welcomeOverlay').hidden && welcome.mode === 'settings') return cancelWelcome();
    if (!$('#challengeOverlay').hidden) return closeChallenge();
    if (!$('#summaryOverlay').hidden) { $('#summaryOverlay').hidden = true; }
  });

  applyStaticLabels();

  if (!state.profile) {
    openWelcome('first');
  } else {
    const fb = $('#feedback');
    fb.textContent = T().greetBack(state.profile.name);
    fb.className = 'feedback ok';
    setTimeout(() => { fb.textContent = ''; fb.className = 'feedback'; }, 3500);
    newRound();
  }
}

// Запускаємо init ПІСЛЯ того, як усі модулі ігор встигнуть зареєструватися.
// У режимі тестів init не запускається — тести викликають його за потреби.
if (!window.__TEST_MODE__) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }
}

// Експорт для тестів
window._test = {
  formatEuro, makeMoneyMix, buildSubset, generateOptions,
  fillPlaceholders, pickHeroPhrase, pickLosePhrase,
  pickTaskType, allGoalsMet, getProgress, incProgress, getGoal, setGoal,
  loadProfile, saveProfile,
  COINS, NOTES, ITEMS: undefined, // ITEMS живуть у I18N
};
