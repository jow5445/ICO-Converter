const browseButton = document.querySelector('.custom-browse-button');
const pngInput = document.getElementById('custom-pngInput');
const uploadArea = document.getElementById('custom-uploadfile');
const previewContainer = document.getElementById('custom-previewContainer');
const convertButton = document.getElementById('custom-convertButton');
const downloadButton = document.getElementById('custom-downloadButton');
const uploadIcon = document.getElementById('custom-uploadIcon');
const errorMessage = document.getElementById('error-message');
const spinnerOverlay = document.getElementById('spinner-overlay');

let filesToConvert = [];
let sortable;

// Open file picker
browseButton.addEventListener('click', () => {
    pngInput.click();
});

// Select files
pngInput.addEventListener('change', (event) => {
    handleFiles(event.target.files);
});

// Drag and drop
uploadArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', (event) => {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadArea.classList.remove('dragover');

    handleFiles(event.dataTransfer.files);
});

// Convert button
convertButton.addEventListener('click', convertFiles);

function handleFiles(files) {
    const pngFiles = Array.from(files).filter(
        (file) => file.type === 'image/png'
    );

    if (pngFiles.length === 0) {
        showError('Please select PNG images only.');
        return;
    }

    hideError();

    pngFiles.forEach((file) => {
        filesToConvert.push(file);
        createPreview(file);
    });

    updateUI();

    pngInput.value = '';
}

function createPreview(file) {
    const reader = new FileReader();

    reader.onload = (event) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'preview-item';
        wrapper.style.position = 'relative';

        const image = document.createElement('img');
        image.src = event.target.result;
        image.className = 'custom-preview-image';
        image.dataset.fileName = file.name;

        const removeButton = createRemoveButton(file, wrapper);

        wrapper.appendChild(image);
        wrapper.appendChild(removeButton);

        previewContainer.appendChild(wrapper);

        setupSortable();
    };

    reader.readAsDataURL(file);
}

function createRemoveButton(file, wrapper) {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'remove-button';
    button.innerHTML = `
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.95 8.464a1 1 0 1 0-1.414-1.414L12 10.586 8.465 7.05A1 1 0 1 0 7.05 8.464L10.586 12 7.05 15.536a1 1 0 1 0 1.415 1.414L12 13.414l3.536 3.536a1 1 0 1 0 1.414-1.414L13.414 12z"
                fill="#000"
            />
        </svg>
    `;

    button.addEventListener('click', () => {
        const index = filesToConvert.indexOf(file);

        if (index !== -1) {
            filesToConvert.splice(index, 1);
        }

        wrapper.remove();

        hideDownloadButton();
        updateUI();
    });

    return button;
}


function setupSortable() {
    if (sortable) {
        return;
    }

    sortable = new Sortable(previewContainer, {
        animation: 150,

        onEnd: updateFileOrder
    });
}

function updateFileOrder() {
    const images = Array.from(
        previewContainer.querySelectorAll('img')
    );

    filesToConvert = images
        .map((image) => {
            return filesToConvert.find(
                (file) => file.name === image.dataset.fileName
            );
        })
        .filter(Boolean);
}

async function convertFiles() {
    if (filesToConvert.length === 0) {
        return;
    }

    hideDownloadButton();
    spinnerOverlay.style.display = 'flex';

    try {
        const convertedFiles = [];

        for (const file of filesToConvert) {
            const image = await createImageElement(file);
            const icoBlob = await convertToIco(image);

            convertedFiles.push({
                file,
                blob: icoBlob
            });
        }

        if (convertedFiles.length === 1) {
            createSingleDownload(convertedFiles[0]);
        } else {
            await createZipDownload(convertedFiles);
        }
    } catch (error) {
        console.error(error);

        showError(
            'An error occurred during conversion. Please try again.'
        );
    } finally {
        setTimeout(() => {
            spinnerOverlay.style.display = 'none';
            showDownloadButton();
        }, 1000);
    }
}

function createImageElement(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const image = new Image();

            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = event.target.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function convertToIco(image) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');

        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext('2d');

        if (!context) {
            reject(new Error('Could not create canvas context.'));
            return;
        }

        context.drawImage(
            image,
            0,
            0,
            image.width,
            image.height
        );

        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Could not create ICO file.'));
                return;
            }

            resolve(blob);
        }, 'image/x-icon');
    });
}


function getFileName(fileName) {
    return fileName.replace(/\.[^/.]+$/, '');
}

function createSingleDownload({ file, blob }) {
    const url = URL.createObjectURL(blob);
    const fileName = getFileName(file.name);

    downloadButton.href = url;
    downloadButton.download = `${fileName}_prepphint.com.ico`;
}

async function createZipDownload(files) {
    const zip = new JSZip();

    files.forEach(({ file, blob }) => {
        const fileName = getFileName(file.name);

        zip.file(
            `${fileName}_prepphint.com.ico`,
            blob
        );
    });

    const content = await zip.generateAsync({
        type: 'blob'
    });

    const url = URL.createObjectURL(content);

    downloadButton.href = url;
    downloadButton.download = 'converted_images_prepphint.com.zip';
}


function updateUI() {
    const hasFiles = filesToConvert.length > 0;

    convertButton.disabled = !hasFiles;

    previewContainer.style.display = hasFiles
        ? 'flex'
        : 'none';

    uploadIcon.style.display = hasFiles
        ? 'none'
        : 'block';

    if (!hasFiles) {
        hideDownloadButton();
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showDownloadButton() {
    downloadButton.style.display = 'inline-block';
}

function hideDownloadButton() {
    downloadButton.style.display = 'none';
}