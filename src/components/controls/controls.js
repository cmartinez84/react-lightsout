import { useState } from "react"
import './controls.css';


const Controls = function(props){

    const selectedStyle = {
        backgroundColor: "white"
    }
    const values = [5,6, 7,8,9,10]
    return(
        <div className="board-width-button-container">

            {
                values.map( (value, i) =>
                    <button 
                    key={i}
                    className="board-width-button" 
                    style={ props.selectedWidth === value? selectedStyle : null} 
                    onClick={()=>(props.setSelectedWidth(value))}>{value}</button>
                    )
            }

        </div>
    )
        
}
export default Controls