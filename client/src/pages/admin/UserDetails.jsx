import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  UserCog,
  Calendar,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/Button";
import InfoCard from "../../components/InfoCard";


const UserDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();


  const [user, setUser] = useState(null);

  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);



  useEffect(() => {

    fetchUser();

  }, [id]);



  const fetchUser = async () => {

    try {

      setLoading(true);


      const res = await api.get(
        `/admin/users/${id}`
      );


      const userData = res.data.data;


      setUser(userData);

      setRole(userData.role);


    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch user"
      );

    }
    finally {

      setLoading(false);

    }

  };




  const handleRoleUpdate = async () => {

    try {

      setSaving(true);


      await api.patch(
        `/admin/users/${id}/role`,
        {
          role,
        }
      );


      toast.success(
        "Role updated successfully"
      );


      fetchUser();


    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to update role"
      );

    }
    finally {

      setSaving(false);

    }

  };




  const handleBlockToggle = async () => {

    try {

      setSaving(true);


      const endpoint =
        user.status === "blocked"
          ? `/admin/users/${id}/unblock`
          : `/admin/users/${id}/block`;



      await api.patch(endpoint);



      toast.success(
        user.status === "blocked"
          ? "User unblocked"
          : "User blocked"
      );


      fetchUser();


    } catch(error){

      toast.error(
        error.response?.data?.message ||
        "Action failed"
      );

    }
    finally{

      setSaving(false);

    }

  };




  if(loading){

    return (

      <div className="
        py-20
        text-center
        text-gray-400
      ">
        Loading user...
      </div>

    );

  }




  if(!user){

    return (

      <div className="
        py-20
        text-center
        text-white
      ">
        User not found
      </div>

    );

  }




  const initials =
    user.fullName
      ?.split(" ")
      .map(
        n => n[0]
      )
      .join("")
      .substring(0,2)
      .toUpperCase();




  return (

    <div className="
      mx-auto
      max-w-5xl
      space-y-6
    ">



      {/* Back */}

      <button

        onClick={() => navigate(-1)}

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
          transition
          hover:bg-white/10
          hover:text-white
        "

      >

        <ArrowLeft size={17}/>

        Back

      </button>





      {/* Profile */}


      <div
        className="
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-6
          backdrop-blur-xl
        "
      >


        <div
          className="
            flex
            flex-col
            items-center
            gap-4
            sm:flex-row
          "
        >


          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-gradient-to-r
              from-blue-500
              to-purple-600
              text-2xl
              font-bold
              text-white
            "
          >

            {initials}

          </div>



          <div
            className="
              text-center
              sm:text-left
            "
          >

            <h1
              className="
                text-2xl
                font-bold
                text-white
              "
            >
              {user.fullName}
            </h1>


            <p
              className="
                mt-1
                text-sm
                text-gray-400
              "
            >
              {user.email}
            </p>



            <div
              className="
                mt-3
                flex
                flex-wrap
                justify-center
                gap-2
                sm:justify-start
              "
            >


              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  capitalize

                  ${
                    user.role==="admin"
                    ?
                    "bg-purple-500/20 text-purple-400"
                    :
                    user.role==="organizer"
                    ?
                    "bg-orange-500/20 text-orange-400"
                    :
                    "bg-blue-500/20 text-blue-400"
                  }
                `}
              >
                {user.role}
              </span>



              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  capitalize

                  ${
                    user.status==="blocked"
                    ?
                    "bg-red-500/20 text-red-400"
                    :
                    "bg-green-500/20 text-green-400"
                  }
                `}
              >

                {user.status}

              </span>


            </div>


          </div>


        </div>


      </div>





      {/* Information */}


      <div
        className="
          grid
          gap-5
          md:grid-cols-2
        "
      >


        <InfoCard

          icon={Mail}

          title="Email"

          value={user.email}

          iconColor="text-blue-400"

        />



        <InfoCard

          icon={Phone}

          title="Mobile"

          value={
            user.mobile ||
            "Not provided"
          }

          iconColor="text-green-400"

        />



        <InfoCard

          icon={Calendar}

          title="Joined"

          value={
            new Date(
              user.createdAt
            ).toLocaleDateString()
          }

          iconColor="text-purple-400"

        />



        <InfoCard

          icon={
            user.status==="blocked"
            ?
            Shield
            :
            ShieldCheck
          }

          title="Account Status"

          value={
            user.status
          }

          iconColor={
            user.status==="blocked"
            ?
            "text-red-400"
            :
            "text-green-400"
          }

        />


      </div>






      {/* Manage */}


      <div
        className="
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-6
        "
      >


        <div
          className="
            mb-5
            flex
            items-center
            gap-3
          "
        >

          <UserCog
            size={22}
            className="text-orange-400"
          />


          <h2
            className="
              text-lg
              font-semibold
              text-white
            "
          >
            Manage User
          </h2>


        </div>





        <label
          className="
            mb-2
            block
            text-sm
            text-gray-400
          "
        >
          Change Role
        </label>


        <select

          value={role}

          onChange={
            e => setRole(e.target.value)
          }

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

          <option value="student">
            Student
          </option>


          <option value="organizer">
            Organizer
          </option>


          <option value="admin">
            Admin
          </option>


        </select>




        <div
          className="
            mt-6
            grid
            gap-3
            sm:grid-cols-2
          "
        >


          <Button

            loading={saving}

            onClick={handleRoleUpdate}

          >

            Save Role

          </Button>





          <Button

            loading={saving}

            onClick={handleBlockToggle}

          >

            {
              user.status==="blocked"
              ?
              "Unblock User"
              :
              "Block User"
            }

          </Button>



        </div>


      </div>



    </div>

  );

};


export default UserDetails;