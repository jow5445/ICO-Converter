# PNG to ICO Converter

A small web tool that lets you convert PNG images to Windows `.ico` files directly in your browser.

There are no uploads to a server, so your images stay on your device. You can add multiple images, arrange them, and download the converted icons when you're done.

**Live Demo:** [PNG to ICO Converter](https://jow5445.github.io/ICO-Converter/)

---

## Preview

![PNG to ICO Converter Screenshot](https://cdn.hackclub.com/01a0e947-b06c-7976-8b33-67b73532d789/Screenshot%20From%202026-09-28%2021-29-31.png)

---

## Features

* **Batch Conversion:** Convert multiple PNG images at once.
* **Drag & Drop:** Drag your files into the upload area or select them manually.
* **Image Preview:** See your images before converting them.
* **Reordering:** Change the order of your images with drag and drop.
* **Client-Side Conversion:** Everything runs directly in your browser using the Canvas API.
* **ZIP Download:** When converting multiple images, they are automatically bundled into a ZIP file.

---

## How to Use

1. Add your PNG files by dragging them into the upload area or clicking **Browse Files**.
2. Check the image previews and remove any files you don't want.
3. Reorder the images if needed.
4. Click **Convert to ICO**.
5. Download the generated `.ico` file or ZIP archive.

---

## Built With

* **HTML5 & CSS3** – Page structure and styling.
* **Vanilla JavaScript** – Handles the conversion and UI.
* **Canvas API** – Used to process the PNG images.
* **JSZip** – Used to create ZIP files when converting multiple images.
* **SortableJS** – Used for drag-and-drop reordering.

---

## Getting Started

There is no build process or backend required. You can just clone the repository and open the project in your browser.

```bash
git clone https://github.com/jow5445/ICO-Converter.git
cd ICO-Converter
```

Then open `index.html` in your browser.