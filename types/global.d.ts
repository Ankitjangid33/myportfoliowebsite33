import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof mongoose | null;
    promise: ReturnType<typeof mongoose.connect> | null;
  };
}

export {};
