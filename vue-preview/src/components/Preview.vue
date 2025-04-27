<template>
    <div name="game-preview" ref="gameContainer" class="game-container">
        <div style="display: flex;height: 25px;margin-top: 0px;">
            <button @click="onRefreshView">刷新页面</button>
            <button @click="onSheetRefreshSelect">刷新选中行</button> <span>{{ refreshResult }}</span>
        </div>
        <div style="display: flex;height: 25px;margin-top: 10px;">
            <p>excel路径：</p>
            <input v-bind:disabled="!changePpathStatus" type="text" ref="pathInput" :value="selectedFolder"
                @blur="handleFileChange" @keyup.enter="handleFileChange">
            <button @click="onChangePPath">修改路径</button>
        </div>
        <iframe ref="previewIframe" :src="src" class="iframe_full" @load="onIframeLoad"></iframe>
    </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import preview from './js/preivew'
import ribbon from './ribbon';
import { SetLocalProjectTempCfg } from '../cfg.js';

let viewdata

export default {
    props: ['type'],
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Preview',
    data() {
        return {
            src: '',
            refreshResult: "",
            selectedFolder: this.getLocalPathStorage() || window.Application.FileSystem.absolutePath(window.Application.ThisWorkbook.FullName),
            changePpathStatus: false,
        }
    },
    methods: {
        loadIframe() {
            this.getLocalPathStorage()
            this.src = viewdata.url
            viewdata.iframe = this.$refs.previewIframe
            SetLocalProjectTempCfg();
            window['preview_frame'] = viewdata.iframe
        },
        getLocalPreviewTag() {
            return 'preview_tag_' + this.type
        },
        onChangePPath() {
            this.changePpathStatus = true
        },
        getLocalPathStorage() {
            return ribbon.GetLocalTempCfgJson()[this.getLocalPreviewTag()]
        },
        setLocalPathStorage() {
            let cfg = ribbon.GetLocalTempCfgJson()
            cfg[this.getLocalPreviewTag()] = this.selectedFolder
            ribbon.SetLocalTempCfg(cfg)
            viewdata.fpath = this.selectedFolder
            SetLocalProjectTempCfg();
            window.Application.PluginStorage.setItem("preview_tag_" + this.type, this.selectedFolder)
        },
        handleFileChange(event) {
            if (!this.changePpathStatus) return
            const value = event.target.value;
            if (value.length > 0) {
                this.selectedFolder = value
            } else {
                this.selectedFolder = window.Application.FileSystem.absolutePath(window.Application.ThisWorkbook.FullName)
            }
            this.setLocalPathStorage()
            this.changePpathStatus = false
        },
        onIframeLoad() {
            this.adjustIframeScale()
        },
        adjustIframeScale() {
            const iframe = this.$refs.previewIframe
            const container = this.$refs.gameContainer

            if (container && iframe) {
                let scale = Math.min(container.clientWidth / viewdata.view.width, container.clientHeight / (viewdata.view.height / 0.88))
                iframe.style.transform = `scale(${scale})`
            }
        },
        handleResize() {
            this.adjustIframeScale()
        },
        setCssVariables() {
            document.documentElement.style.setProperty('--viewwidth', `${viewdata.view.width*0.95}px`)
            document.documentElement.style.setProperty('--viewheight', `${viewdata.view.height*0.95}px`)
        },
        onSheetRefreshSelect() {
            this.refreshResult = '刷新中...'
            preview.onSheetRefreshSelect().then(() => {
                this.refreshResult = '刷新成功'
            }).catch((err) => {
                this.refreshResult = err
            })
        },
        handleKeyUp(val) {
            if(val.key === 'F5') {
                this.onRefreshView()
            }
        },
        onRefreshView() {
            window.location.reload()
        }
    },
    mounted() {
        viewdata = preview.getDataByIndex(this.type)
        viewdata.fpath = this.selectedFolder
        SetLocalProjectTempCfg();

        const iframeSrc = ref('')
        axios.get('/.debugTemp/NotifyDemoUrl').then((res) => {
            this.DemoSpan = res.data
        })
        window.addEventListener('resize', this.handleResize)
        window.addEventListener('keyup', this.handleKeyUp)

        this.setCssVariables()
        this.loadIframe()

        document.body.style.overflow = 'hidden'
        return {
            iframeSrc
        }
    },
    onBeforeUnmount() {
        window.removeEventListener('resize', this.handleResize)
        window.removeEventListener('keyup', this.handleKeyUp)
    }
}

</script>

<style scoped>
.game-container {
    position: absolute;
    width: 95%;
    height: 100vh;
    overflow: hidden;
}

.iframe_full {
    position: absolute;
    top: 65px;
    left: 0;
    width: var(--viewwidth);
    height: var(--viewheight);
    border: none;
    transform-origin: top left;
    transition: transform 0.3s ease;
}
</style>
