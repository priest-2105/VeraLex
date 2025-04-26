import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const apiEndpoint = import.meta.env.VITE_APPWRITE_API_ENDPOINT;

if (!projectId || !apiEndpoint) {
  throw new Error("Appwrite Project ID or API Endpoint is not configured in environment variables.");
}

client
    .setEndpoint(apiEndpoint) 
    .setProject(projectId);    

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export default client; 