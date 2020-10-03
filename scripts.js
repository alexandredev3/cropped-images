const photoFile = document.getElementById('photo-file');
let imagePreview = document.getElementById('photo-preview');
let image;
let photoName;
let previousImage;

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

    photoName = file.name;
    // file.name vai retorna o nome do arquivo.

    // ler um arquivo
    let reader = new FileReader(); // FileReader: leitor de arquivos do navegador.
    reader.readAsDataURL(file); // ele vai ler os arquivos.(do tipo blob)
    reader.onload = function (event) {
      // quando ele tiver feito o carregamendo da imagem, ele vai executar essa função.

      image = new Image(); // criando uma nova imagem.
      image.src = event.target.result;
      /* estou pegando o resultado do carregamento da imagem que e a image, 
      e colocando no source da imagem la no HTML. */
      image.onload = onLoadImage; // quando ele carregar a imagem ele vai chamar essa função.

      message.style.display = 'flex';
    };
  }); // sempre que ouver uma alteração no photoFile vai executar essa função.
});

// Selection Tool;
const selection = document.getElementById('selection-tool');
const message = document.getElementById('message');

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
    message.innerHTML = 'Selecione a parte da imagem que deseja cortar.';
  },
  mousedown() {
    message.innerHTML = 'Mova seu mouse para selecionar.';

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

      message.innerHTML = 'Solte o clique para terminar a seleção.';
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

    cropButton.style.display = 'initial';
    message.style.display = 'none';
    message.innerHTML = '';
  },
};

// Object.keys estou pegando as chaves de um objeto, que no caso são as funções, e colocando dentro de uma Array.
Object.keys(events).forEach((eventName) => {
  // console.log(eventName);
  // // mesma coisa de event.mouseover, event.mousedown e etc...
  // console.log(events[eventName]);

  // e a mesma coisa de fazer add.addEventListener('mouseover', function() {})
  // events[eventName] ele retorna uma função.
  imagePreview.addEventListener(eventName, events[eventName]);
});

// Canvas (Cortar a imagem)
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
/**
 * "ctx" e o contexto do convas.
 * o canvas precisa de um contexto.
 */

function onLoadImage() {
  const { width, height } = image;

  previousImage = image;

  canvas.width = width;
  canvas.height = height;

  // limpando o contexto
  ctx.clearRect(0, 0, width, height);
  /**
   * O primeiro "0" e o eixo "X";
   * O segundo "0" e o eico "Y";
   * O terceiro parametro e a largura que vc quer usar.
   * O quarto parametro e a altura que vc quer usar.
   */

  // desenhando a imagem no contexto.
  ctx.drawImage(image, 0, 0);
  /**
   * Como "primeiro" parametro, e a imagem que queremos que o canvas desenhe.
   * Como "segundo" parametro, e a "largura" que começa de desenhar.
   * Como "terceiro" parametro, e a "altura" que termina de desenhar.
   */

  imagePreview.src = canvas.toDataURL();
  // toDataURL: ele vai pegar os dados dentro do canvas e transformar em uma url que colocar dentro do source da img.
}

// Cortar Imagem
const cropButton = document.getElementById('crop-image');

cropButton.onclick = () => {
  const { width: imgWidth, height: imgHeight } = image;
  const { width: previewWidth, height: previewHeight } = imagePreview;

  // o sinal de "+" na frente, e para garantir que vai se retornado um numero.
  const [widthFactor, heightFactor] = [
    +(imgWidth / previewWidth),
    +(imgHeight / previewHeight),
  ];

  // pegando o width do selection e substuindo o px por nada, para retornar apenas o numero.
  const [selectionWidth, selectionHeight] = [
    +selection.style.width.replace('px', ''),
    +selection.style.height.replace('px', ''),
  ];

  const [croppedWidth, croppedHeight] = [
    +(selectionWidth * widthFactor),
    +(selectionHeight * heightFactor),
  ];

  // pegando o tamanho real da imagem, antes do corte, para passar no contexto do canvas.
  const [actualX, actualY] = [
    +(relativeStartX * widthFactor),
    +(relativeStartY * heightFactor),
  ];

  // pegar do ctx a imagem cortada.
  const croppedImage = ctx.getImageData(
    actualX,
    actualY,
    croppedWidth,
    croppedHeight
  );

  // limpando contexto do canvas
  // estou matendo o width e o height da imagem
  ctx.clearRect(0, 0, ctx.width, ctx.height);

  // ajustando as proporciões
  image.width = canvas.width = croppedWidth;
  image.height = canvas.height = croppedHeight;

  // adicionando a imagem cortada ao contexto do canvas.
  ctx.putImageData(croppedImage, 0, 0);

  // escondendo a ferramenta de seleção.
  selection.style.display = 'none';

  // atualizando foto no preview
  imagePreview.src = canvas.toDataURL();

  downloadButton.style.display = 'initial';
};

// Download
const downloadButton = document.getElementById('download');

downloadButton.onclick = function () {
  const a = document.createElement('a');
  a.download = photoName + '-cropped.png';
  // na parte de escolher o nome do arquivo, vai começar com o nome da imagem, e na frente -cropped.png
  a.href = canvas.toDataURL(); // estou colocando a imagem que esta no canvas, no link de download.
  a.click();
};
