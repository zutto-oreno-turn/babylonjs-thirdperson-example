import { Game } from './game';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  new Game(canvas);
});
