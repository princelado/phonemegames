# Assessment 2 walkthrough checklist

1. Run `docker compose up --build`.
2. Open `http://localhost:3001/health` and show `status: ok` and `database: connected`.
3. Open `http://localhost:3000/manage`.
4. Create a word containing a multi-character phoneme, for example `chin` with `tʃ ɪ n`.
5. Edit the word, then show the updated value.
6. Create a saved Wordle or Word Search configuration using database words.
7. Open the Wordle page, select a stored configuration/word and demonstrate the game.
8. Download the standalone Wordle HTML and open it.
9. Open Word Search and demonstrate that its stored configuration is loaded from the backend.
10. Show `api/prisma/schema.prisma` and briefly explain Word -> WordPhoneme -> Phoneme and Activity -> ActivityWord -> Word.
11. Show `docker-compose.yml` and identify frontend, API and PostgreSQL as the three services.
12. Show the GitHub repository and recent commits.
