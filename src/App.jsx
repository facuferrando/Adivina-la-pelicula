import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState([]);
  const [inc, setInc] = useState('')
  const [pista, setPista] = useState(false);
  const [contador, setContador] = useState(0)
  function getRandomMovie(pelis) { return pelis.results[Math.floor(Math.random() * pelis.results.length)] }//obtengo alguno de los resultados de manera aleatoria
  const [vidas, setVidas] = useState(3)
  const [idioma, setIdioma] = useState('Español')
  const [overview, setOverview] = useState('')


  function cambiarIdioma() {
    if (pista) handlePista()
    if (idioma == 'Inglés') setIdioma('Español')
    if (idioma == 'Español') setIdioma('Inglés')
  }
  function incompleto(peli) {
    let puedenFaltar = [] // Una matriz con los lugares ocupados por letras
    for (let k = 0; k < peli.length; k++) {
      if (peli[k] != ' ') { puedenFaltar = [...puedenFaltar, peli[k]] }
    }

    let faltantes = Math.floor(puedenFaltar.length / 2);
    let faltan = [] //Este es el array con las posiciones faltantes
    for (let j = 0; j < faltantes; j++) {
      faltan = [...faltan, puedenFaltar[Math.floor(Math.random() * puedenFaltar.length)]]
    }
    let modificada = [] //este es el array con la palabra modificada, las letras faltantes son asteriscos (*)

    for (let i = 0; i < peli.length; i++) {
      if (faltan.includes(peli[i]))
        modificada[i] = '_'
      else
        modificada[i] = peli[i]
    }


    return modificada.join('')


  }


  //options es donde se guarda el bearer Key

  function buscarPeli() {
    idioma == 'Español' && fetch('https://api.themoviedb.org/3/movie/top_rated?language=es-ES&page=1', options)
      .then(response => response.json())
      .then(response => {
        let objPelicula = getRandomMovie(response)
        setData(objPelicula);
        setInc(incompleto(objPelicula.title))
        setOverview(objPelicula.overview)
      }
      )
      .catch(err => console.error(err));
    idioma == 'Inglés' && fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
      .then(response => response.json())
      .then(response => {
        let objPelicula = getRandomMovie(response)
        setData(objPelicula);
        setInc(incompleto(objPelicula.title))
        setOverview(objPelicula.overview)
      }
      )
      .catch(err => console.error(err));
  }
  function handleSubmit(e) {
    event.preventDefault()
    const formData = new FormData(e.currentTarget)
    const guess = formData.get('adivina')
    if (guess.toLowerCase() == data.title.toLowerCase()) {
      setContador(contador + 1);
      console.log(contador)
      if (pista) handlePista()
      e.target.reset()

      buscarPeli()
    }
    else {
      setVidas(vidas - 1);
      console.log(contador)
      if (pista) handlePista()
      e.target.reset()

      buscarPeli()
    }
  }

  function handlePista() {
    pista ? setPista(false) : setPista(true)
  }
  function showPista() {
    if (pista == true) return <p className='flex max-w-full mx-2 text-black bg-white'>{overview}</p>
  }

  function showPremio() {
    if (contador < 2) return (<img width={"150px"} src='fase1.png' />)
    if (contador >= 1 && contador < 3) return (<img width={"150px"} src='fase2.png' />)
    if (contador >= 3) return (<img width={"150px"} className="" src='fase3.png' />)
  }

  useEffect(() => {
    buscarPeli()

  }, [idioma])

  function showVidas() {
    if (vidas == 3) return (<p className='text-red-700 bg-white'> ♥ ♥ ♥ </p>)
    if (vidas == 2) return (<p className='text-red-700 bg-white'> ♥ ♥ </p>)
    if (vidas == 1) return (<p className='text-red-700 bg-white'> ♥</p>)
    if (vidas == 0) { setContador(0); setVidas(3); if (idioma == 'Inglés') { alert("You've run out of lives 💔") } else (alert('Te quedaste sin vidas 💔')) }
  }

  return (
    <>
      <section className='w-full h-screen flex  items-center flex-col gap-2 bg-[url(/background.png)]'>
        {(idioma == 'Inglés') && <h1 className='text-black text-4xl bg-white'>¡Welcome to "Guess the movie"!</h1>}
        {(idioma == 'Español') && <h1 className='text-black text-4xl bg-white'>¡Bienvenido a "Adivina la película!"</h1>}
        {(idioma == 'Español') && <img src='/EN.png' width='50px' onClick={cambiarIdioma} className='flex self-end pr-4 bg-white cursor-pointer'></img>}
        {(idioma == 'Inglés') && <img src='/ES.png' width='50px' onClick={cambiarIdioma} className='flex self-end pr-4 bg-white cursor-pointer'></img>}
        <div>
          <br />
          <div className='flex gap-2 flex-wrap'>
            {inc.split('').map(letra => {
              return (
                <p key={Math.random()} className=' bg-fuchsia-700 rounded-lg text-white w-8 p-2 flex justify-center items-center h-8'>{letra}</p>
              )
            })}
          </div>

        </div>
        <form onSubmit={handleSubmit} className=' max-w-72 rounded-lg flex flex-col items-center' >
          <input className='bg-slate-400 rounded-lg m-2 p-1 text-center text-white' autoComplete='off' type='text' name='adivina' />
          {(idioma == 'Inglés') && <button className='text-white p-2 bg-black rounded-lg m-2'>¡Try your luck!</button>}
          {(idioma == 'Español') && <button className='text-white p-2 bg-black rounded-lg m-2'>¡Prueba tu suerte!</button>}

        </form>
        {(idioma == 'Inglés') && <button onClick={handlePista} className='rounded-lg bg-fuchsia-700 text-white p-2'>Get a hint 🔍</button>}
        {(idioma == 'Español') && <button onClick={handlePista} className='rounded-lg bg-fuchsia-700 text-white p-2'>Obtener una pista🔍</button>}

        {showVidas()}
        {(idioma == 'Inglés') && <p className='text-black bg-white'>¡You've guessed {contador} movies!  </p>}
        {(idioma == 'Español') && <p className='text-black bg-white'>¡Adivinaste {contador} películas!  </p>}

        {showPremio()}
        {pista && <p className='bg-white text-black '> {overview}</p>}
        <p className='bg-white flex gap-1'>By <a target='_blank' className='flex' href='https://github.com/facuferrando'>Facu <img width={"25px"} src='/github.png' /></a></p>
      </section >

    </>
  )
}


export default App

//