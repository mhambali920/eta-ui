import React, {
  createContext,
  forwardRef,
  useContext,
  useState,
  useCallback,
} from 'react';
import { cn } from '../../utils/cn';
import styles from './TreeView.module.css';

export interface TreeItemData {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: TreeItemData[];
  disabled?: boolean;
}

interface TreeViewContextValue {
  selectedId: string | null;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

const TreeViewContext = createContext<TreeViewContextValue | null>(null);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(styles.chevron, open && styles.chevronOpen)}
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const DefaultFolderIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.nodeIcon}
    aria-hidden="true"
  >
    {open ? (
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    ) : (
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    )}
  </svg>
);

const DefaultFileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.nodeIcon}
    aria-hidden="true"
  >
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
);

export interface TreeItemProps extends React.HTMLAttributes<HTMLLIElement> {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const TreeItem = forwardRef<HTMLLIElement, TreeItemProps>(
  ({ id, label, icon, disabled = false, children, className, ...props }, ref) => {
    const context = useContext(TreeViewContext);
    if (!context) {
      throw new Error('TreeItem must be used within a TreeView');
    }

    const hasChildren = Boolean(children);
    const isExpanded = context.expandedIds.has(id);
    const isSelected = context.selectedId === id;

    const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      if (hasChildren) {
        context.onToggleExpand(id);
      }
      context.onSelect(id);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.key === 'ArrowRight') {
        e.stopPropagation();
        if (hasChildren && !isExpanded) {
          context.onToggleExpand(id);
        }
      } else if (e.key === 'ArrowLeft') {
        e.stopPropagation();
        if (hasChildren && isExpanded) {
          context.onToggleExpand(id);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        if (hasChildren) {
          context.onToggleExpand(id);
        }
        context.onSelect(id);
      }
    };

    return (
      <li
        ref={ref}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        aria-disabled={disabled}
        className={cn(styles.item, className)}
        {...props}
      >
        <div
          role="none"
          tabIndex={disabled ? -1 : 0}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={cn(
            styles.node,
            isSelected && styles.selected,
            disabled && styles.disabled
          )}
        >
          {hasChildren ? (
            <span
              className={styles.toggle}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) context.onToggleExpand(id);
              }}
            >
              <ChevronIcon open={isExpanded} />
            </span>
          ) : (
            <span className={styles.toggleSpacer} />
          )}

          <span className={styles.iconSlot}>
            {icon ? (
              icon
            ) : hasChildren ? (
              <DefaultFolderIcon open={isExpanded} />
            ) : (
              <DefaultFileIcon />
            )}
          </span>

          <span className={styles.label}>{label}</span>
        </div>

        {hasChildren && isExpanded && (
          <ul role="group" className={styles.group}>
            {children}
          </ul>
        )}
      </li>
    );
  }
);
TreeItem.displayName = 'TreeItem';

export interface TreeViewProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  data?: TreeItemData[];
  defaultExpandedIds?: string[];
  expandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  selectedId?: string;
  defaultSelectedId?: string;
  onSelect?: (id: string) => void;
}

export const TreeView = forwardRef<HTMLUListElement, TreeViewProps>(
  (
    {
      data,
      defaultExpandedIds = [],
      expandedIds: controlledExpandedIds,
      onExpandedChange,
      selectedId: controlledSelectedId,
      defaultSelectedId = null,
      onSelect,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
      new Set(defaultExpandedIds)
    );
    const [internalSelected, setInternalSelected] = useState<string | null>(
      defaultSelectedId
    );

    const isExpandedControlled = controlledExpandedIds !== undefined;
    const isSelectedControlled = controlledSelectedId !== undefined;

    const currentExpanded = isExpandedControlled
      ? new Set(controlledExpandedIds)
      : internalExpanded;
    const currentSelected = isSelectedControlled
      ? controlledSelectedId
      : internalSelected;

    const handleToggleExpand = useCallback(
      (id: string) => {
        const next = new Set(currentExpanded);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }

        if (!isExpandedControlled) {
          setInternalExpanded(next);
        }
        onExpandedChange?.(Array.from(next));
      },
      [currentExpanded, isExpandedControlled, onExpandedChange]
    );

    const handleSelect = useCallback(
      (id: string) => {
        if (!isSelectedControlled) {
          setInternalSelected(id);
        }
        onSelect?.(id);
      },
      [isSelectedControlled, onSelect]
    );

    const renderDataItems = (items: TreeItemData[]): React.ReactNode => {
      return items.map((item) => (
        <TreeItem
          key={item.id}
          id={item.id}
          label={item.label}
          icon={item.icon}
          disabled={item.disabled}
        >
          {item.children && item.children.length > 0
            ? renderDataItems(item.children)
            : null}
        </TreeItem>
      ));
    };

    return (
      <TreeViewContext.Provider
        value={{
          selectedId: currentSelected,
          expandedIds: currentExpanded,
          onSelect: handleSelect,
          onToggleExpand: handleToggleExpand,
        }}
      >
        <ul
          ref={ref}
          role="tree"
          className={cn(styles.root, className)}
          {...props}
        >
          {data ? renderDataItems(data) : children}
        </ul>
      </TreeViewContext.Provider>
    );
  }
);
TreeView.displayName = 'TreeView';
