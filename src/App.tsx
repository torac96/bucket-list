import { useEffect, useState } from "react";
import { IoMdClose } from 'react-icons/io';

interface Todos {
  id: number;
  title: string;
  completed: boolean;
  editable: boolean;
}

interface State {
  name: string;
  filterFunction: Function;
}

const App = () => {
  const defaultStates: State[] = [
    {
      name: "All",
      filterFunction: (todo: Todos) => true,
    },
    {
      name: "Active",
      filterFunction: (todo: Todos) => todo.completed === false,
    },
    {
      name: "Completed",
      filterFunction: (todo: Todos) => todo.completed === true,
    },
  ];

  const [todos, setTodos] = useState<Todos[]>([]);
  const [todoText, setTodoText] = useState("");
  const [state, setState] = useState<State>(defaultStates[0]);

  useEffect(() => {
    try {
      if(localStorage.getItem("todos") != null && Array.isArray(JSON.parse(localStorage.getItem("todos")!)) && JSON.parse(localStorage.getItem("todos")!).length > 0 ) {
        const savedTodos: Todos[] = JSON.parse(localStorage.getItem("todos")!)
        if(!("id" in savedTodos[0] && "title" in savedTodos[0] && "completed" in savedTodos[0] && "editable" in savedTodos[0]) ) {
          throw "localStorage doesn't contailn instances of Todos";
        }
        setTodos(savedTodos)
      }
    } catch(e) {
        console.error(e);
      }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function toggle(todo: Todos) {
    const newState = todos.map((obj) => {
      if (obj.id === todo.id) return { ...obj, completed: !todo.completed };
      return obj;
    });

    setTodos(newState);
  }

  function onKeyUp(event: any) {
    if (event.keyCode === 13) {
      const maxId = todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) : 0;
      const newState = [
        ...todos,
        {
          id: maxId + 1,
          completed: false,
          title: todoText,
          editable: false
        },
      ];
      setTodos(newState);
      setTodoText("");
    }
  }

  function onKeyUpSaveEdit(todo: Todos, event: any) {
    console.log("onKeyUpSaveEdit", event, todo);
    if (event.keyCode === 13) {
      const newState = todos.map((obj) => {
        if (obj.id === todo.id) return { ...obj, editable: false};
        return obj;
      });
  
      setTodos(newState);
    }
  }

  function clearCompleted() {
    const newState = [...todos.filter(todo => todo.completed === false)]
    setTodos(newState);
  }

  function setEditable(todo: Todos, enable: boolean = true) {
    console.log("setEditable", todo, enable);
    
    const newState = todos.map((obj) => {
      if (obj.id === todo.id && todo.completed == false) return { ...obj, editable: enable};
      return obj;
    });

    setTodos(newState);
  }

  function updateTodo(todo: Todos, newTitle: string) {
    console.log("updateTodo", todo, newTitle);
    
    const newState = todos.map((obj) => {
      if (obj.id === todo.id) return { ...obj, title: newTitle};
      return obj;
    });

    setTodos(newState);
  }

  // const [waitingClick, setWaitingClick] = useState(null);
  // const [lastClick, setLastClick] = useState(0);
  // const processClick = (e) => {
  //   if (lastClick && e.timeStamp - lastClick < 250 && waitingClick) {
  //     setLastClick(0);
  //     clearTimeout(waitingClick);
  //     setWaitingClick(null);
  //     console.log('double click')}
  //     else{
  //       setLastClick(e.timeStamp);
  //       setWaitingClick(setTimeout(() => { setWaitingClick(null);}, 251))
  //       console.log('single click')
        
  //     }
  //   }

  // let watingClick = null; // a reference to timeout function
  // let lastClick = 0; // a watchdog for difference between 2 clicks

  // function handleClick(e) {
  //   if (
  //     lastClick &&
  //     e.timeStamp - lastClick < 250 &&
  //     watingClick
  //   ) {
  //     lastClick = 0;
  //     clearTimeout(watingClick);
  //     console.log("Do the steps to respond double click");
  //     watingClick = null;
  //   } else {
  //     lastClick = e.timeStamp;
  //     watingClick = setTimeout(() => {
  //       watingClick = null;
  //       console.log("Do the steps to respond single click");
  //     }, 251);
  //   }
  // }
  // }

  return (
    <main className="w-screen h-screen bg-[#f5f5f5] text-[#4d4d4d] font-light">
      <section className="flex justify-center flex-col m-auto min-w-[230px] max-w-[550px] text-center">
        <h1 className="text-[100px] font-medium text-[#af2f2f26]">Bucket list</h1>

        <input
          value={todoText}
          onChange={(event) => setTodoText(event.target.value)}
          type="text"
          className="p-4 pl-14 border-0 bg-white font-normal shadow-xl placeholder:italic   placeholder:font-medium  text-2xl outline-none placeholder:text-[#4d4d4d27]"
          placeholder="What needs to be done?"
          onKeyUp={(event) => onKeyUp(event)}
        />

        <ul className="border-t border-[#e6e6e6]">
          {todos &&
            todos
              .filter((todo) => state.filterFunction(todo))
              .map((todo) => (
                <li
                  key={todo.id}
                  className="flex align-middle relative p-4 pl-14 border-0 bg-white font-normal  text-2xl outline-none items-center"
                >
                  <input
                    className="absolute left-4 h-9 w-7 "
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggle(todo)}
                  />
                  {!todo.editable && (<label
                    onDoubleClick={() => setEditable(todo, true)}
                    className={`${todo.completed ? "line-through text-[#4d4d4d27]" : ""} flex w-full`
                      
                    }
                  >
                    {todo.title}
                  </label>)}

                  {todo.editable && (
                  <div className="flex items-center">
                    <input
                     value={todo.title}
                     onChange={(event) => updateTodo(todo, event.target.value)}
                     type="text"
                     className="p-1 border-0 bg-white font-normal shadow-xl placeholder:italic placeholder:font-medium text-2xl outline-none placeholder:text-[#4d4d4d27]"
                     onKeyUp={(event) => onKeyUpSaveEdit(todo, event)}
                    />
                    <IoMdClose className="relative right-8 hover:cursor-pointer" onClick={() => setEditable(todo, false)}/>
                  </div>)}
                 
                </li>
              ))}
        </ul>

        {todos.length > 0 && (
          <footer className="justify-between flex border-t border-[#e6e6e6] items-center border-0 bg-white px-4 py-2 shadow-xl ">
            <span className=" flex justify-start">{todos.filter(todo => todo.completed === false)?.length} items left</span>

            <ul className="flex ">
              {defaultStates &&
                defaultStates.map((defState) => (
                  <li 
                    key={defState.name}
                    className={`cursor-pointer m-[3px] px-[3px] rounded-md ${defState.name === state.name ? 'border-2 border-[#af2f2f33]' : 'border-2 border-transparent hover:border-[#af2f2f11]'}`}
                    onClick={()=> setState(defState)}
                   >
                    {defState.name}
                  </li>
                ))}
            </ul>

            {todos?.filter(todo => todo.completed === true)?.length > 0 && (
              <button onClick={() => clearCompleted()} className="hover:underline flex justify-end">Clear completed</button>
            ) }
            
          </footer>
        )}
      </section>

      <footer className="flex flex-col justify-center mt-16 text-[#bfbfbf] text-[10px] shadow-[0 1px 0 rgb(255 255 255 / 50%)] text-center">
        <p>Double-click to edit a todo</p>
        <p>Created by Petru Torac</p>
      </footer>
    </main>
  );
}

export default App;
