const input = document.getElementById('input-url');
const createButtonMobile = document.getElementById('button-create-mobile');
const createButtonDesktop = document.getElementById('button-create-desktop');
createButtonMobile.addEventListener('click', getValueInput);
createButtonDesktop.addEventListener('click', getValueInput);

// URL validation with regex
function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
};

//Clear input from URL
function clearInput() {
    input.value = '';
};

//Takes input value and converts to base64 and creates element in html
function getValueInput() {

    const containerQrcode = document.getElementById('container-qrcode');
    let sizeImage = document.getElementById("input-image-width");

    containerQrcode.innerHTML = `
        <div class="lds-ripple">
            <div></div>
            <div></div>
        </div>`

    if (validateUrl(input.value) == true) {
        generateQrcode(sizeImage.value, input.value)
            .then((data) => {

                let urlApi = data.url;
                containerQrcode.innerHTML = `
                
                    <div class="outline-qrcode " data-aos="flip-left" data-aos-duration="2000" style="width:${parseInt(sizeImage.value) + 30}px; height:${parseInt(sizeImage.value) + 30}px;" id="outline-qrcode">

                        <canvas id="canvas" class='qrcode' width="${sizeImage.value}" height="${sizeImage.value}"></canvas>
                        
                    </div>
                    <div class="container-btn-download" data-aos="flip-left" data-aos-duration="2000">
                        <button id="btn-download">Download</button>
                    </div>
                
                `;

                getBase64FromUrl(urlApi).then((base64) => {
                    console.log(base64)
                    const canvas = document.getElementById('canvas')
                    const ctx = canvas.getContext('2d')
                    const btnDownload = document.getElementById('btn-download')

                    let format = document.getElementById("input-image-format")

                    const formatDownload = { 'jpg': 'jpeg', 'png': 'png', 'webp': 'webp' }

                    let imagem = new Image();
                    imagem.src = base64;

                    imagem.addEventListener('load', () => {
                        ctx.drawImage(imagem, 0, 0)
                    })

                    btnDownload.addEventListener('click', () => {
                        let a = document.createElement('a')
                        a.href = canvas.toDataURL(`image/${formatDownload[format.value]}`)
                        a.download = `QrCode.${format.value}`
                        a.click()
                    })
                })
            })
            .catch((err) => {

                console.log("Erro: " + err);
                alert("Erro: " + err);
            })

    } else {

        alert("URL de formato inválido!");
        containerQrcode.innerHTML = ''
    }

    clearInput();
};

//API request with fetch
async function generateQrcode(sizeImage, urlLink) {
    let response = await fetch(`https://chart.googleapis.com/chart?chs=${sizeImage}x${sizeImage}&cht=qr&chl=${urlLink}`)
    return response
};

// Converte URL in Base64
const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
        }
    });
};

//Script tootip bootstrap
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));