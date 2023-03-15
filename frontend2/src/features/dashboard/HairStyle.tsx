import {ChangeEvent, FormEvent, SetStateAction, useEffect, useState} from 'react'
import { createPortal} from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { selectHairStyle, setHairStyles } from '../appointments/appointmentSlice';
import { v4 as uuidv4 } from "uuid";
import { useCreateNewHairStyleMutation, useGetAllHairStylesQuery, useUpdateHairStyleMutation } from '../appointments/appointmentApiSlice';

export interface  HairStyle {
	name: string;
    price: string;
    hairStyleId?: string;
	createdAt?:string;
	updatedAt?: string;
}


const HairStyle = () => {
    const [newHairStyleModal, setNewHairStyleModal] = useState(false);
    const [hairStyleValue, setHairStyleValue] = useState<HairStyle>({
        name: "",
        price: "",
        hairStyleId: ""
    })
	const dispatch = useAppDispatch();
    const [createNewHairStyle] = useCreateNewHairStyleMutation()
    const {data:hairStyleData} = useGetAllHairStylesQuery();
    const [updateHairStyle] = useUpdateHairStyleMutation()
    const [updating, setUpdating] = useState(false)
    const [errorMsg, setErroMsg] = useState("")


    function handleChange(e:ChangeEvent<HTMLInputElement>){
        setHairStyleValue({
            ...hairStyleValue,
            [e.target.id]: e.target.value
        })
    }

    async function submitHandler(e:FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if(updating ) {
            try {
                console.log(hairStyleValue, "hairstyle values");
                
                
                const result:any = await updateHairStyle ({
                    hairStyleId: hairStyleValue.hairStyleId as string,
                    body: {name: hairStyleValue.name, price: hairStyleValue.price}
                })
                console.log(result, "Updated successfully")
                
                if(result.error) {
                    setErroMsg(result.error.data.message)
                }else {
                    setNewHairStyleModal(false)
                }
            } catch (error) {
                console.log(error)
                setErroMsg("an error occured")
            }
        }else {
            try {
                const result:any = await createNewHairStyle({
                    body: {name: hairStyleValue.name, price:hairStyleValue.price}
                })
                if(result.error) {
                    setErroMsg(result.error.data.message)
                }else {
                    setNewHairStyleModal(false)
                }
            } catch (error) {
                setErroMsg("an error occured")
            }
        }
        console.log(hairStyleValue, "SUBmiteed value")
    }


    let content;
    if(hairStyleData) {
        content = hairStyleData?.hairStyles?.map((hairstyle: {name: string, price: string, hairStyleId: string})=> <div key={uuidv4()}>{hairstyle.name} {hairstyle.price} <span onClick={()=>{
            setNewHairStyleModal(true)
            setUpdating(true)
            setHairStyleValue({
                ...hairstyle,
            })
        }}>update</span></div>)
    }else {
        content = <div>loading hairstyles</div>
    }
  return (
    <div>

        <h2>HairStyle</h2>

        <div onClick={()=> setNewHairStyleModal(true)}>
            add new hairstyle
        </div>
        <div>
            {content}
        </div>
        {
            newHairStyleModal && createPortal(
                <div className="bg-transparent border-2 border-red-300 absolute top-0 left-0 right-0 h-screen w-screen py-10">
                    <div className="border-2  border-yellow-300 bg-slate-50 relative z-10 w-11/12 md:w-9/12 lg:w-1/2 mx-auto">
                        <div onClick={()=> setNewHairStyleModal(false)}>Close</div>
                       <form onSubmit={submitHandler}>
                        <div className='text-red-600'>{errorMsg}</div>
                        <div>
                            <label htmlFor='name'>Name: </label>
                            <input value={hairStyleValue.name} onChange={handleChange} id="name" required/>
                            </div>
                            <div>
                            <label htmlFor='price'>Price: </label>
                            <input value={hairStyleValue.price} onChange={handleChange} id="price" required/>
                            </div>
                            <button>{updating ? "update" : "confirm"}</button>
                       </form>
                    </div>
                </div>,
                document.body
            )
        }
    </div>
  )
}

export default HairStyle