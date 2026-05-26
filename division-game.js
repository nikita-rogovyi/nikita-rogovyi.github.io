// ============ HUNTR/X: Гра ділення (1–10) ============
// Та сама структура, що множення, але a÷b=c, де a=b×c, усе в межах таблиці.

(function () {
  const DDIFF = {
    easy:   { spread: 'wide',      enableInput: false, optionsCount: 5 },
    medium: { spread: 'neighbors', enableInput: false, optionsCount: 5 },
    hard:   { spread: null,        enableInput: true,  optionsCount: 0 },
  };

  const ADD = {
    uk: {
      gameDivision: 'Ділення',
      divExplicit: '✏️ Розвʼяжи приклад:',
      divWordHint: '📖 Прочитай і розвʼяжи:',
      divWordPureHint: '🤔 Розберись сам — який тут приклад?',
      divMissingHint: '🔎 Знайди пропущене число:',
      divScenarios: [
        '🧋 Зої купила {a} чашок бабл-ті та хоче розділити порівну між {b} подругами. Скільки чашок кожній?',
        '💿 У HUNTR/X {a} альбомів, які треба розкласти по {b} коробкам порівну. Скільки в кожній?',
        '🗡️ Міра тренувалася {a} хвилин у {b} підходах. Скільки хвилин на підхід?',
        '🎟️ Розіграли {a} квитків серед {b} фанатів порівну. Скільки кожному?',
        '🐯 Деркі знайшов {a} кристалів і ділить порівну між {b} героїнями. Скільки кожній?',
        '🍜 Джину наварив {a} порцій рамену для {b} столиків порівну. Скільки на столик?',
        '🪄 У школі магії {a} стрічок розподілили між {b} учнями. Скільки кожному?',
        '🐅 На сцені {a} танцюристів стають у {b} рядів порівну. Скільки в ряду?',
        '🎤 Гурт співає {a} пісень за {b} концертів порівну. Скільки на концерт?',
        '✨ {a} зірок-хонмун треба розділити на {b} груп. Скільки в групі?',
      ],
    },
    ru: {
      gameDivision: 'Деление',
      divExplicit: '✏️ Реши пример:',
      divWordHint: '📖 Прочитай и реши:',
      divWordPureHint: '🤔 Разберись сам — какой здесь пример?',
      divMissingHint: '🔎 Найди пропущенное число:',
      divScenarios: [
        '🧋 Зои купила {a} чашек бабл-ти и хочет разделить поровну между {b} подругами. Сколько чашек каждой?',
        '💿 У HUNTR/X {a} альбомов, надо разложить по {b} коробкам поровну. Сколько в каждой?',
        '🗡️ Мира тренировалась {a} минут в {b} подходах. Сколько минут на подход?',
        '🎟️ Разыграли {a} билетов среди {b} фанатов поровну. Сколько каждому?',
        '🐯 Дерки нашёл {a} кристаллов и делит поровну между {b} героинями. Сколько каждой?',
        '🍜 Джину сварил {a} порций рамена для {b} столиков поровну. Сколько на столик?',
        '🪄 В школе магии {a} ленточек распределили между {b} учениками. Сколько каждому?',
        '🐅 На сцене {a} танцоров встали в {b} рядов поровну. Сколько в ряду?',
        '🎤 Группа поёт {a} песен за {b} концертов поровну. Сколько на концерт?',
        '✨ {a} звёзд-хонмун надо разделить на {b} групп. Сколько в группе?',
      ],
    },
    es: {
      gameDivision: 'División',
      divExplicit: '✏️ Resuelve la operación:',
      divWordHint: '📖 Lee y resuelve:',
      divWordPureHint: '🤔 Adivina solo — ¿cuál es la operación aquí?',
      divMissingHint: '🔎 Encuentra el número que falta:',
      divScenarios: [
        '🧋 Zoey compró {a} tazas de bubble tea y quiere repartirlas entre {b} amigas. ¿Cuántas a cada una?',
        '💿 HUNTR/X tienen {a} álbumes que hay que colocar en {b} cajas iguales. ¿Cuántos en cada una?',
        '🗡️ Mira entrenó {a} minutos en {b} series. ¿Cuántos minutos por serie?',
        '🎟️ Sortearon {a} entradas entre {b} fans por igual. ¿Cuántas a cada uno?',
        '🐯 Derpy encontró {a} cristales y los reparte entre {b} heroínas. ¿Cuántos a cada una?',
        '🍜 Jinu cocinó {a} raciones de ramen para {b} mesas por igual. ¿Cuántas por mesa?',
        '🪄 En la escuela de magia repartieron {a} cintas entre {b} alumnos. ¿Cuántas a cada uno?',
        '🐅 En el escenario {a} bailarines se forman en {b} filas iguales. ¿Cuántos por fila?',
        '🎤 El grupo canta {a} canciones en {b} conciertos por igual. ¿Cuántas por concierto?',
        '✨ Hay que dividir {a} estrellas-honmoon en {b} grupos. ¿Cuántas en cada grupo?',
      ],
    },
  };
  for (const lang in ADD) {
    if (window.I18N && window.I18N[lang]) Object.assign(window.I18N[lang], ADD[lang]);
  }
  function ensureTaskTypeName(lang, key, name) {
    if (!window.I18N[lang]) return;
    window.I18N[lang].taskTypeNames = window.I18N[lang].taskTypeNames || {};
    if (!window.I18N[lang].taskTypeNames[key]) window.I18N[lang].taskTypeNames[key] = name;
  }
  ensureTaskTypeName('uk', 'divExplicit',  '✏️ Ділення (приклад)');
  ensureTaskTypeName('uk', 'divWord',      '📖 Ділення (історія + приклад)');
  ensureTaskTypeName('uk', 'divWordPure',  '🤔 Ділення (тільки історія)');
  ensureTaskTypeName('uk', 'divMissing',   '🔎 Ділення (знайди число)');
  ensureTaskTypeName('ru', 'divExplicit',  '✏️ Деление (пример)');
  ensureTaskTypeName('ru', 'divWord',      '📖 Деление (история + пример)');
  ensureTaskTypeName('ru', 'divWordPure',  '🤔 Деление (только история)');
  ensureTaskTypeName('ru', 'divMissing',   '🔎 Деление (найди число)');
  ensureTaskTypeName('es', 'divExplicit',  '✏️ División (operación)');
  ensureTaskTypeName('es', 'divWord',      '📖 División (historia + operación)');
  ensureTaskTypeName('es', 'divWordPure',  '🤔 División (sólo historia)');
  ensureTaskTypeName('es', 'divMissing',   '🔎 División (encuentra el número)');

  function pickEquation() {
    let b, c, key;
    for (let i = 0; i < 30; i++) {
      b = rand(2, 10);     // дільник 2..10 (1 дає тривіальне завдання)
      c = rand(1, 10);     // частка 1..10
      key = b + '/' + c;
      if (window.taskMemory.accept('div-eq', key, 12)) break;
    }
    const a = b * c;
    return { a, b, ans: c };
  }

  // Сусіди по таблиці ділення — c±1, ±2 та результати сусідніх a÷(b±1)
  function neighborOptions(b, correct) {
    const set = new Set([correct]);
    const candidates = [correct + 1, correct - 1, correct + 2, correct - 2];
    // Іноді — частки сусідніх по дільнику
    const a = b * correct;
    if (b > 2 && a % (b - 1) === 0) candidates.push(a / (b - 1));
    if (b < 10 && a % (b + 1) === 0) candidates.push(a / (b + 1));
    candidates.sort(() => Math.random() - 0.5);
    for (const v of candidates) {
      if (v > 0 && v !== correct) set.add(v);
      if (set.size >= 5) break;
    }
    while (set.size < 5) {
      const d = choice([3, -3, 4, -4]);
      const v = correct + d;
      if (v > 0 && v !== correct) set.add(v);
    }
    return [...set].slice(0, 5).sort(() => Math.random() - 0.5);
  }

  function wideOptions(correct) {
    const set = new Set([correct]);
    const deltas = [3, -3, 5, -5, 7, -7, 4, -4, 6, -6];
    let guard = 0;
    while (set.size < 5 && guard++ < 40) {
      const d = choice(deltas);
      const v = correct + d;
      if (v > 0 && v <= 20 && v !== correct) set.add(v);
    }
    while (set.size < 5) {
      const v = correct + (set.size + 1) * 2;
      if (v > 0) set.add(v);
    }
    return [...set].slice(0, 5).sort(() => Math.random() - 0.5);
  }

  function generateOptions(correct, b, spread) {
    if (spread === 'wide') return wideOptions(correct);
    return neighborOptions(b, correct);
  }

  function pickTaskType(hasScenarios) {
    const pool = ['explicit', 'missing'];
    if (hasScenarios) pool.push('wordEq', 'wordPure');
    return choice(pool);
  }

  function buildEquationHtml(a, b, hidden /* 'a' | 'b' | 'c' */) {
    const cell = (val, isQ) =>
      `<span class="eq-op${isQ ? ' qmark' : ''}">${isQ ? '?' : val}</span>`;
    const c = a / b; // for division a÷b = c
    return `<div class="big-equation">
      ${cell(a, hidden === 'a')}
      <span class="eq-sign">÷</span>
      ${cell(b, hidden === 'b')}
      <span class="eq-sign">=</span>
      ${cell(c, hidden === 'c')}
    </div>`;
  }

  function getScenario(t, a, b) {
    let tmpl;
    for (let i = 0; i < 20; i++) {
      tmpl = choice(t.divScenarios);
      if (window.taskMemory.accept('div-scen', tmpl, 4)) break;
    }
    return tmpl.replace('{a}', a).replace('{b}', b);
  }

  function newRound() {
    const t = T();
    const d = DDIFF[state.difficulty] || DDIFF.medium;
    const { a, b, ans } = pickEquation();
    const hasScen = t.divScenarios && t.divScenarios.length > 0;
    const type = pickTaskType(hasScen);

    if (type === 'explicit') {
      state.currentTask = { type: 'divExplicit', target: ans };
      $('#taskText').innerHTML = `<b>${t.divExplicit}</b>`;
      $('#taskArea').innerHTML = buildEquationHtml(a, b, 'c');
      renderAnswerControls(ans, d, b);
    }
    else if (type === 'wordEq') {
      state.currentTask = { type: 'divWord', target: ans };
      const scenario = getScenario(t, a, b);
      $('#taskText').innerHTML = `${scenario}<br><small style="opacity:0.75">${t.divWordHint}</small>`;
      $('#taskArea').innerHTML = buildEquationHtml(a, b, 'c');
      renderAnswerControls(ans, d, b);
    }
    else if (type === 'wordPure') {
      state.currentTask = { type: 'divWordPure', target: ans };
      const scenario = getScenario(t, a, b);
      $('#taskText').innerHTML = `${scenario}<br><small style="opacity:0.75">${t.divWordPureHint}</small>`;
      $('#taskArea').innerHTML = `<div class="big-equation" style="font-size: clamp(2rem, 8vw, 4rem);">
        <span class="eq-op qmark">?</span>
      </div>`;
      renderAnswerControls(ans, d, b);
    }
    else { // missing
      state.currentTask = { type: 'divMissing', target: 0 };
      // a ÷ ? = c  (target=b)  або  ? ÷ b = c  (target=a)
      const hideA = Math.random() < 0.5;
      const target = hideA ? a : b;
      state.currentTask.target = target;
      $('#taskText').innerHTML = `<b>${t.divMissingHint}</b>`;
      $('#taskArea').innerHTML = buildEquationHtml(a, b, hideA ? 'a' : 'b');
      // Опції в розумному діапазоні
      renderAnswerControlsMissing(target, d, hideA ? 'a' : 'b');
    }
  }

  function renderAnswerControls(ans, d, b) {
    const t = T();
    const controls = $('#controls');
    if (d.enableInput) {
      controls.innerHTML = `
        <input class="answer" id="divAnsInp" type="number" min="0" max="100"
               inputmode="numeric" placeholder="?" autocomplete="off"/>
        <button class="btn" id="checkDivBtn">${t.check}</button>
      `;
      const inp = $('#divAnsInp');
      inp.focus();
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('#checkDivBtn').click(); });
      $('#checkDivBtn').onclick = () => {
        const v = parseInt(inp.value, 10);
        if (isNaN(v)) { lose(t.enterNumber || ''); return; }
        if (v === ans) win(t.bullseye);
        else lose(t.correctIs(String(ans)));
      };
    } else {
      const opts = generateOptions(ans, b, d.spread);
      renderOptionButtons(opts, ans);
    }
  }

  function renderAnswerControlsMissing(ans, d, which) {
    // 'a' — target до 100 (a = b*c); 'b' — target в [2, 10]
    const t = T();
    const controls = $('#controls');
    if (d.enableInput) {
      const maxVal = which === 'a' ? 100 : 10;
      controls.innerHTML = `
        <input class="answer" id="divAnsInp" type="number" min="1" max="${maxVal}"
               inputmode="numeric" placeholder="?" autocomplete="off"/>
        <button class="btn" id="checkDivBtn">${t.check}</button>
      `;
      const inp = $('#divAnsInp');
      inp.focus();
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('#checkDivBtn').click(); });
      $('#checkDivBtn').onclick = () => {
        const v = parseInt(inp.value, 10);
        if (isNaN(v)) { lose(t.enterNumber || ''); return; }
        if (v === ans) win(t.bullseye);
        else lose(t.correctIs(String(ans)));
      };
    } else {
      const set = new Set([ans]);
      if (which === 'b') {
        // діапазон 2..10
        const pool = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        const shuffled = pool.slice().sort(() => Math.random() - 0.5);
        for (const v of shuffled) { if (v !== ans) set.add(v); if (set.size >= 5) break; }
      } else {
        // діапазон навколо ans, з кратністю
        const deltas = [-ans, -2, -1, 1, 2, 3, 4, 5, -3, -4, -5];
        for (const d2 of deltas) {
          const v = ans + d2;
          if (v > 0 && v <= 100 && v !== ans) set.add(v);
          if (set.size >= 5) break;
        }
      }
      const opts = [...set].slice(0, 5).sort(() => Math.random() - 0.5);
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
  window.Games.division = {
    id: 'division',
    icon: '➗',
    getName: (lang) => (window.I18N && window.I18N[lang] && window.I18N[lang].gameDivision) || 'Divide',
    newRound,
    _test: { DDIFF, pickEquation, neighborOptions, wideOptions, generateOptions, pickTaskType, buildEquationHtml },
  };
})();
