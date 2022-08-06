import './board.css';
import Tile from '../tile/tile';
import React from 'react';

const BoardOverlay = function(){
    return(
        <div className="board board-overlay">
            <p className="good-job">Good Job!</p>
            <p className="play-again">Click NEW GAME to play again</p>
        </div>

    )
}

const PreGameOverLay = function(){
    return(
        <div className="board board-overlay">
            
        </div>
    )
}

const Board = function({boardWidth, highlightedTile, handleTileClick, handleHover, showWinOverlay, showPreGameOverlay, tiles, stagedHint}, ref){

    const boardSize = {
        gridTemplateColumns: `repeat(${boardWidth}, 1fr)`,
    }
  

    return (

        <>
            <div className='board' style={boardSize}>
                {tiles.map((tile, i)=>{
                    return(
                        <Tile 
                        stagedHint={stagedHint}
                        highlightedTile={highlightedTile}
                        handleTileClick={handleTileClick}
                        handleHover={handleHover}
                        isLit= {tile}
                        index={i} 
                        key={i}></Tile>
                    )
                }
                )}
            </div>
            {showWinOverlay ? 
                    <BoardOverlay></BoardOverlay>
                     :
                    ''
            }
            {showPreGameOverlay ? 
                    <PreGameOverLay></PreGameOverLay>
                    :
                    ''
            }
            <div/>
        </>
    );
}
// export default Board;
export default React.forwardRef(Board);