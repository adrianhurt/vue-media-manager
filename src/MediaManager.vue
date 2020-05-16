<script>
import VueTypes from 'vue-types'
import { clamp } from './utils'

export default {
    name: 'MediaManager',
    props: {
        type: VueTypes.oneOf(['video', 'audio']).isRequired,
        initialTime: VueTypes.number.def(0),
        seekingDisabled: VueTypes.bool.def(false),
    },
    data () {
        return {
            currentTime: this.initialTime,
            duration: undefined,
            paused: true,
        }
    },
    computed: {
        progress () {
            return this.currentTime / this.duration
        },
        mediaAttrs () {
            return {
                type: this.type,
                paused: this.paused,
                currentTime: this.currentTime,
                managerListeners: this.mediaManagerListeners,
            }
        },
        cursorAttrs () {
            return {
                progress: this.progress,
                paused: this.paused,
                play: this.play,
                pause: this.pause,
                seekingDisabled: this.seekingDisabled,
                managerListeners: this.cursorManagerListeners,
            }
        },
    },
    created () {
        this.mediaManagerListeners = {
            loadedmetadata: (nativeEvent) => { this.duration = nativeEvent.target.duration },
            onTimeUpdate: (time) => { this.currentTime = time },
            ended: () => this.pause(),
            autoplayed: () => this.play(),
        }
        this.cursorManagerListeners = {
            seek: (progress) => this.seekToProgress(progress),
        }
    },
    beforeDestroy () {
        clearTimeout(this.timeout)
    },
    methods: {
        seekTo (time) {
            if (!this.seekingDisabled) {
                this.currentTime = time
                this.$emit('seek', time)
            }
        },
        seekToProgress (progress) {
            this.seekTo(progress * this.duration)
        },
        skipForward (secs) {
            this.seekTo(clamp(this.currentTime + secs, 0, this.duration))
        },
        skipBackward (secs) {
            this.skipForward(-secs)
        },
        play () {
            this.paused = false
        },
        pause () {
            this.paused = true
        },
        playPause () {
            this.paused = !this.paused
        },
    },

    render () {
        return this.$scopedSlots.default({
            paused: this.paused,
            play: this.play,
            pause: this.pause,
            playPause: this.playPause,
            currentTime: this.currentTime,
            duration: this.duration,
            seekTo: this.seekTo,
            progress: this.progress,
            seekToProgress: this.seekToProgress,
            skipForward: this.skipForward,
            skipBackward: this.skipBackward,
            seekingDisabled: this.seekingDisabled,
            mediaAttrs: this.mediaAttrs,
            cursorAttrs: this.cursorAttrs,
        })
    },
}
</script>
