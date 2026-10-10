import React from 'react';
import collage from '../../images/collage.jpg';
import line from '../../images/airplane-line.jpg';

function ActivitiesGuest() {
    return (
        <div id="activities-section" className="container my-5">
            <div className="row text-center">
                <div className="col-6 actv-div text-start align-content-center" style={{backgroundImage: `url(${line})`}}>
                    <h1 className="mb-5">Wide Range of Activities</h1>
                    <p className='w-75'>Discover a world of exciting activities to make your travels unforgettable! Whether you're looking for thrilling adventures like zip-lining through lush forests, serene experiences such as sunset yoga on the beach, or cultural immersions like guided city tours and cooking classes, we have it all. Dive into handpicked experiences tailored to your interests, from exploring iconic landmarks to uncovering hidden gems. With options for every traveler, your next adventure is just a click away. Let us help you create memories that last a lifetime!</p>
                    <button className="btn btn-lg btn-more mx-auto px-4 mt-4" onClick={() => window.location.href = '/view-upcoming-activities'}>Explore Activities</button>
                </div>
                <div className="col-6">
                    <img className="img-collage" src={collage} alt="Activities" />
                </div>
            </div>
        </div>
    );
}

export default ActivitiesGuest;
