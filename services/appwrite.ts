import { Client, Databases, Query } from "appwrite";

import Constants from "expo-constants";

const DATABASE_ID = Constants.expoConfig?.extra?.appwriteDatabaseId!;
const COLLECTION_ID = Constants.expoConfig?.extra?.appwriteCollectionId!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(Constants.expoConfig?.extra?.appwriteProjectId!)

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => { 
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal("searchTerm", query)
  ]);

  console.log(result);

  // check if a record of that search has alreaady been stored
  // if a document is found increment the searchCount field
  // if not document is found create a new document in AppWrite DB -> 1
}