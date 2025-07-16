<template>
  <div id="previewDiv">
  </div>
</template>

<script>
import Util from "./js/util.js";

export default {
  name: "TemplateItemPreview",
  data() {
    return {
      data: {
        s: "",
      },
    };
  },
  methods: {
    initViewByData() {
      let sdata = window.Application.PluginStorage.getItem("template-link-key");
      if (!sdata) return;
      console.log(sdata);
      this.data = JSON.parse(sdata);

      this.previewDiv = document.getElementById("previewDiv");
      this.previewDiv.innerHTML = this.data.s.replaceAll('\n', '<br>');
    },
    onSelectionChange() {
      window.close();
      setTimeout(() => {
        Util.selectionItemDialogStatus = false;
        let selects = window.Application.Selection.Cells;
        if (selects.Count == 1 && selects.Text) {
          Util.ShowSelectionItemDialog();
        }
      }, 100);
    },
    initListener() {
      window.Application.ApiEvent.AddApiEventListener(
        "SheetSelectionChange",
        this.onSelectionChange
      );
    },
    removeListener() {
      window.Application.ApiEvent.RemoveApiEventListener(
        "SheetSelectionChange",
        this.onSelectionChange
      );
    },
  },
  mounted() {
    this.initViewByData();
    this.initListener();
  },
  beforeUnmount() {
    this.removeListener();
  },
};
</script>
<style scoped></style>
