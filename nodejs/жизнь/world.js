let intervalID;

function drawWorld() {
	let result = "<tbody>";
	let arr = getGeneration();
	for (var i = 0; i < arr.length; i++) {
		result += "<tr>";//строка табл.
		for (var j = 0; j < arr[i].length; j++) {
			result += drawCell(arr[i][j]);
		}
		result += "</tr>";
	}
	result += "</tbody>";
	return result;
}

function drawCell(cell) {
	let cl = '';
	if (cell.isAlive) {
		cl = ' class="alive"'
	}
	return '<td><div' + cl + ' x=' + cell.x + ' y=' + cell.y + ' onclick="changeCell(this);">&nbsp;</div></td>'; 
	//Предназначен для создания одной ячейки таблицы. Тег <td> должен размещаться внутри контейнера <tr>, который в свою очередь располагается внутри тега <table>.
}

function newWorld() {
	let height = parseInt(document.getElementById("height").value);//getElementById Метод возвращает объект Document, представляющий элемент, свойство которого соответствует указанной строке.
	let width = parseInt(document.getElementById("width").value);
	//Функция parseInt()анализирует строковый аргумент и возвращает целое число по указанной системе счисления (основание в математических системах счисления).
	initGeneration(height, width);
	refreshWorld();
}

function refreshWorld() {
	let table = document.getElementById("world");
	table.innerHTML = drawWorld();
}

function next() {
	newGeneration();
	refreshWorld();
}

function go() {
	stop();
	intervalID = setInterval('next()', 100); // Метод setInterval(), предлагаемый на интерфейсах Windowи Worker, многократно вызывает функцию или выполняет фрагмент кода с фиксированной задержкой по времени между каждым вызовом.
}

function stop() {
	clearInterval(intervalID);//Функция clearInterval() отменяет многократные повторения действий, установленные вызовом функции setInterval()
}

function random() {
	initRandom(); // зап. табл. рандомом
	refreshWorld();//обнови табл
}

function changeCell(elem) {
	changeGeneration(parseInt(elem.getAttribute("x")), parseInt(elem.getAttribute("y"))); // Метод getAttribute()интерфейса Elementвозвращает значение указанного атрибута элемента.
	refreshWorld();
}

function clearW(){
	location.reload();
}
