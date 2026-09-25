import React from 'react';
import { X, Book, Feather } from 'lucide-react';
import { JournalNote } from '../types/game';

interface JournalModalProps {
  notes: JournalNote[];
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ notes, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[85vh] w-full max-w-xl flex-col rounded-xl border border-amber-950/70 bg-[#140f1a] p-6 shadow-2xl text-[#f3ede4]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-950/40 pb-3">
          <div className="flex items-center gap-2">
            <Book className="text-amber-400" size={20} />
            <div>
              <h3 className="font-gothic text-lg font-bold text-amber-200">
                Diário de Memórias e Pistas
              </h3>
              <p className="font-vintage text-xs text-neutral-400">
                Anotações colhidas pelos cômodos da mansão.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notes list */}
        <div className="my-4 flex-1 space-y-4 overflow-y-auto pr-1">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg border border-amber-900/40 bg-[#1b1424] p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-gothic text-sm font-bold text-amber-300">
                  <Feather size={14} className="text-amber-500" />
                  <span>{note.title}</span>
                </div>
                <span className="font-vintage text-xs italic text-neutral-400">
                  {note.date}
                </span>
              </div>
              <p className="mt-2.5 font-vintage text-sm leading-relaxed text-neutral-200">
                {note.content}
              </p>
              <div className="mt-2 flex justify-end">
                <span className="font-vintage text-[11px] text-amber-500/70">
                  Local: {note.discoveredAt}
                </span>
              </div>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="py-12 text-center font-vintage text-sm italic text-neutral-500">
              Nenhuma anotação recolhida ainda.
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-lg bg-amber-900/60 py-2.5 font-gothic text-xs font-bold text-amber-100 hover:bg-amber-800 transition-colors shadow"
        >
          Fechar Diário
        </button>
      </div>
    </div>
  );
};
