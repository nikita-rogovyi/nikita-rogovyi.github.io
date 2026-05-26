// Тести спільних утиліт (script.js)

describe('formatEuro', () => {
  it('formats zero as "0 ¢"', () => {
    state.lang = 'uk';
    expect(_test.formatEuro(0)).toBe('0 ¢');
  });
  it('formats cents only', () => {
    state.lang = 'uk';
    expect(_test.formatEuro(50)).toBe('50 ¢');
    expect(_test.formatEuro(99)).toBe('99 ¢');
  });
  it('formats whole euros', () => {
    state.lang = 'uk';
    expect(_test.formatEuro(100)).toBe('1 €');
    expect(_test.formatEuro(500)).toBe('5 €');
    expect(_test.formatEuro(10000)).toBe('100 €');
  });
  it('formats euros and cents combined', () => {
    state.lang = 'uk';
    expect(_test.formatEuro(150)).toBe('1 € 50 ¢');
    expect(_test.formatEuro(2345)).toBe('23 € 45 ¢');
  });
});

describe('makeMoneyMix', () => {
  it('returns items summing to target', () => {
    for (const target of [5, 23, 100, 250, 999, 5000, 9999]) {
      const mix = _test.makeMoneyMix(target, { maxCount: 12 });
      const sum = mix.reduce((a, b) => a + b.cents, 0);
      expect(sum).toBe(target);
    }
  });
  it('uses banknotes for large amounts', () => {
    state.difficulty = 'medium';
    const mix = _test.makeMoneyMix(5000, { maxCount: 12 });
    const hasNote = mix.some(x => x.type === 'note');
    expect(hasNote).toBeTruthy();
  });
  it('handles tiny amounts with coins', () => {
    const mix = _test.makeMoneyMix(7, {});
    const sum = mix.reduce((a, b) => a + b.cents, 0);
    expect(sum).toBe(7);
    expect(mix.every(x => x.type === 'coin')).toBeTruthy();
  });
});

describe('generateOptions (money)', () => {
  it('always includes correct answer', () => {
    state.difficulty = 'medium';
    for (let i = 0; i < 30; i++) {
      const correct = 100 + i * 17;
      const opts = _test.generateOptions(correct);
      expect(opts).toContain(correct);
    }
  });
  it('returns exactly 4 unique options', () => {
    state.difficulty = 'easy';
    for (let i = 0; i < 20; i++) {
      const opts = _test.generateOptions(500);
      expect(opts).toHaveLength(4);
      const uniq = new Set(opts);
      expect(uniq.size).toBe(4);
    }
  });
  it('all options are non-negative', () => {
    state.difficulty = 'hard';
    const opts = _test.generateOptions(10);
    expect(opts.every(x => x > 0)).toBeTruthy();
  });
});

describe('taskMemory', () => {
  beforeEach(() => taskMemory.reset());
  it('accepts new value', () => {
    expect(taskMemory.accept('k', 'v1', 3)).toBeTruthy();
  });
  it('rejects repeat within window', () => {
    taskMemory.accept('k', 'v1', 3);
    expect(taskMemory.accept('k', 'v1', 3)).toBeFalsy();
  });
  it('forgets oldest after window exceeded', () => {
    taskMemory.accept('k', 'a', 2);
    taskMemory.accept('k', 'b', 2);
    taskMemory.accept('k', 'c', 2); // 'a' falls out
    expect(taskMemory.accept('k', 'a', 2)).toBeTruthy();
  });
  it('separate keys are independent', () => {
    taskMemory.accept('k1', 'v', 3);
    expect(taskMemory.accept('k2', 'v', 3)).toBeTruthy();
  });
  it('reset clears memory', () => {
    taskMemory.accept('k', 'v', 3);
    taskMemory.reset('k');
    expect(taskMemory.accept('k', 'v', 3)).toBeTruthy();
  });
});

describe('fillPlaceholders', () => {
  beforeEach(() => {
    state.profile = { name: 'Анна', gender: 'f' };
    state.lang = 'uk';
  });
  it('substitutes {name}', () => {
    expect(_test.fillPlaceholders('Hello, {name}!')).toBe('Hello, Анна!');
  });
  it('substitutes {title} with gender-appropriate', () => {
    const result = _test.fillPlaceholders('You are a {title}');
    expect(result).toMatch(/мисливиця|героїня|зірка|принцеса хонмуну|воїтелька/);
  });
  it('substitutes {adj.real} per gender', () => {
    state.profile.gender = 'f';
    expect(_test.fillPlaceholders('{adj.real}')).toBe('справжня');
    state.profile.gender = 'm';
    expect(_test.fillPlaceholders('{adj.real}')).toBe('справжній');
  });
  it('returns unchanged when no profile', () => {
    state.profile = null;
    expect(_test.fillPlaceholders('Hi {name}!')).toBe('Hi {name}!');
  });
  it('multiple substitutions in one string', () => {
    const r = _test.fillPlaceholders('{name}, ти {adj.real}!');
    expect(r).toBe('Анна, ти справжня!');
  });
});

describe('progress + goals', () => {
  beforeEach(() => {
    state.progress = {};
    state.goals = {};
  });
  it('incProgress increments counter', () => {
    _test.incProgress('money', 'easy');
    _test.incProgress('money', 'easy');
    expect(_test.getProgress('money', 'easy')).toBe(2);
  });
  it('different difficulties are separate', () => {
    _test.incProgress('money', 'easy');
    _test.incProgress('money', 'hard');
    expect(_test.getProgress('money', 'easy')).toBe(1);
    expect(_test.getProgress('money', 'hard')).toBe(1);
    expect(_test.getProgress('money', 'medium')).toBe(0);
  });
  it('setGoal stores integer', () => {
    _test.setGoal('weights', 'medium', 15);
    expect(_test.getGoal('weights', 'medium')).toBe(15);
  });
  it('allGoalsMet false when no goals set', () => {
    expect(_test.allGoalsMet()).toBeFalsy();
  });
  it('allGoalsMet true when all met', () => {
    _test.setGoal('money', 'easy', 3);
    _test.incProgress('money', 'easy');
    _test.incProgress('money', 'easy');
    expect(_test.allGoalsMet()).toBeFalsy();
    _test.incProgress('money', 'easy');
    expect(_test.allGoalsMet()).toBeTruthy();
  });
  it('allGoalsMet false if any goal unmet', () => {
    _test.setGoal('money', 'easy', 2);
    _test.setGoal('weights', 'easy', 2);
    _test.incProgress('money', 'easy');
    _test.incProgress('money', 'easy');
    expect(_test.allGoalsMet()).toBeFalsy();
  });
});

describe('I18N completeness', () => {
  const requiredKeys = [
    'title', 'pageTitle', 'score', 'streak', 'round',
    'welcomeTitle', 'welcomeSub', 'welcomeStart', 'welcomeSave', 'welcomeCancel',
    'welcomeLangLabel', 'welcomeNameLabel', 'welcomeGenderLabel',
    'welcomeDiffLabel', 'welcomeGameLabel',
    'gameMoney', 'gameWeights',
    'genderF', 'genderM', 'genderN',
    'diffEasy', 'diffMedium', 'diffHard',
    'eurLabel', 'centLabel', 'currentSum', 'walletLabel', 'trayLabel', 'trayEmpty',
    'pay', 'clear', 'check', 'nextRound',
    'enterNumber', 'exactHit', 'bullseye', 'tryAgain',
    'items', 'heroPhrases', 'losePhrases',
    'titles', 'adj', 'personalizedHero', 'personalizedLose',
    'countScenarios', 'countOptionsHint', 'countInputHint',
  ];
  for (const lang of ['uk', 'ru', 'es']) {
    it(`${lang}: has all required keys`, () => {
      const I = window.I18N[lang];
      expect(I).toBeDefined();
      for (const key of requiredKeys) {
        if (I[key] === undefined) throw new Error(`Missing key "${key}" in I18N.${lang}`);
      }
    });
    it(`${lang}: titles cover f/m/n`, () => {
      const titles = window.I18N[lang].titles;
      expect(titles.f.length).toBeGreaterThan(0);
      expect(titles.m.length).toBeGreaterThan(0);
      expect(titles.n.length).toBeGreaterThan(0);
    });
    it(`${lang}: adj cover all needed keys`, () => {
      const adj = window.I18N[lang].adj;
      for (const g of ['f', 'm', 'n']) {
        for (const k of ['great', 'amazing', 'best', 'real', 'ready', 'proud']) {
          if (adj[g][k] === undefined) throw new Error(`Missing adj.${g}.${k} in ${lang}`);
        }
      }
    });
    it(`${lang}: has at least 10 hero phrases`, () => {
      expect(window.I18N[lang].heroPhrases.length).toBeGreaterThanOrEqual(10);
    });
    it(`${lang}: has at least 10 count scenarios`, () => {
      expect(window.I18N[lang].countScenarios.length).toBeGreaterThanOrEqual(10);
    });
    it(`${lang}: has at least 15 items`, () => {
      expect(window.I18N[lang].items.length).toBeGreaterThanOrEqual(15);
    });
  });
});

describe('Profile load/save', () => {
  it('saveProfile + loadProfile round-trip', () => {
    const p = { name: 'Test', gender: 'm' };
    _test.saveProfile(p);
    const loaded = _test.loadProfile();
    expect(loaded.name).toBe('Test');
    expect(loaded.gender).toBe('m');
  });
  it('rejects invalid gender', () => {
    try { localStorage.setItem('profile', JSON.stringify({ name: 'x', gender: 'z' })); } catch (e) {}
    expect(_test.loadProfile()).toBeNull();
  });
  it('returns null when no profile saved', () => {
    try { localStorage.removeItem('profile'); } catch (e) {}
    expect(_test.loadProfile()).toBeNull();
  });
});

describe('Games registry', () => {
  it('money is registered', () => {
    expect(window.Games.money).toBeDefined();
    expect(window.Games.money.icon).toBe('💶');
  });
  it('weights is registered', () => {
    expect(window.Games.weights).toBeDefined();
    expect(window.Games.weights.icon).toBe('⚖️');
  });
  it('volumes is registered', () => {
    expect(window.Games.volumes).toBeDefined();
    expect(window.Games.volumes.icon).toBe('🥤');
  });
  it('each game has newRound function', () => {
    for (const g of Object.values(window.Games)) {
      expect(typeof g.newRound).toBe('function');
    }
  });
  it('each game has getName returning string', () => {
    for (const g of Object.values(window.Games)) {
      expect(typeof g.getName('uk')).toBe('string');
      expect(typeof g.getName('ru')).toBe('string');
      expect(typeof g.getName('es')).toBe('string');
    }
  });
});

describe('pickHeroPhrase / pickLosePhrase', () => {
  beforeEach(() => {
    state.lang = 'uk';
    state.profile = { name: 'Анна', gender: 'f' };
  });
  it('pickHeroPhrase returns non-empty string', () => {
    const p = _test.pickHeroPhrase();
    expect(typeof p).toBe('string');
    expect(p.length).toBeGreaterThan(0);
  });
  it('pickLosePhrase returns non-empty string', () => {
    const p = _test.pickLosePhrase();
    expect(typeof p).toBe('string');
    expect(p.length).toBeGreaterThan(0);
  });
  it('no unresolved placeholders in personalized output', () => {
    for (let i = 0; i < 50; i++) {
      const p = _test.pickHeroPhrase();
      if (p.includes('{name}') || p.includes('{title}') || /\{adj\./.test(p))
        throw new Error(`Unresolved placeholder in: ${p}`);
    }
  });
  it('without profile — no name in result', () => {
    state.profile = null;
    for (let i = 0; i < 30; i++) {
      const p = _test.pickHeroPhrase();
      if (p.includes('Анна')) throw new Error(`Unexpected name in non-personalized: ${p}`);
    }
  });
});
