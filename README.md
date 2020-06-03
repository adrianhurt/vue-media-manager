# @adrianhurt/vue-media-manager

A simple way to use a HTML Media Element (video or audio) with your own custom controls.
This library consists basically in 3 components that work together:
- `MediaManager`: handles the media playback and gives additional information and methods to manage it.
- `MediaElement`: a wrapper for the media element (a video or audio).
- `SeekSlider`: the classical slider to control the playback.

## Install
```
$ npm install @adrianhurt/vue-media-manager
```
or
```
$ yarn add @adrianhurt/vue-media-manager
```

## Usage
```vue
<template>
  <MediaManager
    #default="{ paused, playPause, mediaAttrs, seekSliderAttrs }"
    type="video"
  >
    <div class="video-player">
      <MediaElement v-bind="mediaAttrs">
        <source
          :src="src"
          :type="type"
        >
      </MediaElement>
      <div class="controls">
        <button @click="playPause">
          {{ paused ? 'Play' : 'Pause' }}
        </button>
        <SeekSlider
          class="media-slider"
          v-bind="seekSliderAttrs"
        >
          <div class="slider-trail" />
          <div
            slot="handle"
            class="handle"
          />
        </SeekSlider>
      </div>
    </div>
  </MediaManager>
</template>

<script>
import VueTypes from 'vue-types'
import { MediaManager, MediaElement, SeekSlider } from '@adrianhurt/vue-media-manager'

export default {
  name: 'VideoPlayer',
  components: {
    MediaManager,
    MediaElement,
    SeekSlider,
  },
  props: {
    src: VueTypes.string.isRequired,
    type: VueTypes.string.optional,
  },
}
</script>

<style scoped lang="scss">
@import '~@adrianhurt/vue-media-manager/dist/vue-media-manager.css';

$sliderHeight: 40px;
$sliderTrailHeight: 4px;
$handleSize: 12px;
$primary: #4fc08d;

.media-slider {
  height: $sliderHeight;
}
.slider-trail {
  height: $sliderTrailHeight;
  border-radius: $sliderTrailHeight / 2;
  background-color: rgba($primary, 0.2);
}
.handle {
  position: relative;
  top: 50%;
  left: 0;
  width: $handleSize;
  height: $handleSize;
  border-radius: $handleSize;
  margin-top: #{-$handleSize / 2};
  margin-left: #{-$handleSize / 2};
  background-color: $primary;
}
</style>
```

## MediaManager

### Props
- `type` (required): `video` or `audio`
- `initialTime` (default 0): Number that indicates the initial time to start the playback.
- `seekingDisabled` (default false): Boolean to disabled any "seek" method is called (seekTo, seekToProgress, skipForward, skipBackward).

### Events
- `seek (time)`: Emitted when any "seek" method is called (seekTo, seekToProgress, skipForward, skipBackward).

### Methods
- `seekTo(time)`: seeks to a specific time (in seconds).
- `seekToProgress(progress)`: seeks to a specific time (from 0 to 1).
- `skipForward(secs)`: skips forward from the current time (in secs).
- `skipBackward(secs)`: skips backward from the current time (in secs).
- `play()`: plays the media element.
- `pauses()`: pauses the media element.
- `playPause()`: toggles play/pause.

### Slots
- `default (scoped)`: with the following scoped props:
  - `paused`: Boolean that indicates if the video or audio is paused.
  - `currentTime`: Number with the current time in seconds.
  - `duration`: Number with the duration for the whole playback in seconds.
  - `progress`: Number with current progress within the playback (from 0 to 1).
  - `play ()`: Method to play the video or audio.
  - `pause ()`: Method to pause the video or audio.
  - `playPause ()`: Method to toggle play-pause the video or audio.
  - `seekTo (time)`: Method to seek the video or audio to a specic time in seconds.
  - `seekToProgress  (p)`: Method to seek the video or audio to a specic progress (from 0 to 1).
  - `skipForward (s)`: Method to skip forward `s` seconds.
  - `skipBackward (s)`: Method to skip backward `s` seconds.
  - `seekingDisabled` (default false): Boolean to disabled any "seek" method is called (seekTo, seekToProgress, skipForward, skipBackward).
  - `mediaAttrs`: Object with the attributes ready for the `MediaElement` component.
  - `seekSliderAttrs`: Object with the attributes ready for the `SeekSlider` component.

## MediaElement

### Props
The following props are fully available, but `MediaManager` gives you all of them ready to use within `mediaAttrs`:
- `type` (required): `video` or `audio`
- `paused` (default false): Boolean that indicates if the video or audio is paused.
- `autoplay` (default false): Boolean that auto-starts the playback.
- `currentTime` (default 0): Number with the current time in seconds.
- `volume` (default 1): Number with the current volume (from 0 to 1).
- `muted` (default false): Boolean to mute the audio.
- `managerListeners` (required): Object with the corresponding `MediaManager`s listeners.
- `forceTimeUpdateInterval` (optional): Number to indicate a time interval (milliseconds) to manually update the currentTime.
  **Note:** If you use this option, the native `timeupdate` event will be ignored.

Every other prop will be passed through to the correponding video or audio element, so you can use direclty `loop`, for example.
- [MDN video tag documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [MDN audio tag documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)


### Events
Check the events provided by [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement),
[video](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) and [audio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio).

### Methods
- `forceTimeUpdate()`: forces a time update for the currentTime.
- `requestFullScreen()`: requests the native full screen mode for a video element.
- `cancelFullScreen()`: cancels the native full screen mode.

### Slots
- `default`: the native "slot" for a video or audio tag (ie: `<source>`).

## SeekSlider

### Props
The following props are fully available, but `MediaManager` gives you all of them ready to use within `seekSliderAttrs`:
- `progress` (required): Number with current progress within the playback (from 0 to 1).
- `paused` (default false): Boolean that indicates if the video or audio is paused.
- `play` (optional): Method to play the video or audio.
- `pause` (optional): Method to pause the video or audio.
- `managerListeners` (required): Object with the corresponding `MediaManager`s listeners.

### Events
- `seek (progress)`: Emitted when the user clicks or drags along the cursor to seek to a specific progress (from 0 to 1).
- `dragstart`, `drag` and `dragend`: Emitted when the user drags along the cursor.

### Slots
- `default (scoped)`: the cursor's container. You should place here your custom cursor's trail. With the following scoped props:
  - `isDragging`: Boolean that indicates the user is dragging along the cursor.
- `handle (scoped)`: the slider's handle. It's parent container will be moved automatically (with absolute position and left property). With the following scoped props:
  - `isDragging`: Boolean that indicates the user is dragging along the cursor.
- `custom (scoped)`: use it if you want to render your own cursor. If present, it will override the other two slots. With the following scoped props:
  - `isDragging`: Boolean that indicates the user is dragging along the cursor.
  - `progress`: Number with current progress within the playback (from 0 to 1).

## Slider
The inner slider component used for `SeekSlider`. Userful for a volume slider, for example.

### Props
- `value` (required): Number with current value (from 0 to 1).

### Events
- `input (progress)`: Emitted when the user clicks or drags along the slider (from 0 to 1).
- `dragstart`, `drag` and `dragend`: Emitted when the user drags along the slider.

### Slots
- `default (scoped)`: the slider's container. You should place here your custom slider's trail. With the following scoped props:
  - `isDragging`: Boolean that indicates the user is dragging along the slider.
- `handle (scoped)`: the slider's handle. It's parent container will be moved automatically (with absolute position and left property). With the following scoped props:
  - `isDragging`: Boolean that indicates the user is dragging along the slider.
- `custom (scoped)`: use it if you want to render your own slider. If present, it will override the other two slots. With the following scoped props:
  - `isDragging`: Boolean that indicates the user is dragging along the slider.
  - `progress`: Number with current value (from 0 to 1).


