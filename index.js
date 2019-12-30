const { GeneticOptimizer } = require("geneticOptimizer");
const STATES = 100;
const MOVES = 100;
const MIN = -1;
const MAX = 1;
const MUTATION_RATE = 0.5;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

initialStateGenerator = () => {
  return Array(STATES)
    .fill(0)
    .map(() =>
      Array(MOVES)
        .fill(0)
        .map(() => [getRandomArbitrary(MIN, MAX), getRandomArbitrary(MIN, MAX)])
    );
};
mutator = state => {
  return Array(STATES)
    .fill(0)
    .map(() =>
      state
        .slice()
        .map(el =>
          Math.random() < MUTATION_RATE
            ? [
                el[0] + getRandomArbitrary(-0.1, 0.1),
                el[1] + getRandomArbitrary(-0.1, 0.1)
              ]
            : el
        )
    );
};
fitnessEvaluator = () => {};

const options = { initialStateGenerator, mutator, fitnessEvaluator };
const geneticOptimizer = new GeneticOptimizer(options);
