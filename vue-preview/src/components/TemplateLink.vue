<template>
  <div class="template-container">
    <table class="styled-table">
      <tbody>
        <tr>
          <td>自定义模板路径:</td>
          <td>
            <input
              v-model="template_path"
              required
              @blur="handleFileChange"
              @keyup.enter="handleFileChange"
              class="input-field"
            />
          </td>
          <td>
            <button class="btn-select-path" @click="onSelectTempplatePath">
              选择路径
            </button>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd">
          <td colspan="2"></td>
        </tr>
        <tr>
          <td colspan="2">
            <span class="span-title">设置模板</span>
          </td>
        </tr>
        <tr>
          <td>当前excel路径:</td>
          <td>
            <input v-model="dir_path" disabled="true" class="input-field" />
          </td>
        </tr>
        <tr>
          <td>选中列:</td>
          <td v-if="select_col">
            <input v-model="select_col" disabled="true" class="input-field" />
          </td>

          <td v-if="!select_col">只能选中一列或者一格</td>
        </tr>
        <transition name="fade">
          <tr v-if="!!select_col">
            <td>模板列表:</td>
            <td>
              <div v-if="template_list.length > 0">
                <select
                  v-model="selected_template"
                  @change="onTemplateChange"
                  class="select-field"
                >
                  <option :value="null" disabled selected>请选择模板</option>
                  <option :value="null">无</option>
                  <option v-for="item in template_list" :value="item" :key="item">
                    {{ item }}
                  </option>
                </select>
              </div>
              <div v-else>
                <p class="no-template-message">该路径下没找到可用模板 ¿</p>
              </div>
            </td>
          </tr>
        </transition>
      </tbody>
    </table>
  </div>
</template>
<script>
import TL from "./js/templateLink.js";
import Util from "./js/util.js";
import ribbon from "./ribbon.js";

export default {
  name: "TemplateLink",
  data() {
    return {
      name: "TemplateLink",
      template_path: "",
      select_col: null,
      template_list: [],
      selected_template: null,
      dir_path: "",
    };
  },
  methods: {
    initAllTLScriptList() {
      let scriptMap = window.scriptMap;
      let list = [];
      for (let k in scriptMap) {
        list.push(k);
      }
      this.template_list = list;
    },

    initViewByData() {
      TL.workBookScriptImport();
      let fullName = window.Application.ThisWorkbook.FullName;
      this.dir_path = Util.getActiveSheetPath();
      let cfg = TL.GetTemplateLinkJson();
      let templateData = cfg[this.name] || {};
      let project_data = templateData[this.dir_path] || {};

      this.template_path = project_data.tpath || "";

      this.initSelectCol();
      this.initAllTLScriptList();

      let nowSelect = project_data[fullName] && project_data[fullName][this.select_col];
      if (nowSelect && this.template_list.indexOf(nowSelect) > -1) {
        this.selected_template = nowSelect;
      } else {
        this.selected_template = null;
      }
    },
    initSelectCol() {
      this.select_col =
        window.Application.Selection.Columns.Count == 1
          ? window.Application.Selection.Column
          : 0;
    },
    onTemplateChange(event) {
      let fullName = window.Application.ThisWorkbook.FullName;
      let cfg = TL.GetTemplateLinkJson();
      let templateData = cfg[this.name] || {};
      let project_data = templateData[this.dir_path] || {};
      let excel_data = project_data[fullName] || {};
      const value = event.target.value;
      if (value === null) {
        delete excel_data[this.select_col];
      } else {
        excel_data[this.select_col] = value;
      }
      project_data[fullName] = excel_data;
      templateData[this.dir_path] = project_data;
      cfg[this.name] = templateData;
      TL.SetTemplateLinkJson(cfg);
    },

    handleFileChange(event) {
      const value = event.target.value.replace(/\\/g, "/");
      let cfg = TL.GetTemplateLinkJson();
      let templateData = cfg[this.name] || {};
      let project_data = templateData[this.dir_path] || {};
      project_data.tpath = value;

      templateData[this.dir_path] = project_data;
      cfg[this.name] = templateData;

      TL.SetTemplateLinkJson(cfg);
      this.onRefreshTemplate();
    },
    onSelectTempplatePath() {
      let dirSelect = window.wps.FileDialog(4);
      dirSelect.AllowMultiSelect = false;
      if (dirSelect.Show()) {
        this.template_path = dirSelect.SelectedItems.Item(1).replace(/\\/g, "/");
        this.handleFileChange({ target: { value: this.template_path } });
      }
    },
    onRefreshTemplate() {
      console.log("刷新模板列表...");
      ribbon.TLRefreshScriptImport();
      this.initAllTLScriptList();
    },

    onSelectionChange() {},
    // initListener() {
    //   window.Application.ApiEvent.AddApiEventListener(
    //     "SheetSelectionChange",
    //     this.onSelectionChange
    //   );
    // },
    // removeListener() {
    //   window.Application.ApiEvent.RemoveApiEventListener(
    //     "SheetSelectionChange",
    //     this.onSelectionChange
    //   );
    // },
  },
  mounted() {
    this.initViewByData();
    // this.initListener();
  },
  beforeUnmount() {
    // this.removeListener();
  },
};
</script>
<style scoped>
.template-container {
  padding: 20px;
  max-width: 500px;
  margin: auto;
  font-family: Arial, sans-serif;
}

.styled-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.styled-table td {
  padding: 8px 12px;
  vertical-align: middle;
}

.input-field {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
}

.select-field {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 10px;
}

.btn-refresh {
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-refresh:hover {
  background-color: #0056b3;
}

.confirm-btn {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.confirm-btn:hover {
  background-color: #1e7e34;
}

.span-title {
  font-weight: bold;
  color: #333;
}

.center {
  text-align: center;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.btn-select-path {
  padding: 6px 12px;
  background-color: #007bff; /* 蓝色背景 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 8px;
}

.btn-select-path:hover {
  background-color: #0056b3; /* 深蓝色悬停效果 */
}
.select-field option:disabled {
  color: #999;
  font-style: italic;
}
</style>
