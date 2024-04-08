function GCD(a, b) {
  // Ensure both numbers are positive
  a = Math.abs(a);
  b = Math.abs(b);

  // Base case: if b is 0, the GCD is a
  if (b === 0) {
      return a;
  }

  // Recursively compute GCD using Euclidean algorithm
  return GCD(b, a % b);
}

class Number {
  constructor(numerator, denominator = 1, operationCount = 0, nodes = null) {
    if (denominator == numerator) {
      numerator = 1
      denominator = 1
    }
    if (denominator < 0) {
      numerator = -numerator;
      denominator = -denominator;
    }
    
    const gcd = GCD(numerator, denominator);
    this.numerator = parseInt(numerator) / gcd;
    this.denominator = parseInt(denominator) / gcd;
    this.operationCount = operationCount
    this.nodes = nodes
    this.value = this.denominator === 1 ? this.numerator : this.numerator/this.denominator
    this.text = this.denominator === 1 ? `${this.numerator}` : `${this.numerator}/${this.denominator}`
  }

  isEqualTo(other) {
    return this.value() === other;
  }

  add(b) {
    const lcm = (this.denominator * b.denominator) / GCD(this.denominator, b.denominator);
    return new Number((this.numerator * (lcm / this.denominator) + b.numerator * (lcm / b.denominator)), lcm, this.operationCount + b.operationCount + 1, [this, '+', b]);
  }

  subtract(b) {
    const lcm = (this.denominator * b.denominator) / GCD(this.denominator, b.denominator);
    return new Number((this.numerator * (lcm / this.denominator) - b.numerator * (lcm / b.denominator)), lcm, this.operationCount + b.operationCount + 1, [this, '-', b]);
  }

  multiply(b) {
    return new Number(this.numerator * b.numerator, this.denominator * b.denominator, this.operationCount + b.operationCount + 1, [this, '*', b]);
  }

  divide(b) {
    return new Number(  this.numerator * b.denominator, this.denominator * b.numerator, this.operationCount + b.operationCount + 1, [this, '/', b]);
  }

  tree(parenthesesCount = 0, previousOp = null) {
    let result;
    if (this.nodes) {
      const [a, op, b] = this.nodes
      let needParentheses = (previousOp && (op === '/' || (['/', '*'].includes(previousOp) && ['+', '-'].includes(op))));
      const newParenthesesCount = needParentheses ? parenthesesCount + 1 : parenthesesCount
      result = `${a.tree(newParenthesesCount, op)} ${op} ${b.tree(newParenthesesCount, op)}`
      if (!needParentheses) {
        // Do nothing
      } else if (parenthesesCount % 3 === 0) {
        result = '(' + result + ')';
      } else if (parenthesesCount % 3 === 1) {
        result = '[' + result + ']';
      } else if (parenthesesCount % 3 === 2) {
        result = '{' + result + '}';
      }
    } else {
      result = this.text
    }
    return result
  }
}


console.log([1,0].filter((x) => x))