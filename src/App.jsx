import { useState, useEffect } from 'react'
import Die from './components/die'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'
import './App.css'


function App() {

  const [dice , setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [rolls, setRolls] = useState(1)
  const [best, setBest] = useState(JSON.parse(localStorage.getItem('best')) || 999)

  useEffect(()=>{
    localStorage.setItem("best", JSON.stringify(best))
  },[best])

  useEffect(()=>{
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
        setTenzies(true)
      }
  },[dice])
  
  function generateNewDie(){
    return {value: Math.ceil(Math.random() * 6 ), 
            isHeld: false, 
            id: nanoid()
          }
  }

  function allNewDice(){
    return Array.from( {length: 10 }, v => (generateNewDie()
      ))
  }
  
  function rollDice(){
    if (tenzies){
      setDice(allNewDice())
      setTenzies(false)
      setBest(oldBest =>{ 
        return rolls < oldBest?
          rolls:
          oldBest
        }
      )
      setRolls(1)
    }else {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
              die : 
              generateNewDie()
      }))
      setRolls(oldRolls => oldRolls + 1) 
    }
  }

  function hold(dieId){
    setDice(oldDice => oldDice.map(die => { 
        return die.id === dieId ?
             {...die, isHeld: !die.isHeld} :
             die 
      })
    )
  }

  const diceElements = dice.map((die, i) => (
    <Die 
    key={die.id} 
    value={die.value} 
    isHeld={die.isHeld}
    hold={() => hold(die.id)}
    />
  ))
   
 
  return (
    <main>
      {tenzies && <Confetti />}
      {best !== 999 && <h3 className='best'>Best: {best}</h3>}
      {rolls > 0 && <h3 className='rolls'>Rolls: {rolls}</h3>} 
      <h1 className="title">Tenzies</h1>
            <p className="instructions">
              Roll until all dice are the same.
             Click each die to freeze it at its current value between rolls.</p>
      <div className='container'>
        {diceElements}
      </div>
      <button className='roll-btn' onClick={rollDice}>
        {tenzies ? "New Game": "Roll" }
      </button>
    </main>
  )
}

export default App
