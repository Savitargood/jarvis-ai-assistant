import { ActivityIcon, BellIcon, TaskIcon } from './icons';

const MODULES = [
  {
    id: 'uptime',
    label: 'Uptime',
    value: '99,98%',
    note: 'últimos 30 dias',
    icon: <ActivityIcon />,
    bars: [42, 58, 35, 70, 48, 62, 55, 78, 60, 72],
  },
  {
    id: 'tasks',
    label: 'Tarefas ativas',
    value: '02',
    note: 'compilando relatório',
    icon: <TaskIcon />,
    bars: [30, 45, 60, 40, 75, 50, 65, 38, 55, 48],
  },
  {
    id: 'alerts',
    label: 'Notificações',
    value: '03',
    note: '2 novas',
    icon: <BellIcon />,
    bars: [55, 35, 50, 62, 40, 58, 44, 68, 52, 60],
  },
];

export default function TelemetryRail() {
  return (
    <aside className="telemetry" aria-label="Telemetria do sistema">
      {MODULES.map((module) => (
        <article key={module.id} className="telemetry-card">
          <header className="telemetry-head">
            <span className="telemetry-icon">{module.icon}</span>
            <span className="telemetry-label">{module.label}</span>
          </header>
          <p className="telemetry-value">{module.value}</p>
          <div className="telemetry-bars" aria-hidden="true">
            {module.bars.map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <p className="telemetry-note">{module.note}</p>
        </article>
      ))}
    </aside>
  );
}
