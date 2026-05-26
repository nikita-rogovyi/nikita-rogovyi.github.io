# Тести KPop Money/Weights/Volumes Trainer

## Запуск

Відкрий `test/runner.html` у браузері (двічі клацни на файлі або відкрий локальним HTTP-сервером — `python3 -m http.server` з кореня проекту, потім `http://localhost:8000/test/runner.html`).

Зведення тестів з'явиться вгорі сторінки:
- 🟢 «N/N пройдено — ✅ усе ок»
- 🔴 «N/N пройдено — M провалено»

Натисни «▶ Прогнати тести знову», щоб перевипустити.

## Структура

```
test/
├── README.md           — цей файл (як запускати)
├── TEST_CASES.md       — повний опис усіх тест-кейсів
├── runner.html         — браузерний раннер
├── framework.js        — мінімальний describe/it/expect
├── test-common.js      — спільні утиліти, I18N, профіль, реєстр ігор
├── test-weights.js     — гра ваг
└── test-volumes.js     — гра літрів
```

## Робочий цикл

**Після кожної зміни коду:**
1. Відкрий `runner.html` → подивись що всі тести зелені.
2. Якщо щось зламалось — фікси.
3. Якщо додав фічу — допиши тест у відповідний файл + опиши у `TEST_CASES.md`.

## Як писати тести

```js
describe('Group name', () => {
  beforeEach(() => {
    // (опціонально) скидання стану перед кожним тестом групи
  });

  it('does the right thing', () => {
    expect(myFunction(1, 2)).toBe(3);
  });

  it('handles edge case', () => {
    expect(() => doDangerous()).toThrow();  // не реалізовано — використовуй try/catch
  });
});
```

## Доступні `expect()` матчери

- `.toBe(x)` — суворе порівняння
- `.toEqual(x)` — глибоке порівняння (через JSON)
- `.toBeTruthy()` / `.toBeFalsy()`
- `.toBeGreaterThan(n)` / `.toBeGreaterThanOrEqual(n)`
- `.toBeLessThan(n)` / `.toBeLessThanOrEqual(n)`
- `.toContain(item)` — для рядків та масивів
- `.toMatch(regex)`
- `.toHaveLength(n)`
- `.toBeDefined()` / `.toBeUndefined()` / `.toBeNull()`

## Як експортувати нові функції з модулів

**Для `script.js`** — додай у `window._test = { ..., yourFn }` наприкінці.

**Для IIFE-модулів** (`weights-game.js`, `volumes-game.js`) — додай у `_test` всередині реєстрації:
```js
window.Games.weights = {
  ...,
  _test: { ..., yourNewFn }
};
```

## Що НЕ покрито

- UI-флоу (модалка, win/lose анімації, переходи раундів) — потрібен Playwright/Puppeteer
- WebAudio (тони синтезуються коректно) — складно тестувати без аудіо-граба
- Кросбраузерність

Якщо це знадобиться — створимо окремий `test/e2e/` з Playwright або через iframe-runner.
