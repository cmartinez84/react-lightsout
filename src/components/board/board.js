import './board.css';
import Tile from '../tile/tile';
import BoardOverlay from './boardOverlay';

const Board = function(props){
   

    return (
        <div className="col-2">
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
            {props.showOverlay ? 
                    <BoardOverlay></BoardOverlay>
                     :
                    ''
            }
            
        </div>
           
        

        
    );
}
export default Board;