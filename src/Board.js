import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import Button from './Button';

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


function create_game() {
  const multiplesOf5 = [];
  // const numMultiplesOf5 = Math.floor(Math.random() * 3) + 1;
  const numMultiplesOf5 = 0;
  while (multiplesOf5.length < numMultiplesOf5) {
      // const num = Math.floor(Math.random() * 18) * 5 + 10;
      const num = Math.floor(Math.random() * 4 + 1) * 25;
      if (!multiplesOf5.includes(num)) {
          multiplesOf5.push(num);
      }
  }
  
  // Generate the remaining unique numbers between 1 and 9 inclusive
  const remainingNumbers = [];
  while (remainingNumbers.length < 9 - multiplesOf5.length) {
      const num = Math.floor(Math.random() * 9) + 1;
      if (!remainingNumbers.includes(num)) {
          remainingNumbers.push(num);
      }
  }
  
  // Combine the two arrays and shuffle them
  const numbers = [...multiplesOf5, ...remainingNumbers].sort(() => Math.random() - 0.5);
  const board = numbers.map((num) => new Number(num));
  const target = Math.floor(Math.random() * 900) + 100;
  // const target = Math.floor(Math.random() * 90) + 10;


  return [board, target];
}

let [board, targetValue] = create_game();
const restartLimit = 3;
const hardMode = true;

const Board = () => {
    const [target, setTarget] = useState(targetValue);
    const [tiles, setTiles] = useState(board.slice());
    const [selected, setSelected] = useState(-1);
    const [moveNum, setMoveNum] = useState(0);
    const [restartCount, setRestartCount] = useState(0);

    function handleRestart() {
      setTiles(board.slice());
      setTarget(targetValue);
      setSelected(-1)
      setMoveNum(0);
      setRestartCount(restartCount + 1)
    }
    
    // Function to handle clicking a tile
    const handleClick = (index) => {
      if (index == selected) {
        deselect();
      }
      else {
        setSelected(index);
      }
    };

    function deselect() {
      setSelected(-1);
    }
    
    function applyOperation(direction) {
      let newTiles = tiles
      let targetTile;
      let result;
      if (selected === -1) {return}
      else if (direction === 'R') {targetTile = selected + 1; result = tiles[targetTile] && tiles[selected] ? tiles[targetTile].add(tiles[selected]) : tiles[selected]}
      else if (direction === 'L') {targetTile = selected - 1; result = tiles[targetTile] && tiles[selected] ? tiles[targetTile].subtract(tiles[selected]) : tiles[selected]}
      else if (direction === 'D') {targetTile = selected + 3; result = tiles[targetTile] && tiles[selected] ? tiles[targetTile].multiply(tiles[selected]) : tiles[selected]}
      else if (direction === 'U' && (tiles[selected].numerator == 0)) {return}
      else if (direction === 'U') {targetTile = selected - 3; result = tiles[targetTile] && tiles[selected] ? tiles[targetTile].divide(tiles[selected]) : tiles[selected]}
      if (tiles[selected]) {
        newTiles[targetTile] = result;
        newTiles[selected] = 0;
        setTiles(newTiles.slice())
        setMoveNum(moveNum + 1)
      } 
      setSelected(targetTile);



    }

    function animateTileMove(startIndex, endIndex) {
      const tiles = document.querySelectorAll('.tile');
      const startTile = tiles[startIndex];
      const endTile = tiles[endIndex];
    
      // Calculate distance between start and end tile
      const startX = startTile.offsetLeft;
      const startY = startTile.offsetTop;
      const endX = endTile.offsetLeft;
      const endY = endTile.offsetTop;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
    
      // Move start tile to the end tile's position
      startTile.style.transition = 'transform 0.5s';
      startTile.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    
      // Reset start tile position after animation
      setTimeout(() => {
        startTile.style.transition = 'none';
        startTile.style.transform = 'none';
        endTile.textContent = startTile.textContent;
        startTile.textContent = '';
      }, 500);
    }


    useEffect(() => {
      const handleKeyDown = (event) => {
          let newSelected;
          switch (event.key) {
              case 'ArrowUp':
                  newSelected = selected > 2 ? selected - 3 : selected;
                  setSelected(newSelected);
                  break;
              case 'ArrowDown':
                  newSelected = selected < 6 ? selected + 3 : selected;
                  setSelected(newSelected);
                  break;
              case 'ArrowLeft':
                  newSelected = !(selected % 3 == 0) ? selected - 1 : selected;
                  setSelected(newSelected);
                  break;
              case 'ArrowRight':
                  newSelected = !(selected % 3 == 2) ? selected + 1 : selected;
                  setSelected(newSelected);
                  break;
              case 'w':
                if (selected > 2 && (tiles[selected].numerator || !tiles[selected - 3])) {
                  setSelected(selected - 3)
                  applyOperation('U');
                }
                break;
              case 's':
                if (selected < 6) {
                  setSelected(selected + 3)
                  applyOperation('D');
                }
                break;
              case 'a':
                if (!(selected % 3 == 0)) {
                  setSelected(selected - 1)
                  applyOperation('L');
                }
                break;
              case 'd':
                if (!(selected % 3 == 2)) {
                  setSelected(selected + 1)
                  applyOperation('R');
                }
                break;
              default:
                  return;
          }

          // Check if the newSelected tile is within the board boundaries
          if (newSelected >= 0 && newSelected < 9) {
              setSelected(newSelected);
          }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
          window.removeEventListener('keydown', handleKeyDown);
      };
  }, [selected]);
    
  return (
    <>
      <div className="board">
        {tiles.map((tile, index) => (
          <Tile
            key={index}
            id={index}
            tile={tile}
            selected={selected}
            target={target}
            onClick={handleClick}
          />
        ))}
        {['U', 'D', 'L', 'R'].map((direction) => (
          <Button
            key={direction}
            selected={selected}
            tiles={tiles}
            direction={direction}
            applyOperation={() => applyOperation(direction)}
          />
        ))}
      </div>
      {<div>{tiles.filter((num) => num === target).length ? 'You Win!' : ''}</div>}
      <div>
        Target: {target}
      </div>
      <div>
        Remaining Restarts: {restartLimit - restartCount}
      </div>
      {restartLimit > restartCount && <button onClick={handleRestart}>Restart</button>}
    </>
  );
};

// <button onClick={handleNewGame}>New Game</button> 

export default Board;
