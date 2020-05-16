<template>
    <div id="app">
        <h1>Video Player example</h1>

        <div class="example-wrapper">
            <VideoPlayer
                src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                type="video/mp4"
                autoplay
            />
        </div>
    </div>
</template>

<script>
import VideoPlayer from './VideoPlayer.vue'

export default {
    name: 'App',
    components: { VideoPlayer },
}
</script>

<style lang="scss" scoped>

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
.example-wrapper {
	display: inline-block;
	margin: 0 auto;
}
</style>
