import { useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  Users,
  Eye,
  Pencil,
  Trash2,
  Send,
  Ban,
} from "lucide-react";


const EventCard = ({
  event,

  showActions = false,

  onView,
  onEdit,
  onPublish,
  onCancel,
  onDelete,

}) => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role || "user";


return (

<div
className="
group
overflow-hidden
rounded-3xl
border
border-white/10
bg-[#111118]/80
shadow-xl
transition
hover:-translate-y-1
hover:border-white/20
"
>


{/* Image */}


<div
className="
relative
h-56
overflow-hidden
"
>


<img

src={
event.poster ||
"https://placehold.co/800x400?text=No+Poster"
}

alt={event.title}

className="
h-full
w-full
object-cover
transition
duration-500
group-hover:scale-105
"

/>


{/* Overlay */}

<div
className="
absolute
inset-0
bg-linear-to-t
from-black/70
via-transparent
to-transparent
"
/>



{
event.status &&

<div
className="
absolute
right-4
top-4
"
>

<StatusBadge
status={event.status}
/>

</div>

}



</div>







<div
className="
space-y-5
p-5
"
>





{/* Title */}


<div>


<h2
className="
line-clamp-1
text-xl
font-bold
text-white
"
>

{event.title}

</h2>



<p
className="
mt-1
text-sm
text-gray-400
"
>

{event.category?.name || "Event"}

</p>


</div>







{/* Information */}


<div
className="
space-y-3
text-sm
text-gray-300
"
>


<InfoRow

icon={<MapPin size={16}/>}

text={
event.venue?.name ||
"No venue"
}

/>



<InfoRow

icon={<Calendar size={16}/>}

text={
event.startDate
?
new Date(
event.startDate
).toLocaleDateString()
:
"No date"
}

/>



<InfoRow

icon={<Users size={16}/>}

text={

`${event.bookedSeats || 0} / ${
event.capacity || 0
} seats booked`

}

/>



</div>







{/* Actions */}



{
showActions &&


<div
className="
grid
grid-cols-2
gap-3
pt-2
"
>


<ActionButton

icon={<Eye size={16}/>}

text="View"

onClick={onView}

/>






{
role==="organizer" &&

<ActionButton

icon={<Pencil size={16}/>}

text="Edit"

onClick={onEdit}

/>

}






{
role==="admin"
&&
event.status!=="published"

&&

<ActionButton

icon={<Send size={16}/>}

text="Publish"

onClick={onPublish}

className="
text-green-400
"

/>

}






{
role==="organizer"
&&
event.status==="published"

&&

<ActionButton

icon={<Ban size={16}/>}

text="Cancel"

onClick={onCancel}

className="
text-yellow-400
"

/>

}







{
(role==="organizer"
||
role==="admin")

&&

<ActionButton

icon={<Trash2 size={16}/>}

text="Delete"

onClick={onDelete}

className="
col-span-2
text-red-400
"

/>

}



</div>


}



</div>



</div>


);


};







const InfoRow = ({
icon,
text
})=>{


return (

<div
className="
flex
items-center
gap-3
"
>

<span
className="
text-gray-400
"
>

{icon}

</span>


<span
className="
truncate
"
>

{text}

</span>


</div>

);

};







const ActionButton = ({
icon,
text,
onClick,
className=""
})=>{


return (

<button

onClick={onClick}

className={`
flex
items-center
justify-center
gap-2
rounded-xl
border
border-white/10
bg-white/5
px-3
py-2
text-sm
font-medium
text-gray-200
transition
hover:bg-white/10
${className}
`}

>


{icon}

{text}


</button>


);

};








const StatusBadge = ({
status
})=>{


const styles={


published:
"bg-green-500/20 text-green-400 border-green-500/20",


draft:
"bg-yellow-500/20 text-yellow-400 border-yellow-500/20",


cancelled:
"bg-red-500/20 text-red-400 border-red-500/20",


completed:
"bg-blue-500/20 text-blue-400 border-blue-500/20",


};


return (

<span

className={`
rounded-full
border
px-3
py-1
text-xs
font-semibold
capitalize
backdrop-blur-md
${styles[status] || "bg-white/10 text-white"}
`}

>

{status}

</span>

);


};




export default EventCard;