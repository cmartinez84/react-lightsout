
import { Component } from 'react';
import Board from './components/board/board.js';
import Controls from './components/controls/controls.js';
import './App.css';
import { useRef } from 'react';
import ScoreContainer from './components/ScoreContainer/ScoreContainer.js';


class App extends Component{

  state = {
    tiles: new Array(25),
    plays: 0, 
    highlightedTile: null, 
    showWinOverlay: false, 
    showPreGameOverlay: true,
    demoMode: true, 
    gameInPlay: false, 
    boardWidth: 5, 
    boardArea: 25,
    selectedWidth: 5, 
    difficulty: 2, 
    preplays: [], 
    tryAgain: false, 
    disableNewGameButton: false, 
    hints: [],
    stagedHint: null
  }

  handleTileClick=(index)=>{
    
    const tilesToFlip = this.calculateAdjacentTiles(index);
    this.flipAdjacentTiles(tilesToFlip);
    if(!this.state.demoMode){
      this.setState({
        plays: this.state.plays + 1,
      })      
    }
    this.addClickToHints(index)
    this.checkIfUserFollowedHint(index)

  }

  addClickToHints=(val)=>{
    
    const occurrences = this.state.hints.filter(  x =>  x === val)
    console.log(occurrences.length)

    if(occurrences.length === 0){
      this.setState({hints: [...this.state.hints, val]});
    } 
    else if(occurrences.length === 1 ){
      const hints = this.state.hints.filter(x => x !== val)
      this.setState({hints})
    }
    
  }
  handleClickHint=()=>{
    this.setState({stagedHint: this.state.hints[0]})
    this.hintButtonRef.blur();
    this.col2ref.scrollIntoView({ behavior : "smooth"})


  }

  checkIfUserFollowedHint=(val)=>{
    if(val === this.state.stagedHint){
      var hints = this.state.hints.filter(x=> x !== val)
      this.setState({hints})
    }
    this.setState({stagedHint: null})
  }

  calculateAdjacentTiles(index){
      const isRightEdge =  (index +1) % this.state.boardWidth === 0;
      const isLeftEdge = index % this.state.boardWidth === 0;
      const isBottomEdge = (index + this.state.boardWidth ) > (this.state.boardArea) -1;
      const isTopEdge = index < this.state.boardWidth;
  
      const toTheRight =  index +1;
      const toTheLeft = index -1;
      const below = index + this.state.boardWidth;
      const above = index - this.state.boardWidth;
  
      let tilesToFlip = [index];
  
      if(!isRightEdge){
        tilesToFlip.push(toTheRight)
      }
      if(!isLeftEdge){
        tilesToFlip.push(toTheLeft)
      }
      if(!isBottomEdge){
        tilesToFlip.push(below)
      }
      if(!isTopEdge){
        tilesToFlip.push(above)
      }
    return tilesToFlip;
  }
  
  flipAdjacentTiles=(tilesToFlip)=>{
    const newTiles = [...this.state.tiles];
    tilesToFlip.forEach(index=>{
      newTiles[index]= !newTiles[index];
    })
    this.setState({
      tiles: newTiles
    });
    this.checkForWin(newTiles);
  }

  checkForWin(newTiles){
    const allLightsOut = newTiles.every(tile => tile === false);
    if (allLightsOut){
      this.removeKeyBoardFunctionality();
      this.setState({difficulty : this.state.difficulty + 1 })
      this.startGame(false, false);
    }
  }


  componentDidMount(){
    setTimeout(this.startDemoMode, 500)
    if(!this.state.gameInPlay){
      this.startButtonRef.focus();
    }
    }
    buildBoard(){
      const myArray = [];
      let i = 0;
        do {
          myArray.push(false);
          i++;
        } while (i < (this.state.selectedWidth * this.state.selectedWidth));
        this.setState({tiles: myArray});
    }
  
  createChaos=()=>{
    let preplays = this.state.preplays;

    const scaleDifficulty = Math.ceil((this.state.difficulty * this.state.boardArea) / 25)
    
    if(!this.state.tryAgain){
      // if(true){
      preplays=[];
      for(let i = 0; i <scaleDifficulty ; i++){
        const val = Math.floor(Math.random() * (this.state.boardArea));
        if(preplays.indexOf(val) === -1) {
            preplays.push(val)
        }
      }
    }
   
    let newTiles = [...this.state.tiles];

    preplays.forEach((preplay)=>{
      const tilesToFlip = this.calculateAdjacentTiles(preplay);
      tilesToFlip.forEach(index=>{
        newTiles[index] = !newTiles[index];
      })
    });
    //setState is not working on plays when being implemented in startGame
    this.setState({ 
      tiles: newTiles,
      plays:0,
      highlightedTile: 0, 
      preplays, 
      disableNewGameButton: false,
      hints: [...preplays], 
      stagedHint: null

    });
  }

  addKeyBoardFunctionality=()=>{
    document.addEventListener('keydown', this.navigateWithKeyboard);
  }
  removeKeyBoardFunctionality=()=>{
    document.removeEventListener('keydown', this.navigateWithKeyboard);
  }
  handleClickStart=()=>{
    this.startButtonRef.blur();
    this.setState({difficulty: 2})
    this.startGame();
  }
  handleClicktryagain=()=>{
    this.tryAgainButtonRef.blur();
    this.col2ref.scrollIntoView({ behavior : "smooth"})

    this.setState({tryAgain: true})
    console.log(this.state)
    this.startGame();
  }

  //used for New Game,  Try Again and automatically restarting after win
  startGame=()=>{  
    // newBoard is for any new pattern, whether try again or not
    this.removeKeyBoardFunctionality();
    //build board builds blank board only
    this.buildBoard();
    this.setState({
      showWinOverlay: false,
      showPreGameOverlay: false,
      gameInPlay: true,
      demoMode: false, 
      highlightedTile: null,
      boardWidth: this.state.selectedWidth,
      plays: 0, 
      tiles:  this.state.tiles.map(tile=>false), 
      disableNewGameButton: true, 
      hintIndex: 0
    })

    setTimeout(this.createChaos, 1000);
    setTimeout(this.addKeyBoardFunctionality, 1500);

    //accounts for possible delays in enacting state
    this.col2ref.scrollIntoView({ behavior : "smooth"})
    

  }

 

  navigateWithKeyboard=(e)=>{
    if(this.state.gameInPlay){
      const moveKeys = [37, 38, 39, 40];
      let next = '';
      if(moveKeys.includes(e.keyCode)){
        e.preventDefault();
        //right
        if(e.keyCode === 39){
          if((this.state.highlightedTile + 1) % this.state.boardWidthç === 0){
            next = this.state.highlightedTile;
          }
          else{
            next = this.state.highlightedTile + 1;
          }
        }
        //left
        else if(e.keyCode ===37){
          if(this.state.highlightedTile % this.state.boardWidth === 0 ){
            next = this.state.highlightedTile;
          }
          else{
            next = this.state.highlightedTile - 1;
          }
        }
        //up
        else if(e.keyCode ===38){
          next = this.state.highlightedTile - this.state.boardWidth;
        }
        //down
        else if(e.keyCode ===40){     
          next = this.state.highlightedTile + this.state.boardWidth;
        }
        if(next >= 0 && next < (this.state.boardArea))
        this.setState({highlightedTile: next});
      }
      if(e.keyCode===32){
        this.handleTileClick(this.state.highlightedTile);
      }
      if(e.keyCode===72){
        this.handleClickHint()
      }
    }
  }
  
  handleHover=(index)=>{
    this.setState({ highlightedTile: index})
  }

  startDemoMode=()=>{
    this.createChaos();
    setTimeout(this.calculateComputerMove, 500)
    // delay is purely aesthetic
  }

  calculateComputerMove=()=>{
    const directionMath = [(0-this.state.boardWidth), this.state.boardWidth , -1, 1];
    let directionIndex = 0;
    let nextIndex = 0;
    do{
      directionIndex  = Math.floor(Math.random() * 4 );
      nextIndex = this.state.highlightedTile + directionMath[directionIndex];
    }
    while( nextIndex > ((this.state.boardArea) - 1) || nextIndex < 0 );
    this.setState({highlightedTile: nextIndex});

    if(this.state.tiles[nextIndex]){
      this.handleTileClick(nextIndex);
    }
    if(this.state.demoMode)
    setTimeout(this.calculateComputerMove, 1000)
  }


  // changeInput=(e)=>{
  //   this.setState({boardWidth: e.target.value})
  // }

 setSelectedWidth=(selectedWidth)=>{
    const boardArea = selectedWidth * selectedWidth;
    this.setState({selectedWidth, boardArea})
 }

  render(){
    return (
      <div className="page">
        <div className="col-1">
        <div className="col-1-block-1" >        
          <h1 className='site-title'><span className="site-title-lights">LIGHTS</span><span className="site-title-out">OUT</span></h1>
        </div>
        <div className="col-1-block-2">
          <div className='instructions'>
            <p> The 90s are back!</p>
            <p>Usings either <span className="pink">← → ↑ ↓</span> or the mouse to navigate </p>
            <p>Select a tile with either a mouseclick or the <span className="pink">[spacebar]</span></p>
            <p>Stuck?  Type <span className='pink'>H</span> or click <span className='pink'>HINT</span> for a suggestion</p>
            <p>Turn off all the lights with as few moves as possible! </p>
          </div> 
        <div className=" all-buttons-container">
          <Controls
            gameInPlay={this.state.gameInPlay}
            selectedWidth={this.state.selectedWidth}
            setSelectedWidth={this.setSelectedWidth}
          ></Controls>
          <button 
              disabled={this.state.disableNewGameButton}
              ref={ e =>this.startButtonRef = e}
              className="start-button"
              onClick={this.handleClickStart}>NEW GAME
          </button>
          <button 
              disabled={!this.state.gameInPlay}
              ref={ e =>this.tryAgainButtonRef = e}
              className="start-button"
              onClick={this.handleClicktryagain}>TRY AGAIN
          </button>
          <button 
              disabled={!this.state.gameInPlay}
              ref={ e =>this.hintButtonRef = e}
              className="start-button"
              onClick={this.handleClickHint}>HINT MODE
          </button>
        </div>
        </div>
        <div className="col-1-block-3">   
        </div>
        </div>
        <div className="col-2"  ref={col2Element => this.col2ref = col2Element}>
        <div className='col-2-row-1'>
            <Board 
              stagedHint={this.state.stagedHint}
              selectedWidth={this.state.selectedWidth}
              boardWidth={this.state.boardWidth}
              showPreGameOverlay={this.state.showPreGameOverlay}
              showWinOverlay={this.state.showWinOverlay}
              highlightedTile={this.state.highlightedTile}
              handleHover={this.handleHover}
              handleTileClick={this.handleTileClick}
              tiles={this.state.tiles}
            ></Board>
          </div>
          <div className='col-2-row-2'>
            <ScoreContainer
              score={this.state.plays}
              goal={this.state.preplays.length}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;

