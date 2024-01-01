import React from 'react'

export default function FinishScreen({highscore,points, maxPossiblePoints, dispatch}) {
  const percentage = (points / maxPossiblePoints) * 100;
  let emoji;
  if(percentage===100) emoji = "🥇";
  if(percentage>=80 && percentage< 100) emoji = "🥇";
  if(percentage>=60 && percentage< 80) emoji = "🎊";
  if(percentage>=35 && percentage< 60) emoji = "😖";
  if(percentage>=0 && percentage< 35) emoji = "😭";


  return (
    <><p className='result'> <span>{emoji}</span>You scored <strong> {points}</strong> out of {maxPossiblePoints}(
      {Math.ceil(percentage)}%
    ) </p>
    <p className='highscore'> (HighScore: {highscore} points)</p>
    <p className='btn btn-ui'  onClick={()=> dispatch({type:"restart"})}> Restart Quiz</p>
    </>
  )
}
