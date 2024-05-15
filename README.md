## <a name="introduction">🤖 Introduction</a>

## <a name="tech-stack">⚙️ Tech Stack</a>

- React Native
- Expo
- Node.js
- Express.js
- Postgres by xata

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)

**Cloning the Repository**

```bash
git clone git@github.com:dza59/flashcard-app.git
cd flashcard-app
```

**Start Backend APIs**

```bash
cd api
pnpm install
nodemon start
```

**Start Front End**

```bash
cd flashcard
pnpm install
npx expo
```

## APIs

##### Sets

| Desc             | Request |  Endpoint |
| :--------------- | :-----: | --------: |
| get all sets     |   GET   |     /sets |
| get a single set |   GET   | /sets/:id |
| create a set     |  POST   |     /sets |
| remove a set     | DELETE  | /sets/:id |

##### User Sets

| Desc                             | Request |  Endpoint |
| :------------------------------- | :-----: | --------: |
| add a set to favorites           |  POST   | /usersets |
| get all sets belongs to the user |   GET   | /usersets |
| create a set                     |  POST   |     /sets |
| remove a set                     | DELETE  | /sets/:id |

##### Cards

| Desc                                       | Request |     Endpoint |
| :----------------------------------------- | :-----: | -----------: |
| Create a new card                          |  POST   |       /cards |
| get all cards of a set                     |   GET   |       /cards |
| learn specified number of cards from a set |   GET   | /cards/learn |
| start learning progress for a user         |  POST   |   /learnings |
| get a specified user learning progress     |   GET   |   /learnings |

<h2 style="text-align: center;">
❤️ ❤️ Thank you for reading! ❤️ ❤️
</h2>
