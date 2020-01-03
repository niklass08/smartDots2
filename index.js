import { GeneticOptimizer } from 'geneticOptimizer';
const STATES = 200;
const MOVES = 500;
const MIN = -0.75;
const MAX = 0.75;
const MUTATION_RATE = 0.5;
const MAX_SPEED = 0.75;
const GOAL = [100, 100];

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

const speedArrayToPositionArray = speedArray => {
  let lastPosition = [0, 0];
  let currentSpeed = [0, 0];
  let speedNorm = 0;
  const positionArray = [];
  speedArray.forEach(speed => {
    currentSpeed = [currentSpeed[0] + speed[0], currentSpeed[1] + speed[1]];
    speedNorm = Math.sqrt(currentSpeed[0] ** 2 + currentSpeed[1] ** 2);
    if (speedNorm > MAX_SPEED) {
      currentSpeed = [MAX_SPEED * (currentSpeed[0] / speedNorm), MAX_SPEED * (currentSpeed[0] / speedNorm)];
    }
    positionArray.push([lastPosition[0] + currentSpeed[0], lastPosition[1] + currentSpeed[1]]);
    lastPosition = positionArray.slice(-1)[0];
  });
  return positionArray;
};
const dist = (a, b) => {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
};
const fitPos = (pos, goal) => 1 / (1 + dist(pos, goal));

const initialStateGenerator = () => {
  return Array(STATES)
    .fill(0)
    .map(() =>
      Array(MOVES)
        .fill(0)
        .map(() => [getRandomArbitrary(MIN, MAX), getRandomArbitrary(MIN, MAX)])
    );
};
const mutator = state => {
  const newPop = Array(STATES)
    .fill(0)
    .map(() =>
      state.slice().map(el => (Math.random() < MUTATION_RATE ? [el[0] + getRandomArbitrary(-0.1, 0.1), el[1] + getRandomArbitrary(-0.1, 0.1)] : el))
    );
  newPop.push(state);
  return newPop;
};
const fitnessEvaluator = state => {
  const positionArray = speedArrayToPositionArray(state);
  return positionArray
    .map(position => fitPos(position, GOAL))
    .reduce((acc, curr) => {
      acc = curr > acc ? curr : acc;
      return acc;
    }, Number.NEGATIVE_INFINITY);
};

const options = { initialStateGenerator, mutator, fitnessEvaluator };
const geneticOptimizer = new GeneticOptimizer(options).optimize();
export default function*() {
  while (true) {
    const speeds = geneticOptimizer.next().value;
    yield { positions: speedArrayToPositionArray(speeds.bestState), popPos: speeds.population.map(state => speedArrayToPositionArray(state)) };
  }
}
