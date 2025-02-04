import mongoose from 'mongoose';


interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}


declare global {
  let globalMongoose: GlobalMongoose | undefined;
}


export {};