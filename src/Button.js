import React from 'react';

let [tileWidth, circleRadius, gapSize] = [100, 32, 6]
let [centreOffset, edgeOffset] = [Math.floor(tileWidth/2) - Math.floor(circleRadius/2), Math.floor(tileWidth/2) + Math.floor(gapSize/2)]

const arrows = {'U': '↑', 'D': '↓', 'R': '→', 'L': '←'};
const opSymbols = {'U': '÷', 'D': 'x', 'R': '+', 'L': '-'};

const Button = ({ selected, tiles, direction, applyOperation }) => {
    if ((selected === -1)) {return (<></>)}
    else if ((direction === 'U' && (selected <= 2 || !tiles[selected].numerator))) {return (<></>)}
    else if ((direction === 'D' && selected >= 6)) {return (<></>)}
    else if ((direction === 'L' && (selected % 3 === 0))) {return (<></>)}
    else if ((direction === 'R' && (selected % 3 === 2))) {return (<></>)}
    let [centreX, centreY] = [(selected % 3) * (tileWidth + gapSize) + centreOffset, Math.floor(selected / 3) * (tileWidth + gapSize) + centreOffset]


    let [coordX, coordY] = [centreX, centreY]
    let text;
    let targetTile;
    if (direction === 'U') {coordY -= edgeOffset; targetTile=tiles[selected-3]}
    else if (direction === 'D') {coordY += edgeOffset; targetTile=tiles[selected+3]}
    else if (direction === 'R') {coordX += edgeOffset; targetTile=tiles[selected+1]}
    else if (direction === 'L') {coordX -= edgeOffset; targetTile=tiles[selected-1]}

    if (!(tiles[selected])) {return (<></>)} // && !targetTile.nodes
    // else if (!(tiles[selected])) {text = targetTile.nodes[1]}
    else if (targetTile) {text = opSymbols[direction]}
    else {text = arrows[direction]}


    return (<button
      className="circle-button"
      style={{
        left: `calc(${coordX}px)`,
        top: `calc(${coordY}px)`
      }}
      onClick={() => applyOperation()}
    >
      {text}
    </button>)
};

export default Button;