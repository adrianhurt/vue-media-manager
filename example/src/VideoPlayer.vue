<template>
    <MediaManager
        #default="{ paused, playPause, currentTime, duration, progress, skipForward, skipBackward, mediaAttrs, seekSliderAttrs }"
        type="video"
        :seekingDisabled="seekingDisabled"
    >
        <div class="VideoPlayer">
            <MediaElement
                ref="video"
                v-bind="mediaAttrs"
                :autoplay="autoplay"
                :volume="volume"
                :muted="muted"
                :loop="loop"
                preload
            >
                <source
                    :src="src"
                    :type="type"
                >
                <p>Your browser doesn't support HTML5 video</p>
            </MediaElement>
            <div class="box">
                <p class="info-text">
                    The SeekSlider: you can click wherever you want or drag it
                </p>
                <SeekSlider v-bind="seekSliderAttrs">
                    <div class="SliderTrail" />
                    <div
                        slot="handle"
                        class="Handle"
                    />
                </SeekSlider>
            </div>
            <div class="box">
                <p class="info-text">
                    The classic control buttons
                </p>
                <div class="Controls">
                    <a
                        class="Button"
                        @click="playPause"
                    >
                        {{ paused ? 'Play' : 'Pause' }}
                    </a>
                    <a
                        class="Button"
                        @click="toggleLoop"
                    >
                        Loop: {{ loop }}
                    </a>
                    <a
                        class="Button"
                        @click="requestFullScreen"
                    >
                        Fullscreen
                    </a>
                </div>
            </div>
            <div class="box">
                <p class="info-text">
                    Skip forward and backward
                </p>
                <div class="Controls ControlsSkip">
                    <a
                        class="Button"
                        @click="skipBackward(5)"
                    >
                        Skip Backward 5 secs
                    </a>
                    <a
                        class="Button"
                        @click="skipForward(5)"
                    >
                        Skip Forward 5 secs
                    </a>
                </div>
            </div>
            <div class="box d-flex">
                <div class="inline-box expand">
                    <p class="info-text">
                        Volume: {{ volume.toFixed(2) }}
                    </p>
                    <Slider
                        v-model="volume"
                        class="VolumeSlider"
                    >
                        <div class="SliderTrail" />
                        <div
                            slot="handle"
                            class="Handle VolumeHandle"
                        />
                    </Slider>
                </div>
                <div class="inline-box">
                    <p class="info-text">
                        Mute
                    </p>
                    <a
                        class="Button"
                        @click="muted = !muted"
                    >
                        Muted: {{ muted }}
                    </a>
                </div>
            </div>
            <div class="box d-flex center">
                <div class="inline-box">
                    <p class="info-text">
                        Seeking Disabled
                    </p>
                    <a
                        class="Button"
                        @click="seekingDisabled = !seekingDisabled"
                    >
                        Disabled: {{ seekingDisabled }}
                    </a>
                </div>
            </div>
            <div class="box">
                <p class="info-text">
                    More info you have
                </p>
                <div class="Info">
                    <div>
                        <p class="label">
                            Current time
                        </p>
                        <p class="value">
                            {{ toString(currentTime) }}
                        </p>
                    </div>
                    <div>
                        <p class="label">
                            Duration
                        </p>
                        <p class="value">
                            {{ toString(duration) }}
                        </p>
                    </div>
                    <div>
                        <p class="label">
                            Progress
                        </p>
                        <p class="value">
                            {{ toString(progress) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </MediaManager>
</template>

<script>
import VueTypes from 'vue-types'
import {
    MediaManager, MediaElement, SeekSlider, Slider,
} from '@adrianhurt/vue-media-manager'

export default {
    name: 'VideoPlayer',
    components: {
        MediaManager,
        MediaElement,
        SeekSlider,
        Slider,
    },
    props: {
        src: VueTypes.string.isRequired,
        type: VueTypes.string.optional,
        autoplay: VueTypes.bool.def(false),
    },
    data () {
        return {
            loop: false,
            volume: 1,
            muted: false,
            seekingDisabled: false,
        }
    },
    methods: {
        toggleLoop () {
            this.loop = !this.loop
        },
        requestFullScreen () {
            this.$refs.video.requestFullScreen()
        },
        toString (num) {
            return typeof num === 'number' ? num.toFixed(2) : '-'
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@adrianhurt/vue-media-manager/dist/vue-media-manager.css';

$width: 450px;
$sliderHeight: 32px;
$sliderTrailHeight: 2px;
$handleSize: 12px;
$primary: #4fc08d;
$secondary: #577392;

.box {
	background-color: rgba($primary, 0.2);
	margin-top: 1px;
	padding: 10px 20px;
	&.d-flex {
		display: flex;
		justify-content: space-between;
		&.center {
			justify-content: center;
		}
	}
}
.inline-box {
	&.expand {
		flex: 1;
	}
	& + & {
		margin-left: 25px;
		padding-left: 25px;
		border-left: 1px solid white;
	}
}
.info-text {
	color: $secondary;
	font-size: 14px;
	margin: 0 0 10px;
}
.VideoPlayer {
	width: $width;
	background-color: rgba($primary, 0.2);
	border-radius: 5px;
	overflow: hidden;
	& > video {
		display: block;
		width: $width;
	}
}
.SeekSlider {
	height: $sliderHeight;
}
.SliderTrail {
	width: 100%;
	height: $sliderTrailHeight;
	border-radius: $sliderTrailHeight;
	background-color: rgba($primary, 0.1);
}
.Handle {
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
.Controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.Button {
	flex: 1;
	padding: 3px 10px;
	border-radius: 5px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: $primary;
	cursor: pointer;
	user-select: none;
	& + & {
		margin-left: 15px;
	}
}
.VolumeSlider {
	width: 200px;
	margin: auto;
	height: $sliderHeight;
}
.VolumeHandle {
	background-color: $secondary;
}
.Info {
	display: flex;
	justify-content: space-between;
	& > * {
		flex: 1;
	}
	p {
		margin: 0 0 3px;
		font-size: 14px;
	}
	.label {
		font-weight: bold;
	}
}
</style>
