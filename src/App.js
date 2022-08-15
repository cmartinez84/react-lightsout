
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
    showPreGameOverlay: true,
    demoMode: true, 
    gameInPlay: false, 
    boardWidth: 5, //after it is selected, used for calculations during game
    boardArea: 25, 
    selectedWidth: 5, //changes with user selection, does not enact until new round or game starts
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

     //essetially, clicking on the same tiles in any order produces the same results. this tracks which tiles have been clicked 0 or 1 times. if 2, the clicks cancel eachother out.
  addClickToHints=(val)=>{
 
    const occurrences = this.state.hints.filter(  x =>  x === val)

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
    this.bottomElementRef.scrollIntoView({ behavior : "smooth"})
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
      const tiles = [];
      let i = 0;
        do {
          tiles.push(false);
          i++;
        } while (i < (this.state.selectedWidth * this.state.selectedWidth));
        // this.setState({tiles});
      return tiles
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


  //used for New Game,  Try Again and automatically restarting after win
  //boardArea and boardWidth are used for navigation purposes only
  //buildBoard function makes an array of false(lights out) values, based on selectedWidth
  //disableNewGameButton state prevents user from generating more than one game, which causes a glitch
  //The setTimeouts are to prevent the actions from being carried out before the state is set, as they both rely on the previous values being set
  startGame=()=>{  
    this.removeKeyBoardFunctionality();
    this.setState({
      showPreGameOverlay: false,
      gameInPlay: true,
      demoMode: false, 
      highlightedTile: null,
      boardWidth: this.state.selectedWidth,
      tiles:  this.buildBoard(),
      disableNewGameButton: true, 
      hintIndex: 0, 
      boardArea: this.state.selectedWidth * this.state.selectedWidth
    })

    setTimeout(this.createChaos, 1000);
    setTimeout(this.addKeyBoardFunctionality, 1500);

    this.bottomElementRef.scrollIntoView({ behavior : "smooth"})
  }

  handleClickNewGame=()=>{
    //blur allows user to start using keyboard navigation right away
    this.startButtonRef.blur();
    this.setState({difficulty: 2})
    this.startGame();
  }
  
  handleClicktryagain=()=>{
    this.tryAgainButtonRef.blur();
    this.bottomElementRef.scrollIntoView({ behavior : "smooth"})

    this.setState({tryAgain: true})
    this.startGame();
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


 setSelectedWidth=(selectedWidth)=>{
    this.setState({selectedWidth})
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
            selectedWidth={this.state.selectedWidth}
            setSelectedWidth={this.setSelectedWidth}
          ></Controls>
          <button 
              disabled={this.state.disableNewGameButton}
              ref={ e =>this.startButtonRef = e}
              className="start-button"
              onClick={this.handleClickNewGame}>NEW GAME
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
        <div className="col-2"  >
        <div className='col-2-row-1'>
            <Board 
              stagedHint={this.state.stagedHint}
              selectedWidth={this.state.selectedWidth}
              boardWidth={this.state.boardWidth}
              showPreGameOverlay={this.state.showPreGameOverlay}
              highlightedTile={this.state.highlightedTile}
              handleHover={this.handleHover}
              handleTileClick={this.handleTileClick}
              tiles={this.state.tiles}
            ></Board>
          </div>
          <div className='col-2-row-2'  ref={col2Element => this.bottomElementRef = col2Element}>
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

