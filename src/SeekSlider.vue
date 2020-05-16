<script>
import VueTypes from 'vue-types'
import Slider from './Slider.vue'
import { mergeListeners } from './utils'

export default {
    name: 'SeekSlider',
    components: { Slider },
    props: {
        progress: VueTypes.number.def(0), // progress
        paused: VueTypes.bool.optional,
        play: VueTypes.func.optional,
        pause: VueTypes.func.optional,
        seekingDisabled: VueTypes.bool.def(false),
        managerListeners: VueTypes.object.isRequired,
    },
    computed: {
        sliderListeners () {
            const {
                paused, play, pause, seekingDisabled, managerListeners, $listeners,
            } = this
            const renamer = { input: 'seek' }
            return mergeListeners.call(this, [
                $listeners,
                managerListeners,
                {
                    input: () => {},
                    dragstart: () => {
                        if (!paused) {
                            this.wasPlaying = true
                        }
                        if (!seekingDisabled) {
							pause?.()
                        }
                    },
                    dragend: () => {
                        if (paused && this.wasPlaying) {
							play?.()
                        }
                        this.wasPlaying = undefined
                    },
                },
            ], renamer)
        },
    },

    render (h) {
        return h(
            Slider,
            {
                class: ['SeekSlider', { disabled: this.seekingDisabled }],
                props: {
                    value: this.progress,
                },
                on: this.sliderListeners,
                scopedSlots: this.$scopedSlots,
            },
            this.$slots,
        )
    },
}
</script>
