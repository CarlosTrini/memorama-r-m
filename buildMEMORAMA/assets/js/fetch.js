const getCharacterApi = async(ids) => {
   const url = `https://rickandmortyapi.com/api/character/${ids}`;   
   try {
      const consult = await fetch(url);
      const data = await consult.json();
      const characters =  await data.map(c => c.image);
      return characters;
      } catch (error) {
      console.error(error);
   }
}


export {
   getCharacterApi
}