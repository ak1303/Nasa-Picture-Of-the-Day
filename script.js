document.addEventListener('DOMContentLoaded', async (e) => {
    const apiKey = 'zCtul7epECCeKDvQ55CM5r2mkK4QBD1lP1m7sGmf';
    const endPoint = `https://api.nasa.gov/planetary/apod`;
    const form = document.getElementById('search-form');
    const image = document.getElementById('picture');
    const titleDiv = document.getElementById('title');
    const descriptionDiv = document.getElementById('description');
    const h1Tag = document.getElementsByTagName('h1')[0];
    const ul = document.getElementById('search-history');
    const dateInput = document.getElementById('search-input');
    let date = new Date().toISOString().split("T")[0];

    async function fetchData(date) {
        try {
            const response = await fetch(`${endPoint}?api_key=${apiKey}&date=${date}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch data');
        }
    }

    function saveSearch() {
        let array = JSON.parse(localStorage.getItem('searches')) || [];
        let obj = { date: dateInput.value };
        let index = array.findIndex(item => item.date === dateInput.value);
        if (index !== -1) {
            array.splice(index, 1);
        }
        array.unshift(obj);
        localStorage.setItem('searches', JSON.stringify(array));
        addSearchToHistory();
    }

    function addSearchToHistory() {
        let array = JSON.parse(localStorage.getItem('searches')) || [];
        ul.innerHTML = '';
        array.forEach(item => {
            let li = document.createElement('li');
            let selectedDate = item.date;
            li.innerHTML = `
                <a href="#" title="show picture for ${selectedDate}">${selectedDate}</a>
            `;
            ul.append(li);
        });
    }

    async function displayImage(date) {
        try {
            const data = await fetchData(date);
            let title, imgUrl, description;
            if (date === new Date().toISOString().split("T")[0]) {
                title = 'NASA Picture of the Day';
            } else {
                title = `Picture on ${date}`;
            }
            imgUrl = data.url;
            description = data.explanation;
            h1Tag.innerHTML = title;
            image.src = imgUrl;
            titleDiv.innerText = data.title;
            descriptionDiv.innerText = description;
            saveSearch();
        } catch (error) {
            console.error(error);
        }
    }

    try {
        await displayImage(date);
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (dateInput.value <= new Date().toISOString().split("T")[0]) {
                await displayImage(dateInput.value);
            } else {
                console.error('Selected date cannot be greater than today\'s date.');
            }
        });

        ul.addEventListener('click', async (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                await displayImage(e.target.textContent);
            }
        });
    } catch (error) {
        console.error(error);
    }

    addSearchToHistory();
});
