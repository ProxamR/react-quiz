import React from 'react'

export default function StartScreen({numQuestions, dispatch}) {
  return (
    <div className='start'>
      <h2>Welcome To The React Quiz</h2>
      <h3>{numQuestions} question to test your React mastery</h3>
      <button onClick={()=> dispatch({type:"Start"})} className='btn btn-ui'>Let's Start</button>
    </div>
  )
}
