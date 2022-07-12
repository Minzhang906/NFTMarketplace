import React, {useState} from 'react';
import {useSelector } from 'react-redux';
import {selectCount} from './counterSlice';

export function AnotherAccount() {
    const count = useSelector(selectCount);
    //const dispatch = useDispatch();

    return(
        <div>
           Haha
            {count}
        </div>
    );
}