import './board.css';
import Tile from '../tile/tile';

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

const Board = function(props){

    return (
        <div  className="col-2" >
            <div className='board'>
                {props.tiles.map((tile, i)=>{
                    return(
                        <Tile 
                        highlightedTile={props.highlightedTile}
                        handleTileClick={props.handleTileClick}
                        handleHover={props.handleHover}
                        isLit= {tile}
                        index={i} 
                        key={i}></Tile>
                    )
                }
                )}
            </div>
            {props.showWinOverlay ? 
                    <BoardOverlay></BoardOverlay>
                     :
                    ''
            }
            {props.showPreGameOverlay ? 
                    <PreGameOverLay></PreGameOverLay>
                    :
                    ''
            }
        </div>
    );
}
export default Board;