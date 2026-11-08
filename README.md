# Feevale DIP Techniques

A browser app to apply and study Digital Image Processing (DIP) techniques from the Feevale DIP course.

Load an image, pick techniques from the menu and stack them as layers. Each layer has its own parameters, and layers can be reordered by dragging.

## Techniques

- **Geometric transforms:** translation, scale, rotation, mirror
- **Filters:** grayscale, brightness, contrast
- **Low-pass:** mean, mode
- **High-pass:** Roberts, Sobel

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. In development the sample image (`public/lena.jpg`) loads automatically.

Other scripts:

- `npm run typecheck` — type check
- `npm run build` — static build into `build/client/` (the app runs fully in the browser, with no server)

## Project structure

```
app/
├── root.tsx                  HTML shell
├── routes.ts                 single route: "/" → routes/home.tsx
├── routes/home.tsx           editor page: connects the components to useEditor
├── hooks/useEditor.ts        editor state and actions (image, layers, selection)
├── layers/
│   ├── types.ts              Layer: { id, command, params }
│   └── layers.ts             pure functions to create, apply, move and remove layers
├── commands/                 the DIP techniques
│   ├── types.ts              Command interface and parameter schemas
│   ├── point-operation.ts    point operations: each pixel depends only on itself
│   ├── local-operation.ts    local operations: each pixel depends on its neighborhood
│   ├── geometric-transform.ts  affine transforms with a 3×3 matrix
│   ├── edge-detection.ts     gradient edge detection shared by Roberts and Sobel
│   ├── transforms/           translation, scale, rotation, mirror
│   ├── filters/              grayscale, brightness, contrast
│   ├── low-pass/             mean, mode
│   └── high-pass/            edge detectors (Roberts, Sobel)
├── data/menu.ts              menus and the commands in each one
├── components/
│   ├── Menubar.tsx           top menus; clicking a command adds a layer
│   ├── ImagePicker.tsx       drag and drop or file selection (up to 5 MB)
│   ├── ImagePreview.tsx      draws the processed image
│   ├── LayersPanel.tsx       layer list: select, remove, drag to reorder
│   ├── CommandParamsPanel.tsx  sliders and selects for the selected layer
│   └── FloatingPanel.tsx     draggable panel used by the two panels above
├── lib/image.ts              loads a File into a canvas
└── app.css                   Tailwind theme
public/
└── lena.jpg                  sample image
```

## How it works

1. Each technique is a class that implements `Command`: a `label`, an `icon`, the `params` it shows in the panel, its `defaultParams` and an `execute(image, params)` method that takes a canvas and returns a new one.
2. Picking a technique in the menu creates a layer with that command and its default parameters.
3. Whenever the layers change, `applyLayers` starts from the original image and runs every layer, from the oldest to the newest. The original image is never modified.
4. Most commands don't loop over pixels themselves. They pass a formula, a mask or a matrix to `pointOperation`, `localOperation` or `affineTransform`.

## Adding a technique

1. Create a class in the matching `app/commands/` folder that implements `Command<YourParams>`.
2. Describe its parameters in `params`: `"number"` becomes a slider and `"select"` becomes a dropdown.
3. Add an instance to a menu in `app/data/menu.ts`.
