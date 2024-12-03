import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import bodyParser from 'body-parser'; 

const ScoreSchema = new mongoose.Schema({
    playerName: { type: String, required: true },
    score: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', ScoreSchema);

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://vvitsenets:budapest@cluster0.n2ow2.mongodb.net/gameScores', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../../dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.post('/save-score', async (req, res) => {
    try {
        const { playerName, score } = req.body;

        const newScore = new Score({
            playerName,
            score
        });

        await newScore.save();
        res.status(200).send({ message: 'Score saved successfully' });
    } catch (err) {
        console.error('Error saving score:', err);
        res.status(500).send({ error: 'Failed to save score' });
    }
});

app.get('/get-record', async (req, res) => {
    try {
        const highestScore = await Score.findOne().sort({ score: -1 }).exec();
        res.status(200).send(highestScore);
    } catch (err) {
        console.error('Error retrieving record:', err);
        res.status(500).send({ error: 'Failed to retrieve record' });
    }
});