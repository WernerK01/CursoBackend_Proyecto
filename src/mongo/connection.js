import mongoose from 'mongoose';
import 'dotenv/config';

export const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { dbName: 'BackEndOneDB' });
        console.log('[MONGO CONNECTION]: Successful');
    } catch (err) {
        console.log(`[MONGO CONNECTION ERROR]: ${err.message}`);
    }
}