import "./../node_modules/@fortawesome/fontawesome-free/css/fontawesome.css"; 
import "./../node_modules/@fortawesome/fontawesome-free/css/solid.css";

import {Route,Routes} from "react-router-dom";

import List from "./List/List";
import PostRide from "./PostRide/PostRide";
import ViewRide from "./ViewRide/ViewRide";
import FindRide from "./FindRide/FindRide";


import React from 'react';
import { getJSONData } from "./Tools/Toolkit";
import { Ride } from "./Tools/data.model";

import Error from "./Error/Error";
import LoadingOverlay from "./LoadingOverlay/LoadingOverlay";

//const RETRIEVE_SCRIPT:string = "http://localhost/get";
const RETRIEVE_SCRIPT:string = '/get';

function App() {

  // ---------------------------------------------- event handlers
  const onResponse = (result:any) => {
    if (result.rides != undefined){
      setRides(result.rides);
    }

    setLoading(false);
  };

  const onError = () => {
    console.log("*** Error has occured during AJAX data transmission");
  }

  // ---------------------------------------------- lifecycle hooks
  React.useEffect(() => {
    getJSONData(RETRIEVE_SCRIPT, onResponse, onError);
  }, []);

  // --------------------------------------------- state setup
  const [rides, setRides] = React.useState<Ride[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true); 

  

  return (
    <div className="overflow-y-auto min-h-screen p-5 bg-white">
      <LoadingOverlay bgColor="#a72f57" spinnerColor="#FFFFFF" enabled={loading} />
      
      {/* <div className="flex items-baseline justify-between ">
        <h1 className="font-bold text-2xl pb-10 text-orange-500">Nova Scotia Carpool</h1>
        <div className="flex flex-row items-baseline">
          <div className="mr-3"><i className="fa-solid fa-plus mr-1"></i>Post</div>
          <div><i className="fa-solid fa-magnifying-glass mr-1"></i>Search</div>
        </div>
      </div> */}

      <Routes>
        <Route
          path="/"
          element={<List rides={rides}/>}  
        />
        
        <Route
          path="/list"
          element={<List rides={rides}/>}
        />


        <Route
        // using route parameter
          path="/postRide"
          element={<PostRide rides={rides} onResponse={onResponse}
          onError={onError}
          RETREIVE_SCRIPT={RETRIEVE_SCRIPT} setLoading={setLoading}/>}
        />

        <Route
        // using route parameter
          path="/findRide"
          element={<FindRide onResponse={onResponse}
          onError={onError}
          rides={rides} RETREIVE_SCRIPT={RETRIEVE_SCRIPT} setLoading={setLoading}/>}
        />

        <Route
        // using route parameter
          path="/viewRide/:id"
          element={<ViewRide rides={rides} onResponse={onResponse}
          onError={onError}
          RETREIVE_SCRIPT={RETRIEVE_SCRIPT} setLoading={setLoading}/>}
        />

        <Route
          path="/*"
          element={<Error />}
        />

      </Routes>

      {/* <div className="flex justify-center items-center bottom-0  p-10">
        <h1 className="text-grey">@Developed by Jenny Ngi</h1>
      </div> */}
    </div>
  );
}

export default App;
