import { useEffect } from "react";
import type { Command } from "@/commands/types";
import { menus, type Menu, type MenuItem } from "@/data/menu";

const MENUS_NAME = "editor-menus";

const styles = {
  menubar: "flex w-full h-12 items-center gap-0.5 border-b border-border",
  menu: "group relative [&[open]>summary]:bg-muted",
  menuTrigger:
    "flex h-10 list-none items-center rounded-sm px-3 text-sm font-medium select-none outline-none hover:bg-muted [&::-webkit-details-marker]:hidden",
  menuContent:
    "absolute left-0 top-full z-50 mt-1 min-w-36 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10",
  menuItem:
    "relative flex w-full cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm select-none outline-none [&_svg]:size-4",
  menuItemHover:
    "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
  menuItemDestructive:
    "text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive",
  menuSeparator: "-mx-1 my-1 h-px bg-border",
  menuShortcut: "ml-auto text-xs tracking-widest text-muted-foreground",
} as const;

function closeMenu(element: Element | null) {
  const menu = element?.closest("details");
  if (menu instanceof HTMLDetailsElement) menu.open = false;
}

function CommandMenuItem({
  item,
  onCommandExecute,
}: {
  item: MenuItem;
  onCommandExecute: (command: Command<any>) => void;
}) {
  const Icon = item.command.icon;
  const className =
    item.variant === "destructive"
      ? `${styles.menuItem} ${styles.menuItemDestructive}`
      : `${styles.menuItem} ${styles.menuItemHover}`;

  return (
    <button
      type="button"
      className={className}
      onClick={(event) => {
        closeMenu(event.currentTarget);
        onCommandExecute(item.command);
      }}
    >
      <Icon />
      {item.command.label}
      {item.shortcut !== undefined ? (
        <span className={styles.menuShortcut}>{item.shortcut}</span>
      ) : null}
    </button>
  );
}

function CommandMenu({
  menu,
  onCommandExecute,
}: {
  menu: Menu;
  onCommandExecute: (command: Command<any>) => void;
}) {
  return (
    <details name={MENUS_NAME} className={styles.menu}>
      <summary className={styles.menuTrigger}>{menu.label}</summary>
      <div className={styles.menuContent}>
        {menu.items.map((entry, index) =>
          entry.type === "separator" ? (
            <div key={index} aria-hidden="true" className={styles.menuSeparator} />
          ) : (
            <CommandMenuItem
              key={entry.command.label}
              item={entry}
              onCommandExecute={onCommandExecute}
            />
          )
        )}
      </div>
    </details>
  );
}

export function Menubar({
  onCommandExecute,
}: {
  onCommandExecute: (command: Command<any>) => void;
}) {
  useEffect(() => {
    const selector = `details[name="${MENUS_NAME}"]`;
    const closeMenus = () => {
      document.querySelectorAll<HTMLDetailsElement>(`${selector}[open]`).forEach((menu) => {
        menu.open = false;
      });
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(selector)) return;
      closeMenus();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenus();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <nav className={styles.menubar} aria-label="Menus de edição">
      {menus.map((menu) => (
        <CommandMenu
          key={menu.label}
          menu={menu}
          onCommandExecute={onCommandExecute}
        />
      ))}
    </nav>
  );
}
