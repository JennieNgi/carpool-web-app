import React from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { ViewRideComponentProps, Ride, Comment } from "./../Tools/data.model"
import { getJSONData, sendJSONData} from "./../Tools/Toolkit";
import { Link } from 'react-router-dom'; 
import $ from 'jquery';


const EditTechnology = ({rides,onResponse,onError,RETREIVE_SCRIPT,setLoading}:ViewRideComponentProps) => {

    let { id } = useParams<{id:string}>();

    let ride:(Ride | undefined) = rides.find(item => item._id === id);

    //const COMMENT_SCRIPT_RIDES:string = "http://localhost/commentRide";
    const COMMENT_SCRIPT_RIDES:string = '/commentRide';

    const [comment, setComment] = React.useState("");
    const [author, setAuthor] = React.useState("");
    const [warningMessage, setWarningMessage] = React.useState("");

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
      let path = `/viewRide/${id}`; 
      navigate(path);
  }

    const handleCommentChange = (e:any) => {
        setComment(e.target.value);
    };

    const handleAuthorChange = (e:any) => {
        setAuthor(e.target.value);
    };


    function onSubmitResponse(responseText:any) {
        routeChange();
        getJSONData(RETREIVE_SCRIPT, onResponse, onError);
        setLoading(false);
    }
        
    function onSubmitError(e:any) {
        console.log("Error - an issue occurrred with AJAX data transmission");
    }

    const onSubmitComment = (e:any) => {
        let current = new Date();

        let sendJSON:Object = 
        {
            "rideID": ride != undefined ? ride._id : "",
            "comment": comment,
            "author": author,
            "commentDate":current.toLocaleString()
        };
        

        setLoading(true);
        let sendString:string = JSON.stringify(sendJSON);
        console.log(sendString);
        
        sendJSONData(COMMENT_SCRIPT_RIDES, sendString, onSubmitResponse, onSubmitError, "PUT");

        setAuthor("");
        setComment("");
        setWarningMessage("");

};   


    // ---------------------------------- render to the DOM
    return(
        (rides !== undefined) ? 
        <div>
            <div className="flex items-baseline justify-between ">
                <Link to={"/"} className="font-bold text-2xl pb-10 text-orange-500 hover:text-orange-400">Nova Scotia Carpool</Link>
                <div className="flex flex-row items-baseline">
                    <Link to={"/postRide"} className=""><div className="mr-3"><i className="fa-solid fa-plus mr-1"></i>Post</div></Link>
                    <Link to={"/findRide"} className=""><div><i className="fa-solid fa-magnifying-glass mr-1"></i>Search</div></Link>
                </div>
            </div>

            <div className='bg-orange-100 rounded-xl p-5'>

                <div className='text-xl font-semibold'><i className="fa-solid fa-user mr-2 bg-slate-100 p-5 rounded-full border-solid border-2"></i>{ride?.name}</div>
                <div className='text-slate-400 mt-1'>Posted on {ride?.postDate}</div>
                <div><i className="fa-solid fa-phone mr-2"></i>{ride?.contact}</div>

                <div className='text-2xl font-bold text-cyan-500 mb-2 mt-8'>{ride?.originDisplay} <i className="fa-solid fa-arrow-right text-cyan-400"></i><i className="fa-solid fa-arrow-right text-cyan-400"></i><i className="fa-solid fa-arrow-right text-cyan-400"></i> {ride?.destinationDisplay}</div>

                <div className='flex justify-around flex-col md:flex-row'>
                    <div className='md:w-[50%]'>
                        {ride?.departureDate !== null ?<div className='font-semibold mb-3'>Leaving on {ride?.departureDate} {ride?.departureTime}</div>:<div></div> }

                        <div className='mt-1 mb-2'>
                            {(ride?.recurrence !== null)?
                                <div className='flex flex-row'>
                                    {ride?.recurrence.map((data:any, n:number)=>
                                        <div key={n}>
                                            <div className='bg-orange-400 rounded mr-2 p-1'>
                                                <div>{data}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                :
                                <div></div>
                            }
                        </div>
                        <div className='flex flex-row items-center'>Origin:<div className='ml-2'>{ride?.origin}</div></div>
                        <div className='flex flex-row items-center'>Destination:<div className='ml-2'>{ride?.destination}</div></div>

                        {ride?.tripDescription !== null || ride?.tripDescription !== "" ?<div className='border-solid border-2 p-5 mt-3'>{ride?.tripDescription}</div>:<div className='border-solid border-2 p-5 mt-3'>No messages from the author...</div> }
                    </div>

                    <div className='mt-2 md:w-[50%] md:text-right font-bold'>
                        <div>${ride?.price} per seat</div>
                        
                        {ride?.emptySeats !== "1" ?<div>{ride?.emptySeats} empty seats</div>:<div>{ride?.emptySeats} empty seat</div>}

                        {ride?.smoking == false ?<div><i className="fa-solid fa-xmark text-rose-600 mr-2"></i>Smoking</div>:<div><i className="fa-solid fa-check text-green-400 mr-2"></i>Smoking</div> }

                    </div>
                </div>
            </div>
            
             {/* Comment count */}
             {ride?.comments.length !== 1 ?
             <div className='text-right text-neutral-400 mt-5'>{ride?.comments.length} comments</div>:<div className='text-right text-neutral-400 mt-5'>{ride?.comments.length} comment</div>}

            <hr className='mt-0 mb-3'/>

            {/* Comment display */}
            <div className='pl-20 mb-10'>
                {(ride?.comments !== null)?
                <div>
                    {ride?.comments.map((data:Comment, n:number)=>
                    <div key={n} >
                        <div className="flex flex-row items-center">
                            <i className="fa-solid fa-comment mr-5 text-5xl text-stone-400"></i>


                            <div>
                                <div className='font-bold text-lg text-blue-500'>{data.author}</div>
                                <div className='text-sm text-neutral-500'>Commented on {data.commentDate}</div>
                                <div className='mt-2'>{data.comment}</div>
                            </div>
                        </div>
                        <hr className='mt-5 mb-3'/>
                    </div>

                )}
                </div>
                :<div></div>
                }
            </div>
            
            {/* Comment Form */}
            <div className="form flex flex-row">
            
                <div className="text-[#000] border-solid mr-1 p-2 w-[10%] rounded border-2 text-left" ><input className="focus:outline-none bg-white w-full" type="text" onChange={handleAuthorChange} value={author} placeholder="Your Name"/></div>
                
                <div className='text-[#000] border-solid mr-1 p-2 w-[90%] rounded border-2 bg-slate-50 flex flex-row justify-between'>
                    <input placeholder="Leave Your Comment Here..." className = "focus:outline-none bg-slate-50 w-full" onChange={handleCommentChange} value={comment} maxLength={200} ></input>
                    <button disabled={(author == "" || comment == "") ? true : false} id="btnSubmit" onClick={onSubmitComment} className="font-[1100]"><i className="fa-solid fa-play text-slate-500"></i></button>
                </div>

            </div>

            {/* Back button */}
            {/* <Link to={"/"}><button className="bg-sky-500/50 text-[#FFF] border-0 mt-10 mr-1 p-5 hover:opacity-80 w-[150px] rounded-full">Back</button></Link> */}

        </div>
        
        
        
        
        :
        <div>
            <div className="pt-2">
                <div className="font-bold"><i className="fas fa-arrow-left content__button pr-2 text-xl hover:text-accent"></i>Error :(</div>
                <div className="max-w-3xl pb-4">The requested rides doesn't exist</div>
            </div>
        </div>
    )
    ;
}

export default EditTechnology;