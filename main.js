// const { default: Axios } = require("axios");
// todo: fix indentation to whole file
const input= document.getElementById('input');
input.addEventListener('focus',inputEnter) // maybe 'inputEnter' is not a good name if you use it for focus events
input.addEventListener('focusout',inputEnter)
const submit= document.getElementById('searchButton');
const view= document.getElementById('view');
const viewLabel= document.getElementById('viewLabel');
const p= document.getElementById('info');
const ep= document.getElementById('error');
const img= document.getElementById('img');
const typeList= document.getElementById('typeList');
const ball= document.getElementById('ball')

function inputEnter(e){
    // adds submitting with enter
    //target is an input objects
    //event type is focus||focusout  
    const target = e.target;
    function submit(e){
        //calls updateData when enter is pressed
        //target is an input objects
        //event type is focus||focusout  
        if (e.key=='Enter'){
            findPokemon()
            
        }
    }
    if(e.type =='focus') target.addEventListener('keyup',submit); // bad if style. use brackets
    if(e.type=='focusout') target.removeEventListener('keyup',submit);
    }


async function rndBall(){
    try{
    let number = Math.floor(Math.random()*16); // bad variable name. a better name is itemId, since this is what you want it to represent
    const res = await axios.get(`https://pokeapi.co/api/v2/item/${number}`);
    ball.src = res.data.sprites.default; // since you use 'ball' only in this function, why not define it here and not globally?
    ball.title = res.data.name;
    }catch(err){
        console.error(err)
    }
}
async function findPokemon(){
    if (submit.style.backgroundColor != 'green'    )return;
    if (document.getElementById('typePokemonList')){
        view.removeChild(document.getElementById('typePokemonList'));
        view.removeChild(document.getElementById('selectSearch'));
     }
        
    const query=input.value;
    try {
        // why not define data from the beggining as
        // let data = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query}`).data
        let data = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query}`);
        ep.style.visibility='hidden';
        view.style.visibility='visible';
        viewLabel.style.color='rgb(0, 175, 0)'
        data = data.data; // unnecessary if defined correctly
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
     return;  // not needed
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
const getType =async (type) =>{ // regular function is better in this scenario
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
    const res =await fetch( `https://pokeapi.co/api/v2/type/${type}`,options) // not how you use async/await. either dont use then or dont use await.
    .then(response => response.json())
    // .then(data =>typeMenu(data) );
    .then(data =>typeSelect(data) );
  }
const typeMenu= (type)=>{ // regular function is better in this scenario
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
const typeSelect= (type)=>{ // regular function is better in this scenario
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
  
rndBall(); // bad function name
submit.onclick=findPokemon; // better to use the form you used 4 line under
// submit.addEventListener('click',findPokemon) Remove unnecessary code
view.addEventListener('click',viewClick)
document.getElementById('baller').onclick=()=>rndBall();
input.oninput=()=>{ // todo: fix indetation
        if(input.value==''){
        submit.style.backgroundColor= '';
        submit.style.border= ''
        submit.style.boxShadow = '';
        }else{
        submit.style.backgroundColor = 'green';
        submit.style.border = '3px outset darkgreen';
        submit.style.boxShadow = '2px 2px 2px inset lightgreen';
        }
}
