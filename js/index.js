document.querySelector('.custom-browse-button').addEventListener('click', function () {
    document.getElementById('custom-pngInput').click();
});

document.getElementById('custom-pngInput').addEventListener('change', function (event) {
    const files = event.target.files;
    handleFiles(files);
});

const uploadArea = document.getElementById('custom-uploadfile');
uploadArea.addEventListener('dragover', function (event) {
    event.preventDefault();
    event.stopPropagation();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', function (event) {
    event.preventDefault();
    event.stopPropagation();
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', function (event) {
    event.preventDefault();
    event.stopPropagation();
    uploadArea.classList.remove('dragover');
    const files = event.dataTransfer.files;
    handleFiles(files);
});

document.getElementById('custom-convertButton').addEventListener('click', function () {
    convertFiles();
});

let filesToConvert = [];
let filesDataURLs = [];

function handleFiles(files) {
    const previewContainer = document.getElementById('custom-previewContainer');
    previewContainer.style.display = 'flex';

    for (const file of files) {
        if (file.type === 'image/png') {
            filesToConvert.push(file);
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgWrapper = document.createElement('div');
                imgWrapper.style.position = 'relative';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('custom-preview-image');
                filesDataURLs.push(e.target.result);

                const removeButton = document.createElement('button');
                removeButton.classList.add('remove-button');
                removeButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.95 8.464a1 1 0 1 0-1.414-1.414L12 10.586 8.465 7.05A1 1 0 0 0 7.05 8.464L10.586 12 7.05 15.536a1 1 0 1 0 1.415 1.414L12 13.414l3.536 3.536a1 1 0 1 0 1.414-1.414L13.414 12z" fill="#000"/></svg>`;
                removeButton.addEventListener('click', function () {
                    const index = filesToConvert.findIndex(f => f.name === file.name);
                    if (index > -1) {
                        filesToConvert.splice(index, 1);
                        filesDataURLs.splice(index, 1);
                    }
                    imgWrapper.remove();
                    hideDownloadButton();
                    if (filesToConvert.length === 0) {
                        document.getElementById('custom-convertButton').disabled = true;
                        hidePreviewContainer();
                        showUploadIcon();
                    } else {
                        document.getElementById('custom-convertButton').disabled = false;
                    }
                });

                imgWrapper.appendChild(img);
                imgWrapper.appendChild(removeButton);
                previewContainer.appendChild(imgWrapper);

                new Sortable(previewContainer, {
                    animation: 150,
                    onEnd: function () {
                        const newOrder = Array.from(previewContainer.children).map(child => child.querySelector('img').src);
                        filesToConvert = newOrder.map(src => {
                            const index = filesDataURLs.indexOf(src);
                            return filesToConvert[index];
                        });
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    }

    if (filesToConvert.length > 0) {
        document.getElementById('error-message').style.display = 'none';
        document.getElementById('custom-convertButton').disabled = false;
        hideUploadIcon();
    } else {
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('custom-convertButton').disabled = true;
    }

    // Reset the input value to allow re-upload of the same file
    document.getElementById('custom-pngInput').value = '';
}

async function convertFiles() {
    if (filesToConvert.length === 0) return;

    const spinnerOverlay = document.getElementById('spinner-overlay');
    const downloadButton = document.getElementById('custom-downloadButton');

    hideDownloadButton();
    spinnerOverlay.style.display = 'flex';

    try {
        const convertedFiles = [];
        for (const file of filesToConvert) {
            const imgElement = await createImageElement(file);
            const icoBlob = await convertToIco(imgElement);
            convertedFiles.push(icoBlob);
        }

        if (convertedFiles.length === 1) {
            createSingleDownloadLink(convertedFiles[0]);
        } else {
            createDownloadLink(convertedFiles);
        }
    } catch (error) {
        document.getElementById('error-message').textContent = 'An error occurred during conversion. Please try again.';
        document.getElementById('error-message').style.display = 'block';
    } finally {
        setTimeout(() => {
            spinnerOverlay.style.display = 'none';
            setTimeout(() => {
                showDownloadButton();
            }, 0); // Show download button immediately after hiding spinner
        }, 1000); // Ensures the spinner is shown for at least 1 second
    }
}

function createImageElement(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgElement = new Image();
            imgElement.src = e.target.result;
            imgElement.onload = () => resolve(imgElement);
            imgElement.onerror = (err) => reject(err);
        };
        reader.readAsDataURL(file);
    });
}

function convertToIco(imgElement) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);
        canvas.toBlob(function (blob) {
            resolve(blob);
        }, 'image/x-icon');
    });
}

function createSingleDownloadLink(blob) {
    const downloadButton = document.getElementById('custom-downloadButton');
    const url = URL.createObjectURL(blob);
    const originalFilename = filesToConvert[0].name.split('.').slice(0, -1).join('.');
    downloadButton.href = url;
    downloadButton.download = `${originalFilename}_prepphint.com.ico`;
}

function createDownloadLink(blobs) {
    const downloadButton = document.getElementById('custom-downloadButton');
    const zip = new JSZip();
    blobs.forEach((blob, index) => {
        const originalFile = filesToConvert[index];
        const originalFileName = originalFile.name.split('.').slice(0, -1).join('.');
        zip.file(`${originalFileName}_prepphint.com.ico`, blob);
    });
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        const url = URL.createObjectURL(content);
        downloadButton.href = url;
        downloadButton.download = `converted_images_prepphint.com.zip`;
    });
}

function hideDownloadButton() {
    const downloadButton = document.getElementById('custom-downloadButton');
    downloadButton.style.display = 'none';
}

function showDownloadButton() {
    const downloadButton = document.getElementById('custom-downloadButton');
    downloadButton.style.display = 'inline-block';
}

function hideUploadIcon() {
    const uploadIcon = document.getElementById('custom-uploadIcon');
    uploadIcon.style.display = 'none';
}

function showUploadIcon() {
    const uploadIcon = document.getElementById('custom-uploadIcon');
    uploadIcon.style.display = 'block';
}

function hidePreviewContainer() {
    const previewContainer = document.getElementById('custom-previewContainer');
    previewContainer.style.display = 'none';
}