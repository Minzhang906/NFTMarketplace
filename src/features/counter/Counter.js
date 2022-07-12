import React, {useState} from 'react';
import {useSelector,useDispatch } from 'react-redux';
import {selectCount,decrement} from './counterSlice';

export function Counter() {
    const count = useSelector(selectCount);
    const dispatch = useDispatch();

    return(
        <div>
            <button onClick={() => dispatch(decrement())}>Decrement</button>
            {count}
        </div>
    );
}