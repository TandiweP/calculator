import { ACTIONS } from './App'

//pass dispatch in order to call the Reducer. Accepts a digit as a prop//
export default function DigitButton({ dispatch, digit }) {
    return ( <button 
                //calls ADD_DIGIT function and adds the digit //
                onClick={() => dispatch( { type: ACTIONS.ADD_DIGIT, payload: { digit } })}
            >
                {digit}
            </button>
    )
}