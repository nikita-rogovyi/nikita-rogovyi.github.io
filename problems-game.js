// ============ HUNTR/X: Задачі (2-крокові текстові задачі) ============
// Формат: ¡No hay problema! 1er CICLO — Nivel 2.
// Генератор задач на 2 дії з 4 шаблонами знаків: ++, +-, -+, --.
// Дитина читає історію, виконує дві дії й вводить остаточну відповідь.
//
// Підказки за рівнем:
//   easy   — показуємо «Дано» з підписами та значеннями (тезисами).
//   medium — показуємо тільки підписи, дитина сама вписує значення з історії.
//   hard   — жодних підказок, лише історія.

(function () {
  const PATTERNS = ['pp', 'pm', 'mp', 'mm'];

  const PDIFF = {
    easy:   { xMin: 8,  xMax: 30, abMin: 3,  abMax: 15, resultMax: 40 },
    medium: { xMin: 15, xMax: 60, abMin: 5,  abMax: 30, resultMax: 100 },
    hard:   { xMin: 25, xMax: 99, abMin: 10, abMax: 50, resultMax: 200 },
  };

  // Сценарій: {lang: { story(x,a,b), lx, la, lb }}.
  // lx/la/lb — підписи до значень x, a, b («Було мечів», «Поламала», «Майстер виготовив»).
  const SCENARIOS = {
    // ++  (отримали + отримали)
    pp: [
      {
        uk: { story:(x,a,b)=>`🎤 На концерт HUNTR/X прийшло ${x} фанатів. Потім доєдналися ще ${a}, а пізніше — ще ${b}. Скільки фанатів усього?`,
              lx:'Прийшло фанатів', la:'Доєдналися', lb:'Потім ще доєдналися' },
        ru: { story:(x,a,b)=>`🎤 На концерт HUNTR/X пришло ${x} фанатов. Потом присоединились ещё ${a}, а позже — ещё ${b}. Сколько фанатов всего?`,
              lx:'Пришло фанатов', la:'Присоединились', lb:'Затем присоединились' },
        es: { story:(x,a,b)=>`🎤 Al concierto de HUNTR/X llegaron ${x} fans. Después se unieron ${a} más, y luego ${b} más. ¿Cuántos fans hay en total?`,
              lx:'Llegaron fans', la:'Se unieron', lb:'Después se unieron' },
      },
      {
        uk: { story:(x,a,b)=>`🧋 Зої купила ${x} бабл-ті. Деркі приніс ще ${a}, а Сасі — ще ${b}. Скільки бабл-ті разом?`,
              lx:'Купила бабл-ті', la:'Деркі приніс', lb:'Сасі приніс' },
        ru: { story:(x,a,b)=>`🧋 Зои купила ${x} бабл-ти. Дерки принёс ещё ${a}, а Сасси — ещё ${b}. Сколько бабл-ти вместе?`,
              lx:'Купила бабл-ти', la:'Дерки принёс', lb:'Сасси принёс' },
        es: { story:(x,a,b)=>`🧋 Zoey compró ${x} bubble teas. Derpy trajo ${a} más, y Sussie ${b} más. ¿Cuántos bubble teas hay en total?`,
              lx:'Bubble teas comprados', la:'Derpy trajo', lb:'Sussie trajo' },
      },
      {
        uk: { story:(x,a,b)=>`💎 На сцені знайшли ${x} кристалів-хонмун. Уранці зібрали ще ${a}, а ввечері — ${b}. Скільки кристалів зібрано?`,
              lx:'Було знайдено', la:'Уранці зібрали', lb:'Ввечері зібрали' },
        ru: { story:(x,a,b)=>`💎 На сцене нашли ${x} кристаллов хонмуна. Утром собрали ещё ${a}, а вечером — ${b}. Сколько кристаллов собрано?`,
              lx:'Было найдено', la:'Утром собрали', lb:'Вечером собрали' },
        es: { story:(x,a,b)=>`💎 En el escenario encontraron ${x} cristales de honmoon. Por la mañana recogieron ${a} más, y por la tarde ${b} más. ¿Cuántos cristales hay?`,
              lx:'Cristales encontrados', la:'Por la mañana recogieron', lb:'Por la tarde recogieron' },
      },
      {
        uk: { story:(x,a,b)=>`🐅 У школі духів ${x} тигренят. Уранці прибігло ще ${a}, а потім ще ${b}. Скільки тигренят разом?`,
              lx:'Було тигренят', la:'Уранці прибігло', lb:'Потім прибігло' },
        ru: { story:(x,a,b)=>`🐅 В школе духов ${x} тигрят. Утром прибежало ещё ${a}, а потом ещё ${b}. Сколько тигрят вместе?`,
              lx:'Было тигрят', la:'Утром прибежало', lb:'Потом прибежало' },
        es: { story:(x,a,b)=>`🐅 En la escuela de espíritus hay ${x} cachorros de tigre. Por la mañana llegaron ${a} más, y luego ${b} más. ¿Cuántos hay en total?`,
              lx:'Cachorros en la escuela', la:'Por la mañana llegaron', lb:'Después llegaron' },
      },
    ],
    // +-  (отримали, потім забрали)
    pm: [
      {
        uk: { story:(x,a,b)=>`🏹 У Румі було ${x} стріл. Міра подарувала ще ${a}, але у бою вона витратила ${b}. Скільки стріл лишилось?`,
              lx:'Було стріл', la:'Міра подарувала', lb:'Витратила у бою' },
        ru: { story:(x,a,b)=>`🏹 У Руми было ${x} стрел. Мира подарила ещё ${a}, но в бою она потратила ${b}. Сколько стрел осталось?`,
              lx:'Было стрел', la:'Мира подарила', lb:'Потратила в бою' },
        es: { story:(x,a,b)=>`🏹 Rumi tenía ${x} flechas. Mira le regaló ${a} más, pero en la batalla gastó ${b}. ¿Cuántas flechas le quedan?`,
              lx:'Flechas que tenía', la:'Mira le regaló', lb:'Gastó en la batalla' },
      },
      {
        uk: { story:(x,a,b)=>`🍜 Джину зварив ${x} порцій рамену. Прибуло ще ${a} порцій від кухаря, а фанати зʼїли ${b}. Скільки порцій лишилось?`,
              lx:'Зварив порцій', la:'Прибуло ще', lb:'Фанати зʼїли' },
        ru: { story:(x,a,b)=>`🍜 Джину сварил ${x} порций рамена. Поступило ещё ${a} порций от повара, а фанаты съели ${b}. Сколько порций осталось?`,
              lx:'Сварил порций', la:'Поступило ещё', lb:'Фанаты съели' },
        es: { story:(x,a,b)=>`🍜 Jinu cocinó ${x} raciones de ramen. Llegaron ${a} más del cocinero, pero los fans comieron ${b}. ¿Cuántas raciones quedan?`,
              lx:'Raciones cocinadas', la:'Llegaron más', lb:'Los fans comieron' },
      },
      {
        uk: { story:(x,a,b)=>`🎟️ У касі ${x} квитків. Привезли ще ${a}, але одразу продали ${b}. Скільки квитків лишилось?`,
              lx:'Було квитків', la:'Привезли', lb:'Продали' },
        ru: { story:(x,a,b)=>`🎟️ В кассе ${x} билетов. Привезли ещё ${a}, но сразу продали ${b}. Сколько билетов осталось?`,
              lx:'Было билетов', la:'Привезли', lb:'Продали' },
        es: { story:(x,a,b)=>`🎟️ En la taquilla hay ${x} entradas. Trajeron ${a} más, pero vendieron ${b} enseguida. ¿Cuántas entradas quedan?`,
              lx:'Entradas en taquilla', la:'Trajeron', lb:'Vendieron' },
      },
      {
        uk: { story:(x,a,b)=>`📦 Деркі тягне ${x} коробок мерчу. Знайшов ще ${a}, але ${b} віддав фанатам. Скільки коробок у нього?`,
              lx:'Тягнув коробок', la:'Знайшов ще', lb:'Віддав фанатам' },
        ru: { story:(x,a,b)=>`📦 Дерки тащит ${x} коробок мерча. Нашёл ещё ${a}, но ${b} отдал фанатам. Сколько коробок у него?`,
              lx:'Тащил коробок', la:'Нашёл ещё', lb:'Отдал фанатам' },
        es: { story:(x,a,b)=>`📦 Derpy lleva ${x} cajas de merch. Encontró ${a} más, pero regaló ${b} a los fans. ¿Cuántas cajas tiene?`,
              lx:'Cajas que llevaba', la:'Encontró más', lb:'Regaló a los fans' },
      },
    ],
    // -+  (забрали, потім докупили/повернули)
    mp: [
      {
        uk: { story:(x,a,b)=>`💶 У Зої було ${x} євро. Вона витратила ${a} на бабл-ті, а потім бабуся подарувала ${b}. Скільки тепер у Зої?`,
              lx:'Було євро', la:'Витратила', lb:'Бабуся подарувала' },
        ru: { story:(x,a,b)=>`💶 У Зои было ${x} евро. Она потратила ${a} на бабл-ти, а потом бабушка подарила ${b}. Сколько теперь у Зои?`,
              lx:'Было евро', la:'Потратила', lb:'Бабушка подарила' },
        es: { story:(x,a,b)=>`💶 Zoey tenía ${x} euros. Gastó ${a} en bubble tea, y luego su abuela le regaló ${b}. ¿Cuántos euros tiene ahora?`,
              lx:'Euros que tenía', la:'Gastó en bubble tea', lb:'Abuela le regaló' },
      },
      {
        uk: { story:(x,a,b)=>`🗡️ У Міри ${x} тренувальних мечів. Поламала ${a} на тренуванні, але майстер виготовив ${b} нових. Скільки мечів?`,
              lx:'Було мечів', la:'Поламала', lb:'Майстер виготовив' },
        ru: { story:(x,a,b)=>`🗡️ У Миры ${x} тренировочных мечей. Сломала ${a} на тренировке, но мастер сделал ${b} новых. Сколько мечей?`,
              lx:'Было мечей', la:'Сломала', lb:'Мастер сделал' },
        es: { story:(x,a,b)=>`🗡️ Mira tiene ${x} espadas de entrenamiento. Rompió ${a} entrenando, pero el maestro hizo ${b} nuevas. ¿Cuántas tiene?`,
              lx:'Espadas que tenía', la:'Rompió entrenando', lb:'El maestro hizo' },
      },
      {
        uk: { story:(x,a,b)=>`📚 У бібліотеці ${x} нот пісень HUNTR/X. Загубили ${a}, але передрукували ${b}. Скільки нот зараз?`,
              lx:'Було нот', la:'Загубили', lb:'Передрукували' },
        ru: { story:(x,a,b)=>`📚 В библиотеке ${x} нот песен HUNTR/X. Потеряли ${a}, но перепечатали ${b}. Сколько нот сейчас?`,
              lx:'Было нот', la:'Потеряли', lb:'Перепечатали' },
        es: { story:(x,a,b)=>`📚 En la biblioteca hay ${x} partituras de HUNTR/X. Perdieron ${a}, pero reimprimieron ${b}. ¿Cuántas partituras hay ahora?`,
              lx:'Partituras', la:'Perdieron', lb:'Reimprimieron' },
      },
      {
        uk: { story:(x,a,b)=>`🎭 На сцені ${x} костюмів. Викрали ${a}, але швачки пошили ${b} нових. Скільки костюмів?`,
              lx:'Було костюмів', la:'Викрали', lb:'Швачки пошили' },
        ru: { story:(x,a,b)=>`🎭 На сцене ${x} костюмов. Украли ${a}, но швеи сшили ${b} новых. Сколько костюмов?`,
              lx:'Было костюмов', la:'Украли', lb:'Швеи сшили' },
        es: { story:(x,a,b)=>`🎭 En el escenario hay ${x} trajes. Robaron ${a}, pero las costureras hicieron ${b} nuevos. ¿Cuántos trajes hay?`,
              lx:'Trajes en el escenario', la:'Robaron', lb:'Costureras hicieron' },
      },
    ],
    // --  (двічі забрали)
    mm: [
      {
        uk: { story:(x,a,b)=>`🍞 У пекарні ${x} булочок. Зранку продали ${a}, ввечері — ${b}. Скільки булочок лишилось?`,
              lx:'Було булочок', la:'Зранку продали', lb:'Ввечері продали' },
        ru: { story:(x,a,b)=>`🍞 В пекарне ${x} булочек. Утром продали ${a}, вечером — ${b}. Сколько булочек осталось?`,
              lx:'Было булочек', la:'Утром продали', lb:'Вечером продали' },
        es: { story:(x,a,b)=>`🍞 En la panadería hay ${x} barras de pan. Por la mañana vendieron ${a}, por la tarde ${b}. ¿Cuántas barras quedan?`,
              lx:'Barras de pan', la:'Vendieron por la mañana', lb:'Vendieron por la tarde' },
      },
      {
        uk: { story:(x,a,b)=>`👹 У барʼєрі-хонмун було ${x} демонів Saja Boys. У першому раунді HUNTR/X перемогли ${a}, у другому — ще ${b}. Скільки демонів лишилось?`,
              lx:'Було демонів', la:'1-й раунд: перемогли', lb:'2-й раунд: перемогли' },
        ru: { story:(x,a,b)=>`👹 В барьере-хонмуне было ${x} демонов Saja Boys. В первом раунде HUNTR/X победили ${a}, во втором — ещё ${b}. Сколько демонов осталось?`,
              lx:'Было демонов', la:'1-й раунд: победили', lb:'2-й раунд: победили' },
        es: { story:(x,a,b)=>`👹 En el honmoon había ${x} demonios Saja Boys. En la primera ronda HUNTR/X derrotó a ${a}, en la segunda a ${b}. ¿Cuántos demonios quedan?`,
              lx:'Demonios había', la:'Ronda 1: derrotaron', lb:'Ronda 2: derrotaron' },
      },
      {
        uk: { story:(x,a,b)=>`👟 У магазині ${x} пар кросівок. Зранку купили ${a} пар, після обіду — ${b}. Скільки пар лишилось?`,
              lx:'Було пар', la:'Зранку купили', lb:'По обіді купили' },
        ru: { story:(x,a,b)=>`👟 В магазине ${x} пар кроссовок. Утром купили ${a} пар, после обеда — ${b}. Сколько пар осталось?`,
              lx:'Было пар', la:'Утром купили', lb:'После обеда купили' },
        es: { story:(x,a,b)=>`👟 En la tienda hay ${x} pares de zapatillas. Por la mañana compraron ${a} pares, por la tarde ${b}. ¿Cuántos pares quedan?`,
              lx:'Pares en la tienda', la:'Compraron mañana', lb:'Compraron tarde' },
      },
      {
        uk: { story:(x,a,b)=>`🎂 На вечірці HUNTR/X було ${x} тістечок. Спочатку зʼїли ${a}, потім ${b} віддали фанатам. Скільки тістечок лишилось?`,
              lx:'Було тістечок', la:'Зʼїли', lb:'Віддали фанатам' },
        ru: { story:(x,a,b)=>`🎂 На вечеринке HUNTR/X было ${x} пирожных. Сначала съели ${a}, потом ${b} отдали фанатам. Сколько пирожных осталось?`,
              lx:'Было пирожных', la:'Съели', lb:'Отдали фанатам' },
        es: { story:(x,a,b)=>`🎂 En la fiesta de HUNTR/X había ${x} pastelitos. Primero se comieron ${a}, después regalaron ${b} a los fans. ¿Cuántos pastelitos quedan?`,
              lx:'Pastelitos en la fiesta', la:'Se comieron', lb:'Regalaron a los fans' },
      },
    ],
  };

  // I18N
  const ADD = {
    uk: {
      gameProblems: 'Задачі',
      problemDatos: '📋 Дано',
      problemSolution: '💡 Розвʼязок',
      problemHint: '📖 Прочитай і розвʼяжи задачу',
      problemCheckData: 'Перевір дані: ',
    },
    ru: {
      gameProblems: 'Задачи',
      problemDatos: '📋 Дано',
      problemSolution: '💡 Решение',
      problemHint: '📖 Прочитай и реши задачу',
      problemCheckData: 'Проверь данные: ',
    },
    es: {
      gameProblems: 'Problemas',
      problemDatos: '📋 Datos',
      problemSolution: '💡 Solución',
      problemHint: '📖 Lee y resuelve el problema',
      problemCheckData: 'Revisa los datos: ',
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
  const TASK_LABELS = {
    PP: { uk: '➕➕ Задача (двічі додати)',     ru: '➕➕ Задача (дважды прибавить)', es: '➕➕ Problema (sumar dos veces)' },
    PM: { uk: '➕➖ Задача (додати, забрати)',  ru: '➕➖ Задача (прибавить, отнять)', es: '➕➖ Problema (sumar, restar)' },
    MP: { uk: '➖➕ Задача (забрати, додати)',  ru: '➖➕ Задача (отнять, прибавить)', es: '➖➕ Problema (restar, sumar)' },
    MM: { uk: '➖➖ Задача (двічі забрати)',    ru: '➖➖ Задача (дважды отнять)', es: '➖➖ Problema (restar dos veces)' },
  };
  for (const k in TASK_LABELS) {
    for (const lang in TASK_LABELS[k]) ensureTaskTypeName(lang, 'problem' + k, TASK_LABELS[k][lang]);
  }

  // ====== Генератор пари (a, b, x) під шаблон ======
  function genNumbers(pattern, d) {
    const s1 = pattern[0] === 'p' ? +1 : -1;
    const s2 = pattern[1] === 'p' ? +1 : -1;
    for (let attempt = 0; attempt < 300; attempt++) {
      const x = rand(d.xMin, d.xMax);
      const a = rand(d.abMin, d.abMax);
      const b = rand(d.abMin, d.abMax);
      const inter = x + s1 * a;
      const result = inter + s2 * b;
      if (inter < 0) continue;
      if (result < 0) continue;
      if (result > d.resultMax) continue;
      if (d.xMax <= 30 && a === b) continue;
      return { x, a, b, inter, result, s1, s2 };
    }
    const x = Math.max(d.xMin, 20);
    const a = Math.max(d.abMin, 5);
    const b = Math.max(d.abMin, 4);
    const inter = x + s1 * a;
    const result = inter + s2 * b;
    return { x, a, b, inter, result, s1, s2 };
  }

  function opChar(sign) { return sign > 0 ? '+' : '−'; }

  // ====== Рендер раунду ======
  function newRound() {
    const t = T();
    const diff = state.difficulty || 'medium';
    const d = PDIFF[diff] || PDIFF.medium;

    // Уникаємо повтору шаблону два рази підряд
    let pattern;
    for (let i = 0; i < 10; i++) {
      pattern = choice(PATTERNS);
      if (window.taskMemory.accept('problems-pat', pattern, 2)) break;
    }
    const nums = genNumbers(pattern, d);
    const taskTypeKey = 'problem' + pattern.toUpperCase();

    // Сценарій (без повторів останніх 6)
    const pool = SCENARIOS[pattern];
    let scenario;
    for (let i = 0; i < 20; i++) {
      scenario = choice(pool);
      if (window.taskMemory.accept('problems-scn', scenario, 6)) break;
    }
    const lang = state.lang || 'es';
    const scnLang = scenario[lang] || scenario.es;
    const story = scnLang.story(nums.x, nums.a, nums.b);

    state.currentTask = { type: taskTypeKey, target: nums.result };

    $('#taskText').innerHTML = `<small style="opacity:0.8">${t.problemHint || ''}</small><br>${story}`;

    // «Дано»: 3 рядки з підписами. На easy — зі значеннями, на medium — з полями вводу,
    // на hard — блок не показуємо взагалі.
    const labels = [
      { lab: scnLang.lx, val: nums.x, id: 'pX' },
      { lab: scnLang.la, val: nums.a, id: 'pA' },
      { lab: scnLang.lb, val: nums.b, id: 'pB' },
    ];

    if (diff === 'hard') {
      $('#taskArea').innerHTML = '';
    } else {
      const rows = labels.map(({ lab, val, id }) => {
        const right = diff === 'easy'
          ? `<span class="problem-datum-val">${val}</span>`
          : `<input type="number" class="answer problem-datum-input" id="${id}"
                    inputmode="numeric" autocomplete="off" placeholder="?" min="0" max="999"/>`;
        return `<div class="problem-datum-row">
          <span class="problem-datum-label">${lab}:</span>${right}
        </div>`;
      }).join('');
      $('#taskArea').innerHTML = `
        <div class="problem-block problem-datos">
          <div class="problem-label">${t.problemDatos}</div>
          <div class="problem-datum-list">${rows}</div>
        </div>
      `;
    }

    // Поле відповіді
    $('#controls').innerHTML = `
      <span class="problem-solution-label">${t.problemSolution}:</span>
      <input class="answer" id="problemAnsInp" type="number" min="0" max="999"
             inputmode="numeric" placeholder="?" autocomplete="off"/>
      <button class="btn" id="checkProblemBtn">${t.check}</button>
    `;

    const ansInp = $('#problemAnsInp');
    // На medium фокус краще на перше поле «Дано», щоб вести читання згори вниз.
    if (diff === 'medium') {
      const first = $('#pX');
      if (first) first.focus();
      // Enter переходить далі (X → A → B → відповідь → перевірка)
      ['pX','pA','pB','problemAnsInp'].forEach((id, idx, arr) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('keydown', e => {
          if (e.key !== 'Enter') return;
          const next = arr[idx + 1] ? document.getElementById(arr[idx + 1]) : null;
          if (next) next.focus();
          else $('#checkProblemBtn').click();
        });
      });
    } else {
      ansInp.focus();
      ansInp.addEventListener('keydown', e => { if (e.key === 'Enter') $('#checkProblemBtn').click(); });
    }

    $('#checkProblemBtn').onclick = () => {
      // На medium — спочатку перевіряємо, чи правильно витягнуто значення з історії.
      if (diff === 'medium') {
        const vx = parseInt(($('#pX')||{}).value, 10);
        const va = parseInt(($('#pA')||{}).value, 10);
        const vb = parseInt(($('#pB')||{}).value, 10);
        if (isNaN(vx) || isNaN(va) || isNaN(vb)) { lose(t.enterNumber || ''); return; }
        if (vx !== nums.x || va !== nums.a || vb !== nums.b) {
          lose(t.problemCheckData + `${nums.x}, ${nums.a}, ${nums.b}`);
          return;
        }
      }
      const v = parseInt(ansInp.value, 10);
      if (isNaN(v)) { lose(t.enterNumber || ''); return; }
      if (v === nums.result) win(t.bullseye);
      else lose(t.correctIs(String(nums.result)));
    };
  }

  window.Games = window.Games || {};
  window.Games.problems = {
    id: 'problems',
    icon: '📝',
    getName: (lang) => (window.I18N && window.I18N[lang] && window.I18N[lang].gameProblems) || 'Problems',
    newRound,
    _test: { PATTERNS, PDIFF, SCENARIOS, genNumbers, opChar },
  };
})();
