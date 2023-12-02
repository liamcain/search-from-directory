import {
  Editor,
  Menu,
  MenuItem,
  Plugin,
  TFolder,
} from "obsidian";

export default class SearchFromDirectoryPlugin extends Plugin {
  async onload() {
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu: Menu, folder: TFolder) => {
        if (!(folder instanceof TFolder)) return;
        menu.addItem((item: MenuItem) => {
          item
            .setTitle("Search in folder")
            .setIcon("search")
            .onClick(() => {
              this.searchDir(folder);
            });
        });
      })
    );

    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu: Menu, editor: Editor) => {
        menu.addItem((item) => {
          item
            .setTitle("search in parent directory")
            .setIcon("search")
            .onClick((evt) => {
              const selection = editor.getSelection();
              this.searchDir(null, selection, true);
            });
        });
      })
    );
  }

  searchDir(folder: TFolder | null, selection = "", select = false) {
    let prefix;
    const { workspace } = this.app

    if (folder) {
      const folderPath = folder.path;
      prefix = `path:"${folderPath}" `;
    } else {
      const filePath = workspace.getActiveFile()?.path;
      const folderPath = filePath?.split("/").slice(0, -1).join("/");
      if (folderPath !== filePath) {
        prefix = `path:"${folderPath}" `;
      } else {
        prefix = "";//root
      }
    }
    (this.app as any).internalPlugins
      .getPluginById("global-search")
      .instance.openGlobalSearch(prefix + selection);

    // ensure text has been entered into the search input
    const searchLeaf = workspace.getLeavesOfType('search')[0];
    workspace.revealLeaf(searchLeaf)

    const searchInput = document.querySelector(
      ".search-input-container input"
    ) as HTMLInputElement;
    if (select) {
      this.selectInput(
        searchInput,
        prefix.length,
        searchInput.value.length
      );

    } else {
      this.selectInput(
        searchInput,
        prefix.length,
        prefix.length
      );
    }
  }

  selectInput(searchInput: HTMLInputElement, start: number, end: number) {
    setTimeout(() => {
      searchInput.setSelectionRange(start, end);
    },250);
  }
}
