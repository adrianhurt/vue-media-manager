<template>
    <component
        :is="type"
        ref="media"
        class="MediaElement"
        v-bind="$attrs"
        :autoplay="autoplay"
        v-on="mediaListeners"
    >
        <slot />
    </component>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import VueTypes from 'vue-types'
import { mergeListeners, clamp } from './utils'

export default {
    name: 'MediaElement',
    props: {
        type: VueTypes.oneOf(['video', 'audio']).isRequired,
        paused: VueTypes.bool.def(false),
        currentTime: VueTypes.number.def(0),
        autoplay: VueTypes.bool.def(false),
        volume: VueTypes.number.def(1),
        muted: VueTypes.bool.def(false),
        managerListeners: VueTypes.object.isRequired,
        forceTimeUpdateInterval: VueTypes.number.optional,
    },
    computed: {
        mediaListeners () {
            return {
                ...mergeListeners.call(this, [
                    this.$listeners,
                    this.managerListeners,
                ]),
                timeupdate: (event) => {
                    if (!this.forceTimeUpdateInterval) {
                        this._nativeTimeUpdate(event)
                    }
                },
            }
        },
    },
    watch: {
        currentTime (time) {
            if (time !== this.selfUpdatedTime) {
                this.mediaRef.currentTime = time
            }
        },
        paused (isPaused) {
            const { mediaRef } = this
            if (!isPaused && mediaRef.paused) {
                mediaRef.play()
                    .then(() => {
                        this.$emit('played', this.mediaRef.currentTime)
                        this._startforceTimeUpdateInterval()
                    })
                    .catch(() => {})
            } else if (isPaused && !mediaRef.paused) {
                mediaRef.pause()
                this.$emit('paused', this.mediaRef.currentTime)
                this._stopforceTimeUpdateInterval()
                this.forceTimeUpdate()
            }
        },
        volume (level) {
            this.mediaRef.volume = clamp(level, 0, 1)
        },
        muted (value) {
            this.mediaRef.muted = !!value
        },
        forceTimeUpdateInterval (interval) {
            this._stopforceTimeUpdateInterval()
            if (!this.paused) {
                this._startforceTimeUpdateInterval(interval)
            }
        },
    },
    mounted () {
        this.mediaRef = this.$refs.media
        this.mediaRef.currentTime = this.currentTime
        this.mediaRef.volume = this.volume
        this.mediaRef.muted = this.muted
        if (this.autoplay) {
            this.autoplayNeedsToBeHandled = true
            if (this.forceTimeUpdateInterval) {
                this._startforceTimeUpdateInterval()
            }
        }
    },
    beforeDestroy () {
        this._stopforceTimeUpdateInterval()
    },
    methods: {
        // we need to handle manually timeupdate to avoid circular updates of currentTime due to the watcher
        _nativeTimeUpdate (nativeEvent) {
            const time = nativeEvent.target.currentTime
            this.selfUpdatedTime = time
            this.managerListeners.onTimeUpdate?.(time)
            this.$emit('timeupdate', nativeEvent)
            if (this.autoplayNeedsToBeHandled === true) {
                this.autoplayNeedsToBeHandled = undefined
                this.managerListeners.autoplayed?.()
            }
        },
        forceTimeUpdate () {
            // eslint-disable-next-line no-underscore-dangle
            this._nativeTimeUpdate({ target: { currentTime: this.mediaRef.currentTime } })
        },
        _startforceTimeUpdateInterval (interval = this.forceTimeUpdateInterval) {
            if (this.forceTimeUpdateInterval) {
                clearInterval(this.interval)
                this.interval = setInterval(this.forceTimeUpdate, interval)
            }
        },
        _stopforceTimeUpdateInterval () {
            clearInterval(this.interval)
        },
        requestFullScreen () {
            const { mediaRef } = this
            if (mediaRef.webkitRequestFullScreen) mediaRef.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
            else if (mediaRef.requestFullScreen) mediaRef.requestFullScreen()
            else if (mediaRef.mozRequestFullScreen) mediaRef.mozRequestFullScreen()
            else if (mediaRef.msRequestFullScreen) mediaRef.msRequestFullScreen()
        },
        cancelFullScreen () {
            const { mediaRef } = this
            if (mediaRef.cancelFullScreen) mediaRef.cancelFullScreen()
            else if (mediaRef.webkitCancelFullScreen) mediaRef.webkitCancelFullScreen(Element.ALLOW_KEYBOARD_INPUT)
            else if (mediaRef.mozCancelFullScreen) mediaRef.mozCancelFullScreen()
            else if (mediaRef.msCancelFullScreen) mediaRef.msCancelFullScreen()
        },
    },
}
</script>
