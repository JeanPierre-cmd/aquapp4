import React from 'react';

export interface Session {
  id: string;
  name: string;
  urn: string | null;
  date: string; // ISO string
  status: 'pending' | 'processing' | 'ready' | 'error';
}

interface Props {
  sessions: Session[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusColor: Record<Session['status'], string> = {
  pending: 'text-warning',
  processing: 'text-warning',
  ready: 'text-success',
  error: 'text-error'
};

const SessionsTable: React.FC<Props> = ({
  sessions,
  onOpen,
  onDelete
}) => {
  if (!sessions.length) {
    return (
      <p className="text-textSecondary">No hay sesiones guardadas.</p>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border text-textSecondary">
          <tr>
            <th className="px-2 py-1 text-left">Fecha</th>
            <th className="px-2 py-1 text-left">Nombre</th>
            <th className="px-2 py-1 text-left">URN</th>
            <th className="px-2 py-1 text-left">Estado</th>
            <th className="px-2 py-1"></th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} className="border-b border-border">
              <td className="px-2 py-1">
                {new Date(s.date).toLocaleString()}
              </td>
              <td className="px-2 py-1">{s.name}</td>
              <td className="px-2 py-1">
                <code className="break-all">
                  {s.urn ?? '—'}
                </code>
              </td>
              <td
                className={`px-2 py-1 ${statusColor[s.status]}`}
              >
                {s.status}
              </td>
              <td className="px-2 py-1 space-x-2 text-right">
                <button
                  className="text-primary hover:underline"
                  onClick={() => onOpen(s.id)}
                  disabled={!s.urn}
                >
                  Abrir
                </button>
                <button
                  className="text-error hover:underline"
                  onClick={() => onDelete(s.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionsTable;
