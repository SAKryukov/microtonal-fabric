// C - D - E - F - G - A - B - C
//   b   b   s   b   b   b   s
// 5 * b + 2 * s // 5 big intervals and 2 small ones

const maxOrder = 65;

const justIntonation = [
    { note: "C  do", ratioHumanReadable: " 1/1", min: Number.POSITIVE_INFINITY, factors: [0, 0] },
    { note: "D  re", ratioHumanReadable: " 9/8", min: Number.POSITIVE_INFINITY, factors: [1, 0] },
    { note: "E  me", ratioHumanReadable: " 5/4", min: Number.POSITIVE_INFINITY, factors: [2, 0] },
    { note: "F  fa", ratioHumanReadable: " 4/3", min: Number.POSITIVE_INFINITY, factors: [2, 1] },
    { note: "G sol", ratioHumanReadable: " 3/2", min: Number.POSITIVE_INFINITY, factors: [3, 1] },
    { note: "A  la", ratioHumanReadable: " 5/3", min: Number.POSITIVE_INFINITY, factors: [4, 1] },
    { note: "B  ti", ratioHumanReadable: "15/8", min: Number.POSITIVE_INFINITY, factors: [5, 1] },
    { note: "c  do", ratioHumanReadable: " 2/1", min: Number.POSITIVE_INFINITY, factors: [5, 2] },
];
for (let just of justIntonation)
    just.ratio = eval(just.ratioHumanReadable);

const analizeDivider = divider => {

}; //analizeDivider

const analyzeDividers = order => {
    const solution = [];
    for (let small = 1; small < order; ++small)
        for (let big = small + 1; big < order; ++big) {
            if (small > 1 && big % small == 0) continue;
            if (5 * big + 2 * small == order)
                solution.push({ order: order, b: big, s: small });
        }
    return solution;
}; //analyzeDividers

const analyzeSystem = order => {
    const systemMetrics = analyzeDividers(order);
    const frequencies = [];
    for (let index = 0; index <= order; ++index) 
        frequencies.push({ index: index, frequency: Math.pow(2, index / order) });
    const goodPair = [];
    for (let dividerPair of systemMetrics) {
        let bad = false;
        for (let just of justIntonation) {
            const index = just.factors[0] * dividerPair.b + just.factors[1] * dividerPair.s;
            const deviation = Math.abs(Math.log(just.ratio) - Math.log(frequencies[index].frequency));
            const compareDeviation = Math.abs(Math.log(frequencies[1].frequency/frequencies[0].frequency));
            if (compareDeviation/deviation < 2) { //SA!!!
                bad = true;
                break;
            } //if bad
        } //loop
        if (!bad) goodPair.push(dividerPair);
    } //loop
    return goodPair;
}; //analyzeSystem

const previous = [];
const isDivided = candidate => {
    for (let value of previous)
        if (candidate % previous == 0) return true;
    return false;
} //isDivided

for (let candidate = 12; candidate < maxOrder; ++candidate) {
    if (isDivided(candidate)) continue;
    const solution = analyzeSystem(candidate);
    if (solution.length > 0) {
        console.log(solution);
        previous.push(candidate);
    }   
}
