(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { GeneticOptimizer } = require('geneticOptimizer');
const STATES = 100;
const MOVES = 100;
const MIN = -1;
const MAX = 1;
const MUTATION_RATE = 0.5;
const MAX_SPEED = 2;
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
  return Array(STATES)
    .fill(0)
    .map(() =>
      state.slice().map(el => (Math.random() < MUTATION_RATE ? [el[0] + getRandomArbitrary(-0.1, 0.1), el[1] + getRandomArbitrary(-0.1, 0.1)] : el))
    );
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
const smartDotsOptimizer = geneticOptimizer;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports.smartDotsOptimizer = smartDotsOptimizer;
if (window !== undefined) window.smartDotsOptimizer = smartDotsOptimizer;

},{"geneticOptimizer":2}],2:[function(require,module,exports){
class geneticOptimizer {
  constructor({ initialStateGenerator, mutator, fitnessEvaluator }) {
    //Function that returns an array of random states
    this.initialStateGenerator = initialStateGenerator;

    //Function that take a state and return an array of slightly modified states
    this.mutator = mutator;

    //Function that associate a fitness score to a given state
    this.fitnessEvaluator = fitnessEvaluator;
  }

  *optimize() {
    //Generate a population that is an array of states
    let population = this.initialStateGenerator();
    while (true) {
      //Find Best state in the population
      let bestFitness = Number.NEGATIVE_INFINITY;
      const bestState = population.reduce((acc, curr) => {
        let currentFitness = this.fitnessEvaluator(curr);
        acc = currentFitness > bestFitness ? curr : acc;
        bestFitness = currentFitness > bestFitness ? currentFitness : bestFitness;
        return acc;
      });

      yield bestState;

      //Mutate the best state to generate a new population
      population = this.mutator(bestState);
    }
  }
}
module.exports.GeneticOptimizer = geneticOptimizer;

},{}]},{},[1]);
