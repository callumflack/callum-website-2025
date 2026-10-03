# Home preview

`home.module.css` owns the strip spacing pattern: `--project-strip-gap` controls both the gap between slides and the space below the slider. Keep those spaces equal by consuming that variable in both places.

Media padding uses multiples of the existing responsive spacing tokens. Keep the shared media height and bottom baseline when adjusting padding or the intro-to-slider space. Reuse the existing intro, navigation, captions and media primitives.

Below 660px, media panels are square, each side `100vw - --project-strip-gap`, with captions outside. Centre media vertically and size its width to the panel content area, respecting horizontal padding and its aspect ratio. Video slides require an authored poster so a paused slide remains visible before video decoding, including on iPhone Safari.

Only captions link to case studies. Hover stops the marquee permanently. Desktop browsing leaves the user's scroll position unchanged: no JavaScript centring/glide, CSS snapping or extra centring insets. Map vertical wheel movement to horizontal scrolling only over the desktop strip. Recheck the slide under the pointer after scrolling or layout changes so playback follows a stationary pointer; pause the previous video before playing the next. Keyboard focus also supports playback.

Below 660px, enable native CSS mandatory snapping on interaction: no JavaScript centring, settle timer, glide or vertical-wheel mapping. Keep CSS snapping disabled during the marquee. Native snap duration is browser-controlled.
