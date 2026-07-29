import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../api/axios";

import EventCard from "../../components/EventCard";



const ManageEvents = () => {


  const navigate = useNavigate();



  const [events,setEvents] = useState([]);

  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");

  const [statusFilter,setStatusFilter] = useState("all");





  useEffect(()=>{

    fetchEvents();

  },[]);






  // ==========================
  // Fetch Organizer Events
  // ==========================

  const fetchEvents = async()=>{


    try{


      setLoading(true);


      const res =
      await api.get(
        "/events/organizer/my-events"
      );


      setEvents(
        res.data.data || []
      );


    }
    catch(error){


      toast.error(
        error.response?.data?.message ||
        "Failed to load events"
      );


    }
    finally{

      setLoading(false);

    }


  };








  // ==========================
  // Publish Event
  // ==========================

  const publishEvent = async(id)=>{


    try{


      await api.patch(
        `/events/${id}/publish`
      );


      toast.success(
        "Event published"
      );


      fetchEvents();


    }
    catch(error){


      toast.error(
        error.response?.data?.message ||
        "Publish failed"
      );


    }


  };









  // ==========================
  // Cancel Event
  // ==========================


  const cancelEvent = async(id)=>{


    try{


      await api.patch(
        `/events/${id}/cancel`
      );


      toast.success(
        "Event cancelled"
      );


      fetchEvents();


    }
    catch(error){


      toast.error(
        error.response?.data?.message ||
        "Cancel failed"
      );


    }


  };









  // ==========================
  // Delete Event
  // ==========================


  const deleteEvent = async(id)=>{


    const confirmDelete =
    window.confirm(
      "Delete this event?"
    );


    if(!confirmDelete)
      return;




    try{


      await api.delete(
        `/events/${id}`
      );


      toast.success(
        "Event deleted"
      );


      fetchEvents();


    }
    catch(error){


      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );


    }


  };









  // ==========================
  // Filter
  // ==========================


  const filteredEvents =
  useMemo(()=>{


    return events.filter(
      (event)=>{


        const searchMatch =
        event.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        );



        const statusMatch =
        statusFilter==="all"
        ||
        event.status===statusFilter;



        return (
          searchMatch &&
          statusMatch
        );


      }
    );


  },[
    events,
    search,
    statusFilter
  ]);







  const total =
  events.length;


  const published =
  events.filter(
    e=>e.status==="published"
  ).length;


  const draft =
  events.filter(
    e=>e.status==="draft"
  ).length;


  const cancelled =
  events.filter(
    e=>e.status==="cancelled"
  ).length;








return (


<div
className="
mx-auto
max-w-7xl
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

<h1
className="
text-3xl
font-bold
text-white
"
>
My Events
</h1>


<p
className="
mt-1
text-gray-400
"
>
Manage your created events
</p>


</div>




<Link

to="/organizer/create"

className="
flex
items-center
justify-center
gap-2
rounded-xl
bg-blue-600
px-5
py-3
font-medium
text-white
hover:bg-blue-700
"

>

<Plus size={18}/>

Create Event

</Link>


</div>







{/* Stats */}


<div
className="
grid
gap-4
sm:grid-cols-2
lg:grid-cols-4
"
>


<StatCard
title="Total Events"
value={total}
/>


<StatCard
title="Published"
value={published}
color="text-green-400"
/>



<StatCard
title="Draft"
value={draft}
color="text-yellow-400"
/>



<StatCard
title="Cancelled"
value={cancelled}
color="text-red-400"
/>



</div>









{/* Search */}



<div
className="
flex
flex-col
gap-4
md:flex-row
"
>



<div
className="
relative
flex-1
"
>


<Search

size={18}

className="
absolute
left-4
top-3.5
text-gray-500
"

/>



<input


value={search}


onChange={
(e)=>
setSearch(e.target.value)
}


placeholder="Search events..."


className="
w-full
rounded-xl
border
border-white/10
bg-white/5
py-3
pl-11
pr-4
text-white
outline-none
placeholder:text-gray-500
focus:border-blue-500
"

/>


</div>






<select


value={statusFilter}


onChange={
(e)=>
setStatusFilter(
e.target.value
)
}


className="
rounded-xl
border
border-white/10
bg-[#18181f]
px-4
py-3
text-white
outline-none
"

>


<option value="all">
All Status
</option>


<option value="draft">
Draft
</option>


<option value="published">
Published
</option>


<option value="cancelled">
Cancelled
</option>



</select>



</div>









{/* Events */}


{
loading ?


(
<div
className="
py-20
text-center
text-gray-400
"
>
Loading events...
</div>
)


:


filteredEvents.length===0 ?


(
<div
className="
rounded-3xl
border
border-white/10
bg-white/5
p-10
text-center
text-gray-400
"
>
No events found
</div>
)


:


(
<div
className="
grid
gap-6
lg:grid-cols-2
"
>


{
filteredEvents.map(
(event)=>(


<EventCard

key={event._id}

event={event}

showActions={true}

onView={()=>
navigate(
`/organizer/events/${event._id}`
)
}

onEdit={()=>
navigate(
`/organizer/events/edit/${event._id}`
)
}

onDelete={()=>
deleteEvent(event._id)
}


/>


)
)

}



</div>

)

}




</div>


);


};









const StatCard = ({
title,
value,
color="text-blue-400"
})=>(


<div
className="
rounded-3xl
border
border-white/10
bg-white/5
p-5
backdrop-blur-xl
"
>


<p
className="
text-sm
text-gray-400
"
>
{title}
</p>


<h2
className={`
mt-2
text-3xl
font-bold
${color}
`}
>

{value}

</h2>


</div>


);





export default ManageEvents;