import './tile.css';
import { useState } from 'react';

const Tile = function(props){
    const [hoverState, setHoverState] = useState(false);
    const onTileClick = (index)=>{
        props.handleTileClick(index);
    }
    
        return (
            <span className={'tile-container'}>
                <span 
                onMouseOver={()=>{setHoverState(true)}}
                onMouseLeave={()=>{setHoverState(false)}}
                onClick={()=>{onTileClick(props.index)}}
                className={
                    `${hoverState ? 'hovered' : ' '} 
                     ${props.isLit ? 'tile-lit': 'tile-dark'}
                    tile`}>  </span>
            </span>
        )
}
export default Tile;



