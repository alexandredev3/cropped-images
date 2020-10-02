const photoFile = document.getElementById('photo-file');
let image = document.getElementById('photo-preview');

// Selection And Preview-image;

document.getElementById('select-image').onclick = function () {
  // eu estou pegando o input com o id "photo-file" e dando um clique.
  photoFile.click();
};

window.addEventListener('DOMContentLoaded', () => {
  // so vai executar essa função quando toda a DOM for carregada.
  photoFile.addEventListener('change', () => {
    let file = photoFile.files.item(0);
    /**
     * photoFile.files e onde ficam os arquivos selecionado do input file.
     * files.item(0): como eu so tenho um arquivo, estou pegando ele na posição "0".
     */

    // ler um arquivo
    let reader = new FileReader(); // FileReader: leitor de arquivos do navegador.
    reader.readAsDataURL(file); // ele vai ler os arquivos.(do tipo blob)
    reader.onload = function (event) {
      // quando ele tiver feito o carregamendo da imagem, ele vai executar essa função.
      image.src = event.target.result;
      /* estou pegando o resultado do carregamento da imagem que e a image, 
      e colocando no source da imagem la no HTML. */
    };
  }); // sempre que ouver uma alteração no photoFile vai executar essa função.
});

// Selection Tool;
const selection = document.getElementById('selection-tool');

let startX,
  startY,
  relativeStartX,
  relativeStartY,
  endX,
  endY,
  relativeEndX,
  relativeEndY;

let startSelection = false;
/**
 * Se for "true", quer dizer que esta selecionando;
 * Se for "false", quer dizer que não esta selecionando;
 * isso e uma "Flag", Flag na programação quer dizer que e para "sinalizar coisas".
 */

const events = {
  mouseover() {
    this.style.cursor = 'crosshair';
    // o this da pegando a variavel image, e o target.
  },
  mousedown() {
    const { clientX, clientY, offsetX, offsetY } = event;
    // console.table({
    //   Client: [clientX, clientY],
    //   Offset: [offsetX, offsetY],
    // });
    /**
     * clientX: E o posicionamento "Absoluto" do eixo "X".
     * offsetX: E o posicionamento "Relativo" do eixo "X".
     * O "Absoluto" e a pagina inteira ate o preview da imagem.
     * O "Relative" e o preview da imagem inteira.
     */

    startX = clientX;
    startY = clientY;
    relativeStartX = offsetX;
    relativeStartY = offsetY;

    startSelection = true;
  },
  mousemove() {
    // mousemove vai retornar a posição onde o mouse parou de se mover.
    const { clientX, clientY, offsetX, offsetY } = event;

    endX = clientX;
    endY = clientY;

    // so vai ser feito as alterações no style, se o startSelection for true.
    if (startSelection) {
      selection.style.display = 'initial';
      selection.style.top = startY + 'px';
      selection.style.left = startX + 'px';

      // quando coloco Parênteses quer dizer que eu vou colocar uma expressão Matematica.
      selection.style.width = endX - startX + 'px';
      selection.style.height = endY - startY + 'px';
    }
  },
  mouseup() {
    startSelection = false;

    // posição do mouse.
    relativeEndX = event.layerX;
    relativeEndY = event.layerY;
    /**
     *  layerX: e o calculo horizontal de onde o mouse estar.
     * ele fica calculando onde o mouse esta no eixo X.
     */
  },
};

// Object.keys estou pegando as chaves de um objeto, que no caso são as funções, e colocando dentro de uma Array.
Object.keys(events).forEach((eventName) => {
  // console.log(eventName);
  // // mesma coisa de event.mouseover, event.mousedown e etc...
  // console.log(events[eventName]);

  // e a mesma coisa de fazer add.addEventListener('mouseover', function() {})
  // events[eventName] ele retorna uma função.
  image.addEventListener(eventName, events[eventName]);
});
