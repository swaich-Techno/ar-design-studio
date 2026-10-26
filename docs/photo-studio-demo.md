# Built-in 3D demo

Open https://ar.bsocio.in/ar/create?demo=avocado or choose Try demo 3D in Photo Studio.

The demo loads a matching reference image and a prebuilt, volumetric avocado GLB. It is clearly labelled Demo 3D and does not run AI generation. The GLB is 464,008 bytes with embedded PNG textures and unchanged source geometry.

The phone QR opens the same demo link. Camera AR is offered by model-viewer on supported phones. Actual phone camera placement and scale are not verified by desktop testing.

The model is CC0, supplied by Microsoft through Khronos glTF Sample Assets. See public/photo-studio/demo/README.md and LICENSE.md for source and processing details.

## Validation

- Production build passed.
- 33 Photo Studio/demo tests passed, including actual non-flat geometry, no AI calls, load failures, cancellation and offline demo asset caching.
- All 16 existing smoke checks passed.
- Targeted lint passed with image-element advisory warnings only.
- Desktop one-click demo load and keyboard rotation verified visually.
- Phone-width deep link loads automatically; no horizontal overflow at 390px.
- Physical phone AR is ready for user testing and remains unverified.
