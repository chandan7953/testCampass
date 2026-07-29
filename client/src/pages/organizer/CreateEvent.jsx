import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../api/axios";



const CreateEvent = () => {


  const navigate = useNavigate();


  const { eventId } = useParams();


  const isEdit = Boolean(eventId);




  const [loading,setLoading] =
  useState(false);


  const [pageLoading,setPageLoading] =
  useState(false);



  const [categories,setCategories] =
  useState([]);



  const [venues,setVenues] =
  useState([]);



  const [poster,setPoster] =
  useState(null);



  const [preview,setPreview] =
  useState("");




  const [formData,setFormData] =
  useState({

    title:"",

    description:"",

    category:"",

    venue:"",

    startDate:"",

    endDate:"",

    capacity:"",

  });







  useEffect(()=>{


    loadData();


  },[]);







  const loadData = async()=>{


    await fetchCategories();


    await fetchVenues();



    if(isEdit){

      await fetchEvent();

    }


  };







  const fetchCategories = async()=>{


    try{


      const res =
      await api.get(
        "/categories"
      );


      setCategories(
        res.data.data.categories || []
      );


    }
    catch(error){

      console.log(error);

    }


  };








  const fetchVenues = async()=>{


    try{


      const res =
      await api.get(
        "/venues"
      );


      setVenues(
        res.data.data || []
      );


    }
    catch(error){

      console.log(error);

    }


  };







  const fetchEvent = async()=>{


    try{


      setPageLoading(true);



      const res =
      await api.get(
        `/events/${eventId}`
      );



      const event =
      res.data.data;



      setFormData({

        title:
        event.title || "",


        description:
        event.description || "",


        category:
        event.category?._id ||
        event.category ||
        "",


        venue:
        event.venue?._id ||
        event.venue ||
        "",


        startDate:
        event.startDate
        ?
        event.startDate.slice(0,16)
        :
        "",


        endDate:
        event.endDate
        ?
        event.endDate.slice(0,16)
        :
        "",


        capacity:
        event.capacity || "",


      });





      if(event.poster){

        setPreview(
          event.poster
        );

      }



    }
    catch(error){


      toast.error(
        "Failed to load event"
      );


    }
    finally{


      setPageLoading(false);


    }


  };







  const handleChange=(e)=>{


    setFormData({

      ...formData,


      [e.target.name]:
      e.target.value,

    });


  };








  const handlePosterChange=(e)=>{


    const file =
    e.target.files[0];



    if(!file)
      return;



    setPoster(file);



    setPreview(
      URL.createObjectURL(file)
    );


  };

    const handleSubmit = async(e)=>{


    e.preventDefault();


    try{


      setLoading(true);



      const data =
      new FormData();



      data.append(
        "title",
        formData.title
      );



      data.append(
        "description",
        formData.description
      );



      data.append(
        "category",
        formData.category
      );



      data.append(
        "venue",
        formData.venue
      );



      data.append(
        "startDate",
        formData.startDate
      );



      data.append(
        "endDate",
        formData.endDate
      );



      data.append(
        "capacity",
        formData.capacity
      );




      if(poster){

        data.append(
          "poster",
          poster
        );

      }







      if(isEdit){



        await api.put(

          `/events/${eventId}`,

          data

        );



        toast.success(
          "Event updated successfully"
        );


      }
      else{


        await api.post(

          "/events",

          data

        );



        toast.success(
          "Event created successfully"
        );


      }






      navigate(
        "/organizer/events"
      );



    }
    catch(error){


      toast.error(

        error.response?.data?.message ||

        "Something went wrong"

      );


    }
    finally{


      setLoading(false);


    }


  };








  if(pageLoading){


    return (

      <div
      className="
      py-20
      text-center
      text-gray-400
      "
      >

        Loading Event...

      </div>

    );


  }







  return (

    <div
    className="
    mx-auto
    max-w-4xl
    space-y-6
    "
    >




      {/* Back Button */}


      <button

      onClick={()=>
        navigate(-1)
      }

      className="
      rounded-xl
      border
      border-white/10
      bg-white/5
      px-4
      py-2
      text-sm
      text-gray-300
      hover:bg-white/10
      "

      >

        ← Back

      </button>







      {/* Header */}


      <div>


        <h1
        className="
        text-3xl
        font-bold
        text-white
        "
        >

          {
            isEdit
            ?
            "Edit Event"
            :
            "Create Event"
          }


        </h1>



        <p
        className="
        mt-1
        text-gray-400
        "
        >

          {
            isEdit
            ?
            "Update event details"
            :
            "Create a new campus event"
          }

        </p>



      </div>








      <form

      onSubmit={handleSubmit}

      className="
      space-y-6
      rounded-3xl
      border
      border-white/10
      bg-white/5
      p-6
      backdrop-blur-xl
      "

      >







        {/* Poster */}



        <div>


          <label
          className="
          mb-2
          block
          text-sm
          text-gray-400
          "
          >

            Event Poster

          </label>



          <input

          id="poster"

          type="file"

          accept="image/*"

          onChange={handlePosterChange}

          className="hidden"

          />





          <label

          htmlFor="poster"

          className="
          flex
          h-64
          cursor-pointer
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border-2
          border-dashed
          border-white/10
          bg-black/20
          "

          >


          {
            preview ?

            (

              <img

              src={preview}

              alt="Poster"

              className="
              h-full
              w-full
              object-cover
              "

              />

            )

            :

            (

              <div
              className="
              text-center
              text-gray-400
              "
              >

                <p
                className="
                text-lg
                font-medium
                "
                >

                  Upload Poster

                </p>


                <p
                className="
                mt-2
                text-sm
                "
                >

                  JPG PNG WEBP

                </p>


              </div>

            )

          }



          </label>


        </div>









        {/* Title */}



        <Input

        label="Title"

        name="title"

        value={formData.title}

        onChange={handleChange}

        placeholder="Tech Fest 2026"

        />







        {/* Description */}



        <div>


        <label
        className="
        mb-2
        block
        text-sm
        text-gray-400
        "
        >

          Description

        </label>



        <textarea

        rows="5"

        name="description"

        value={formData.description}

        onChange={handleChange}

        placeholder="Event description..."

        className="
        w-full
        rounded-xl
        border
        border-white/10
        bg-black/20
        px-4
        py-3
        text-white
        outline-none
        focus:border-blue-500
        "

        />



        </div>
                {/* Category & Venue */}


        <div
        className="
        grid
        gap-5
        md:grid-cols-2
        "
        >


          <Select

          label="Category"

          name="category"

          value={formData.category}

          onChange={handleChange}

          options={categories}

          />



          <Select

          label="Venue"

          name="venue"

          value={formData.venue}

          onChange={handleChange}

          options={venues}

          />


        </div>








        {/* Date */}


        <div
        className="
        grid
        gap-5
        md:grid-cols-2
        "
        >



          <Input

          label="Start Date"

          type="datetime-local"

          name="startDate"

          value={formData.startDate}

          onChange={handleChange}

          />




          <Input

          label="End Date"

          type="datetime-local"

          name="endDate"

          value={formData.endDate}

          onChange={handleChange}

          />



        </div>








        {/* Capacity */}


        <Input

        label="Capacity"

        type="number"

        name="capacity"

        value={formData.capacity}

        onChange={handleChange}

        placeholder="500"

        />









        {/* Submit */}



        <button

        disabled={loading}

        className="
        w-full
        rounded-xl
        bg-blue-600
        py-3
        font-semibold
        text-white
        transition
        hover:bg-blue-700
        disabled:opacity-50
        "

        >

          {
            loading
            ?
            "Saving..."
            :
            isEdit
            ?
            "Update Event"
            :
            "Create Event"
          }


        </button>




      </form>


    </div>


  );


};










const Input = ({
  label,
  ...props
}) => {


return (

<div>


<label

className="
mb-2
block
text-sm
text-gray-400
"

>

{label}

</label>



<input

{...props}

className="
w-full
rounded-xl
border
border-white/10
bg-black/20
px-4
py-3
text-white
outline-none
placeholder:text-gray-500
focus:border-blue-500
"

/>



</div>

);


};









const Select = ({
label,
name,
value,
onChange,
options=[],
}) => {


return (

<div>


<label

className="
mb-2
block
text-sm
text-gray-400
"

>

{label}

</label>




<select

name={name}

value={value}

onChange={onChange}

className="
w-full
rounded-xl
border
border-white/10
bg-[#18181f]
px-4
py-3
text-white
outline-none
focus:border-blue-500
"

>


<option value="">

Select {label}

</option>



{

options.map((item)=>(


<option

key={item._id}

value={item._id}

>

{item.name}

</option>


))


}



</select>


</div>

);


};





export default CreateEvent;