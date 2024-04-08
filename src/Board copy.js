function GCD(a, b) {
    return b === 0 ? a : GCD(b, a % b);
  }
  
class Number {
  constructor(key, numerator, denominator = 1) {
    const gcd = GCD(numerator, denominator);
    this.key = key;
    this.numerator = parseInt(numerator) / gcd;
    this.denominator = parseInt(denominator) / gcd;
    this.value = this.denominator === 1 ? `${this.numerator}` : `${this.numerator} / ${this.denominator}`
  }

  toString() {
    if (this.denominator === 1) {
      return `${this.numerator}`;
    }
    return `${this.numerator} / ${this.denominator}`;
  }

  value() {
    if (this.denominator === 1) {
      return parseInt(this.numerator);
    }
    return parseFloat(this.numerator) / parseFloat(this.denominator);
  }

  isEqualTo(other) {
    return this.value() === other;
  }

  add(b) {
    const lcm = (this.denominator * b.denominator) / GCD(this.denominator, b.denominator);
    return new Number(b.key, (this.numerator * (lcm / this.denominator) + b.numerator * (lcm / b.denominator)), lcm);
  }
  
  subtract(b) {
    const lcm = (this.denominator * b.denominator) / GCD(this.denominator, b.denominator);
    return new Number(b.key, (this.numerator * (lcm / this.denominator) - b.numerator * (lcm / b.denominator)), lcm);
  }
  
  multiply(b) {
    return new Number(b.key, this.numerator * b.numerator, this.denominator * b.denominator);
  }
  
  divide(b) {
    return new Number(b.key, this.numerator * b.denominator, this.denominator * b.numerator);
  }
}
  
  
  
let board;

const smallNumbers = Array.from({ length: 9 }, (_, i) => i + 1);
const bigNumbers = Array.from({ length: 5 }, (_, i) => (i + 1) * 20);
const bigNumberTotal = Math.floor(Math.random() * 2) + 1;
let bigNumberCount = 0;
board = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => 0));

for (let i = 0; i < 3; i++) {
for (let j = 0; j < 3; j++) {
    if (Math.random() < bigNumberTotal / 9 && bigNumberCount < bigNumberTotal) {
        board[i][j] = new Number(bigNumbers[bigNumberCount]);
        bigNumberCount++;
    } else {
        board[i][j] = new Number(smallNumbers[i + 3 * j]);
    }
}
}

if (bigNumberCount === 0) {
const randomRow = Math.floor(Math.random() * 3);
const randomCol = Math.floor(Math.random() * 3);
board[randomRow][randomCol] = new Number(bigNumbers[0]);
}

board = board.reduce((acc, curr) => acc.concat(curr), []);
console.log(board)