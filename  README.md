# PNG to ICO Converter

A simple, client-side web tool to convert PNG images into Windows icon (`.ico`) format right in the browser. No uploads to external servers, no quality loss—just drop your files, arrange them, and download.

🔗 **Live Demo:** [PNG to ICO Converter](https://prepphint.com/png-to-ico/)

---

## Preview

![PNG to ICO Converter Screenshot](https://github.com/user-attachments/assets/0995dd2d-4b4a-4ba3-8fa9-c93774546eeb)

---

## Features

- **Batch Conversion:** Upload multiple PNG images at once.
- **Drag & Drop:** Drop files straight onto the upload area or browse manually.
- **Image Preview & Reordering:** Preview your images, delete unwanted ones, and reorder them before converting.
- **Client-Side Processing:** Images are converted in the browser using the HTML5 Canvas API—fast and private.
- **Smart Downloads:** Downloads a single `.ico` file directly, or bundles multiple files into a `.zip` archive automatically.

---

## How to Use

1. **Upload:** Drag and drop your PNG images into the drop zone or click **Browse Files**.
2. **Review:** Check your image previews. Click the `×` on any thumbnail to remove it if needed.
3. **Convert:** Hit the **Convert to ICO** button.
4. **Download:** Click **Download ICO** (or download the `.zip` archive if you converted multiple images).

---

## Built With

- **HTML5 & CSS3** – Semantic structure and responsive layout
- **Vanilla JavaScript** – Canvas-based ICO conversion and UI state management
- [JSZip](https://stuk.github.io/jszip/) – For bundling multiple icons into a single ZIP file
- [SortableJS](https://sortablejs.github.io/Sortable/) – Drag-and-drop thumbnail reordering

---

## Getting Started Locally

No build tools or servers required.

1. Clone or download the repository:
   ```bash
   git clone [https://github.com/your-username/png-to-ico.git](https://github.com/your-username/png-to-ico.git)