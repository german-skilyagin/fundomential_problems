// Класс, описывающий клетку (положение по X, Y, и состояние isAlive - жива ли клетка)
class Cell { //  для каждой клетки, 
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isAlive = false;
  }
}


let world; //двумерка со всеми клетками

let worldWidth; // ширина

let worldHeight; // длина


function initGeneration(height, width) { // создание табл.
  world = [];

  worldWidth = width;
  worldHeight = height;

  for (let i = 0; i < width; ++i) {
    world.push([]);
    // Добавляем новую строчку, в которую будем добавлять height клеток
    for (let j = 0; j < height; ++j) //заполняем мас. клетками
      world[i].push(new Cell(i, j));
  }
}


function changeGeneration(x, y) { // изменить жизнь клетки(жизнь- смерть)
  world[x][y].isAlive = !world[x][y].isAlive;
}

function getGeneration() { // возвращаем табл.
  return world; // Просто для доступа к world в произвольный момент
}


function count(x, y) { //считает кол-во живых соседей 
  let count = 0;
//Считаем число соседей для клетки на позиции x, y
  for (let i = 0; i <= 2; ++i) {
    for (let j = 0; j <= 2; ++j) {
      if (i == 1 && j == 1)
        continue;

      if (world[(worldWidth + x + i - 1) % worldWidth][(worldHeight + y + j - 1) % worldHeight].isAlive)// По модулю, так как у нас -1 -> worldWidth - 1
        ++count;
    }
  }

  return count;
}

function newGeneration() { // это старт работает зацикленно  вызывается каждую новую генерацию жизни.
  let newWorld = [];

  for (let i = 0; i < worldWidth; ++i) {
    newWorld.push([]);

    for (let j = 0; j < worldHeight; ++j)
      newWorld[i].push(new Cell(i, j));
  }

  for (let x = 0; x < worldWidth; ++x) {
    for (let y = 0; y < worldHeight; ++y) {
      let c = count(x, y);

      if (c == 3)// Если ровно три соседа - то воскрешаем клетку
        newWorld[x][y].isAlive = true;
      else if (c == 2) // Если два соседа - ничего не меняем
        newWorld[x][y].isAlive = world[x][y].isAlive;
      else // Иначе - умертвляем клетку
        newWorld[x][y].isAlive = false;
    }
  }

  world = newWorld;
  // Теперь мир это новый (перегенирированный мир)
}

function initRandom() {//
  initGeneration(worldHeight, worldWidth); // запиливаем пустую табл
  for (let i = 0; i < worldWidth; ++i)
    for (let j = 0; j < worldHeight; ++j)
      if (Math.random() < 1 / 2) // Проходя по всем клеткам воскрешаем клетки с вероятностью 1/2
        world[i][j].isAlive = true;
}
