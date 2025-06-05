// types/global.d.ts

import mongoose from 'mongoose';

declare global {
  // Hum global.mongoose ko type de rahe hain
  // Jisme conn ya promise ho sakte hain
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}
