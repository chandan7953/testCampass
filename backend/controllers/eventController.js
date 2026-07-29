const Event = require("../models/Event");
const Category = require("../models/Category");
const Venue = require("../models/Venue");

const apiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/ApiError");

const createNotification =
require("../utils/createNotification");

const {
  uploadToCloudinary,
} = require("../services/cloudinaryService");


// Create Event

const createEvent = async (req, res, next) => {

  try {

    const {
      title,
      description,
      category,
      venue,
      startDate,
      endDate,
      registrationDeadline,
      capacity,
    } = req.body;



    const categoryExists =
      await Category.findById(category);


    if (!categoryExists) {

      throw new ApiError(
        404,
        "Category not found"
      );

    }




    const venueExists =
      await Venue.findById(venue);



    if (!venueExists) {

      throw new ApiError(
        404,
        "Venue not found"
      );

    }




    // Check venue capacity

    if (capacity > venueExists.capacity) {

      throw new ApiError(
        400,
        "Event capacity exceeds venue capacity"
      );

    }





    let poster = "";



    if (req.file) {

      const result =
        await uploadToCloudinary(
          req.file,
          "campuspass/events"
        );


      poster =
        result.secure_url;

    }




    const event =
      await Event.create({

        title,

        description,

        poster,

        category,

        organizer:req.user.id,

        venue,

        startDate,

        endDate,

        registrationDeadline,

        capacity,

        location:{
          name:venueExists.name,
          address:venueExists.address
        },

        status:"pending"

      });





    // Notification

    await createNotification({

      userId:req.user.id,

      title:"Event Submitted",

      message:
      `${title} has been submitted for approval.`,

      type:"event",

      data:{
        eventId:event._id
      }

    });





    res
    .status(201)
    .json(
      apiResponse(
        201,
        "Event created successfully",
        event
      )
    );



  } catch(error){

    next(error);

  }

};







// Update Event


const updateEvent = async(req,res,next)=>{

try{


const event =
await Event.findById(
req.params.id
);



if(!event){

throw new ApiError(
404,
"Event not found"
);

}




if(
event.organizer.toString()
!== req.user.id
&&
req.user.role !== "admin"
){

throw new ApiError(
403,
"Unauthorized"
);

}





Object.assign(
event,
req.body
);




if(req.file){

const result =
await uploadToCloudinary(
req.file,
"campuspass/events"
);


event.poster =
result.secure_url;

}




await event.save();



res
.status(200)
.json(
apiResponse(
200,
"Event updated successfully",
event
)
);



}catch(error){

next(error);

}

};








// Delete Event


const deleteEvent = async(req,res,next)=>{

try{


const event =
await Event.findById(
req.params.id
);



if(!event){

throw new ApiError(
404,
"Event not found"
);

}



if(
event.organizer.toString()
!== req.user.id
&&
req.user.role !== "admin"
){

throw new ApiError(
403,
"Unauthorized"
);

}




await Event.findByIdAndDelete(
req.params.id
);



res
.status(200)
.json(
apiResponse(
200,
"Event deleted successfully"
)
);



}catch(error){

next(error);

}

};









// Public Events


const getAllEvents = async(req,res,next)=>{

try{


const events =
await Event.find({

status:"approved"

})
.populate(
"category"
)
.populate(
"venue"
)
.populate(
"organizer",
"fullName email"
)
.sort({
createdAt:-1
});



res
.status(200)
.json(
apiResponse(
200,
"Events fetched successfully",
events
)
);



}catch(error){

next(error);

}

};









// Get Single Event


const getEventById =
async(req,res,next)=>{

try{


const event =
await Event.findById(
req.params.id
)
.populate("category")
.populate("venue")
.populate(
"organizer",
"fullName email"
);



if(!event){

throw new ApiError(
404,
"Event not found"
);

}



res
.status(200)
.json(
apiResponse(
200,
"Event fetched successfully",
event
)
);



}catch(error){

next(error);

}

};









// Organizer Events


const getMyEvents =
async(req,res,next)=>{

try{


const events =
await Event.find({

organizer:req.user.id

})
.sort({
createdAt:-1
});



res
.status(200)
.json(
apiResponse(
200,
"My events fetched successfully",
events
)
);



}catch(error){

next(error);

}

};









// Admin Approve Event


const approveEvent =
async(req,res,next)=>{

try{


const event =
await Event.findByIdAndUpdate(

req.params.id,

{
status:"approved"
},

{
new:true
}

);



if(!event){

throw new ApiError(
404,
"Event not found"
);

}





await createNotification({

userId:event.organizer,

title:"Event Approved",

message:
`${event.title} has been approved.`,

type:"event",

data:{
eventId:event._id
}

});




res
.status(200)
.json(
apiResponse(
200,
"Event approved successfully",
event
)
);



}catch(error){

next(error);

}

};









// Admin Reject Event


const rejectEvent =
async(req,res,next)=>{

try{


const {
reason
}=req.body;



const event =
await Event.findByIdAndUpdate(

req.params.id,

{
status:"rejected",
rejectionReason:reason
},

{
new:true
}

);



if(!event){

throw new ApiError(
404,
"Event not found"
);

}





await createNotification({

userId:event.organizer,

title:"Event Rejected",

message:
`${event.title} was rejected.`,

type:"event",

data:{
eventId:event._id
}

});





res
.status(200)
.json(
apiResponse(
200,
"Event rejected",
event
)
);



}catch(error){

next(error);

}

};









// Cancel Event


const cancelEvent =
async(req,res,next)=>{

try{


const event =
await Event.findById(
req.params.id
);



if(!event){

throw new ApiError(
404,
"Event not found"
);

}




event.status="cancelled";


await event.save();





await createNotification({

userId:event.organizer,

title:"Event Cancelled",

message:
`${event.title} has been cancelled.`,

type:"event",

data:{
eventId:event._id
}

});





res
.status(200)
.json(
apiResponse(
200,
"Event cancelled",
event
)
);



}catch(error){

next(error);

}

};






module.exports = {

createEvent,

updateEvent,

deleteEvent,

getAllEvents,

getEventById,

getMyEvents,

approveEvent,

rejectEvent,

cancelEvent

};