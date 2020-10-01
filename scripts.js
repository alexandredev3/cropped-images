const photoFile = document.getElementById('photo-file');

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
      let image = document.getElementById('photo-preview');
      image.src = event.target.result;
      /* estou pegando o resultado do carregamento da imagem que e a image, 
      e colocando no source da imagem la no HTML. */
    };
  }); // sempre que ouver uma alteração no photoFile vai executar essa função.
});
