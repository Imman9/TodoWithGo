import {useEffect, useState } from 'react'

import './App.css'

function App() {
 const [todos, setTodos] = useState([])
 const [newTodo, setNewTodo] = useState('')

 useEffect(()=>{
  fetchTodos()
 },[])

 const fetchTodos = async()=>{
  try{
    const response = await fetch('http://localhost:8080/todos')
    if (response.ok){
      const data = await response.json()
      setTodos(data)

    }
  }
  catch(error){
    console.error('Error fetching todos:',error);
    
  }
 }
 const toggleComplete = async (id)=>{
  try{
  const todoToUpdate = todos.find( todo => todo.id === id)
  const response = await fetch(`http://localhost:8080/todos/${id}`,{
    method:"PUT",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({completed:!todoToUpdate.completed})

  })
  if (response.ok){
    fetchTodos()
  }
} catch(error){
  console.error('Error updating todo:',error); 

}

 }
 const deleteTodo = async (id)=>{
  try{
    console.log("Deleting todo with ID:", id);
    const response = await fetch(`http://localhost:8080/todos/${id}`,{
      method:"DELETE",
    })
    if(response.ok){
      setTodos(todos.filter(todo => todo.id !== id))
    }else{
      console.log('Delete failed:',response.status ,response.statusText);
     
    }

  }
  catch(error){
    console.error('Error deleting todo:',error);
    

  }

 }

 const handleSubmit = async (e) =>{
  e.preventDefault()
  if (!newTodo.trim()) return

  try{
    const response = await fetch('http://localhost:8080/todos',{
      method:"POST",
      headers:{
        'Content-Type':"application/json",
      },
      body:JSON.stringify({text:newTodo,completed:false})
    })
    if (response.ok){
      const addedTodo = await response.json()
      setTodos([...todos,addedTodo])
      setNewTodo('')
    }
  }
  catch(error){
    console.error('Error adding todo:', error);
    }
  }

  return (
   <div className='bg-blue-100  p-5 h-screen '>
    <header className='rounded-lg justify-center shadow-md bg-blue-500 text-white  flex p-6  text-lg'>
      <p>This is Imman's TO-DO-LIST</p>
      </header>
      <form onSubmit={handleSubmit}>
        <div className=' flex justify-center '> 
           <input type="text"
            className='bg-white rounded-l-md shadow-lg w-lg   mt-5 p-2 ' placeholder='Add new task'
            onChange={(e)=>setNewTodo(e.target.value)}/>
           <button type='submit' className='text-white bg-red-600 rounded-r-md  p-2 mt-5 cursor-pointer'>Add</button>
           </div>
      
      </form>
      <div className='mt-5 max-w-md mx-auto'>
        {
          todos.map((todo)=>(
            <div key={todo.id} className="bg-white p-3 rounded shadow mb-2 flex justify-between items-center">
              <span className={todo.completed?"line-through text-gray-500":""}>
                {todo.text}
              </span>
              <div>
                <button
                 onClick={()=>toggleComplete(todo.id)}
                  className={`mr-2 ${todo.completed ? 'text-green-600': "text-gray-40"}`}>
                ✓
                </button>
                <button 
                onClick={()=>deleteTodo(todo.id)}
                className='text-red-600'
                >
                    ✗

                </button>
              </div>
            </div>
          ))
        }

      </div>
   </div>
  )
}

export default App
