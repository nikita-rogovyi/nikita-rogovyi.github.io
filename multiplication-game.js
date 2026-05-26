// ============ HUNTR/X: Гра множення (1–10) ============
// 3 рівні складності:
//   easy   — 5 далеких варіантів
//   medium — 5 близьких варіантів (сусіди по таблиці множення, ±1 крок)
//   hard   — без варіантів, поле введення
// Типи задач: explicit (приклад) та word (текстова задача).

(function () {
  const MDIFF = {
    easy:   { spread: 'wide',      enableInput: false, optionsCount: 5 },
    medium: { spread: 'neighbors', enableInput: false, optionsCount: 5 },
    hard:   { spread: null,        enableInput: true,  optionsCount: 0 },
  };

  const ADD = {
    uk: {
      gameMultiplication: 'Множення',
      multExplicit: '✏️ Розвʼяжи приклад:',
      multWordHint: '📖 Прочитай і розвʼяжи:',
      multWordPureHint: '🤔 Розберись сам — який тут приклад?',
      multMissingHint: '🔎 Знайди пропущене число:',
      multScenarios: [
        '🎤 У Румі {a} концертів на тиждень, на кожному вона співає {b} пісень. Скільки пісень загалом?',
        '🧋 Зої купила {a} коробок бабл-ті, у кожній по {b} чашок. Скільки чашок?',
        '🗡️ Міра тренується: {a} підходів по {b} ударів мечем. Скільки ударів?',
        '🐯 Деркі знайшов {a} скриньок, у кожній по {b} кристалів-хонмун. Скільки кристалів?',
        '🎟️ HUNTR/X підписали {a} плакатів на {b} фан-зустрічах. Скільки автографів?',
        '💿 У {a} коробках лежить по {b} альбомів «Golden». Усього альбомів?',
        '🍜 Джину готує {a} казанів рамену, у кожному по {b} порцій. Скільки порцій?',
        '🐅 На сцені танцює {a} тигрів-духів, у кожного по {b} стрічок. Скільки стрічок?',
        '🪄 Фан-клуб роздав {a} наборів стікерів, у кожному {b} аркушів. Скільки аркушів?',
        '⭐ За {a} днів HUNTR/X дають {b} концертів. Скільки концертів за весь тур?',
      ],
    },
    ru: {
      gameMultiplication: 'Умножение',
      multExplicit: '✏️ Реши пример:',
      multWordHint: '📖 Прочитай и реши:',
      multWordPureHint: '🤔 Разберись сам — какой здесь пример?',
      multMissingHint: '🔎 Найди пропущенное число:',
      multScenarios: [
        '🎤 У Руми {a} концертов в неделю, на каждом она поёт {b} песен. Сколько песен всего?',
        '🧋 Зои купила {a} коробок бабл-ти, в каждой по {b} чашек. Сколько чашек?',
        '🗡️ Мира тренируется: {a} подходов по {b} ударов мечом. Сколько ударов?',
        '🐯 Дерки нашёл {a} сундуков, в каждом по {b} кристаллов хонмуна. Сколько кристаллов?',
        '🎟️ HUNTR/X подписали {a} плакатов на {b} фан-встречах. Сколько автографов?',
        '💿 В {a} коробках лежит по {b} альбомов «Golden». Сколько альбомов?',
        '🍜 Джину готовит {a} котлов рамена, в каждом по {b} порций. Сколько порций?',
        '🐅 На сцене танцует {a} тигров-духов, у каждого по {b} ленточек. Сколько ленточек?',
        '🪄 Фан-клуб раздал {a} наборов стикеров, в каждом по {b} листов. Сколько листов?',
        '⭐ За {a} дней HUNTR/X дают {b} концертов. Сколько концертов за весь тур?',
      ],
    },
    es: {
      gameMultiplication: 'Multiplicación',
      multExplicit: '✏️ Resuelve la operación:',
      multWordHint: '📖 Lee y resuelve:',
      multWordPureHint: '🤔 Adivina solo — ¿cuál es la operación aquí?',
      multMissingHint: '🔎 Encuentra el número que falta:',
      multScenarios: [
        '🎤 Rumi da {a} conciertos por semana, en cada uno canta {b} canciones. ¿Cuántas canciones en total?',
        '🧋 Zoey compró {a} cajas de bubble tea, en cada una hay {b} tazas. ¿Cuántas tazas?',
        '🗡️ Mira entrena: {a} series de {b} golpes con la espada. ¿Cuántos golpes?',
        '🐯 Derpy encontró {a} cofres, en cada uno hay {b} cristales de honmoon. ¿Cuántos cristales?',
        '🎟️ HUNTR/X firmaron {a} pósters en {b} encuentros de fans. ¿Cuántos autógrafos?',
        '💿 En {a} cajas hay {b} álbumes «Golden» cada una. ¿Cuántos álbumes en total?',
        '🍜 Jinu prepara {a} ollas de ramen, cada una con {b} raciones. ¿Cuántas raciones?',
        '🐅 En el escenario bailan {a} tigres espíritu, cada uno con {b} cintas. ¿Cuántas cintas?',
        '🪄 El club de fans repartió {a} sets de pegatinas, cada uno con {b} hojas. ¿Cuántas hojas?',
        '⭐ En {a} días HUNTR/X dan {b} conciertos. ¿Cuántos conciertos en toda la gira?',
      ],
    },
  };
  for (const lang in ADD) {
    if (window.I18N && window.I18N[lang]) Object.assign(window.I18N[lang], ADD[lang]);
  }
  // Доливаємо назви типів задач у taskTypeNames (для підсумків челенджу)
  function ensureTaskTypeName(lang, key, name) {
    if (!window.I18N[lang]) return;
    window.I18N[lang].taskTypeNames = window.I18N[lang].taskTypeNames || {};
    if (!window.I18N[lang].taskTypeNames[key]) window.I18N[lang].taskTypeNames[key] = name;
  }
  ensureTaskTypeName('uk', 'multExplicit',    '✏️ Множення (приклад)');
  ensureTaskTypeName('uk', 'multWord',        '📖 Множення (історія + приклад)');
  ensureTaskTypeName('uk', 'multWordPure',    '🤔 Множення (тільки історія)');
  ensureTaskTypeName('uk', 'multMissing',     '🔎 Множення (знайди число)');
  ensureTaskTypeName('ru', 'multExplicit',    '✏️ Умножение (пример)');
  ensureTaskTypeName('ru', 'multWord',        '📖 Умножение (история + пример)');
  ensureTaskTypeName('ru', 'multWordPure',    '🤔 Умножение (только история)');
  ensureTaskTypeName('ru', 'multMissing',     '🔎 Умножение (найди число)');
  ensureTaskTypeName('es', 'multExplicit',    '✏️ Multiplicación (operación)');
  ensureTaskTypeName('es', 'multWord',        '📖 Multiplicación (historia + operación)');
  ensureTaskTypeName('es', 'multWordPure',    '🤔 Multiplicación (sólo historia)');
  ensureTaskTypeName('es', 'multMissing',     '🔎 Multiplicación (encuentra el número)');

  function pickEquation() {
    let a, b, key;
    for (let i = 0; i < 30; i++) {
      a = rand(1, 10);
      b = rand(1, 10);
      key = Math.min(a, b) + 'x' + Math.max(a, b);
      if (window.taskMemory.accept('mult-eq', key, 12)) break;
    }
    return { a, b, ans: a * b };
  }

  // Сусіди по таблиці множення: (a±1)×b, a×(b±1) + дрібні зсуви
  function neighborOptions(a, b, correct) {
    const set = new Set([correct]);
    const candidates = [];
    if (a > 1)  candidates.push((a - 1) * b);
    if (a < 10) candidates.push((a + 1) * b);
    if (b > 1)  candidates.push(a * (b - 1));
    if (b < 10) candidates.push(a * (b + 1));
    candidates.push(correct + 1, correct - 1, correct + 2, correct - 2);
    candidates.sort(() => Math.random() - 0.5);
    for (const v of candidates) {
      if (v > 0 && v !== correct) set.add(v);
      if (set.size >= 5) break;
    }
    while (set.size < 5) {
      const d = choice([3, -3, 4, -4, 5, -5]);
      const v = correct + d;
      if (v > 0 && v !== correct) set.add(v);
    }
    return [...set].slice(0, 5).sort(() => Math.random() - 0.5);
  }

  function wideOptions(correct) {
    const set = new Set([correct]);
    const deltas = [-30, -20, -15, -10, 10, 15, 20, 30, -8, 8, -25, 25];
    let guard = 0;
    while (set.size < 5 && guard++ < 40) {
      const d = choice(deltas);
      const v = correct + d;
      if (v > 0 && v <= 110 && v !== correct) set.add(v);
    }
    while (set.size < 5) {
      const v = correct + (set.size + 1) * 7;
      if (v > 0) set.add(v);
    }
    return [...set].slice(0, 5).sort(() => Math.random() - 0.5);
  }

  function generateOptions(correct, a, b, spread) {
    if (spread === 'wide') return wideOptions(correct);
    return neighborOptions(a, b, correct);
  }

  function pickTaskType(hasScenarios) {
    // Рівноймовірно: явний / історія+приклад / тільки історія / пропущене число
    const pool = ['explicit', 'missing'];
    if (hasScenarios) pool.push('wordEq', 'wordPure');
    return choice(pool);
  }

  // Генератор «пропущеного» прикладу: a × ? = c  або  ? × b = c
  function buildEquationHtml(a, b, hidden /* 'a' | 'b' | 'c' */) {
    const cell = (val, isQ) =>
      `<span class="eq-op${isQ ? ' qmark' : ''}">${isQ ? '?' : val}</span>`;
    const c = a * b;
    return `<div class="big-equation">
      ${cell(a, hidden === 'a')}
      <span class="eq-sign">×</span>
      ${cell(b, hidden === 'b')}
      <span class="eq-sign">=</span>
      ${cell(c, hidden === 'c')}
    </div>`;
  }

  function getScenario(t, a, b) {
    let tmpl;
    for (let i = 0; i < 20; i++) {
      tmpl = choice(t.multScenarios);
      if (window.taskMemory.accept('mult-scen', tmpl, 4)) break;
    }
    return tmpl.replace('{a}', a).replace('{b}', b);
  }

  function newRound() {
    const t = T();
    const d = MDIFF[state.difficulty] || MDIFF.medium;
    const { a, b, ans } = pickEquation();
    const hasScen = t.multScenarios && t.multScenarios.length > 0;
    const type = pickTaskType(hasScen);

    // === 4 механіки ===
    if (type === 'explicit') {
      state.currentTask = { type: 'multExplicit', target: ans };
      $('#taskText').innerHTML = `<b>${t.multExplicit}</b>`;
      $('#taskArea').innerHTML = buildEquationHtml(a, b, 'c');
      renderAnswerControls(ans, d, a, b);
    }
    else if (type === 'wordEq') {
      state.currentTask = { type: 'multWord', target: ans };
      const scenario = getScenario(t, a, b);
      $('#taskText').innerHTML = `${scenario}<br><small style="opacity:0.75">${t.multWordHint}</small>`;
      $('#taskArea').innerHTML = buildEquationHtml(a, b, 'c');
      renderAnswerControls(ans, d, a, b);
    }
    else if (type === 'wordPure') {
      state.currentTask = { type: 'multWordPure', target: ans };
      const scenario = getScenario(t, a, b);
      $('#taskText').innerHTML = `${scenario}<br><small style="opacity:0.75">${t.multWordPureHint}</small>`;
      // Прикладу НЕ показуємо — дитина має сама побудувати в голові
      $('#taskArea').innerHTML = `<div class="big-equation" style="font-size: clamp(2rem, 8vw, 4rem);">
        <span class="eq-op qmark">?</span>
      </div>`;
      renderAnswerControls(ans, d, a, b);
    }
    else { // missing
      state.currentTask = { type: 'multMissing', target: 0 };
      // Випадково ховаємо a або b. Відповідь — приховане число.
      const hideA = Math.random() < 0.5;
      const target = hideA ? a : b;
      state.currentTask.target = target;
      $('#taskText').innerHTML = `<b>${t.multMissingHint}</b>`;
      $('#taskArea').innerHTML = buildEquationHtml(a, b, hideA ? 'a' : 'b');
      // Для опцій — потрібен діапазон навколо target ∈ [1, 10]
      renderAnswerControlsRange(target, d);
    }
  }

  // Універсальний рендер кнопок/інпуту для відповіді = `ans`
  function renderAnswerControls(ans, d, a, b) {
    const t = T();
    const controls = $('#controls');
    if (d.enableInput) {
      controls.innerHTML = `
        <input class="answer" id="multAnsInp" type="number" min="0" max="100"
               inputmode="numeric" placeholder="?" autocomplete="off"/>
        <button class="btn" id="checkMultBtn">${t.check}</button>
      `;
      const inp = $('#multAnsInp');
      inp.focus();
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('#checkMultBtn').click(); });
      $('#checkMultBtn').onclick = () => {
        const v = parseInt(inp.value, 10);
        if (isNaN(v)) { lose(t.enterNumber || ''); return; }
        if (v === ans) win(t.bullseye);
        else lose(t.correctIs(String(ans)));
      };
    } else {
      const opts = generateOptions(ans, a, b, d.spread);
      renderOptionButtons(opts, ans);
    }
  }

  // Для «знайди число» відповідь у [1,10], тому опції генеруємо інакше
  function renderAnswerControlsRange(ans, d) {
    const t = T();
    const controls = $('#controls');
    if (d.enableInput) {
      controls.innerHTML = `
        <input class="answer" id="multAnsInp" type="number" min="1" max="10"
               inputmode="numeric" placeholder="?" autocomplete="off"/>
        <button class="btn" id="checkMultBtn">${t.check}</button>
      `;
      const inp = $('#multAnsInp');
      inp.focus();
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('#checkMultBtn').click(); });
      $('#checkMultBtn').onclick = () => {
        const v = parseInt(inp.value, 10);
        if (isNaN(v)) { lose(t.enterNumber || ''); return; }
        if (v === ans) win(t.bullseye);
        else lose(t.correctIs(String(ans)));
      };
    } else {
      // 5 варіантів у межах 1..10, обовʼязково включаючи правильну
      const set = new Set([ans]);
      const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const shuffled = pool.slice().sort(() => Math.random() - 0.5);
      for (const v of shuffled) { if (v !== ans) set.add(v); if (set.size >= 5) break; }
      const opts = [...set].sort(() => Math.random() - 0.5);
      renderOptionButtons(opts, ans);
    }
  }

  function renderOptionButtons(opts, ans) {
    const t = T();
    const controls = $('#controls');
    controls.innerHTML = opts.map(v =>
      `<button class="btn option" data-val="${v}">${v}</button>`
    ).join('');
    controls.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => {
        const v = parseInt(btn.dataset.val, 10);
        if (v === ans) win(t.bullseye);
        else lose(t.correctIs(String(ans)));
      };
    });
  }

  window.Games = window.Games || {};
  window.Games.multiplication = {
    id: 'multiplication',
    icon: '✖️',
    getName: (lang) => (window.I18N && window.I18N[lang] && window.I18N[lang].gameMultiplication) || 'Multiply',
    newRound,
    _test: { MDIFF, pickEquation, neighborOptions, wideOptions, generateOptions, pickTaskType, buildEquationHtml },
  };
})();
