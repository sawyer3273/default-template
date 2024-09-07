import type { RouteConfig } from '../routes/resourceHelper'
import type { Request, Response, NextFunction } from 'express'
import { errorHandler } from '../middlewares/errorHandler';
import prisma from "../../tools/prisma";
import { afterSignupAuth } from '../middlewares/signupAuth';
//@ts-ignore
import { Scraper, Root, DownloadContent, OpenLinks, CollectContent } from 'nodejs-web-scraper'


function sleep(ms: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const saveLinks2 = async (req: Request, res: Response, next: Function) => {
  try {
    let origins = [
      'https://hdrezka0ddqyq.org/films/best/page/1/',
    ]

    let total = 0
          
    for (let i = 0; i < origins.length; i++) {
        let origin = origins[i]
        const config = {
          baseSiteUrl: origin,
          startUrl: origin,
          concurrency: 10,//Maximum concurrent jobs. More than 10 is not recommended.Default is 3.
          maxRetries: 3,//The scraper will try to repeat a failed request few times(excluding 404). Default is 5.       
          logPath: './logs/'//Highly recommended: Creates a friendly JSON for each operation object, with all the relevant data. 
        }
        const scraper = new Scraper(config);
        const root = new Root();
        const data = new CollectContent('.b-content__inline_item-link', { name: 'data', contentType:'html' });

        root.addOperation(data);
        await scraper.scrape(root);
        const links = data.getData();
  
      //  console.log('links', links)
        
        for (let j = 0; j < links.length; j++) {
          console.log('jjjjjj', j)
            let name = links[j].split('">')[1].split('</a> <di')[0]
            let link = links[j].split('href="')[1].split('">')[0]
            let label = links[j].split('</a> <div>')[1].split('</div>')[0]
            let year = label.split(',')[0]

            let country = label.split(', ')[1].split(',')[0]
            
            console.log('one', name, link, label, year)
            
            if (!label.includes('Документальные') && !label.includes('Театр') && !label.includes('Концерт')) {
              let movieObj2 = await prisma.movie.findFirst({
                where: {
                      title: name,
                      year: parseInt(year),
                  }
              });
  console.log('try find movie', {
    title: name,
    year: parseInt(year),
})
              if (!movieObj2) {


                const config = {
                  baseSiteUrl: link,
                  startUrl: link,
                  concurrency: 10,//Maximum concurrent jobs. More than 10 is not recommended.Default is 3.
                  maxRetries: 3,//The scraper will try to repeat a failed request few times(excluding 404). Default is 5.       
                  logPath: './logs/'//Highly recommended: Creates a friendly JSON for each operation object, with all the relevant data. 
                }
                const scraper = new Scraper(config);
                const root = new Root();
                const origin = new CollectContent('.b-post__origtitle', { name: 'origin'});

                const actor = new CollectContent('.persons-list-holder .item', { name: 'actor' });
        
                root.addOperation(origin);
                root.addOperation(actor);
          
              await scraper.scrape(root);
          
                const origins = origin.getData();
                const actors = actor.getData();
          
                console.log('movies', name)
                console.log('origins', origins)
                console.log('actors', actors)
                console.log('year', year)



                let movie_id
                let movieObj = await prisma.movie.findFirst({
                  where: {
                        title: name,
                        origin: origins[0] ? origins[0]: name,
                        director: actors[0],
                        year: parseInt(year),
                    }
                });
                
                if (!movieObj) {
                  let newData = await prisma.movie.create({ data:{
                    title: name,
                    origin: origins[0] ? origins[0]: name,
                    director: actors[0],
                    year: parseInt(year),
                    country
                  }});
                  console.log('newMovie', newData)
                  
                  movie_id = newData.id
                  await prisma.library.create({
                    data: {
                          word: name,
                          type: 'movie',
                          translation: origins[0],
                          movie_id: newData.id,
                          additionalData: year,
                      }
                  });
                
          
          
          
          
                for (let i = 1; i < actors.length; i++) {
                  let one = actors[i]
                  if (one.includes(',')) {
                    one = actors[i].split(',')[0]
                  }
                  let actorObj = await prisma.person.findFirst({
                    where: {
                          name: one,
                          role: 'actor',
                      }
                  });
                  if (!actorObj) {
                    let newData = await prisma.person.create({data:{
                      name: one,
                      role: 'actor',
                    }});
                    let newDataCast = await prisma.cast.create({data:{
                      person_id: newData.id,
                      movie_id: movie_id,
                    }});
                    console.log('newActor', newData)
                    await prisma.library.create({
                      data: {
                            word: one,
                            type: 'person',
                            translation: one,
                            person_id: newData.id,
                        }
                    });
                  }  
                }
          
          
          
                let direc = actors[0]
                  let directorObj = await prisma.person.findFirst({
                    where: {
                          name: direc,
                          role: 'director',
                      }
                  });
                  if (!directorObj) {
                    let newDataDirec = await prisma.person.create({data:{
                      name: direc,
                      role: 'director',
                    }});
                    console.log('new director', newDataDirec)
                    let newDataCast = await prisma.cast.create({data:{
                      person_id: newDataDirec.id,
                      movie_id: movie_id,
                    }});
                    await prisma.library.create({
                      data: {
                            word: direc,
                            type: 'person',
                            translation: direc,
                            person_id: newDataDirec.id,
                        }
                    });
                  }  
                }
          
          




              }
            } else {
              console.log('this is doc', name)
            }
            
        }
        
        console.log('sleep')
        await sleep(2000);
  }

  console.log('finish', total)

  } catch (error) {
    console.log('error',error)
    return errorHandler(error, req, res)
  }
}

export const saveLinks = async (req: Request, res: Response, next: Function) => {
  try {
    let origins = [
      'https://ru.kinorium.com/collections/kinopoisk/77/',
      'https://ru.kinorium.com/collections/kinopoisk/197/',
      'https://ru.kinorium.com/collections/kinopoisk/284/',
      'https://ru.kinorium.com/collections/kinopoisk/62/',
      'https://ru.kinorium.com/collections/kinopoisk/235/',
      'https://ru.kinorium.com/collections/kinopoisk/36/',
      'https://ru.kinorium.com/collections/kinopoisk/91/',
      'https://ru.kinorium.com/collections/kinopoisk/68/',
      'https://ru.kinorium.com/collections/kinopoisk/1121/',
      'https://ru.kinorium.com/collections/kinopoisk/1092/',
      'https://ru.kinorium.com/collections/kinopoisk/244/',
      'https://ru.kinorium.com/collections/kinopoisk/214/',
      'https://ru.kinorium.com/collections/kinopoisk/96/',
      'https://ru.kinorium.com/collections/kinopoisk/116/',
      'https://ru.kinorium.com/collections/kinopoisk/93/',
      'https://ru.kinorium.com/collections/kinopoisk/298/',
      'https://ru.kinorium.com/collections/kinopoisk/232/',
      'https://ru.kinorium.com/collections/kinopoisk/268/',
      'https://ru.kinorium.com/collections/kinopoisk/35/',
      'https://ru.kinorium.com/collections/kinopoisk/228/',
      'https://ru.kinorium.com/collections/kinopoisk/50/',
      'https://ru.kinorium.com/collections/kinopoisk/144/',
    ]

    let total = 0
          
    for (let i = 0; i < origins.length; i++) {
        let origin = origins[i]
        const config = {
          baseSiteUrl: origin,
          startUrl: origin,
          concurrency: 10,//Maximum concurrent jobs. More than 10 is not recommended.Default is 3.
          maxRetries: 3,//The scraper will try to repeat a failed request few times(excluding 404). Default is 5.       
          logPath: './logs/'//Highly recommended: Creates a friendly JSON for each operation object, with all the relevant data. 
        }
        const scraper = new Scraper(config);
        const root = new Root();
        const link = new CollectContent('.filmList__item-wrap-title', { name: 'link', contentType:'html' });

        root.addOperation(link);
        await scraper.scrape(root);
        const links = link.getData();
  
        console.log('links', links)
        
        for (let j = 0; j < links.length; j++) {
            let one = links[j].split('href="/')[1].split('/" clas')[0]
            console.log('one',one)
            
            let obj = await prisma.link.findFirst({
              where: {
                url: one,
                }
            });
            
            if (!obj) {
              total++
              await prisma.link.create({ data:{
                url: one,
              }});
            }
          
        }
        
        console.log('sleep')
        await sleep(2000);
  }

  console.log('finish', total)

  } catch (error) {
    console.log('error',error)
    return errorHandler(error, req, res)
  }
}
export const scrap = async (req: Request, res: Response, next: Function) => {
  try {
    let links = await prisma.link.findMany();
    console.log('links,links',links)

    for (let j = 1000; j < links.length; j++) {

      console.log('sleep', j)
        await sleep(100);


      let link = links[j]

    
    const config = {
     // baseSiteUrl: `https://ru.kinorium.com/collections/kinorium/300/?order=sequence&page=1&perpage=50&show_viewed=1`,
     // startUrl: `https://ru.kinorium.com/collections/kinorium/300/?order=sequence&page=1&perpage=50&show_viewed=1`,
      baseSiteUrl: `https://ru.kinorium.com/${link.url}/`,
      startUrl: `https://ru.kinorium.com/${link.url}/`,
      concurrency: 10,//Maximum concurrent jobs. More than 10 is not recommended.Default is 3.
      maxRetries: 3,//The scraper will try to repeat a failed request few times(excluding 404). Default is 5.       
      logPath: './logs/',//Highly recommended: Creates a friendly JSON for each operation object, with all the relevant data. 
   //  proxy: 'http://fr5VrVwg:QjhN819A@45.147.12.122:62500'
    }

    const scraper = new Scraper(config);
    const root = new Root();
  //  const movie = new OpenLinks('.filmList__item-title-link',{name:'movie'});
    const title = new CollectContent('.film-page__title-text', { name: 'title' });
    const origin = new CollectContent('.film-page__orig_with_comment', { name: 'origin' });
    const actor = new CollectContent('.film-page__main-cast-info .cast__name-wrap_cut:not(.character)', { name: 'actor' });
    const character = new CollectContent('.character', { name: 'character' });
    const director = new CollectContent('.role.actor_list:first-child .cast__name-wrap', { name: 'director' });
    const year = new CollectContent('.film-page__date a', { name: 'year' });

   
    
    
      //root.addOperation(movie);
      root.addOperation(title);
      root.addOperation(origin);
      root.addOperation(actor);
      root.addOperation(character);
      root.addOperation(director);
      root.addOperation(year);

    await scraper.scrape(root);

      const movies = title.getData();
      const origins = origin.getData();
      const actors = actor.getData();
      const characters = character.getData();
      const directors = director.getData();
      const years = year.getData();

      console.log('movies', movies)
      console.log('origins', origins)
      console.log('actors', actors)
      console.log('characters', characters)
      console.log('director', directors)
      console.log('year', years)

      
      if (!movies.length) {
        return
      }

      let movie_id
      let movieObj = await prisma.movie.findFirst({
        where: {
              title: movies[0],
              origin: origins[0] ? origins[0]: movies[0],
              director: directors[0],
              year: parseInt(years[0]),
          }
      });
      
      if (!movieObj) {
        let newData = await prisma.movie.create({ data:{
          title: movies[0],
          origin: origins[0] ? origins[0]: movies[0],
          director: directors[0],
          year: parseInt(years[0]),
        }});
        console.log('newMovie', newData)
        
        movie_id = newData.id
        await prisma.library.create({
          data: {
                word: movies[0],
                type: 'movie',
                translation: origins[0],
                movie_id: newData.id,
                additionalData: years[0],
            }
        });
      




      for (let i = 0; i < actors.length; i++) {
        let one = actors[i]
        let actorObj = await prisma.person.findFirst({
          where: {
                name: one,
                role: 'actor',
            }
        });
        if (!actorObj) {
          let newData = await prisma.person.create({data:{
            name: one,
            role: 'actor',
          }});
          let newDataCast = await prisma.cast.create({data:{
            person_id: newData.id,
            movie_id: movie_id,
          }});
          console.log('newActor', newData)
          await prisma.library.create({
            data: {
                  word: one,
                  type: 'person',
                  translation: one,
                  person_id: newData.id,
              }
          });
        }  
      }



      let direc = directors[0]
        let directorObj = await prisma.person.findFirst({
          where: {
                name: direc,
                role: 'actor',
            }
        });
        if (!directorObj) {
          let newDataDirec = await prisma.person.create({data:{
            name: direc,
            role: 'director',
          }});
          console.log('new director', newDataDirec)
          let newDataCast = await prisma.cast.create({data:{
            person_id: newDataDirec.id,
            movie_id: movie_id,
          }});
          await prisma.library.create({
            data: {
                  word: direc,
                  type: 'person',
                  translation: direc,
                  person_id: newDataDirec.id,
              }
          });
        }  


        for (let i = 0; i < characters.length; i++) {
          let one = characters[i]
          
          
            await prisma.library.create({
              data: {
                    word: one,
                    type: 'character',
                    translation: one,
                    additionalData: actors[i],
                }
            });
        }
  





      }

      await prisma.link.delete({
        where: {
          id: link.id,
        },
      })




    }
    console.log('finish')
    return res.json({
        success: true,
        message: 'test'
    })
  } catch (error) {
    console.log('error',error)
    return errorHandler(error, req, res)
  }
};



// Mounted in routes.ts
export const routes: RouteConfig = {
  routes: [
    { method: 'post', path: '/scrap', handler: [afterSignupAuth,  scrap] },
    { method: 'post', path: '/saveLinks', handler: [afterSignupAuth,  saveLinks] },
    { method: 'post', path: '/saveLinks2', handler: [afterSignupAuth,  saveLinks2] },


  ],
}

export default routes
