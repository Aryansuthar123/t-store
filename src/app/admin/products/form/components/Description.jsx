"use client";
import ReactQuill from "react-quill-new"; 
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';




const modules = {
    toolbar: {
        container: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ size: ['extra-small', 'small', 'medium', 'large'] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            [{ color: [] }, { background: [] }],
            ['clean'],
        ],
    },
};
 export default function Description({data, handleData}) {
     const handleChange = (value) => {
        handleData('description', value);
    };
    return (
        <section className="flex-1 flex flex-col gap-2 bg-white  rounded-lg px-4 border">
            <h1 className="font-semibold text-xs">Description</h1>
             <ReactQuill
                value={data?.description}
                onChange={handleChange}
                modules={modules}
                placeholder="Enter your description here..."
            />
        </section>
            )
    } 

    






