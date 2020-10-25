window.addEventListener('load', () => {

    const buttonPeoples = document.querySelectorAll("input[type=button]");
    const buttonNext = document.querySelector(".arrow-list-right");
    const buttonPrev = document.querySelector(".arrow-list-left");
    const modalPeople = document.querySelector(".modal");
    const buttonClosed = document.querySelector(".close")
    
    let nextState = "";
    let previousState = "";


    function addButtonValue(data) {
        for (let i = 0; i < data.results.length; i++) {
            for (let y = 0; y < buttonPeoples.length; y++) {
                if (i === y) {
                    buttonPeoples[y].value = data.results[i].name;
                    buttonPeoples[y].style.display = "block";
                    
                } else if (data.results.length < buttonPeoples.length) {
                    for (let x = data.results.length; x < buttonPeoples.length; x++) {
                        buttonPeoples[x].style.display = "none";
                    }
                }
            }
        }
    }
    
    
    function updateState(apiUrl) {
        fetch(apiUrl)
        .then((respons) => {
            return respons.json();
        })
        .then( (data) => {
            addButtonValue(data);
            clickPeople(data);
            nextState = data.next;
            previousState = data.previous;             
        })
        .catch((error) => {
            console.log(error);
            console.log(apiUrl);   
        }) 
    }
    
    updateState("swapi.dev/api/people");

    buttonNext.addEventListener("click", () => {
        if (nextState !== null) {
            updateState(nextState);
        } else {
           
        }        
    });
    buttonPrev.addEventListener("click", () => {
        if (previousState !== null) {
            updateState(previousState);    
        } else {

        }    
    });

    buttonClosed.addEventListener("click", () => {
        console.dir(buttonClosed);
        buttonClosed.parentElement.classList.add("disnone");
    });
    
    
    function clickPeople(data) {
        for (let i = 0; i < buttonPeoples.length; i++) {
            buttonPeoples[i].addEventListener("click", () => {
                let namePeoples = "https://swapi.dev/api/people/?search=" + buttonPeoples[i].value;
                statePeoples(namePeoples);
            });
        }
    }

    function statePeoples(url) {
        fetch(url)
        .then((respons) => {
             return respons.json();
        })
        .then((data) => {
            modalShow(data.results[0]).then(() => {
                console.log(true);
            });
        })
        
    } 

    function modalShow(people) {
        return new Promise ((resolve, reject) => {
            
            modalPeople.classList.remove("disnone");
            const modalName = document.querySelector("#name");
            const modalBirthYear = document.querySelector("#birth-year");
            const modalGender = document.querySelector("#gender");
            const modalFilms = document.querySelector("#films");
            const modalPlanetPeople = document.querySelector("#planet-people");
            const modalSpecies = document.querySelector("#species");
        
                    modalName.innerHTML = people.name;
                    modalBirthYear.innerHTML = people.birth_year;
                    modalGender.innerHTML = people.gender;
                    // modalFilms.innerHTML = `<ul>${getFilms(people.films)}</ul>`;
                    getFilms(people.films).then((data) => {
                        let strFilms = "";
                        for (let i = 0; i < data.length; i++) {
                            strFilms += `<li>${data[i]}</li>`;
                        }
                        modalFilms.innerHTML = strFilms;
                    })
                    getPlanet(people.homeworld).then((data) => {
                        modalPlanetPeople.innerHTML = data;
                    });
                    getSpecies(people.species).then((data) => {
                        modalSpecies.innerHTML = data;
                    });
                    resolve();
        })
                            
    }

    function getPlanet(homeworldUrl) {
        return new Promise((resolve, reject) => {
            fetch(homeworldUrl).then((respons) => respons.json())
            .then((data) => {
                resolve(data.name);
            })
        })
        
    }

    function getSpecies(speciesUrl) {
        return new Promise((resolve, reject) => {
            fetch(speciesUrl).then((respons) => respons.json())
            .then((data) => {
                resolve(data.name);
            })
        })
    }
    function getFilms(filmsUrl) {
        let arrFilms = [];
        return new Promise((resolve, reject) => {     
            filmsUrl.forEach((element) => {
            fetch(element).then((respons) => respons.json())
            .then((data) => {
                arrFilms.push(data.title);
                resolve(arrFilms);
            })   
        },);
        })       
    }
    

    

});