import {create} from 'zustand';
import { Movie } from '../types/movie';
interface Moviestore{
    movies:Movie[]
    loading:boolean
    error:string|null

    fetchMovies:()=>Promise<void>
    fetchMoviesByid:(id:string)=>Promise<Movie| null>
    createMovies:(movie:Omit<Movie ,'id'>)=>Promise<void>
    updateMovies:(id:string,movie:Partial<Movie>)=>Promise<void>
    deleteMovie:(id:string)=>Promise<void>
}

export const useMovieStore=create<Moviestore>((set,get)=>({
    movies:[],
    loading:false,
    error:null,
    fetchMovies:async()=>{
set({loading:true,error:null})
try {
    const res=await fetch("/api/movies")
    if(!res.ok) throw new Error("Failed fetch data movies")
        const data= await res.json()
    set({movies:data.data,loading:false})
} catch (error:any) {
    set({error:error.message || "Unkown error" ,loading:false})
}
    },
    fetchMoviesByid:async(id:string)=>{
   set({loading:true,error:null})
   try{
 const res = await fetch(`/api/movies/${id}`);
      if (!res.ok) throw new Error('Movie not found');
      const data = await res.json();
      set({loading: false });
      return data.data;
   }catch(err:any){
 set({ error: err.message || 'Unknown error', loading: false });
      return null;
   }
    },
    updateMovies:async(id,movie)=>{
    set({loading:true,error:null})
    try {
        const res=await fetch(`/api/movies/${id}`,{method:"PUT",
              headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(movie),
        })
        if(!res.ok) throw new Error("Failed to update")
            const data= await res.json()
        set((state)=>({movies:state.movies.map((m:any)=>(m.id === id? data.data:m))}))
    } catch (error) {
        
    }
    },
    deleteMovie:async(id:string)=>{
set({loading:true,error:null})
try {
    const res= await fetch(`/api/movies/${id}`,{method:'DELETE'})
    if(!res.ok) throw new Error("Failed to delete")
        set((state)=>({movies:state.movies.filter((m:any)=>m.id !== id),loading:false}))
} catch (error) {
    
}

    },
    createMovies:async(movie)=>{
      set({loading:true,error:null})
      try {
        const res=await fetch("/api/movies",{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(movie)
        })
        if(!res.ok)throw new Error("Failed to create movie")
            const data=await res.json()
        set((state)=>({movies:[data.data,...state.movies],loading:false}))
      } catch (err:any) {
        set({error:err.message || "Unkown error",loading:false})
      }
    }
}))