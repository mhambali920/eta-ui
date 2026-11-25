import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DragAndDrop,
  Draggable,
  DragHandle,
  Droppable,
  DragOverlay,
  SortableList,
  SortableItem,
  moveBetweenContainers,
  type DragEndEvent,
} from './DragAndDrop';
import { Badge } from '../Badge';

const meta: Meta<typeof SortableList> = {
  title: 'Data Display/DragAndDrop',
  component: SortableList,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal', 'grid'],
      description: 'Layout axis of the sortable container',
    },
    variant: {
      control: 'select',
      options: ['surface', 'outline', 'soft'],
      description: 'Visual surface treatment for sortable items',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Item density matching eta-ui size scale',
    },
    showMoveButtons: {
      control: 'boolean',
      description: 'Render accessible single-pointer reorder buttons (WCAG 2.5.7)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all drag and reorder interactions',
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading skeleton state',
    },
  },
  args: {
    orientation: 'vertical',
    variant: 'surface',
    size: 'md',
    showMoveButtons: false,
    disabled: false,
    isLoading: false,
  },
};

export default meta;
type Story = StoryObj<typeof SortableList>;

interface ReleaseTask {
  id: string;
  title: string;
  tag: string;
}

const initialTasks: ReleaseTask[] = [
  { id: 'task-tokens', title: 'Audit WCAG AA contrast tokens across light and dark themes', tag: 'A11y' },
  { id: 'task-keyboard', title: 'Verify keyboard Space, Arrow, and Escape reorder flow', tag: 'Keyboard' },
  { id: 'task-bundle', title: 'Compile ESM and CJS bundles with TypeScript declarations', tag: 'Build' },
  { id: 'task-stories', title: 'Document multi-container Kanban and drop zone states', tag: 'Docs' },
];

function formatBooleanProp(name: string, value?: boolean): string {
  return value ? `\n    ${name}` : '';
}

export const Default: Story = {
  decorators: [
    (StoryFn) => (
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <StoryFn />
      </div>
    ),
  ],
  parameters: {
    docs: {
      source: {
        transform: (_code: string, ctx: { args: Record<string, unknown> }) => {
          const {
            orientation = 'vertical',
            variant = 'surface',
            size = 'md',
            showMoveButtons,
            disabled,
            isLoading,
          } = ctx.args;
          const extraFlags =
            formatBooleanProp('showMoveButtons', Boolean(showMoveButtons)) +
            formatBooleanProp('disabled', Boolean(disabled)) +
            formatBooleanProp('isLoading', Boolean(isLoading));

          return `const [tasks, setTasks] = useState([
  { id: 'task-tokens', title: 'Audit WCAG AA contrast tokens across light and dark themes', tag: 'A11y' },
  { id: 'task-keyboard', title: 'Verify keyboard Space, Arrow, and Escape reorder flow', tag: 'Keyboard' },
  { id: 'task-bundle', title: 'Compile ESM and CJS bundles with TypeScript declarations', tag: 'Build' },
  { id: 'task-stories', title: 'Document multi-container Kanban and drop zone states', tag: 'Docs' },
]);

return (
  <SortableList
    orientation="${String(orientation)}"
    variant="${String(variant)}"
    size="${String(size)}"${extraFlags}
    label="Release checklist"
    items={tasks}
    onItemsChange={setTasks}
  >
    {tasks.map((task) => (
      <SortableItem key={task.id} id={task.id} label={task.title} handle>
        <DragHandle />
        <span style={{ flex: 1, minWidth: 0 }}>{task.title}</span>
        <Badge variant="soft" color="primary" size="sm">
          {task.tag}
        </Badge>
      </SortableItem>
    ))}
  </SortableList>
);`;
        },
      },
    },
  },
  render: (args) => {
    const [tasks, setTasks] = useState<ReleaseTask[]>(initialTasks);

    return (
      <SortableList
        {...args}
        label="Release checklist"
        items={tasks}
        onItemsChange={(next) => setTasks(next)}
      >
        {tasks.map((task) => (
          <SortableItem key={task.id} id={task.id} label={task.title} handle>
            <DragHandle />
            <span style={{ flex: 1, minWidth: 0 }}>{task.title}</span>
            <Badge variant="soft" color="primary" size="sm">
              {task.tag}
            </Badge>
          </SortableItem>
        ))}
      </SortableList>
    );
  },
};

export const WithSinglePointerButtons: Story = {
  args: {
    showMoveButtons: true,
    variant: 'surface',
    size: 'md',
  },
  decorators: [
    (StoryFn) => (
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <StoryFn />
      </div>
    ),
  ],
  parameters: {
    docs: {
      source: {
        code: `const [steps, setSteps] = useState([
  { id: 'step-lint', title: 'Run static typecheck' },
  { id: 'step-unit', title: 'Execute Vitest component suite' },
  { id: 'step-pack', title: 'Generate dist package artifacts' },
]);

return (
  <SortableList
    label="CI pipeline stages"
    items={steps}
    onItemsChange={setSteps}
    showMoveButtons
  >
    {steps.map((step, index) => (
      <SortableItem key={step.id} id={step.id} label={step.title} handle>
        <DragHandle />
        <span style={{ fontWeight: 600 }}>{index + 1}.</span>
        <span style={{ flex: 1 }}>{step.title}</span>
      </SortableItem>
    ))}
  </SortableList>
);`,
      },
    },
  },
  render: (args) => {
    const [steps, setSteps] = useState([
      { id: 'step-lint', title: 'Run static typecheck' },
      { id: 'step-unit', title: 'Execute Vitest component suite' },
      { id: 'step-pack', title: 'Generate dist package artifacts' },
    ]);

    return (
      <SortableList
        {...args}
        label="CI pipeline stages"
        items={steps}
        onItemsChange={(next) => setSteps(next)}
      >
        {steps.map((step, index) => (
          <SortableItem key={step.id} id={step.id} label={step.title} handle>
            <DragHandle />
            <span style={{ fontWeight: 600, color: 'var(--eta-text-body)' }}>
              {index + 1}.
            </span>
            <span style={{ flex: 1 }}>{step.title}</span>
          </SortableItem>
        ))}
      </SortableList>
    );
  },
};

export const GridReorder: Story = {
  args: {
    orientation: 'grid',
    columns: 3,
    variant: 'surface',
    size: 'md',
  },
  decorators: [
    (StoryFn) => (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <StoryFn />
      </div>
    ),
  ],
  parameters: {
    docs: {
      source: {
        code: `const [widgets, setWidgets] = useState([
  { id: 'w-build', name: 'Build Queue', detail: 'Active runners' },
  { id: 'w-errors', name: 'Error Log', detail: 'Last 60 minutes' },
  { id: 'w-latency', name: 'API Latency', detail: 'p50 and p95' },
  { id: 'w-deploys', name: 'Deployments', detail: 'Recent releases' },
  { id: 'w-webhooks', name: 'Webhook Retries', detail: 'Pending delivery' },
  { id: 'w-storage', name: 'Artifact Cache', detail: 'Bucket usage' },
]);

return (
  <SortableList
    orientation="grid"
    columns={3}
    label="Pinned workspace panels"
    items={widgets}
    onItemsChange={setWidgets}
  >
    {widgets.map((widget) => (
      <SortableItem key={widget.id} id={widget.id} label={widget.name}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontWeight: 600 }}>{widget.name}</span>
          <span style={{ fontSize: '0.8125rem' }}>{widget.detail}</span>
        </div>
      </SortableItem>
    ))}
  </SortableList>
);`,
      },
    },
  },
  render: (args) => {
    const [widgets, setWidgets] = useState([
      { id: 'w-build', name: 'Build Queue', detail: 'Active runners' },
      { id: 'w-errors', name: 'Error Log', detail: 'Last 60 minutes' },
      { id: 'w-latency', name: 'API Latency', detail: 'p50 and p95' },
      { id: 'w-deploys', name: 'Deployments', detail: 'Recent releases' },
      { id: 'w-webhooks', name: 'Webhook Retries', detail: 'Pending delivery' },
      { id: 'w-storage', name: 'Artifact Cache', detail: 'Bucket usage' },
    ]);

    return (
      <SortableList
        {...args}
        label="Pinned workspace panels"
        items={widgets}
        onItemsChange={(next) => setWidgets(next)}
      >
        {widgets.map((widget) => (
          <SortableItem key={widget.id} id={widget.id} label={widget.name}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '4px 0' }}>
              <span style={{ fontWeight: 600, color: 'var(--eta-text-heading)' }}>
                {widget.name}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--eta-text-body)' }}>
                {widget.detail}
              </span>
            </div>
          </SortableItem>
        ))}
      </SortableList>
    );
  },
};

export const KanbanBoard: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [board, setBoard] = useState({
  backlog: [
    { id: 't-101', title: 'Add RTL layout mirror tests', scope: 'Core' },
    { id: 't-102', title: 'Support custom portal container', scope: 'Overlay' },
  ],
  inReview: [
    { id: 't-103', title: 'Keyboard focus return on dialog close', scope: 'A11y' },
  ],
  ready: [],
});

const handleDragEnd = ({ active, over }: DragEndEvent) => {
  if (!over || !active.containerId || !over.containerId || active.index === undefined) return;
  if (active.containerId !== over.containerId && over.index !== undefined) {
    setBoard((prev) =>
      moveBetweenContainers(
        prev,
        active.containerId,
        over.containerId,
        active.index,
        over.index
      )
    );
  }
};

return (
  <DragAndDrop onDragEnd={handleDragEnd}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))', gap: 16 }}>
      {(['backlog', 'inReview', 'ready'] as const).map((colId) => (
        <SortableList
          key={colId}
          id={colId}
          label={colId}
          items={board[colId]}
          emptyState="Drag a ticket into this column"
          onItemsChange={(next) => setBoard((prev) => ({ ...prev, [colId]: next }))}
        >
          {board[colId].map((ticket) => (
            <SortableItem key={ticket.id} id={ticket.id} label={ticket.title}>
              <span>{ticket.title}</span>
            </SortableItem>
          ))}
        </SortableList>
      ))}
    </div>
  </DragAndDrop>
);`,
      },
    },
  },
  render: () => {
    interface BoardTicket {
      id: string;
      title: string;
      scope: string;
    }

    const [board, setBoard] = useState<Record<string, BoardTicket[]>>({
      backlog: [
        { id: 't-101', title: 'Add RTL layout mirror tests', scope: 'Core' },
        { id: 't-102', title: 'Support custom portal container', scope: 'Overlay' },
      ],
      inReview: [
        { id: 't-103', title: 'Keyboard focus return on dialog close', scope: 'A11y' },
      ],
      ready: [],
    });

    const columnMeta: { id: string; title: string }[] = [
      { id: 'backlog', title: 'Backlog' },
      { id: 'inReview', title: 'In Review' },
      { id: 'ready', title: 'Ready to Ship' },
    ];

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
      if (!over || !active.containerId || !over.containerId || active.index === undefined) return;
      if (active.containerId !== over.containerId && over.index !== undefined) {
        setBoard((prev) =>
          moveBetweenContainers(
            prev,
            active.containerId as string,
            over.containerId as string,
            active.index as number,
            over.index as number
          )
        );
      }
    };

    return (
      <DragAndDrop onDragEnd={handleDragEnd}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            alignItems: 'start',
          }}
        >
          {columnMeta.map((col) => {
            const colItems = board[col.id] ?? [];
            return (
              <div
                key={col.id}
                style={{
                  padding: 12,
                  borderRadius: 'var(--eta-radius-lg)',
                  backgroundColor: 'var(--eta-bg-subtle)',
                  border: '1px solid var(--eta-border-default)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--eta-text-heading)',
                    }}
                  >
                    {col.title}
                  </h3>
                  <Badge variant="outline" color="secondary" size="sm">
                    {colItems.length}
                  </Badge>
                </div>

                <SortableList
                  id={col.id}
                  label={col.title}
                  items={colItems}
                  emptyState="Drag a ticket into this column"
                  onItemsChange={(next) =>
                    setBoard((prev) => ({
                      ...prev,
                      [col.id]: next,
                    }))
                  }
                >
                  {colItems.map((ticket) => (
                    <SortableItem key={ticket.id} id={ticket.id} label={ticket.title}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4,
                          width: '100%',
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>{ticket.title}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--eta-text-body)' }}>
                          {ticket.scope}
                        </span>
                      </div>
                    </SortableItem>
                  ))}
                </SortableList>
              </div>
            );
          })}
        </div>
      </DragAndDrop>
    );
  },
};

export const TypedDropZones: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [unassigned, setUnassigned] = useState([
  { id: 'a-1', name: 'API-Schema-v2.json', kind: 'spec' },
  { id: 'a-2', name: 'Tokens-Spec.json', kind: 'spec' },
  { id: 'a-3', name: 'Legacy-Icons.zip', kind: 'archive' },
]);
const [specBucket, setSpecBucket] = useState([]);
const [vaultBucket, setVaultBucket] = useState([]);

const handleDragEnd = ({ active, over }: DragEndEvent) => {
  if (!over) return;
  const found = unassigned.find((item) => item.id === active.id);
  if (!found) return;

  setUnassigned((prev) => prev.filter((item) => item.id !== found.id));
  if (over.id === 'spec-drop') setSpecBucket((prev) => [...prev, found]);
  if (over.id === 'vault-drop') setVaultBucket((prev) => [...prev, found]);
};

return (
  <DragAndDrop onDragEnd={handleDragEnd}>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {unassigned.map((asset) => (
        <Draggable key={asset.id} id={asset.id} type={asset.kind} label={asset.name} size="sm">
          <span>{asset.name}</span>
          <Badge variant="soft" size="sm">{asset.kind}</Badge>
        </Draggable>
      ))}
    </div>

    <Droppable id="spec-drop" accept="spec" label="JSON Spec Validator">
      {({ isOver, isRejected }) =>
        isRejected
          ? 'Archive files cannot be validated here.'
          : isOver
            ? 'Release to validate spec file.'
            : 'Drag a spec file here to queue validation.'
      }
    </Droppable>

    <Droppable id="vault-drop" accept={['spec', 'archive']} label="Backup Vault">
      Drag any file here to store a backup copy.
    </Droppable>

    <DragOverlay>{(active) => <div>Moving {active.label}</div>}</DragOverlay>
  </DragAndDrop>
);`,
      },
    },
  },
  render: () => {
    interface AssetItem {
      id: string;
      name: string;
      kind: 'spec' | 'archive';
    }

    const [unassigned, setUnassigned] = useState<AssetItem[]>([
      { id: 'a-1', name: 'API-Schema-v2.json', kind: 'spec' },
      { id: 'a-2', name: 'Tokens-Spec.json', kind: 'spec' },
      { id: 'a-3', name: 'Legacy-Icons.zip', kind: 'archive' },
    ]);
    const [specBucket, setSpecBucket] = useState<AssetItem[]>([]);
    const [vaultBucket, setVaultBucket] = useState<AssetItem[]>([]);

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
      if (!over) return;
      const found = unassigned.find((item) => item.id === active.id);
      if (!found) return;

      if (over.id === 'spec-drop') {
        setUnassigned((prev) => prev.filter((i) => i.id !== found.id));
        setSpecBucket((prev) => [...prev, found]);
      } else if (over.id === 'vault-drop') {
        setUnassigned((prev) => prev.filter((i) => i.id !== found.id));
        setVaultBucket((prev) => [...prev, found]);
      }
    };

    return (
      <DragAndDrop onDragEnd={handleDragEnd}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'grid', gap: 20 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {unassigned.length === 0 ? (
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--eta-text-body)' }}>
                All files assigned to target buckets.
              </p>
            ) : (
              unassigned.map((asset) => (
                <Draggable
                  key={asset.id}
                  id={asset.id}
                  type={asset.kind}
                  label={asset.name}
                  size="sm"
                >
                  <span>{asset.name}</span>
                  <Badge
                    variant="soft"
                    color={asset.kind === 'spec' ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    {asset.kind}
                  </Badge>
                </Draggable>
              ))
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            <Droppable id="spec-drop" accept="spec" label="JSON Spec Validator">
              {({ isOver, isRejected }) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <strong style={{ color: 'var(--eta-text-heading)', fontSize: '0.875rem' }}>
                    JSON Spec Validator (accepts spec only)
                  </strong>
                  <span style={{ fontSize: '0.8125rem' }}>
                    {isRejected
                      ? 'Archive files cannot be validated here.'
                      : isOver
                        ? 'Release to validate spec file.'
                        : specBucket.length === 0
                          ? 'Drag a spec file here to queue validation.'
                          : `${specBucket.map((f) => f.name).join(', ')}`}
                  </span>
                </div>
              )}
            </Droppable>

            <Droppable id="vault-drop" accept={['spec', 'archive']} label="Backup Vault">
              {({ isOver }) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <strong style={{ color: 'var(--eta-text-heading)', fontSize: '0.875rem' }}>
                    Backup Vault (accepts all types)
                  </strong>
                  <span style={{ fontSize: '0.8125rem' }}>
                    {isOver
                      ? 'Release to store in vault.'
                      : vaultBucket.length === 0
                        ? 'Drag any file here to store a backup copy.'
                        : `${vaultBucket.map((f) => f.name).join(', ')}`}
                  </span>
                </div>
              )}
            </Droppable>
          </div>
        </div>

        <DragOverlay>
          {(active) => (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--eta-radius-md)',
                backgroundColor: 'var(--eta-bg-surface)',
                color: 'var(--eta-text-heading)',
                border: '1.5px solid var(--eta-color-primary)',
                boxShadow: 'var(--eta-shadow-lg)',
                fontSize: '0.8125rem',
                fontWeight: 600,
              }}
            >
              Moving {active.label}
            </div>
          )}
        </DragOverlay>
      </DragAndDrop>
    );
  },
};

export const UIStates: Story = {
  parameters: {
    docs: {
      source: {
        code: `<>
  <SortableList
    items={[]}
    emptyState="No tasks queued yet. Create a task or drag one from another column."
  />

  <SortableList
    items={[]}
    isLoading
    loadingCount={2}
    loadingLabel="Syncing board order..."
  />

  <SortableList
    items={[]}
    error="Could not save the updated item order. Refresh the board and try again."
  />
</>`,
      },
    },
  },
  render: () => (
    <div
      style={{
        maxWidth: 680,
        margin: '0 auto',
        display: 'grid',
        gap: 20,
      }}
    >
      <div>
        <p style={{ margin: '0 0 8px', fontWeight: 600, color: 'var(--eta-text-heading)' }}>
          Empty State
        </p>
        <SortableList
          items={[]}
          emptyState="No tasks queued yet. Create a task or drag one from another column."
        />
      </div>

      <div>
        <p style={{ margin: '0 0 8px', fontWeight: 600, color: 'var(--eta-text-heading)' }}>
          Loading State
        </p>
        <SortableList items={[]} isLoading loadingCount={2} loadingLabel="Syncing board order..." />
      </div>

      <div>
        <p style={{ margin: '0 0 8px', fontWeight: 600, color: 'var(--eta-text-heading)' }}>
          Error State
        </p>
        <SortableList
          items={[]}
          error="Could not save the updated item order. Refresh the board and try again."
        />
      </div>
    </div>
  ),
};
