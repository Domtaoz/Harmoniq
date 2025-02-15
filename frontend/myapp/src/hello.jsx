import { useState } from 'react';
import './hello.css'
// function MyButton(){
//     function handleClick(){
//       alert("You clicked button!")
//     }
//     return (
//         <button onClick={handleClick} style={{backgroundColor: 'red', color: 'yellow'}}>
//           I am button
//         </button>
//     );
// }

function MyButton(){
  const [count, setCount] = useState(0);
  function handleClick(){
    setCount(count+1);
  }
  function handleClick2(){
    setCount(0);
  }
  return(<>
    <button onClick={handleClick} style={{backgroundColor: 'red', color: 'yellow'}}>
      You clicked {count} time
    </button>
    <button onClick={handleClick2} style={{backgroundColor: 'red', color: 'yellow'}}>
      Reset 
    </button>
    </>
  )
}

function Hello(){
  let name="Pollapat Rattanathip 1";
  let isAdmin = true;
  let content;
  if(isAdmin){
    content=<MyButton/>
  }
  else{
    content=<b>You are not admin</b>;
  }
  const products=[
    {title:"Cabbage",id: 1},
    {title:"garlic",id: 2},
    {title:"Apple",id: 3}
  ];
  const listItems=products.map(product=>
    <li key={product.id}>
      {product.title}
    </li>
  )
    return (
      <div style={{border: "10px solid #336600"}}>
        <h1 className='redtopic'>Hello {name.toUpperCase()}</h1>
        <h2>I am computer engineer</h2>
        <p>Hello there.<br />How do you do?</p>
        <ol>{listItems}</ol>
        <hr/>{content}<hr/>
        <MyButton/><hr/>
      </div>
       );
  }
export default Hello;