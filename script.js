

document.addEventListener('DOMContentLoaded', async(e)=>{

    let apiKey = 'zCtul7epECCeKDvQ55CM5r2mkK4QBD1lP1m7sGmf';
    let endPoint = `https://api.nasa.gov/planetary/apod`;
    let form = document.getElementById('search-form');
    let imageContainer = document.getElementById('current-image-container');
    let dateInput = document.getElementById('search-input');
    let submitBtn = document.getElementById('submit');
    let image = document.getElementById('picture');
    let titleDiv = document.getElementById('title');
    let descriptionDiv = document.getElementById('description');
    let h1Tag = document.getElementsByTagName('h1')[0];
    let date = new Date().toISOString().split("T")[0];

    async function getCurrentImageOfTheDay(){//current date
        let response = await fetch(`${endPoint}?api_key=${apiKey}&date=${date}`);
        const data = await response.json();
        console.log(data);
        return data;
    }

    async function getImageOfTheDay(date){//selected date
        let response = await fetch(`${endPoint}?api_key=${apiKey}&date=${date}`);
        const data = await response.json();
        console.log(data);
        return data;
    }
    function saveSearch(){//save to local storage
        let array = JSON.parse(localStorage.getItem('searches')) || [];
        let obj={date:dateInput.value};
        let index = array.findIndex(item => item.date === dateInput.value);
        if (index !== -1) {
            array.splice(index, 1);
        }
        array.unshift(obj);
        localStorage.setItem('searches',JSON.stringify(array));  
        addSearchToHistory();
    }
    function addSearchToHistory(){
        let array = JSON.parse(localStorage.getItem('searches'))||[];
        let ul = document.getElementById('search-history');
        ul.innerHTML='';
        console.log("len",array.length);
        for(let i=0;i<array.length;i++){
            let li = document.createElement('li');
            let selectedDate = array[i].date;
            li.innerHTML= `
                            <a href="#" title="show picture for ${selectedDate}">${selectedDate}</a>
                            `;
            ul.append(li);
            li.addEventListener('click',async ()=>{
                let data = await getImageOfTheDay(selectedDate);
                let title = data.title;
                let imgUrl = data.url;
                let description = data.explanation;
                h1Tag.innerHTML=`Picture on ${selectedDate}`;
                image.src=imgUrl;
                titleDiv.innerText=title;
                descriptionDiv.innerText=description;
            })
        }
    }
    

    let data = await getCurrentImageOfTheDay();
    //default image
    let title = data.title;
    let imgUrl = data.url;
    let description = data.explanation;
    image.src=imgUrl;
    titleDiv.innerText=title;
    descriptionDiv.innerText=description;

    submitBtn.addEventListener('click',async (e)=>{
        e.preventDefault();
        try {
            let data = await getImageOfTheDay(dateInput.value);
            let title = data.title;
            let imgUrl = data.url;
            let description = data.explanation;
            if(dateInput.value===date)
                h1Tag.innerHTML=`NASA Picture of the Day`;
            else   
                h1Tag.innerHTML=`Picture on ${dateInput.value}`;
            image.src=imgUrl;
            titleDiv.innerText=title;
            descriptionDiv.innerText=description;
            //store searched date
            saveSearch();
           
        } catch (error) {
            console.error(error);
        }
    });
    
    addSearchToHistory();
    
});