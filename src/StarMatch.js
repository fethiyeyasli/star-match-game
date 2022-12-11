import { useEffect, useState } from 'react';
import './StarMatch.css';

const Star = props => (
     <>
    {utils.range(1, props.count).map(number => (
    <div key={number} className="star" />
    ))}
    </>
);
const PlayNumber = props => {
  return(<button className="number" onClick={() => props.click(props.number, props.status)}
  style={{backgroundColor: colors[props.status]}}>{props.number}</button>);
}

const PlayAgain = props => (
  <div className="game-done">
    <div className="message" style={{color: props.gameStatus==='win' ? 'green' : 'red'}}>
      {props.gameStatus === 'win' ? 'Winner winner chicken dinner' : 'Try Again'}
    </div>
    <button onClick={props.onClick}>Play Again</button>
  </div>
);

function StarMatch() {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1,9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    if(secondsLeft > 0 && availableNums.length > 0){
    const secondTimeout = setTimeout(() => {setSecondsLeft(secondsLeft -1);}, 1000);
    return () => {clearTimeout(secondTimeout)};
    }
  });

  const candidateIsWrong = utils.sum(candidateNums);
  const gameStatus = secondsLeft !== 0 ? availableNums.length === 0 ? 'win' : 'active' : 'lost';

  const numberStatus = (number) => {
    if(!availableNums.includes(number)){
      return 'used';
    }
    if(candidateNums.includes(number)){
      return stars < candidateIsWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  }
  const numberClick = (number, numberStatus) => {
    if(numberStatus === 'used' || gameStatus !== 'active'){
      return;
    }
    const newCandidateNums = numberStatus === 'available' ? candidateNums.concat(number) :
                              candidateNums.filter(cn => cn !== number);
    if(utils.sum(newCandidateNums) !== stars){
      setCandidateNums(newCandidateNums)
    }else{
      const newAvailableNums = availableNums.filter(
        p => !newCandidateNums.includes(p)
      )
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
      setStars(utils.randomSumIn(newAvailableNums, 9));
    }

  }

  const playAgain = () => {
      setStars(utils.random(1, 9));
      setAvailableNums(utils.range(1, 9));
      setCandidateNums([]);
      setSecondsLeft(10);
  }

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? (<PlayAgain onClick={playAgain} gameStatus={gameStatus}/>) :(<Star count={stars}/>)}
        </div>
        <div className="right">
          {utils.range(1, 9).map(number => 
           <PlayNumber key={number} number={number} click={numberClick} status={numberStatus(number)}/>)}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
}

const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

export default StarMatch;
