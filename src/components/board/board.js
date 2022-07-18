import './board.css';
import Tile from '../tile/tile';

const Board = function(props){
   

    return (
        <div class="page">
            <div></div>
            <div className='board'>
                {props.tiles.map((tile, i)=>{
                    return(
                        <Tile 
                        handleTileClick={props.handleTileClick}
                        isLit= {tile}
                        index={i} 
                        key={i}></Tile>
                    )
                }
                )}
            </div>
            <div></div>

        </div>

        
    );
}
export default Board;