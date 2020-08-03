// const { default: Axios } = require("axios");

const input= document.getElementById('input');
const submit= document.getElementById('searchButton');
const view= document.getElementById('view');
const p= document.getElementById('info');
const ep= document.getElementById('error');
const img= document.getElementById('img');
const typeList= document.getElementById('typeList');

async function findPokemon(){
    const query=input.value;
    try {
        
        let data = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query}`);
        ep.hidden=true;
        data = data.data;
        view.hidden=false
        p.innerText=`Name:${data.name}
        Height:${data.height} decameters
        Weight:${data.weight} hectograms`
        listTypes(data.types);
        img.src= data.sprites.front_default;
        img.addEventListener('mouseover',()=>img.src=data.sprites.back_default);
        img.addEventListener('mouseout',()=>img.src=data.sprites.front_default);
    } catch (error) {
        console.error(error);
        ep.hidden=false;
        ep.innerText= `Error! ${error}. please try again`;
     return;  
    }
}
const listTypes=(types)=>{
    for(let x of types){
        let type= document.createElement('li')
         type.innerText = x.type.name;
         type.className= 'typeName'
        typeList.appendChild(type);
        }
}
const ListClick= (e)=>{
    const target= e.target;
    if (target.className!=='typeName') return;
    const value=target.innerText;
    typeMenu(value)    
}
const typeMenu =async (type) =>{
    const options= {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
    }
    const res =await fetch( `https://pokeapi.co/api/v2/type/${type}`,options)
    .then(data => {console.log(data);});
  }
  
submit.onclick=findPokemon;
typeList.addEventListener('click',ListClick)