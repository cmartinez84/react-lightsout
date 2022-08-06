import './tile.css';
import { useState } from 'react';

const Tile = function({index, highlightedTile, isLit, handleTileClick, handleHover}){
    const [hoverState, setHoverState] = useState(false);
    const onTileClick = (index)=>{
        handleTileClick(index);
    }
    const onHover=(index)=>{
        handleHover(index);
    }
    
        return (
            <span className={'tile-container'}>
                <span 
                onMouseOver={()=>{onHover(index)}}
                onClick={()=>{onTileClick(index)}}
                className={
                    `${highlightedTile === index ? 'hovered' : ' '} 
                     ${isLit ? 'tile-lit': 'tile-dark'}
                    tile`}>  </span>
            </span>
        )
}
export default Tile;



