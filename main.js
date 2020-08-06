// const { default: Axios } = require("axios");

const input= document.getElementById('input');
const submit= document.getElementById('searchButton');
const view= document.getElementById('view');
const p= document.getElementById('info');
const ep= document.getElementById('error');
const img= document.getElementById('img');
const typeList= document.getElementById('typeList');

async function findPokemon(){
    if (document.getElementById('typePokemonList')){
        view.removeChild(document.getElementById('typePokemonList'));
        view.removeChild(document.getElementById('selectSearch'));
     }
        
    const query=input.value;
    try {
        
        let data = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query}`);
        ep.style.visibility='hidden';
        view.style.visibility='visible';
        data = data.data;
        console.log(typeof(data.height))
        p.innerText=`Name:${data.name}
        Height:${(data.height*.1).toFixed(1)}m
        Weight:${(data.weight*.1).toFixed(1)}kg`
        listTypes(data.types);
        img.src= data.sprites.front_default||'NO-IMAGE';
        img.addEventListener('mouseover',()=>img.src=data.sprites.back_default||data.sprites.front_default);
        img.addEventListener('mouseout',()=>img.src=data.sprites.front_default);
    } catch (error) {
        console.error(error);
        ep.innerText= `Error! ${error}. please try again`;
     return;  
    }
}
const listTypes=(types)=>{
    Array.from(typeList.getElementsByTagName('li')).forEach(element=>typeList.removeChild(element));
    for(let x of types){
        let type= document.createElement('li')
         type.innerText = x.type.name;
         type.className= 'typeName'
        typeList.appendChild(type);
        }
}
const viewClick= (e)=>{
    
    const target= e.target;
    if (target.className==='typeName'){
    const value=target.innerText;
    getType(value);    
    if (document.getElementById('typePokemonList')){
        view.removeChild(document.getElementById('typePokemonList'));
        view.removeChild(document.getElementById('selectSearch'));
    }
    }else if (target.id==='selectSearch'){
        const select =document.getElementById('typePokemonList')
        input.value = select.value;
        findPokemon()
    } else return;
}
const getType =async (type) =>{
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
    .then(response => response.json())
    // .then(data =>typeMenu(data) );
    .then(data =>typeSelect(data) );
  }
const typeMenu= (type)=>{
    const pokemon=type.pokemon;
    const list= document.createElement('ul');
    list.id='typePokemonList';
    list.innerText=`Other Pokemon of the type "${type.name.toUpperCase()}"`;
    for (let x of pokemon){
        const name= x.pokemon.name
        const item= document.createElement('li');
        item.className='pokemonName';
        item.innerText=name;
        list.appendChild(item);
    }
    view.appendChild(list);
}
const typeSelect= (type)=>{
    const pokemon=type.pokemon;
    const select= document.createElement('select');
    select.id='typePokemonList';
    
    const def= document.createElement('option');
    def.className='pokemonName';
    def.defaultSelected=true;
    def.disabled=true;
    def.innerText = `other pokemons of type ${type.name.toUpperCase()} ` 
    select.appendChild(def);

    const selectSearch= document.createElement('button');
    selectSearch.id= 'selectSearch';
    selectSearch.innerText= 'Search';
    
    // list.innerText=`Other Pokemon of the type "${type.name.toUpperCase()}"`;
    for (let x of pokemon){
        const name= x.pokemon.name
        const item= document.createElement('option');
        item.className='pokemonName';
        item.innerText=name;
        select.appendChild(item);
    }
    view.appendChild(select);
    view.appendChild(selectSearch);
    
    
}
  
submit.onclick=findPokemon;
// submit.addEventListener('click',findPokemon)
view.addEventListener('click',viewClick)