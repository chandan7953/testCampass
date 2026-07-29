import { useEffect, useState } from "react";

import {
  Plus,
  MapPin,
  Users,
  Trash2,
  Edit,
  Building2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../api/axios";



const ManageVenues = () => {


  const navigate = useNavigate();


  const [venues,setVenues] =
  useState([]);


  const [loading,setLoading] =
  useState(true);




  useEffect(()=>{

    fetchVenues();

  },[]);





  const fetchVenues = async()=>{

    try{

      setLoading(true);


      const res =
      await api.get("/venues");


      setVenues(
        res.data.data
      );


    }catch(error){

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch venues"
      );

    }
    finally{

      setLoading(false);

    }

  };






  const deleteVenue = async(id)=>{




    try{


      await api.delete(
        `/venues/${id}`
      );


      toast.success(
        "Venue deleted successfully"
      );


      fetchVenues();


    }catch(error){

      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );

    }

  };






  if(loading){

    return(

      <div
        className="
          py-20
          text-center
          text-gray-400
        "
      >
        Loading venues...
      </div>

    );

  }





  return (

    <div
      className="
        mx-auto
        max-w-6xl
        space-y-6
      "
    >


      {/* Header */}


      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >


        <div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <Building2
              size={28}
              className="
                text-blue-400
              "
            />


            <h1
              className="
                text-2xl
                font-bold
                text-white
              "
            >
              Manage Venues
            </h1>

          </div>


          <p
            className="
              mt-2
              text-sm
              text-gray-400
            "
          >
            Add and manage event locations
          </p>


        </div>





        <button
          onClick={()=>
            navigate("/admin/venues/add")
          }
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-blue-700
          "
        >

          <Plus size={18}/>

          Add Venue

        </button>


      </div>







      {
        venues.length === 0 ?

        (

          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-10
              text-center
              backdrop-blur-xl
            "
          >

            <Building2
              size={45}
              className="
                mx-auto
                mb-3
                text-gray-500
              "
            />


            <p
              className="
                text-gray-400
              "
            >
              No venues available
            </p>


          </div>

        )


        :

        (

          <div
            className="
              grid
              gap-5
              md:grid-cols-2
            "
          >


          {
            venues.map((venue)=>(


              <div
                key={venue._id}
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/5
                  p-6
                  backdrop-blur-xl
                  transition
                  hover:bg-white/10
                "
              >



                {/* Title */}


                <div
                  className="
                    flex
                    items-start
                    justify-between
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-500/20
                      "
                    >

                      <Building2
                        size={22}
                        className="
                          text-blue-400
                        "
                      />

                    </div>



                    <div>

                      <h2
                        className="
                          font-semibold
                          text-white
                        "
                      >
                        {venue.name}
                      </h2>


                      <p
                        className="
                          text-sm
                          text-gray-400
                        "
                      >
                        {venue.collegeName}
                      </p>


                    </div>


                  </div>


                </div>





                {/* Details */}


                <div
                  className="
                    mt-5
                    space-y-3
                  "
                >


                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-sm
                      text-gray-300
                    "
                  >

                    <MapPin
                      size={17}
                      className="
                        text-green-400
                      "
                    />

                    {venue.address}

                  </div>





                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-sm
                      text-gray-300
                    "
                  >

                    <Users
                      size={17}
                      className="
                        text-purple-400
                      "
                    />

                    {venue.capacity} seats

                  </div>


                </div>






                {/* Facilities */}


                {
                  venue.facilities?.length > 0 &&

                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      gap-2
                    "
                  >

                  {
                    venue.facilities.map(
                      (item,index)=>(

                      <span
                        key={index}
                        className="
                          rounded-full
                          bg-white/10
                          px-3
                          py-1
                          text-xs
                          text-gray-300
                        "
                      >
                        {item}
                      </span>

                    ))
                  }


                  </div>

                }






                {/* Actions */}


                <div
                  className="
                    mt-6
                    flex
                    gap-3
                  "
                >


                  <button
                    onClick={()=>
                      navigate(
                        `/admin/venues/edit/${venue._id}`
                      )
                    }
                    className="
                      flex
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      py-2.5
                      text-sm
                      text-gray-300
                      hover:bg-white/10
                    "
                  >

                    <Edit size={16}/>

                    Edit

                  </button>





                  <button
                    onClick={()=>
                      deleteVenue(
                        venue._id
                      )
                    }
                    className="
                      flex
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-red-500/10
                      py-2.5
                      text-sm
                      text-red-400
                      hover:bg-red-500/20
                    "
                  >

                    <Trash2 size={16}/>

                    Delete

                  </button>


                </div>




              </div>


            ))
          }


          </div>

        )

      }



    </div>

  );

};


export default ManageVenues;