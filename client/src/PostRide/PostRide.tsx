import React from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { PostRideComponentProps, Ride } from "./../Tools/data.model"
import { getJSONData, sendJSONData} from "./../Tools/Toolkit";
import { Link } from 'react-router-dom'; 
import $ from 'jquery';
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
} from '@react-google-maps/api'



const PostRide = ({rides,onResponse,onError,RETREIVE_SCRIPT,setLoading}:PostRideComponentProps) => {

    //const POST_SCRIPT_RIDES:string = "http://localhost/postRide";
    const POST_SCRIPT_RIDES:string = "/postRide";


    const center = { lat: 48.8584, lng: 2.2945 }

    const [ libraries ] = React.useState<any>(['places']);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: `AIzaSyDmPhw5ReIgOBDo-64IIP2aWC3H7Rf2ERs`,
        libraries,
    })
    
    const [map, setMap] = React.useState<any>((null))
    const [directionsResponse, setDirectionsResponse] = React.useState<any>(null)
    const [distance, setDistance] = React.useState<any>('')
    const [duration, setDuration] = React.useState<any>('')
    const [origin, setOrigin] = React.useState<any>(null);
    const [destination, setDestination] = React.useState<any>(null);
    const [originVicinity, setOriginVicinity] = React.useState<any>(null);
    const [destinationVicinity, setDestinationVicinity] = React.useState<any>(null);

    const [name, setName] = React.useState("");
    const [oneTimeDepartureDate, setOneTimeDepartureDate] = React.useState("");
    const [oneTimeReturnDate, setOneTimeReturnDate] = React.useState("");
    const [departureTime, setDepartureTime] = React.useState("");
    const [returnTime, setReturnTime] = React.useState("");
    const [recurringList, setRecurringList] = React.useState<any[]>([]);
    const [smoking, setSmoking] = React.useState(false);
    const [emptySeats, setEmptySeats] = React.useState(1);
    const [price, setPrice] = React.useState("0");
    const [tripDescription, setTripDescription] = React.useState("");
    const [contact, setContact] = React.useState("");
    const [warningMessage, setWarningMessage] = React.useState("");

    
    const [originDisplay, setOriginDisplay] = React.useState<any>("Please enter your origin");
    const [destinationDisplay, setDestinationDisplay] = React.useState<any>("Please enter your destination");

    const [showOriginInput, setShowOriginInput] = React.useState<boolean>(false);
    const [showDestinationInput, setShowDestinationInput] = React.useState<boolean>(false);

    const [showOneTimeTrip, setShowOneTimeTrip] = React.useState<boolean>(true);
    const [showRecurrence, setRecurrence] = React.useState<boolean>(false);

    const handleName = (e:any) => {
        setName(e.target.value);
    };

    const handleTripDescription = (e:any) => {
        setTripDescription(e.target.value);
    };

    const handleOneTimeDepartureDate = (e:any) => {
        setOneTimeDepartureDate(e.target.value);
    };
    
    const handleOneTimeReturnDate = (e:any) => {
        setOneTimeReturnDate(e.target.value);
    };

    const handleDepartureTime = (e:any) => {
        setDepartureTime(e.target.value);
    };

    const handleReturnTime = (e:any) => {
        setReturnTime(e.target.value);
    };

    const handleSmoking = (e:any) => {
        if (e.target.checked == true){
            setSmoking(true);
        }else {
            setSmoking(false);
        }

        return smoking;
        
    };

    const handleEmptySeats = (e:any) => {
        setEmptySeats(e.target.value);
    };

    const handlePrice = (e:any) => {
        setPrice(e.target.value);
    };

    const handleContact = (e:any) => {
        setContact(e.target.value);
    };


    const handleCheckbox = (e:any) => {
        const day: string = e.target.value;

        if (e.target.checked == true){
            recurringList.push(day);
        }else {
            // The splice method can be used to add or remove elements from an array. The first argument specifies the location at which to begin adding or removing elements. The second argument specifies the number of elements to remove. 
            let index:number = recurringList.indexOf(day);
            recurringList.splice(index,1);
        }
        console.log(recurringList);

        return recurringList;
    };

    const onShowOneTimeTrip = (e:any) => {
        if (e.target.checked == true){
            setShowOneTimeTrip(true);
            setRecurrence(false);
        }
    };

    const onShowRecurrence = (e:any) => {
        if (e.target.checked == true){
            setShowOneTimeTrip(false);
            setRecurrence(true);
        }
    };

    let navigate = useNavigate(); 
      const routeChange = () =>{ 
        let path = "/"; 
        navigate(path);
    }

    function onSubmitResponse(responseText:any) {
        routeChange();
        getJSONData(RETREIVE_SCRIPT, onResponse, onError);
        setLoading(false);
    }
        
    function onSubmitError() {
            console.log("Error - an issue occurrred with AJAX data transmission");
    }

    const onAdd = (e:any) => {
        if (origin == null || destination == null){
            setWarningMessage("Please enter valid address");
        } else {
            setWarningMessage("");
            const current = new Date();
    
            setLoading(true);
            console.log(recurringList);
            console.log(destination);
    
            let sendJSON:Object = 
            {
                "name": name,
                "origin": origin,
                "destination":destination,
                "originVicinity":originVicinity,
                "destinationVicinity":destinationVicinity,
                "originDisplay": originDisplay,
                "destinationDisplay":destinationDisplay,
                "departureDate":oneTimeDepartureDate,
                "returnDate":oneTimeReturnDate,
                "recurrence":recurringList,
                "departureTime":departureTime,
                "returnTime":returnTime,
                "smoking":smoking,
                "emptySeats":emptySeats,
                "price":price,
                "tripDescription":tripDescription,
                "contact":contact,
                "postDate":current.toLocaleString(),
                "comments":[]
            };
            
            let sendString:string = JSON.stringify(sendJSON);        
            sendJSONData(POST_SCRIPT_RIDES, sendString, onSubmitResponse, onSubmitError, "POST");
        }

    }; 

    $("[type='number']").keypress(function (e:any) {
        e.preventDefault();
    });

    // ---------------------------------- google map
    if (!isLoaded) {
    return <div />
    }
    
    async function calculateRoute() {
    if (origin == null || destination == null) {
            setWarningMessage("Please enter valid address")
        return
        } else {
            try {
                setWarningMessage("")
                console.log("test>>>>>" + origin + " to " + destination)
                // eslint-disable-next-line no-undef
                const directionsService = new google.maps.DirectionsService()
                const results = await directionsService.route({
                origin: origin,
                destination: destination,
                // eslint-disable-next-line no-undef
                travelMode: google.maps.TravelMode.DRIVING,
                })
                setDirectionsResponse(results)
            if (results.routes[0].legs[0].distance != undefined && results.routes[0].legs[0].duration != undefined){
                setDistance(results.routes[0].legs[0].distance.text)
                setDuration(results.routes[0].legs[0].duration.text)
                } 
            } catch (error) {
                console.log(error);
                setWarningMessage("Your origin and destination do not have a drivable distance calculated.");
                // set the state varibles back to null to restrict user submit the form
                setOrigin(null);
                setDestination(null);
                throw error;
            }
            
        }
    }

    function clearRoute() {
        setDirectionsResponse(null)
        setDistance('')
        setDuration('')
        setOrigin('')
        setDestination('')
    }

    let originAutocomplete:any;
    let destinationAutocomplete:any;

    function onLoadOrigin(autocomplete:any) {
        if (autocomplete != null){
            originAutocomplete = autocomplete;
        }
    }

    function onLoadDestination(autocomplete:any) {
        destinationAutocomplete = autocomplete;
    }

    function onOriginChanged() {
        if (originAutocomplete != null) {
            //variable to store the result
            let place = originAutocomplete.getPlace();
            //variable to store the formatted address from place details result
            let formattedAddress = place.name;
            let vicinity = place.vicinity;
            console.log(vicinity)
            setOrigin(formattedAddress);
            setOriginVicinity(vicinity);
        } 
    }

    function onDestinationChanged() {
        if (destinationAutocomplete != null) {
            //variable to store the result
            let place = destinationAutocomplete.getPlace();
            let vicinity = place.vicinity;
            //variable to store the formatted address from place details result
            let formattedAddress = place.name;
            console.log(vicinity)
            setDestination(formattedAddress);
            setDestinationVicinity(vicinity);
        } 
    }

      
    function showSearchOrigin(e:any) {
        setShowOriginInput(true);
        $('#routeForm').addClass("-z-50")
    }
    function showSearchDestination(e:any) {
        setShowDestinationInput(true);
        $('#routeForm').addClass("-z-50")
    }
    
    const originInput = document.getElementById("originInput") as HTMLInputElement;
    const destinationInput = document.getElementById("destinationInput") as HTMLInputElement;
    
    const options = {
        strictBounds: false
    };

    const originautocomplete = new google.maps.places.Autocomplete(originInput, options);

    originautocomplete.addListener("place_changed", () => {
        const place = originautocomplete.getPlace();
        let formattedAddress:any = place.formatted_address;
        console.log(place.formatted_address)
        setOrigin(formattedAddress);
        console.log(place);
        setOriginDisplay(place.name)
        let vicinity = place.vicinity;
        console.log(vicinity)
        setOrigin(formattedAddress);
        setOriginVicinity(vicinity);
        setShowOriginInput(false);
        $('#routeForm').removeClass("-z-50")
    });

    const destinationautocomplete = new google.maps.places.Autocomplete(destinationInput, options);

    destinationautocomplete.addListener("place_changed", () => {
        const place = destinationautocomplete.getPlace();
        let formattedAddress:any = place.formatted_address;
        console.log(place.formatted_address)
        setDestination(formattedAddress);
        console.log(place);
        let vicinity = place.vicinity;
        console.log(vicinity)
        setDestinationDisplay(place.name)
        setDestination(formattedAddress);
        setDestinationVicinity(vicinity);
        setShowDestinationInput(false);
        $('#routeForm').removeClass("-z-50")
    });

    let today = new Date().toISOString().split('T')[0];
    $("#departureDate").attr('min', today);
    $("#returnDate").attr('min', today);
      

    // ---------------------------------- render to the DOM
    return(
        <div className='flex flex-col relative'>

            <div className="flex items-baseline justify-between ">
                <Link to={"/"} className="font-bold text-2xl pb-10 text-orange-500 hover:text-orange-400">Nova Scotia Carpool</Link>
                <div className="flex flex-row items-baseline">
                    <Link to={"/postRide"} className=""><div className="mr-3"><i className="fa-solid fa-plus mr-1"></i>Post</div></Link>
                    <Link to={"/findRide"} className=""><div><i className="fa-solid fa-magnifying-glass mr-1"></i>Search</div></Link>
                </div>
            </div>

            <div className="font-bold text-2xl pb-2.5">Offer a New Ride</div>
            <div className="text-xl pb-2.5">Cover your driving costs by filling your seats when you’re driving from A to B.</div>
            
            <hr className="mt-10 mb-5"/>

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

            <div className='flex flex-col lg:flex-row justify-between bg-orange-100 p-8 rounded-lg mb-3'  id='routeForm'>
                <div className='flex flex-col lg:w-[60%] pr-2'>
                    <div className="font-bold text-xl pb-2.5">Route</div>
                    <div className="text-s pb-2.5">Your origin, destination, and stops you're willing to make along the way</div>

                    {/* Origin and Destination Display */}
                    <button className="text-[#000] border-solid m-1 p-2 hover:opacity-50 max-w-md rounded border-black border-2 text-left truncate bg-white" onClick={showSearchOrigin}><i className="fa-sharp fa-solid fa-location-dot pr-2"></i>{originDisplay}</button>

                    <button className="text-[#000] border-solid m-1 p-2 hover:opacity-50 max-w-md  rounded border-black border-2 text-left truncate bg-white" onClick={showSearchDestination}><i className="fa-sharp fa-solid fa-location-dot pr-2"></i>{destinationDisplay}</button>
                </div>

                {/* Google Map div */}
                <div className='flex flex-col mt-2 lg:w-[40%]'>          
                    <div className=' h-[200px] w-[100%]'>
                        <GoogleMap
                            center={center}
                            zoom={15}
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            options={{
                            zoomControl: false,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                            }}
                            onLoad={map => setMap(map)}
                        >
                            <Marker position={center} />
                            {directionsResponse && (
                            <DirectionsRenderer directions={directionsResponse} />
                            )}
                        </GoogleMap>
                    </div>
                
                    <div>{warningMessage}</div>

                    <button className='bg-black text-[#FFF] border-0 mr-1 mt-1 p-1 hover:opacity-80 w-[150px] rounded' type='submit' onClick={calculateRoute}>
                        Calculate Route
                    </button>

                    <div>
                        <div>Distance: {distance} </div>
                        <div>Duration: {duration} </div>
                    </div> 
                </div>
            </div>

            <div className='flex flex-col lg:flex-row justify-between bg-orange-200 p-8 rounded-lg mb-3'>
                <div>
                    <div className="font-bold text-xl pb-2.5">Trip Details</div>

                    <div className='flex flex-row'>
                        <div className=' flex flex-row items-center'>
                            <input type="radio" id="oneTime" name="category" onClick={onShowOneTimeTrip} className="w-5 h-5 mr-2" defaultChecked/>
                            <label className='text-l'>One-Time Trip</label><br/>
                        </div>

                        <div className='ml-2 flex flex-row items-center'>
                            <input type="radio" id="Recurrence" name="category" onClick={onShowRecurrence} className="w-5 h-5 mr-2"/>
                            <label className='text-l'>Recurrence</label><br></br>
                        </div>
                    </div>

                    

                    <div style={{display: (showOneTimeTrip ? 'block' : 'none')}}>
                        <div className='flex flex-row mt-1 items-center'>
                            <div><label className="form__label" >Departure:</label></div>
                            <div><input className="text-[#000] border-solid ml-1  max-w-md rounded border-black border-2 text-left" type="date" onChange={handleOneTimeDepartureDate} id="departureDate"/></div>
                            <span className='ml-2 mr-2'>at</span>
                            <div><input className="text-[#000] border-solid ml-1  max-w-md rounded border-black border-2 text-left" type="time" onChange={handleDepartureTime}/></div>
                        </div>

                        <div className='flex flex-row mt-1 items-center'>
                            <div><label className="form__label" >Return(optional):</label></div>
                            <div><input className="text-[#000] border-solid ml-1  max-w-md rounded border-black border-2 text-left" type="date" onChange={handleOneTimeReturnDate} id="returnDate"/></div>
                            <span className='ml-2 mr-2'>at</span>
                            <div><input className="text-[#000] border-solid ml-1  max-w-md rounded border-black border-2 text-left" type="time" onChange={handleReturnTime}/></div>
                        </div>
                    </div>
                    

                    <div className="mt-2 flex flex-row" style={{display: (showRecurrence ? 'flex' : 'none')}}>
                        <div className=''><label>Mon<input type="checkbox" onClick={handleCheckbox} value="Monday" className='ml-1'/></label></div>
                        <div className='ml-2'><label>Tue<input type="checkbox" onClick={handleCheckbox} value="Tuesday" className='ml-1'/></label></div>
                        <div className='ml-2'><label>Wed<input type="checkbox" onClick={handleCheckbox} value="Wednesday" className='ml-1'/></label></div>
                        <div className='ml-2'><label>Thur<input type="checkbox" onClick={handleCheckbox} value="Thursday" className='ml-1'/> </label></div>
                        <div className='ml-2'><label>Fri<input type="checkbox" onClick={handleCheckbox} value="Friday" className='ml-1'/> </label></div>
                        <div className='ml-2'><label>Sat<input type="checkbox" onClick={handleCheckbox} value="Saturday" className='ml-1'/> </label></div>
                        <div className='ml-2'><label>Sun<input type="checkbox" onClick={handleCheckbox} value="Sunday" className='ml-1'/> </label></div>
                    </div>
                </div>

                <div>
                    <div><label>Smoking<input type="checkbox" onClick={handleSmoking} className="ml-2"/></label></div>

                    <div><label className="form__label" >Empty Seats:</label></div>
                    <div><input className="text-[#000] border-solid max-w-md rounded border-black border-2 text-left" type="number" onChange={handleEmptySeats} value={emptySeats} min="1" max="7"/></div>

                    <div><label className="form__label" >Price:</label></div>
                    <div><input className="text-[#000] border-solid max-w-md rounded border-black border-2 text-left" type="text" onChange={handlePrice} value={price}/></div>
                </div>

            </div>

            <div className='flex flex-col justify-between bg-orange-300 p-8 rounded-lg mb-3'>
                <div className="font-bold text-xl pb-2.5">Driver Details</div>

                <div><label className="form__label" >Your Name:</label></div>
                <div><input className="text-[#000] border-solid max-w-md rounded border-black border-2 text-left" type="text" onChange={handleName} value={name} maxLength={100}/></div>

                <div><label className="form__label" >Contact Number:</label></div>
                <div><input className="text-[#000] border-solid max-w-md rounded border-black border-2 text-left" type="email" onChange={handleContact} value={contact} maxLength={100}/></div>

                <div><label className="form__label" >Notes:</label></div>
                <div><textarea className="text-[#000] border-solid max-w-md rounded border-black border-2 text-left" rows={3} cols={60} onChange={handleTripDescription} value={tripDescription}/></div>
            </div>

            <div className="flex flex-row mt-3">
                <div>
                    <button className={(origin == null || destination == null || name == "" ||  contact == "" || oneTimeDepartureDate == "") ? "bg-gray-200 text-[#FFF] border-0 mr-1 p-5 w-[150px] rounded-full" :"bg-black text-[#FFF] border-0 mr-1 p-5 hover:opacity-80 w-[150px] rounded-full"} onClick={onAdd} disabled={(origin == null || destination == null || name == "" ||  contact == "" || oneTimeDepartureDate == "") ? true : false}>Post</button>
                </div>

                {/* <div>
                    <Link to={"/"}><button className="bg-sky-500/50 text-[#FFF] border-0 mr-1 p-5 hover:opacity-80 w-[150px] rounded-full">Back</button></Link>
                </div> */}
            </div>

        </div>
    );
}

export default PostRide;