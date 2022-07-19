import './tile.css';
import { useState } from 'react';

const Tile = function(props){
    const [hoverState, setHoverState] = useState(false);
    const onTileClick = (index)=>{
        props.handleTileClick(index);
    }
    const onHover=(index)=>{
        props.handleHover(index);
    }
    
        return (
            <span className={'tile-container'}>
                <span 
                onMouseOver={()=>{onHover(props.index)}}
                onClick={()=>{onTileClick(props.index)}}
                className={
                    `${props.highlightedTile === props.index ? 'hovered' : ' '} 
                     ${props.isLit ? 'tile-lit': 'tile-dark'}
                    tile`}>  </span>
            </span>
        )
}
export default Tile;



