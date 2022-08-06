import React from 'react'
import './ScoreContainer.css'

function ScoreContainer({score, goal}) {
  return (
    <div className="score-container">   
        <div>            
        <p className='score'>YOU: {score}</p>
        </div>     
        <div>
        <p className='score pink'>GOAL: {goal}</p>
        </div>     s
  </div>
  )
}

export default ScoreContainer