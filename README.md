# Setup

1. **Install Node.js**  
   Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

2. **Install Yarn**  
   Install Yarn globally if you don't have it already:

   ```bash
   npm install -g yarn
   ```

3. **Install Project Dependencies**  
   Run the following command in the project directory:

   ```bash
   yarn install
   ```

4. **Setup Environment Variables**  
   Create a `.env` file in the root of the project with the following content:

   ```env
   DATABASE_URL="file:./dev.db"
   ```

5. **Initialize the database**

   ```bash
   yarn prisma generate
   ```

   ```bash
   yarn prisma migrate dev --name init
   ```

6. **Start Astrotask\***

   ```bash
   yarn dev
   ```

## Available Scripts

In the project directory, you can run:

- `yarn dev` - Starts the development server
- `yarn build` - Builds the app for production
- `yarn preview` - Previews the production build locally

- `yarn format` - Formats all source files using Prettier
- `yarn format:check` - Checks if files need formatting
- `yarn lint` - Runs ESLint to check for code issues
- `yarn lint:fix` - Automatically fixes ESLint issues where possible

- `yarn prisma generate` - Generates Prisma Client
- `yarn prisma migrate dev` - Runs database migrations in development
- `yarn prisma studio` - Opens Prisma Studio to manage database

- `yarn astro` - Access to Astro CLI commands

## To-Do

| #   | Task                       | Status |
| --- | -------------------------- | ------ |
| 1   | Dockerize project          | ❌     |
| 2   | Add tests for actions      | ❌     |
| 3   | Add tests for ui           | ❌     |
| 4   | Add description generation | ❌     |

## Struggles

Somehow Astro actions trigger page reload on form submition, I tried a lot of options to fix it, yet victory keeps avoiding me.

UPD. Well, I've just fixed it manually with addition of svelte stores
