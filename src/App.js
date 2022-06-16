import { useState , useReducer} from "react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

const toDoItems = [
  {
    key: uuidv4(),
    label: "Have fun",
  },
  {
    key: uuidv4(),
    label: "Spread Empathy",
  },
  {
    key: uuidv4(),
    label: "Generate Value",
  },
];
let cntj = 0;
// helpful links:
// useState crash => https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
function App() {
  const [itemToAdd, setItemToAdd] = useState("");

  const [searchTerm, setsearchTerm] = useState("");
  //arrow declaration => expensive computation ex: API calls
  const [items, setItems] = useState(() =>{
  const localData = localStorage.getItem("list");
  return localData ? JSON.parse(localData) : toDoItems;
  });
  const [cnt, setCnt] = useState(() =>{
    const localData = localStorage.getItem("number");
    return localData ? JSON.parse(localData) : parseInt(0);
  });
  const [filterType, setFilterType] = useState("");

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };
  const handleAddItem = () => {
    // mutating !WRONG!
    // const oldItems = items;
    // oldItems.push({ label: itemToAdd, key: uuidv4() });
    // setItems(oldItems);

    // not mutating !CORRECT!
    if(itemToAdd == ""){
        console.log(1);
    }
    else{
    setItems((prevItems) => [
      { label: itemToAdd, key: uuidv4() },
      ...prevItems,
    ]);
  }
    setItemToAdd("");
  };

  const handleItemDone = ({ key }) => {
    //first way
    // const itemIndex = items.findIndex((item) => item.key === key);
    // const oldItem = items[itemIndex];
    // const newItem = { ...oldItem, done: !oldItem.done };
    // const leftSideOfAnArray = items.slice(0, itemIndex);
    // const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
    // setItems([...leftSideOfAnArray, newItem, ...rightSideOfAnArray]);

    //  second way
    // const changedItem = items.map((item) => {
    //   if (item.key === key) {
    //     return { ...item, done: item.done ? false : true };
    //   } else return item;
    // });

    //second way updated
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };
  const Addimportant = ({key}) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, important: !item.important };
        } else{
          return item;
        }
      })
      );
    };
  
  const handleFilterItems = (type) => {
    setFilterType(type);
  };
  const DeleteItem = (item) => {
    setCnt(cnt+1);
    item.label = '';
    Addimportant(item);
  };
  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const filteredItems =
    !filterType || filterType === "all"
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done);
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(items));
  },[items]);
  useEffect(() =>{
    localStorage.setItem("number", JSON.stringify(cnt));
  }, [cnt]);
  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {parseInt(amountLeft) - cnt} more to do, {amountDone} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange = {event => {
            setsearchTerm(event.target.value)}
          } 
          
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        
        {filteredItems.length > 0 &&
          filteredItems.filter((item) =>{
            if(searchTerm === ""){
              return item.label;
            }
            else if(item.label.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())){
              return item.label;
            }
            }).map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}${item.important ? " important" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                  >
                  {item.label}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                  onClick={() => Addimportant(item)}
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick = {() => DeleteItem(item)}
                  >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
