import { parseAllowedNodeNames } from './allowed-names';

describe('parseAllowedNodeNames', () => {
  it("returns ['worker-01'] when unset or empty", () => {
    expect(parseAllowedNodeNames(undefined)).toEqual(['worker-01']);
    expect(parseAllowedNodeNames('')).toEqual(['worker-01']);
    expect(parseAllowedNodeNames('   ')).toEqual(['worker-01']);
  });

  it("returns [] for 'none' (any case)", () => {
    expect(parseAllowedNodeNames('none')).toEqual([]);
    expect(parseAllowedNodeNames('NONE')).toEqual([]);
  });

  it('splits comma-separated names, trims, and drops empties', () => {
    expect(parseAllowedNodeNames('worker-01, worker-02')).toEqual(['worker-01', 'worker-02']);
    expect(parseAllowedNodeNames('worker-01,,worker-02')).toEqual(['worker-01', 'worker-02']);
  });
});
