import axios from 'axios';

const APIURL='http://localhost:3000/generate/model'
export async function generateCode (prompt){
    try{
        console.log(prompt);
        const response =await axios.post(APIURL, {prompt:prompt});
        console.log(response.data);
        if(response.data!=null) return {message:true,response:response.data};
    }
    catch(err){
        console.log(err);
        return {message:false};
    }
}