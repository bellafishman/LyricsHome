import React, { useState, useEffect } from 'react'
import NavBar from '../NavBar';

export default function HomeHeader() {

    return (
        <div className='Header HomeHeader'>
            <NavBar/>
            <h1 className='HomeIntroduction'>
                Welcome. Here's what we've got our ears on ...
            </h1>

        </div>
    )
}
