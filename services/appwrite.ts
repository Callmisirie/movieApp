import { Client, Databases, ID, Query } from "appwrite";

import Constants from "expo-constants";

const DATABASE_ID = Constants.expoConfig?.extra?.appwriteDatabaseId!;
const COLLECTION_ID = Constants.expoConfig?.extra?.appwriteCollectionId!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(Constants.expoConfig?.extra?.appwriteProjectId!)

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => { 
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query)
    ]);
  
    if(result.documents.length > 0) {
      const existingMovie = result.documents[0];
  
      await database.updateDocument(
        DATABASE_ID, 
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1
        }
      )
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),
      {
        searchTerm: query, 
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      });
    }
    
  } catch (error) {
    console.log(error);
    throw error;
  }

  // check if a record of that search has alreaady been stored
  // if a document is found increment the searchCount field
  // if not document is found create a new document in AppWrite DB -> 1
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
}