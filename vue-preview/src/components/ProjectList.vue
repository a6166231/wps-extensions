<template>
  <div class="main" :class="{ 'blur-background': showCreateModal }">
    <button type="pCreate" @click="onBtnCreateProject">创建新项目配置</button>

    <ul>
      <li v-for="(project, index) in projectList" :key="index">
        <div @click="toggleDetails(index)">
          <span class="project-name">{{ project.name }}</span>
        </div>
        <div v-if="expandedIndex === index">
          <p>路径: {{ project.url }}</p>
          <p>宽: {{ project.view.width }}</p>
          <p>高: {{ project.view.height }}</p>
          <button class="btnDel" @click="deleteProject(index)">删除</button>
        </div>
      </li>
    </ul>
  </div>

  <div v-if="showCreateModal" class="modal" ref="modal">
    <h2>创建新的项目配置</h2>
    <table>
      <tbody>
        <tr>
          <td>项目名:</td>
          <td><input v-model="newProject.name" required /></td>
        </tr>
        <tr>
          <td>项目路径:</td>
          <td><input v-model="newProject.url" required /></td>
        </tr>
        <tr>
          <td>宽:</td>
          <td><input v-model="newProject.view.width" type="number" required /></td>
        </tr>
        <tr>
          <td>高:</td>
          <td><input v-model="newProject.view.height" type="number" required /></td>
        </tr>
        <tr>
          <td colspan="2">
            <button type="submit" @click="createProject">创建</button>
            <button type="cancle" @click="showCreateModal = false">取消</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { getLocalProjectCfgJson, SetLocalProjectTempCfg } from '../cfg.js';

export default {
  props: ['type'],
  name: 'ProjectList',
  data() {
    return {
      projectList: getLocalProjectCfgJson(),
      expandedIndex: null,
      showCreateModal: false,
      newProject: {
        name: '',
        url: '',
        view: {
          width: 1136,
          height: 640
        }
      }
    };
  },
  methods: {
    onBtnCreateProject(event) {
      event.stopPropagation()
      this.showCreateModal = true
    },
    toggleDetails(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    },
    deleteProject(index) {
      this.projectList.splice(index, 1);
      SetLocalProjectTempCfg(this.projectList);
      window.Application.ribbonUI.Invalidate()
    },
    createProject() {
      this.projectList.push({ ...this.newProject });
      SetLocalProjectTempCfg(this.projectList);
      window.Application.ribbonUI.Invalidate()
      this.showCreateModal = false;
      this.newProject = { name: '', url: '', view: { width: 1136, height: 640 } };

      this.newProject.name = this.newProject.url = ''
    },
    handleClickOutside(event) {
      if (!this.showCreateModal) return
      if (this.$refs.modal && !this.$refs.modal.contains(event.target)) {
        this.showCreateModal = false;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
}

.main {
  transition: filter 0.1s ease;
  /* Smooth transition for blur effect */
}

.blur-background {
  filter: blur(5px);
  /* Apply blur effect */
  pointer-events: none;
  /* Disable interactions with the blurred background */
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  /* Ensure modal is on top */
}

.project-name {
  font-weight: bold;
  color: blue;
  text-decoration: underline;
  margin-right: 10px;
}

.btnDel {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 5px;
}

.btnDel:hover {
  background-color: rgb(255, 60, 60);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

td {
  padding: 8px;
  border: 1px solid #ccc;
}

td:first-child {
  font-weight: bold;
  width: 30%;
}

input {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
}

button[type="pCreate"] {
  background-color: #53d1ff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease;
  font-size: large;
}

button[type="pCreate"]:hover {
  background-color: #7ddcff;
}

button[type="submit"] {
  background-color: #4CAF50;
  /* Green */
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #45a049;
  /* Darker green */
}

button[type="cancle"] {
  background-color: #f44336;
  /* Red */
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="cancle"]:hover {
  background-color: #d32f2f;
  /* Darker red */
}
</style>