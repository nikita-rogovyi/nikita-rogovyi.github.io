// Тести гри літрів (volumes-game.js).

const V = () => window.Games.volumes._test;

describe('volumes: isAllowedQ', () => {
  it('rejects ¾ values', () => {
    expect(V().isAllowedQ(3)).toBeFalsy();
    expect(V().isAllowedQ(7)).toBeFalsy();
    expect(V().isAllowedQ(15)).toBeFalsy();
  });
  it('accepts whole + halves + quarters', () => {
    [0, 1, 2, 4, 5, 6, 8, 9, 10].forEach(q => {
      expect(V().isAllowedQ(q)).toBeTruthy();
    });
  });
});

describe('volumes: formatVolume', () => {
  beforeEach(() => { state.lang = 'uk'; });
  it('formats zero', () => {
    expect(V().formatVolume(0)).toBe('0 л');
  });
  it('formats whole liters', () => {
    expect(V().formatVolume(4)).toBe('1 л');
    expect(V().formatVolume(8)).toBe('2 л');
  });
  it('formats fractions only', () => {
    expect(V().formatVolume(1)).toBe('¼ л');
    expect(V().formatVolume(2)).toBe('½ л');
  });
  it('formats mixed', () => {
    expect(V().formatVolume(5)).toBe('1 ¼ л');
    expect(V().formatVolume(6)).toBe('1 ½ л');
  });
  it('uses "L" in Spanish', () => {
    state.lang = 'es';
    expect(V().formatVolume(4)).toBe('1 L');
  });
});

describe('volumes: makeVolumeMix', () => {
  it('sum equals target', () => {
    for (let t = 1; t <= 24; t++) {
      if (!V().isAllowedQ(t)) continue;
      const items = V().makeVolumeMix(t, 4, 'large-first');
      const sum = items.reduce((a, p) => a + p.q, 0);
      expect(sum).toBe(t);
    }
  });
  it('small-first for 8q produces 4×¼ + 2×½', () => {
    const items = V().makeVolumeMix(8, 4, 'small-first');
    const q1 = items.filter(p => p.q === 1).length;
    const q2 = items.filter(p => p.q === 2).length;
    expect(q1).toBe(4);
    expect(q2).toBe(2);
  });
});

describe('volumes: VDIFF config', () => {
  it('hard forces small-first', () => {
    expect(V().VDIFF.hard.bias).toBe('small-first');
  });
  it('easy is simple, no input mode', () => {
    expect(V().VDIFF.easy.enableInput).toBeFalsy();
  });
});

describe('volumes: I18N additions', () => {
  for (const lang of ['uk', 'ru', 'es']) {
    it(`${lang}: has unit L`, () => {
      expect(typeof window.I18N[lang].L).toBe('string');
    });
    it(`${lang}: has volumeScenarios (≥ 8)`, () => {
      expect(window.I18N[lang].volumeScenarios.length).toBeGreaterThanOrEqual(8);
    });
    it(`${lang}: has gameVolumes name`, () => {
      expect(typeof window.I18N[lang].gameVolumes).toBe('string');
    });
  }
});

describe('volumes: generateOptions', () => {
  it('returns 4 unique allowed values including correct', () => {
    for (const target of [4, 8, 12]) {
      const opts = V().generateOptions(target, [1, -1, 2, -2]);
      expect(opts).toHaveLength(4);
      expect(opts).toContain(target);
      opts.forEach(o => {
        if (!V().isAllowedQ(o)) throw new Error(`Option ${o} has ¾`);
      });
    }
  });
});
