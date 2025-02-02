# 2048 Game React

A modern implementation of the classic 2048 puzzle game built with React, Next.js, and TypeScript. Features smooth animations, touch support, and a responsive design.

## Features

- 🎮 Classic 2048 gameplay mechanics
- ✨ Smooth tile animations using Framer Motion
- 📱 Touch support for mobile devices
- 🎯 Score tracking with local storage for best scores
- 🎨 Beautiful UI with Tailwind CSS
- 🌗 Responsive design that works on all devices
- ⌨️ Keyboard controls (arrow keys)

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [shadcn/ui](https://ui.shadcn.com/) - UI components

## Getting Started

1. Clone the repository:
    ```sh
    git clone https://github.com/belikeadam/2048-react-game.git
    cd 2048-react-game
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Run the development server:
    ```sh
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

- Use arrow keys (↑ ↓ ← →) to move tiles
- Swipe on touch devices
- Match same numbers to combine them
- Try to reach 2048!
- Game over when no more moves are possible

## Project Structure

- `src/components/` - React components
- `src/hooks/` - Custom React hooks
- [gameLogic.ts] - Game logic implementation
- [types.ts]  - TypeScript type definitions

## Detailed Explanation

### Components

- **Board**: The main game board component that renders the grid and tiles.   
- **Tile**: Represents each tile on the board with animations.  
- **Game**: The main game component that handles game state and user interactions.  

### Hooks

- **useGame**: Custom hook that manages the game state, including the board, score, and game logic. See [useGame] 
### Utilities

- **gameLogic**: Contains functions for creating the game board, adding random tiles, moving tiles, and checking for game over. See [gameLogic] 
### Styling

- **Tailwind CSS**: Used for styling the components. Configuration can be found in [tailwind.config.ts] 
- **Global Styles**: Defined in [globals.css] 

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## Contact

For any questions or feedback, please reach out to [mohdadam020324@gmail.com] 
 
## Acknowledgements

- Inspired by the original [2048 game](https://play2048.co/).
- Thanks to the developers of the libraries and tools used in this project.