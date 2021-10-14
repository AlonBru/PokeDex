// const { default: Axios } = require("axios");

const input= document.getElementById('input');

input.addEventListener('focus',inputShortcut);
input.addEventListener('focusout',inputShortcut)

const submit= document.getElementById('searchButton');
const view= document.getElementById('view');
const viewLabel= document.getElementById('viewLabel');
const p= document.getElementById('info');
const ep= document.getElementById('error');
const img= document.getElementById('img');
const typeList= document.getElementById('typeList');

/**
 * fetches a random pokeball's data and 
 */
function inputShortcut(e){
    // adds submitting with enter
    //target is an input objects
    //event type is focus||focusout  
    const target = e.target;
    function submit(e){
        //calls updateData when enter is pressed
        //target is an input objects
        //event type is focus||focusout  
        if (e.key=='Enter'){ findPokemon()}
    }
    if(e.type =='focus'){
      target.addEventListener('keyup',submit);
    }
    if(e.type=='focusout'){
      target.removeEventListener('keyup',submit);
    }
}

/**
 * fetches a random pokeball's data and 
 */
async function getRandomBall(){

  const ball= document.getElementById('ball')
  let itemId = Math.floor(Math.random()*15) + 1; //avoiding the number 0, no ball has id 0;
  try{
    const res = await axios.get(`https://pokeapi.co/api/v2/item/${itemId}`);
    ball.src = res.data.sprites.default; 
    ball.title = res.data.name;
  }catch(err){
    console.error(err)
  }
}

async function findPokemon(){
  if (submit.style.backgroundColor != 'green'    ){ 
    return;
  }
  if (document.getElementById('typePokemonList')){
    view.removeChild(document.getElementById('typePokemonList'));
    view.removeChild(document.getElementById('selectSearch'));
  }
      
  const query=input.value;
  try {
    let data = (await axios.get(`https://pokeapi.co/api/v2/pokemon/${query}`)).data;
    ep.style.visibility='hidden';
    view.style.visibility='visible';
    viewLabel.style.color='rgb(0, 175, 0)'
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
      ep.style.visibility='visible';
      ep.innerText= `Your search turned up nothing. please try again`;
    
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
        if (select.selectedOptions[0].id == "defaultOption" )return;
        input.value = select.value;
        findPokemon()
    } else return; // function returns automatically when reaches the end
}

const getType =async (type) =>{   const options= {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
  }
  const res =await fetch( `https://pokeapi.co/api/v2/type/${type}`,options) // not how you use async/await. either dont use then or dont use await.
  .then(response => response.json())
  // .then(data =>typeMenu(data) );
  .then(data =>typeSelect(data) );
}

const typeMenu = (type)=>{
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
  def.id='defaultOption';
  def.defaultSelected=true;
  def.disabled=true;
  def.innerText = `other pokemons of type ${type.name.toUpperCase()} ` 
  select.appendChild(def);

  const selectSearch= document.createElement('button');
  selectSearch.id= 'selectSearch';
  selectSearch.innerText= 'Search';
  
  // list.innerText=`Other Pokemon of the type "${type.name.toUpperCase()}"`;
  for (let x of pokemon){ // bad vaiable naming 'x' and 'pokemon'. a correct naming will be 'for (let pokemon of pokemons) {
    const name= x.pokemon.name
    const item= document.createElement('option');
    item.className='pokemonName';
    item.innerText=name;
    select.appendChild(item);
  }
  view.appendChild(select);
  view.appendChild(selectSearch);  
}
  
getRandomBall();
submit.onclick = findPokemon;

view.addEventListener('click',viewClick)

document.getElementById('baller').onclick=()=>getRandomBall();

input.oninput=()=>{ 
  if(input.value==''){
    submit.style.backgroundColor= '';
    submit.style.border= ''
    submit.style.boxShadow = '';
  }
  else{
    submit.style.backgroundColor = 'green';
    submit.style.border = '3px outset darkgreen';
    submit.style.boxShadow = '2px 2px 2px inset lightgreen';
  }
}
