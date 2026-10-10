import React from 'react';
import Intro from './LandingPage/Intro';
import HistoricalGuest from './LandingPage/HistoricalGuest';
import ActivitiesGuest from './LandingPage/ActivitiesGuest';
import ItineraryLanding from './LandingPage/ItineraryLanding';

function LandingPage(){
    return (
        <div className='LandingPage'>
            <Intro  />
            <ItineraryLanding />
            <ActivitiesGuest /> 
            <HistoricalGuest />   
        </div>
    );
}
export default LandingPage;