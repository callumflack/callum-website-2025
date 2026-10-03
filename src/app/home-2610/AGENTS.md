# Home preview

`home.module.css` owns the strip spacing pattern: `--project-strip-gap` controls both the gap between slides and the space below the slider. Keep those spaces equal by consuming that variable in both places.

Media padding uses multiples of the existing responsive spacing tokens. Keep the shared media height and bottom baseline when adjusting padding or the intro-to-slider space. Reuse the existing intro, navigation, captions and media primitives.

Only captions link to case studies. Hover stops the marquee without snapping. After manual scrolling settles, a controlled 1200ms glide centres nearby slides, then restores CSS centre/proximity snapping. Keep CSS snapping disabled during the marquee, active gestures and glide; native snap duration cannot be configured. Fresh input cancels the glide; reduced motion skips animation. Manual browsing adds enough end padding to centre the first and last slides while preserving the current visible position.
