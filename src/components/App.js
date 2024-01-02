import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import Footer from "./Footer"

const SECS_PER_QUESTION = 30;

function reducer(state,action){
  switch (action.type){
    case "dataReceived":
      return {...state,
         questions: action.payload,
          status: "ready",
        };
    case "dataFailed":
      return{...state,
        status:"error",
      };
      case "Start":
        return{...state,
          status:"active",
          secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
      case "NewAnswer":
        const question = state.questions.at(state.index);

        return{...state,
          answer: action.payload,
          points: action.payload === question.correctOption?
          state.points + question.points : state.points,
      };
      case "NextQuestion":
        return{...state,
          index: state.index + 1,
          answer: null,
      };
      case "finish":
        return{...state,
        status: "finished",
        highscore: state.points > state.highscore ? state.points : state.highscore
      };
      case "restart":
        return{...intialState,
        status: "ready", questions: state.questions, highscore: state.highscore };
      case "tick":
        return {
          ...state,
          secondsRemaining: state.secondsRemaining -1,
          status: state.secondsRemaining ===0 ? "finished": state.status
        };
    default:
      throw new Error("Unknow action");
  }
}

const intialState = {
  questions : [],
  //loading, error, waiting, ready, active, finish
  status: "loading",
  index: 0,
  points: 0,
  answer: null,
  highscore: 0,
  secondsRemaining: null,
}

export default function App(){
  
  const [{questions,status, index, answer, points, highscore, secondsRemaining},dispatch] = useReducer(reducer,intialState);
  const maxPossiblePoints = questions.reduce((pre,cur)=> pre + cur.points, 0)
  const numQuestions = questions.length;

  useEffect(function(){
    fetch("http://localhost:9000/questions")
    .then((res)=> res.json())
    .then(data=> dispatch({type: "dataReceived",payload :data }))
    .catch((err)=> dispatch({type: "dataFailed"}));
   
  },[])
  return <div className="app">
  <Header/>
  <Main>
    {status==="loading" && <Loader/>}
    {status==="error" && <Error/>}
    {status==="ready" && <StartScreen numQuestions= {numQuestions} dispatch={dispatch}/>}
    {status=== "active" && <>
     <Progress numQuestions= {numQuestions} index={index} points={points} maxPossiblePoints= {maxPossiblePoints}
     answer={answer} />
    <Question question={questions[index]} dispatch={dispatch} answer={answer}/>
    <Footer> <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
    <NextButton dispatch={dispatch}  answer={answer}  numQuestions= {numQuestions} index={index}/></Footer></> }
    {status==="finished" && <FinishScreen highscore={highscore} points={points} maxPossiblePoints = {maxPossiblePoints}
    dispatch={dispatch}/>}
  </Main>
  </div>
}