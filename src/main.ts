import { Menu, MenuItem, Plugin, TAbstractFile, TFolder } from "obsidian";

export default class SearchFromDirectoryPlugin extends Plugin {
  async onload() {
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu: Menu, fileOrFolder: TAbstractFile) => {
        if (fileOrFolder instanceof TFolder) {
          menu.addItem((item: MenuItem) => {
            item
              .setTitle("Search in folder")
              .setIcon("search")
              .onClick(() => {
                const folderPath = fileOrFolder.path;
                (this.app as any).internalPlugins
                  .getPluginById("global-search")
                  .instance.openGlobalSearch(`path:"${folderPath}"`);
              });
          });
        }
      })
    );
  }
}
