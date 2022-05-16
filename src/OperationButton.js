import { ACTIONS } from './App'

//pass dispatch in order to call the Reducer. Accepts an operation as a prop//
export default function OperationButton({ dispatch, operation }) {
    return ( <button 
                //calls ADD_DIGIT function and adds the digit //
                onClick={() => dispatch( { type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}
            >
                {operation}
            </button>
    )
}