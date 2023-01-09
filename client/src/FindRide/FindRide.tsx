import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
} from '@react-google-maps/api'
import { useState } from 'react'
import React from 'react'
import { Link } from 'react-router-dom'; 
import { FindRideComponentProps, Ride } from "./../Tools/data.model"
import { getJSONData, sendJSONData} from "./../Tools/Toolkit";
import $ from 'jquery';


const FindRide = ({rides,RETREIVE_SCRIPT,setLoading, onResponse, onError}:FindRideComponentProps) => {

    const [ libraries ] = React.useState<any>(['places']);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: `AIzaSyDmPhw5ReIgOBDo-64IIP2aWC3H7Rf2ERs`,
        libraries,
    })

    const [origin, setOrigin] = React.useState<any>();
    const [destination, setDestination] = React.useState<any>();
    const [searchResult, setSearchResult] = React.useState<Ride[]>([]);
    const [similarResult, setSimilarResult] = React.useState<Ride[]>([]);
    const [matchMessage, setMatchMessage] = React.useState<any>();
    const [similarMessage, setSimilarMessage] = React.useState<any>();
    const [originVicinity, setOriginVicinity] = React.useState<any>(null);
    const [destinationVicinity, setDestinationVicinity] = React.useState<any>(null);

    const [showOriginInput, setShowOriginInput] = React.useState<boolean>(false);
    const [showDestinationInput, setShowDestinationInput] = React.useState<boolean>(false);

    const [originDisplay, setOriginDisplay] = React.useState<any>("Please enter your origin");
    const [destinationDisplay, setDestinationDisplay] = React.useState<any>("Please enter your destination");

    if (!isLoaded) {
        return <div />
    }

    let originAutocomplete:any;
    let destinationAutocomplete:any;

    function onOriginChanged() {
        if (originAutocomplete != null) {
            //variable to store the result
            let place = originAutocomplete.getPlace();
            console.log(place.vicinity)
            setOrigin(place.formatted_address);
            setOriginVicinity(place.vicinity);
        } 
    }

    function onDestinationChanged() {
        if (destinationAutocomplete != null) {
            //variable to store the result
            let place = destinationAutocomplete.getPlace();
            console.log(place.vicinity)
            setDestination(place.formatted_address);
            setDestinationVicinity(place.vicinity);
        } 
    }

    function onLoadOrigin(autocomplete:any) {
        if (autocomplete != null){
          originAutocomplete = autocomplete;
        }
    }
    
    function onLoadDestination(autocomplete:any) {
        destinationAutocomplete = autocomplete;
    }

    function showSearchOrigin(e:any) {
        setShowOriginInput(true);
        $('#search').addClass("-z-50")
    }
    function showSearchDestination(e:any) {
        setShowDestinationInput(true);
        $('#search').addClass("-z-50")
    }

    const originInput:HTMLInputElement = document.getElementById("originInput") as HTMLInputElement;
    const destinationInput:HTMLInputElement = document.getElementById("destinationInput") as HTMLInputElement;

    const options = {
        strictBounds: false
    };

    const originautocomplete = new google.maps.places.Autocomplete(originInput, options);

    originautocomplete.addListener("place_changed", () => {
        const place = originautocomplete.getPlace();
        let formattedAddress = place.formatted_address;
        let vicinity = place.vicinity;
        console.log(place.vicinity)
        setOrigin(formattedAddress);
        setOriginVicinity(vicinity);
        //console.log(originVicinity);
        setOriginDisplay(place.name)
        setShowOriginInput(false);
        $('#search').removeClass("-z-50");
    });

    const destinationautocomplete = new google.maps.places.Autocomplete(destinationInput, options);

    destinationautocomplete.addListener("place_changed", () => {
        const place = destinationautocomplete.getPlace();
        let formattedAddress = place.formatted_address;
        let vicinity = place.vicinity;
        console.log(place.vicinity)
        setDestination(formattedAddress);
        setDestinationVicinity(vicinity);
        setDestinationDisplay(place.name)
        setShowDestinationInput(false);
        $('#search').removeClass("-z-50");
    });

    const onFind = (e:any) => {
        // console.log(originVicinity.substring(originVicinity.indexOf(',')+2, originVicinity.length));
        // console.log(destinationVicinity.substring(destinationVicinity.indexOf(',')+2, destinationVicinity.length));
        setMatchMessage("");
        setSimilarMessage("")
        searchResult.length = 0;
        similarResult.length = 0;

        let similarResultArray:any = [];
        let searchResultArray:any = []; 

        if (
            originVicinity== null ||
            destinationVicinity== null
        ){
            console.log("there's no vicinity reference");
            $('#destinationInput').val('');
            $('#originInput').val('');
        } else {

            if (rides.length > 0){
                rides.forEach((element:Ride) => {
                    // console.log(element.name)
                    // console.log(element.name, originVicinity.substring(originVicinity.indexOf(',')+2, originVicinity.length), " >>>>>> ",destinationVicinity.substring(destinationVicinity.indexOf(',')+2, destinationVicinity.length))
                    // let test:string = element.originVicinity;
                    // let test2:string = originVicinity.substring(originVicinity.indexOf(',')+2, originVicinity.length);
                    // console.log(element.name, test, test2, test.includes(test2))
                    if (
                            // exact match is found
                            element.origin == origin && 
                            element.destination == destination
                            ){
                                searchResultArray.push(element);
                                setSearchResult(searchResultArray);
                                console.log(element.name,"its matched instead of similar")
                                // setDestination(null);
                                // setDestinationVicinity(null);
                                // setOrigin(null);
                                // setOriginVicinity(null);
                                $('#destinationInput').val('');
                                $('#originInput').val('');
                        } else {
                            console.log(element.name,"its not matched but may be similar")
                            if (element.originVicinity !== null || element.destinationVicinity !== null){
                                if (
                                    // if the user input matched any destination or origin vicinity, diplay similar results to user
                                    element.originVicinity.includes(originVicinity.substring(originVicinity.indexOf(',')+2, originVicinity.length)) && 
                                    element.destinationVicinity.includes(destinationVicinity.substring(destinationVicinity.indexOf(',')+2, destinationVicinity.length))
                                ){
                                    console.log(element.name,"its similar")
                                    similarResultArray.push(element);
                                    setSimilarResult(similarResultArray);
                                    // setDestination(null);
                                    // setDestinationVicinity(null);
                                    // setOrigin(null);
                                    // setOriginVicinity(null);
        
                                    // console.log(">>>>>",$('#destinationInput').val());
                                    // console.log(">>>>>",$('#originInput').val());
                                    $('#destinationInput').val('');
                                    $('#originInput').val('');
                                    // console.log(">>>>>",$('#destinationInput').val());
                                    // console.log(">>>>>",$('#originInput').val());
                                }else {
                                    console.log(element.name,"its not similar")
                                    // setDestination(null);
                                    // setDestinationVicinity(null);
                                    // setOrigin(null);
                                    // setOriginVicinity(null);
                                    $('#destinationInput').val('');
                                    $('#originInput').val('');
                                }
                            }
                                
                        }            
                });
            }
        
        }

        if (searchResultArray.length <= 0 && similarResultArray.length <= 0){
            setMatchMessage("Oops! No perfect match with exact location was found at this moment:(");
            setSimilarMessage("Sorry...No other similar trips was found at this moment:(");
        } else if (searchResultArray.length <= 0 && similarResultArray.length >= 0){
            setMatchMessage("Oops! No perfect match with exact location was found at this moment...");
            setSimilarMessage("You may be interested in below similar trips!");
        } else if (searchResultArray.length >= 0 && similarResultArray.length <= 0){
            setMatchMessage("We found the perfect match with exact location for you! :)");
            setSimilarMessage("Sorry...No other similar trips was found at this moment...");
        } else {
            setMatchMessage("We found the perfect matched results for you! :)");
            setSimilarMessage("You may be interested in below similar trips!");
        }

        console.log("similarResultArray.length",similarResultArray.length);
        console.log("searchResultArray.length",searchResultArray.length);
        $('#similarMessage').addClass("p-3 bg-green-300 rounded-[30px] mb-3 shadow-gray-600 shadow-md");
        $('#matchMessage').addClass("p-3 bg-orange-300 rounded-[30px] mb-3 shadow-gray-600 shadow-md");
        
    };   

    return (
        <div className='flex flex-col relative'>
            <div style={{display: (showOriginInput ? 'flex' : 'none')}} className="h-full w-full absolute bg-white justify-center items-start z-1000 pt-[150px]">
                <i className="fa-sharp fa-solid fa-location-dot mr-2 text-[50px]"></i>
                <Autocomplete onLoad={onLoadOrigin} onPlaceChanged={onOriginChanged} className="flex w-[80%] items-center justify-center ">
                    <input id="originInput" placeholder='Enter Your Origin Here' type="text" className='p-2 text-[#000] border-solid m-1 p-6 hover:opacity-50 rounded border-black border-2 text-left w-full'/>
                </Autocomplete>
            </div>
            
            <div style={{display: (showDestinationInput ? 'flex' : 'none')}} className="h-full w-full absolute bg-white justify-center items-start z-1000 pt-[150px]">
                <i className="fa-sharp fa-solid fa-location-dot mr-2 text-[50px]"></i>
                <Autocomplete onLoad={onLoadDestination} onPlaceChanged={onDestinationChanged} className='flex w-[80%] items-center justify-center'>
                    <input
                    placeholder='Enter Your Destination Here'
                    id="destinationInput"
                    type="text"
                    className='text-[#000] border-solid m-1 p-6 hover:opacity-50  rounded border-black border-2 text-left w-full'
                    />
                </Autocomplete>
            </div>

            <div id='search'>
                <div className="flex items-baseline justify-between ">
                    <Link to={"/"} className="font-bold text-2xl pb-10 text-orange-500 hover:text-orange-400">Nova Scotia Carpool</Link>
                    <div className="flex flex-row items-baseline">
                        <Link to={"/postRide"} className=""><div className="mr-3"><i className="fa-solid fa-plus mr-1"></i>Post</div></Link>
                        <Link to={"/findRide"} className=""><div><i className="fa-solid fa-magnifying-glass mr-1"></i>Search</div></Link>
                    </div>
                </div>


                <div className="font-bold text-2xl pb-2.5">Find a ride</div>
                <div className="text-xl pb-2.5">Enter your origin and destination and away you go!</div>
                <hr className="mt-10 mb-5"/>

                <div className="flex flex-col">
                    <button className="text-[#000] border-solid m-1 p-2 hover:opacity-50 max-w-md rounded border-black border-2 text-left truncate " onClick={showSearchOrigin}><i className="fa-sharp fa-solid fa-location-dot pr-2"></i>{originDisplay}</button>

                    <button className="text-[#000] border-solid m-1 p-2 hover:opacity-50 max-w-md  rounded border-black border-2 text-left truncate" onClick={showSearchDestination}><i className="fa-sharp fa-solid fa-location-dot pr-2"></i>{destinationDisplay}</button>
                </div>
            

                <div className="flex flex-row mt-3 mb-5">
                    <div>
                        <button className={(origin == null || destination == null) ? "bg-gray-200 text-[#FFF] border-0 mr-1 p-5 w-[150px] rounded-full" :"bg-black text-[#FFF] border-0 mr-1 p-5 hover:opacity-80 w-[150px] rounded-full"} onClick={onFind} disabled={(origin == null || destination == null) ? true : false}>Search</button>
                    </div>

                    {/* <div>
                        <Link to={"/"}><button className="bg-sky-500/50 text-[#FFF] border-0 mr-1 p-5 hover:opacity-80 w-[150px] rounded-full">Back</button></Link>
                    </div> */}
                </div>

                <div className="mt-2 mb-5">
                    <div id="matchMessage" className='mt-2 mb-2 fonp-bold'>{matchMessage}</div>
                    {searchResult.map((data:Ride, n:number)=>
                        <Link target="_blank" to={`/viewRide/${data._id}`} className='mt-2 font-bold'>
                            <div key={n} className="flex flex-col border-solid p-2 rounded border-slate-300 border mb-2 shadow-gray-600 shadow-md hover:border-slate-700">
                                <div className='flex justify-between p-2'>
                                    <div className='text-neutral-600'>Posted on {data.postDate}</div>
                                    <div className="">${data.price} per seat</div>
                                </div>
                                <div className='p-2 font-bold text-green-500'>{data.originDisplay} to {data.destinationDisplay}</div>

                                <div className='p-2'>
                                    <div className='flex flex-row items-center'> 
                                        <div className='text-orange-300 font-bold pr-3'>Pick Up from</div> 
                                        <div className=''>{data.origin}</div>
                                    </div>

                                    <div className='flex flex-row items-center'>
                                        <div className='text-orange-300 font-bold  pr-3'>Drop Off At</div> 
                                        <div className=''>{data.destination}</div>
                                    </div>
                                </div>
                                
                                <hr />
                                
                                <div className='font-bold p-2'><i className="fa-solid fa-user"></i> {data.name}</div>
                            </div>
                        </Link>

                    )}
                </div>

                <div className="">
                    <div id="similarMessage" className='mt-2 mb-2 fonp-bold'>{similarMessage}</div>
                    {similarResult.map((data:Ride, n:number)=>
                        <Link target="_blank" to={`/viewRide/${data._id}`} className='mt-2 font-bold'>
                            <div key={n} className="flex flex-col border-solid p-2 rounded border-slate-300 border mb-2 shadow-gray-600 shadow-md hover:border-slate-700">
                                <div className='flex justify-between p-2'>
                                    <div className='text-neutral-500'>Posted on {data.postDate}</div>
                                    <div className="">${data.price} per seat</div>
                                </div>
                                <div className='p-2 font-bold text-green-500'>{data.originDisplay} to {data.destinationDisplay}</div>

                                <div className='p-2'>
                                    <div className='flex flex-row items-center'> 
                                        <div className='text-orange-300 font-bold pr-3'>Pick Up from</div> 
                                        <div className=''>{data.origin}</div>
                                    </div>

                                    <div className='flex flex-row items-center'>
                                        <div className='text-orange-300 font-bold  pr-3'>Drop Off At</div> 
                                        <div className=''>{data.destination}</div>
                                    </div>
                                </div>

                                <div className='pl-3 pb-3'>
                                    {data.emptySeats} empty seats
                                </div>
                                
                                <hr />
                                
                                <div className='font-bold p-2'><i className="fa-solid fa-user"></i> {data.name}</div>
                            </div>
                        </Link>

                    )}
                </div>
            </div>


            
        </div>
    )
}

export default FindRide