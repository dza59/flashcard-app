import express from 'express';
import dotenv from 'dotenv';
import { SetsRecord, getXataClient } from './xata';
import { sets, cardsCapitals, cardsProgramming } from './seed_database';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '50mb' }));

const client = getXataClient();

//
// DB seeds: for testing purposes, remove in production
//

// GET: test creating DB seeds
app.get('/init', async (req, res) => {
  try {
    await client.db.sets.create(sets);
    await client.db.cards.create(cardsCapitals);
    await client.db.cards.create(cardsProgramming);

    res.json({ result: true });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

//
// Sets
//

// GET: get all sets
app.get('/sets', async (req, res) => {
  try {
    const sets = await client.db.sets
      .select(['id', 'title', 'description', 'image', 'cards'])
      .filter({ private: false })
      .getAll();

    res.json(sets);
  } catch (error) {
    console.error('Error fetching sets:', error);
    res.status(500).json({ error: 'Failed to fetch sets' });
  }
});

// GET: get a single set
app.get('/sets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const set = await client.db.sets.read(id);
    res.json(set);
  } catch (error) {
    console.error('Error fetching set:', error);
    res.status(500).json({ error: 'Failed to fetch set' });
  }
});

// POST: create a set
app.post('/sets', async (req, res) => {
  const { title, description, image, creator, private: isPrivate } = req.body;
  try {
    const set = await client.db.sets.create({
      title,
      description,
      private: isPrivate,
      creator,
      image: image
        ? {
            base64Content: image,
            mediaType: 'image/png',
            enablePublicUrl: true,
          }
        : null,
    });

    res.json(set);
  } catch (error) {
    console.error('Error creating set:', error);
    res.status(500).json({ error: 'Failed to create set' });
  }
});

// DELETE: remove a set
app.delete('/sets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const existingSets = await client.db.user_sets.filter({ set: id }).getAll();

    if (existingSets.length > 0) {
      const toDelete = existingSets.map((set: SetsRecord) => set.id);
      await client.db.user_sets.delete(toDelete);
    }
    await client.db.sets.delete(id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting set:', error);
    res.status(500).json({ error: 'Failed to delete set' });
  }
});

//
// User Sets
//

// POST: add a set to user favorites
app.post('/usersets', async (req, res) => {
  const { user, set } = req.body;
  try {
    const userSet = await client.db.user_sets.create({ user, set });
    res.json(userSet);
  } catch (error) {
    console.error('Error adding set to user favorites:', error);
    res.status(500).json({ error: 'Failed to add set to user favorites' });
  }
});

// GET: get all sets belonging to the user
app.get('/usersets', async (req, res) => {
  const { user } = req.query;
  try {
    const sets = await client.db.user_sets
      .select(['id', 'set.*'])
      .filter({ user: `${user}` })
      .getAll();

    res.json(sets);
  } catch (error) {
    console.error('Error fetching user sets:', error);
    res.status(500).json({ error: 'Failed to fetch user sets' });
  }
});

//
// Cards
//

// POST: create a new card
app.post('/cards', async (req, res) => {
  const { set, question, answer } = req.body;
  try {
    const card = await client.db.cards.create({ set, question, answer });

    if (card) {
      await client.db.sets.update(set, {
        cards: {
          $increment: 1,
        },
      });
    }
    res.json(card);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// GET: get all cards of a set
app.get('/cards', async (req, res) => {
  const { setid } = req.query;
  try {
    const cards = await client.db.cards
      .select(['*', 'set.*'])
      .filter({ set: setid })
      .getAll();

    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// GET: learn specified number of cards from a set
app.get('/cards/learn', async (req, res) => {
  const { setid, limit } = req.query;
  try {
    const cards = await client.db.cards
      .select(['question', 'answer', 'image'])
      .filter({ set: setid })
      .getAll();

    const randomCards = cards
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .slice(0, +limit!);

    res.json(randomCards);
  } catch (error) {
    console.error('Error fetching learn cards:', error);
    res.status(500).json({ error: 'Failed to fetch learn cards' });
  }
});

//
// Learnings
//

// POST: start learning progress for a user
app.post('/learnings', async (req, res) => {
  const { user, set, cardsTotal, correct, wrong } = req.body;
  try {
    const learning = await client.db.learnings.create({
      user,
      set,
      cards_total: +cardsTotal,
      cards_correct: +correct,
      cards_wrong: +wrong,
      score: (+correct / +cardsTotal) * 100,
    });

    res.json(learning);
  } catch (error) {
    console.error('Error starting learning progress:', error);
    res.status(500).json({ error: 'Failed to start learning progress' });
  }
});

// GET: get a specified user learning progress
app.get('/learnings', async (req, res) => {
  const { user } = req.query;
  try {
    const learnings = await client.db.learnings
      .select(['*', 'set.*'])
      .filter({ user: `${user}` })
      .getAll();

    res.json(learnings);
  } catch (error) {
    console.error('Error fetching user learning progress:', error);
    res.status(500).json({ error: 'Failed to fetch user learning progress' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
