// Тести ігор множення та ділення.

const M = () => window.Games.multiplication._test;
const Div = () => window.Games.division._test;

describe('multiplication: pickEquation', () => {
  it('a, b in [1, 10]', () => {
    for (let i = 0; i < 50; i++) {
      const { a, b, ans } = M().pickEquation();
      expect(a).toBeGreaterThanOrEqual(1);
      expect(a).toBeLessThanOrEqual(10);
      expect(b).toBeGreaterThanOrEqual(1);
      expect(b).toBeLessThanOrEqual(10);
      expect(ans).toBe(a * b);
    }
  });
});

describe('multiplication: wideOptions (easy)', () => {
  it('returns 5 unique values including correct', () => {
    for (const correct of [6, 12, 25, 56, 90]) {
      const opts = M().wideOptions(correct);
      expect(opts).toHaveLength(5);
      expect(opts).toContain(correct);
      expect(new Set(opts).size).toBe(5);
    }
  });
  it('all options are positive', () => {
    const opts = M().wideOptions(4);
    expect(opts.every(v => v > 0)).toBeTruthy();
  });
});

describe('multiplication: neighborOptions (medium)', () => {
  it('returns 5 unique values including correct', () => {
    const opts = M().neighborOptions(3, 4, 12);
    expect(opts).toHaveLength(5);
    expect(opts).toContain(12);
    expect(new Set(opts).size).toBe(5);
  });
  it('includes at least one table-neighbor', () => {
    // For 3×4=12, neighbors are 8 (2×4), 16 (4×4), 9 (3×3), 15 (3×5)
    const opts = M().neighborOptions(3, 4, 12);
    const expectedNeighbors = [8, 16, 9, 15];
    const has = opts.some(o => expectedNeighbors.includes(o));
    expect(has).toBeTruthy();
  });
  it('handles edge case a=1 or b=10 without negative', () => {
    const opts = M().neighborOptions(1, 7, 7);
    expect(opts.every(v => v > 0)).toBeTruthy();
  });
});

describe('multiplication: generateOptions dispatch', () => {
  it('wide spread', () => {
    expect(M().generateOptions(20, 4, 5, 'wide')).toHaveLength(5);
  });
  it('neighbors spread', () => {
    expect(M().generateOptions(20, 4, 5, 'neighbors')).toHaveLength(5);
  });
});

describe('multiplication: MDIFF config', () => {
  it('easy is wide, no input', () => {
    expect(M().MDIFF.easy.spread).toBe('wide');
    expect(M().MDIFF.easy.enableInput).toBeFalsy();
  });
  it('medium is neighbors', () => {
    expect(M().MDIFF.medium.spread).toBe('neighbors');
  });
  it('hard enables input', () => {
    expect(M().MDIFF.hard.enableInput).toBeTruthy();
  });
});

describe('multiplication: I18N', () => {
  for (const lang of ['uk', 'ru', 'es']) {
    it(`${lang}: gameMultiplication and scenarios present`, () => {
      const I = window.I18N[lang];
      expect(typeof I.gameMultiplication).toBe('string');
      expect(I.multScenarios.length).toBeGreaterThanOrEqual(8);
      expect(typeof I.multExplicit).toBe('string');
    });
    it(`${lang}: taskTypeNames includes mult*`, () => {
      const tn = window.I18N[lang].taskTypeNames;
      expect(tn.multExplicit).toBeDefined();
      expect(tn.multWord).toBeDefined();
    });
  }
});

describe('division: pickEquation', () => {
  it('b in [2,10], c in [1,10], a = b*c', () => {
    for (let i = 0; i < 50; i++) {
      const { a, b, ans } = Div().pickEquation();
      expect(b).toBeGreaterThanOrEqual(2);
      expect(b).toBeLessThanOrEqual(10);
      expect(ans).toBeGreaterThanOrEqual(1);
      expect(ans).toBeLessThanOrEqual(10);
      expect(a).toBe(b * ans);
    }
  });
  it('division always exact (no remainder)', () => {
    for (let i = 0; i < 30; i++) {
      const { a, b } = Div().pickEquation();
      expect(a % b).toBe(0);
    }
  });
});

describe('division: wideOptions / neighborOptions', () => {
  it('wide returns 5 unique values including correct', () => {
    const opts = Div().wideOptions(7);
    expect(opts).toHaveLength(5);
    expect(opts).toContain(7);
    expect(new Set(opts).size).toBe(5);
  });
  it('neighbors includes correct, all positive', () => {
    const opts = Div().neighborOptions(4, 3); // 12÷4=3
    expect(opts).toHaveLength(5);
    expect(opts).toContain(3);
    expect(opts.every(v => v > 0)).toBeTruthy();
  });
});

describe('division: DDIFF config', () => {
  it('easy uses wide spread', () => {
    expect(Div().DDIFF.easy.spread).toBe('wide');
  });
  it('hard enables input', () => {
    expect(Div().DDIFF.hard.enableInput).toBeTruthy();
  });
});

describe('division: I18N', () => {
  for (const lang of ['uk', 'ru', 'es']) {
    it(`${lang}: gameDivision and scenarios present`, () => {
      const I = window.I18N[lang];
      expect(typeof I.gameDivision).toBe('string');
      expect(I.divScenarios.length).toBeGreaterThanOrEqual(8);
    });
    it(`${lang}: taskTypeNames includes div*`, () => {
      const tn = window.I18N[lang].taskTypeNames;
      expect(tn.divExplicit).toBeDefined();
      expect(tn.divWord).toBeDefined();
    });
  }
});

describe('multiplication: pickTaskType', () => {
  it('returns one of 4 types when scenarios available', () => {
    const seen = new Set();
    for (let i = 0; i < 60; i++) {
      seen.add(M().pickTaskType(true));
    }
    expect(seen.has('explicit')).toBeTruthy();
    expect(seen.has('missing')).toBeTruthy();
    expect(seen.has('wordEq')).toBeTruthy();
    expect(seen.has('wordPure')).toBeTruthy();
  });
  it('falls back to explicit + missing when no scenarios', () => {
    for (let i = 0; i < 30; i++) {
      const t = M().pickTaskType(false);
      if (t !== 'explicit' && t !== 'missing') throw new Error(`Unexpected type: ${t}`);
    }
  });
});

describe('multiplication: buildEquationHtml', () => {
  it('hides c (right side) by default for explicit', () => {
    const html = M().buildEquationHtml(3, 4, 'c');
    expect(html).toContain('qmark');
    expect(html).toContain('3');
    expect(html).toContain('4');
    expect(html).toContain('×');
    // The ? takes c's position
    expect(html.match(/qmark/g).length).toBe(1);
  });
  it('hides a when hidden="a"', () => {
    const html = M().buildEquationHtml(3, 4, 'a');
    expect(html).toContain('qmark');
    // c=12 should be visible
    expect(html).toContain('12');
    expect(html).toContain('4');
  });
  it('hides b when hidden="b"', () => {
    const html = M().buildEquationHtml(3, 4, 'b');
    expect(html).toContain('12');
    expect(html).toContain('3');
  });
});

describe('division: pickTaskType', () => {
  it('returns one of 4 types when scenarios available', () => {
    const seen = new Set();
    for (let i = 0; i < 60; i++) {
      seen.add(Div().pickTaskType(true));
    }
    expect(seen.has('explicit')).toBeTruthy();
    expect(seen.has('missing')).toBeTruthy();
    expect(seen.has('wordEq')).toBeTruthy();
    expect(seen.has('wordPure')).toBeTruthy();
  });
});

describe('division: buildEquationHtml', () => {
  it('shows dividend, divisor, and ? for c', () => {
    const html = Div().buildEquationHtml(12, 3, 'c'); // 12÷3=?
    expect(html).toContain('12');
    expect(html).toContain('3');
    expect(html).toContain('÷');
    expect(html).toContain('qmark');
  });
  it('hides a (dividend) when hidden="a"', () => {
    const html = Div().buildEquationHtml(12, 3, 'a'); // ?÷3=4
    expect(html).toContain('3');
    expect(html).toContain('4');
    expect(html.match(/qmark/g).length).toBe(1);
  });
});

describe('Games registry has 5 games', () => {
  it('all 5 registered', () => {
    expect(window.Games.money).toBeDefined();
    expect(window.Games.weights).toBeDefined();
    expect(window.Games.volumes).toBeDefined();
    expect(window.Games.multiplication).toBeDefined();
    expect(window.Games.division).toBeDefined();
  });
});
