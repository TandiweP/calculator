import { useReducer } from "react"
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'
import "./styles.css"


export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

// function reducer(state, action) { } ----- allows management of state 


function reducer(state, { type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT: 
      //works with overwrite in ACTIONS.EVALUATE:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      //can't add extra "0":
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }  
      //can't add extra ".":
      if (payload.digit === "." && state.currentOperand == null) { return state } 
      if (payload.digit === "." && state.currentOperand.includes(".")) { return state } 
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      } 

      //adding new digit to the end of the currentOperand:
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      //prevent operation buttons from operating if there are no digits:
      if (state.currentOperand === null && state.previousOperand === null) {
        return state
      }
      //allow overwrite of operation:
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      //if there is no prev, it sets the current to previous and clears current:
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
      //calls evaluate function
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    //returns empty state:
    case ACTIONS.CLEAR: 
      return {
        ...state,
        currentOperand: "0", 
        previousOperand: null, 
        operation: null
    } 

    case ACTIONS.DELETE_DIGIT:  
    //return empty object if in overwrite state:
    if (state.overwrite) { 
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }

      //keeps output blank if there is nothing in the output (nothing to delete):
      if (state.currentOperand == null) return state 
      
      //resets clearing last digit to a null value instead of letting it be an empty string:
      if (state.currentOperand.length === 1) {
        return { 
          ...state, 
          currentOperand: null
        }
      }

      //removes last digit from currentOperand:
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,-1) 
      }
    case ACTIONS.EVALUATE: 
      //handle missing state error:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) return state 

      return {
        ...state,
        overwrite: true, //clears when you enter a new digit after operation
        previousOperand: null, //clear previous line 
        operation: null, //remove operation symbols
        currentOperand: evaluate(state) //call evaluate to use state for answer
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation}) {
  //convert strings to num
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  //handle NaN errors 
  if (isNaN(prev) || isNaN(current)) return ""

  //get value by defining and applying calculations
  let computation = ""
  switch (operation) {
    case "+": 
      computation = prev + current
      break
    case "-": 
      computation = prev - current
      break
    case "*": 
      computation = prev * current
      break
    case "÷": 
      computation = prev / current
      break
  }
  //convert to string
  return computation.toString()
}

//adds commas, prevents deletion of zeros when they are middle digets
const INTERGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  //split on decimal:
  const [integer, decimal] = operand.split('.')
  //format for decimal:
  if (decimal == null) return INTERGER_FORMATTER.format(integer)
  return `${INTERGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  //const [state, dispatch] = useReducer(reducer)
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(
    reducer, 
    {}
  )

  
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)}</div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch}/>
        <DigitButton digit="1" dispatch={dispatch}/>
        <DigitButton digit="2" dispatch={dispatch}/>
        <DigitButton digit="3" dispatch={dispatch}/>
        <OperationButton operation="*" dispatch={dispatch}/>
        <DigitButton digit="4" dispatch={dispatch}/>
        <DigitButton digit="5" dispatch={dispatch}/>
        <DigitButton digit="6" dispatch={dispatch}/>
        <OperationButton operation="+" dispatch={dispatch}/>
        <DigitButton digit="7" dispatch={dispatch}/>
        <DigitButton digit="8" dispatch={dispatch}/>
        <DigitButton digit="9" dispatch={dispatch}/>
        <OperationButton operation="-" dispatch={dispatch}/>
        <DigitButton digit="." dispatch={dispatch}/>
        <DigitButton digit="0" dispatch={dispatch}/>
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  )
}

export default App
