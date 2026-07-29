import { useEffect, useState } from "react";

import {
  Building2,
  MapPin,
  Users,
  Plus,
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../api/axios";



const CreateVenue = () => {


  const navigate = useNavigate();

  const { id } = useParams();


  const isEditMode = Boolean(id);



  const [loading, setLoading] =
    useState(false);



  const [formData, setFormData] =
    useState({

      name: "",
      address: "",
      collegeName: "",
      capacity: "",
      facilities: "",
      latitude: "",
      longitude: "",

    });





  useEffect(() => {

    if (isEditMode) {

      fetchVenue();

    }

  }, [id]);







  const fetchVenue = async () => {

    try {


      const res =
        await api.get(
          `/venues/${id}`
        );


      const venue =
        res.data.data;



      setFormData({

        name:
          venue.name || "",


        address:
          venue.address || "",


        collegeName:
          venue.collegeName || "",


        capacity:
          venue.capacity || "",


        facilities:
          venue.facilities
            ?
            venue.facilities.join(", ")
            :
            "",


        latitude:
          venue.latitude || "",


        longitude:
          venue.longitude || "",

      });



    } catch (error) {


      toast.error(
        "Failed to load venue"
      );


    }

  };









  const handleChange = (e) => {


    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });


  };









  const handleSubmit = async (e) => {


    e.preventDefault();



    try {


      setLoading(true);



      const data = {


        name:
          formData.name,


        address:
          formData.address,


        collegeName:
          formData.collegeName,


        capacity:
          Number(formData.capacity),



        facilities:
          formData.facilities
            .split(",")
            .map(item => item.trim())
            .filter(Boolean),




        latitude:
          formData.latitude
            ?
            Number(formData.latitude)
            :
            undefined,



        longitude:
          formData.longitude
            ?
            Number(formData.longitude)
            :
            undefined,


      };







      if (isEditMode) {


        await api.put(

          `/venues/${id}`,

          data

        );


        toast.success(
          "Venue updated successfully"
        );


      }
      else {


        await api.post(

          "/venues",

          data

        );


        toast.success(
          "Venue created successfully"
        );


      }






      navigate(
        "/admin/venues"
      );




    } catch (error) {


      toast.error(

        error.response?.data?.message ||
        "Something went wrong"

      );


    }
    finally {


      setLoading(false);


    }


  };









  return (

    <div
      className="
        mx-auto
        max-w-3xl
        space-y-6
      "
    >




      {/* Back */}


      <button

        onClick={() =>
          navigate(-1)
        }

        className="
          flex
          items-center
          gap-2
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

        <ArrowLeft size={17} />

        Back

      </button>









      {/* Header */}


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



        <div>


          <h1
            className="
              text-2xl
              font-bold
              text-white
            "
          >

            {
              isEditMode
                ?
                "Edit Venue"
                :
                "Create Venue"
            }

          </h1>




          <p
            className="
              text-sm
              text-gray-400
            "
          >

            {
              isEditMode
                ?
                "Update venue details"
                :
                "Add a new event location"
            }

          </p>



        </div>


      </div>









      {/* Form */}



      <form

        onSubmit={handleSubmit}

        className="
          space-y-5
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-6
          backdrop-blur-xl
        "

      >






        <Input

          icon={Building2}

          label="Venue Name"

          name="name"

          value={formData.name}

          onChange={handleChange}

          placeholder="Main Auditorium"

        />







        <Input

          icon={Building2}

          label="College Name"

          name="collegeName"

          value={formData.collegeName}

          onChange={handleChange}

          placeholder="ABC College"

        />







        <Input

          icon={MapPin}

          label="Address"

          name="address"

          value={formData.address}

          onChange={handleChange}

          placeholder="Pune, Maharashtra"

        />







        <Input

          icon={Users}

          label="Capacity"

          name="capacity"

          type="number"

          value={formData.capacity}

          onChange={handleChange}

          placeholder="500"

        />









        {/* Facilities */}


        <div>


          <label

            className="
              mb-2
              block
              text-sm
              text-gray-400
            "

          >

            Facilities

          </label>




          <input


            name="facilities"


            value={formData.facilities}


            onChange={handleChange}


            placeholder="Parking, AC, Projector"


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



          <p
            className="
              mt-2
              text-xs
              text-gray-500
            "
          >

            Separate facilities using commas

          </p>


        </div>









        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
          "
        >



          <Input

            label="Latitude"

            name="latitude"

            value={formData.latitude}

            onChange={handleChange}

            placeholder="18.5204"

          />




          <Input

            label="Longitude"

            name="longitude"

            value={formData.longitude}

            onChange={handleChange}

            placeholder="73.8567"

          />



        </div>









        <button

          disabled={loading}

          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            py-3
            font-semibold
            text-white
            hover:bg-blue-700
            disabled:opacity-50
          "

        >


          <Plus size={18} />



          {
            loading
              ?
              "Saving..."
              :
              isEditMode
                ?
                "Update Venue"
                :
                "Create Venue"
          }



        </button>





      </form>



    </div>

  );


};









const Input = ({
  icon: Icon,
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




      <div
        className="
relative
"
      >


        {
          Icon &&

          <Icon

            size={18}

            className="
absolute
left-3
top-3.5
text-gray-500
"

          />

        }





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
pl-10
text-white
outline-none
placeholder:text-gray-500
focus:border-blue-500
"

        />



      </div>


    </div>

  );


};




export default CreateVenue;