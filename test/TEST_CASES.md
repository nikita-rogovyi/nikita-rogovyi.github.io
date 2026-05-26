# Тест-кейси KPop Money Trainer

Запуск: відкрий `test/runner.html` у браузері. Скрипт автоматично прогоне всі тести й покаже зведення вгорі. Кнопкою «▶ Прогнати тести знову» можна повторити.

Усі тести — unit-рівня (чисті функції). UI-флоу (модалка, win/lose анімація, переходи раундів) поки не покриті — вони потребують повноцінного integration-runner'a.

---

## 1. Спільні утиліти (`script.js`) — `test-common.js`

### 1.1 `formatEuro`
- ✅ `formatEuro(0)` → `"0 ¢"`
- ✅ `formatEuro(50)` / `formatEuro(99)` → `"50 ¢"` / `"99 ¢"`
- ✅ `formatEuro(100)` → `"1 €"`, `formatEuro(10000)` → `"100 €"`
- ✅ `formatEuro(150)` → `"1 € 50 ¢"`, `formatEuro(2345)` → `"23 € 45 ¢"`

### 1.2 `makeMoneyMix`
- ✅ Сума елементів завжди дорівнює таргету (для багатьох значень)
- ✅ Для великих сум (5000+) обов'язково є щонайменше одна банкнота
- ✅ Для дрібних сум (<100) лише монети

### 1.3 `generateOptions` (гроші)
- ✅ Правильна відповідь завжди серед 4 варіантів
- ✅ Усі 4 варіанти унікальні
- ✅ Усі варіанти > 0

### 1.4 `taskMemory`
- ✅ `accept` повертає `true` для нового значення
- ✅ Повторення в межах вікна повертає `false`
- ✅ Старе значення «випадає» після перевищення вікна
- ✅ Окремі ключі — незалежні
- ✅ `reset(key)` очищує запам'ятане

### 1.5 `fillPlaceholders`
- ✅ `{name}` → ім'я з профілю
- ✅ `{title}` → один з гендерно-узгоджених варіантів
- ✅ `{adj.real}` для жіночого/чоловічого роду коректний
- ✅ Без профілю — рядок без змін (плейсхолдери лишаються)
- ✅ Кілька підстановок в одному рядку

### 1.6 Прогрес + цілі від батьків
- ✅ `incProgress` інкрементує лічильник
- ✅ Різні складності — окремі лічильники
- ✅ `setGoal` зберігає число
- ✅ `allGoalsMet`: `false` коли немає цілей
- ✅ `allGoalsMet`: `true` тільки коли всі встановлені цілі досягнуті

### 1.7 I18N повнота (для uk, ru, es)
- ✅ Усі обов'язкові ключі присутні (заголовки, кнопки, мітки, фрази)
- ✅ `titles` містить варіанти для `f`, `m`, `n`
- ✅ `adj` містить усі ключі (great, amazing, best, real, ready, proud) × 3 роди
- ✅ Щонайменше 10 hero phrases на мову
- ✅ Щонайменше 10 count scenarios
- ✅ Щонайменше 15 ITEMS

### 1.8 Профіль (localStorage)
- ✅ `saveProfile` + `loadProfile` round-trip
- ✅ Відкидається невалідний gender
- ✅ Повертає `null` коли немає збереженого профілю

### 1.9 Реєстр ігор
- ✅ `money`, `weights`, `volumes` зареєстровані
- ✅ У кожної є іконка, `newRound`, `getName`
- ✅ `getName` повертає рядок для всіх 3 мов

### 1.10 `pickHeroPhrase` / `pickLosePhrase`
- ✅ Повертають непустий рядок
- ✅ Немає невирішених плейсхолдерів (`{name}`, `{title}`, `{adj.*}`) у виводі
- ✅ Без профілю — у фразі немає підставленого імені

---

## 2. Гра ваг (`weights-game.js`) — `test-weights.js`

### 2.1 `isAllowedQ`
- ✅ Відкидає q%4 === 3 (¾): 3, 7, 11, 23
- ✅ Приймає цілі + ½ + ¼: 0, 1, 2, 4, 5, 6, 8, 9, 10, 12...
- ✅ Відкидає від'ємні

### 2.2 `randAllowedQ`
- ✅ Ніколи не повертає ¾ (100 спроб)
- ✅ Тримається в заданому діапазоні

### 2.3 `formatWeight` (uk + es)
- ✅ `formatWeight(0)` → `"0 кг"`
- ✅ Цілі: `4` → `"1 кг"`, `8` → `"2 кг"`
- ✅ Дроби: `1` → `"¼ кг"`, `2` → `"½ кг"`
- ✅ Змішані: `5` → `"1 ¼ кг"`, `6` → `"1 ½ кг"`, `9` → `"2 ¼ кг"`
- ✅ Іспанська: одиниця `"kg"`

### 2.4 `makeWeightMix`
- ✅ Сума завжди = таргет (для всіх допустимих 1..24)
- ✅ `large-first` для 4q → 1×1кг (один елемент)
- ✅ `small-first` для 4q → 4×¼ (демонструє «4 чверті = 1 кг»)
- ✅ `small-first` для 8q → рівно 4×¼ + 2×½ (демонструє обидві лекції)
- ✅ Поважає maxDup на номінал

### 2.5 `generateOptions` (ваги)
- ✅ 4 унікальні варіанти + правильна відповідь
- ✅ Жоден неправильний варіант не містить ¾
- ✅ Усі додатні

### 2.6 Конфіг WDIFF
- ✅ `easy.bias = 'large-first'`, без введення
- ✅ `medium.enableInput = true`
- ✅ `hard.bias = 'small-first'`, з введенням

### 2.7 I18N ваг (uk, ru, es)
- ✅ Кожна мова має `kg`
- ✅ Щонайменше 8 сценаріїв
- ✅ `fracLabels` НЕ містить ключа `3` (відсутня ¾)

---

## 3. Гра літрів (`volumes-game.js`) — `test-volumes.js`

### 3.1 `isAllowedQ`
- ✅ Те саме, що для ваг — відкидає ¾

### 3.2 `formatVolume`
- ✅ `0` → `"0 л"` (uk), `"0 L"` (es)
- ✅ Цілі / дроби / змішані аналогічно вагам

### 3.3 `makeVolumeMix`
- ✅ Сума = таргет
- ✅ `small-first` для 8q → 4×¼ + 2×½

### 3.4 Конфіг VDIFF
- ✅ `hard.bias = 'small-first'`
- ✅ `easy.enableInput = false`

### 3.5 I18N літрів
- ✅ Кожна мова має `L`
- ✅ Щонайменше 8 сценаріїв
- ✅ `gameVolumes` — назва гри

### 3.6 `generateOptions`
- ✅ Без ¾, унікальні, включають правильну

---

## 4. Челендж-режим (`script.js`) — `test-challenge.js`

### 4.1 Початковий стан
- ✅ `state.challenge.active` === `false`
- ✅ `plan: []`, `stats: {}` ініціалізовані

### 4.2 Трекінг статистики через win()
- ✅ Перша спроба (attempts=0) → `firstTry++`
- ✅ Після lose (attempts>0) → win НЕ рахує як firstTry

### 4.3 Просування плану
- ✅ `plan[current].done` інкрементує
- ✅ `current++` перемикає на наступну гру
- ✅ Завершення коли `current >= plan.length`

### 4.4 I18N челенджу (uk, ru, es)
- ✅ Ключі: `challengeTitle/Sub/DiffLabel/GoalsLabel/Start/Cancel/Done`, `summaryTotal/FirstTry`, `taskTypeNames`
- ✅ `challengeBegin(name)` і `challengeNext(name)` — функції
- ✅ `taskTypeNames` покриває 7 типів: buy, countOptions, countInput, weightCount, weightBuild, volumeCount, volumeBuild

---

## 5. Гра множення (`multiplication-game.js`) — `test-arithmetic.js`

### 5.1 `pickEquation`
- ✅ a, b ∈ [1, 10], ans = a × b
- ✅ Унікальність через taskMemory ('mult-eq', вікно 12)

### 5.2 `wideOptions` (easy)
- ✅ 5 унікальних значень включно з правильною
- ✅ Усі > 0

### 5.3 `neighborOptions` (medium)
- ✅ 5 унікальних значень
- ✅ Хоча б один варіант — справжній сусід по таблиці множення ((a±1)×b, a×(b±1))
- ✅ Без негативних навіть для крайніх a=1, b=10

### 5.4 Конфіг MDIFF
- ✅ `easy.spread='wide'`, без вводу
- ✅ `medium.spread='neighbors'`
- ✅ `hard.enableInput=true`

### 5.5 I18N (uk, ru, es)
- ✅ `gameMultiplication`, `multExplicit`, `multWordHint`, `multWordPureHint`, `multMissingHint`
- ✅ ≥8 текстових сценаріїв з плейсхолдерами `{a}`, `{b}`
- ✅ `taskTypeNames.multExplicit/multWord/multWordPure/multMissing` присутні

### 5.6 `pickTaskType` (4 механіки)
- ✅ Повертає одну з: `explicit`, `wordEq`, `wordPure`, `missing` коли є сценарії
- ✅ Без сценаріїв — лише `explicit` або `missing`

### 5.7 `buildEquationHtml`
- ✅ Ховає правильну позицію (`a`, `b` або `c`) як `?` з класом `qmark`
- ✅ Інші позиції видимі

---

## 6. Гра ділення (`division-game.js`) — `test-arithmetic.js`

### 6.1 `pickEquation`
- ✅ b ∈ [2, 10], c (ans) ∈ [1, 10], a = b × c
- ✅ Ділення точне, без залишку (`a % b === 0`)

### 6.2 `wideOptions` / `neighborOptions`
- ✅ 5 унікальних включно з правильною
- ✅ Усі > 0

### 6.3 Конфіг DDIFF
- ✅ Easy = wide, Hard = input

### 6.4 I18N
- ✅ `gameDivision`, `divScenarios` ≥8
- ✅ `taskTypeNames.divExplicit/divWord/divWordPure/divMissing` присутні

### 6.5 `pickTaskType` (4 механіки) + `buildEquationHtml`
- ✅ Аналогічно множенню: explicit / wordEq / wordPure / missing
- ✅ `buildEquationHtml(a, b, 'c')` показує `a ÷ b = ?`
- ✅ `buildEquationHtml(a, b, 'a')` показує `? ÷ b = c`

---

## 7. Реєстр ігор: 5 ігор

### 7.1 Усі зареєстровані
- ✅ money, weights, volumes, multiplication, division

---

## Як додавати нові тести

1. Для нової фічі в існуючому модулі — додай `it(...)` у відповідний `describe(...)` блок.
2. Для нової гри — створи `test-<game>.js`, додай посилання в `runner.html`, опиши кейси тут.
3. Для нових експортних утиліт — додай їх у `window._test` (для script.js) або `Games.<id>._test` (для модулів).

---

## Що ще варто покрити (потенційні наступні тести)

- 🚧 **UI flow**: відкриття модалки → введення імені → старт гри → виграш → лічильники
- 🚧 **Сценарій повтору**: 5 раундів поспіль — переконатись що таргет/сценарій не повторюються
- 🚧 **Локалізація live-switching**: зміна мови → всі тексти оновились
- 🚧 **localStorage**: gameMode/difficulty/lang/profile persist коректно
- 🚧 **Анімації**: win запускає демона+меч+конфеті; lose показує текст ≥3с
- 🚧 **Audio**: WebAudio тони не падають у Safari/Firefox

Ці кейси потребують Playwright/Puppeteer або вбудованого DOM-runner — наразі поза скоупом.
