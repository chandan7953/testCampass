import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../api/axios";

import InputField from "../../components/InputField";
import Button from "../../components/Button";


const AddCategory = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = Boolean(id);


  const [name, setName] = useState("");

  const [icon, setIcon] = useState(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(isEdit);

  const [saving, setSaving] = useState(false);



  useEffect(() => {

    if(isEdit){
      fetchCategory();
    }

  },[id]);



  const fetchCategory = async()=>{

    try{

      setLoading(true);


      const res =
        await api.get(
          `/categories/${id}`
        );


      const category =
        res.data.data;


      setName(category.name);


      // FIX HERE
      setPreview(
        category.icon?.url || ""
      );


    }catch(error){

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch category"
      );


      navigate(
        "/admin/categories"
      );

    }finally{

      setLoading(false);

    }

  };




  const handleImageChange=(e)=>{

    const file =
      e.target.files?.[0];


    if(!file) return;


    setIcon(file);


    setPreview(
      URL.createObjectURL(file)
    );

  };




  const handleSubmit = async(e)=>{

    e.preventDefault();


    if(!name.trim()){

      toast.error(
        "Category name is required"
      );

      return;

    }



    try{

      setSaving(true);



      const formData =
        new FormData();


      formData.append(
        "name",
        name.trim()
      );



      if(icon){

        formData.append(
          "icon",
          icon
        );

      }




      if(isEdit){


        await api.put(
          `/categories/${id}`,
          formData,
          {
            headers:{
              "Content-Type":
              "multipart/form-data",
            }
          }
        );


        toast.success(
          "Category updated successfully"
        );


      }else{


        await api.post(
          "/categories",
          formData,
          {
            headers:{
              "Content-Type":
              "multipart/form-data",
            }
          }
        );


        toast.success(
          "Category created successfully"
        );

      }



      navigate(
        "/admin/categories"
      );



    }catch(error){

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );


    }finally{

      setSaving(false);

    }


  };




  if(loading){

    return(
      <div className="py-20 text-center text-gray-400">
        Loading...
      </div>
    );

  }





  return (

    <div className="mx-auto max-w-3xl space-y-8">


      <div>

        <button
          onClick={()=>navigate(-1)}
          className="
          mb-5
          flex
          items-center
          gap-2
          text-sm
          text-gray-400
          hover:text-white
          "
        >

          <ArrowLeft size={18}/>

          Back

        </button>



        <h1 className="
        text-3xl
        font-bold
        text-white
        ">

          {
            isEdit
            ? "Edit Category"
            : "Add Category"
          }

        </h1>


        <p className="
        mt-2
        text-gray-400
        ">

          {
            isEdit
            ? "Update category details."
            : "Create a new event category."
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
        p-8
        "
      >



        <InputField

          label="Category Name"

          name="name"

          placeholder="Enter category name"

          value={name}

          onChange={(e)=>
            setName(e.target.value)
          }

        />





        <div>


          <label className="
          mb-2
          block
          text-sm
          text-gray-300
          ">

            Category Icon

          </label>




          <label className="
          flex
          min-h-[220px]
          cursor-pointer
          flex-col
          items-center
          justify-center
          rounded-2xl
          border-2
          border-dashed
          border-white/10
          bg-white/5
          hover:bg-white/10
          ">


            <input

              type="file"

              accept="image/*"

              onChange={handleImageChange}

              className="hidden"

            />



            {
              preview ?

              <img

                src={preview}

                alt="preview"

                className="
                h-40
                w-40
                rounded-2xl
                object-cover
                "
              />

              :

              <>

              <div className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-blue-500/10
              ">

                <ImageIcon
                  size={34}
                  className="text-blue-400"
                />

              </div>


              <p className="mt-5 text-white">

                Upload Category Icon

              </p>

              </>

            }


          </label>



          {
            preview &&

            <button

              type="button"

              onClick={()=>{
                setIcon(null);
                setPreview("");
              }}

              className="
              mt-3
              text-sm
              text-red-400
              "

            >

              Remove Image

            </button>

          }


        </div>





        <div className="
        flex
        justify-end
        gap-3
        ">


          <button

            type="button"

            onClick={()=>
              navigate("/admin/categories")
            }

            className="
            rounded-xl
            border
            border-white/10
            px-6
            py-3
            text-gray-300
            "

          >

            Cancel

          </button>





          <Button

            type="submit"

            loading={saving}

          >

            <Upload
              size={18}
              className="mr-2"
            />


            {
              isEdit
              ? "Update Category"
              : "Create Category"
            }


          </Button>



        </div>




      </form>


    </div>

  );

};


export default AddCategory;