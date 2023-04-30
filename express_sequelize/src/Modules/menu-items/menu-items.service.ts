import MenuItem from "./entities/menu-item.entity";

interface IMenuItem {
  id: number;
  name: string;
  url: string;
  parentId: number | null;
  createdAt: Date;
  children?: IMenuItem[];
}
export class MenuItemsService {
  async getMenuItems() {
    const menus = await MenuItem.findAll({ raw: true });

    const buildMenu = (
      items: MenuItem[],
      parentId: number | null
    ): IMenuItem[] => {
      const menu = items.filter((item) => item.parentId === parentId);
      return menu.map((item) => {
        const children = buildMenu(items, item.id);
        if (children.length) {
          return { ...item, children };
        }
        return item;
      });
    };

    const menuItems = buildMenu(menus, null);

    return menuItems;
  }
}
