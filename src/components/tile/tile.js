import './tile.css';
import { useState, useEffect } from 'react';

const Tile = function({index, highlightedTile, isLit, handleTileClick, handleHover, stagedHint}){
    const [hoverState, setHoverState] = useState(false);
    const [blinking, setBlinking] = useState(false)
    const [blinkingInterval, setBlinkingInterval]= useState();

    const blinkingStyle={
        backgroundColor: blinking ? '#f8bdda' : ''
    }
    let blinkInterval;

    const blinkTile = ()=>{
        setBlinking(blinking=> !blinking)
    }

    useEffect(()=>{
        if(stagedHint === index){
            blinkInterval = setInterval(blinkTile, 300);
            // blinkInterval = setInterval(blinkTile, 300);
        }
        return ()=>{
            clearInterval(blinkInterval)
            setBlinking(false)
        }

    }, [stagedHint])

    const onTileClick = (index)=>{
        handleTileClick(index);
    }
    const onHover=(index)=>{
        handleHover(index);
    }


    
        return (
            <span className={'tile-container'}>
                <span 
                style={blinkingStyle}
                onMouseOver={()=>{onHover(index)}}
                onClick={()=>{onTileClick(index)}}
                className={
                    `${highlightedTile === index ? 'hovered' : ' '} 
                     ${isLit ? 'tile-lit': 'tile-dark'}
                    tile`}> </span>
            </span>
        )
}
export default Tile;



