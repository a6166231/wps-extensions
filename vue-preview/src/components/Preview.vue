<template>
    <div name="game" ref="gameContainer" class="game-container">
        <div>
            <button @click="onSheetRefreshSelect">刷新选中行</button> <span>{{ refreshResult }}</span>
        </div>
        <div>
            <button @click="onRefreshView">刷新页面</button>
            <span>{{ type }}</span>
        </div>
        <iframe ref="previewIframe" :src="src" class="iframe_full" @load="onIframeLoad"></iframe>
    </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import preview from './js/preivew'

let viewdata

export default {
    props: ['type'],
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Preview',
    data() {
        return {
            src: '',
            refreshResult: "",
        }
    },
    methods: {
        loadIframe() {
            this.src = viewdata.url
            viewdata.iframe = this.$refs.previewIframe
        },
        onIframeLoad() {
            this.adjustIframeScale()
        },
        adjustIframeScale() {
            const iframe = this.$refs.previewIframe
            const container = this.$refs.gameContainer

            if (container && iframe) {
                let scale = Math.min(container.clientWidth / viewdata.view.width, container.clientHeight / viewdata.view.height)
                iframe.style.transform = `scale(${scale})`
            }
        },
        handleResize() {
            this.adjustIframeScale()
        },
        setCssVariables() {
            document.documentElement.style.setProperty('--viewwidth', `${viewdata.view.width}px`)
            document.documentElement.style.setProperty('--viewheight', `${viewdata.view.height}px`)
        },
        onSheetRefreshSelect() {
            this.refreshResult = '刷新中...'
            preview.onSheetRefreshSelect().then(() => {
                this.refreshResult = '刷新成功'
            }).catch(() => {
                this.refreshResult = '刷新失败'
            })
        },
        onRefreshView() {
            window.location.reload()
        }
    },
    mounted() {
        viewdata = preview.getDataByIndex(this.type)

        const iframeSrc = ref('')
        axios.get('/.debugTemp/NotifyDemoUrl').then((res) => {
            this.DemoSpan = res.data
        })
        window.addEventListener('resize', this.handleResize)

        this.setCssVariables()
        this.loadIframe()
        return {
            iframeSrc
        }
    },
    onBeforeUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }
}

</script>

<style scoped>
.game-container {
    position: relative;
    width: 100%;
    height: 95vh;
    overflow: hidden;
}

.iframe_full {
    position: absolute;
    top: 50px;
    left: 0;
    width: var(--viewwidth);
    height: var(--viewheight);
    border: none;
    transform-origin: top left;
    transition: transform 0.3s ease;
}
</style>
