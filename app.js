const express = require('express');
const database = require('./utils/database');
const bodyParser = require('body-parser');

const db = database();
const app = express();

const PORT = process.env.PORT || 4000;

// Bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/loan', async (req, res) => {
  const loanLimit = 1000;
  try {
    const findEmailRes = await db.findByEmail(req.body.email);
    const currentLoanAmount = await db.getCurrentLoanAmount();
    // Check if post request will put loans over the limit
    if (currentLoanAmount + req.body.amount > loanLimit) {
      return res.status(403).send({ error: 101 });
    }
    // If user exists add to amount
    if (findEmailRes) {
      return res
        .status(201)
        .send(
          await db.setByEmail(req.body.email, findEmailRes + req.body.amount)
        );
    }
    // Else create new user
    return res
      .status(201)
      .send(await db.setByEmail(req.body.email, req.body.amount));
  } catch (err) {
    console.log(err);
  }
});

app.post('/payments', async (req, res) => {
  try {
    const findEmailRes = await db.findByEmail(req.body.email);
    if (findEmailRes) {
      return findEmailRes < req.body.amount
        ? res.status(403).send({ error: 100 })
        : res
            .status(201)
            .send(
              await db.setByEmail(
                req.body.email,
                findEmailRes - req.body.amount
              )
            );
    }

    return res.status(403).send({ error: 101 });
  } catch (err) {
    console.log(err);
  }
});

app.post('/information', async (req, res) => {
  // Return user amount info
  try {
    const userEmail = await db.findByEmail(req.body.email);
    res.status(200).send({ amount: userEmail });
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
