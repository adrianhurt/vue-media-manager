<template>
    <div
        ref="container"
        class="Slider"
        :class="{ dragging: isDragging }"
        @mousedown.stop="handleMouseDown"
    >
        <slot
            name="custom"
            :isDragging="isDragging"
            :progress="value"
        >
            <slot :isDragging="isDragging">
                <div class="DefaultTrail" />
            </slot>
            <div
                class="Handle"
                :style="{ left: `${(value * 100).toFixed(3)}%` }"
            >
                <slot
                    name="handle"
                    :isDragging="isDragging"
                >
                    <div class="DefaultHandle" />
                </slot>
            </div>
        </slot>
    </div>
</template>

<script>
import VueTypes from 'vue-types'
import { clamp } from './utils'

export default {
    name: 'Slider',
    props: {
        value: VueTypes.number.def(0),
    },
    data () {
        return {
            isDragging: false,
        }
    },
    mounted () {
        this.containerRef = this.$refs.container
    },
    methods: {
        emitPositionWithMouseEvent ({ clientX }, dragEventName) {
            const { containerRef } = this
            const dragAreaRect = containerRef.getBoundingClientRect()
            const newValue = (clientX - dragAreaRect.left) / dragAreaRect.width
            const progress = clamp(newValue, 0, 1)
            this.$emit('input', progress)
            if (dragEventName) this.$emit(dragEventName, progress)
        },
        handleMouseDown (event) {
            this.isDragging = true
            this.emitPositionWithMouseEvent(event, 'dragstart')
            document.addEventListener('mousemove', this.handleMouseMove)
            document.addEventListener('mouseup', this.handleMouseUp)
        },
        handleMouseMove (event) {
            this.isDragging = true
            this.emitPositionWithMouseEvent(event, 'drag')
        },
        handleMouseUp (event) {
            this.emitPositionWithMouseEvent(event, 'dragend')
            this.isDragging = false
            document.removeEventListener('mousemove', this.handleMouseMove)
            document.removeEventListener('mouseup', this.handleMouseUp)
        },
    },
}
</script>

<style lang="scss" scoped>
$sliderHeight: 24px;
$trailHeight: 2px;
$trailColor: #bbb;
$handleSize: 12px;
$handleColor: #888;
$handleHoverColor: white;

.Slider {
	position: relative;
	height: $sliderHeight;
	user-select: none;
	pointer-events: auto;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	&.dragging {
		cursor: ew-resize;
	}
	&.disabled {
		cursor: not-allowed;
		& > * {
			pointer-events: none;
		}
	}
}
.DefaultTrail {
	position: relative;
	width: 100%;
	height: $trailHeight;
	border-radius: $trailHeight;
	background-color: $trailColor;
}
.Handle {
	position: absolute;
	top: 50%;
	left: 0;
	transition: left 0.25s linear;
	cursor: ew-resize;
	z-index: 100;
	.dragging & {
		transition: left 0s;
	}
}
.DefaultHandle {
	width: $handleSize;
	height: $handleSize;
	border-radius: $handleSize;
	margin-top: #{-$handleSize / 2};
	margin-left: -($handleSize / 2);
	background-color: $handleColor;
	transition: background-color 0.3s, transform 0.3s;
	.playing &,
	&:hover {
		background-color: $handleHoverColor;
	}
	&:hover {
		transform: scale(1.2);
	}
}
</style>
