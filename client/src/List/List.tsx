import React from 'react';
import { ListComponentProps, Ride } from "./../Tools/data.model"
import { Link } from 'react-router-dom';

const List = ({rides}:ListComponentProps) => {

    // ---------------------------------- render to the DOM
    return(
        <div>
            <div className="flex items-baseline justify-between ">
                <Link to={"/"} className="font-bold text-2xl pb-10 text-orange-500 hover:text-orange-400">Nova Scotia Carpool</Link>
                <div className="flex flex-row items-baseline">
                    <Link to={"/postRide"} className=""><div className="mr-3"><i className="fa-solid fa-plus mr-1"></i>Post</div></Link>
                    <Link to={"/findRide"} className=""><div><i className="fa-solid fa-magnifying-glass mr-1"></i>Search</div></Link>
                </div>
            </div>
       
            <div className="md:p-10 md:flex-row flex flex-col bg-orange-300 rounded-[30px] mb-3 shadow-gray-600 shadow-md">
                <div className='p-3 flex flex-col md:w-[50%] md:p-10 bg-sky-500/50 rounded-[30px] m-5 hover:scale-110'>
                    <h1 className='p-2 text-2xl'>Offer a Ride? <i className="fa-regular fa-car-side"></i></h1>
                    <div className='p-2'>Post empty seats and collect money to cover your driving costs.</div>
                    <Link  className='p-2'to={"/postRide"}><button className="bg-black text-[#FFF] border-0 mr-1 p-5 hover:opacity-80 w-[150px] rounded-full ">Post a Ride</button></Link>
                </div>
                <div className='p-3 flex flex-col md:w-[50%] md:p-10 bg-white/50 rounded-[30px] m-5 hover:scale-110'>
                    <h1 className='p-2 text-2xl'>Need a Ride? <i className="fa-solid fa-car"></i></h1>
                    <div className='p-2'>Find a ride and carpool anywhere in Nova Scotia.</div>
                    <Link  className='p-2'to={"/findRide"}><button className="bg-black text-[#FFF] border-0 mr-1 p-5 hover:opacity-80 w-[150px] rounded-full ">Find a Ride</button></Link>
                </div>
            </div>

            <img src="https://cdn.pixabay.com/photo/2021/09/07/11/53/car-6603726_960_720.jpg" alt="Girl in a jacket" className='w-full mb-3'></img>

            <div className='border-solid p-5 rounded border-black border-8'>

                <div className="flex justify-center items-center">
                    <h1 className="font-bold text-2xl pb-10">Recent Carpools</h1>
                </div>

                <div className="">
                    {rides.map((data:Ride, n:number)=>
                        <Link target="_blank" to={`/viewRide/${data._id}`} className='p-3 font-bold text-lg'>
                            <div key={n} className="flex flex-col border-solid p-2 rounded border-slate-300 border  shadow-gray-600 shadow-md hover:border-slate-700">
                                <div className='flex justify-between p-3'>
                                    <div className='text-neutral-600'>Posted on {data.postDate}</div>
                                    <div className="">${data.price} per seat</div>
                                </div>
                                <div className='p-2 font-bold text-lg text-green-500'>{data.originDisplay} to {data.destinationDisplay}</div>

                                <hr />
                                
                                <div className='font-bold p-3'><i className="fa-solid fa-user bg-slate-100 p-2 rounded-full border-solid border-2"></i> {data.name}</div>
                            </div>
                        </Link>

                    )}
                </div>
            </div>

                
        </div>
    );
}

export default List;