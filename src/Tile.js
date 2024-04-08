import React from 'react';

const Tile = ({ id, tile, selected, onClick }) => {
  let className = 'tile'
  if (selected == id) {className += ' selected'}
  let text = tile.text
  const colors = [
    "#FFFFFF",
    "#EEEEEE", // Off-white
    "#FF5733", // Red
    "#FFA500", // Orange
    "#FFFF00", // Yellow
    "#00FF00", // Lime
    "#00FFFF",  // Cyan
    "#0000FF", // Blue
    "#800080", // Purple
    "#FF00FF" // Magenta
  ];

  const selectedColors = [
    "#F8F8F8",
    "#888888", // Off-white (Even darker shade)
    "#993322", // Red (Even darker shade)
    "#996600", // Orange (Even darker shade)
    "#999900", // Yellow (Even darker shade)
    "#004000", // Lime (Even darker shade)
    "#004040", // Cyan (Even darker shade)
    "#000040", // Blue (Even darker shade)
    "#200020", // Purple (Even darker shade)
    "#400040" // Magenta (Same as Purple in original array)
  ];

  const colorIdx = tile ? tile.operationCount + 1 : 0
  const color = selected === id ? selectedColors[colorIdx] : colors[colorIdx];
  const textColour = selected === id ? '#FFFFFF' : '#000000'

  // const [color, textColour, outlineColour] = calculateColor(tile.value, target)
  return (
    <div
      className={className}
      draggable={true}
      onClick={() => onClick(id)}
      style={{ backgroundColor: color, borderColor: color, color: textColour}}
    >
    {tile ? 
    (tile.denominator === 1 ? (
      <p>{tile.numerator}</p>
    ) : (
      <>
        <p>{tile.numerator}</p>
        <p>{'⎯'.repeat(Math.max(Math.abs(tile.numerator), Math.abs(tile.denominator)).toString().length)}</p>
        <p>{tile.denominator}</p>
      </>
    )) : <></>}
  </div>
  );
};

export default Tile;
