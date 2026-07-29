import { useEffect, useState } from "react";

import {
  Bell,
  Check,
  Trash2,
  Calendar,
  CreditCard,
  Ticket,
  ShieldCheck,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../api/axios";


const Notifications = () => {

  const [notifications,setNotifications] =
  useState([]);

  const [loading,setLoading] =
  useState(true);



  const fetchNotifications = async()=>{

    try{

      setLoading(true);

      const res =
      await api.get("/notifications");


      setNotifications(
        res.data.data
      );


    }catch(error){

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch notifications"
      );

    }
    finally{

      setLoading(false);

    }

  };




  useEffect(()=>{

    fetchNotifications();

  },[]);





  const markAsRead = async(id)=>{

    try{

      await api.patch(
        `/notifications/${id}/read`
      );

      fetchNotifications();


    }catch(error){

      toast.error("Failed to update notification");

    }

  };





  const markAllAsRead = async()=>{

    try{

      await api.patch(
        "/notifications/read-all"
      );

      toast.success(
        "All notifications marked as read"
      );

      fetchNotifications();


    }catch(error){

      toast.error(
        "Something went wrong"
      );

    }

  };





  const deleteNotification = async(id)=>{

    try{

      await api.delete(
        `/notifications/${id}`
      );


      toast.success(
        "Notification deleted"
      );


      fetchNotifications();


    }catch(error){

      toast.error(
        "Delete failed"
      );

    }

  };





  const getIcon = (type)=>{

    switch(type){

      case "booking":
        return Calendar;

      case "payment":
        return CreditCard;

      case "ticket":
        return Ticket;

      case "admin":
        return ShieldCheck;

      default:
        return Bell;

    }

  };





  if(loading){

    return(
      <div className="
        py-20
        text-center
        text-gray-400
      ">
        Loading notifications...
      </div>
    );

  }





  return (

    <div
      className="
        mx-auto
        max-w-5xl
        space-y-6
      "
    >


      {/* Header */}

      <div
        className="
          flex
          items-center
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

          <Bell
            size={26}
            className="text-blue-400"
          />


          <h1
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            Notifications
          </h1>


        </div>



        {
          notifications.length > 0 &&
          <button
            onClick={markAllAsRead}
            className="
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
            Mark all read
          </button>
        }


      </div>





      {/* Notification List */}


      {
        notifications.length === 0 ?

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

            <Bell
              size={40}
              className="
                mx-auto
                mb-3
                text-gray-400
              "
            />


            <p
              className="
                text-gray-400
              "
            >
              No notifications found
            </p>

          </div>

        )


        :

        (

          <div
            className="
              space-y-4
            "
          >

          {
            notifications.map((notification)=>{


              const Icon =
              getIcon(notification.type);



              return (

                <div
                  key={notification._id}
                  className={`
                    flex
                    items-start
                    gap-4
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/5
                    p-5
                    backdrop-blur-xl
                    transition
                    hover:bg-white/10

                    ${
                      !notification.isRead
                      ?
                      "border-l-4 border-blue-500"
                      :
                      ""
                    }
                  `}
                >


                  {/* Icon */}

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

                    <Icon
                      size={22}
                      className="text-blue-400"
                    />

                  </div>





                  {/* Content */}

                  <div
                    className="
                      flex-1
                      cursor-pointer
                    "
                    onClick={()=>
                      markAsRead(
                        notification._id
                      )
                    }
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <h2
                        className="
                          font-semibold
                          text-white
                        "
                      >
                        {notification.title}
                      </h2>


                      {
                        !notification.isRead &&
                        <span
                          className="
                            rounded-full
                            bg-blue-500/20
                            px-2
                            py-1
                            text-xs
                            text-blue-400
                          "
                        >
                          New
                        </span>
                      }


                    </div>



                    <p
                      className="
                        mt-2
                        text-sm
                        text-gray-400
                      "
                    >
                      {notification.message}
                    </p>



                    <p
                      className="
                        mt-2
                        text-xs
                        text-gray-500
                      "
                    >

                      {
                        new Date(
                          notification.createdAt
                        )
                        .toLocaleString()
                      }

                    </p>


                  </div>





                  {/* Delete */}

                  <button
                    onClick={()=>
                      deleteNotification(
                        notification._id
                      )
                    }
                    className="
                      rounded-lg
                      p-2
                      hover:bg-red-500/10
                    "
                  >

                    <Trash2
                      size={18}
                      className="
                        text-red-400
                      "
                    />

                  </button>



                </div>

              );

            })
          }

          </div>

        )

      }


    </div>

  );

};


export default Notifications;